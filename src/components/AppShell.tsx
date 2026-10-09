import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Home, Users, BarChart3, ClipboardCheck, MoreHorizontal, Database, Sparkles, FileText, Bell, UserCircle,
} from "lucide-react";
import { Wordmark } from "./kr";
import { cn } from "@/lib/utils";

const primary = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/students", label: "Students", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/interventions", label: "Interventions", icon: ClipboardCheck },
  { to: "/more", label: "More", icon: MoreHorizontal },
] as const;

const secondary = [
  { to: "/integration", label: "Data Integration", icon: Database },
  { to: "/insights", label: "AI Insights", icon: Sparkles },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile & Settings", icon: UserCircle },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => path === to || path.startsWith(to + "/");
  const moreActive = secondary.some((s) => isActive(s.to)) || isActive("/more");

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-sidebar px-4 py-6 lg:flex">
        <Wordmark className="px-2" />
        <nav className="mt-8 space-y-1">
          {primary.filter((p) => p.to !== "/more").map((item) => (
            <NavItem key={item.to} {...item} active={isActive(item.to)} />
          ))}
        </nav>
        <div className="mt-6 px-3 text-[10px] font-medium uppercase tracking-wider text-subtle">Workspace</div>
        <nav className="mt-2 space-y-1">
          {secondary.map((item) => (
            <NavItem key={item.to} {...item} active={isActive(item.to)} />
          ))}
        </nav>
        <div className="mt-auto px-3 text-[11px] leading-relaxed text-subtle">
          Understand. Predict.
          <br />
          Improve Student Success.
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <Wordmark />
        <Link to="/notifications" aria-label="Notifications" className="grid size-10 place-items-center rounded-full border">
          <Bell className="size-4" strokeWidth={1.6} />
        </Link>
      </header>

      <main className="px-4 pb-28 pt-6 lg:ml-64 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-30 flex justify-between rounded-2xl border bg-background p-1.5 shadow-soft lg:hidden">
        {primary.map(({ to, label, icon: Icon }) => {
          const active = to === "/more" ? moreActive : isActive(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium transition-colors",
                active ? "bg-selected text-foreground" : "text-subtle",
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2 : 1.6} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function NavItem({ to, label, icon: Icon, active }: { to: string; label: string; icon: typeof Home; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
        active ? "bg-selected font-medium text-foreground" : "text-muted-foreground hover:bg-surface hover:text-foreground",
      )}
    >
      <Icon className="size-[18px]" strokeWidth={1.6} />
      {label}
    </Link>
  );
}
