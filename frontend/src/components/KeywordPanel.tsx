"use client";

import { useState } from "react";
import { Keyword, KeywordCategory } from "@/types/analysis";
import { cn } from "@/lib/utils";

interface Props { keywords: Keyword[]; matchedCount: number; missingCount: number; }

const CAT: Record<KeywordCategory, string> = {
  must_have: "Must have", nice_to_have: "Nice to have", technical: "Technical", soft: "Soft skill",
};

function Chip({ kw }: { kw: Keyword }) {
  const [tip, setTip] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-150",
          kw.matched
            ? "bg-[var(--green-50)] border-[var(--green-100)] text-[var(--green-700)] hover:border-[var(--green-500)]"
            : "bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-tertiary)] line-through decoration-[var(--red-400)] hover:border-[var(--border-mid)]",
        )}
      >
        <span className="text-[10px]">{kw.matched ? "✓" : "○"}</span>
        {kw.term}
      </button>
      {tip && (
        <div
          className="absolute bottom-full left-0 mb-1.5 z-40 min-w-[160px] text-xs rounded-xl p-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
        >
          <p className="font-medium mb-1" style={{ color: "var(--indigo-600)" }}>{CAT[kw.category]}</p>
          <p style={{ color: kw.matched ? "var(--green-600)" : "var(--red-600)" }}>
            {kw.matched ? "Found in resume" : "Not found in resume"}
          </p>
          {kw.matched_as && kw.matched_as !== kw.term.toLowerCase() && (
            <p className="mt-1" style={{ color: "var(--text-tertiary)" }}>
              Matched as: <em className="not-italic" style={{ color: "var(--text-secondary)" }}>"{kw.matched_as}"</em>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function KeywordPanel({ keywords, matchedCount, missingCount }: Props) {
  const [filter, setFilter] = useState<"all" | "matched" | "missing">("all");
  const [cat, setCat] = useState<KeywordCategory | "all">("all");
  const total = keywords.length;
  const pct = total > 0 ? Math.round((matchedCount / total) * 100) : 0;
  const filtered = keywords.filter(k =>
    (filter === "all" || (filter === "matched" ? k.matched : !k.matched)) &&
    (cat === "all" || k.category === cat)
  );

  const filterBtn = (active: boolean) => cn(
    "px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 border",
    active
      ? "bg-[var(--indigo-50)] border-[var(--indigo-200)] text-[var(--indigo-600)]"
      : "bg-white border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-mid)] hover:text-[var(--text-primary)]"
  );

  return (
    <div className="card-lg p-6 sm:p-7 anim-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Keywords</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>Matched vs missing from the job posting</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-green">{matchedCount} matched</span>
          <span className="badge badge-red">{missingCount} missing</span>
          <span className="badge badge-neutral">{pct}%</span>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-track mb-5">
        <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, var(--indigo-500), var(--green-500))` }} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(["all", "matched", "missing"] as const).map(f => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={filterBtn(filter === f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="hidden sm:block w-px mx-1 self-stretch" style={{ background: "var(--border)" }} />
        {(["all", "must_have", "technical", "nice_to_have", "soft"] as const).map(c => (
          <button key={c} type="button" onClick={() => setCat(c)} className={filterBtn(cat === c)}>
            {c === "all" ? "All types" : CAT[c]}
          </button>
        ))}
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-1.5">
        {filtered.length === 0
          ? <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>No keywords match this filter.</p>
          : filtered.map((kw, i) => <Chip key={`${kw.term}-${i}`} kw={kw} />)
        }
      </div>
    </div>
  );
}
