"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Target, Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const showGoogle = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED !== "false";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);
  const [formError, setFormError] = useState<string | null>(
    errorParam ? "Sign in failed. Check your credentials and try again." : null
  );

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault(); setFormError(null); setLoading("email");
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });
    setLoading(null);
    if (res?.error) { setFormError("Invalid email or password."); return; }
    if (res?.url) window.location.href = res.url;
  };

  const handleGoogle = () => { setFormError(null); setLoading("google"); void signIn("google", { callbackUrl }); };

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
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Sign in</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Welcome back to Fitra</p>
          </div>

          {formError && (
            <div className="mb-5 rounded-xl px-4 py-3 text-sm"
              style={{ background: "var(--red-50)", border: "1px solid var(--red-100)", color: "var(--red-600)" }}>
              {formError}
            </div>
          )}

          {showGoogle && (
            <>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading !== null}
                className="btn-secondary w-full justify-center mb-4 py-2.5"
                style={{ fontSize: "14px", borderRadius: "12px" }}
              >
                {loading === "google" ? <Loader2 className="h-4 w-4 anim-spin" /> : <GoogleIcon />}
                Continue with Google
              </button>
              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full" style={{ borderTop: "1px solid var(--border)" }} />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-xs uppercase tracking-widest" style={{ background: "var(--bg)", color: "var(--text-tertiary)" }}>or</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleEmail} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "var(--text-tertiary)" }} />
                <input
                  type="email" autoComplete="email" required placeholder="you@university.edu"
                  value={email} onChange={e => setEmail(e.target.value)} disabled={loading !== null}
                  className="input-base" style={{ borderRadius: "12px", paddingLeft: "2.5rem" }}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "var(--text-tertiary)" }} />
                <input
                  type="password" autoComplete="current-password" required placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} disabled={loading !== null}
                  className="input-base" style={{ borderRadius: "12px", paddingLeft: "2.5rem" }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading !== null}
              className="btn-primary w-full justify-center group"
              style={{ padding: "10px 20px", borderRadius: "12px", fontSize: "14px" }}
            >
              {loading === "email"
                ? <Loader2 className="h-4 w-4 anim-spin" />
                : <><span>Sign in</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
              }
            </button>
          </form>

          <p className="mt-5 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            New to Fitra?{" "}
            <Link href="/signup" className="font-medium transition-colors hover:underline" style={{ color: "var(--indigo-600)" }}>
              Sign up
            </Link>
          </p>
          <p className="mt-6 text-center text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            By continuing you agree to use AI suggestions responsibly — always verify resume facts.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}><Loader2 className="h-6 w-6 anim-spin" style={{ color: "var(--indigo-500)" }} /></div>}><LoginForm /></Suspense>;
}
