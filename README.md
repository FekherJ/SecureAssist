# SecureAssist

SecureAssist is a hybrid Gen AI pilot project for a security assistant orchestration platform. It includes:

- `backend/`: Node.js API for prompt orchestration, prompt versioning, and frontend integration.
- `ai-service/`: Python FastAPI microservice for AI inference and prompt execution.
- `frontend/`: React/Vite UI for chat, prompt orchestration, and result display.

## Architecture

- Frontend calls `backend` for user actions.
- Backend routes orchestrate prompt workflows and proxy requests to `ai-service`.
- AI service makes model calls via OpenAI and returns structured text responses.

## Getting started

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

3. Create a `.env` file in `ai-service/` with:
   ```text
   OPENAI_API_KEY=your_api_key_here
   ```

4. Install Python dependencies:
   ```bash
   cd ../ai-service
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

5. Run services:
   - AI service: `uvicorn app:app --reload --port 8001`
   - Backend: `npm start`
   - Frontend: `npm run dev`

## Next steps

- Add prompt versioning storage
- Add document ingestion
- Add API export endpoints
- Add prompt orchestration UI
