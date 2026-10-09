import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DORdWICZ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { o as useQueryClient, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as cn, t as Button } from "./button-D4TI73S7.mjs";
import { a as PageHeader, l as SectionTitle, n as Card } from "./kr-CoUFKPyh.mjs";
import { i as studentsQuery, n as importsQuery } from "./data-BpmQLrZk.mjs";
import { B as Briefcase, M as CircleCheck, V as BookOpen, a as TriangleAlert, i as Upload, q as Activity, s as Star, x as GraduationCap, z as CalendarCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_papaparse } from "../_libs/papaparse.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/integration-D-niLYff.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_papaparse = /* @__PURE__ */ __toESM(require_papaparse());
var CATEGORIES = {
	Academic: ["cgpa", "backlogs"],
	Attendance: ["attendance"],
	LMS: ["lms_activity"],
	Engagement: ["engagement"],
	Placement: ["placement_readiness"],
	"Skills and Feedback": ["skills_score", "feedback_score"]
};
var RANGE = {
	cgpa: [0, 10],
	backlogs: [0, 30],
	attendance: [0, 100],
	lms_activity: [0, 100],
	engagement: [0, 100],
	placement_readiness: [0, 100],
	skills_score: [0, 100],
	feedback_score: [0, 100],
	year: [1, 6]
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
		errors: [`Missing column(s): ${missing.join(", ")}`]
	};
	const valid = [];
	const seen = /* @__PURE__ */ new Map();
	rows.forEach((r, idx) => {
		const line = idx + 2;
		const roll = r["roll_no"];
		if (!roll) {
			errors.push(`Row ${line}: roll_no is empty`);
			return;
		}
		const first = seen.get(roll);
		if (first) {
			errors.push(`Row ${line}: duplicate roll_no ${roll} (already in row ${first}), skipped`);
			return;
		}
		seen.set(roll, line);
		const out = { roll_no: roll };
		for (const f of [...CATEGORIES[category], "year"]) {
			if (!(f in r) || r[f] === "") continue;
			const n = Number(r[f]);
			const [lo, hi] = RANGE[f] ?? [0, 100];
			if (Number.isNaN(n) || n < lo || n > hi) {
				errors.push(`Row ${line}: ${f} must be between ${lo} and ${hi}`);
				return;
			}
			out[f] = f === "cgpa" ? n : Math.round(n);
		}
		if (r["name"]) out["name"] = r["name"];
		if (r["department"]) out["department"] = r["department"];
		valid.push(out);
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
	"Skills and Feedback": Star
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
		const f = CATEGORIES[c];
		const filled = students.filter((s) => f.every((k) => Number(s[k]) > 0 || k === "backlogs")).length;
		return Math.round(filled / Math.max(1, students.length) * 100);
	};
	async function onFile(file) {
		setBusy(true);
		setResult(null);
		const { headers, rows } = parseCsv(await file.text());
		const { valid, errors } = validate(cat, headers, rows);
		const known = new Map(students.map((s) => [s.roll_no, s.id]));
		let ok = 0;
		const batchSize = 50;
		for (let i = 0; i < valid.length; i += batchSize) {
			const batch = valid.slice(i, i + batchSize);
			await Promise.all(batch.map(async (row) => {
				const { roll_no, ...fields } = row;
				if (known.has(String(roll_no))) {
					const { error } = await supabase.from("students").update({
						...fields,
						updated_at: (/* @__PURE__ */ new Date()).toISOString()
					}).eq("roll_no", String(roll_no));
					if (error) errors.push(`${roll_no}: ${error.message}`);
					else ok++;
				} else if (fields["name"] && fields["department"]) {
					const { error } = await supabase.from("students").insert({
						roll_no: String(roll_no),
						...fields
					});
					if (error) errors.push(`${roll_no}: ${error.message}`);
					else ok++;
				} else errors.push(`${roll_no}: unknown roll number (add name and department columns to create new students)`);
			}));
		}
		const { data: u } = await supabase.auth.getUser();
		await supabase.from("data_imports").insert({
			category: cat,
			filename: file.name,
			row_count: ok,
			status: errors.length === 0 ? "Completed" : ok > 0 ? "Warning" : "Failed",
			message: errors.length ? `${errors.length} issue(s)` : "All rows validated",
			created_by: u.user?.id ?? null
		});
		setResult({
			ok,
			errors
		});
		setBusy(false);
		qc.invalidateQueries();
		if (ok) toast.success(`${ok} record(s) imported`);
		else toast.error("No rows imported");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Unified student data",
			title: "Data integration"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-3",
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
								"Data quality ",
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
						". Optional: name, department, year (creates new students)."
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), busy ? "Validating…" : "Choose CSV file"]
				}),
				result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2 rounded-xl bg-surface p-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }),
								result.ok,
								" rows imported"
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
