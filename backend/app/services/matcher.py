"""
Keyword matching: deterministic comparison of JD keywords against resume text.
Uses RapidFuzz for fuzzy matching to handle:
  - Abbreviations (ML vs machine learning)
  - Minor typos
  - Plural forms (Python libraries vs Python library)
  - Compound terms (version control vs git version control)
"""

import logging
from typing import List, Tuple
from rapidfuzz import fuzz, process

from app.config import get_settings
from app.models.schemas import JDSummary, Keyword

logger = logging.getLogger(__name__)


def _get_resume_tokens(resume_text: str) -> List[str]:
    """
    Break resume text into overlapping n-gram tokens for matching.
    Returns unigrams + bigrams + trigrams in lowercase.
    """
    words = resume_text.lower().split()
    tokens = []

    # Unigrams
    tokens.extend(words)

    # Bigrams
    tokens.extend(f"{words[i]} {words[i+1]}" for i in range(len(words) - 1))

    # Trigrams
    tokens.extend(
        f"{words[i]} {words[i+1]} {words[i+2]}"
        for i in range(len(words) - 2)
    )

    return list(set(tokens))  # deduplicate


def match_keyword(
    keyword: str,
    resume_tokens: List[str],
    threshold: int,
) -> Tuple[bool, float, str | None]:
    """
    Try to match a single keyword against resume tokens.
    Returns: (matched, score, matched_as)
    """
    keyword_lower = keyword.lower().strip()

    # 1. Exact match first (fast path)
    if keyword_lower in resume_tokens:
        return True, 100.0, keyword_lower

    # 2. Fuzzy match using token_sort_ratio (handles word order differences)
    result = process.extractOne(
        keyword_lower,
        resume_tokens,
        scorer=fuzz.token_sort_ratio,
        score_cutoff=threshold,
    )

    if result:
        matched_token, score, _ = result
        return True, float(score), matched_token

    # 3. Partial ratio for longer phrases (e.g. "machine learning frameworks")
    result2 = process.extractOne(
        keyword_lower,
        resume_tokens,
        scorer=fuzz.partial_ratio,
        score_cutoff=threshold + 5,  # Slightly higher threshold for partials
    )

    if result2:
        matched_token, score, _ = result2
        return True, float(score), matched_token

    return False, 0.0, None


def build_keyword_list(jd_summary: JDSummary, resume_text: str) -> List[Keyword]:
    """
    Build a unified keyword list from JD, matched against the resume.
    Categories: must_have, nice_to_have, technical, soft
    """
    settings = get_settings()
    threshold = settings.fuzzy_match_threshold
    resume_tokens = _get_resume_tokens(resume_text)

    all_keywords: List[Keyword] = []
    seen_terms: set[str] = set()

    def add_keywords(terms: List[str], category: str) -> None:
        for term in terms:
            term_clean = term.strip().lower()
            if not term_clean or term_clean in seen_terms:
                continue
            seen_terms.add(term_clean)

            matched, score, matched_as = match_keyword(term_clean, resume_tokens, threshold)
            all_keywords.append(
                Keyword(
                    term=term,
                    category=category,  # type: ignore
                    matched=matched,
                    match_score=round(score, 1) if matched else None,
                    matched_as=matched_as,
                )
            )

    # Process in priority order
    add_keywords(jd_summary.must_have_keywords, "must_have")
    add_keywords(jd_summary.technical_tools, "technical")
    add_keywords(jd_summary.nice_to_have_keywords, "nice_to_have")
    add_keywords(jd_summary.soft_skills, "soft")

    # Deduplicate required vs preferred (required wins if term appears in both)
    required_set = {k.lower() for k in jd_summary.required_skills}
    preferred_set = {k.lower() for k in jd_summary.preferred_skills}

    for kw in (jd_summary.required_skills + jd_summary.preferred_skills):
        kw_clean = kw.strip().lower()
        if kw_clean in seen_terms:
            continue
        seen_terms.add(kw_clean)
        category = "must_have" if kw_clean in required_set else "nice_to_have"
        matched, score, matched_as = match_keyword(kw_clean, resume_tokens, threshold)
        all_keywords.append(
            Keyword(
                term=kw,
                category=category,  # type: ignore
                matched=matched,
                match_score=round(score, 1) if matched else None,
                matched_as=matched_as,
            )
        )

    logger.info(
        f"Keyword matching: {sum(k.matched for k in all_keywords)} matched / "
        f"{len(all_keywords)} total"
    )

    return all_keywords


def get_missing_keywords(keywords: List[Keyword]) -> List[str]:
    """Return list of unmatched keyword terms."""
    return [k.term for k in keywords if not k.matched]


def get_matched_keywords(keywords: List[Keyword]) -> List[Keyword]:
    """Return only matched keyword objects."""
    return [k for k in keywords if k.matched]
