import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DORdWICZ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as cn, t as Button } from "./button-D4TI73S7.mjs";
import { t as X, u as Sparkles } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-BqL9iJXA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/InterventionForm-fdMJJphM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function generateSuggestions(s) {
	const suggestions = [];
	if (s.attendance < 60) suggestions.push({
		issue: "Critical attendance deficit",
		indicator: "attendance",
		indicatorValue: s.attendance,
		threshold: 60,
		action: "Schedule immediate faculty meeting to discuss attendance barriers",
		why: "Attendance below 60% correlates with academic failure risk and triggers High academic risk classification",
		followUp: "Monitor weekly attendance for 4 weeks; review again if <75%",
		priority: "High",
		category: "Attendance",
		requiresFacultyReview: true
	});
	else if (s.attendance < 75 && s.attendance >= 60) suggestions.push({
		issue: "Attendance below institutional threshold",
		indicator: "attendance",
		indicatorValue: s.attendance,
		threshold: 75,
		action: "Faculty follow-up to identify attendance barriers",
		why: "Students below 75% attendance often face compounding academic difficulties",
		followUp: "Track attendance bi-weekly; escalate if decline continues",
		priority: "Medium",
		category: "Attendance",
		requiresFacultyReview: true
	});
	const cgpa = Number(s.cgpa);
	if (cgpa < 5) suggestions.push({
		issue: "CGPA critically below passing threshold",
		indicator: "cgpa",
		indicatorValue: cgpa,
		threshold: 5,
		action: "Assign dedicated academic mentor for remedial support",
		why: "CGPA below 5.0 indicates severe academic difficulty requiring structured intervention",
		followUp: "Weekly mentoring sessions; reassess at mid-semester",
		priority: "High",
		category: "Academic",
		requiresFacultyReview: true
	});
	else if (cgpa < 6 && cgpa >= 5) suggestions.push({
		issue: "Below-average academic performance",
		indicator: "cgpa",
		indicatorValue: cgpa,
		threshold: 6,
		action: "Enroll in peer tutoring or remedial coaching program",
		why: "Students with CGPA 5-6 benefit from targeted academic support before falling further",
		followUp: "Monthly CGPA tracking; check improvement at next semester",
		priority: "Medium",
		category: "Academic",
		requiresFacultyReview: true
	});
	if (s.backlogs >= 2) suggestions.push({
		issue: "Multiple active backlogs",
		indicator: "backlogs",
		indicatorValue: s.backlogs,
		threshold: 2,
		action: "Create structured backlog clearance plan with faculty advisor",
		why: "2+ backlogs triggers High academic risk and compounds semester difficulty",
		followUp: "Track backlog exam results; adjust plan after each attempt",
		priority: "High",
		category: "Academic",
		requiresFacultyReview: true
	});
	else if (s.backlogs === 1) suggestions.push({
		issue: "Active backlog requiring attention",
		indicator: "backlogs",
		indicatorValue: s.backlogs,
		threshold: 1,
		action: "Schedule faculty discussion on backlog clearance timeline",
		why: "Early intervention on a single backlog prevents escalation",
		followUp: "Monitor next backlog exam result",
		priority: "Medium",
		category: "Academic",
		requiresFacultyReview: true
	});
	if (s.lms_activity < 45) suggestions.push({
		issue: "Low LMS engagement",
		indicator: "lms_activity",
		indicatorValue: s.lms_activity,
		threshold: 45,
		action: "Verify LMS access and assign structured online learning activities",
		why: "Low LMS activity (below 45) suggests disengagement from course materials",
		followUp: "Review LMS usage logs monthly",
		priority: "Medium",
		category: "Academic",
		requiresFacultyReview: true
	});
	if (s.placement_readiness < 45) suggestions.push({
		issue: "Low placement readiness",
		indicator: "placement_readiness",
		indicatorValue: s.placement_readiness,
		threshold: 45,
		action: "Enroll in placement preparation program covering aptitude and professional skills",
		why: "Readiness below 45 triggers High placement risk; early preparation improves outcomes",
		followUp: "Reassess readiness score after program completion",
		priority: "High",
		category: "Placement",
		requiresFacultyReview: true
	});
	if (s.skills_score < 40) suggestions.push({
		issue: "Significant skill gaps identified",
		indicator: "skills_score",
		indicatorValue: s.skills_score,
		threshold: 40,
		action: "Assign coding/technical practice with mentorship",
		why: "Skills below 40 indicate gaps that require dedicated practice to address",
		followUp: "Monthly skill assessment; track progress on specific competencies",
		priority: "High",
		category: "Skills",
		requiresFacultyReview: true
	});
	if (s.feedback_score < 40) suggestions.push({
		issue: "Low faculty/mock interview feedback",
		indicator: "feedback_score",
		indicatorValue: s.feedback_score,
		threshold: 40,
		action: "Schedule mock interview sessions with industry mentors",
		why: "Low feedback scores suggest presentation or communication gaps addressable through practice",
		followUp: "Schedule follow-up mock interviews; compare scores",
		priority: "Medium",
		category: "Placement",
		requiresFacultyReview: true
	});
	if (s.engagement < 40) suggestions.push({
		issue: "Low campus engagement",
		indicator: "engagement",
		indicatorValue: s.engagement,
		threshold: 40,
		action: "Encourage participation in clubs, events, or hackathons aligned with student interests",
		why: "Campus engagement below 40 may indicate social isolation or lack of awareness of opportunities",
		followUp: "Check engagement metrics next semester",
		priority: "Low",
		category: "Engagement",
		requiresFacultyReview: true
	});
	return suggestions;
}
var sel = "h-11 w-full rounded-xl border bg-background px-3 text-sm";
function InterventionDialog({ students, defaultStudentId, trigger, existing }) {
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const blank = existing ? {
		student_id: existing.student_id,
		title: existing.title,
		category: existing.category,
		priority: existing.priority,
		assigned_to: existing.assigned_to,
		due_date: existing.due_date ?? "",
		notes: existing.notes
	} : {
		student_id: defaultStudentId ?? students[0]?.id ?? "",
		title: "",
		category: "Academic",
		priority: "Medium",
		assigned_to: "",
		due_date: "",
		notes: ""
	};
	const [f, setF] = (0, import_react.useState)(blank);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const selectedStudent = (0, import_react.useMemo)(() => students.find((s) => s.id === f.student_id), [students, f.student_id]);
	const suggestions = (0, import_react.useMemo)(() => selectedStudent ? generateSuggestions(selectedStudent) : [], [selectedStudent]);
	async function save(e) {
		e.preventDefault();
		if (!f.title.trim()) {
			toast.error("Add a title");
			return;
		}
		setBusy(true);
		let error;
		if (existing) ({error} = await supabase.from("interventions").update({
			...f,
			due_date: f.due_date || null
		}).eq("id", existing.id));
		else {
			const { data: u } = await supabase.auth.getUser();
			({error} = await supabase.from("interventions").insert({
				...f,
				due_date: f.due_date || null,
				created_by: u.user?.id ?? null
			}));
		}
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success(existing ? "Intervention updated" : "Intervention created");
		qc.invalidateQueries({ queryKey: ["interventions"] });
		setOpen(false);
		if (!existing) setF((p) => ({
			...p,
			title: "",
			notes: ""
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: (o) => {
			setOpen(o);
			if (o && existing) setF(blank);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto rounded-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: existing ? "Edit intervention" : "New intervention" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: save,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: sel,
						value: f.student_id,
						onChange: (e) => setF({
							...f,
							student_id: e.target.value
						}),
						children: students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: s.id,
							children: [
								s.name,
								" · ",
								s.roll_no
							]
						}, s.id))
					}),
					!existing && suggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 rounded-xl bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs font-medium text-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " AI Suggestions based on indicators"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2",
							children: suggestions.map((sg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setF({
									...f,
									title: sg.action,
									category: sg.category,
									priority: sg.priority,
									notes: `Reason: ${sg.why}\n\nFollow-up: ${sg.followUp}`
								}),
								className: "text-left rounded-lg border bg-background p-2 text-xs transition-colors hover:border-primary/50 hover:bg-surface",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium text-foreground",
									children: sg.issue
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-muted-foreground",
									children: sg.action
								})]
							}, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "h-11 rounded-xl",
						placeholder: "Title, e.g. Weekly mentoring",
						value: f.title,
						onChange: (e) => setF({
							...f,
							title: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: sel,
							value: f.category,
							onChange: (e) => setF({
								...f,
								category: e.target.value
							}),
							children: [
								"Academic",
								"Attendance",
								"Placement",
								"Skills",
								"Engagement",
								"Wellbeing"
							].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: sel,
							value: f.priority,
							onChange: (e) => setF({
								...f,
								priority: e.target.value
							}),
							children: [
								"High",
								"Medium",
								"Low"
							].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "h-11 rounded-xl",
							placeholder: "Assigned faculty",
							value: f.assigned_to,
							onChange: (e) => setF({
								...f,
								assigned_to: e.target.value
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "h-11 rounded-xl",
							type: "date",
							value: f.due_date,
							onChange: (e) => setF({
								...f,
								due_date: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "min-h-24 rounded-xl",
						placeholder: "Notes (why this is relevant, follow-up actions)",
						value: f.notes,
						onChange: (e) => setF({
							...f,
							notes: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							className: "h-11 rounded-xl",
							onClick: () => setOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							className: "h-11 rounded-xl",
							children: busy ? "Saving…" : existing ? "Save changes" : "Create"
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { InterventionDialog as t };
