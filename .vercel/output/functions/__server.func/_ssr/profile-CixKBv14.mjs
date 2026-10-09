import { t as supabase } from "./client-DORdWICZ.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-D4TI73S7.mjs";
import { a as PageHeader, l as SectionTitle, n as Card } from "./kr-CoUFKPyh.mjs";
import { v as LogOut } from "../_libs/lucide-react.mjs";
import { t as IdCard } from "./IdCard-DqgE6wys.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CixKBv14.js
var import_jsx_runtime = require_jsx_runtime();
function Profile() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Account",
			title: "Profile & settings"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdCard, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Student Success Score model" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2 text-sm text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Academic index — 45% (CGPA, attendance, LMS, backlogs)" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Placement index — 35% (readiness, skills, feedback)" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Engagement — 20%" })
				]
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "secondary",
			className: "mt-6 rounded-xl border",
			onClick: async () => {
				await supabase.auth.signOut();
				navigate({ to: "/" });
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " Sign out"]
		})
	] });
}
//#endregion
export { Profile as component };
