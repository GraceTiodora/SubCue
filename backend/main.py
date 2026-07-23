import os
import json
import re
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from dotenv import load_dotenv
from openai import OpenAI

from database import engine, Base, get_db
import models

import models
import sqlite3

# Auto-migrate SQLite to add user_id if missing (for Production/Render)
try:
    conn = sqlite3.connect('./subwise.db')
    cursor = conn.cursor()
    # Check if user_id exists
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

load_dotenv(override=True)

app = FastAPI(title="SubCue AI API")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "dummy_key")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if GROQ_API_KEY:
    print(f"DEBUG: Using GROQ API Key starting with: {GROQ_API_KEY[:10]}...")
    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=GROQ_API_KEY,
    )
    AI_MODEL = "llama-3.3-70b-versatile" # Model terbaru dari Groq
else:
    print(f"DEBUG: Using OpenRouter API Key starting with: {OPENROUTER_API_KEY[:10]}...")
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY,
    )
    AI_MODEL = "openrouter/free"

@app.get("/")
def read_root():
    return {"message": "Welcome to SubCue AI API"}

@app.post("/subscriptions/", response_model=models.Subscription)
def create_subscription(
    sub: models.SubscriptionCreate, 
    db: Session = Depends(get_db),
    x_user_id: str = Header("default")
):
    db_sub = models.SubscriptionDB(**sub.dict(), user_id=x_user_id)
    db.add(db_sub)
    db.commit()
    db.refresh(db_sub)
    return db_sub

@app.get("/subscriptions/", response_model=List[models.Subscription])
def read_subscriptions(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    x_user_id: str = Header("default")
):
    subs = db.query(models.SubscriptionDB).filter(models.SubscriptionDB.user_id == x_user_id).offset(skip).limit(limit).all()
    return subs

@app.delete("/subscriptions/{sub_id}")
def delete_subscription(
    sub_id: int, 
    db: Session = Depends(get_db),
    x_user_id: str = Header("default")
):
    db_sub = db.query(models.SubscriptionDB).filter(
        models.SubscriptionDB.id == sub_id,
        models.SubscriptionDB.user_id == x_user_id
    ).first()
    if not db_sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    db.delete(db_sub)
    db.commit()
    return {"message": "Subscription deleted successfully"}

@app.delete("/api/reset")
def reset_database(
    db: Session = Depends(get_db),
    x_user_id: str = Header("default")
):
    db.query(models.SubscriptionDB).filter(models.SubscriptionDB.user_id == x_user_id).delete()
    db.commit()
    return {"message": "Database resetted successfully"}

@app.get("/api/health-score")
def get_health_score(
    db: Session = Depends(get_db),
    x_user_id: str = Header("default")
):
    subs = db.query(models.SubscriptionDB).filter(models.SubscriptionDB.user_id == x_user_id).all()
    
    if not subs:
        return {
            "score": 100,
            "status": "No Data",
            "monthly_spending": 0,
            "potential_saving": 0,
            "recommendations": ["Tambahkan langganan Anda untuk mendapatkan analisis pengeluaran AI."]
        }

    total_monthly = sum(s.cost for s in subs if s.billing_cycle == 'monthly') + sum(s.cost/12 for s in subs if s.billing_cycle == 'yearly')
    
    # Deterministic Score Calculation
    weighted_score = 0
    if total_monthly > 0:
        for s in subs:
            monthly_cost = s.cost if s.billing_cycle == 'monthly' else s.cost / 12
            score_factor = 100 if s.usage_level == 'high' else (70 if s.usage_level == 'medium' else 30)
            weighted_score += (monthly_cost / total_monthly) * score_factor
    calculated_score = int(weighted_score) if total_monthly > 0 else 100

    subs_data = [{"name": s.name, "cost": s.cost, "cycle": s.billing_cycle, "usage": s.usage_level} for s in subs]
    
    prompt = f"""
    Anda adalah SubCue AI, konsultan keuangan cerdas.
    Analisis daftar langganan pengguna berikut:
    {json.dumps(subs_data)}
    
    Total pengeluaran bulanan pengguna: Rp {total_monthly}.
    Berdasarkan perhitungan matematis, skor efisiensi pengguna ini adalah {calculated_score}/100.
    
    Berikan respons JSON dengan keys berikut (tanpa blok markdown):
    - "status": string singkat seperti "Sangat Sehat", "Cukup Sehat", "Perlu Review", atau "Kritis".
    - "potential_saving": perkiraan angka (integer, cth: 150000) berapa banyak uang yang bisa dihemat jika langganan yang jarang dipakai dibatalkan. Jika tidak ada, isi 0.
    - "recommendations": array berisi 3-4 kalimat rekomendasi spesifik dalam bahasa Indonesia untuk membatalkan, mempertahankan, atau menyesuaikan langganan tertentu.
    """
    
    try:
        completion = client.chat.completions.create(
            model=AI_MODEL,
            response_format={"type": "json_object"}, # Memaksa output JSON untuk Groq/OpenAI
            messages=[{"role": "user", "content": prompt}]
        )
        
        result_text = completion.choices[0].message.content.strip()
        
        # Ekstrak JSON menggunakan regex untuk berjaga-jaga jika AI memberi teks tambahan
        json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
        if json_match:
            result_text = json_match.group(0)
            
        data = json.loads(result_text)
        data["score"] = calculated_score
        data["monthly_spending"] = total_monthly
        return data
    except Exception as e:
        # Fallback if AI fails
        print("AI Error:", str(e))
        return {
            "score": calculated_score,
            "status": "AI Sibuk/Limit",
            "monthly_spending": total_monthly,
            "potential_saving": 0,
            "recommendations": ["Server AI (Groq) sedang sibuk. Namun, skor Anda berhasil dihitung di lokal secara akurat."]
        }

@app.post("/api/chat")
def chat_with_ai(
    query: dict, 
    db: Session = Depends(get_db),
    x_user_id: str = Header("default")
):
    user_message = query.get("message")
    subs = db.query(models.SubscriptionDB).filter(models.SubscriptionDB.user_id == x_user_id).all()
    subs_data = [{"name": s.name, "cost": s.cost, "usage": s.usage_level} for s in subs]
    
    system_prompt = f"""Anda adalah SubCue AI, asisten keuangan pintar. 
    Pengguna memiliki langganan berikut: {json.dumps(subs_data)}.
    Jawablah selalu dalam Bahasa Indonesia dengan ramah, singkat, dan fokus pada penghematan uang."""
    
    try:
        completion = client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        return {"reply": completion.choices[0].message.content}
    except Exception as e:
        print("Chat AI Error:", str(e))
        return {"reply": f"Maaf, saya tidak dapat merespons saat ini. Error internal: {str(e)}"}
