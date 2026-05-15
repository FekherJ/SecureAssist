# SecureAssist

SecureAssist is a hybrid GenAI pilot project for an ISP security assistant orchestration platform.

The goal of the project is to prototype an AI assistant that can support security project integration workflows by analyzing project descriptions and generating:

- project summaries
- security risks with categories and severity levels
- ISP questions
- missing documents
- recommended actions

The project uses a local LLM through Ollama, so it does not require a paid OpenAI API key.

## Project structure

- `backend/`: Node.js API used as the main backend layer between the frontend, PostgreSQL and the AI service.
- `ai-service/`: Python FastAPI microservice responsible for calling the local AI model through Ollama.
- `frontend/`: React/Vite UI for security analysis and prompt management.
- `database/`: PostgreSQL initialization script for prompt templates.
- `docs/`: project documentation, including local AI setup notes.
- `.github/workflows/`: GitHub Actions CI configuration.

## Architecture

Current architecture:

```text
React Frontend
→ Node.js Backend
→ PostgreSQL prompt_templates
→ Python FastAPI AI Service
→ Ollama Local LLM
→ llama3.2:3b
```

The frontend provides two main sections:

- Security Analysis: submit a project description and display a structured security analysis.
- Prompt Management: list prompt templates, inspect versions, and activate the prompt used by the analysis workflow.

The Node.js backend follows a layered architecture:

```text
routes → services → repositories → database / external services
```

The backend loads the active prompt template from PostgreSQL, injects the project description into the prompt, then sends the final prompt to the Python FastAPI AI service.

The AI service calls the local Ollama API running on:

```text
http://localhost:11434
```

Ollama executes the local model and returns a structured JSON response.

The backend parses the JSON response and sends it back to the frontend, where it is displayed as structured cards.

## Current AI setup

The project currently uses:

```text
Ollama
llama3.2:3b
FastAPI
Uvicorn
PostgreSQL
Node.js
React
```

This allows the project to run locally without using a paid external AI API.

## Backend architecture

The backend is organized with a layered structure:

```text
backend/src/
├── app.js
├── index.js
├── db/
│   └── pool.js
├── repositories/
│   └── promptRepository.js
├── routes/
│   ├── aiRoutes.js
│   ├── healthRoutes.js
│   ├── promptRoutes.js
│   └── securityRoutes.js
└── services/
    ├── aiService.js
    ├── healthService.js
    ├── promptService.js
    └── securityAnalysisService.js
```

Responsibilities:

- `routes/`: HTTP endpoints and request/response handling.
- `services/`: business logic and workflow orchestration.
- `repositories/`: database access.
- `db/`: PostgreSQL connection pool.
- `aiService.js`: communication with the Python AI service.
- `securityAnalysisService.js`: security analysis workflow orchestration.

## Prompt versioning with PostgreSQL

SecureAssist stores prompt templates in PostgreSQL instead of hardcoding them directly in the backend.

The backend loads the active prompt for the use case:

```text
ISP_SECURITY_ANALYSIS
```

from the `prompt_templates` table.

The prompt contains a placeholder:

```text
{{projectDescription}}
```

The backend replaces this placeholder with the project description provided by the user.

This allows prompt templates to be versioned, activated/deactivated, and managed independently from the application code.

Current table:

```text
prompt_templates
```

Main fields:

```text
id
name
version
use_case
template
is_active
created_at
updated_at
```

## Prompt management

SecureAssist exposes prompt management endpoints through the backend.

Available endpoints:

```text
GET /api/prompts
GET /api/prompts/active?useCase=ISP_SECURITY_ANALYSIS
POST /api/prompts
PATCH /api/prompts/:id/activate
DELETE /api/prompts/:id
```

These endpoints allow the application to:

- list prompt templates
- retrieve the active prompt for a use case
- create a new prompt version
- activate a specific prompt version

The frontend includes a Prompt Management tab that displays available prompt templates, their versions, their active/inactive status, and allows activating another prompt version.

## Prerequisites

You need:

- Node.js
- npm
- Python 3
- pip
- Docker
- PostgreSQL container
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

## PostgreSQL setup

SecureAssist uses PostgreSQL to store prompt templates.

The project includes a `docker-compose.yml`, but if Docker Compose is not available in the local environment, PostgreSQL can be started manually with Docker.

The database runs on local port `5433` to avoid conflicts with other local PostgreSQL containers.

Start PostgreSQL manually:

```bash
docker run -d \
  --name secureassist-postgres \
  -e POSTGRES_DB=secureassist \
  -e POSTGRES_USER=secureassist_user \
  -e POSTGRES_PASSWORD=secureassist_password \
  -p 5433:5432 \
  -v secureassist_postgres_data:/var/lib/postgresql/data \
  -v "$(pwd)/database/init.sql:/docker-entrypoint-initdb.d/init.sql" \
  postgres:16-alpine
```

Check that the container is running:

```bash
docker ps
```

Connect to the database:

```bash
docker exec -it secureassist-postgres psql -U secureassist_user -d secureassist
```

List tables:

```sql
\dt
```

Expected table:

```text
prompt_templates
```

Exit PostgreSQL:

```sql
\q
```

If the database already exists and the init script needs to be applied manually:

```bash
docker exec -i secureassist-postgres psql -U secureassist_user -d secureassist < database/init.sql
```

