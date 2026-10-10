import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Loading } from "@/components/kr";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/" });
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id).single();
    const role = roleData?.role;
    const studentAllowed = ['/student-dashboard', '/interview', '/notifications', '/profile', '/more'];
    if (role === 'student' && !studentAllowed.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'))) {
      throw redirect({ to: "/student-dashboard" });
    }
    return { user: data.user, role };
  },
  pendingComponent: Loading,
  component: () => {
    const { role } = Route.useRouteContext();
    if (role === 'pending') {
      return (
        <AppShell>
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Account Pending Approval</h1>
            <p>Your account is waiting for administrator approval before you can access the application.</p>
          </div>
        </AppShell>
      );
    }
    return (
      <AppShell>
        <Outlet />
      </AppShell>
    );
  },
});
