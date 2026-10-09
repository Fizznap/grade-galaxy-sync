import { t as supabase } from "./client-DORdWICZ.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Route } from "./admin-C7i7ao3M.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-noCJ66JC.js
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { role } = Route.useRouteContext();
	const queryClient = useQueryClient();
	const { data: users, isLoading } = useQuery({
		queryKey: ["admin_users"],
		queryFn: async () => {
			const { data, error } = await supabase.rpc("get_all_users");
			if (error) throw error;
			return data;
		},
		enabled: role === "admin"
	});
	const updateRoleMutation = useMutation({
		mutationFn: async ({ userId, newRole }) => {
			const { error } = await supabase.rpc("set_user_role", {
				target_user_id: userId,
				new_role: newRole
			});
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin_users"] });
		}
	});
	if (role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-red-500 font-bold",
		children: "Access Denied: Admins Only"
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8",
		children: "Loading users..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 max-w-4xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold mb-6 text-white",
			children: "User Management"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-slate-800 rounded shadow p-4 text-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2 border-b border-slate-700",
						children: "Email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2 border-b border-slate-700",
						children: "Current Role"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2 border-b border-slate-700",
						children: "Action"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [users?.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-2 border-b border-slate-700",
						children: u.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-2 border-b border-slate-700",
						children: u.role
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-2 border-b border-slate-700",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: u.role,
							onChange: (e) => updateRoleMutation.mutate({
								userId: u.user_id,
								newRole: e.target.value
							}),
							className: "border border-slate-600 bg-slate-700 p-1 rounded text-white",
							disabled: updateRoleMutation.isPending,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "admin",
									children: "Admin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "faculty",
									children: "Faculty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "placement",
									children: "Placement"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pending",
									children: "Pending"
								})
							]
						})
					})
				] }, u.id)), users?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 3,
					className: "p-4 text-center text-gray-500",
					children: "No users found."
				}) })] })]
			})
		})]
	});
}
//#endregion
export { AdminPage as component };
