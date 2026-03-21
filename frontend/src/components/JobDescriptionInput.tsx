"use client";

import { AlignLeft, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function JobDescriptionInput({
  value,
  onChange,
  disabled,
}: JobDescriptionInputProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const isLongEnough = value.trim().length >= 100;

  return (
    <div className="h-full flex flex-col min-h-[260px]">
      <div className="relative flex-1 min-h-[260px] rounded-2xl border border-white/[0.1] bg-white/[0.02] overflow-hidden transition-colors duration-200 hover:border-white/[0.14] focus-within:border-violet-500/35 focus-within:ring-2 focus-within:ring-[var(--ring)]/50">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={`Paste the full job description — responsibilities, requirements, tools, and nice-to-haves.\n\nExample: "We're hiring a Software Engineering Intern to build internal tools with React and Python..."`}
          className={cn(
            "flex-1 min-h-[260px] w-full resize-none bg-transparent p-4 sm:p-5 text-sm text-white/90 placeholder:text-white/35",
            "focus:outline-none disabled:opacity-45 disabled:cursor-not-allowed leading-relaxed scrollbar-thin",
          )}
        />
        <div className="absolute top-3 right-3 pointer-events-none opacity-30">
          <AlignLeft className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="flex justify-between items-center mt-2.5 gap-3 text-xs">
        <span
          className={cn(
            "flex items-center gap-1.5",
            !isLongEnough && value.length > 0 ? "text-amber-400/90" : isLongEnough ? "text-emerald-400/80" : "text-white/35",
          )}
        >
          {!isLongEnough && value.length > 0 ? (
            <>
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              Add more of the posting for best results
            </>
          ) : isLongEnough ? (
            <>
              <Check className="h-3.5 w-3.5 shrink-0" />
              Good length for analysis
            </>
          ) : (
            "Include the full posting when possible"
          )}
        </span>
        <span className="text-white/35 tabular-nums shrink-0">{wordCount} words</span>
      </div>
    </div>
  );
}
