"use client";

import { FitLabel, ScoreBreakdown } from "@/types/analysis";

interface FitScoreCardProps {
  score: number;
  label: FitLabel;
  explanation: string;
  breakdown: ScoreBreakdown;
}

const LABEL_CONFIG: Record<FitLabel, { text: string; color: string; bg: string }> = {
  strong_fit: {
    text: "Strong Fit",
    color: "text-green-400",
    bg: "bg-green-900/30 border-green-700",
  },
  moderate_fit: {
    text: "Moderate Fit",
    color: "text-yellow-400",
    bg: "bg-yellow-900/30 border-yellow-700",
  },
  weak_fit: {
    text: "Weak Fit",
    color: "text-red-400",
    bg: "bg-red-900/30 border-red-700",
  },
};

function ScoreGauge({ score, label }: { score: number; label: FitLabel }) {
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;
  const strokeColor =
    label === "strong_fit"
      ? "#22c55e"
      : label === "moderate_fit"
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        {/* Track */}
        <circle cx="60" cy="60" r="52" fill="none" stroke="#1f2937" strokeWidth="10" />
        {/* Score arc */}
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-gray-500">/ 100</span>
      </div>
    </div>
  );
}

function BreakdownBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.max(0, Math.min(100, (Math.abs(value) / max) * 100));
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-gray-400 w-40 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-gray-300 w-14 text-right">
        {value >= 0 ? "+" : ""}
        {value.toFixed(1)} pts
      </span>
    </div>
  );
}

export default function FitScoreCard({
  score,
  label,
  explanation,
  breakdown,
}: FitScoreCardProps) {
  const config = LABEL_CONFIG[label];

  return (
    <div className={`rounded-xl border p-6 ${config.bg}`}>
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Gauge */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <ScoreGauge score={score} label={label} />
          <span className={`text-sm font-semibold ${config.color}`}>
            {config.text}
          </span>
        </div>

        {/* Explanation + breakdown */}
        <div className="flex-1 space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed">{explanation}</p>

          <div className="space-y-2 pt-2 border-t border-gray-700/50">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">
              Score breakdown
            </p>
            <BreakdownBar
              label="Keyword coverage"
              value={breakdown.keyword_coverage}
              max={40}
              color="bg-blue-500"
            />
            <BreakdownBar
              label="Experience alignment"
              value={breakdown.experience_alignment}
              max={30}
              color="bg-purple-500"
            />
            <BreakdownBar
              label="Project relevance"
              value={breakdown.project_relevance}
              max={20}
              color="bg-indigo-500"
            />
            <BreakdownBar
              label="Baseline"
              value={breakdown.baseline}
              max={10}
              color="bg-gray-500"
            />
            <BreakdownBar
              label="Red flag penalty"
              value={breakdown.red_flag_penalty}
              max={20}
              color="bg-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
