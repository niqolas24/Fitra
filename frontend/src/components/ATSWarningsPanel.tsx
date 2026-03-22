"use client";

import { ATSWarning } from "@/types/analysis";
import { ShieldCheck, Zap } from "lucide-react";

interface Props { warnings: ATSWarning[]; }

export default function ATSWarningsPanel({ warnings }: Props) {
  return (
    <div className="card-lg p-6 sm:p-7 h-full anim-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>ATS & format</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>Parsing and formatting issues</p>
        </div>
        {warnings.length > 0 && <span className="badge badge-amber">{warnings.length} issues</span>}
      </div>

      {warnings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "var(--green-50)", border: "1px solid var(--green-100)" }}>
            <ShieldCheck className="h-5 w-5" style={{ color: "var(--green-600)" }} strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--green-700)" }}>ATS ready</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>No formatting issues found</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {warnings.map((w, i) => (
            <div key={i} className="rounded-xl p-3.5 card-lift"
              style={{ background: "var(--amber-50)", border: "1px solid var(--amber-100)" }}>
              <div className="flex items-start gap-2.5">
                <Zap className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--amber-600)" }} strokeWidth={1.75} />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{w.type}</p>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>{w.description}</p>
                  {w.suggestion && (
                    <p className="text-xs leading-relaxed" style={{ color: "var(--amber-600)" }}>
                      <span className="font-semibold">Fix: </span>{w.suggestion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
