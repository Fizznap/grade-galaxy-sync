import { t as supabase } from "./client-DORdWICZ.mjs";
import { _ as lazyRouteComponent, q as redirect, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Loading } from "./kr-CoUFKPyh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-DLhBG0ye.js
var $$splitComponentImporter = () => import("./route-BSU6IxvZ.mjs");
var Route = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		const { data } = await supabase.auth.getUser();
		if (!data.user) throw redirect({ to: "/" });
		const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).single();
		const role = roleData?.role;
		if (role === "student" && (location.pathname === "/dashboard" || location.pathname === "/")) throw redirect({ to: "/student-dashboard" });
		return {
			user: data.user,
			role
		};
	},
	pendingComponent: Loading,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
