import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-D4TI73S7.mjs";
import { d as StudentLink, l as SectionTitle, n as Card, s as RiskBadge, u as Stat } from "./kr-CoUFKPyh.mjs";
import { i as studentsQuery, r as interventionsQuery, t as avg } from "./data-BpmQLrZk.mjs";
import { a as XAxis, f as Bar, h as Tooltip, i as YAxis, m as ResponsiveContainer, n as BarChart, p as Cell } from "../_libs/recharts+[...].mjs";
import { A as CircleUser, D as Database, G as ArrowRight, H as Bell, L as ChartColumn, W as ArrowUpRight, k as ClipboardCheck, n as Users } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CrrMpX71.js
var import_jsx_runtime = require_jsx_runtime();
var tooltipStyle = {
	borderRadius: 12,
	border: "1px solid var(--color-border)",
	fontSize: 12
};
var quickAccess = [
	{
		to: "/students",
		label: "Students",
		icon: Users
	},
	{
		to: "/analytics",
		label: "Analytics",
		icon: ChartColumn
	},
	{
		to: "/interventions",
		label: "Interventions",
		icon: ClipboardCheck
	},
	{
		to: "/integration",
		label: "Import data",
		icon: Database
	}
];
function Dashboard() {
	const { data: students } = useSuspenseQuery(studentsQuery);
	const { data: interventions } = useSuspenseQuery(interventionsQuery);
	const acHigh = students.filter((s) => s.academicRisk === "High").length;
	const plHigh = students.filter((s) => s.placementRisk === "High").length;
	const bins = [
		"0-39",
		"40-49",
		"50-59",
		"60-69",
		"70-79",
		"80+"
	].map((b, i) => ({
		bin: b,
		count: students.filter((s) => {
			const v = s.successScore;
			return i === 0 ? v < 40 : i === 5 ? v >= 80 : v >= 30 + i * 10 && v < 40 + i * 10;
		}).length
	}));
	const depts = [...new Set(students.map((s) => s.department))].map((d) => {
		const g = students.filter((s) => s.department === d);
		return {
			dept: d.replace("Information Tech", "IT").replace("Computer Science", "CS"),
			score: avg(g.map((s) => s.successScore))
		};
	});
	const priority = [...students].filter((s) => s.academicRisk === "High" || s.placementRisk === "High").sort((a, b) => a.successScore - b.successScore).slice(0, 5);
	const open = interventions.filter((i) => i.status !== "Completed").length;
	const bestDept = [...depts].sort((a, b) => b.score - a.score)[0];
	const worstDept = [...depts].sort((a, b) => a.score - b.score)[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-7 flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Your campus, connected"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden items-center gap-2 lg:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "icon",
					className: "rounded-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/notifications",
						"aria-label": "Notifications",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					size: "icon",
					className: "rounded-full border border-glass-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/profile",
						"aria-label": "Profile",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUser, { className: "size-5" })
					})
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rise mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium text-primary-deep",
				children: "KRYPTEDU · CAMPUS WORKSPACE"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-[28px] font-semibold leading-tight sm:text-4xl",
				children: [
					"Who needs your",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", { className: "sm:hidden" }),
					" attention today?"
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/insights",
			className: "press rise mb-7 flex flex-col justify-between gap-5 rounded-2xl bg-primary p-5 text-primary-foreground shadow-soft sm:flex-row sm:items-center sm:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "grid size-7 place-items-center rounded-full border border-primary-foreground/40",
						children: "K"
					}), " Ask KRYPTEDU"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-lg font-medium",
					children: "A clearer picture of student success."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-primary-foreground/80",
					children: "Explore your cohort’s academic and placement signals."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4 sm:flex-col sm:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full bg-primary-foreground/15 px-3 py-1 text-xs",
					children: [
						students.length,
						" students · ",
						depts.length,
						" departments"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-10 shrink-0 place-items-center rounded-full bg-primary-foreground text-primary-deep",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Quick access" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: quickAccess.map(({ to, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to,
				className: "card-surface press flex min-w-0 items-center gap-3 p-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary-deep",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-[18px]" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium",
					children: label
				})]
			}, to))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Campus overview" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Total students",
					value: students.length,
					hint: `${depts.length} departments`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Avg. Success Score",
					value: avg(students.map((s) => s.successScore)),
					hint: "out of 100"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Academic risk · High",
					value: acHigh,
					hint: `${Math.round(acHigh / students.length * 100)}% of cohort`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Placement risk · High",
					value: plHigh,
					hint: `${Math.round(plHigh / students.length * 100)}% of cohort`
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Success Score distribution" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data: bins,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "bin",
							tickLine: false,
							axisLine: false,
							fontSize: 11
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							allowDecimals: false,
							tickLine: false,
							axisLine: false,
							fontSize: 11,
							width: 24
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							cursor: { fill: "var(--color-surface)" },
							contentStyle: tooltipStyle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "count",
							radius: [
								6,
								6,
								0,
								0
							],
							children: bins.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: `var(--color-chart-${i < 2 ? 1 : i < 4 ? 3 : 4})` }, i))
						})
					]
				}) })
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				title: "Department comparison",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-subtle",
					children: "Avg. Success Score"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data: depts,
					layout: "vertical",
					margin: { left: 10 },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							type: "number",
							domain: [0, 100],
							hide: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							type: "category",
							dataKey: "dept",
							tickLine: false,
							axisLine: false,
							fontSize: 11,
							width: 80
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							cursor: { fill: "var(--color-surface)" },
							contentStyle: tooltipStyle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "score",
							fill: "var(--color-chart-2)",
							radius: [
								0,
								6,
								6,
								0
							],
							barSize: 14
						})
					]
				}) })
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Priority cases",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/students",
						className: "text-xs text-muted-foreground hover:text-foreground",
						children: "View all →"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y",
					children: priority.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudentLink, {
						id: s.id,
						className: "flex items-center gap-3 py-3 hover:opacity-80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-semibold tabular-nums",
								children: s.successScore
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium",
									children: s.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate text-xs text-subtle",
									children: [
										s.department,
										" · ",
										s.riskFactors[0] ?? "—"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden gap-1 sm:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, {
									risk: s.academicRisk,
									label: "Acad"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, {
									risk: s.placementRisk,
									label: "Plc"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4 text-subtle" })
						]
					}, s.id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Recent insights" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-medium",
						children: [bestDept?.dept, " leads"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							"Highest avg. success score at ",
							bestDept?.score,
							"."
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-medium",
						children: [worstDept?.dept, " needs attention"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							"Lowest avg. success score at ",
							worstDept?.score,
							"."
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-medium",
						children: [students.filter((s) => s.segment === "High Academic / Low Placement").length, " strong students not placement-ready"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Good academics, weak placement readiness."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-medium",
						children: [open, " open interventions"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/interventions",
							className: "underline underline-offset-2",
							children: "Review follow-ups"
						})
					})] })
				]
			})] })]
		})
	] });
}
//#endregion
export { Dashboard as component };
