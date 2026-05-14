import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, text, inspect
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env file
load_dotenv()

# Get configurations from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize FastAPI app
app = FastAPI(title="AI BI Analyst API")

# Add CORS middleware to allow requests from the React frontend (Phase 4)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to the database
if DATABASE_URL:
    engine = create_engine(DATABASE_URL)
else:
    engine = None
    print("Warning: DATABASE_URL not set in environment variables.")

# Initialize Groq client
if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)
else:
    groq_client = None
    print("Warning: GROQ_API_KEY not set in environment variables.")

# Define the data model for the incoming request
class QueryRequest(BaseModel):
    question: str

def get_database_schema(engine):
    """Dynamically fetches the database schema as a string."""
    if not engine:
        return "No database connected."
    try:
        inspector = inspect(engine)
        schema_info = ""
        for table_name in inspector.get_table_names():
            schema_info += f"Table '{table_name}':\n"
            for column in inspector.get_columns(table_name):
                schema_info += f"  - {column['name']} ({column['type']})\n"
            schema_info += "\n"
        return schema_info
    except Exception as e:
        print(f"Error fetching schema: {e}")
        return "Could not fetch schema."

@app.get("/")
def read_root():
    return {"message": "AI BI Analyst Backend is running!"}

@app.get("/api/test-db")
def test_db_connection():
    """
    Test endpoint to verify database connection and fetch dummy data.
    """
    if not engine:
        raise HTTPException(status_code=500, detail="Database URL not configured.")
    
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT * FROM sales LIMIT 5;"))
            
            rows = []
            for row in result:
                rows.append({
                    "id": row.id,
                    "product_name": row.product_name,
                    "category": row.category,
                    "quantity_sold": row.quantity_sold,
                    "price_per_unit": float(row.price_per_unit),
                    "sale_date": str(row.sale_date)
                })
            
            return {"status": "success", "data": rows}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.post("/api/ask")
def ask_question(request: QueryRequest):
    """
    Phase 3: The AI Endpoint.
    Takes a natural language question, generates a SQL query using Groq,
    safely executes it, and returns the data.
    """
    if not engine:
        raise HTTPException(status_code=500, detail="Database URL not configured.")
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq API key not configured.")

    # 1. System Prompt for the AI
    # We dynamically fetch the schema so it works with ANY dataset
    schema_info = get_database_schema(engine)
    
    system_prompt = f"""
    You are an expert PostgreSQL data analyst.
    Your job is to translate user questions into a valid PostgreSQL SELECT query.
    
    Here is the schema for the database:
    {schema_info}
    
    Rules:
    1. Only return the raw SQL query. Do NOT include markdown formatting like ```sql
    2. Do NOT include any explanations or conversational text.
    3. You must ONLY write SELECT queries. NEVER write INSERT, UPDATE, DELETE, or DROP.
    4. For string comparisons, always use ILIKE instead of '=' to ensure case insensitivity.
    5. IMPORTANT: ALWAYS wrap all table names and column names in double quotes (e.g., "Walmart", "City") to prevent case-sensitivity errors in PostgreSQL.
    6. When asked to group or aggregate by specific time periods (like "hour", "month", "day"), use PostgreSQL functions like EXTRACT() or date_part(). If the column is a string/VARCHAR, cast it first (e.g., EXTRACT(HOUR FROM "time"::time)).
    7. To prevent division by zero errors (especially in growth calculations or percentages), ALWAYS use NULLIF(denominator, 0) when dividing.
    8. IMPORTANT: If asked to find the "highest", "lowest", "average", or any aggregated metric for a group, ALWAYS include that aggregated metric in the SELECT clause along with the grouping column. Do not just return the name of the group.
    """

    # 2. Call Groq API to get the SQL query
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.question}
            ],
            model="llama-3.3-70b-versatile", # Using a fast model for text-to-SQL
            temperature=0, # We want precise, deterministic SQL output
        )
        
        # Extract the SQL from the response and clean up any whitespace or hidden markdown
        generated_sql = chat_completion.choices[0].message.content.strip()
        
        # Sometimes models ignore instructions and add markdown anyway. We clean it:
        if generated_sql.startswith("```sql"):
            generated_sql = generated_sql.replace("```sql", "").replace("```", "").strip()
        elif generated_sql.startswith("```"):
            generated_sql = generated_sql.replace("```", "").strip()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate SQL with Groq: {str(e)}")

    # 3. Security First: Prevent Destructive SQL
    # A basic guardrail to ensure only SELECT queries are run.
    if not generated_sql.upper().startswith("SELECT"):
        raise HTTPException(
            status_code=400, 
            detail="Unsafe query detected. Only SELECT queries are allowed."
        )

    # 4. Execute the SQL safely
    try:
        with engine.connect() as connection:
            # Execute the generated query
            result = connection.execute(text(generated_sql))
            
            # Fetch column names
            columns = list(result.keys())
            
            # Fetch all rows and map them
            data = []
            for row in result:
                row_dict = {}
                for col in columns:
                    val = getattr(row, col)
                    # Convert non-serializable objects (like dates/decimals) to strings/floats
                    if val is not None:
                        if hasattr(val, "isoformat"):
                            val = val.isoformat()
                        elif isinstance(val, float) or hasattr(val, "to_eng_string"):
                            val = float(val)
                    row_dict[col] = val
                data.append(row_dict)

            # 5. Generate Natural Language Insight
            insight = None
            try:
                insight_prompt = f"""
                You are a helpful business analyst.
                The user asked: "{request.question}"
                The database returned this data: {data}
                
                Provide a brief, 1-2 sentence insight summarizing this data for the user.
                Be conversational, groovy, and helpful. Do NOT mention SQL or the database.
                """
                
                insight_completion = groq_client.chat.completions.create(
                    messages=[{"role": "user", "content": insight_prompt}],
                    model="llama-3.3-70b-versatile",
                    temperature=0.7,
                )
                insight = insight_completion.choices[0].message.content.strip()
            except Exception as e:
                # If insight generation fails, we still want to return the data
                print(f"Failed to generate insight: {e}")
                insight = "Here is the data you requested!"

            return {
                "status": "success",
                "question": request.question,
                "generated_sql": generated_sql,
                "data": data,
                "insight": insight
            }

    except Exception as e:
        # If the generated SQL was invalid, we catch it here
        raise HTTPException(status_code=500, detail=f"Database execution error: {str(e)}")