Check prompt templates:

```sql
SELECT id, name, version, use_case, is_active
FROM prompt_templates;
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
curl http://localhost:8001/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "secureassist-ai",
  "provider": "ollama",
  "model": "llama3.2:3b"
}
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

DB_HOST=localhost
DB_PORT=5433
DB_NAME=secureassist
DB_USER=secureassist_user
DB_PASSWORD=secureassist_password
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:8000
```

Test the backend health endpoint:

```bash
curl http://localhost:8000/health
```

Test the database health endpoint:

```bash
curl http://localhost:8000/health/db
```

Expected response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

Test the ISP security analysis endpoint:

```bash
curl -X POST http://localhost:8000/api/security/analyze \
  -H "Content-Type: application/json" \
  -d '{"projectDescription":"A banking team wants to expose a new internal API that allows applications to access customer transaction history."}'
```

Expected flow:

```text
curl
→ Node.js Backend
→ PostgreSQL prompt_templates
→ FastAPI AI Service
→ Ollama
→ llama3.2:3b
```

Expected response includes:

```json
{
  "workflow": "isp-security-analysis",
  "promptTemplate": {
    "id": 1,
    "name": "ISP Security Analysis Prompt",
    "version": "v2",
    "useCase": "ISP_SECURITY_ANALYSIS"
  },
  "structuredAnalysis": {
    "projectSummary": "...",
    "mainSecurityRisks": [
      {
        "title": "...",
        "category": "...",
        "severity": "...",
        "impact": "...",
        "recommendedControl": "..."
      }
    ],
    "ispQuestions": [],
    "missingDocuments": [],
    "recommendedActions": []
  }
}
```

## Prompt management API examples

List prompts:

```bash
curl "http://localhost:8000/api/prompts?useCase=ISP_SECURITY_ANALYSIS"
```

Get active prompt:

```bash
curl "http://localhost:8000/api/prompts/active?useCase=ISP_SECURITY_ANALYSIS"
```

Create a new prompt version:

```bash
curl -X POST http://localhost:8000/api/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ISP Security Analysis Prompt",
    "version": "v3",
    "useCase": "ISP_SECURITY_ANALYSIS",
    "template": "You are an information security assistant. Analyze the following project and return ONLY valid JSON. Project: {{projectDescription}}",
    "isActive": false
  }'
```

Activate a prompt version:

```bash
curl -X PATCH http://localhost:8000/api/prompts/1/activate
```

Delete an inactive prompt version:

````bash
curl -X DELETE http://localhost:8000/api/prompts/2


## Frontend setup

Go to the frontend folder:

```bash
cd frontend
````

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

The frontend includes two tabs:

- Security Analysis
- Prompt Management

The Prompt Management tab allows reviewing PostgreSQL-backed prompt templates, showing or hiding prompt content, and activating a prompt version from the UI.

Expected full flow:

```text
React Frontend
→ Node.js Backend
→ PostgreSQL prompt_templates
→ FastAPI AI Service
→ Ollama
→ Structured security analysis UI
```

## Formatting

The project uses:

- Prettier for JavaScript, JSX, CSS, JSON and Markdown
- Black for Python

Run formatting from the root folder:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

## GitHub Actions CI

The project includes a GitHub Actions workflow for basic quality checks.

The CI validates:

- root dependency installation
- backend dependency installation
- frontend dependency installation
- AI service dependency installation
- Prettier formatting
- Black formatting
- backend app loading
- Python syntax
- frontend build

Workflow file:

```text
.github/workflows/ci.yml
```

## Useful commands

Run PostgreSQL:

```bash
docker start secureassist-postgres
```

Stop PostgreSQL:

```bash
docker stop secureassist-postgres
```

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

Test backend security analysis:

```bash
curl -X POST http://localhost:8000/api/security/analyze \
  -H "Content-Type: application/json" \
  -d '{"projectDescription":"A new internal HR application will store employee personal data and expose an API for managers."}'
```

## Current status

Implemented:

- Local AI model integration with Ollama
- Python FastAPI AI service
- Node.js backend with layered architecture
- React frontend
- Security Analysis UI
- Prompt Management UI
- Structured JSON output
- Enhanced security risk schema with title, category, severity, impact and recommended control
- PostgreSQL-based prompt versioning
- Prompt management endpoints
- Active prompt template loaded from database
- Database health check endpoint
- Project-wide formatting with Prettier and Black
- GitHub Actions CI

## Target use case

The target use case is to build an AI assistant that helps security teams analyze a project early in its lifecycle.

Example input:

```text
A banking team wants to expose a new internal API that allows applications to access customer transaction history.
```

Expected output:

```text
- Project summary
- Main security risks with categories and severity levels
- Security impact for each risk
- Recommended control for each risk
- ISP questions to ask
- Missing documents
- Recommended actions
```

## Next steps

Potential next improvements:

- Add a frontend form to create new prompt versions
- Add prompt editing support
- Add prompt validation before activation
- Add document ingestion
- Add RAG-based document analysis
- Add security analysis history
- Add authentication later if needed

## Notes

This project is currently a local GenAI prototype.

It is designed for learning and experimentation around:

- Local LLM integration
- AI service architecture
- Prompt orchestration
- Prompt versioning
- PostgreSQL-backed prompt management
- Security project analysis
- Backend/frontend integration
- GenAI application design
