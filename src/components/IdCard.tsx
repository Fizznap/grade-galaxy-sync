import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RotateCw, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
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

function Spark({ className = "" }: { className?: string }) {
  return <span aria-hidden className={cn("inline-block leading-none", className)}>✦</span>;
}

export function IdCard({ className }: { className?: string }) {
  const me = useMe();
  const [flip, setFlip] = useState(false);
  const idNo = me ? "KR-" + me.id.replace(/-/g, "").slice(0, 8).toUpperCase() : "KR-········";
  const year = new Date().getFullYear();
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flip-scene rise w-full max-w-[300px]">
        <button type="button" onClick={() => setFlip((f) => !f)} aria-label="Flip ID card" className="flip-inner relative block aspect-[5/8] w-full text-left" style={{ transform: flip ? "rotateY(180deg)" : undefined }}>
          <div className="face absolute inset-0 overflow-hidden rounded-[26px] bg-id text-id-foreground shadow-float">
            <p aria-hidden className="absolute -right-3 top-6 text-[64px] font-bold leading-none opacity-10">KRYPT<br />{year}</p>
            <div className="relative p-5">
              <p className="flex items-center gap-1.5 text-sm font-semibold tracking-[0.14em]"><Spark className="text-primary" /> KRYPTEDU</p>
              <p className="mt-1 text-[11px] opacity-70">Smart Campus Analytics</p>
            </div>
            <div className="absolute left-1/2 top-[34%] grid size-28 -translate-x-1/2 place-items-center rounded-full border border-id-foreground/20 bg-id-foreground/10 text-5xl font-bold">{me?.name?.[0]?.toUpperCase() ?? "·"}</div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-id-ink to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="break-words text-3xl font-bold uppercase leading-none tracking-tight">{me?.name ?? "Loading"}</p>
              <p className="mt-2 truncate text-xs opacity-75">{me?.email}</p>
              <span className="mt-2 inline-block rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">Faculty · Staff</span>
            </div>
          </div>
          <div className="face-back absolute inset-0 flex flex-col items-center overflow-hidden rounded-[26px] bg-id p-5 text-id-foreground shadow-float">
            <p className="flex items-center gap-1.5 self-start text-sm font-semibold tracking-[0.14em]"><Spark className="text-primary" /> KRYPTEDU</p>
            <div className="mt-6 rounded-2xl bg-card p-3">
              <QRCodeSVG value={idNo} size={170} level="M" />
            </div>
            <p className="mt-4 font-mono text-xs tracking-wider opacity-80">{idNo}</p>
            <p className="mt-auto text-2xl font-bold uppercase tracking-tight">Staff ID</p>
            <span className="mt-1 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">Valid till 06/{year + 1}</span>
          </div>
        </button>
      </div>
      <button type="button" onClick={() => setFlip((f) => !f)} className="glass press mt-5 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
        <RotateCw className="size-4" /> {flip ? "Show front" : "Show QR code"}
      </button>
    </div>
  );
}

export function ProfileIdButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const me = useMe();
  return (
    <>
      <button type="button" aria-label="Show my ID card" onClick={() => setOpen(true)} className={cn("press grid size-10 shrink-0 place-items-center rounded-full bg-ai text-sm font-bold text-primary-foreground shadow-float", className)}>
        {me?.name?.[0]?.toUpperCase() ?? "·"}
      </button>
      {open && createPortal(
        <div role="dialog" aria-modal="true" aria-label="My ID card" className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <IdCard />
            <button type="button" onClick={() => setOpen(false)} className="glass press mx-auto mt-3 flex items-center gap-1 rounded-full px-4 py-2 text-sm"><X className="size-4" /> Close</button>
          </div>
        </div>
      , document.body)}
    </>
  );
}
