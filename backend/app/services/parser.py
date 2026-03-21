"""
Resume parser: extracts raw text from PDF and DOCX files,
then splits the text into named sections.
"""

import io
import re
import logging
from typing import Dict, Tuple

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Section heading patterns (order matters — first match wins)
# ---------------------------------------------------------------------------

SECTION_PATTERNS = [
    ("education", r"\b(education|academic background|academics)\b"),
    ("experience", r"\b(experience|work experience|professional experience|employment|work history)\b"),
    ("projects", r"\b(projects|personal projects|academic projects|side projects|portfolio)\b"),
    ("skills", r"\b(skills|technical skills|core competencies|technologies|tech stack)\b"),
    ("leadership", r"\b(leadership|extracurriculars|activities|clubs|organizations|involvement)\b"),
    ("certifications", r"\b(certifications|certificates|credentials|licenses)\b"),
    ("awards", r"\b(awards|honors|achievements|accomplishments)\b"),
    ("summary", r"\b(summary|objective|profile|about me|professional summary)\b"),
    ("publications", r"\b(publications|research|papers)\b"),
    ("volunteering", r"\b(volunteering|volunteer|community service)\b"),
]

WEAK_ACTION_VERBS = {
    "worked", "helped", "assisted", "participated", "was responsible for",
    "responsible for", "did", "made", "used", "utilized", "handled",
    "dealt with", "involved in", "contributed to", "supported", "managed to",
}


# ---------------------------------------------------------------------------
# PDF extraction
# ---------------------------------------------------------------------------

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF bytes using pdfplumber."""
    try:
        import pdfplumber
        text_parts = []
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
        return "\n".join(text_parts)
    except ImportError:
        raise RuntimeError("pdfplumber not installed. Run: pip install pdfplumber")
    except Exception as e:
        logger.error(f"PDF extraction failed: {e}")
        raise ValueError(f"Could not extract text from PDF: {e}")


# ---------------------------------------------------------------------------
# DOCX extraction
# ---------------------------------------------------------------------------

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX bytes using python-docx."""
    try:
        from docx import Document
        doc = Document(io.BytesIO(file_bytes))
        paragraphs = []
        for para in doc.paragraphs:
            text = para.text.strip()
            if text:
                paragraphs.append(text)
        return "\n".join(paragraphs)
    except ImportError:
        raise RuntimeError("python-docx not installed. Run: pip install python-docx")
    except Exception as e:
        logger.error(f"DOCX extraction failed: {e}")
        raise ValueError(f"Could not extract text from DOCX: {e}")


# ---------------------------------------------------------------------------
# Dispatcher
# ---------------------------------------------------------------------------

def extract_resume_text(file_bytes: bytes, filename: str) -> str:
    """Route to the correct extractor based on file extension."""
    fname = filename.lower()
    if fname.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif fname.endswith(".docx"):
        return extract_text_from_docx(file_bytes)
    elif fname.endswith(".doc"):
        raise ValueError(
            "Legacy .doc format is not supported. Please convert to .docx or .pdf."
        )
    else:
        raise ValueError(f"Unsupported file type: {filename}. Use PDF or DOCX.")


# ---------------------------------------------------------------------------
# Section splitting
# ---------------------------------------------------------------------------

def split_into_sections(raw_text: str) -> Dict[str, str]:
    """
    Split resume text into named sections using heading detection.
    Returns a dict of {section_name: section_text}.
    Falls back to {'full_text': raw_text} if no sections detected.
    """
    lines = raw_text.split("\n")
    sections: Dict[str, list] = {}
    current_section = "header"
    section_order = ["header"]
    sections["header"] = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            sections[current_section].append("")
            continue

        # Check if this line is a section heading
        detected = _detect_section_heading(stripped)
        if detected and len(stripped) < 60:  # headings are usually short
            current_section = detected
            if detected not in sections:
                sections[detected] = []
                section_order.append(detected)
        else:
            sections[current_section].append(stripped)

    # Convert lists to strings, drop empty sections
    result = {}
    for key in section_order:
        text = "\n".join(sections[key]).strip()
        if text:
            result[key] = text

    if len(result) <= 1:
        # No sections detected — return full text
        return {"full_text": raw_text.strip()}

    return result


def _detect_section_heading(line: str) -> str | None:
    """Return canonical section name if line matches a heading pattern."""
    normalized = line.lower().strip(" :-•–—")
    for section_name, pattern in SECTION_PATTERNS:
        if re.fullmatch(pattern, normalized, re.IGNORECASE):
            return section_name
        # Also check if the line IS the heading (entire line matches)
        if re.search(pattern, normalized, re.IGNORECASE) and len(normalized.split()) <= 4:
            return section_name
    return None


# ---------------------------------------------------------------------------
# Quick text stats (used by ATS checker)
# ---------------------------------------------------------------------------

def get_text_stats(raw_text: str) -> Dict:
    """Return basic statistics about the resume text."""
    lines = [l.strip() for l in raw_text.split("\n") if l.strip()]
    bullet_lines = [l for l in lines if l.startswith(("•", "-", "–", "▪", "*", "·"))]
    long_paragraphs = [l for l in lines if len(l.split()) > 40]

    return {
        "total_lines": len(lines),
        "bullet_lines": len(bullet_lines),
        "bullet_ratio": len(bullet_lines) / max(len(lines), 1),
        "long_paragraphs": len(long_paragraphs),
        "char_count": len(raw_text),
        "word_count": len(raw_text.split()),
    }
