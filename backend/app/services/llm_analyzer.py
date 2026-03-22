"""
LLM-based analysis: red flags, tailoring suggestions, and fit explanation.
Makes three focused Groq calls:
  1. Red flag analysis + experience/project sub-scores
  2. Tailoring suggestions + bullet rewrites
  3. Fit explanation (short, uses computed score)
"""

import json
import logging
from groq import AsyncGroq

from app.config import get_settings
from app.models.schemas import (
    JDSummary, LLMRedFlagResult, LLMTailoringResult, RedFlag, TailoringSuggestion
)

logger = logging.getLogger(__name__)


RED_FLAG_PROMPT = """You are an expert resume reviewer helping a university student applying for a specific role.

Your job is to:
1. Identify specific red flags in the resume
2. Score how well the student's EXPERIENCE aligns with the role (0-100)
3. Score how relevant the student's PROJECTS are to the role (0-100)

Return ONLY valid JSON matching this exact schema:

{{
  "experience_alignment_score": integer,
  "project_relevance_score": integer,
  "red_flags": [
    {{
      "type": "vague_bullet|no_impact_metrics|weak_action_verb|inconsistent_tense|role_mismatch|generic_skills_section|no_outcome_shown|other",
      "description": "specific and concrete description referencing actual resume text",
      "severity": "high|medium|low",
      "location": "which section/bullet this was found in"
    }}
  ]
}}

SCORING GUIDE:
- experience_alignment_score: 0=no relevant experience, 50=some overlap, 80+=strong direct match
- project_relevance_score: 0=no relevant projects, 50=tangentially related, 80+=directly relevant and impressive

RED FLAG RULES:
- Only flag REAL issues visible in the resume. Do not invent problems.
- Be SPECIFIC. Quote or closely reference the actual problematic text.
- Flag a MAXIMUM of 8 red flags. Focus on high-severity issues.
- Do NOT flag missing keywords.
- Do NOT recommend adding skills the student doesn't have.

JOB DESCRIPTION CONTEXT:
Role: {role_title}
Key Requirements: {key_requirements}
Experience Criteria: {experience_criteria}
Project Criteria: {project_criteria}

RESUME TEXT:
{resume_text}"""


TAILORING_PROMPT = """You are an expert career coach helping a university student tailor their resume.

CRITICAL CONSTRAINT: You MUST NOT invent, fabricate, or imply experience the student does not have.
Every suggestion must be grounded in what is ALREADY in their resume.

Return ONLY valid JSON:

{{
  "tailoring_suggestions": [
    {{
      "area": "Experience > [Job Title at Company] | Projects | Skills | etc.",
      "suggestion": "specific actionable advice grounded in the resume",
      "keywords_to_add": ["keyword1", "keyword2"],
      "bullet_rewrites": [
        {{
          "original": "exact original bullet text",
          "rewritten": "improved version using same facts",
          "reason": "why this version is stronger"
        }}
      ]
    }}
  ]
}}

RULES:
- Do NOT add tools or claims not in the original text.
- Use stronger action verbs (Built, Engineered, Led, Reduced, Increased, etc.)
- Maximum 5 bullet rewrites total.

MISSING KEYWORDS: {missing_keywords}

JOB DESCRIPTION SUMMARY:
Role: {role_title}
Must-Have: {must_haves}
Responsibilities: {responsibilities}

RESUME FULL TEXT:
{resume_text}"""


FIT_EXPLANATION_PROMPT = """You are writing the "Fit Summary" section of an AI resume analysis report.

Write a clear, honest, direct 3-4 sentence paragraph explaining why this student received their fit score.
- Mention their specific strengths that match the role
- Mention the most important gaps
- Do NOT tell the student whether to apply or not
- Be specific to their actual resume and the actual job

Return ONLY the paragraph text. No JSON, no markdown, no headers.

Fit Score: {fit_score}/100 ({fit_label_display})
Key Matched Keywords: {matched_keywords}
Key Missing Keywords: {missing_keywords}
Experience Alignment: {experience_alignment_score}/100
Project Relevance: {project_relevance_score}/100
Red Flag Count: {red_flag_count} ({high_severity_count} high severity)
Role: {role_title}"""


