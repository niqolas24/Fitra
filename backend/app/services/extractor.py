"""
LLM-based structured extraction from the job description.
Calls Gemini once to get a fully structured JD analysis.
"""

import json
import logging
import asyncio
import google.generativeai as genai

from app.config import get_settings
from app.models.schemas import JDSummary

logger = logging.getLogger(__name__)

JD_EXTRACTION_PROMPT = """You are an expert technical recruiter and NLP specialist.

Analyze the following job description and extract structured information.
Return ONLY valid JSON matching the schema below. Do not include any text before or after the JSON.

SCHEMA:
{{
  "role_title": "string",
  "company_type": "string",
  "required_skills": ["string"],
  "preferred_skills": ["string"],
  "technical_tools": ["string"],
  "soft_skills": ["string"],
  "action_verbs": ["string"],
  "key_responsibilities": ["string"],
  "qualifications": ["string"],
  "must_have_keywords": ["string"],
  "nice_to_have_keywords": ["string"],
  "experience_alignment_criteria": "string",
  "project_relevance_criteria": "string"
}}

DEFINITIONS:
- must_have_keywords: The top 10-15 terms an ATS or recruiter would look for first.
  Include exact terms and common abbreviations (e.g. "machine learning" and "ML").
- nice_to_have_keywords: Useful but not disqualifying if absent.
- experience_alignment_criteria: A 1-2 sentence description of the ideal candidate's experience background.
- project_relevance_criteria: A 1-2 sentence description of what projects would most impress a reviewer.

JOB DESCRIPTION:
{job_description}"""


async def extract_job_description(job_description: str) -> JDSummary:
    """
    Call Gemini to extract structured data from a job description.
    Returns a validated JDSummary object.
    """
    settings = get_settings()
    genai.configure(api_key=settings.gemini_api_key)

    model = genai.GenerativeModel(
        model_name=settings.gemini_model,
        generation_config=genai.GenerationConfig(
            temperature=0.1,
            response_mime_type="application/json",
        ),
        system_instruction="You are a precise JSON extraction engine. Always return valid JSON only.",
    )

    prompt = JD_EXTRACTION_PROMPT.format(job_description=job_description)

    try:
        response = await asyncio.wait_for(
            asyncio.get_event_loop().run_in_executor(
                None, lambda: model.generate_content(prompt)
            ),
            timeout=settings.gemini_timeout_seconds,
        )

        raw_json = response.text
        data = json.loads(raw_json)
        return JDSummary(**data)

    except json.JSONDecodeError as e:
        logger.error(f"JD extraction: JSON parse error: {e}")
        raise ValueError(f"LLM returned invalid JSON for JD extraction: {e}")
    except Exception as e:
        logger.error(f"JD extraction failed: {e}")
        raise RuntimeError(f"Job description extraction failed: {e}")
