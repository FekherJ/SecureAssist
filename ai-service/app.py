from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests

load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")

app = FastAPI(title="SecureAssist AI Service")


class GenerateRequest(BaseModel):
    prompt: str
    temperature: float = 0.3
    max_tokens: int = 1200
    response_format: str | None = None


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "secureassist-ai",
        "provider": "ollama",
        "model": OLLAMA_MODEL,
    }


@app.post("/generate")
def generate(payload: GenerateRequest):
    if not payload.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required")

    try:
        request_body = {
            "model": OLLAMA_MODEL,
            "prompt": payload.prompt,
            "stream": False,
            "options": {
                "temperature": payload.temperature,
                "num_predict": payload.max_tokens,
            },
        }

        if payload.response_format:
            request_body["format"] = payload.response_format

        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=request_body,
            timeout=120,
        )

        response.raise_for_status()
        data = response.json()

        return {
            "provider": "ollama",
            "model": OLLAMA_MODEL,
            "prompt": payload.prompt,
            "response": data.get("response", "").strip(),
        }

    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=502,
            detail="Cannot connect to Ollama. Make sure Ollama is running on http://localhost:11434",
        )
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Ollama request timed out")
    except Exception as error:
        raise HTTPException(status_code=502, detail=str(error))
