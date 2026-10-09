import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DORdWICZ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, q as redirect, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Route$15 } from "./admin-C7i7ao3M.mjs";
import { a as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { i as studentsQuery, n as importsQuery, r as interventionsQuery } from "./data-C0Xm0G2z.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$16 } from "./route-3ilExJ88.mjs";
import { t as Route$17 } from "./students._id-DAjT8PPv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-VY6exZrx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var styles_default = "/assets/styles-uiDUDH9D.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	(0, import_react.useEffect)(() => {
		const msg = String(error?.message ?? "");
		if (!/dynamically imported module|Importing a module script failed/i.test(msg)) return;
		if (sessionStorage.getItem("kr-chunk-reload")) return;
		sessionStorage.setItem("kr-chunk-reload", "1");
		window.location.reload();
	}, [error]);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => sessionStorage.removeItem("kr-chunk-reload"), 1e4);
		return () => clearTimeout(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "KRYPTEDU — Smart Campus Analytics" },
			{
				name: "description",
				content: "Understand. Predict. Improve Student Success."
			},
			{
				property: "og:site_name",
				content: "KRYPTEDU"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
			else queryClient.clear();
		});
		return () => data.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })]
	});
}
var $$splitComponentImporter$11 = () => import("./routes-OWPPvpcT.mjs");
var Route$13 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "KRYPTEDU — Sign in to Smart Campus Analytics" },
		{
			name: "description",
			content: "KRYPTEDU unifies student data to predict academic and placement risk and improve student success."
		},
		{
			property: "og:title",
			content: "KRYPTEDU — Smart Campus Analytics"
		},
		{
			property: "og:description",
			content: "Understand. Predict. Improve Student Success."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./reset-password-DdMwb4tR.mjs");
var Route$12 = createFileRoute("/reset-password")({
	head: () => ({ meta: [
		{ title: "Reset password — KRYPTEDU" },
		{
			name: "description",
			content: "Choose a new password for your KRYPTEDU account."
		},
		{
			property: "og:title",
			content: "Reset password — KRYPTEDU"
		},
		{
			property: "og:description",
			content: "Choose a new password for your KRYPTEDU account."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var Route$11 = createFileRoute("/_authenticated/analytics")({ beforeLoad: () => {
	throw redirect({ to: "/reports" });
} });
var $$splitErrorComponentImporter$3 = () => import("./dashboard-Cg8wEQrl.mjs");
var $$splitComponentImporter$9 = () => import("./dashboard-DnQm-qbZ.mjs");
var Route$10 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Home — KRYPTEDU" }] }),
	loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(studentsQuery), context.queryClient.ensureQueryData(interventionsQuery)]),
	component: lazyRouteComponent($$splitComponentImporter$9, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent")
});
var $$splitErrorComponentImporter$2 = () => import("./data-BLxIKuKN.mjs");
var $$splitComponentImporter$8 = () => import("./data-CBhQwcQL.mjs");
var Route$9 = createFileRoute("/_authenticated/data")({
	head: () => ({ meta: [{ title: "Data Integration — KRYPTEDU" }, {
		name: "description",
		content: "Import and validate institutional data."
	}] }),
	loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(importsQuery), context.queryClient.ensureQueryData(studentsQuery)]),
	component: lazyRouteComponent($$splitComponentImporter$8, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent")
});
var $$splitComponentImporter$7 = () => import("./insights-BeU_3sa4.mjs");
var Route$8 = createFileRoute("/_authenticated/insights")({
	head: () => ({ meta: [
		{ title: "AI Insights — KRYPTEDU" },
		{
			name: "description",
			content: "Ask evidence-backed questions about your students."
		},
		{
			property: "og:title",
			content: "AI Insights — KRYPTEDU"
		},
		{
			property: "og:description",
			content: "Ask evidence-backed questions about your students."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var Route$7 = createFileRoute("/_authenticated/integration")({ beforeLoad: () => {
	throw redirect({ to: "/data" });
} });
var $$splitErrorComponentImporter$1 = () => import("./interventions-CGTESUjW.mjs");
var $$splitComponentImporter$6 = () => import("./interventions-DdEbNur5.mjs");
var Route$6 = createFileRoute("/_authenticated/interventions")({
	head: () => ({ meta: [
		{ title: "Interventions — KRYPTEDU" },
		{
			name: "description",
			content: "Track student support actions."
		},
		{
			property: "og:title",
			content: "Interventions — KRYPTEDU"
		},
		{
			property: "og:description",
			content: "Track student support actions."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(studentsQuery), context.queryClient.ensureQueryData(interventionsQuery)]),
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent")
});
var $$splitComponentImporter$5 = () => import("./more-68O-SkEs.mjs");
var Route$5 = createFileRoute("/_authenticated/more")({
	head: () => ({ meta: [
		{ title: "More — KRYPTEDU" },
		{
			name: "description",
			content: "Workspace tools and settings."
		},
		{
			property: "og:title",
			content: "More — KRYPTEDU"
		},
		{
			property: "og:description",
			content: "Workspace tools and settings."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./notifications-B9PzKxKq.mjs");
var Route$4 = createFileRoute("/_authenticated/notifications")({
	head: () => ({ meta: [
		{ title: "Notifications — KRYPTEDU" },
		{
			name: "description",
			content: "Risk alerts and follow-ups."
		},
		{
			property: "og:title",
			content: "Notifications — KRYPTEDU"
		},
		{
			property: "og:description",
			content: "Risk alerts and follow-ups."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(studentsQuery), context.queryClient.ensureQueryData(interventionsQuery)]),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./profile-CixKBv14.mjs");
var Route$3 = createFileRoute("/_authenticated/profile")({
	head: () => ({ meta: [
		{ title: "Profile & Settings — KRYPTEDU" },
		{
			name: "description",
			content: "Your KRYPTEDU account and settings."
		},
		{
			property: "og:title",
			content: "Profile & Settings — KRYPTEDU"
		},
		{
			property: "og:description",
			content: "Your KRYPTEDU account and settings."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./reports-3Df3GsHE.mjs");
var Route$2 = createFileRoute("/_authenticated/reports")({
	head: () => ({ meta: [
		{ title: "Reports — KRYPTEDU" },
		{
			name: "description",
			content: "Export student success reports."
		},
		{
			property: "og:title",
			content: "Reports — KRYPTEDU"
		},
		{
			property: "og:description",
			content: "Export student success reports."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(studentsQuery), context.queryClient.ensureQueryData(interventionsQuery)]),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./student-dashboard-2ibVTQIi.mjs");
var Route$1 = createFileRoute("/_authenticated/student-dashboard")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitErrorComponentImporter = () => import("./students.index-BpIJ8c_9.mjs");
var $$splitComponentImporter = () => import("./students.index-h0QBbeDw.mjs");
var Route = createFileRoute("/_authenticated/students/")({
	head: () => ({ meta: [
		{ title: "Students — KRYPTEDU" },
		{
			name: "description",
			content: "Student directory with success scores and risk."
		},
		{
			property: "og:title",
			content: "Students — KRYPTEDU"
		},
		{
			property: "og:description",
			content: "Student directory with success scores and risk."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(studentsQuery),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var AuthenticatedRouteRoute = Route$16.update({
	id: "/_authenticated",
	getParentRoute: () => Route$14
});
var ResetPasswordRoute = Route$12.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$14
});
var AuthenticatedAdminRoute = Route$15.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAnalyticsRoute = Route$11.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$10.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDataRoute = Route$9.update({
	id: "/data",
	path: "/data",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedInsightsRoute = Route$8.update({
	id: "/insights",
	path: "/insights",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedIntegrationRoute = Route$7.update({
	id: "/integration",
	path: "/integration",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedInterventionsRoute = Route$6.update({
	id: "/interventions",
	path: "/interventions",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMoreRoute = Route$5.update({
	id: "/more",
	path: "/more",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedNotificationsRoute = Route$4.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedProfileRoute = Route$3.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedReportsRoute = Route$2.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedStudentDashboardRoute = Route$1.update({
	id: "/student-dashboard",
	path: "/student-dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedStudentsIndexRoute = Route.update({
	id: "/students/",
	path: "/students/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute,
	AuthenticatedAnalyticsRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedDataRoute,
	AuthenticatedInsightsRoute,
	AuthenticatedIntegrationRoute,
	AuthenticatedInterventionsRoute,
	AuthenticatedMoreRoute,
	AuthenticatedNotificationsRoute,
	AuthenticatedProfileRoute,
	AuthenticatedReportsRoute,
	AuthenticatedStudentDashboardRoute,
	AuthenticatedStudentsIdRoute: Route$17.update({
		id: "/students/$id",
		path: "/students/$id",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedStudentsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	ResetPasswordRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
