"use client";

import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut, Settings } from "lucide-react";

interface DashboardHeaderProps {
  onNewAnalysis?: () => void;
}

function initials(name: string | null | undefined, email: string | null | undefined) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "U";
}

export default function DashboardHeader({ onNewAnalysis }: DashboardHeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[var(--background)]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] shadow-lg shadow-violet-500/5">
            <Sparkles className="h-4 w-4 text-violet-300" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold tracking-tight text-white truncate">Fitra</h1>
            <p className="text-[11px] text-white/45 truncate hidden sm:block">
              Application copilot for students
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onNewAnalysis && (
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex" onClick={onNewAnalysis}>
              New analysis
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-2.5 text-left transition-all hover:bg-white/[0.07] hover:border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/80 to-cyan-500/50 text-xs font-semibold text-white shadow-inner">
                  {initials(user?.name, user?.email)}
                </span>
                <span className="hidden sm:block max-w-[140px] truncate text-xs text-white/70">
                  {user?.name || user?.email || "Account"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-white/10 bg-zinc-950/95 backdrop-blur-xl">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium text-white truncate">{user?.name || "Signed in"}</p>
                <p className="text-xs text-white/45 truncate">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="gap-2 text-white/80 focus:bg-white/10 focus:text-white cursor-pointer"
                disabled
              >
                <Settings className="h-4 w-4" />
                Settings
                <span className="ml-auto text-[10px] text-white/35">Soon</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 text-white/80 focus:bg-white/10 focus:text-white cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
