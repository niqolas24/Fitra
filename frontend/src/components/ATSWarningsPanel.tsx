import { ATSWarning } from "@/types/analysis";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface ATSWarningsPanelProps {
  warnings: ATSWarning[];
}

export default function ATSWarningsPanel({ warnings }: ATSWarningsPanelProps) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7 h-full">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
            <ShieldAlert className="h-4 w-4 text-orange-300/90" />
          </span>
          <h3 className="font-semibold text-white tracking-tight">ATS &amp; format</h3>
        </div>
        <span className="text-xs text-white/40">
          {warnings.length === 0
            ? "Clean pass"
            : `${warnings.length} issue${warnings.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {warnings.length === 0 ? (
        <div className="flex items-center gap-2 text-emerald-400/90 text-sm">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          No major ATS formatting issues detected.
        </div>
      ) : (
        <div className="space-y-3">
          {warnings.map((warning, i) => (
            <div
              key={i}
              className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.06] p-4 transition-colors hover:border-orange-500/30"
            >
              <p className="text-sm text-orange-100/90 font-medium leading-snug">{warning.description}</p>
              <p className="text-xs text-white/50 mt-2 leading-relaxed">
                <span className="text-white/65 font-medium">Fix: </span>
                {warning.suggestion}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
