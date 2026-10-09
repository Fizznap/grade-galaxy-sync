import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Wordmark } from "@/components/kr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — KRYPTEDU" }, { name: "description", content: "Choose a new password for your KRYPTEDU account." }, { property: "og:title", content: "Reset password — KRYPTEDU" }, { property: "og:description", content: "Choose a new password for your KRYPTEDU account." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<"checking" | "ready" | "invalid">("checking");
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    if (hash.get("error") || query.get("error")) { setState("invalid"); return; }
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setState("ready");
    });
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      setState((s) => (s === "checking" ? (data.session ? "ready" : "invalid") : s));
    }, 1500);
    return () => { sub.subscription.unsubscribe(); clearTimeout(t); };
  }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== pw2) { toast.error("Passwords don't match"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  }
  if (state !== "ready") {
    return (
      <div className="campus-canvas grid min-h-screen place-items-center px-6">
        <div className="surface w-full max-w-sm space-y-4 rounded-[24px] p-6">
          <Wordmark />
          <h1 className="text-2xl font-semibold tracking-tight">{state === "checking" ? "Checking your link…" : "This reset link isn't valid"}</h1>
          {state === "invalid" && <p className="text-sm text-muted-foreground">The link may have expired or already been used. Go back to sign in and choose "Forgot password?" to get a new one.</p>}
          <Button type="button" variant="ghost" onClick={() => navigate({ to: "/" })} className="w-full">Back to sign in</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="campus-canvas grid min-h-screen place-items-center px-6">
      <form onSubmit={save} className="surface w-full max-w-sm space-y-4 rounded-[24px] p-6">
        <Wordmark />
        <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
        <Input type="password" required minLength={6} placeholder="New password" value={pw} onChange={(e) => setPw(e.target.value)} className="h-12 rounded-xl" />
        <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl">{busy ? "Saving…" : "Update password"}</Button>
        <Button type="button" variant="ghost" onClick={() => navigate({ to: "/" })} className="w-full">Back to sign in</Button>
      </form>
    </div>
  );
}
