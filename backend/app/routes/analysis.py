"""
API routes for the AI Application Copilot.
"""

import time
import logging
from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.models.schemas import AnalysisResponse
from app.services.parser import extract_resume_text, split_into_sections
from app.services.extractor import extract_job_description
from app.services.matcher import build_keyword_list, get_missing_keywords, get_matched_keywords
from app.services.scorer import compute_fit_score
from app.services.ats_checker import check_ats
from app.services.llm_analyzer import (
    analyze_red_flags,
    generate_tailoring_suggestions,
    generate_fit_explanation,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
}


@router.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    resume: UploadFile = File(..., description="PDF or DOCX resume file"),
    job_description: str = Form(..., min_length=100, description="Full job posting text"),
):
    """
    Main analysis endpoint.
    Accepts a resume file and job description text,
    returns a full structured analysis.
    """
    start_time = time.time()
    settings = get_settings()

    # --- Validate file ---
    if resume.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported file type: {resume.content_type}. Use PDF or DOCX.",
        )

    file_bytes = await resume.read()
    if len(file_bytes) > settings.max_resume_size_mb * 1024 * 1024:
        raise HTTPException(
            status_code=422,
            detail=f"File too large. Maximum size is {settings.max_resume_size_mb}MB.",
        )

    # --- Step 1: Extract resume text ---
    try:
        resume_text = extract_resume_text(file_bytes, resume.filename or "resume.pdf")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Resume extraction error: {e}")
        raise HTTPException(status_code=500, detail="Failed to extract text from resume.")

    if len(resume_text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Could not extract meaningful text from the resume. "
                   "Ensure the file is not image-only or password-protected.",
        )

    # --- Step 2: Split resume into sections ---
    resume_sections = split_into_sections(resume_text)

    # --- Step 3: Extract structured data from JD (LLM call #1) ---
    try:
        jd_summary = await extract_job_description(job_description)
    except Exception as e:
        logger.error(f"JD extraction error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze the job description. Please try again.",
        )

    # --- Step 4: Keyword matching (deterministic) ---
    keywords = build_keyword_list(jd_summary, resume_text)
    matched_keywords = get_matched_keywords(keywords)
    missing_keywords = get_missing_keywords(keywords)

    # --- Step 5: ATS checks (rule-based) ---
    ats_warnings = check_ats(resume_text, resume_sections)

    # --- Step 6: LLM analysis — red flags + sub-scores (LLM call #2) ---
    try:
        llm_flags_result = await analyze_red_flags(resume_text, jd_summary)
    except Exception as e:
        logger.error(f"Red flag analysis error: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze resume quality.")

    # --- Step 7: Compute fit score (deterministic) ---
    fit_score, fit_label, score_breakdown = compute_fit_score(
        keywords=keywords,
        experience_alignment_score=llm_flags_result.experience_alignment_score,
        project_relevance_score=llm_flags_result.project_relevance_score,
        red_flags=llm_flags_result.red_flags,
    )

    # --- Step 8: Tailoring suggestions (LLM call #3) ---
    try:
        tailoring_result = await generate_tailoring_suggestions(
            resume_text=resume_text,
            jd_summary=jd_summary,
            missing_keywords=missing_keywords,
        )
    except Exception as e:
        logger.error(f"Tailoring generation error: {e}")
        tailoring_result = None

    # --- Step 9: Fit explanation (LLM call #4) ---
    try:
        fit_explanation = await generate_fit_explanation(
            fit_score=fit_score,
            fit_label=fit_label,
            jd_summary=jd_summary,
            matched_keywords=[k.term for k in matched_keywords],
            missing_keywords=missing_keywords,
            experience_alignment_score=llm_flags_result.experience_alignment_score,
            project_relevance_score=llm_flags_result.project_relevance_score,
            red_flags=llm_flags_result.red_flags,
        )
    except Exception as e:
        logger.error(f"Fit explanation error: {e}")
        fit_explanation = f"Your resume received a {fit_score}/100 fit score for this role."

    # --- Assemble response ---
    elapsed_ms = int((time.time() - start_time) * 1000)

    return AnalysisResponse(
        fit_score=fit_score,
        fit_label=fit_label,
        fit_explanation=fit_explanation,
        score_breakdown=score_breakdown,
        keywords=keywords,
        matched_count=len(matched_keywords),
        missing_count=len(missing_keywords),
        resume_sections=resume_sections,
        red_flags=llm_flags_result.red_flags,
        ats_warnings=ats_warnings,
        tailoring_suggestions=(
            tailoring_result.tailoring_suggestions if tailoring_result else []
        ),
        jd_summary=jd_summary,
        processing_time_ms=elapsed_ms,
    )
