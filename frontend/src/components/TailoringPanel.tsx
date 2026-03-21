"use client";

import { useState } from "react";
import { TailoringSuggestion } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { ChevronDown, Copy, Check, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 space-y-3">
      <div>
        <p className="text-[10px] text-white/40 mb-1.5 font-semibold uppercase tracking-widest">
          Original
        </p>
        <p className="text-sm text-white/45 leading-relaxed line-through decoration-white/20">
          {original}
        </p>
      </div>

      <div className="flex justify-center py-0.5">
        <div className="h-px w-8 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      </div>

      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <p className="text-[10px] text-emerald-400/90 font-semibold uppercase tracking-widest">
            Suggested
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-[11px] text-white/45 hover:text-white"
            onClick={copyRewrite}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-emerald-100/90 leading-relaxed">{rewritten}</p>
      </div>

      <p className="text-xs text-white/40 border-t border-white/[0.06] pt-3 leading-relaxed">{reason}</p>
    </div>
  );
}

function SuggestionCard({ suggestion }: { suggestion: TailoringSuggestion }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-white/[0.04]"
      >
        <div className="flex items-center gap-2 min-w-0">
          <PenLine className="h-4 w-4 text-violet-300/80 shrink-0" />
          <span className="font-medium text-white text-sm truncate">{suggestion.area}</span>
          {suggestion.bullet_rewrites.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-violet-500/25 bg-violet-500/10 text-violet-200 shrink-0">
              {suggestion.bullet_rewrites.length} rewrite
              {suggestion.bullet_rewrites.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-white/35 shrink-0 transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 space-y-4 border-t border-white/[0.06]">
          <p className="text-sm text-white/65 leading-relaxed pt-4">{suggestion.suggestion}</p>

          {suggestion.keywords_to_add.length > 0 && (
            <div>
              <p className="text-[10px] text-white/40 mb-2 font-semibold uppercase tracking-widest">
                Keywords to weave in
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestion.keywords_to_add.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full border border-cyan-500/25 bg-cyan-500/10 text-cyan-100/90 text-xs"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {suggestion.bullet_rewrites.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">
                Bullet rewrites
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
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-5">
        <div>
          <h3 className="font-semibold text-white tracking-tight">Tailoring suggestions</h3>
          <p className="text-xs text-white/40 mt-1 max-w-xl leading-relaxed">
            Grounded in what you already did — use these to align language with the posting, not to invent
            experience.
          </p>
        </div>
        <span className="text-xs text-white/35 shrink-0">
          {suggestions.length} area{suggestions.length !== 1 ? "s" : ""}
        </span>
      </div>

      {suggestions.length === 0 ? (
        <p className="text-white/40 text-sm">No tailoring suggestions for this run.</p>
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
