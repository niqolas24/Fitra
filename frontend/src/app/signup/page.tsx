"use client";

import { useState } from "react";
import Link from "next/link";
import { Target, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || null }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Signup failed");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-[440px] text-center">
          <div className="mb-6 flex h-16 w-16 mx-auto items-center justify-center rounded-full" style={{ background: "var(--green-50)", border: "1px solid var(--green-100)" }}>
            <CheckCircle2 className="h-8 w-8" style={{ color: "var(--green-600)" }} />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Account created
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            You can now sign in with <span className="font-medium" style={{ color: "var(--text-primary)" }}>{email}</span>
          </p>
          <Link
            href="/login"
            className="btn-primary inline-flex"
            style={{ padding: "10px 20px", borderRadius: "12px", fontSize: "14px" }}
          >
            <span>Go to sign in</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>

      {/* Left: brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #f0f0ff 0%, #e8eeff 40%, #f5f0ff 100%)", borderRight: "1px solid var(--indigo-200)" }}
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none opacity-50"
          style={{ background: "radial-gradient(circle, var(--indigo-200), transparent 65%)" }} />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full pointer-events-none opacity-40"
          style={{ background: "radial-gradient(circle, #c7d2fe, transparent 65%)" }} />

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "var(--indigo-600)" }}>
              <Target className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Fitra</span>
          </div>
          <h1 className="text-3xl font-bold leading-snug mb-4" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Your AI copilot for every application.
          </h1>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-secondary)" }}>
            Upload your resume, paste any job posting, and get an instant fit score with personalized improvements.
          </p>
        </div>

        <div className="relative space-y-3">
          {[
            "Instant fit score out of 100",
            "Keyword gap analysis",
            "ATS formatting check",
            "Personalized bullet rewrites",
          ].map(f => (
            <div key={f} className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--indigo-500)" }} strokeWidth={2} />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl" style={{ background: "var(--indigo-600)" }}>
            <Target className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Fitra</span>
        </div>

        <div className="w-full max-w-[360px]">
          <div className="mb-7">
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Create account</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Start tailoring applications with AI</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl px-4 py-3 text-sm"
              style={{ background: "var(--red-50)", border: "1px solid var(--red-100)", color: "var(--red-600)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Name (optional)</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "var(--text-tertiary)" }} />
                <input
                  type="text" autoComplete="name" placeholder="Your name"
                  value={name} onChange={e => setName(e.target.value)} disabled={loading}
                  className="input-base" style={{ borderRadius: "12px", paddingLeft: "2.5rem" }}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "var(--text-tertiary)" }} />
                <input
                  type="email" autoComplete="email" required placeholder="you@university.edu"
                  value={email} onChange={e => setEmail(e.target.value)} disabled={loading}
                  className="input-base" style={{ borderRadius: "12px", paddingLeft: "2.5rem" }}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "var(--text-tertiary)" }} />
                <input
                  type="password" autoComplete="new-password" required placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} disabled={loading}
                  className="input-base" style={{ borderRadius: "12px", paddingLeft: "2.5rem" }}
                />
              </div>
              <p className="text-xs mt-1.5" style={{ color: "var(--text-tertiary)" }}>At least 8 characters</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center group"
              style={{ padding: "10px 20px", borderRadius: "12px", fontSize: "14px" }}
            >
              {loading
                ? <Loader2 className="h-4 w-4 anim-spin" />
                : <><span>Create account</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
              }
            </button>
          </form>

          <p className="mt-5 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-medium transition-colors hover:underline" style={{ color: "var(--indigo-600)" }}>
              Sign in
            </Link>
          </p>
          <p className="mt-6 text-center text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            By signing up you agree to use AI suggestions responsibly — always verify resume facts.
          </p>
        </div>
      </div>
    </div>
  );
}
