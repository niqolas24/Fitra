"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { analyzeResume, APIError } from "@/lib/api";
import { AnalysisResponse } from "@/types/analysis";
import DashboardHeader from "@/components/DashboardHeader";
import UploadZone from "@/components/UploadZone";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import AnalyzeButton from "@/components/AnalyzeButton";
import LoadingState from "@/components/LoadingState";
import ResultsDashboard from "@/components/ResultsDashboard";
import { Badge } from "@/components/ui/badge";
import { FileText, Briefcase } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

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
      <DashboardHeader onNewAnalysis={status === "success" ? handleReset : undefined} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-6 sm:pt-10">
        {/* Hero */}
        <section className="relative mb-10 sm:mb-12 rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.05] via-transparent to-violet-500/[0.06] px-5 py-8 sm:px-8 sm:py-10 overflow-hidden">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <Badge variant="secondary" className="mb-4 border-white/10">
              Resume × job match
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white max-w-2xl">
              Hey {firstName} — let&apos;s tune this application.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/55 max-w-xl leading-relaxed">
              Upload your resume, paste the full posting, and get a qualification score, keyword gaps,
              ATS checks, and suggestions that sound like you — not a generic template.
            </p>
          </div>
        </section>

        {status !== "success" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/90">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                    <FileText className="h-4 w-4 text-violet-300" />
                  </span>
                  <span className="text-sm font-medium">Your resume</span>
                </div>
                <UploadZone
                  file={resumeFile}
                  onFileSelect={setResumeFile}
                  disabled={status === "loading"}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/90">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                    <Briefcase className="h-4 w-4 text-cyan-300" />
                  </span>
                  <span className="text-sm font-medium">Role description</span>
                </div>
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={setJobDescription}
                  disabled={status === "loading"}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <AnalyzeButton
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                loading={status === "loading"}
              />
              {!canAnalyze && status !== "loading" && (
                <p className="text-xs text-white/40 text-center sm:text-left max-w-xs">
                  Add a PDF or DOCX and paste at least ~100 characters of the job description to run
                  analysis.
                </p>
              )}
            </div>
          </>
        )}

        {status === "error" && error && (
          <div
            className="mb-8 rounded-2xl border border-red-500/25 bg-red-500/5 px-4 py-3 text-sm text-red-200/90"
            role="alert"
          >
            <strong className="font-medium">Couldn&apos;t analyze.</strong> {error}
          </div>
        )}

        {status === "loading" && <LoadingState />}

        {status === "success" && result && (
          <div id="results" className="transition-opacity duration-500">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-white tracking-tight">Your results</h2>
                <p className="text-sm text-white/45 mt-1">
                  Ranked signals from your resume against this posting — refine and re-run anytime.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-violet-300/90 hover:text-violet-200 transition-colors self-start sm:self-auto"
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
