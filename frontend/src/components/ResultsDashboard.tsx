"use client";

import { AnalysisResponse } from "@/types/analysis";
import FitScoreCard from "./FitScoreCard";
import KeywordPanel from "./KeywordPanel";
import RedFlagsPanel from "./RedFlagsPanel";
import ATSWarningsPanel from "./ATSWarningsPanel";
import TailoringPanel from "./TailoringPanel";

interface Props { result: AnalysisResponse; }

export default function ResultsDashboard({ result }: Props) {
  return (
    <div className="space-y-5">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RedFlagsPanel redFlags={result.red_flags} />
        <ATSWarningsPanel warnings={result.ats_warnings} />
      </div>
      <TailoringPanel suggestions={result.tailoring_suggestions} />
    </div>
  );
}
