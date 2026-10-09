import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { a as PageHeader, d as StudentLink, n as Card, o as Pill, r as Empty, s as RiskBadge } from "./kr-CoUFKPyh.mjs";
import { i as studentsQuery } from "./data-C0Xm0G2z.mjs";
import { p as Search, t as X } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-BqL9iJXA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students.index-h0QBbeDw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RISK = [
	"All",
	"High academic",
	"High placement"
];
function Students() {
	const { data } = useSuspenseQuery(studentsQuery);
	const [q, setQ] = (0, import_react.useState)("");
	const [dept, setDept] = (0, import_react.useState)("All");
	const [risk, setRisk] = (0, import_react.useState)("All");
	const [sort, setSort] = (0, import_react.useState)("name");
	const filtered = q !== "" || dept !== "All" || risk !== "All";
	const depts = ["All", ...new Set(data.map((s) => s.department))];
	const list = (0, import_react.useMemo)(() => data.filter((s) => (dept === "All" || s.department === dept) && (risk === "All" || (risk === "High academic" ? s.academicRisk === "High" : s.placementRisk === "High")) && (s.name.toLowerCase().includes(q.toLowerCase()) || s.roll_no.toLowerCase().includes(q.toLowerCase()))), [
		data,
		q,
		dept,
		risk
	]).sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "score-asc" ? a.successScore - b.successScore : sort === "score-desc" ? b.successScore - a.successScore : b.attendance - a.attendance);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: `${data.length} students`,
			title: "Student directory"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-4 top-1/2 size-4 -translate-y-1/2 text-subtle" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search by name or roll number",
					className: "h-12 rounded-xl pl-11 pr-11"
				}),
				q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setQ(""),
					"aria-label": "Clear search",
					className: "absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full hover:bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "-mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-2",
			children: depts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
				active: dept === d,
				onClick: () => setDept(d),
				children: d
			}, d))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2",
			children: RISK.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
				active: risk === r,
				onClick: () => setRisk(r),
				children: r
			}, r))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between gap-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted-foreground",
				children: [
					list.length,
					" of ",
					data.length,
					" shown"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [filtered && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setQ("");
						setDept("All");
						setRisk("All");
					},
					className: "press rounded-full px-3 py-1.5 text-xs font-medium hover:bg-secondary",
					children: "Clear filters"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					"aria-label": "Sort students",
					value: sort,
					onChange: (e) => setSort(e.target.value),
					className: "h-9 rounded-full border bg-card px-3 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "name",
							children: "Name A–Z"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "score-asc",
							children: "Lowest score first"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "score-desc",
							children: "Highest score first"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "att",
							children: "Attendance"
						})
					]
				})]
			})]
		}),
		list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "No students match",
			text: "Try a different search or filter."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 md:hidden",
			children: list.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudentLink, {
				id: s.id,
				className: "card-surface block p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate font-medium",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-subtle",
							children: [
								s.roll_no,
								" · ",
								s.department
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-semibold tabular-nums",
							children: s.successScore
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-wider text-subtle",
							children: "Success"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["CGPA ", s.cgpa] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Att ",
							s.attendance,
							"%"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, {
								risk: s.academicRisk,
								label: "A"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, {
								risk: s.placementRisk,
								label: "P"
							})]
						})
					]
				})]
			}, s.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "hidden overflow-x-auto p-0 md:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b text-left text-xs text-subtle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"Student",
						"Department",
						"CGPA",
						"Attendance",
						"Success",
						"Academic risk",
						"Placement risk"
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-medium",
						children: h
					}, h)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y",
					children: list.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-surface",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentLink, {
									id: s.id,
									className: "font-medium hover:underline",
									children: s.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-subtle",
									children: s.roll_no
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: s.department
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 tabular-nums",
								children: s.cgpa
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 tabular-nums",
								children: [s.attendance, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-semibold tabular-nums",
								children: s.successScore
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { risk: s.academicRisk })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { risk: s.placementRisk })
							})
						]
					}, s.id))
				})]
			})
		})] })
	] });
}
//#endregion
export { Students as component };
