"use client";

interface Props { value: string; onChange: (v: string) => void; disabled?: boolean; }

export default function JobDescriptionInput({ value, onChange, disabled }: Props) {
  const len = value.length;
  const isReady = len >= 100;
  const pct = Math.min(100, (len / 100) * 100);

  return (
    <div className="flex flex-col gap-2">
      <textarea
        className="input-base resize-none min-h-[200px] leading-relaxed"
        placeholder={"Paste the full job description here…\n\nInclude all requirements and responsibilities for the most accurate analysis."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ borderRadius: "16px", padding: "14px 16px" }}
      />
      <div className="flex items-center gap-3 px-1">
        <div className="flex-1 progress-track" style={{ height: "3px" }}>
          <div
            className="progress-fill"
            style={{
              width: `${pct}%`,
              background: isReady ? "var(--green-500)" : "var(--indigo-500)",
            }}
          />
        </div>
        <span
          className="text-[11px] font-medium tabular-nums shrink-0"
          style={{ color: isReady ? "var(--green-600)" : "var(--text-tertiary)" }}
        >
          {isReady ? `${len} chars ✓` : `${100 - len} more`}
        </span>
      </div>
    </div>
  );
}
