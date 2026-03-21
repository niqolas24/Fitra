"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

const STEPS = [
  { label: "Extracting resume text…", delay: 0 },
  { label: "Reading the job description…", delay: 2000 },
  { label: "Matching keywords…", delay: 4500 },
  { label: "Computing qualification score…", delay: 7000 },
  { label: "Drafting tailored suggestions…", delay: 9000 },
  { label: "Finalizing…", delay: 12000 },
];

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((step, index) => setTimeout(() => setCurrentStep(index), step.delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
      <div className="relative mb-10">
        <div className="h-20 w-20 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center shadow-glow">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div className="absolute inset-0 rounded-full border-2 border-t-violet-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <Loader2 className="absolute inset-0 m-auto h-6 w-6 text-violet-300/80 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        {STEPS.map((step, index) => (
          <div
            key={step.label}
            className={`flex items-center gap-3 text-sm transition-colors duration-500 ${
              index < currentStep
                ? "text-emerald-400/90"
                : index === currentStep
                  ? "text-white"
                  : "text-white/25"
            }`}
          >
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02]">
              {index < currentStep ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : index === currentStep ? (
                <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
              )}
            </span>
            {step.label}
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-white/35">Usually 15–40 seconds depending on file size</p>
    </div>
  );
}
