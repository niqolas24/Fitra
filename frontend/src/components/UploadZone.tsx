"use client";

import { useCallback, useState } from "react";
import { Upload, FileCheck2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ file, onFileSelect, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const validateAndSelect = (f: File) => {
    setFileError(null);
    const valid = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!valid.includes(f.type) && !f.name.match(/\.(pdf|docx)$/i)) {
      setFileError("Please upload a PDF or DOCX file.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) { setFileError("File must be under 10 MB."); return; }
    onFileSelect(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (disabled) return;
    const f = e.dataTransfer.files[0];
    if (f) validateAndSelect(f);
  }, [disabled]);

  return (
    <div>
      <label
        className={cn(
          "flex flex-col items-center justify-center min-h-[200px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 group",
          disabled && "opacity-50 pointer-events-none",
          isDragging && "border-[var(--indigo-500)] bg-[var(--indigo-50)] scale-[1.005]",
          !isDragging && file && "border-[var(--green-500)] bg-[var(--green-50)]",
          !isDragging && !file && !disabled && "border-[var(--border-mid)] bg-white hover:border-[var(--indigo-500)] hover:bg-[var(--indigo-50)]",
        )}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input type="file" accept=".pdf,.docx" onChange={(e) => { const f = e.target.files?.[0]; if (f) validateAndSelect(f); }} disabled={disabled} className="hidden" />

        {file ? (
          <div className="text-center px-6 py-6">
            <div
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105"
              style={{ background: "var(--green-100)", border: "1px solid var(--green-500)22", color: "var(--green-600)" }}
            >
              <FileCheck2 className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--green-700)" }}>{file.name}</p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {(file.size / 1024).toFixed(0)} KB · click to replace
            </p>
          </div>
        ) : (
          <div className="text-center px-6 py-6">
            <div
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 group-hover:scale-105"
              style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-mid)" }}
            >
              <Upload className="h-5 w-5 transition-colors" style={{ color: isDragging ? "var(--indigo-500)" : "var(--text-tertiary)" }} strokeWidth={1.75} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Drop your resume</p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>PDF or DOCX · max 10 MB</p>
          </div>
        )}
      </label>
      {fileError && (
        <p className="flex items-center gap-1.5 text-xs mt-2" style={{ color: "var(--red-600)" }}>
          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {fileError}
        </p>
      )}
    </div>
  );
}
