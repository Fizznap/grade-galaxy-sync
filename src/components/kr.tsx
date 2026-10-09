import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Risk } from "@/lib/scoring";
import { Button } from "@/components/ui/button";

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M6 4v16M18 4l-9 8 9 8" />
        </svg>
      </div>
      <div className="leading-none">
        <div className="text-[15px] font-bold tracking-[0.14em] text-primary">KRYPTEDU</div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-subtle">Smart Campus Analytics</div>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="text-xs font-medium uppercase tracking-wider text-primary">{eyebrow}</div>}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("card-surface p-5", className)}>{children}</div>;
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-[15px] font-semibold">{title}</h2>
      {action}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-subtle">{hint}</div>}
    </Card>
  );
}

const riskStyle: Record<Risk, string> = {
  High: "bg-primary text-primary-foreground border-primary",
  Medium: "bg-surface-2 text-foreground border-border",
  Low: "bg-background text-muted-foreground border-border",
};
const riskMark: Record<Risk, string> = { High: "●", Medium: "◐", Low: "○" };

export function RiskBadge({ risk, label }: { risk: Risk; label?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium", riskStyle[risk])}>
      <span aria-hidden>{riskMark[risk]}</span>
      {label ? `${label}: ` : ""}
      {risk}
    </span>
  );
}

export function Pill({ children, active, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <Button
      variant="outline"
      type="button"
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-surface",
      )}
    >
      {children}
    </Button>
  );
}

export function ScoreRing({ value, size = 140 }: { value: number; size?: number }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-2)" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-primary)" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-3xl font-semibold tabular-nums">{value}</div>
          <div className="text-[10px] uppercase tracking-wider text-subtle">Success</div>
        </div>
      </div>
    </div>
  );
}

export function Bar({ value, label, right }: { value: number; label: string; right?: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{right ?? value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

export function Empty({ title, text }: { title: string; text?: string }) {
  return (
    <div className="rounded-2xl border border-dashed p-8 text-center">
      <div className="text-sm font-medium">{title}</div>
      {text && <div className="mt-1 text-xs text-subtle">{text}</div>}
    </div>
  );
}

export function Loading() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="text-center">
        <div className="mx-auto size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
        <div className="mt-3 text-xs tracking-[0.2em] text-subtle">KRYPTEDU</div>
      </div>
    </div>
  );
}

export function StudentLink({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <Link to="/students/$id" params={{ id }} className={className}>
      {children}
    </Link>
  );
}
