import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { t as SEGMENTS } from "./scoring-C5Rsmm1U.mjs";
import { a as PageHeader, d as StudentLink, l as SectionTitle, n as Card, o as Pill } from "./kr-CoUFKPyh.mjs";
import { i as studentsQuery, t as avg } from "./data-BpmQLrZk.mjs";
import { a as XAxis, c as Line, d as ReferenceLine, f as Bar, h as Tooltip, i as YAxis, l as CartesianGrid, m as ResponsiveContainer, n as BarChart, o as Scatter, r as LineChart, s as ZAxis, t as ScatterChart, u as ReferenceArea } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-bOFX9ELI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tt = {
	borderRadius: 12,
	border: "1px solid var(--color-border)",
	fontSize: 12
};
var segFill = [
	"var(--color-chart-1)",
	"var(--color-chart-2)",
	"var(--color-chart-3)",
	"var(--color-chart-4)"
];
var segShape = [
	"circle",
	"square",
	"triangle",
	"diamond"
];
function Analytics() {
	const { data } = useSuspenseQuery(studentsQuery);
	const [dept, setDept] = (0, import_react.useState)("All");
	const [seg, setSeg] = (0, import_react.useState)(null);
	const depts = ["All", ...new Set(data.map((s) => s.department))];
	const list = data.filter((s) => dept === "All" || s.department === dept);
	const years = [
		2,
		3,
		4
	].map((y) => {
		const g = list.filter((s) => s.year === y);
		return {
			year: `Year ${y}`,
			academic: avg(g.map((s) => s.academicIndex)),
			placement: avg(g.map((s) => s.placementIndex)),
			success: avg(g.map((s) => s.successScore))
		};
	});
	const risk = [
		"High",
		"Medium",
		"Low"
	].map((r) => ({
		r,
		academic: list.filter((s) => s.academicRisk === r).length,
		placement: list.filter((s) => s.placementRisk === r).length
	}));
	const segCounts = SEGMENTS.map((sg) => ({
		sg,
		n: list.filter((s) => s.segment === sg).length
	}));
	const segList = seg ? list.filter((s) => s.segment === seg) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Analytics & segmentation",
			title: "Cohort intelligence"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2",
			children: depts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
				active: dept === d,
				onClick: () => setDept(d),
				children: d
			}, d))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				title: "Student segmentation",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-subtle",
					children: "Academic index × Placement index"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScatterChart, {
					margin: {
						top: 10,
						right: 10,
						bottom: 20,
						left: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceArea, {
							x1: 65,
							x2: 100,
							y1: 60,
							y2: 100,
							fill: "var(--color-surface-2)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceArea, {
							x1: 0,
							x2: 65,
							y1: 0,
							y2: 60,
							fill: "var(--color-surface)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							stroke: "var(--color-border)",
							strokeDasharray: "2 4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							type: "number",
							dataKey: "academicIndex",
							domain: [0, 100],
							name: "Academic",
							fontSize: 11,
							tickLine: false,
							label: {
								value: "Academic index",
								position: "insideBottom",
								offset: -10,
								fontSize: 11
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							type: "number",
							dataKey: "placementIndex",
							domain: [0, 100],
							name: "Placement",
							fontSize: 11,
							tickLine: false,
							width: 30
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZAxis, { range: [60, 60] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
							x: 65,
							stroke: "var(--color-chart-2)",
							strokeDasharray: "4 4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
							y: 60,
							stroke: "var(--color-chart-2)",
							strokeDasharray: "4 4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							contentStyle: tt,
							formatter: (v) => v,
							labelFormatter: () => ""
						}),
						SEGMENTS.map((sg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scatter, {
							name: sg,
							data: list.filter((s) => s.segment === sg),
							fill: segFill[i],
							shape: segShape[i],
							onClick: () => setSeg(sg)
						}, sg))
					]
				}) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4",
				children: segCounts.map(({ sg, n }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSeg(seg === sg ? null : sg),
					className: `rounded-xl border p-3 text-left transition-colors ${seg === sg ? "border-primary bg-selected" : "hover:bg-surface"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							children: [
								"●",
								"■",
								"▲",
								"◆"
							][i]
						}), sg]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-2xl font-semibold tabular-nums",
						children: n
					})]
				}, sg))
			}),
			seg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 border-t pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 text-xs text-subtle",
					children: [
						seg,
						" · ",
						segList.length,
						" students"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: segList.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudentLink, {
						id: s.id,
						className: "rounded-full border px-3 py-1.5 text-xs hover:bg-surface",
						children: [
							s.name,
							" · ",
							s.successScore
						]
					}, s.id))
				})]
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Indices by year" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: years,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-border)",
								strokeDasharray: "2 4",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "year",
								fontSize: 11,
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								domain: [0, 100],
								fontSize: 11,
								width: 28,
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tt }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								dataKey: "success",
								name: "Success",
								stroke: "var(--color-chart-1)",
								strokeWidth: 2.5
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								dataKey: "academic",
								name: "Academic",
								stroke: "var(--color-chart-3)",
								strokeWidth: 2,
								strokeDasharray: "5 4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								dataKey: "placement",
								name: "Placement",
								stroke: "var(--color-chart-4)",
								strokeWidth: 2,
								strokeDasharray: "1 3"
							})
						]
					}) })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-4 text-[11px] text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "━ Success" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "╍ Academic" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "┈ Placement" })
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Risk distribution" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: risk,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "r",
								fontSize: 11,
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								allowDecimals: false,
								fontSize: 11,
								width: 24,
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: tt,
								cursor: { fill: "var(--color-surface)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "academic",
								name: "Academic",
								fill: "var(--color-chart-1)",
								radius: [
									6,
									6,
									0,
									0
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "placement",
								name: "Placement",
								fill: "var(--color-chart-4)",
								radius: [
									6,
									6,
									0,
									0
								]
							})
						]
					}) })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-4 text-[11px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "■ Academic (dark)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "□ Placement (light)" })]
				})
			] })]
		})
	] });
}
//#endregion
export { Analytics as component };
