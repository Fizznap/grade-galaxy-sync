import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Wordmark } from "@/components/kr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KRYPTEDU — Sign in to Smart Campus Analytics" },
      { name: "description", content: "KRYPTEDU unifies student data to predict academic and placement risk and improve student success." },
      { property: "og:title", content: "KRYPTEDU — Smart Campus Analytics" },
      { property: "og:description", content: "Understand. Predict. Improve Student Success." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/dashboard" });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        if (!data.session) toast.success("Check your inbox to confirm your email.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error("Google sign-in failed");
  }

  return (
    <div className="campus-canvas grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <Wordmark />
        <div>
          <div className="mb-8 flex items-center gap-2 text-sm font-medium text-primary-deep"><span className="grid size-9 place-items-center rounded-full bg-secondary">K</span> Your campus, connected</div>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight">
            KRYPTEDU
            <br />
            <span className="text-primary-deep">Smart Campus<br />Analytics.</span>
          </h1>
          <p className="mt-5 text-lg font-medium">Understand. Predict. Improve Student Success.</p>
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            One view of academics, attendance, LMS, engagement, placement and skills — with a Student Success Score and early risk signals for every learner.
          </p>
        </div>
        <div className="text-xs text-subtle">KPMG India · Challenge 04</div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="rise mx-auto w-full max-w-sm">
          <Wordmark className="mb-12 lg:hidden" />
          <h2 className="text-3xl font-semibold tracking-tight">{mode === "in" ? "Welcome back" : "Create account"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "in" ? "Sign in to your campus analytics workspace." : "Faculty access to the KRYPTEDU workspace."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-3">
            {mode === "up" && <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl" />}
            <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl" />
            <Input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl" />
            <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl">
              {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"} <ArrowRight className="size-4" />
            </Button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs text-subtle">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>
          <Button variant="secondary" onClick={google} className="h-12 w-full rounded-xl border">
            Continue with Google
          </Button>
          <Button variant="ghost" onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-foreground">
            {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
}
