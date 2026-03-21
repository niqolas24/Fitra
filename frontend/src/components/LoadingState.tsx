"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { label: "Extracting resume text...", delay: 0 },
  { label: "Analyzing job description...", delay: 2000 },
  { label: "Matching keywords...", delay: 4500 },
  { label: "Computing fit score...", delay: 7000 },
  { label: "Generating tailored suggestions...", delay: 9000 },
  { label: "Finalizing analysis...", delay: 12000 },
];

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((step, index) =>
      setTimeout(() => setCurrentStep(index), step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8">
      {/* Animated logo */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-700" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-gray-800 flex items-center justify-center text-xl">
          🤖
        </div>
      </div>

      {/* Progress steps */}
      <div className="w-full max-w-sm space-y-3">
        {STEPS.map((step, index) => (
          <div
            key={index}
            className={`
              flex items-center gap-3 text-sm transition-all duration-500
              ${index < currentStep ? "text-green-400" : ""}
              ${index === currentStep ? "text-white" : ""}
              ${index > currentStep ? "text-gray-600" : ""}
            `}
          >
            <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold">
              {index < currentStep ? (
                <span className="text-green-400">✓</span>
              ) : index === currentStep ? (
                <span className="inline-block w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-gray-700 inline-block" />
              )}
            </span>
            {step.label}
          </div>
        ))}
      </div>

      <p className="text-gray-600 text-xs">
        This usually takes 15–30 seconds
      </p>
    </div>
  );
}
