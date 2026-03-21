"""
Deterministic fit scoring engine.

The LLM never produces the score directly.
Instead, this module computes the score from:
  1. Keyword overlap metrics (from matcher.py)
  2. LLM-provided sub-scores (experience_alignment, project_relevance)
  3. Red flag penalties

Scoring formula (max 100 points):
  - Keyword coverage:      0–40 pts
    (must-have keywords weighted 70%, overall keywords 30%)
  - Experience alignment:  0–30 pts  (LLM provides 0–100 sub-score)
  - Project relevance:     0–20 pts  (LLM provides 0–100 sub-score)
  - Baseline:              10 pts    (for attempting a role)
  - Red flag penalty:      up to -20 pts

Labels:
  >= 70 → Strong Fit
  >= 45 → Moderate Fit
  <  45 → Weak Fit
"""

import logging
from typing import List, Literal

from app.models.schemas import Keyword, RedFlag, ScoreBreakdown

logger = logging.getLogger(__name__)

# Penalty weights per red flag severity
SEVERITY_PENALTY = {"high": 5, "medium": 3, "low": 1}
MAX_RED_FLAG_PENALTY = 20
BASELINE = 10.0


def _keyword_component(keywords: List[Keyword]) -> tuple[float, float]:
    """
    Compute keyword coverage score (0–40 pts).
    Returns (component_score, must_have_coverage_pct).
    """
    if not keywords:
        return 0.0, 0.0

    must_haves = [k for k in keywords if k.category == "must_have"]
    must_have_matched = sum(1 for k in must_haves if k.matched)
    must_have_total = len(must_haves)

    overall_matched = sum(1 for k in keywords if k.matched)
    overall_total = len(keywords)

    # Must-have coverage (0–100%)
    must_have_pct = (must_have_matched / must_have_total * 100) if must_have_total > 0 else 50.0

    # Overall coverage (0–100%)
    overall_pct = (overall_matched / overall_total * 100) if overall_total > 0 else 50.0

    # Weighted blend: must-haves matter more
    blended = must_have_pct * 0.70 + overall_pct * 0.30

    # Scale to 0–40 pts
    component = (blended / 100) * 40

    return round(component, 2), round(must_have_pct, 1)


def _experience_component(experience_alignment_score: int) -> float:
    """Convert LLM's 0–100 experience score to 0–30 pts."""
    return round((experience_alignment_score / 100) * 30, 2)


def _project_component(project_relevance_score: int) -> float:
    """Convert LLM's 0–100 project score to 0–20 pts."""
    return round((project_relevance_score / 100) * 20, 2)


def _red_flag_penalty(red_flags: List[RedFlag]) -> float:
    """Compute penalty from red flags, capped at MAX_RED_FLAG_PENALTY."""
    total = sum(SEVERITY_PENALTY.get(rf.severity, 1) for rf in red_flags)
    return round(min(total, MAX_RED_FLAG_PENALTY), 2)


def compute_fit_score(
    keywords: List[Keyword],
    experience_alignment_score: int,
    project_relevance_score: int,
    red_flags: List[RedFlag],
) -> tuple[int, Literal["strong_fit", "moderate_fit", "weak_fit"], ScoreBreakdown]:
    """
    Main scoring function. Returns (score, label, breakdown).
    """
    kw_component, must_have_pct = _keyword_component(keywords)
    exp_component = _experience_component(experience_alignment_score)
    proj_component = _project_component(project_relevance_score)
    penalty = _red_flag_penalty(red_flags)

    raw_score = kw_component + exp_component + proj_component + BASELINE - penalty
    final_score = int(max(0, min(100, round(raw_score))))

    if final_score >= 70:
        label: Literal["strong_fit", "moderate_fit", "weak_fit"] = "strong_fit"
    elif final_score >= 45:
        label = "moderate_fit"
    else:
        label = "weak_fit"

    breakdown = ScoreBreakdown(
        keyword_coverage=kw_component,
        must_have_coverage=must_have_pct,
        experience_alignment=exp_component,
        project_relevance=proj_component,
        baseline=BASELINE,
        red_flag_penalty=-penalty,
    )

    logger.info(
        f"Score: {final_score} ({label}) | "
        f"kw={kw_component:.1f} exp={exp_component:.1f} "
        f"proj={proj_component:.1f} penalty={penalty:.1f}"
    )

    return final_score, label, breakdown
