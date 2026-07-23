import json
import re
from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from database import get_db
import models
from core.ai_client import client, AI_MODEL
from core.prompts import get_health_score_prompt, get_chat_system_prompt

router = APIRouter()

@router.get("/api/health-score")
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
    
    prompt = get_health_score_prompt(subs_data, total_monthly, calculated_score)
    
    try:
        completion = client.chat.completions.create(
            model=AI_MODEL,
            response_format={"type": "json_object"},
            messages=[{"role": "user", "content": prompt}]
        )
        
        result_text = completion.choices[0].message.content.strip()
        
        json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
        if json_match:
            result_text = json_match.group(0)
            
        data = json.loads(result_text)
        data["score"] = calculated_score
        data["monthly_spending"] = total_monthly
        return data
    except Exception as e:
        print("AI Error:", str(e))
        return {
            "score": calculated_score,
            "status": "AI Sibuk/Limit",
            "monthly_spending": total_monthly,
            "potential_saving": 0,
            "recommendations": ["Server AI (Groq) sedang sibuk. Namun, skor Anda berhasil dihitung di lokal secara akurat."]
        }

@router.post("/api/chat")
def chat_with_ai(
    query: dict, 
    db: Session = Depends(get_db),
    x_user_id: str = Header("default")
):
    user_message = query.get("message")
    subs = db.query(models.SubscriptionDB).filter(models.SubscriptionDB.user_id == x_user_id).all()
    subs_data = [{"name": s.name, "cost": s.cost, "usage": s.usage_level} for s in subs]
    
    system_prompt = get_chat_system_prompt(subs_data)
    
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
