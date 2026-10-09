import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
  const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
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
