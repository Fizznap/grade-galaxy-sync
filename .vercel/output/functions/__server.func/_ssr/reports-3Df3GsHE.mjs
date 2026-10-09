import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-D4TI73S7.mjs";
import { a as PageHeader, n as Card } from "./kr-CoUFKPyh.mjs";
import { i as studentsQuery, r as interventionsQuery } from "./data-C0Xm0G2z.mjs";
import { E as Download } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-3Df3GsHE.js
var import_jsx_runtime = require_jsx_runtime();
function download(name, rows) {
	const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, "\"\"")}"`).join(",")).join("\n");
	const a = document.createElement("a");
	a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
	a.download = name;
	a.click();
	if (rows.length <= 1) toast.info("No matching records — the file has column headers only.");
}
var studentRows = (l) => [[
	"Roll",
	"Name",
	"Department",
	"Year",
	"CGPA",
	"Attendance",
	"Success",
	"Academic risk",
	"Placement risk",
	"Segment"
], ...l.map((s) => [
	s.roll_no,
	s.name,
	s.department,
	s.year,
	s.cgpa,
	s.attendance,
	s.successScore,
	s.academicRisk,
	s.placementRisk,
	s.segment
])];
function Reports() {
	const { data: students } = useSuspenseQuery(studentsQuery);
	const { data: ints } = useSuspenseQuery(interventionsQuery);
	const reports = [
		{
			t: "Full cohort success report",
			d: `${students.length} students with scores, risks and segments`,
			go: () => download("kryptedu-cohort.csv", studentRows(students))
		},
		{
			t: "At-risk students",
			d: "High academic or placement risk",
			go: () => download("kryptedu-at-risk.csv", studentRows(students.filter((s) => s.academicRisk === "High" || s.placementRisk === "High")))
		},
		{
			t: "Interventions log",
			d: `${ints.length} interventions with status`,
			go: () => download("kryptedu-interventions.csv", [[
				"Title",
				"Category",
				"Priority",
				"Status",
				"Assigned",
				"Due"
			], ...ints.map((i) => [
				i.title,
				i.category,
				i.priority,
				i.status,
				i.assigned_to,
				i.due_date ?? ""
			])])
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Exports",
		title: "Reports"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: reports.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: r.t
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-subtle",
					children: r.d
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				className: "rounded-xl border",
				onClick: r.go,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " CSV"]
			})]
		}, r.t))
	})] });
}
//#endregion
export { Reports as component };
