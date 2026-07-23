import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import subscriptions, ai

# Auto-migrate SQLite to add user_id if missing (for Production/Render)
try:
    conn = sqlite3.connect('./subwise.db')
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(subscriptions)")
    columns = [info[1] for info in cursor.fetchall()]
    if "user_id" not in columns:
        print("DEBUG: Migrating database to include user_id column...")
        cursor.execute("ALTER TABLE subscriptions ADD COLUMN user_id VARCHAR DEFAULT 'default'")
        conn.commit()
    conn.close()
except Exception as e:
    print("Database migration error:", e)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SubCue AI API")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to SubCue AI API"}

# Include Routers
app.include_router(subscriptions.router)
app.include_router(ai.router)
