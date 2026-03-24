# Fitra

**Your AI Copilot for Every Application.**

Fitra analyzes your resume against a job description, gives you an instant fit score, identifies keyword gaps, and rewrites your bullet points to match. Built in 72 hours at **Hayward Hacks 2026** for the **AWS GenAI Hackathon**.

Live demo: [fitra-pi.vercel.app](https://fitra-pi.vercel.app)

---

## The Problem

Most students send out the same resume for every job and wonder why they never hear back. A lot of the time it's not that they're underqualified, it's that their resume doesn't match the language of the job posting. ATS systems filter them out before a human even sees the application.

---

## What Fitra Does

- **Fit Score** - a quantified match percentage between your resume and the job description
- **Keyword Gap Analysis** - shows exactly which skills and terms are missing
- **ATS Check** - flags formatting and content issues that hurt automated screening
- **AI Bullet Rewriter** - rewrites your resume bullets to better align with the role
- **PDF Resume Upload** - parse and analyze any resume in PDF format

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React, Tailwind CSS, NextAuth v5 |
| Backend | FastAPI (Python), SQLAlchemy ORM, Pydantic |
| AI | Groq API with LLaMA 3.3 70B |
| Database | Amazon RDS (PostgreSQL, Single-AZ) |
| Email | Amazon SES (SMTP) |
| Containerization | Docker, Amazon ECR |
| Hosting (Frontend) | Vercel |
| Hosting (Backend) | AWS App Runner |

---

## Architecture

```
User Browser
    |
    v
Vercel (Next.js frontend)
    |  REST API calls
    v
AWS App Runner (FastAPI backend, Dockerized)
    +-- Amazon RDS PostgreSQL  (user accounts, application data)
    +-- Amazon SES             (transactional email)
    +-- Groq API               (LLaMA 3.3 70B, AI inference)
```

---

## Project Structure

```
Fitra/
+-- frontend/               # Next.js 15 app
|   +-- src/app/
|   |   +-- page.tsx        # Landing page
|   |   +-- login/          # Login page
|   |   +-- signup/         # Signup page
|   |   +-- api/            # Next.js API routes
|   +-- .npmrc              # legacy-peer-deps for Vercel builds
|   +-- next.config.ts
|
+-- backend/                # FastAPI app
|   +-- main.py             # App entry point, CORS, route registration
|   +-- Dockerfile          # Production container
|   +-- requirements.txt
|   +-- app/
|       +-- config.py       # Pydantic settings (env-based)
|       +-- db.py           # SQLAlchemy engine + session
|       +-- models/         # ORM models (User, etc.)
|       +-- routes/         # API route handlers (auth, analysis)
|       +-- services/       # Business logic (AI, PDF parsing)
|       +-- utils/          # Helpers
|
+-- STORY.md                # Hackathon build story
+-- README.md
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- Python 3.12+
- PostgreSQL (local or RDS)
- Groq API key from [console.groq.com](https://console.groq.com)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
DATABASE_URL=postgresql://user:password@localhost:5432/fitra
CORS_ORIGINS=["http://localhost:3000"]
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your_ses_smtp_user
SMTP_PASSWORD=your_ses_smtp_password
SMTP_FROM=your@email.com
```

```bash
uvicorn main:app --reload
# API running at http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
```

Create a `.env.local` file inside `frontend/`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev
# App running at http://localhost:3000
```

---

## Deployment

### Backend (AWS App Runner via ECR)

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-west-2 | \
  docker login --username AWS --password-stdin \
  <account_id>.dkr.ecr.us-west-2.amazonaws.com

# Build and push
docker build -t fitra-backend .
docker tag fitra-backend:latest \
  <account_id>.dkr.ecr.us-west-2.amazonaws.com/fitra-backend:latest
docker push \
  <account_id>.dkr.ecr.us-west-2.amazonaws.com/fitra-backend:latest
```

Then create or redeploy the App Runner service pointing to the ECR image. Add all `.env` variables as App Runner environment variables in the AWS console.

### Frontend (Vercel)

Push to GitHub and connect the `frontend/` directory to a Vercel project. Add all `NEXT_PUBLIC_*` and `NEXTAUTH_*` environment variables in the Vercel dashboard.

---

## Challenges We Ran Into

**AWS Security Groups** - App Runner couldn't reach RDS because port 5432 was only open to one IP. Fixed by updating the inbound rule on the RDS security group.

**Pydantic Validation Error** - Adding new env vars caused `extra inputs are not permitted` on startup. Fixed by setting `extra = "ignore"` in the Pydantic Settings config class.

**Next.js Vulnerability Block** - Vercel flagged a security advisory on Next.js 15.0.0 and blocked the deploy. Fixed by upgrading to the latest version with `--legacy-peer-deps` and adding an `.npmrc` file.

**PDF Parsing Edge Cases** - Multi-column resume layouts break naive text extraction. We built fallback handling to deal with inconsistent PDF structures.

---

## Team

Built at [Hayward Hacks 2026](https://haywardhacks.com) for the AWS GenAI Hackathon track.
