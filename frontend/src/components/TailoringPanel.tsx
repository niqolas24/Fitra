"use client";

import { useState } from "react";
import { TailoringSuggestion } from "@/types/analysis";
import { ChevronDown, Copy, Check, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { suggestions: TailoringSuggestion[]; }

function RewriteCard({ original, rewritten, reason }: { original: string; rewritten: string; reason: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(rewritten); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      <div className="px-4 py-3" style={{ background: "var(--red-50)", borderBottom: "1px solid var(--red-100)" }}>
        <p className="section-label mb-1.5">Original</p>
        <p className="text-xs leading-relaxed line-through" style={{ color: "var(--text-tertiary)", textDecorationColor: "var(--red-300)" }}>{original}</p>
      </div>
      <div className="px-4 py-3" style={{ background: "var(--green-50)" }}>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <p className="section-label" style={{ color: "var(--green-700)" }}>Suggested</p>
          <button type="button" onClick={copy} className="btn-ghost py-0.5 px-2 text-[11px] rounded-lg gap-1"
            style={{ color: copied ? "var(--green-600)" : "var(--text-tertiary)", fontSize: "11px" }}>
            {copied ? <><Check className="h-3 w-3" />Copied</> : <><Copy className="h-3 w-3" />Copy</>}
          </button>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--green-700)" }}>{rewritten}</p>
      </div>
      {reason && (
        <div className="px-4 py-2.5" style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)" }}>
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>{reason}</p>
        </div>
      )}
    </div>
  );
}

function SuggestionCard({ s, index }: { s: TailoringSuggestion; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-[var(--bg-subtle)]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-semibold text-white shrink-0"
            style={{ background: "var(--indigo-600)" }}
          >
            {index + 1}
          </span>
          <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{s.area}</span>
          {s.bullet_rewrites.length > 0 && (
            <span className="badge badge-indigo shrink-0">{s.bullet_rewrites.length} rewrite{s.bullet_rewrites.length !== 1 ? "s" : ""}</span>
          )}
        </div>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform duration-200", open && "rotate-180")}
          style={{ color: "var(--text-tertiary)" }}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 space-y-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-sm leading-relaxed pt-4" style={{ color: "var(--text-secondary)" }}>{s.suggestion}</p>
          {s.keywords_to_add.length > 0 && (
            <div>
              <p className="section-label mb-2">Keywords to add</p>
              <div className="flex flex-wrap gap-1.5">
                {s.keywords_to_add.map((kw, i) => (
                  <span key={i} className="badge badge-indigo">{kw}</span>
                ))}
              </div>
            </div>
          )}
          {s.bullet_rewrites.length > 0 && (
            <div className="space-y-2.5">
              <p className="section-label">Bullet rewrites</p>
              {s.bullet_rewrites.map((r, i) => <RewriteCard key={i} {...r} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TailoringPanel({ suggestions }: Props) {
  return (
    <div className="card-lg p-6 sm:p-7 anim-fade-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0"
          style={{ background: "var(--indigo-50)", border: "1px solid var(--indigo-200)" }}>
          <Wand2 className="h-4 w-4" style={{ color: "var(--indigo-500)" }} strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Tailoring suggestions</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Align your language with the posting · {suggestions.length} area{suggestions.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      {suggestions.length === 0
        ? <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>No tailoring suggestions for this analysis.</p>
        : <div className="space-y-2">{suggestions.map((s, i) => <SuggestionCard key={i} s={s} index={i} />)}</div>
      }
    </div>
  );
}
