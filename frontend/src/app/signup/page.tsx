import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.35),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,rgba(56,189,248,0.07),transparent_50%)]"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <Sparkles className="h-6 w-6 text-violet-300" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Join Fitra</h1>
          <p className="mt-2 text-sm text-white/55">University pilot &amp; early access</p>
        </div>

        <Card className="border-white/[0.1] bg-zinc-950/40">
          <CardHeader>
            <CardTitle className="text-lg font-medium">How access works</CardTitle>
            <CardDescription className="text-white/50 leading-relaxed">
              Fitra is rolling out with partner schools. Your admin provisions email login, or you can
              use Google when enabled for your domain.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-white/60 space-y-2 list-disc list-inside marker:text-violet-400/80">
              <li>Ask your career center for pilot credentials (email + password).</li>
              <li>If Google is enabled, sign in with your school account on the login page.</li>
              <li>Self-serve signup will open as we expand the beta.</li>
            </ul>
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/login" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
