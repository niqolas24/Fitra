"use client";

import { useState, useCallback } from "react";
import { analyzeResume, APIError } from "@/lib/api";
import { AnalysisResponse } from "@/types/analysis";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import AnalyzeButton from "@/components/AnalyzeButton";
import LoadingState from "@/components/LoadingState";
import ResultsDashboard from "@/components/ResultsDashboard";

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!resumeFile || !jobDescription.trim()) return;

    setStatus("loading");
    setError(null);

    try {
      const data = await analyzeResume(resumeFile, jobDescription);
      setResult(data);
      setStatus("success");
      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setStatus("error");
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }, [resumeFile, jobDescription]);

  const handleReset = () => {
    setResumeFile(null);
    setJobDescription("");
    setStatus("idle");
    setResult(null);
    setError(null);
  };

  const canAnalyze =
    resumeFile !== null &&
    jobDescription.trim().length >= 100 &&
    status !== "loading";

  return (
    <div className="min-h-screen flex flex-col">
      <Header onReset={status === "success" ? handleReset : undefined} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Input section */}
        {status !== "success" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Your Resume
              </label>
              <UploadZone
                file={resumeFile}
                onFileSelect={setResumeFile}
                disabled={status === "loading"}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Job Description
              </label>
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
                disabled={status === "loading"}
              />
            </div>
          </div>
        )}

        {/* Analyze button */}
        {status !== "success" && (
          <div className="flex justify-center">
            <AnalyzeButton
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              loading={status === "loading"}
            />
          </div>
        )}

        {/* Error */}
        {status === "error" && error && (
          <div className="bg-red-950 border border-red-700 rounded-lg p-4 text-red-300 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading */}
        {status === "loading" && <LoadingState />}

        {/* Results */}
        {status === "success" && result && (
          <div id="results">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Analysis Results
              </h2>
              <button
                onClick={handleReset}
                className="text-sm text-gray-400 hover:text-white transition-colors underline"
              >
                Analyze another resume
              </button>
            </div>
            <ResultsDashboard result={result} />
          </div>
        )}
      </main>
    </div>
  );
}
