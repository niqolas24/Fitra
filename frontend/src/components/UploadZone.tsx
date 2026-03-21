"use client";

import { useCallback, useState } from "react";
import { FileUp, FileCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

export default function UploadZone({ file, onFileSelect, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const validateAndSelect = (f: File) => {
    setFileError(null);
    const validTypes = Object.keys(ACCEPTED_TYPES);
    if (!validTypes.includes(f.type) && !f.name.match(/\.(pdf|docx)$/i)) {
      setFileError("Please upload a PDF or DOCX file.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setFileError("File must be under 10MB.");
      return;
    }
    onFileSelect(f);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const dropped = e.dataTransfer.files[0];
      if (dropped) validateAndSelect(dropped);
    },
    [disabled, onFileSelect],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSelect(selected);
  };

  return (
    <div className="h-full min-h-[260px]">
      <label
        className={cn(
          "group flex flex-col items-center justify-center h-full min-h-[260px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300",
          disabled && "opacity-45 cursor-not-allowed",
          !disabled && isDragging && "border-violet-400/70 bg-violet-500/10 scale-[1.01]",
          !disabled &&
            !isDragging &&
            file &&
            "border-emerald-500/40 bg-emerald-500/[0.06] hover:border-emerald-400/50",
          !disabled &&
            !isDragging &&
            !file &&
            "border-white/[0.12] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        {file ? (
          <div className="text-center px-6 py-4">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition-transform duration-300 group-hover:scale-105">
              <FileCheck className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <p className="text-emerald-200/90 font-medium text-sm">{file.name}</p>
            <p className="text-white/40 text-xs mt-2">
              {(file.size / 1024).toFixed(0)} KB · click to replace
            </p>
          </div>
        ) : (
          <div className="text-center px-6 py-4">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-violet-300/90 transition-all duration-300 group-hover:border-violet-500/30 group-hover:bg-violet-500/10 group-hover:text-violet-200">
              <FileUp className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <p className="text-white/80 font-medium text-sm">Drop your resume here</p>
            <p className="text-white/40 text-xs mt-2">PDF or DOCX · max 10MB</p>
          </div>
        )}
      </label>

      {fileError && (
        <p className="flex items-center gap-1.5 text-red-400/90 text-xs mt-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {fileError}
        </p>
      )}
    </div>
  );
}
