"use client";

import { useState } from "react";
import { Keyword, KeywordCategory } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";
import { Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface KeywordPanelProps {
  keywords: Keyword[];
  matchedCount: number;
  missingCount: number;
}

const CATEGORY_LABELS: Record<KeywordCategory, string> = {
  must_have: "Must have",
  nice_to_have: "Nice to have",
  technical: "Technical",
  soft: "Soft skill",
};

const CATEGORY_TITLE: Record<KeywordCategory, string> = {
  must_have: "text-rose-300",
  nice_to_have: "text-amber-300",
  technical: "text-sky-300",
  soft: "text-violet-300",
};

function KeywordChip({ keyword }: { keyword: Keyword }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
          keyword.matched
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200/95 hover:bg-emerald-500/15"
            : "bg-white/[0.03] border-white/10 text-white/45 line-through decoration-red-400/50 hover:border-white/15",
        )}
      >
        <span className="tabular-nums opacity-70">{keyword.matched ? "✓" : "○"}</span>
        {keyword.term}
      </button>

      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 z-30 min-w-[180px] max-w-[260px]">
          <div className="rounded-xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl p-3 text-xs shadow-xl">
            <p className={cn("font-semibold mb-1.5", CATEGORY_TITLE[keyword.category])}>
              {CATEGORY_LABELS[keyword.category]}
            </p>
            {keyword.matched ? (
              <>
                <p className="text-emerald-400/90">Found in resume</p>
                {keyword.matched_as && keyword.matched_as !== keyword.term.toLowerCase() && (
                  <p className="text-white/45 mt-1.5">
                    Matched as: <em className="text-white/70 not-italic">&quot;{keyword.matched_as}&quot;</em>
                  </p>
                )}
                {keyword.match_score != null && keyword.match_score < 100 && (
                  <p className="text-white/35 mt-1">Fuzzy match: {keyword.match_score.toFixed(0)}%</p>
                )}
              </>
            ) : (
              <p className="text-red-400/85">Not surfaced in resume</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function KeywordPanel({
  keywords,
  matchedCount,
  missingCount,
}: KeywordPanelProps) {
  const [filter, setFilter] = useState<"all" | "matched" | "missing">("all");
  const [categoryFilter, setCategoryFilter] = useState<KeywordCategory | "all">("all");

  const filtered = keywords.filter((k) => {
    const matchFilter =
      filter === "all" || (filter === "matched" ? k.matched : !k.matched);
    const catFilter = categoryFilter === "all" || k.category === categoryFilter;
    return matchFilter && catFilter;
  });

  const total = keywords.length;
  const coveragePct = total > 0 ? Math.round((matchedCount / total) * 100) : 0;

  const filterBtn = (active: boolean) =>
    cn(
      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
      active
        ? "bg-white/10 text-white border border-white/15 shadow-sm"
        : "bg-transparent text-white/45 border border-transparent hover:text-white/70 hover:bg-white/[0.04]",
    );

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-6 sm:p-7 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <Hash className="h-4 w-4 text-cyan-300/90" />
          </span>
          <div>
            <h3 className="font-semibold text-white tracking-tight">Keywords</h3>
            <p className="text-xs text-white/40 mt-0.5">Matched vs missing from the posting</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="success" className="font-medium">
            {matchedCount} matched
          </Badge>
          <Badge variant="danger" className="font-medium">
            {missingCount} missing
          </Badge>
          <Badge variant="outline" className="text-white/55 border-white/15">
            {coveragePct}% coverage
          </Badge>
        </div>
      </div>

      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-6">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-400 transition-all duration-700 ease-out"
          style={{ width: `${coveragePct}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(["all", "matched", "missing"] as const).map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={filterBtn(filter === f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="hidden sm:inline w-px h-6 bg-white/10 mx-1 self-center" />
        {(["all", "must_have", "technical", "nice_to_have", "soft"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategoryFilter(c)}
            className={filterBtn(categoryFilter === c)}
          >
            {c === "all" ? "All types" : CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {filtered.length === 0 ? (
          <p className="text-white/40 text-sm py-2">No keywords match the current filter.</p>
        ) : (
          filtered.map((keyword, i) => <KeywordChip key={`${keyword.term}-${i}`} keyword={keyword} />)
        )}
      </div>
    </div>
  );
}
