import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-D4TI73S7.mjs";
import { a as PageHeader, c as ScoreRing, l as SectionTitle, n as Card, s as RiskBadge, t as Bar } from "./kr-CoUFKPyh.mjs";
import { i as studentsQuery, r as interventionsQuery } from "./data-C0Xm0G2z.mjs";
import { K as ArrowLeft, g as Plus } from "../_libs/lucide-react.mjs";
import { t as InterventionDialog } from "./InterventionForm-fdMJJphM.mjs";
import { t as Route } from "./students._id-DAjT8PPv.mjs";
import { a as ResponsiveContainer, i as Line, n as YAxis, o as Tooltip, r as XAxis, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students._id-DpQW0esh.js
var import_jsx_runtime = require_jsx_runtime();
function trend(seed, end, spread, n = 6) {
	return Array.from({ length: n }, (_, i) => {
		const wobble = Math.sin(seed * 13 + i * 1.7) * spread;
		return +(end - (n - 1 - i) * (spread / 4) + wobble).toFixed(2);
	}).map((v, i, a) => i === a.length - 1 ? end : v);
}
function Profile() {
	const { id } = Route.useParams();
	const { data: students } = useSuspenseQuery(studentsQuery);
	const { data: interventions } = useSuspenseQuery(interventionsQuery);
	const s = students.find((x) => x.id === id);
	const mine = interventions.filter((i) => i.student_id === s.id);
	const seed = s.roll_no.charCodeAt(s.roll_no.length - 1);
	const gpa = trend(seed, s.cgpa, .6).map((v, i) => ({
		sem: `S${i + 1}`,
		v: Math.min(10, Math.max(4, v))
	}));
	const att = trend(seed + 3, s.attendance, 8).map((v, i) => ({
		m: [
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep"
		][i],
		v: Math.min(100, Math.max(30, Math.round(v)))
	}));
	const tt = {
		borderRadius: 12,
		border: "1px solid var(--color-border)",
		fontSize: 12
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/students",
			className: "mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Students"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: `${s.roll_no} · ${s.department} · Year ${s.year}`,
			title: s.name,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InterventionDialog, {
				students,
				defaultStudentId: s.id,
				trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "rounded-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Create intervention"
						})
					]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex flex-col items-center gap-4 lg:col-span-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, { value: s.successScore }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, {
								risk: s.academicRisk,
								label: "Academic"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, {
								risk: s.placementRisk,
								label: "Placement"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center text-xs text-subtle",
							children: s.segment
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Overview & Risk Factors" }),
						s.riskFactors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground mt-2",
							children: "No significant risk factors detected."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "grid gap-2 sm:grid-cols-2 mt-2",
							children: s.riskFactors.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2 rounded-xl bg-surface px-3 py-2.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-primary" }), r]
							}, r))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4 sm:grid-cols-2 mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								label: "Success Score Index",
								value: s.successScore
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Academics" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									label: "CGPA",
									value: s.cgpa * 10,
									right: String(s.cgpa)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									label: "Academic Index (45%)",
									value: s.academicIndex
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm text-muted-foreground pt-2 border-t",
									children: ["Active Backlogs: ", s.backlogs]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 h-32",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: gpa,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "sem",
										fontSize: 11,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										domain: [4, 10],
										fontSize: 11,
										width: 24,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tt }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										dataKey: "v",
										stroke: "var(--color-chart-1)",
										strokeWidth: 2,
										dot: {
											r: 3,
											fill: "var(--color-chart-1)"
										}
									})
								]
							}) })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Attendance" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								label: "Overall Attendance",
								value: s.attendance,
								right: `${s.attendance}%`
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 h-32",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: att,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "m",
										fontSize: 11,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										domain: [30, 100],
										fontSize: 11,
										width: 24,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tt }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										dataKey: "v",
										stroke: "var(--color-chart-3)",
										strokeWidth: 2,
										strokeDasharray: "4 3",
										dot: {
											r: 3,
											fill: "var(--color-chart-3)"
										}
									})
								]
							}) })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Activity & Engagement" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							label: "LMS Activity",
							value: s.lms_activity
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							label: "Campus Engagement (20%)",
							value: s.engagement
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Placement Readiness" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							label: "Placement Index (35%)",
							value: s.placementIndex
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							label: "Readiness Score",
							value: s.placement_readiness
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Skills & Feedback" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							label: "Skills Assessment",
							value: s.skills_score
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							label: "Faculty Feedback",
							value: s.feedback_score
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
						title: "Interventions",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/interventions",
							className: "text-xs font-medium text-muted-foreground hover:text-foreground",
							children: "View all"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: mine.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "No active interventions."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3",
							children: mine.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: i.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-subtle",
									children: [
										i.status,
										" · ",
										i.priority,
										" priority"
									]
								})]
							}, i.id))
						})
					})]
				})
			]
		})
	] });
}
//#endregion
export { Profile as component };
