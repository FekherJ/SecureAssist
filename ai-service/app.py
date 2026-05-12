from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import openai

load_dotenv()

auth_key = os.getenv('OPENAI_API_KEY')
openai.api_key = auth_key

app = FastAPI(title='SecureAssist AI Service')

class GenerateRequest(BaseModel):
    prompt: str
    temperature: float = 0.7
    max_tokens: int = 500

@app.get('/health')
def health():
    return {'status': 'ok', 'service': 'secureassist-ai'}

@app.post('/generate')
def generate(payload: GenerateRequest):
    if not auth_key:
        raise HTTPException(status_code=500, detail='OPENAI_API_KEY not configured')

    try:
        completion = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': payload.prompt}],
            temperature=payload.temperature,
            max_tokens=payload.max_tokens
        )
        text = completion.choices[0].message.content.strip()
        return {'prompt': payload.prompt, 'response': text}
    except Exception as error:
        raise HTTPException(status_code=502, detail=str(error))
