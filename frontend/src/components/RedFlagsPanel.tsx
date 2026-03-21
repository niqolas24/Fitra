import { RedFlag, RedFlagSeverity } from "@/types/analysis";

interface RedFlagsPanelProps {
  redFlags: RedFlag[];
}

const SEVERITY_CONFIG: Record<
  RedFlagSeverity,
  { label: string; chip: string; icon: string }
> = {
  high: {
    label: "High",
    chip: "bg-red-900/50 border-red-700 text-red-300",
    icon: "🔴",
  },
  medium: {
    label: "Medium",
    chip: "bg-yellow-900/50 border-yellow-700 text-yellow-300",
    icon: "🟡",
  },
  low: {
    label: "Low",
    chip: "bg-gray-800 border-gray-600 text-gray-400",
    icon: "⚪",
  },
};

const FLAG_TYPE_LABELS: Record<string, string> = {
  vague_bullet: "Vague Bullet",
  no_impact_metrics: "No Metrics",
  weak_action_verb: "Weak Action Verb",
  inconsistent_tense: "Inconsistent Tense",
  role_mismatch: "Role Mismatch",
  generic_skills_section: "Generic Skills",
  no_outcome_shown: "No Outcome",
  short_tenure_unexplained: "Short Tenure",
  other: "Other",
};

export default function RedFlagsPanel({ redFlags }: RedFlagsPanelProps) {
  if (redFlags.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5">
        <h3 className="font-semibold text-white mb-3">Resume Red Flags</h3>
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <span>✓</span>
          <span>No significant red flags detected.</span>
        </div>
      </div>
    );
  }

  const highCount = redFlags.filter((f) => f.severity === "high").length;
  const medCount = redFlags.filter((f) => f.severity === "medium").length;

  // Sort: high → medium → low
  const sorted = [...redFlags].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Resume Red Flags</h3>
        <div className="flex items-center gap-2 text-xs">
          {highCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-900/50 border border-red-700 text-red-400">
              {highCount} high
            </span>
          )}
          {medCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-yellow-900/50 border border-yellow-700 text-yellow-400">
              {medCount} medium
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((flag, i) => {
          const config = SEVERITY_CONFIG[flag.severity];
          return (
            <div
              key={i}
              className={`rounded-lg border p-4 ${config.chip}`}
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{config.icon}</span>
                  <span className="text-sm font-medium">
                    {FLAG_TYPE_LABELS[flag.type] || flag.type}
                  </span>
                </div>
                <span
                  className={`
                    text-xs px-2 py-0.5 rounded-full border flex-shrink-0
                    ${config.chip}
                  `}
                >
                  {config.label} severity
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{flag.description}</p>
              {flag.location && (
                <p className="text-xs text-gray-500 mt-1.5 italic">📍 {flag.location}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
