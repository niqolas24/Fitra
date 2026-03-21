"""
LLM-based structured extraction from the job description.
Calls OpenAI once to get a fully structured JD analysis.
"""

import json
import logging
from openai import AsyncOpenAI

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
    Call the LLM to extract structured data from a job description.
    Returns a validated JDSummary object.
    """
    settings = get_settings()
    client = AsyncOpenAI(api_key=settings.openai_api_key)

    prompt = JD_EXTRACTION_PROMPT.format(job_description=job_description)

    try:
        response = await client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise JSON extraction engine. Always return valid JSON only.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.1,  # Low temp for consistent structured extraction
            response_format={"type": "json_object"},
            timeout=settings.openai_timeout_seconds,
        )

        raw_json = response.choices[0].message.content
        data = json.loads(raw_json)
        return JDSummary(**data)

    except json.JSONDecodeError as e:
        logger.error(f"JD extraction: JSON parse error: {e}")
        raise ValueError(f"LLM returned invalid JSON for JD extraction: {e}")
    except Exception as e:
        logger.error(f"JD extraction failed: {e}")
        raise RuntimeError(f"Job description extraction failed: {e}")
