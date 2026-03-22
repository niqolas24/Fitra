"use client";

import Link from "next/link";
import { Target, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "var(--indigo-600)" }}>
            <Target className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Fitra</span>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Join Fitra</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>University pilot & early access</p>
        </div>

        <div className="card-lg p-6 mb-5">
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>How access works</h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
            Fitra is rolling out through partner universities. Your admin provisions credentials, or you can use Google when enabled for your domain.
          </p>
          <div className="space-y-2.5">
            {[
              "Ask your career center for pilot credentials.",
              "Use Google sign-in if enabled for your school.",
              "Self-serve signup opens during beta expansion.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--indigo-500)" }} strokeWidth={2} />
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/login"
          className="btn-secondary w-full justify-center group"
          style={{ padding: "10px 20px", borderRadius: "12px", fontSize: "14px" }}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
