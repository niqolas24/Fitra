"use client";

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
    <div className="h-full flex flex-col min-h-[240px]">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Paste the full job description here...&#10;&#10;Include: responsibilities, requirements, preferred skills, and qualifications."
        className={`
          flex-1 min-h-[240px] w-full rounded-xl border p-4 text-sm resize-none
          bg-gray-800/50 text-gray-100 placeholder-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed" : "border-gray-600 hover:border-gray-400"}
          ${!isLongEnough && value.length > 0 ? "border-yellow-600" : "border-gray-600"}
        `}
      />
      <div className="flex justify-between mt-1.5 text-xs text-gray-500">
        <span>
          {!isLongEnough && value.length > 0
            ? "⚠️ Paste more of the job description for better results"
            : isLongEnough
            ? "✓ Good length"
            : "Tip: include the full posting"}
        </span>
        <span>{wordCount} words</span>
      </div>
    </div>
  );
}
