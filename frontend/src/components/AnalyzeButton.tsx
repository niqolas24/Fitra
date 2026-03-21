"use client";

import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyzeButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export default function AnalyzeButton({ onClick, disabled, loading }: AnalyzeButtonProps) {
  return (
    <Button
      type="button"
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className="min-w-[220px] h-12 px-8 text-[15px] font-semibold shadow-glow"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Analyzing…
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5 opacity-90" />
          Run analysis
        </>
      )}
    </Button>
  );
}
