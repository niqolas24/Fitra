"""
Rule-based ATS formatting checker.
Detects common ATS-unfriendly formatting issues from the raw resume text.
No LLM calls — all regex and heuristics.
"""

import re
from typing import List

from app.models.schemas import ATSWarning
from app.services.parser import get_text_stats, SECTION_PATTERNS


STANDARD_SECTIONS = {"experience", "education", "skills", "projects"}

DATE_PATTERNS = [
    r"\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b",  # Jan 2023
    r"\b\d{1,2}/\d{4}\b",                                                # 01/2023
    r"\b\d{4}\s*[-–]\s*\d{4}\b",                                         # 2022-2023
    r"\b\d{4}\s*[-–]\s*(Present|Current|Now)\b",                         # 2022-Present
    r"\b(Q[1-4])\s+\d{4}\b",                                             # Q1 2023
]

SPECIAL_SYMBOLS = re.compile(r"[★✓✔☑✗✘→←↑↓◆■●▶▸◦‣⊕⊗©®™]")

GENERIC_SKILLS = {
    "microsoft office", "ms office", "google docs", "microsoft word",
    "microsoft excel", "powerpoint", "good communication", "team player",
    "hard worker", "fast learner", "detail oriented", "self-motivated",
    "quick learner",
}

WEAK_VERBS_PATTERN = re.compile(
    r"\b(worked|helped|assisted|participated in|was responsible for|"
    r"responsible for|did|made|utilized|handled|dealt with|"
    r"involved in|contributed to|supported|managed to)\b",
    re.IGNORECASE,
)


def check_ats(raw_text: str, resume_sections: dict) -> List[ATSWarning]:
    """Run all ATS checks and return a list of warnings."""
    warnings: List[ATSWarning] = []

    warnings.extend(_check_multi_column(raw_text))
    warnings.extend(_check_tables(raw_text))
    warnings.extend(_check_special_symbols(raw_text))
    warnings.extend(_check_date_formatting(raw_text))
    warnings.extend(_check_long_paragraphs(raw_text))
    warnings.extend(_check_missing_sections(resume_sections))
    warnings.extend(_check_bullet_ratio(raw_text))
    warnings.extend(_check_generic_skills(raw_text))
    warnings.extend(_check_resume_length(raw_text))

    return warnings


def _check_multi_column(text: str) -> List[ATSWarning]:
    """
    Heuristic: if many lines are very short (< 30 chars),
    it may indicate a multi-column layout that ATS cannot read.
    """
    lines = [l for l in text.split("\n") if l.strip()]
    if not lines:
        return []
    short_lines = [l for l in lines if 0 < len(l.strip()) < 30]
    ratio = len(short_lines) / len(lines)

    if ratio > 0.45:
        return [
            ATSWarning(
                type="multi_column_suspected",
                description=(
                    f"{int(ratio*100)}% of resume lines are very short, which may indicate "
                    "a multi-column layout. ATS systems often parse columns incorrectly, "
                    "causing text to merge or be lost."
                ),
                suggestion=(
                    "Use a single-column layout for ATS submissions. "
                    "Multi-column resumes look great visually but fail ATS parsing."
                ),
            )
        ]
    return []


def _check_tables(text: str) -> List[ATSWarning]:
    """Detect table-like formatting (pipe characters, heavy tab usage)."""
    pipe_lines = [l for l in text.split("\n") if l.count("|") >= 2]
    if len(pipe_lines) >= 3:
        return [
            ATSWarning(
                type="table_detected",
                description="Your resume appears to contain tables (detected | characters). "
                            "Most ATS systems cannot parse table content correctly.",
                suggestion="Replace tables with plain bullet lists or simple text sections.",
            )
        ]
    return []


def _check_special_symbols(text: str) -> List[ATSWarning]:
    """Flag non-standard symbols that ATS may fail to parse."""
    matches = SPECIAL_SYMBOLS.findall(text)
    if len(matches) >= 3:
        unique = list(set(matches))[:5]
        return [
            ATSWarning(
                type="special_symbols",
                description=f"Found {len(matches)} special symbols ({', '.join(unique)}) "
                            "that ATS systems may not parse correctly or may display as garbage characters.",
                suggestion="Replace decorative symbols with standard bullet characters (• or -) "
                           "or remove them entirely.",
            )
        ]
    return []


