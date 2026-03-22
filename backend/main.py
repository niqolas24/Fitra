"""
AI Application Copilot — FastAPI Backend
Entry point: start with `uvicorn main:app --reload`
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes.analysis import router as analysis_router
from app.routes.auth import router as auth_router
from app.db import init_db

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

settings = get_settings()
init_db()

app = FastAPI(
    title="AI Application Copilot",
    description="Helps university students compare their resume against a job description.",
    version="1.0.0",
)

# CORS — allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(analysis_router)
app.include_router(auth_router)


@app.get("/")
async def root():
    return {"message": "AI Application Copilot API", "docs": "/docs"}
