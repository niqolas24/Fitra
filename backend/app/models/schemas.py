"""
Pydantic schemas for the AI Application Copilot API.
All request and response models live here.
"""

from __future__ import annotations
from typing import Dict, List, Literal, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Sub-models
# ---------------------------------------------------------------------------

class Keyword(BaseModel):
    term: str
    category: Literal["must_have", "nice_to_have", "technical", "soft"]
    matched: bool
    match_score: Optional[float] = Field(None, ge=0, le=100)
    matched_as: Optional[str] = None  # the actual resume text that matched


class RedFlag(BaseModel):
    type: str
    description: str
    severity: Literal["high", "medium", "low"]
    location: Optional[str] = None


class ATSWarning(BaseModel):
    type: str
    description: str
    suggestion: str


class BulletRewrite(BaseModel):
    original: str
    rewritten: str
    reason: str


class TailoringSuggestion(BaseModel):
    area: str
    suggestion: str
    keywords_to_add: List[str] = []
    bullet_rewrites: List[BulletRewrite] = []


class ScoreBreakdown(BaseModel):
    keyword_coverage: float = Field(..., description="0–40 pts from keyword overlap")
    must_have_coverage: float = Field(..., description="Pct of must-have keywords matched")
    experience_alignment: float = Field(..., description="0–30 pts from LLM experience score")
    project_relevance: float = Field(..., description="0–20 pts from LLM project score")
    baseline: float = Field(10.0, description="Base points for attempting the role")
    red_flag_penalty: float = Field(..., description="Negative penalty, max -20")


class JDSummary(BaseModel):
    role_title: str
    company_type: Optional[str] = None
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    technical_tools: List[str] = []
    soft_skills: List[str] = []
    action_verbs: List[str] = []
    key_responsibilities: List[str] = []
    qualifications: List[str] = []
    must_have_keywords: List[str] = []
    nice_to_have_keywords: List[str] = []
    experience_alignment_criteria: Optional[str] = None
    project_relevance_criteria: Optional[str] = None


# ---------------------------------------------------------------------------
# Main response
# ---------------------------------------------------------------------------

class AnalysisResponse(BaseModel):
    fit_score: int = Field(..., ge=0, le=100)
    fit_label: Literal["strong_fit", "moderate_fit", "weak_fit"]
    fit_explanation: str
    score_breakdown: ScoreBreakdown

    keywords: List[Keyword]
    matched_count: int
    missing_count: int

    resume_sections: Dict[str, str]  # section_name → raw text

    red_flags: List[RedFlag]
    ats_warnings: List[ATSWarning]
    tailoring_suggestions: List[TailoringSuggestion]

    jd_summary: JDSummary
    processing_time_ms: int


# ---------------------------------------------------------------------------
# Internal intermediate models (not exposed directly as API responses)
# ---------------------------------------------------------------------------

class LLMRedFlagResult(BaseModel):
    experience_alignment_score: int = Field(..., ge=0, le=100)
    project_relevance_score: int = Field(..., ge=0, le=100)
    red_flags: List[RedFlag] = []


class LLMTailoringResult(BaseModel):
    tailoring_suggestions: List[TailoringSuggestion] = []
