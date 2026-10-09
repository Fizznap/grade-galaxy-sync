import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronRight, Database, FileText, HelpCircle, LogOut, Settings, Sparkles, UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/kr";

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
          <Link key={label} to={to} className="flex items-center gap-4 px-4 py-4 hover:bg-surface">
            <div className="grid size-10 place-items-center rounded-xl bg-surface-2"><Icon className="size-[18px]" strokeWidth={1.6} /></div>
            <div className="flex-1"><div className="text-sm font-medium">{label}</div><div className="text-xs text-subtle">{desc}</div></div>
            <ChevronRight className="size-4 text-subtle" />
          </Link>
        ))}
        <a href="mailto:support@kryptedu.app" className="flex items-center gap-4 px-4 py-4 hover:bg-surface">
          <div className="grid size-10 place-items-center rounded-xl bg-surface-2"><HelpCircle className="size-[18px]" strokeWidth={1.6} /></div>
          <div className="flex-1"><div className="text-sm font-medium">Help and Support</div><div className="text-xs text-subtle">Contact the KRYPTEDU team</div></div>
          <ChevronRight className="size-4 text-subtle" />
        </a>
        <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }} className="flex w-full items-center gap-4 px-4 py-4 text-left hover:bg-surface">
          <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><LogOut className="size-[18px]" strokeWidth={1.6} /></div>
          <div className="text-sm font-medium">Sign out</div>
        </button>
      </div>
    </>
  );
}
