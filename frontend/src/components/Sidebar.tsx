"use client";

import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, FileSearch, History, Settings, LogOut, Target, ChevronRight } from "lucide-react";

interface SidebarProps {
  activePage: "analyze" | "history" | "settings";
  onNavigate: (page: "analyze" | "history" | "settings") => void;
}

function initials(name?: string | null, email?: string | null) {
  if (name) {
    const p = name.trim().split(/\s+/);
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  }
  return email?.slice(0, 2).toUpperCase() ?? "U";
}

const NAV = [
  { id: "analyze" as const,  label: "Analyze",  icon: FileSearch },
  { id: "history" as const,  label: "History",  icon: History },
  { id: "settings" as const, label: "Settings", icon: Settings },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside
      className="hidden lg:flex flex-col h-screen w-[220px] shrink-0 sticky top-0 border-r"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-[60px] border-b shrink-0" style={{ borderColor: "var(--border)" }}>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
          style={{ background: "var(--indigo-600)" }}
        >
          <Target className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-[15px] tracking-tight" style={{ color: "var(--text-primary)" }}>
          Fitra
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="section-label px-2 mb-3">Menu</p>
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 group"
              style={{
                background: active ? "var(--indigo-50)" : "transparent",
                color: active ? "var(--indigo-600)" : "var(--text-secondary)",
              }}
            >
              <Icon
                className="h-4 w-4 shrink-0 transition-colors"
                style={{ color: active ? "var(--indigo-500)" : "var(--text-tertiary)" }}
                strokeWidth={active ? 2 : 1.75}
              />
              {label}
              {active && (
                <ChevronRight
                  className="h-3 w-3 ml-auto"
                  style={{ color: "var(--indigo-400)" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 border-t pt-3 shrink-0" style={{ borderColor: "var(--border)" }}>
        <div
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl"
          style={{ background: "var(--bg-subtle)" }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0 text-xs font-semibold text-white"
            style={{ background: "var(--indigo-600)" }}
          >
            {initials(user?.name, user?.email)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
              {user?.name ?? "User"}
            </p>
            <p className="text-[11px] truncate" style={{ color: "var(--text-tertiary)" }}>
              {user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign out"
            className="btn-ghost p-1.5 rounded-lg"
            style={{ color: "var(--text-tertiary)" }}
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
