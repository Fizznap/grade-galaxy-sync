import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, PageHeader, SectionTitle } from "@/components/kr";
import { Button } from "@/components/ui/button";
import { IdCard } from "@/components/IdCard";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile & Settings — KRYPTEDU" }, { name: "description", content: "Your KRYPTEDU account and settings." }, { property: "og:title", content: "Profile & Settings — KRYPTEDU" }, { property: "og:description", content: "Your KRYPTEDU account and settings." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Profile,
});

const ROLE_LABELS: Record<string, string> = { admin: "Administrator", faculty: "Faculty", placement: "Placement officer", student: "Student", pending: "Pending approval" };

function Profile() {
  const navigate = useNavigate();
  const { user, role } = Route.useRouteContext() as { user?: { email?: string; created_at?: string; last_sign_in_at?: string }; role?: string };
  return (
    <>
      <PageHeader eyebrow="Account" title="Profile & settings" />
      <div className="grid gap-4 lg:grid-cols-2">
        <IdCard />
        <Card>
          <SectionTitle title="Account details" />
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Email</dt><dd className="truncate font-medium">{user?.email ?? "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Role</dt><dd className="font-medium">{ROLE_LABELS[role ?? ""] ?? "No role assigned"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Member since</dt><dd className="font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Last sign-in</dt><dd className="font-medium">{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "—"}</dd></div>
          </dl>
          <Button variant="secondary" className="mt-4 rounded-xl border" onClick={() => navigate({ to: "/reset-password" })}>
            <KeyRound className="size-4" /> Change password
          </Button>
        </Card>
      </div>
      <Button variant="secondary" className="mt-6 rounded-xl border" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}>
        <LogOut className="size-4" /> Sign out
      </Button>
    </>
  );
}
