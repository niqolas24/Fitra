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
    <div className="space-y-6 sm:space-y-8">
      <FitScoreCard
        score={result.fit_score}
        label={result.fit_label}
        explanation={result.fit_explanation}
        breakdown={result.score_breakdown}
      />

      <KeywordPanel
        keywords={result.keywords}
        matchedCount={result.matched_count}
        missingCount={result.missing_count}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
        <RedFlagsPanel redFlags={result.red_flags} />
        <ATSWarningsPanel warnings={result.ats_warnings} />
      </div>

      <TailoringPanel suggestions={result.tailoring_suggestions} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-white/35 border-t border-white/[0.06] pt-6">
        <span>
          Role focus:{" "}
          <span className="text-white/55">{result.jd_summary.role_title}</span>
        </span>
        <span className="tabular-nums">Analyzed in {(result.processing_time_ms / 1000).toFixed(1)}s</span>
      </div>
    </div>
  );
}
