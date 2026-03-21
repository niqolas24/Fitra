"use client";

import { useState } from "react";
import { TailoringSuggestion } from "@/types/analysis";

interface TailoringPanelProps {
  suggestions: TailoringSuggestion[];
}

function BulletRewriteCard({
  original,
  rewritten,
  reason,
}: {
  original: string;
  rewritten: string;
  reason: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyRewrite = async () => {
    await navigator.clipboard.writeText(rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900/60 rounded-lg p-4 space-y-3 border border-gray-700/50">
      {/* Before */}
      <div>
        <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">
          Original
        </p>
        <p className="text-sm text-gray-400 leading-relaxed line-through decoration-red-500/50">
          {original}
        </p>
      </div>

      {/* Arrow */}
      <div className="text-gray-600 text-center">↓</div>

      {/* After */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <p className="text-xs text-green-500 font-medium uppercase tracking-wide">
            Suggested Rewrite
          </p>
          <button
            onClick={copyRewrite}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <p className="text-sm text-green-300 leading-relaxed">{rewritten}</p>
      </div>

      {/* Reason */}
      <p className="text-xs text-gray-500 italic border-t border-gray-700/50 pt-2">
        💡 {reason}
      </p>
    </div>
  );
}

function SuggestionCard({ suggestion }: { suggestion: TailoringSuggestion }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-blue-400">◆</span>
          <span className="font-medium text-white text-sm">{suggestion.area}</span>
          {suggestion.bullet_rewrites.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-400">
              {suggestion.bullet_rewrites.length} rewrite{suggestion.bullet_rewrites.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <span className="text-gray-500 text-sm">{expanded ? "▲" : "▼"}</span>
      </button>

      {/* Body */}
      {expanded && (
        <div className="p-4 space-y-4 bg-gray-900/30">
          {/* Main suggestion */}
          <p className="text-sm text-gray-300 leading-relaxed">{suggestion.suggestion}</p>

          {/* Keywords to add */}
          {suggestion.keywords_to_add.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                Keywords to weave in naturally
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestion.keywords_to_add.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full bg-blue-900/30 border border-blue-700/50 text-blue-300 text-xs"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bullet rewrites */}
          {suggestion.bullet_rewrites.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Bullet Rewrites
              </p>
              {suggestion.bullet_rewrites.map((rewrite, i) => (
                <BulletRewriteCard key={i} {...rewrite} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TailoringPanel({ suggestions }: TailoringPanelProps) {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">Tailoring Suggestions</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            All suggestions are grounded in your existing experience — nothing is invented.
          </p>
        </div>
        <span className="text-xs text-gray-500">
          {suggestions.length} area{suggestions.length !== 1 ? "s" : ""}
        </span>
      </div>

      {suggestions.length === 0 ? (
        <p className="text-gray-500 text-sm">No tailoring suggestions generated.</p>
      ) : (
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <SuggestionCard key={i} suggestion={s} />
          ))}
        </div>
      )}
    </div>
  );
}
