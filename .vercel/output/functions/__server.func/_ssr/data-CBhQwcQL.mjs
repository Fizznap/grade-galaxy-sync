import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DORdWICZ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as cn, t as Button } from "./button-D4TI73S7.mjs";
import { a as PageHeader, l as SectionTitle, n as Card } from "./kr-CoUFKPyh.mjs";
import { i as studentsQuery, n as importsQuery } from "./data-C0Xm0G2z.mjs";
import { B as Briefcase, M as CircleCheck, N as CircleAlert, V as BookOpen, a as TriangleAlert, i as Upload, q as Activity, s as Star, x as GraduationCap, z as CalendarCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_papaparse } from "../_libs/papaparse.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-CBhQwcQL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_papaparse = /* @__PURE__ */ __toESM(require_papaparse());
var CATEGORIES = {
	Academic: [
		"semester",
		"subject_code",
		"credits",
		"grade_points"
	],
	Attendance: ["date"],
	LMS: ["date", "activity_type"],
	Engagement: [
		"event_date",
		"activity_type",
		"points"
	],
	Placement: [
		"assessment_date",
		"assessment_type",
		"score",
		"max_score"
	],
	Skills: [
		"assessment_date",
		"skill_name",
		"score",
		"max_score"
	],
	Feedback: ["category"]
};
function parseCsv(text) {
	const parsed = import_papaparse.default.parse(text.trim(), {
		header: true,
		skipEmptyLines: true,
		transformHeader: (h) => h.trim().toLowerCase()
	});
	if (!parsed.data.length || !parsed.meta.fields) return {
		headers: [],
		rows: []
	};
	return {
		headers: parsed.meta.fields,
		rows: parsed.data
	};
}
function validate(category, headers, rows) {
	const errors = [];
	const missing = ["roll_no", ...CATEGORIES[category]].filter((h) => !headers.includes(h));
	if (missing.length) return {
		valid: [],
		errors: [`Missing required column(s): ${missing.join(", ")}`]
	};
	const valid = [];
	rows.forEach((r, idx) => {
		const line = idx + 2;
		const roll = r["roll_no"];
		if (!roll) {
			errors.push(`Row ${line}: roll_no is empty`);
			return;
		}
		const out = { roll_no: roll };
		let hasError = false;
		const parseNum = (field, min, max, allowEmpty = true) => {
			if (!(field in r) || r[field] === "") {
				if (!allowEmpty) {
					errors.push(`Row ${line}: ${field} is required`);
					hasError = true;
				}
				return;
			}
			const val = Number(r[field]);
			if (Number.isNaN(val)) {
				errors.push(`Row ${line}: ${field} must be a number`);
				hasError = true;
				return;
			}
			if (min !== void 0 && val < min) {
				errors.push(`Row ${line}: ${field} must be >= ${min}`);
				hasError = true;
			}
			if (max !== void 0 && val > max) {
				errors.push(`Row ${line}: ${field} must be <= ${max}`);
				hasError = true;
			}
			return val;
		};
		const parseStr = (field, allowEmpty = true) => {
			const val = r[field]?.trim();
			if (!val && !allowEmpty) {
				errors.push(`Row ${line}: ${field} is required`);
				hasError = true;
			}
			return val;
		};
		if (category === "Academic") {
			out.semester = parseNum("semester", 1, 10, false);
			out.subject_code = parseStr("subject_code", false);
			out.credits = parseNum("credits", .5, void 0, false);
			out.grade_points = parseNum("grade_points", 0, void 0, false);
			out.is_backlog = r["is_backlog"]?.toLowerCase() === "true";
		} else if (category === "Attendance") {
			out.date = parseStr("date", false);
			out.subject_code = parseStr("subject_code", true) || "";
			const ct = parseNum("classes_total", 1, void 0, true);
			const ca = parseNum("classes_attended", 0, void 0, true);
			const pct = parseNum("percentage", 0, 100, true);
			if (ct !== void 0 && ca !== void 0 && ca > ct) {
				errors.push(`Row ${line}: classes_attended cannot exceed classes_total`);
				hasError = true;
			}
			if (ct === void 0 && pct === void 0) {
				errors.push(`Row ${line}: must provide either classes_total/attended or percentage`);
				hasError = true;
			}
			if (ct !== void 0) out.classes_total = ct;
			if (ca !== void 0) out.classes_attended = ca;
			if (pct !== void 0) out.percentage = pct;
		} else if (category === "LMS") {
			out.date = parseStr("date", false);
			out.activity_type = parseStr("activity_type", false);
			out.session_id = parseStr("session_id", true) || "";
			const dur = parseNum("duration_minutes", 0, void 0, true);
			if (dur !== void 0) out.duration_minutes = dur;
		} else if (category === "Engagement") {
			out.event_date = parseStr("event_date", false);
			out.activity_type = parseStr("activity_type", false);
			out.points = parseNum("points", 0, void 0, false);
		} else if (category === "Placement") {
			out.assessment_date = parseStr("assessment_date", false);
			out.assessment_type = parseStr("assessment_type", false);
			out.score = parseNum("score", 0, void 0, false);
			out.max_score = parseNum("max_score", 1, void 0, false);
			if (out.score !== void 0 && out.max_score !== void 0 && out.score > out.max_score) {
				errors.push(`Row ${line}: score cannot exceed max_score`);
				hasError = true;
			}
			const attempt = parseNum("attempt_number", 1, void 0, true);
			out.attempt_number = attempt !== void 0 ? attempt : 1;
		} else if (category === "Skills") {
			out.assessment_date = parseStr("assessment_date", false);
			out.skill_name = parseStr("skill_name", false);
			out.score = parseNum("score", 0, void 0, false);
			out.max_score = parseNum("max_score", 1, void 0, false);
			if (out.score !== void 0 && out.max_score !== void 0 && out.score > out.max_score) {
				errors.push(`Row ${line}: score cannot exceed max_score`);
				hasError = true;
			}
		} else if (category === "Feedback") {
			const validCats = [
				"student_satisfaction",
				"faculty_feedback",
				"peer_review",
				"advisor_note"
			];
			const catVal = parseStr("category", false);
			if (!validCats.includes(catVal)) {
				errors.push(`Row ${line}: category must be one of: ${validCats.join(", ")}`);
				hasError = true;
			}
			out.category = catVal;
			out.score = parseNum("score", 0, void 0, true) ?? "";
			out.max_score = parseNum("max_score", 1, void 0, true) ?? "";
			if (typeof out.score === "number" && typeof out.max_score === "number" && out.score > out.max_score) {
				errors.push(`Row ${line}: score cannot exceed max_score`);
				hasError = true;
			}
			out.notes = parseStr("notes", true) || "";
			out.is_confidential = r["is_confidential"]?.toLowerCase() === "true";
			out.submitted_by = parseStr("submitted_by", true) || "";
		}
		if (!hasError) valid.push(out);
	});
	return {
		valid,
		errors
	};
}
var ICONS = {
	Academic: GraduationCap,
	Attendance: CalendarCheck,
	LMS: BookOpen,
	Engagement: Activity,
	Placement: Briefcase,
	Skills: Star,
	Feedback: Star
};
function Integration() {
	const { data: imports } = useSuspenseQuery(importsQuery);
	const { data: students } = useSuspenseQuery(studentsQuery);
	const qc = useQueryClient();
	const [cat, setCat] = (0, import_react.useState)("Academic");
	const [result, setResult] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const quality = (c) => {
		const field = {
			Academic: "cgpa",
			Attendance: "attendance",
			LMS: "lms_activity",
			Engagement: "engagement",
			Placement: "placement_readiness",
			Skills: "skills_score",
			Feedback: "feedback_score"
		}[c];
		if (!field) return 0;
		const filled = students.filter((s) => Number(s[field]) > 0).length;
		return Math.round(filled / Math.max(1, students.length) * 100);
	};
	async function onFile(file) {
		setBusy(true);
		setResult(null);
		try {
			const { headers, rows } = parseCsv(await file.text());
			const { valid, errors } = validate(cat, headers, rows);
			const known = new Map(students.map((s) => [s.roll_no, s.id]));
			let ok = 0;
			const toImport = [];
			for (const row of valid) {
				const { roll_no, name, department, year, ...domainFields } = row;
				let student_id = known.get(String(roll_no));
				if (!student_id && name && department) {
					const { data: res, error: err } = await supabase.from("students").insert({
						roll_no: String(roll_no),
						name: String(name),
						department: String(department),
						year: Number(year) || 1
					}).select("id").single();
					if (res) {
						student_id = res.id;
						known.set(String(roll_no), student_id);
					} else if (err) errors.push(`Row for roll_no ${roll_no} failed student creation: ${err.message}`);
				}
				if (student_id) toImport.push({
					student_id,
					...domainFields
				});
				else errors.push(`Row for roll_no ${roll_no} skipped: unknown student and missing name/department`);
			}
			if (toImport.length > 0) {
				const importHash = crypto.randomUUID();
				const { data: rpcData, error: rpcError } = await supabase.rpc("import_domain_data", {
					p_category: cat,
					p_import_hash: importHash,
					p_filename: file.name,
					p_records: toImport
				});
				if (rpcError) errors.push(`Transaction failed: ${rpcError.message}. (Ensure migration has been applied).`);
				else if (rpcData && rpcData.success === false) errors.push(`Database error: ${rpcData.error}`);
				else ok = toImport.length;
			}
			setResult({
				ok,
				errors
			});
			qc.invalidateQueries();
			if (ok > 0) toast.success(`${ok} record(s) imported safely`);
			else toast.error("No rows imported");
		} catch (err) {
			setResult({
				ok: 0,
				errors: [err.message]
			});
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Unified student data",
			title: "Data integration"
		}),
		result && result.errors.some((e) => e.includes("Ensure migration has been applied")) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 rounded-xl bg-orange-500/10 p-4 border border-orange-500/20 text-sm text-orange-600 dark:text-orange-400 flex items-start gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold",
				children: "Migration Pending"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"The remote database is missing the required RPC ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "import_domain_data" }),
				". Please apply the migration draft in ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "supabase/migrations" }),
				" to complete the end-to-end integration."
			] })] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: Object.keys(CATEGORIES).map((c) => {
				const Icon = ICONS[c];
				const q = quality(c);
				const last = imports.find((i) => i.category === c);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setCat(c),
					className: cn("card-surface p-4 text-left transition-colors", cat === c ? "border-primary ring-1 ring-primary" : "hover:bg-surface"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-10 place-items-center rounded-xl bg-surface-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-[18px]",
									strokeWidth: 1.6
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-subtle",
								children: last ? "● Connected" : "○ Not synced"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-sm font-medium",
							children: c
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-primary",
								style: { width: `${q}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-[11px] text-subtle",
							children: [
								"Data footprint ",
								q,
								"%"
							]
						})
					]
				}, c);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: `Upload ${cat} CSV` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Required columns: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
							className: "rounded bg-surface-2 px-1.5 py-0.5 text-xs",
							children: ["roll_no, ", CATEGORIES[cat].join(", ")]
						}),
						". Optional: name, department, year."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: fileRef,
					type: "file",
					accept: ".csv,text/csv",
					className: "hidden",
					onChange: (e) => {
						const f = e.target.files?.[0];
						if (f) onFile(f);
						e.target.value = "";
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => fileRef.current?.click(),
					disabled: busy,
					className: "mt-4 h-11 rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), busy ? "Validating transaction…" : "Choose CSV file"]
				}),
				result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2 rounded-xl bg-surface p-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }),
								result.ok,
								" rows transactionally applied"
							]
						}),
						result.errors.slice(0, 8).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-3.5 shrink-0" }), e]
						}, e)),
						result.errors.length > 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-subtle",
							children: [
								"+",
								result.errors.length - 8,
								" more"
							]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { title: "Import history" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y",
				children: imports.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 py-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("rounded-full border px-2 py-0.5 text-[11px]", i.status === "Failed" ? "border-primary bg-primary text-primary-foreground" : i.status === "Warning" ? "bg-surface-2" : ""),
							children: i.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-medium",
								children: i.filename
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-subtle",
								children: [
									i.category,
									" · ",
									i.row_count,
									" rows · ",
									i.message
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-subtle",
							children: new Date(i.created_at).toLocaleDateString()
						})
					]
				}, i.id))
			})]
		})
	] });
}
//#endregion
export { Integration as component };
