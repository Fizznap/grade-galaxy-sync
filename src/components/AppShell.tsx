import { Link, useRouteContext, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Home, Users, BarChart3, ClipboardCheck, MoreHorizontal, Database, Sparkles, FileText, Bell, UserCircle, ArrowUpRight, Mic,
} from "lucide-react";
import { Wordmark } from "./kr";
import { ProfileIdButton } from "./IdCard";
import { cn } from "@/lib/utils";

const staffPrimary = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/students", label: "Students", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/interventions", label: "Interventions", icon: ClipboardCheck },
  { to: "/more", label: "More", icon: MoreHorizontal },
] as const;

const staffSecondary = [
  { to: "/integration", label: "Data Integration", icon: Database },
  { to: "/insights", label: "AI Insights", icon: Sparkles },
  { to: "/interview", label: "Mock Interviews", icon: Mic },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile & Settings", icon: UserCircle },
] as const;

const studentPrimary = [
  { to: "/student-dashboard", label: "My Dashboard", icon: Home },
  { to: "/interview", label: "Interviews", icon: Mic },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/more", label: "More", icon: MoreHorizontal },
] as const;
const studentSecondary = [
  { to: "/profile", label: "Profile & Settings", icon: UserCircle },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { role } = useRouteContext({ from: "/_authenticated" }) as { role?: string };
  const isStudent = role === "student";
  const primary: readonly { to: string; label: string; icon: typeof Home }[] = isStudent ? studentPrimary : staffPrimary;
  const secondary: readonly { to: string; label: string; icon: typeof Home }[] = isStudent ? studentSecondary : staffSecondary;
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => path === to || path.startsWith(to + "/");
  const moreActive = secondary.some((s) => isActive(s.to)) || isActive("/more");

  return (
    <div className="campus-canvas min-h-screen">
      <aside className="glass fixed inset-y-4 left-4 z-20 hidden w-60 flex-col rounded-2xl border px-4 py-6 lg:flex">
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
        <div className="mt-auto flex items-center gap-3 px-2">
          <ProfileIdButton />
          <div className="text-[11px] leading-relaxed text-subtle">Tap for your<br />ID card</div>
        </div>
      </aside>

      <header className="glass sticky top-0 z-20 flex items-center justify-between border-b px-4 py-3 lg:hidden">
        <Wordmark />
        <div className="flex items-center gap-2">
          <Link to="/notifications" aria-label="Notifications" className="grid size-10 place-items-center rounded-full border border-border bg-secondary/70 text-primary-deep transition-colors hover:bg-selected">
            <Bell className="size-4" strokeWidth={1.6} />
          </Link>
          <ProfileIdButton />
        </div>
      </header>

      <main className="px-5 pb-44 pt-6 lg:ml-64 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      {!isStudent && !isActive("/insights") && <Link to="/insights" className="press fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-ai px-5 py-3 text-sm font-semibold text-primary-foreground shadow-float lg:hidden"><span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full border border-primary-foreground/40 text-xs font-semibold">K</span> Ask KRYPTEDU <ArrowUpRight className="size-4 shrink-0" /></Link>}

      <nav aria-label="Main navigation" className="glass fixed inset-x-0 bottom-4 z-30 mx-auto flex w-[calc(100%-2rem)] max-w-md justify-between rounded-[26px] p-2 lg:hidden">
        {primary.map(({ to, label, icon: Icon }) => {
          const active = to === "/more" ? moreActive : isActive(to);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "press flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium transition-colors",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2 : 1.6} />
              {label}
              <span aria-hidden className={cn("size-1 rounded-full bg-primary-deep", active ? "opacity-100" : "opacity-0")} />
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
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
        active ? "bg-primary font-semibold text-primary-foreground shadow-float" : "text-muted-foreground hover:bg-secondary hover:text-primary-deep",
      )}
    >
      <Icon className="size-[18px]" strokeWidth={1.6} />
      {label}
    </Link>
  );
}
