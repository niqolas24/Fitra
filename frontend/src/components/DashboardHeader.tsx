"use client";

import { useSession, signOut } from "next-auth/react";
import { Target, LogOut, Bell, Plus } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  onNewAnalysis?: () => void;
}

function initials(name?: string | null, email?: string | null) {
  if (name) {
    const p = name.trim().split(/\s+/);
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  }
  return email?.slice(0, 2).toUpperCase() ?? "U";
}

export default function DashboardHeader({ title, subtitle, onNewAnalysis }: DashboardHeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between gap-4 px-6 lg:px-8 h-[60px] border-b shrink-0"
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "var(--border)",
      }}
    >
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ background: "var(--indigo-600)" }}
        >
          <Target className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-[15px]" style={{ color: "var(--text-primary)" }}>Fitra</span>
      </div>

      {/* Page title — desktop */}
      {title && (
        <div className="hidden lg:block">
          <h1 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h1>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{subtitle}</p>}
        </div>
      )}

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {onNewAnalysis && (
          <button type="button" onClick={onNewAnalysis} className="btn-primary text-sm py-1.5 px-3 hidden sm:flex">
            <Plus className="h-3.5 w-3.5" />
            New analysis
          </button>
        )}

        {/* Avatar dropdown */}
        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all"
            style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-lg text-[11px] font-semibold text-white shrink-0"
              style={{ background: "var(--indigo-600)" }}
            >
              {initials(user?.name, user?.email)}
            </div>
            <span className="hidden sm:block text-xs font-medium max-w-[100px] truncate" style={{ color: "var(--text-secondary)" }}>
              {user?.name || user?.email}
            </span>
          </button>
          {/* Dropdown */}
          <div
            className="absolute right-0 top-full mt-1.5 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="p-1">
              <div className="px-3 py-2 border-b mb-1" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{user?.name}</p>
                <p className="text-[11px] truncate" style={{ color: "var(--text-tertiary)" }}>{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-[var(--bg-subtle)]"
                style={{ color: "var(--red-600)" }}
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
