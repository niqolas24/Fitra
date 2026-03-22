"""
Application configuration loaded from environment variables.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    groq_api_key: str
    groq_model: str = "llama-3.3-70b-versatile"
    groq_timeout_seconds: int = 60
    max_resume_size_mb: int = 10
    fuzzy_match_threshold: int = 75             # RapidFuzz score 0-100
    cors_origins: list[str] = ["http://localhost:3000", "https://your-vercel-app.vercel.app"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
