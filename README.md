# SecureAssist

SecureAssist is a hybrid GenAI pilot project for a security assistant orchestration platform.

The goal of the project is to prototype an AI assistant that can support security project integration workflows, especially around project analysis, ISP questions, security risks, missing documents, and recommended actions.

The project currently uses a local LLM through Ollama, so it does not require a paid OpenAI API key.

## Project structure

- `backend/`: Node.js API used as the main backend layer between the frontend and the AI service.
- `ai-service/`: Python FastAPI microservice responsible for calling the local AI model through Ollama.
- `frontend/`: React/Vite UI for sending prompts and displaying AI-generated responses.
- `docs/`: project documentation, including local AI setup notes.

## Architecture

Current architecture:

```text
React Frontend
→ Node.js Backend
→ Python FastAPI AI Service
→ Ollama Local LLM
→ llama3.2:3b
```

The frontend sends user requests to the Node.js backend.

The backend forwards AI requests to the Python FastAPI AI service.

The AI service calls the local Ollama API running on:

```text
http://localhost:11434
```

Ollama then executes the local model and returns the generated response.

## Current AI setup

The project currently uses:

```text
Ollama
llama3.2:3b
FastAPI
Uvicorn
```

This allows the project to run locally without using a paid external AI API.

## Prerequisites

You need:

- Node.js
- npm
- Python 3
- pip
- Ollama
- WSL/Linux terminal recommended

## Install and test Ollama

Install Ollama, then check the version:

```bash
ollama --version
```

Download the local model:

```bash
ollama pull llama3.2:3b
```

Test the model directly:

```bash
ollama run llama3.2:3b
```

Check that the Ollama API is reachable:

```bash
curl http://127.0.0.1:11434/api/tags
```

Ollama usually runs on:

```text
http://localhost:11434
```

## AI service setup

Go to the AI service folder:

```bash
cd ai-service
```

Create a Python virtual environment:

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in `ai-service/`:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

Start the FastAPI AI service:

```bash
uvicorn app:app --reload --port 8001
```

The AI service runs on:

```text
http://localhost:8001
```

Test it with:

```bash
curl -X POST http://localhost:8001/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"List 5 security questions to ask before validating a new internal banking application."}'
```

Expected flow:

```text
curl
→ FastAPI AI Service
→ Ollama
→ llama3.2:3b
```

## Backend setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=8000
AI_SERVICE_URL=http://localhost:8001
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:8000
```

Test the backend:

```bash
curl -X POST http://localhost:8000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"List 5 security questions to ask before validating a banking application."}'
```

Expected flow:

```text
curl
→ Node.js Backend
→ FastAPI AI Service
→ Ollama
→ llama3.2:3b
```

## Frontend setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend should be available at:

```text
http://localhost:5173
```

Expected full flow:

```text
React Frontend
→ Node.js Backend
→ FastAPI AI Service
→ Ollama
→ llama3.2:3b
```

## Useful commands

Run the AI service:

```bash
cd ai-service
source venv/bin/activate
uvicorn app:app --reload --port 8001
```

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

List local Ollama models:

```bash
ollama list
```

Run the model directly:

```bash
ollama run llama3.2:3b
```

Test Ollama API:

```bash
curl http://127.0.0.1:11434/api/tags
```

## Current status

Implemented:

- Local AI model integration with Ollama
- FastAPI AI service
- Basic `/generate` endpoint
- Local model call through `llama3.2:3b`
- Backend-to-AI-service integration in progress
- React frontend structure

## Next steps

- Connect the full flow from frontend to backend to AI service
- Replace the generic prompt box with a project security analysis workflow
- Add predefined ISP/security prompts
- Add structured AI outputs
- Add prompt versioning
- Add document ingestion
- Add a simple prompt orchestration UI
- Add GitHub Actions later, after the full local flow works end-to-end

## Target use case

The target use case is to build an AI assistant that helps security teams analyze a project early in its lifecycle.

Example input:

```text
A banking team wants to expose a new internal API that allows applications to access customer transaction history.
```

Expected output:

```text
- Project summary
- Main security risks
- ISP questions to ask
- Missing documents
- Recommended actions
```

## Notes

This project is currently a local GenAI prototype.

It is designed for learning and experimentation around:

- Local LLM integration
- AI service architecture
- Prompt orchestration
- Prompt versioning
- Security project analysis
- Backend/frontend integration
- GenAI application design
