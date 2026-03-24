# Fitra — Your AI Copilot for Every Application

## The Problem We Lived

It's 11:47 PM. You have seventeen browser tabs open. One is a job posting for a software engineering internship at a company you actually care about. Another is your resume — the same resume you've been recycling since sophomore year with minor tweaks. A third tab is a Reddit thread titled *"How do I tailor my resume without losing my mind?"* with 400 upvotes and no real answers.

This was our reality every recruiting season.

The internship application process is brutal — not because the work is hard, but because the *logistics* are chaos. Every company wants something slightly different. One wants to see your cloud experience front and center. Another wants leadership. A third cares about open source contributions you buried on page two. You're supposed to read the job description carefully, identify the keywords, rewrite your bullet points to match, check your formatting, make sure it passes ATS scanners, and do all of this for **dozens of applications** — often while taking 18 credit hours and trying to maintain some semblance of a social life.

Most students don't tailor their resumes at all. Not because they don't care, but because there's no good tool to help them do it at scale.

Google Docs doesn't analyze anything. LinkedIn gives vague "profile strength" scores. ChatGPT helps if you know how to prompt it — but there's no memory, no history, no centralized place to track what you changed and why.

We wanted something better. So we built it.

---

## What We Built

**Fitra** is an AI copilot for internship and job applications. You upload your resume, paste a job description, and within seconds you get:

- A **fit score out of 100** that tells you how well your resume matches the role
- A **keyword gap analysis** showing exactly what skills and terms are missing
- An **ATS formatting check** to make sure your resume won't get filtered before a human ever reads it
- **Personalized bullet point rewrites** that preserve your voice while closing the gap

The math behind the fit score combines fuzzy string matching with semantic similarity:

$$\text{FitScore} = \alpha \cdot \text{KeywordOverlap} + \beta \cdot \text{SemanticSimilarity} + \gamma \cdot \text{FormattingScore}$$

where $\alpha + \beta + \gamma = 1$ and the weights are tuned to reflect what ATS systems actually prioritize.

Everything lives in one place. Your history, your scores, your rewrites. No more seventeen tabs.

---

## What Inspired Us

All three of us went through recruiting last semester. Between us, we submitted over 60 applications. We got back-to-back rejections with no feedback, no signal, no idea if it was our resume or our experience or just bad luck.

One night we sat down and compared notes. The resumes that got responses had something in common — they mirrored the language of the job description almost exactly. Not copying, but speaking the same vocabulary. The ones that didn't get responses were generic.

That insight felt obvious in retrospect. But doing it manually for every application is exhausting. We thought: *what if an AI could do this analysis instantly, and give you something actionable?*

That was the spark.

---

## How We Built It

We had 72 hours and a clear stack in mind:

**Frontend** — Next.js 16 with NextAuth for authentication, deployed on Vercel. We wanted a clean, minimal UI that felt like a tool you'd actually trust with something as personal as your resume.

**Backend** — FastAPI (Python) running on AWS App Runner via Docker. Python gave us access to the NLP ecosystem we needed. FastAPI kept things fast and type-safe.

**AI Layer** — Groq's LLaMA 3.3 70B for natural language analysis and bullet point rewriting. The speed was critical — we needed sub-second responses to make the UX feel snappy.

**Resume Parsing** — `pdfplumber` and `python-docx` for extracting text from uploaded resumes, combined with `rapidfuzz` for fuzzy keyword matching.

**Database** — Amazon RDS (PostgreSQL) for storing users and their application history.

**Email** — Amazon SES for transactional emails.

The architecture looks something like this:

```
User → Vercel (Next.js) → AWS App Runner (FastAPI) → Groq API
                                      ↓
                              RDS PostgreSQL
```

---

## The Challenges We Faced

Honestly? The hardest parts had nothing to do with AI.

**AWS networking was our biggest obstacle.** We spent hours debugging why our App Runner service couldn't reach our RDS database. The answer was a single security group rule — the database was only allowing connections from our laptops, not from AWS's managed App Runner infrastructure. Once we opened port 5432 to `0.0.0.0/0`, everything clicked.

**Pydantic validation errors brought down our backend.** We added new environment variables (SMTP, database URL) to our `.env` file but forgot to add the corresponding fields to our Pydantic `Settings` class. The app would crash silently on startup with `extra inputs are not permitted`. Took us longer than we'd like to admit to trace it back.

**The Next.js vulnerability.** We were running `15.0.0` and Vercel blocked our deployment with a security warning. Had to upgrade on the fly — which introduced an ESLint version conflict — which required `--legacy-peer-deps` — which required an `.npmrc` file since Vercel doesn't let you pass CLI flags directly.

**Resume parsing edge cases.** PDFs are not a standard format. Every resume generator outputs slightly different byte structures. We had to build fallbacks for when `pdfplumber` couldn't extract text cleanly, and handle multi-column layouts that break naive text extraction.

But we shipped it. And when we ran:

```bash
curl -X POST https://wk7xqdcqpu.us-west-2.awsapprunner.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test"}'
```

and got back:

```json
{"success": true, "message": "Account created successfully", "email": "test@test.com"}
```

...at 1 AM after hours of debugging, it felt really good.

---

## What We Learned

1. **Ship the infrastructure first.** Every hour we spent on UI before the backend was wired up was a potential hour of blocked work. Next time: get the data flowing end-to-end on day one.

2. **AWS is powerful and unforgiving.** The tools are incredible but the failure modes are silent. CloudWatch logs, security groups, and IAM roles need to be understood before you need them — not during a debugging session at midnight.

3. **AI is the easy part.** The Groq integration took about two hours. The deployment, auth, database, and networking took the other 70. Building *around* AI is where the real engineering lives.

4. **The problem matters.** Every time we hit a wall, we thought about the version of ourselves from last semester, stressed and overwhelmed and submitting generic resumes into the void. That kept us going.

---

## What's Next

We're not done with Fitra. After the hackathon, we want to:

- Add **application tracking** so you can see your score history across companies
- Build a **browser extension** that auto-analyzes job postings as you browse
- Support **Google OAuth** for one-click sign-in
- Fine-tune the scoring model with real outcome data

The internship application process is broken for a lot of students. We think it can be fixed — one tailored resume at a time.

---

*Built at Hayward Hacks 2026 in 72 hours by Team Fitra.*
