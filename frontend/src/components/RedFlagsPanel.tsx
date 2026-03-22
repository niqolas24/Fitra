"use client";

import { RedFlag, RedFlagSeverity } from "@/types/analysis";
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";

interface Props { redFlags: RedFlag[]; }

const SEV: Record<RedFlagSeverity, { icon: typeof AlertCircle; color: string; bg: string; border: string; label: string }> = {
  high:   { icon: AlertCircle,   color: "var(--red-600)",   bg: "var(--red-50)",   border: "var(--red-100)",   label: "High" },
  medium: { icon: AlertTriangle, color: "var(--amber-600)", bg: "var(--amber-50)", border: "var(--amber-100)", label: "Medium" },
  low:    { icon: Info,          color: "var(--text-secondary)", bg: "var(--bg-subtle)", border: "var(--border)", label: "Low" },
};

export default function RedFlagsPanel({ redFlags }: Props) {
  const sorted = [...redFlags].sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity]));

  return (
    <div className="card-lg p-6 sm:p-7 h-full anim-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Red flags</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>Issues to address before applying</p>
        </div>
        {redFlags.length > 0 && <span className="badge badge-red">{redFlags.length} found</span>}
      </div>

      {redFlags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "var(--green-50)", border: "1px solid var(--green-100)" }}>
            <CheckCircle2 className="h-5 w-5" style={{ color: "var(--green-600)" }} strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--green-700)" }}>No red flags</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Your resume looks clean</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sorted.map((flag, i) => {
            const { icon: Icon, color, bg, border, label } = SEV[flag.severity];
            return (
              <div key={i} className="rounded-xl p-3.5 transition-all duration-150 hover:shadow-sm card-lift"
                style={{ background: bg, border: `1px solid ${border}` }}>
                <div className="flex items-start gap-2.5">
                  <Icon className="h-4 w-4 mt-0.5 shrink-0" style={{ color }} strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{flag.type.replace(/_/g, " ")}</span>
                      <span className="badge" style={{ background: "white", color, border: `1px solid ${border}`, fontSize: "10px" }}>{label}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{flag.description}</p>
                    {flag.location && <p className="text-[11px] mt-1.5 italic" style={{ color: "var(--text-tertiary)" }}>{flag.location}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
