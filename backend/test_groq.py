import os
import requests
from dotenv import load_dotenv

load_dotenv('.env')
groq_key = os.environ.get('GROQ_API_KEY')
headers = {'Authorization': f'Bearer {groq_key}', 'Content-Type': 'application/json'}
res = requests.get('https://api.groq.com/openai/v1/models', headers=headers)
print("MODELS:", [m['id'] for m in res.json().get('data', [])])
