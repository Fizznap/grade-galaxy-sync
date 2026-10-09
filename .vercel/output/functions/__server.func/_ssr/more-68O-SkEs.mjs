import { t as supabase } from "./client-DORdWICZ.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-D4TI73S7.mjs";
import { a as PageHeader } from "./kr-CoUFKPyh.mjs";
import { A as CircleUser, D as Database, H as Bell, P as ChevronRight, S as FileText, d as Settings, j as CircleQuestionMark, u as Sparkles, v as LogOut } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/more-68O-SkEs.js
var import_jsx_runtime = require_jsx_runtime();
var items = [
	{
		to: "/integration",
		label: "Data Integration",
		desc: "Import CSVs across six data sources",
		icon: Database
	},
	{
		to: "/insights",
		label: "AI Insights",
		desc: "Ask questions about your cohort",
		icon: Sparkles
	},
	{
		to: "/reports",
		label: "Reports",
		desc: "Export student success reports",
		icon: FileText
	},
	{
		to: "/notifications",
		label: "Notifications",
		desc: "Risk alerts and due follow-ups",
		icon: Bell
	},
	{
		to: "/profile",
		label: "Profile",
		desc: "Your account",
		icon: CircleUser
	},
	{
		to: "/profile",
		label: "Settings",
		desc: "Preferences and scoring model",
		icon: Settings
	}
];
function More() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "KRYPTEDU",
		title: "More"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-surface divide-y overflow-hidden",
		children: [
			items.map(({ to, label, desc, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to,
				className: "group flex items-center gap-4 px-5 py-5 transition-colors hover:bg-secondary/70",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/70 text-primary-deep",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-[20px]",
							strokeWidth: 1.6
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-subtle",
							children: desc
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-1" })
				]
			}, label)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "mailto:support@kryptedu.app",
				className: "flex items-center gap-4 px-4 py-4 hover:bg-surface",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/70 text-primary-deep",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, {
							className: "size-[18px]",
							strokeWidth: 1.6
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: "Help and Support"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-subtle",
							children: "Contact the KRYPTEDU team"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-subtle" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				onClick: async () => {
					await supabase.auth.signOut();
					navigate({ to: "/" });
				},
				className: "h-auto w-full justify-start gap-4 rounded-none px-5 py-5 text-left hover:bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
						className: "size-[18px]",
						strokeWidth: 1.6
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium",
					children: "Sign out"
				})]
			})
		]
	})] });
}
//#endregion
export { More as component };
