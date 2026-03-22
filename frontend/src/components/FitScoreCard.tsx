"use client";

import { FitLabel, ScoreBreakdown } from "@/types/analysis";

interface Props { score: number; label: FitLabel; explanation: string; breakdown: ScoreBreakdown; }

const CFG = {
  strong_fit:   { text: "Strong fit",   color: "var(--green-600)",  bg: "var(--green-50)",  border: "var(--green-100)", scoreColor: "#16a34a" },
  moderate_fit: { text: "Moderate fit", color: "var(--amber-600)",  bg: "var(--amber-50)",  border: "var(--amber-100)", scoreColor: "#d97706" },
  weak_fit:     { text: "Weak fit",     color: "var(--red-600)",    bg: "var(--red-50)",    border: "var(--red-100)",   scoreColor: "#dc2626" },
};

const BARS = [
  { label: "Keyword coverage",    key: "keyword_coverage" as const,    max: 40, color: "var(--indigo-500)" },
  { label: "Must-have coverage",  key: "must_have_coverage" as const,  max: 40, color: "#8b5cf6" },
  { label: "Experience alignment",key: "experience_alignment" as const, max: 30, color: "var(--green-500)" },
  { label: "Project relevance",   key: "project_relevance" as const,   max: 20, color: "#f59e0b" },
  { label: "Baseline",            key: "baseline" as const,            max: 10, color: "var(--border-strong)" },
  { label: "Red flag penalty",    key: "red_flag_penalty" as const,    max: 20, color: "var(--red-500)" },
];

export default function FitScoreCard({ score, label, explanation, breakdown }: Props) {
  const cfg = CFG[label];
  const clamped = Math.max(0, Math.min(100, score));
  const r = 52; const circ = 2 * Math.PI * r;
  const offset = circ - (clamped / 100) * circ;

  return (
    <div className="card-lg p-6 sm:p-7 anim-fade-up overflow-hidden relative">
      {/* Subtle top stripe */}
      <div className="absolute top-0 inset-x-0 h-0.5 rounded-t-[20px]" style={{ background: cfg.scoreColor, opacity: 0.5 }} />

      <div className="flex flex-col lg:flex-row gap-7 lg:gap-10 items-start">
        {/* Left: score ring */}
        <div className="flex flex-col items-center gap-3 w-full lg:w-auto lg:min-w-[160px]">
          <p className="section-label">Job fit</p>
          <div className="relative w-[130px] h-[130px]">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={r} fill="none" stroke="var(--bg-subtle)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r={r} fill="none"
                stroke={cfg.scoreColor} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={offset}
                className="anim-draw"
                style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tabular-nums" style={{ color: cfg.scoreColor }}>{clamped}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>/ 100</span>
            </div>
          </div>
          <span className="badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
            {cfg.text}
          </span>
        </div>

        {/* Right: explanation + breakdown */}
        <div className="flex-1 min-w-0 space-y-5">
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{explanation}</p>

          <div className="space-y-2.5 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="section-label mb-3">Score breakdown</p>
            {BARS.map(({ label: bl, key, max, color }) => {
              const val = breakdown[key] ?? 0;
              const pct = Math.max(0, Math.min(100, (Math.abs(val) / max) * 100));
              return (
                <div key={key} className="flex items-center gap-3 text-xs">
                  <span className="w-36 shrink-0" style={{ color: "var(--text-secondary)" }}>{bl}</span>
                  <div className="flex-1 progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span className="w-10 text-right tabular-nums font-medium" style={{ color: "var(--text-primary)" }}>
                    {val >= 0 ? "+" : ""}{val.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
