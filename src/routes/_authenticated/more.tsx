import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronRight, Database, FileText, HelpCircle, LogOut, Settings, Sparkles, UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/kr";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/more")({
  head: () => ({ meta: [{ title: "More — KRYPTEDU" }, { name: "description", content: "Workspace tools and settings." }] }),
  component: More,
});

const items = [
  { to: "/integration", label: "Data Integration", desc: "Import CSVs across six data sources", icon: Database },
  { to: "/insights", label: "AI Insights", desc: "Ask questions about your cohort", icon: Sparkles },
  { to: "/reports", label: "Reports", desc: "Export student success reports", icon: FileText },
  { to: "/notifications", label: "Notifications", desc: "Risk alerts and due follow-ups", icon: Bell },
  { to: "/profile", label: "Profile", desc: "Your account", icon: UserCircle },
  { to: "/profile", label: "Settings", desc: "Preferences and scoring model", icon: Settings },
] as const;

function More() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader eyebrow="KRYPTEDU" title="More" />
      <div className="card-surface divide-y overflow-hidden">
        {items.map(({ to, label, desc, icon: Icon }) => (
          <Link key={label} to={to} className="group flex items-center gap-4 px-5 py-5 transition-colors hover:bg-secondary/70">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/70 text-primary"><Icon className="size-[20px]" strokeWidth={1.6} /></div>
            <div className="flex-1"><div className="text-sm font-medium">{label}</div><div className="text-xs text-subtle">{desc}</div></div>
            <ChevronRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
        <a href="mailto:support@kryptedu.app" className="flex items-center gap-4 px-4 py-4 hover:bg-surface">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/70 text-primary"><HelpCircle className="size-[18px]" strokeWidth={1.6} /></div>
          <div className="flex-1"><div className="text-sm font-medium">Help and Support</div><div className="text-xs text-subtle">Contact the KRYPTEDU team</div></div>
          <ChevronRight className="size-4 text-subtle" />
        </a>
        <Button variant="ghost" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }} className="h-auto w-full justify-start gap-4 rounded-none px-5 py-5 text-left hover:bg-surface">
          <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><LogOut className="size-[18px]" strokeWidth={1.6} /></div>
          <div className="text-sm font-medium">Sign out</div>
        </Button>
      </div>
    </>
  );
}
