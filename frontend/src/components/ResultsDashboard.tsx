import { AnalysisResponse } from "@/types/analysis";
import FitScoreCard from "./FitScoreCard";
import KeywordPanel from "./KeywordPanel";
import RedFlagsPanel from "./RedFlagsPanel";
import ATSWarningsPanel from "./ATSWarningsPanel";
import TailoringPanel from "./TailoringPanel";

interface ResultsDashboardProps {
  result: AnalysisResponse;
}

export default function ResultsDashboard({ result }: ResultsDashboardProps) {
  return (
    <div className="space-y-5">
      {/* 1. Fit score — always first, most important */}
      <FitScoreCard
        score={result.fit_score}
        label={result.fit_label}
        explanation={result.fit_explanation}
        breakdown={result.score_breakdown}
      />

      {/* 2. Keyword analysis */}
      <KeywordPanel
        keywords={result.keywords}
        matchedCount={result.matched_count}
        missingCount={result.missing_count}
      />

      {/* 3-4: Red flags + ATS (side by side on wide screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RedFlagsPanel redFlags={result.red_flags} />
        <ATSWarningsPanel warnings={result.ats_warnings} />
      </div>

      {/* 5. Tailoring suggestions */}
      <TailoringPanel suggestions={result.tailoring_suggestions} />

      {/* 6. Meta info */}
      <div className="flex items-center justify-between text-xs text-gray-600 border-t border-gray-800 pt-4">
        <span>
          Role: <span className="text-gray-500">{result.jd_summary.role_title}</span>
        </span>
        <span>Analyzed in {(result.processing_time_ms / 1000).toFixed(1)}s</span>
      </div>
    </div>
  );
}
