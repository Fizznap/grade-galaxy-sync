import { b as Link, g as Outlet, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./button-D4TI73S7.mjs";
import { f as Wordmark } from "./kr-CoUFKPyh.mjs";
import { A as CircleUser, D as Database, H as Bell, S as FileText, T as Ellipsis, W as ArrowUpRight, b as House, k as ClipboardCheck, n as Users, u as Sparkles } from "../_libs/lucide-react.mjs";
import { n as ProfileIdButton } from "./IdCard-DqgE6wys.mjs";
import { t as Route } from "./route-3ilExJ88.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-CRBSD8Z9.js
var import_jsx_runtime = require_jsx_runtime();
var primary = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: House
	},
	{
		to: "/students",
		label: "Students",
		icon: Users
	},
	{
		to: "/data",
		label: "Data",
		icon: Database
	},
	{
		to: "/interventions",
		label: "Interventions",
		icon: ClipboardCheck
	},
	{
		to: "/more",
		label: "More",
		icon: Ellipsis
	}
];
var secondary = [
	{
		to: "/reports",
		label: "Reports",
		icon: FileText
	},
	{
		to: "/insights",
		label: "AI Insights",
		icon: Sparkles
	},
	{
		to: "/notifications",
		label: "Notifications",
		icon: Bell
	},
	{
		to: "/profile",
		label: "Settings",
		icon: CircleUser
	}
];
function AppShell({ children }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const isActive = (to) => path === to || path.startsWith(to + "/");
	const moreActive = secondary.some((s) => isActive(s.to)) || isActive("/more");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "campus-canvas min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "glass fixed inset-y-4 left-4 z-20 hidden w-60 flex-col rounded-2xl border px-4 py-6 lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "px-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-8 space-y-1",
						children: primary.filter((p) => p.to !== "/more").map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
							...item,
							active: isActive(item.to)
						}, item.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 px-3 text-[10px] font-medium uppercase tracking-wider text-subtle",
						children: "Workspace"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-2 space-y-1",
						children: secondary.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
							...item,
							active: isActive(item.to)
						}, item.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto flex items-center gap-3 px-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileIdButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] leading-relaxed text-subtle",
							children: [
								"Tap for your",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"ID card"
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "glass sticky top-0 z-20 flex items-center justify-between border-b px-4 py-3 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/notifications",
						"aria-label": "Notifications",
						className: "grid size-10 place-items-center rounded-full border border-border bg-secondary/70 text-primary-deep transition-colors hover:bg-selected",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
							className: "size-4",
							strokeWidth: 1.6
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileIdButton, {})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "px-5 pb-44 pt-6 lg:ml-64 lg:px-10 lg:pb-12 lg:pt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-6xl",
					children
				})
			}),
			!isActive("/insights") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/insights",
				className: "press fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-ai px-5 py-3 text-sm font-semibold text-primary-foreground shadow-float lg:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "grid size-5 shrink-0 place-items-center rounded-full border border-primary-foreground/40 text-xs font-semibold",
						children: "K"
					}),
					" Ask KRYPTEDU ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4 shrink-0" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Main navigation",
				className: "glass fixed inset-x-0 bottom-4 z-30 mx-auto flex w-[calc(100%-2rem)] max-w-md justify-between rounded-[26px] p-2 lg:hidden",
				children: primary.map(({ to, label, icon: Icon }) => {
					const active = to === "/more" ? moreActive : isActive(to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to,
						"aria-current": active ? "page" : void 0,
						className: cn("press flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium transition-colors", active ? "text-foreground" : "text-muted-foreground"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-5",
								strokeWidth: active ? 2 : 1.6
							}),
							label,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": true,
								className: cn("size-1 rounded-full bg-primary-deep", active ? "opacity-100" : "opacity-0")
							})
						]
					}, to);
				})
			})
		]
	});
}
function NavItem({ to, label, icon: Icon, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		"aria-current": active ? "page" : void 0,
		className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", active ? "bg-primary font-semibold text-primary-foreground shadow-float" : "text-muted-foreground hover:bg-secondary hover:text-primary-deep"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-[18px]",
			strokeWidth: 1.6
		}), label]
	});
}
var SplitComponent = () => {
	const { role } = Route.useRouteContext();
	if (role === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold mb-4",
			children: "Account Pending Approval"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your account is waiting for administrator approval before you can access the application." })]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
};
//#endregion
export { SplitComponent as component };
