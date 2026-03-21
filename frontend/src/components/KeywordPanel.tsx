"use client";

import { useState } from "react";
import { Keyword, KeywordCategory } from "@/types/analysis";

interface KeywordPanelProps {
  keywords: Keyword[];
  matchedCount: number;
  missingCount: number;
}

const CATEGORY_LABELS: Record<KeywordCategory, string> = {
  must_have: "Must Have",
  nice_to_have: "Nice to Have",
  technical: "Technical",
  soft: "Soft Skill",
};

const CATEGORY_COLORS: Record<KeywordCategory, string> = {
  must_have: "border-red-700 text-red-300 bg-red-950/30",
  nice_to_have: "border-yellow-700 text-yellow-300 bg-yellow-950/30",
  technical: "border-blue-700 text-blue-300 bg-blue-950/30",
  soft: "border-purple-700 text-purple-300 bg-purple-950/30",
};

function KeywordChip({ keyword }: { keyword: Keyword }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <span
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
          border cursor-default transition-all
          ${keyword.matched
            ? "bg-green-900/40 border-green-700 text-green-300"
            : "bg-gray-800/50 border-gray-600 text-gray-400 line-through decoration-red-500/70"
          }
        `}
      >
        {keyword.matched ? "✓" : "✗"} {keyword.term}
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-1.5 z-20 min-w-[160px] max-w-[220px]">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-xs shadow-xl">
            <p className={`font-medium mb-1 ${CATEGORY_COLORS[keyword.category].split(" ")[1]}`}>
              {CATEGORY_LABELS[keyword.category]}
            </p>
            {keyword.matched ? (
              <>
                <p className="text-green-400">✓ Found in resume</p>
                {keyword.matched_as && keyword.matched_as !== keyword.term.toLowerCase() && (
                  <p className="text-gray-400 mt-1">
                    Matched as: <em>"{keyword.matched_as}"</em>
                  </p>
                )}
                {keyword.match_score && keyword.match_score < 100 && (
                  <p className="text-gray-500 mt-0.5">
                    Fuzzy match: {keyword.match_score.toFixed(0)}%
                  </p>
                )}
              </>
            ) : (
              <p className="text-red-400">✗ Not found in resume</p>
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
    const catFilter =
      categoryFilter === "all" || k.category === categoryFilter;
    return matchFilter && catFilter;
  });

  const total = keywords.length;
  const coveragePct = total > 0 ? Math.round((matchedCount / total) * 100) : 0;

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Keyword Analysis</h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-green-400 font-medium">{matchedCount} matched</span>
          <span className="text-gray-600">·</span>
          <span className="text-red-400 font-medium">{missingCount} missing</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-400">{coveragePct}% covered</span>
        </div>
      </div>

      {/* Coverage bar */}
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-700"
          style={{ width: `${coveragePct}%` }}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", "matched", "missing"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="w-px bg-gray-700 mx-1" />
        {(["all", "must_have", "technical", "nice_to_have", "soft"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              categoryFilter === c
                ? "bg-gray-500 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            {c === "all" ? "All types" : CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      {/* Keyword chips */}
      <div className="flex flex-wrap gap-2">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-sm">No keywords match the current filter.</p>
        ) : (
          filtered.map((keyword, i) => (
            <KeywordChip key={`${keyword.term}-${i}`} keyword={keyword} />
          ))
        )}
      </div>
    </div>
  );
}
