# AI BI Analyst

Welcome to the **AI BI Analyst**! This project is a cutting-edge, dataset-agnostic Business Intelligence tool built with a modern "Gen-Z startup" aesthetic (inspired by the beautiful *Everforest* color palette). 

Instead of writing complex SQL queries, users can simply ask business questions in plain English. The app translates the question to PostgreSQL, safely executes it, and visually displays the data alongside a conversational AI-generated insight.

---

## System Architecture

![System Architecture](.\screenshots\flowchart-fun.png)

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

*(Note: If you see any scratch folders or old CSV files locally, they are not strictly part of the core app's architecture!)*

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
   Create a new table in your PostgreSQL database (e.g., using pgAdmin, `psql`, or a Python script using pandas `.to_sql()`). You can import any CSV you want (like Sales data, HR records, or Walmart retail datasets).
   
2. **Update your `.env` (If needed)**
   Ensure your `backend/.env` file points to the correct database:
   ```text
   DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/your_database
   GROQ_API_KEY=gsk_your_groq_api_key
   ```

3. **Ask Away!**
   Go to the UI and ask a question explicitly naming your table or its contents. For example: *"In the HR table, what is the average salary by department?"* The backend will fetch your new columns, generate the SQL, and display the new charts instantly!

---

## Tech Stack
* **Frontend:** React, Vite, Tailwind CSS (v3), Recharts, Lucide-React
* **Backend:** Python, FastAPI, SQLAlchemy, Pydantic
* **Database:** PostgreSQL
* **AI Provider:** Groq (Llama 3.3 70B Versatile)
