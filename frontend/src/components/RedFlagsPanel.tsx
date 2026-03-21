import { RedFlag, RedFlagSeverity } from "@/types/analysis";
import { AlertTriangle, CircleAlert, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RedFlagsPanelProps {
  redFlags: RedFlag[];
}

const SEVERITY_CONFIG: Record<
  RedFlagSeverity,
  { label: string; chip: string; icon: typeof AlertTriangle }
> = {
  high: {
    label: "High",
    chip: "border-red-500/30 bg-red-500/10 text-red-200",
    icon: CircleAlert,
  },
  medium: {
    label: "Medium",
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    icon: AlertTriangle,
  },
  low: {
    label: "Low",
    chip: "border-white/15 bg-white/[0.04] text-white/55",
    icon: Info,
  },
};

const FLAG_TYPE_LABELS: Record<string, string> = {
  vague_bullet: "Vague bullet",
  no_impact_metrics: "No metrics",
  weak_action_verb: "Weak action verb",
  inconsistent_tense: "Inconsistent tense",
  role_mismatch: "Role mismatch",
  generic_skills_section: "Generic skills",
  no_outcome_shown: "No outcome",
  short_tenure_unexplained: "Short tenure",
  other: "Other",
};

export default function RedFlagsPanel({ redFlags }: RedFlagsPanelProps) {
  if (redFlags.length === 0) {
    return (
      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7 h-full">
        <h3 className="font-semibold text-white tracking-tight mb-3">Red flags</h3>
        <div className="flex items-center gap-2 text-emerald-400/90 text-sm">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Info className="h-4 w-4" />
          </span>
          No significant red flags detected.
        </div>
      </div>
    );
  }

  const highCount = redFlags.filter((f) => f.severity === "high").length;
  const medCount = redFlags.filter((f) => f.severity === "medium").length;

  const sorted = [...redFlags].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7 h-full">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 className="font-semibold text-white tracking-tight">Red flags</h3>
        <div className="flex items-center gap-2">
          {highCount > 0 && (
            <Badge variant="danger" className="text-[10px]">
              {highCount} high
            </Badge>
          )}
          {medCount > 0 && (
            <Badge variant="warning" className="text-[10px]">
              {medCount} medium
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((flag, i) => {
          const config = SEVERITY_CONFIG[flag.severity];
          const Icon = config.icon;
          return (
            <div
              key={i}
              className={cn(
                "rounded-2xl border p-4 transition-colors duration-200 hover:border-white/15",
                config.chip,
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="h-4 w-4 shrink-0 opacity-90 mt-0.5" />
                  <span className="text-sm font-medium text-white/90 leading-snug">
                    {FLAG_TYPE_LABELS[flag.type] || flag.type}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/10 bg-black/20 text-white/60 shrink-0">
                  {config.label}
                </span>
              </div>
              <p className="text-sm text-white/65 leading-relaxed pl-6">{flag.description}</p>
              {flag.location && (
                <p className="text-xs text-white/35 mt-2 pl-6">Location: {flag.location}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
