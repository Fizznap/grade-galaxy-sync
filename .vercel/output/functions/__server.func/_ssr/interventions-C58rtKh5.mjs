import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DORdWICZ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as cn, t as Button } from "./button-D4TI73S7.mjs";
import { a as PageHeader, d as StudentLink, o as Pill, r as Empty } from "./kr-CoUFKPyh.mjs";
import { i as studentsQuery, r as interventionsQuery } from "./data-BpmQLrZk.mjs";
import { F as Check, R as Calendar, _ as Pencil, g as Plus, o as Trash2, r as User } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as InterventionDialog } from "./InterventionForm-fdMJJphM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/interventions-C58rtKh5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"Open",
	"In Progress",
	"Completed"
];
function Interventions() {
	const { data: students } = useSuspenseQuery(studentsQuery);
	const { data } = useSuspenseQuery(interventionsQuery);
	const qc = useQueryClient();
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [who, setWho] = (0, import_react.useState)("All");
	const today = new Date((/* @__PURE__ */ new Date()).toDateString());
	const isOverdue = (i) => !!i.due_date && i.status !== "Completed" && new Date(i.due_date) < today;
	const owners = ["All", ...new Set(data.map((i) => i.assigned_to || "Unassigned"))];
	const byId = new Map(students.map((s) => [s.id, s]));
	const list = data.filter((i) => (filter === "All" || (filter === "Overdue" ? isOverdue(i) : i.status === filter)) && (who === "All" || (i.assigned_to || "Unassigned") === who));
	async function remove(id) {
		if (!confirm("Delete this intervention? This cannot be undone.")) return;
		const { error } = await supabase.from("interventions").delete().eq("id", id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Intervention deleted");
		qc.invalidateQueries({ queryKey: ["interventions"] });
	}
	async function setStatus(id, status) {
		const { error } = await supabase.from("interventions").update({ status }).eq("id", id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success(`Marked ${status}`);
		qc.invalidateQueries({ queryKey: ["interventions"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: `${data.filter((i) => i.status !== "Completed").length} active`,
			title: "Interventions",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InterventionDialog, {
				students,
				trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " New"]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2",
			children: [
				"All",
				...STATUSES,
				"Overdue"
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
				active: filter === s,
				onClick: () => setFilter(s),
				children: s
			}, s))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center gap-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: "Assignee"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				"aria-label": "Filter by assignee",
				value: who,
				onChange: (e) => setWho(e.target.value),
				className: "h-9 rounded-full border bg-card px-3 text-xs",
				children: owners.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: o }, o))
			})]
		}),
		list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "No interventions here",
			text: "Create one from a student profile or the New button."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: list.map((i) => {
				const s = byId.get(i.student_id);
				const overdue = isOverdue(i);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] uppercase tracking-wider text-subtle",
									children: i.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 font-medium",
									children: i.title
								}),
								s && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudentLink, {
									id: s.id,
									className: "text-xs text-muted-foreground underline-offset-2 hover:underline",
									children: [
										s.name,
										" · ",
										s.roll_no
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", i.priority === "High" ? "border-primary bg-primary text-primary-foreground" : i.priority === "Medium" ? "bg-surface-2" : ""),
								children: i.priority
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex justify-end gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InterventionDialog, {
								students,
								existing: i,
								trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Edit intervention",
									className: "press grid size-9 place-items-center rounded-full hover:bg-secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => remove(i.id),
								"aria-label": "Delete intervention",
								className: "press grid size-9 place-items-center rounded-full text-destructive hover:bg-destructive/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						}),
						i.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: i.notes
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-3 text-xs text-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3.5" }), i.assigned_to || "Unassigned"]
							}), i.due_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("flex items-center gap-1", overdue && "font-semibold text-foreground"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5" }),
									overdue ? "Overdue · " : "",
									i.due_date
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex gap-1 rounded-xl bg-surface p-1",
							children: STATUSES.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setStatus(i.id, st),
								className: cn("flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs transition-colors", i.status === st ? "bg-background font-medium shadow-soft" : "text-subtle hover:text-foreground"),
								children: [i.status === st && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }), st]
							}, st))
						})
					]
				}, i.id);
			})
		})
	] });
}
//#endregion
export { Interventions as component };
