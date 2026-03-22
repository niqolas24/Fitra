"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { analyzeResume, APIError } from "@/lib/api";
import { AnalysisResponse } from "@/types/analysis";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import UploadZone from "@/components/UploadZone";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import AnalyzeButton from "@/components/AnalyzeButton";
import LoadingState from "@/components/LoadingState";
import ResultsDashboard from "@/components/ResultsDashboard";
import { FileText, Briefcase, Sparkles, ArrowRight, Clock, TrendingUp, Award } from "lucide-react";

type Page = "analyze" | "history" | "settings";

export default function Home() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const [page, setPage] = useState<Page>("analyze");
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
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setStatus("error");
      setError(err instanceof APIError ? err.message : "Something went wrong. Please try again.");
    }
  }, [resumeFile, jobDescription]);

  const handleReset = () => {
    setResumeFile(null); setJobDescription(""); setStatus("idle"); setResult(null); setError(null);
  };

  const canAnalyze = resumeFile !== null && jobDescription.trim().length >= 100 && status !== "loading";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <Sidebar activePage={page} onNavigate={(p) => { setPage(p); if (p === "analyze") handleReset(); }} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title={page === "analyze" ? "Resume Analyzer" : page === "history" ? "Analysis History" : "Settings"}
          subtitle={page === "analyze" ? "Match your resume to any job posting" : undefined}
          onNewAnalysis={status === "success" ? handleReset : undefined}
        />

        <main className="flex-1 overflow-y-auto">

          {/* ── ANALYZE PAGE ── */}
          {page === "analyze" && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

              {/* Hero banner */}
              {status === "idle" && (
                <div
                  className="card-lg mb-8 px-6 py-7 relative overflow-hidden anim-fade-up"
                  style={{
                    background: "linear-gradient(135deg, #fafafe 0%, #f0f0ff 60%, #fdf8ff 100%)",
                    borderColor: "var(--indigo-200)",
                  }}
                >
                  <div
                    className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-40 pointer-events-none"
                    style={{ background: "radial-gradient(circle, var(--indigo-200), transparent 70%)" }}
                  />
                  <div className="relative">
                    <span className="badge badge-indigo mb-3">
                      <Sparkles className="h-3 w-3" /> AI-powered match
                    </span>
                    <h2
                      className="text-xl font-semibold mb-2 tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Hey {firstName}, let's analyze your fit.
                    </h2>
                    <p className="text-sm leading-relaxed max-w-lg" style={{ color: "var(--text-secondary)" }}>
                      Upload your resume and paste a job description to get an instant fit score, keyword gap
                      analysis, ATS warnings, and personalized suggestions.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {[
                        { icon: TrendingUp, label: "Fit score" },
                        { icon: Award, label: "Keyword gaps" },
                        { icon: Clock, label: "~20 seconds" },
                      ].map(({ icon: Icon, label }) => (
                        <span key={label} className="badge badge-neutral gap-1.5">
                          <Icon className="h-3 w-3" /> {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Inputs */}
              {status !== "success" && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                    <div className="anim-fade-up-2">
                      <div className="flex items-center gap-2 mb-2.5">
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-lg"
                          style={{ background: "var(--indigo-50)", border: "1px solid var(--indigo-200)" }}
                        >
                          <FileText className="h-3.5 w-3.5" style={{ color: "var(--indigo-500)" }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          Your resume
                        </span>
                      </div>
                      <UploadZone file={resumeFile} onFileSelect={setResumeFile} disabled={status === "loading"} />
                    </div>
                    <div className="anim-fade-up-2">
                      <div className="flex items-center gap-2 mb-2.5">
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-lg"
                          style={{ background: "var(--indigo-50)", border: "1px solid var(--indigo-200)" }}
                        >
                          <Briefcase className="h-3.5 w-3.5" style={{ color: "var(--indigo-500)" }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          Job description
                        </span>
                      </div>
                      <JobDescriptionInput value={jobDescription} onChange={setJobDescription} disabled={status === "loading"} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 anim-fade-up-3">
                    <AnalyzeButton onClick={handleAnalyze} disabled={!canAnalyze} loading={status === "loading"} />
                    {!canAnalyze && status !== "loading" && (
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        Upload a PDF/DOCX and paste 100+ characters of the job description
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Error */}
              {status === "error" && error && (
                <div
                  className="mb-6 rounded-xl px-4 py-3 text-sm flex items-start gap-2"
                  style={{ background: "var(--red-50)", border: "1px solid var(--red-100)", color: "var(--red-600)" }}
                >
                  <span className="font-medium shrink-0">Error:</span> {error}
                </div>
              )}

              {/* Loading */}
              {status === "loading" && <LoadingState />}

              {/* Results */}
              {status === "success" && result && (
                <div id="results" className="anim-fade-in">
                  <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Analysis results</h2>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                        {result.jd_summary?.role_title} · Analyzed in {(result.processing_time_ms / 1000).toFixed(1)}s
                      </p>
                    </div>
                    <button type="button" onClick={handleReset} className="btn-secondary text-sm py-1.5">
                      <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                      New analysis
                    </button>
                  </div>
                  <ResultsDashboard result={result} />
                </div>
              )}
            </div>
          )}

          {/* ── HISTORY PAGE ── */}
          {page === "history" && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div
                className="card-lg p-12 text-center anim-fade-up"
              >
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: "var(--indigo-50)", border: "1px solid var(--indigo-200)" }}
                >
                  <Clock className="h-6 w-6" style={{ color: "var(--indigo-500)" }} />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  History coming soon
                </h3>
                <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--text-secondary)" }}>
                  Past analyses will appear here once saved. Run your first analysis to get started.
                </p>
                <button
                  type="button"
                  onClick={() => setPage("analyze")}
                  className="btn-primary mt-5 mx-auto"
                >
                  Start analyzing
                </button>
              </div>
            </div>
          )}

          {/* ── SETTINGS PAGE ── */}
          {page === "settings" && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="card-lg p-6 anim-fade-up">
                <h3 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Preferences</h3>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Settings and configuration options.</p>
                <div className="space-y-4">
                  {["Email notifications", "Analysis language", "ATS strictness"].map(s => (
                    <div key={s} className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--border)" }}>
                      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{s}</span>
                      <span className="badge badge-neutral">Soon</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
