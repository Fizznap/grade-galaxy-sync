import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { role } = Route.useRouteContext() as { role: string };
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_all_users");
      if (error) throw error;
      return data;
    },
    enabled: role === "admin",
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const { error } = await supabase.rpc("set_user_role", { target_user_id: userId, new_role: newRole as "admin" | "faculty" | "placement" | "pending" | "student" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
    },
  });

  if (role !== "admin") {
    return <div className="p-8 text-center text-red-500 font-bold">Access Denied: Admins Only</div>;
  }

  if (isLoading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">User Management</h1>
      <div className="bg-slate-800 rounded shadow p-4 text-white">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2 border-b border-slate-700">Email</th>
              <th className="p-2 border-b border-slate-700">Current Role</th>
              <th className="p-2 border-b border-slate-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => (
              <tr key={u.id}>
                <td className="p-2 border-b border-slate-700">{u.email}</td>
                <td className="p-2 border-b border-slate-700">{u.role}</td>
                <td className="p-2 border-b border-slate-700">
                  <select
                    value={u.role}
                    onChange={(e) => updateRoleMutation.mutate({ userId: u.user_id, newRole: e.target.value })}
                    className="border border-slate-600 bg-slate-700 p-1 rounded text-white"
                    disabled={updateRoleMutation.isPending}
                  >
                    <option value="admin">Admin</option>
                    <option value="faculty">Faculty</option>
                    <option value="placement">Placement</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>
              </tr>
            ))}
            {users?.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
