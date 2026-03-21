"use client";

import { useCallback, useState } from "react";

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
    [disabled, onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSelect(selected);
  };

  return (
    <div className="h-full min-h-[240px]">
      <label
        className={`
          flex flex-col items-center justify-center h-full min-h-[240px]
          rounded-xl border-2 border-dashed cursor-pointer
          transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isDragging
            ? "border-blue-400 bg-blue-900/20"
            : file
            ? "border-green-500 bg-green-900/10"
            : "border-gray-600 bg-gray-800/50 hover:border-gray-400 hover:bg-gray-800"
          }
        `}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
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
          <div className="text-center px-4">
            <div className="text-4xl mb-3">📄</div>
            <p className="text-green-400 font-medium text-sm">{file.name}</p>
            <p className="text-gray-500 text-xs mt-1">
              {(file.size / 1024).toFixed(0)} KB — click to replace
            </p>
          </div>
        ) : (
          <div className="text-center px-4">
            <div className="text-4xl mb-3">⬆️</div>
            <p className="text-gray-300 font-medium text-sm">
              Drop your resume here
            </p>
            <p className="text-gray-500 text-xs mt-1">PDF or DOCX, max 10MB</p>
          </div>
        )}
      </label>

      {fileError && (
        <p className="text-red-400 text-xs mt-2">{fileError}</p>
      )}
    </div>
  );
}
