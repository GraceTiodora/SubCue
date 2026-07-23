import os
import json
import re
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from dotenv import load_dotenv
from openai import OpenAI

from database import engine, Base, get_db
import models

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
def create_subscription(sub: models.SubscriptionCreate, db: Session = Depends(get_db)):
    db_sub = models.SubscriptionDB(**sub.dict())
    db.add(db_sub)
    db.commit()
    db.refresh(db_sub)
    return db_sub

@app.get("/subscriptions/", response_model=List[models.Subscription])
def read_subscriptions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    subs = db.query(models.SubscriptionDB).offset(skip).limit(limit).all()
    return subs

@app.delete("/subscriptions/{sub_id}")
def delete_subscription(sub_id: int, db: Session = Depends(get_db)):
    db_sub = db.query(models.SubscriptionDB).filter(models.SubscriptionDB.id == sub_id).first()
    if not db_sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    db.delete(db_sub)
    db.commit()
    return {"message": "Subscription deleted successfully"}

@app.get("/api/health-score")
def get_health_score(db: Session = Depends(get_db)):
    subs = db.query(models.SubscriptionDB).all()
    
    if not subs:
        return {
            "score": 100,
            "status": "No Data",
            "monthly_spending": 0,
            "potential_saving": 0,
            "recommendations": ["Add your subscriptions to get an AI health score."]
        }

    total_monthly = sum(s.cost for s in subs if s.billing_cycle == 'monthly') + sum(s.cost/12 for s in subs if s.billing_cycle == 'yearly')
    
    # Format data for AI
    subs_data = [{"name": s.name, "cost": s.cost, "cycle": s.billing_cycle, "usage": s.usage_level} for s in subs]
    
    prompt = f"""
    You are SubCue AI, an expert financial advisor for digital subscriptions.
    Analyze the following user subscriptions:
    {json.dumps(subs_data)}
    
    Total monthly spending is roughly {total_monthly}.
    
    Provide a JSON response with the following keys exactly:
    - "score": an integer from 0 to 100 indicating subscription health (100 is best). Punish low usage subscriptions.
    - "status": a short string like "Sehat", "Perlu Review", or "Kritis" (MUST BE IN INDONESIAN).
    - "potential_saving": an estimated integer value of how much they could save monthly by optimizing or cancelling low-usage/overlapping subs.
    - "recommendations": a list of 3-4 specific string recommendations (MUST BE IN INDONESIAN).

    PENTING: Seluruh teks rekomendasi dan status WAJIB ditulis murni dalam BAHASA INDONESIA.
    Return ONLY valid JSON. No markdown formatting blocks around the JSON.
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
        data["monthly_spending"] = total_monthly
        return data
    except Exception as e:
        # Fallback if AI fails
        print("AI Error:", str(e))
        return {
            "score": 50,
            "status": "AI Sibuk/Limit",
            "monthly_spending": total_monthly,
            "potential_saving": 0,
            "recommendations": ["Server AI (Groq/OpenRouter) sedang membatasi permintaan (*Rate Limit*) atau memproduksi output yang salah. Silakan coba beberapa saat lagi."]
        }

@app.post("/api/chat")
def chat_with_ai(query: dict, db: Session = Depends(get_db)):
    user_message = query.get("message")
    subs = db.query(models.SubscriptionDB).all()
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
