# AI BI Analyst

AI BI Analyst is an intelligent business analytics system that enables users to interact with databases using natural language instead of writing complex SQL queries manually. The system acts as an AI-powered business intelligence assistant capable of understanding user questions, generating optimized SQL queries, retrieving relevant data, creating visualizations, and producing automated analytical insights.

The project aims to simplify data analysis for non-technical users by combining Large Language Models (LLMs), natural language processing, database systems, and interactive dashboards into a unified platform. Users can ask business-related questions such as:

- “Which products generated the highest revenue this quarter?”
- “Why did sales decrease last month?”
- “Show top-performing regions by profit.”

The system converts these queries into executable SQL statements, fetches data from a relational database, and presents the results through tables, charts, and AI-generated summaries. Additionally, the application explains generated SQL queries in simple language, making data analytics more accessible and transparent.

The backend is developed using Python and FastAPI, while the frontend is built using React and Tailwind CSS for an interactive user experience. Open-source Large Language Models such as Llama 3 or Mistral are integrated using Ollama or Groq API to ensure low-cost and scalable AI functionality. PostgreSQL is used as the primary database for structured data storage and querying.

The project demonstrates the integration of artificial intelligence, business intelligence, database management, data visualization, and full-stack development to create a practical, real-world analytics solution. It is designed to reduce dependency on technical analysts and enable faster, data-driven decision-making for businesses.

---

## System Architecture

![System Architecture](screenshots/flowchart-fun.png)

---

## Project Structure

```text
ai-bi-analyst/
├── backend/
│   ├── main.py            # FastAPI application (Dual-LLM logic, DB connection)
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Database URL & Groq API credentials
└── frontend/
    ├── index.html         # Vite entry point
    ├── tailwind.config.js # Everforest UI theme configuration
    ├── src/
    │   ├── api.js         # Axios integration to FastAPI
    │   ├── App.jsx        # Main UI Layout & Search Bar
    │   ├── index.css      # Tailwind & Custom CSS (Glassmorphism classes)
    │   └── components/
    │       ├── DataTable.jsx # Dynamically rendering HTML table
    │       └── DataChart.jsx # Dynamically rendering Recharts visual
    └── package.json       # React dependencies
```


---

## How to Run Locally

### 1. Start the Backend
Navigate to the `backend` directory, install the Python dependencies, and run the FastAPI server:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
uvicorn main:app --reload
```
*The backend runs on `http://localhost:8000`.*

### 2. Start the Frontend
Navigate to the `frontend` directory, install the Node modules, and start the Vite development server:
```powershell
cd frontend
npm install
npm run dev
```
*The frontend runs on `http://localhost:5173`.*

---

## How to Add Your Own Data

Because the AI BI Analyst is **Dataset-Agnostic**, it dynamically reads the schema of whatever database you point it to. You do not need to change any Python or React code to query new data!

1. **Load Data into Postgres**
   Create a new table in your PostgreSQL database (e.g., using pgAdmin, `psql`, or a Python script using pandas `.to_sql()`). You can import any CSV you want (like Sales data, HR records, or any other datasets).
   
2. **Update your `.env` (If needed)**
   Ensure your `backend/.env` file points to the correct database:
   ```text
   DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/your_database
   GROQ_API_KEY=gsk_your_groq_api_key
   ```

3. **Ask Away!**
   Go to the UI and ask a question explicitly naming your table or its contents. For example: *"In the HR table, what is the average salary by department?"* The backend will fetch your new columns, generate the SQL, and display the new charts instantly!

---
## Screenshots of the Application

![Screenshot 1](screenshots/Snapshot.png)
![Screenshot 2](screenshots/Snapshot(1).png)


---

## Tech Stack
* **Frontend:** React, Vite, Tailwind CSS (v3), Recharts, Lucide-React
* **Backend:** Python, FastAPI, SQLAlchemy, Pydantic
* **Database:** PostgreSQL
* **AI Provider:** Groq (Llama 3.3 70B Versatile)
