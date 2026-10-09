import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DORdWICZ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as cn } from "./button-D4TI73S7.mjs";
import { a as PageHeader, d as StudentLink, o as Pill, r as Empty } from "./kr-CoUFKPyh.mjs";
import { i as studentsQuery, r as interventionsQuery } from "./data-C0Xm0G2z.mjs";
import { I as CheckCheck, N as CircleAlert, O as Clock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-B9PzKxKq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Notifications() {
	const { data: students } = useSuspenseQuery(studentsQuery);
	const { data: ints } = useSuspenseQuery(interventionsQuery);
	const soon = /* @__PURE__ */ new Date();
	soon.setDate(soon.getDate() + 7);
	const due = ints.filter((i) => i.status !== "Completed" && i.due_date && new Date(i.due_date) <= soon);
	const high = students.filter((s) => s.academicRisk === "High" && s.placementRisk === "High");
	const name = new Map(students.map((s) => [s.id, s.name]));
	const [read, setRead] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [cat, setCat] = (0, import_react.useState)("All");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let live = true;
		supabase.from("notification_reads").select("notification_key").then(({ data, error }) => {
			if (!live) return;
			if (error) toast.error("Couldn't load read status.");
			else setRead(new Set(data.map((r) => r.notification_key)));
			setLoading(false);
		});
		return () => {
			live = false;
		};
	}, []);
	const mark = async (ids) => {
		const fresh = ids.filter((k) => !read.has(k));
		if (!fresh.length) return;
		const prev = read;
		setRead(/* @__PURE__ */ new Set([...read, ...fresh]));
		setSaving(true);
		const { data: u } = await supabase.auth.getUser();
		const { error } = u.user ? await supabase.from("notification_reads").upsert(fresh.map((k) => ({
			user_id: u.user.id,
			notification_key: k
		}))) : { error: /* @__PURE__ */ new Error("Not signed in") };
		setSaving(false);
		if (error) {
			setRead(prev);
			toast.error("Couldn't save read status. Please try again.");
		}
	};
	const allIds = [...due.map((i) => "i" + i.id), ...high.map((s) => "s" + s.id)];
	const unread = allIds.filter((x) => !read.has(x)).length;
	const showDue = cat === "All" || cat === "Follow-ups";
	const showHigh = cat === "All" || cat === "Risk alerts";
	const dot = (k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-label": read.has(k) ? void 0 : "Unread",
		className: cn("ml-auto mt-1.5 size-2 shrink-0 rounded-full", read.has(k) ? "bg-transparent" : "bg-primary-deep")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: loading ? "Loading…" : `${unread} unread`,
			title: "Notifications",
			action: !loading && unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: saving,
				onClick: () => void mark(allIds),
				className: "press disabled:opacity-50 flex items-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-xs font-medium",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "size-4" }),
					" ",
					saving ? "Saving…" : "Mark all read"
				]
			}) : void 0
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2",
			children: [
				"All",
				"Follow-ups",
				"Risk alerts"
			].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
				active: cat === c,
				onClick: () => setCat(c),
				children: c
			}, c))
		}),
		due.length + high.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { title: "You're all caught up" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-surface divide-y",
			children: [showDue && due.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudentLink, {
				id: i.student_id,
				onClick: () => void mark(["i" + i.id]),
				className: "flex gap-3 p-4 hover:bg-surface",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
						className: "mt-0.5 size-4 shrink-0",
						strokeWidth: 1.6
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-medium",
						children: ["Follow-up due ", i.due_date]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-subtle",
						children: [
							i.title,
							" · ",
							name.get(i.student_id)
						]
					})] }),
					dot("i" + i.id)
				]
			}, i.id)), showHigh && high.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudentLink, {
				id: s.id,
				onClick: () => void mark(["s" + s.id]),
				className: "flex gap-3 p-4 hover:bg-surface",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
						className: "mt-0.5 size-4 shrink-0",
						strokeWidth: 1.6
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-medium",
						children: [s.name, " is high risk on both academics and placement"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-subtle",
						children: [
							"Success Score ",
							s.successScore,
							" · ",
							s.riskFactors.slice(0, 2).join(", ")
						]
					})] }),
					dot("s" + s.id)
				]
			}, s.id))]
		})
	] });
}
//#endregion
export { Notifications as component };