async def analyze_red_flags(
    resume_text: str,
    jd_summary: JDSummary,
) -> LLMRedFlagResult:
    settings = get_settings()
    client = AsyncGroq(api_key=settings.groq_api_key)

    key_requirements = ", ".join(
        jd_summary.required_skills[:8] + jd_summary.technical_tools[:5]
    )

    prompt = RED_FLAG_PROMPT.format(
        role_title=jd_summary.role_title,
        key_requirements=key_requirements,
        experience_criteria=jd_summary.experience_alignment_criteria or "Not specified",
        project_criteria=jd_summary.project_relevance_criteria or "Not specified",
        resume_text=resume_text[:4000],
    )

    try:
        response = await client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise resume analysis engine. Always return valid JSON only.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
            timeout=settings.groq_timeout_seconds,
        )
        data = json.loads(response.choices[0].message.content)
        return LLMRedFlagResult(**data)

    except Exception as e:
        logger.error(f"Red flag analysis failed: {e}")
        return LLMRedFlagResult(
            experience_alignment_score=50,
            project_relevance_score=50,
            red_flags=[],
        )


async def generate_tailoring_suggestions(
    resume_text: str,
    jd_summary: JDSummary,
    missing_keywords: list[str],
) -> LLMTailoringResult:
    settings = get_settings()
    client = AsyncGroq(api_key=settings.groq_api_key)

    prompt = TAILORING_PROMPT.format(
        missing_keywords=", ".join(missing_keywords[:15]),
        role_title=jd_summary.role_title,
        must_haves=", ".join(jd_summary.must_have_keywords[:10]),
        responsibilities="\n- ".join(jd_summary.key_responsibilities[:6]),
        resume_text=resume_text[:4000],
    )

    try:
        response = await client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert career coach. Always return valid JSON only. "
                        "Never invent experience. All suggestions must be grounded in the resume."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
            response_format={"type": "json_object"},
            timeout=settings.groq_timeout_seconds,
        )
        data = json.loads(response.choices[0].message.content)
        return LLMTailoringResult(**data)

    except Exception as e:
        logger.error(f"Tailoring suggestion generation failed: {e}")
        return LLMTailoringResult(tailoring_suggestions=[])


async def generate_fit_explanation(
    fit_score: int,
    fit_label: str,
    jd_summary: JDSummary,
    matched_keywords: list[str],
    missing_keywords: list[str],
    experience_alignment_score: int,
    project_relevance_score: int,
    red_flags: list,
) -> str:
    settings = get_settings()
    client = AsyncGroq(api_key=settings.groq_api_key)

    label_display_map = {
        "strong_fit": "Strong Fit",
        "moderate_fit": "Moderate Fit",
        "weak_fit": "Weak Fit",
    }

    high_severity = sum(1 for rf in red_flags if rf.severity == "high")

    prompt = FIT_EXPLANATION_PROMPT.format(
        fit_score=fit_score,
        fit_label_display=label_display_map.get(fit_label, fit_label),
        matched_keywords=", ".join(matched_keywords[:8]),
        missing_keywords=", ".join(missing_keywords[:8]),
        experience_alignment_score=experience_alignment_score,
        project_relevance_score=project_relevance_score,
        red_flag_count=len(red_flags),
        high_severity_count=high_severity,
        role_title=jd_summary.role_title,
    )

    try:
        response = await client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": "You write concise, honest fit summaries. Plain text only.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            timeout=settings.groq_timeout_seconds,
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"Fit explanation generation failed: {e}")
        label_display = label_display_map.get(fit_label, fit_label)
        return (
            f"Based on your resume and the job requirements, you received a {label_display} score "
            f"of {fit_score}/100. Review the keyword matches, missing terms, and tailoring suggestions "
            "below for specific guidance on how to strengthen your application."
        )