def _check_date_formatting(text: str) -> List[ATSWarning]:
    """Check if multiple date formats are mixed in the same resume."""
    found_formats = set()
    for pattern in DATE_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            found_formats.add(pattern)

    if len(found_formats) >= 3:
        return [
            ATSWarning(
                type="inconsistent_date_format",
                description="Multiple date formats detected (e.g. mixing Jan 2023, 01/2023, and 2022-2023). "
                            "This signals lack of attention to detail.",
                suggestion="Pick one date format and use it consistently throughout. "
                           "Recommended: 'Month Year – Month Year' (e.g. May 2022 – Aug 2022).",
            )
        ]
    return []


def _check_long_paragraphs(text: str) -> List[ATSWarning]:
    """Flag long paragraph-style text instead of bullets."""
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    long_lines = [l for l in lines if len(l.split()) > 35 and not l.startswith(("#", "http"))]

    if len(long_lines) >= 2:
        return [
            ATSWarning(
                type="long_paragraphs",
                description=f"Found {len(long_lines)} line(s) with 35+ words. "
                            "Resumes should use concise bullet points, not paragraphs.",
                suggestion="Break long text into 1–2 line bullet points. "
                           "Each bullet should describe one specific contribution or achievement.",
            )
        ]
    return []


def _check_missing_sections(resume_sections: dict) -> List[ATSWarning]:
    """Flag if standard required sections are absent."""
    detected = set(resume_sections.keys())
    missing = STANDARD_SECTIONS - detected

    if "full_text" in detected:
        # Section splitting failed — can't evaluate
        return []

    if missing:
        return [
            ATSWarning(
                type="missing_standard_sections",
                description=f"Could not detect the following standard sections: {', '.join(sorted(missing))}. "
                            "ATS systems expect clearly labeled sections.",
                suggestion=f"Add clearly labeled section headers for: {', '.join(sorted(missing))}. "
                           "Use plain text headings like 'EXPERIENCE' or 'Education' — avoid icons or stylized headers.",
            )
        ]
    return []


def _check_bullet_ratio(text: str) -> List[ATSWarning]:
    """Flag resumes with very few bullets (may be using paragraphs or tables)."""
    stats = get_text_stats(text)
    if stats["word_count"] > 200 and stats["bullet_ratio"] < 0.10:
        return [
            ATSWarning(
                type="low_bullet_usage",
                description=f"Only {int(stats['bullet_ratio']*100)}% of lines start with bullet characters. "
                            "Experience and project sections should use bullet points.",
                suggestion="Use bullet points (starting with • or -) for all experience and project descriptions. "
                           "Each bullet = one accomplishment.",
            )
        ]
    return []


def _check_generic_skills(text: str) -> List[ATSWarning]:
    """Flag overly generic skills that add no signal."""
    text_lower = text.lower()
    found_generic = [skill for skill in GENERIC_SKILLS if skill in text_lower]

    if len(found_generic) >= 2:
        return [
            ATSWarning(
                type="generic_skills_detected",
                description=f"Found generic/filler skills: {', '.join(found_generic[:4])}. "
                            "These phrases are meaningless to recruiters and waste resume space.",
                suggestion="Remove generic skills. Replace with specific tools, frameworks, or "
                           "measurable competencies (e.g. 'Python (3 years)' instead of 'programming').",
            )
        ]
    return []


def _check_resume_length(text: str) -> List[ATSWarning]:
    """Flag resumes that are too short or too long."""
    word_count = len(text.split())
    warnings = []

    if word_count < 150:
        warnings.append(
            ATSWarning(
                type="resume_too_short",
                description=f"Resume contains only ~{word_count} words. "
                            "This is too sparse to pass ATS screening or impress recruiters.",
                suggestion="Add more detail to your experience and project descriptions. "
                           "Aim for 400–700 words for a 1-page resume.",
            )
        )
    elif word_count > 1000:
        warnings.append(
            ATSWarning(
                type="resume_too_long",
                description=f"Resume contains ~{word_count} words, which likely exceeds 1 page. "
                            "For students and early-career candidates, 1 page is the standard.",
                suggestion="Edit down to the most relevant and recent content. "
                           "Remove content older than 4–5 years or unrelated to your target role.",
            )
        )

    return warnings
