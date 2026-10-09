import { useEffect, useState } from "react";
import { QrCode, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Wordmark } from "./kr";
import { cn } from "@/lib/utils";

type U = { id: string; email: string | undefined; name: string; created: string | undefined };

function useMe() {
  const [me, setMe] = useState<U | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      setMe({ id: u.id, email: u.email, name: (u.user_metadata?.["full_name"] as string) || u.email?.split("@")[0] || "User", created: u.created_at });
    });
  }, []);
  return me;
}

export function IdCard({ className }: { className?: string }) {
  const me = useMe();
  const idNo = me ? "KR-" + me.id.replace(/-/g, "").slice(0, 8).toUpperCase() : "KR-••••••••";
  const since = me?.created ? new Date(me.created).getFullYear() : "—";
  return (
    <div className={cn("liquid-glass relative overflow-hidden rounded-2xl border p-5", className)}>
      <div aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/15 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <Wordmark />
        <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Staff ID</span>
      </div>
      <div className="relative mt-5 flex items-center gap-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground">{me?.name?.[0]?.toUpperCase() ?? "·"}</div>
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold">{me?.name ?? "Loading…"}</div>
          <div className="truncate text-sm text-muted-foreground">{me?.email}</div>
          <div className="mt-1 text-xs text-subtle">Faculty · Student Success</div>
        </div>
      </div>
      <div className="relative mt-5 flex items-end justify-between border-t border-border pt-4">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          <dt className="text-subtle">ID No.</dt><dd className="font-mono font-medium">{idNo}</dd>
          <dt className="text-subtle">Member since</dt><dd className="font-medium">{since}</dd>
        </dl>
        <QrCode className="size-12 text-primary-deep" strokeWidth={1.3} aria-hidden />
      </div>
    </div>
  );
}

export function ProfileIdButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const me = useMe();
  return (
    <>
      <button type="button" aria-label="Show my ID card" onClick={() => setOpen(true)} className={cn("press grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-soft", className)}>
        {me?.name?.[0]?.toUpperCase() ?? "·"}
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="My ID card" className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-4 backdrop-blur-sm sm:items-center" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <IdCard className="bg-card" />
            <button type="button" onClick={() => setOpen(false)} className="press mx-auto mt-3 flex items-center gap-1 rounded-full bg-card px-4 py-2 text-sm shadow-soft"><X className="size-4" /> Close</button>
          </div>
        </div>
      )}
    </>
  );
}
