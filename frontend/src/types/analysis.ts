// TypeScript types mirroring the FastAPI Pydantic schemas

export type FitLabel = "strong_fit" | "moderate_fit" | "weak_fit";
export type KeywordCategory = "must_have" | "nice_to_have" | "technical" | "soft";
export type RedFlagSeverity = "high" | "medium" | "low";

export interface Keyword {
  term: string;
  category: KeywordCategory;
  matched: boolean;
  match_score: number | null;
  matched_as: string | null;
}

export interface RedFlag {
  type: string;
  description: string;
  severity: RedFlagSeverity;
  location: string | null;
}

export interface ATSWarning {
  type: string;
  description: string;
  suggestion: string;
}

export interface BulletRewrite {
  original: string;
  rewritten: string;
  reason: string;
}

export interface TailoringSuggestion {
  area: string;
  suggestion: string;
  keywords_to_add: string[];
  bullet_rewrites: BulletRewrite[];
}

export interface ScoreBreakdown {
  keyword_coverage: number;
  must_have_coverage: number;
  experience_alignment: number;
  project_relevance: number;
  baseline: number;
  red_flag_penalty: number;
}

export interface JDSummary {
  role_title: string;
  company_type: string | null;
  required_skills: string[];
  preferred_skills: string[];
  technical_tools: string[];
  soft_skills: string[];
  action_verbs: string[];
  key_responsibilities: string[];
  qualifications: string[];
  must_have_keywords: string[];
  nice_to_have_keywords: string[];
  experience_alignment_criteria: string | null;
  project_relevance_criteria: string | null;
}

export interface AnalysisResponse {
  fit_score: number;
  fit_label: FitLabel;
  fit_explanation: string;
  score_breakdown: ScoreBreakdown;
  keywords: Keyword[];
  matched_count: number;
  missing_count: number;
  resume_sections: Record<string, string>;
  red_flags: RedFlag[];
  ats_warnings: ATSWarning[];
  tailoring_suggestions: TailoringSuggestion[];
  jd_summary: JDSummary;
  processing_time_ms: number;
}

export interface AnalysisState {
  status: "idle" | "loading" | "success" | "error";
  result: AnalysisResponse | null;
  error: string | null;
}
