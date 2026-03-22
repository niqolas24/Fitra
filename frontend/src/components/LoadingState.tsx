"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const STEPS = [
  { label: "Extracting resume text…", delay: 0 },
  { label: "Reading the job description…", delay: 2200 },
  { label: "Matching keywords and skills…", delay: 4800 },
  { label: "Computing fit score…", delay: 7500 },
  { label: "Drafting tailored suggestions…", delay: 10000 },
  { label: "Finalizing results…", delay: 13000 },
];

export default function LoadingState() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = STEPS.map((s, i) => setTimeout(() => setStep(i), s.delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Spinner */}
      <div className="relative mb-8">
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}
        >
          <svg className="h-8 w-8 anim-spin" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="12" stroke="var(--bg-subtle)" strokeWidth="2.5" />
            <path d="M16 4 A12 12 0 0 1 28 16" stroke="var(--indigo-500)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div
          className="absolute inset-0 rounded-2xl blur-xl opacity-20 pointer-events-none"
          style={{ background: "var(--indigo-500)", transform: "scale(1.4)" }}
        />
      </div>

      <h3 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Analyzing your match</h3>
      <p className="text-sm mb-8" style={{ color: "var(--text-tertiary)" }}>Usually 15–40 seconds</p>

      <div className="w-full max-w-sm space-y-2">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3 text-sm transition-all duration-400"
              style={{ color: done ? "var(--green-600)" : active ? "var(--text-primary)" : "var(--text-tertiary)", opacity: i > step + 1 ? 0.4 : 1 }}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-lg shrink-0 transition-all duration-300"
                style={{
                  background: done ? "var(--green-50)" : active ? "var(--indigo-50)" : "var(--bg-subtle)",
                  border: `1px solid ${done ? "var(--green-100)" : active ? "var(--indigo-200)" : "var(--border)"}`,
                }}
              >
                {done ? (
                  <Check className="h-3 w-3" style={{ color: "var(--green-600)" }} strokeWidth={2.5} />
                ) : active ? (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: "var(--indigo-500)", animation: "pulse-ring 1.2s ease-in-out infinite" }}
                  />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--border-mid)" }} />
                )}
              </span>
              {s.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
