import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-D4TI73S7.mjs";
import { d as StudentLink, l as SectionTitle, n as Card, s as RiskBadge, u as Stat } from "./kr-CoUFKPyh.mjs";
import { i as studentsQuery, r as interventionsQuery, t as avg } from "./data-C0Xm0G2z.mjs";
import { A as CircleUser, D as Database, G as ArrowRight, H as Bell, L as ChartColumn, W as ArrowUpRight, k as ClipboardCheck, n as Users } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DnQm-qbZ.js
var import_jsx_runtime = require_jsx_runtime();
var quickAccess = [
	{
		to: "/students",
		label: "Students",
		icon: Users
	},
	{
		to: "/reports",
		label: "Reports",
		icon: ChartColumn
	},
	{
		to: "/interventions",
		label: "Interventions",
		icon: ClipboardCheck
	},
	{
		to: "/data",
		label: "Import data",
		icon: Database
	}
];
function Dashboard() {
	const { data: students } = useSuspenseQuery(studentsQuery);
	const { data: interventions } = useSuspenseQuery(interventionsQuery);
	const acHigh = students.filter((s) => s.academicRisk === "High").length;
	const plHigh = students.filter((s) => s.placementRisk === "High").length;
	const validScores = students.filter((s) => s.successScore > 0);
	const avgScore = validScores.length ? avg(validScores.map((s) => s.successScore)) : 0;
	let fieldsCount = 0;
	let populatedCount = 0;
	students.forEach((s) => {
		const fields = [
			s.cgpa,
			s.attendance,
			s.lms_activity,
			s.engagement,
			s.placement_readiness,
			s.skills_score,
			s.feedback_score
		];
		fieldsCount += fields.length;
		populatedCount += fields.filter((f) => f > 0).length;
	});
	const dataCompleteness = fieldsCount ? Math.round(populatedCount / fieldsCount * 100) : 0;
	const priority = [...students].filter((s) => s.academicRisk === "High" || s.placementRisk === "High").sort((a, b) => a.successScore - b.successScore).slice(0, 5);
	const open = interventions.filter((i) => i.status !== "Completed").length;
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
					children: [students.length, " students enrolled"]
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
			className: "grid grid-cols-2 gap-3 lg:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Total students",
					value: students.length,
					hint: "Active enrollment"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Academic Risk",
					value: acHigh,
					hint: "Support needed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Placement Risk",
					value: plHigh,
					hint: "Action required"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Avg Success Score",
					value: avgScore,
					hint: "Valid profiles only"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Data Completeness",
					value: `${dataCompleteness}%`,
					hint: "Overall coverage"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Priority cases (Needing attention)",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/students",
						className: "text-xs text-muted-foreground hover:text-foreground",
						children: "View all →"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y",
					children: priority.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-subtle py-3",
						children: "No priority cases currently identified."
					}) : priority.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudentLink, {
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
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Action required" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-4 text-sm mt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-medium",
					children: [open, " active interventions"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/interventions",
						className: "underline underline-offset-2",
						children: "Review pending cases"
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: "Data Integration Status"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground mt-1",
					children: [
						dataCompleteness < 50 ? "Significant gaps detected in student records. Import recent datasets to improve predictive accuracy." : "Data coverage is healthy.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/data",
							className: "underline underline-offset-2",
							children: "Import data"
						})
					]
				})] })]
			})] })]
		})
	] });
}
//#endregion
export { Dashboard as component };
