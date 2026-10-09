import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, PageHeader, SectionTitle } from "@/components/kr";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile & Settings — KRYPTEDU" }, { name: "description", content: "Your KRYPTEDU account and settings." }] }),
  component: Profile,
});

function Profile() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const name = (user.user_metadata?.full_name as string) || user.email?.split("@")[0];
  return (
    <>
      <PageHeader eyebrow="Account" title="Profile & settings" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">{name?.[0]?.toUpperCase()}</div>
          <div><div className="font-medium">{name}</div><div className="text-sm text-muted-foreground">{user.email}</div><div className="mt-1 text-xs text-subtle">Faculty · KRYPTEDU workspace</div></div>
        </Card>
        <Card>
          <SectionTitle title="Student Success Score model" />
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Academic index — 45% (CGPA, attendance, LMS, backlogs)</li>
            <li>Placement index — 35% (readiness, skills, feedback)</li>
            <li>Engagement — 20%</li>
          </ul>
        </Card>
      </div>
      <Button variant="secondary" className="mt-6 rounded-xl border" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}>
        <LogOut className="size-4" /> Sign out
      </Button>
    </>
  );
}
