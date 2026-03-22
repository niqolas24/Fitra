"use client";

import { Loader2, Sparkles } from "lucide-react";

interface Props { onClick: () => void; disabled?: boolean; loading?: boolean; }

export default function AnalyzeButton({ onClick, disabled, loading }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="btn-primary relative overflow-hidden group"
      style={{ padding: "10px 22px", fontSize: "14px", borderRadius: "12px" }}
    >
      {/* Shimmer */}
      <span
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
      />
      {loading ? (
        <Loader2 className="h-4 w-4 anim-spin" />
      ) : (
        <Sparkles className="h-4 w-4" strokeWidth={1.75} />
      )}
      {loading ? "Analyzing…" : "Analyze resume"}
    </button>
  );
}
