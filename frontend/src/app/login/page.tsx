"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
const showGoogle = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED !== "false";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);
  const [formError, setFormError] = useState<string | null>(
    errorParam ? "Sign in failed. Check your details or try again." : null,
  );

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setLoading("email");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(null);
    if (res?.error) {
      setFormError("Invalid email or password, or email login is not configured on the server.");
      return;
    }
    if (res?.url) {
      window.location.href = res.url;
    }
  };

  const handleGoogle = () => {
    setFormError(null);
    setLoading("google");
    void signIn("google", { callbackUrl });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.35),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(56,189,248,0.08),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(167,139,250,0.06),transparent_45%)]"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg shadow-violet-500/10 backdrop-blur-md">
            <Sparkles className="h-7 w-7 text-violet-300" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Fitra</h1>
          <p className="mt-2 text-sm text-white/55 leading-relaxed max-w-xs mx-auto">
            Your AI copilot for resumes, internships, and first roles — tailored to every posting.
          </p>
        </div>

        <Card className="border-white/[0.1] bg-zinc-950/40 p-0 overflow-hidden">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl font-medium">Sign in</CardTitle>
            <CardDescription className="text-white/50">
              Continue with Google or your university email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            {showGoogle && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full h-12 text-[15px] font-medium"
                  onClick={handleGoogle}
                  disabled={loading !== null}
                >
                  {loading === "google" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest">
                    <span className="bg-zinc-950/80 px-3 text-white/35">or email</span>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@university.edu"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading !== null}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="password">Password</Label>
                  <span className="text-[10px] text-white/35 normal-case tracking-normal">
                    Pilot access
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading !== null}
                    required
                  />
                </div>
              </div>

              {formError && (
                <p
                  className="text-sm text-red-400/90 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"
                  role="alert"
                >
                  {formError}
                </p>
              )}

              <Button type="submit" className="w-full h-12 text-[15px] group" disabled={loading !== null}>
                {loading === "email" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-white/45">
              New to Fitra?{" "}
              <Link
                href="/signup"
                className="text-violet-300/90 hover:text-violet-200 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-white/30 max-w-sm mx-auto leading-relaxed">
          By continuing you agree to responsible use of AI suggestions — always verify facts on your
          resume.
        </p>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
