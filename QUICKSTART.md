# AI Application Copilot — Quick Start

## Backend (FastAPI)

```bash
cd backend

# 1. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Download spaCy model (for NLP preprocessing)
python -m spacy download en_core_web_sm

# 4. Set up environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 5. Start the server
uvicorn main:app --reload --port 8000

# API docs available at: http://localhost:8000/docs
```

## Frontend (Next.js)

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local if needed (default points to localhost:8000)

# 3. Start the dev server
npm run dev

# App available at: http://localhost:3000
```

## Testing the full pipeline

With both servers running:
1. Open http://localhost:3000
2. Upload a PDF or DOCX resume
3. Paste a job description (at least 100 characters)
4. Click "Analyze My Resume"

Or test the backend directly:
```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "resume=@/path/to/your/resume.pdf" \
  -F "job_description=We are looking for a software engineer..."
```

## Deployment

**Backend (Render):**
- Create a new Web Service on render.com
- Connect your GitHub repo, set root directory to `backend/`
- Build command: `pip install -r requirements.txt && python -m spacy download en_core_web_sm`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add `OPENAI_API_KEY` and `CORS_ORIGINS` as environment variables

**Frontend (Vercel):**
- Import your GitHub repo on vercel.com
- Set root directory to `frontend/`
- Add `NEXT_PUBLIC_API_URL` env var pointing to your Render URL

## Project structure

```
Hackathon Project/
├── AI_Copilot_Blueprint.md      ← Full technical spec
├── QUICKSTART.md                ← This file
├── backend/
│   ├── main.py                  ← FastAPI entry point
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── config.py
│       ├── models/schemas.py    ← All Pydantic models
│       ├── routes/analysis.py   ← POST /api/analyze
│       └── services/
│           ├── parser.py        ← PDF/DOCX extraction
│           ├── extractor.py     ← LLM: JD extraction
│           ├── matcher.py       ← Fuzzy keyword matching
│           ├── scorer.py        ← Deterministic scoring
│           ├── ats_checker.py   ← Rule-based ATS checks
│           └── llm_analyzer.py  ← LLM: red flags + tailoring
└── frontend/
    ├── package.json
    ├── tailwind.config.ts
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   └── page.tsx         ← Main page
        ├── components/          ← All UI components
        ├── types/analysis.ts    ← TypeScript types
        └── lib/api.ts           ← Backend API client
```
