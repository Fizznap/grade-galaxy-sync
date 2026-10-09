import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn, t as Button } from "./button-D4TI73S7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kr-CoUFKPyh.js
var import_jsx_runtime = require_jsx_runtime();
function Wordmark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 24 24",
				className: "size-4",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.2",
				strokeLinecap: "round",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 4v16M18 4l-9 8 9 8" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[15px] font-bold tracking-[0.14em] text-foreground",
				children: "KRYPTEDU"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-[10px] uppercase tracking-wider text-subtle",
				children: "Smart Campus Analytics"
			})]
		})]
	});
}
function PageHeader({ eyebrow, title, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-medium uppercase tracking-wider text-primary-deep",
			children: eyebrow
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 text-2xl font-semibold tracking-tight md:text-3xl",
			children: title
		})] }), action]
	});
}
function Card({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("card-surface p-5", className),
		children
	});
}
function SectionTitle({ title, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-[15px] font-semibold",
			children: title
		}), action]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 text-3xl font-semibold tracking-tight tabular-nums",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-subtle",
				children: hint
			})
		]
	});
}
var riskStyle = {
	High: "bg-primary text-primary-foreground border-primary",
	Medium: "bg-surface-2 text-foreground border-border",
	Low: "bg-background text-muted-foreground border-border"
};
var riskMark = {
	High: "●",
	Medium: "◐",
	Low: "○"
};
function RiskBadge({ risk, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium", riskStyle[risk]),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				children: riskMark[risk]
			}),
			label ? `${label}: ` : "",
			risk
		]
	});
}
function Pill({ children, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "outline",
		type: "button",
		onClick,
		className: cn("whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-surface"),
		children
	});
}
function ScoreRing({ value, size = 140 }) {
	const r = size / 2 - 10;
	const c = 2 * Math.PI * r;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			className: "-rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r,
				fill: "none",
				stroke: "var(--color-surface-2)",
				strokeWidth: "10"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r,
				fill: "none",
				stroke: "var(--color-primary)",
				strokeWidth: "10",
				strokeLinecap: "round",
				strokeDasharray: c,
				strokeDashoffset: c * (1 - value / 100)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 grid place-items-center text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-3xl font-semibold tabular-nums",
				children: value
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-wider text-subtle",
				children: "Success"
			})] })
		})]
	});
}
function Bar({ value, label, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1.5 flex justify-between text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium tabular-nums",
			children: right ?? value
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 overflow-hidden rounded-full bg-surface-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full bg-primary",
			style: { width: `${Math.min(100, value)}%` }
		})
	})] });
}
function Empty({ title, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-dashed p-8 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-medium",
			children: title
		}), text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-xs text-subtle",
			children: text
		})]
	});
}
function Loading() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[50vh] place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto size-6 animate-spin rounded-full border-2 border-border border-t-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-xs tracking-[0.2em] text-subtle",
				children: "KRYPTEDU"
			})]
		})
	});
}
function StudentLink({ id, children, className, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/students/$id",
		params: { id },
		className,
		onClick,
		children
	});
}
//#endregion
export { PageHeader as a, ScoreRing as c, StudentLink as d, Wordmark as f, Loading as i, SectionTitle as l, Card as n, Pill as o, Empty as r, RiskBadge as s, Bar as t, Stat as u };
