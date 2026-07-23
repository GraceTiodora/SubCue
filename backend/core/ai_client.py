import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(override=True)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "dummy_key")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if GROQ_API_KEY:
    print(f"DEBUG: Using GROQ API Key starting with: {GROQ_API_KEY[:10]}...")
    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=GROQ_API_KEY,
    )
    AI_MODEL = "llama-3.3-70b-versatile"
else:
    print(f"DEBUG: Using OpenRouter API Key starting with: {OPENROUTER_API_KEY[:10]}...")
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY,
    )
    AI_MODEL = "openrouter/free"
