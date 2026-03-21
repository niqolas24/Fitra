import { ATSWarning } from "@/types/analysis";

interface ATSWarningsPanelProps {
  warnings: ATSWarning[];
}

export default function ATSWarningsPanel({ warnings }: ATSWarningsPanelProps) {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">ATS Formatting Warnings</h3>
        <span className="text-xs text-gray-500">
          {warnings.length === 0 ? "No issues found" : `${warnings.length} issue${warnings.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {warnings.length === 0 ? (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <span>✓</span>
          <span>No ATS formatting issues detected.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {warnings.map((warning, i) => (
            <div
              key={i}
              className="rounded-lg border border-orange-800/60 bg-orange-950/20 p-4"
            >
              <div className="flex items-start gap-2 mb-1.5">
                <span className="text-orange-400 mt-0.5">⚠️</span>
                <div>
                  <p className="text-sm text-orange-300 font-medium leading-snug">
                    {warning.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                    <span className="font-medium text-gray-300">Fix: </span>
                    {warning.suggestion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
