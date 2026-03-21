"use client";

import { FitLabel, ScoreBreakdown } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface FitScoreCardProps {
  score: number;
  label: FitLabel;
  explanation: string;
  breakdown: ScoreBreakdown;
}

const LABEL_CONFIG: Record<
  FitLabel,
  { text: string; badge: "success" | "warning" | "danger"; stroke: string; glow: string }
> = {
  strong_fit: {
    text: "Strong fit",
    badge: "success",
    stroke: "#34d399",
    glow: "rgba(52, 211, 153, 0.25)",
  },
  moderate_fit: {
    text: "Moderate fit",
    badge: "warning",
    stroke: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.2)",
  },
  weak_fit: {
    text: "Weak fit",
    badge: "danger",
    stroke: "#f87171",
    glow: "rgba(248, 113, 113, 0.2)",
  },
};

function ScoreGauge({ score, label }: { score: number; label: FitLabel }) {
  const circumference = 2 * Math.PI * 52;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;
  const cfg = LABEL_CONFIG[label];

  return (
    <div
      className="relative w-40 h-40 shrink-0"
      style={{ filter: `drop-shadow(0 0 24px ${cfg.glow})` }}
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke={cfg.stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        <span className="text-4xl font-semibold tracking-tight text-white tabular-nums">{clamped}</span>
        <span className="text-[11px] font-medium uppercase tracking-widest text-white/40">% match</span>
      </div>
    </div>
  );
}

function BreakdownBar({
  label,
  value,
  max,
  colorClass,
}: {
  label: string;
  value: number;
  max: number;
  colorClass: string;
}) {
  const pct = Math.max(0, Math.min(100, (Math.abs(value) / max) * 100));
  return (
    <div className="flex items-center gap-3 text-xs group">
      <span className="text-white/45 w-36 sm:w-40 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-white/70 w-14 text-right tabular-nums">
        {value >= 0 ? "+" : ""}
        {value.toFixed(1)}
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
  const pct = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-white/[0.06] via-zinc-950/40 to-violet-500/[0.08] p-6 sm:p-8 shadow-glow">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 100% 0%, rgba(139, 92, 246, 0.2), transparent 55%)",
        }}
        aria-hidden
      />

      <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-10 items-start lg:items-center">
        <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-white/50 text-xs font-medium uppercase tracking-wider">
            <TrendingUp className="h-3.5 w-3.5 text-violet-300/80" />
            Job qualification
          </div>
          <ScoreGauge score={score} label={label} />
          <div className="flex flex-col items-center gap-2">
            <Badge variant={config.badge} className="px-3 py-0.5 text-[11px] font-semibold">
              {config.text}
            </Badge>
            <p className="text-center text-sm text-white/55 max-w-[220px] leading-snug">
              You align with roughly <span className="text-white font-medium">{pct}%</span> of what this
              role is signaling — based on keywords, experience fit, and resume quality.
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-5 min-w-0 w-full">
          <p className="text-white/75 text-sm sm:text-[15px] leading-relaxed">{explanation}</p>

          <div className="space-y-3 pt-4 border-t border-white/[0.08]">
            <p className="text-[11px] text-white/40 font-semibold uppercase tracking-widest">
              Score breakdown
            </p>
            <div className="space-y-2.5">
              <BreakdownBar
                label="Keyword coverage"
                value={breakdown.keyword_coverage}
                max={40}
                colorClass="bg-gradient-to-r from-blue-500 to-cyan-400"
              />
              <BreakdownBar
                label="Must-have coverage"
                value={breakdown.must_have_coverage}
                max={40}
                colorClass="bg-gradient-to-r from-violet-500 to-fuchsia-400"
              />
              <BreakdownBar
                label="Experience alignment"
                value={breakdown.experience_alignment}
                max={30}
                colorClass="bg-gradient-to-r from-indigo-500 to-violet-400"
              />
              <BreakdownBar
                label="Project relevance"
                value={breakdown.project_relevance}
                max={20}
                colorClass="bg-gradient-to-r from-emerald-500 to-teal-400"
              />
              <BreakdownBar
                label="Baseline"
                value={breakdown.baseline}
                max={10}
                colorClass="bg-white/30"
              />
              <BreakdownBar
                label="Red flag penalty"
                value={breakdown.red_flag_penalty}
                max={20}
                colorClass="bg-gradient-to-r from-red-500 to-rose-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
