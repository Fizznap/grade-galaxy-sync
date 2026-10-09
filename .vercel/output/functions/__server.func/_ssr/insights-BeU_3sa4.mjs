import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { G as isRedirect, S as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./button-D4TI73S7.mjs";
import { a as PageHeader } from "./kr-CoUFKPyh.mjs";
import { U as ArrowUp, c as Square, h as RotateCcw, l as SquarePen, u as Sparkles } from "../_libs/lucide-react.mjs";
import { t as askInsights } from "./ai.functions-CTSwYEur.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-BeU_3sa4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var SUGGESTIONS = [
	"Which students need urgent academic support?",
	"Who has strong academics but low placement readiness?",
	"Compare departments by success score",
	"Suggest interventions for attendance risk"
];
function render(text) {
	return text.split("\n").map((line, i) => {
		const html = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
		const bullet = /^\s*[-*•]\s+/.test(line);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn(bullet && "pl-4 -indent-3", !line.trim() && "h-2"),
			dangerouslySetInnerHTML: { __html: bullet ? "• " + html.replace(/^\s*[-*•]\s+/, "") : html }
		}, i);
	});
}
function Insights() {
	const ask = useServerFn(askInsights);
	const [msgs, setMsgs] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const end = (0, import_react.useRef)(null);
	const ctrl = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, busy]);
	async function send(text, base = msgs) {
		if (!text.trim() || busy) return;
		const next = [...base, {
			role: "user",
			content: text.trim()
		}];
		setMsgs(next);
		setInput("");
		setBusy(true);
		const ac = new AbortController();
		ctrl.current = ac;
		try {
			const r = await ask({
				data: { messages: next.filter((m) => !m.failed).map(({ role, content }) => ({
					role,
					content
				})) },
				signal: ac.signal
			});
			if (ac.signal.aborted) return;
			setMsgs([...next, {
				role: "assistant",
				content: r.error ?? r.reply,
				...r.error ? { failed: true } : {}
			}]);
		} catch {
			if (ac.signal.aborted) return;
			setMsgs([...next, {
				role: "assistant",
				content: "The assistant is unavailable right now.",
				failed: true
			}]);
		} finally {
			if (ctrl.current === ac) {
				ctrl.current = null;
				setBusy(false);
			}
		}
	}
	function stop() {
		const ac = ctrl.current;
		if (!ac) return;
		ac.abort();
		ctrl.current = null;
		setBusy(false);
		setMsgs((m) => [...m, {
			role: "assistant",
			content: "Stopped — no answer was generated.",
			failed: true
		}]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[calc(100vh-14rem)] flex-col lg:min-h-[calc(100vh-6rem)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: "KRYPTEDU AI",
				title: "AI Insights",
				action: msgs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: busy,
					onClick: () => {
						if (confirm("Start a new conversation? This clears the current one.")) setMsgs([]);
					},
					className: "press flex items-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-xs font-medium disabled:opacity-40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" }), " New chat"]
				}) : void 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-4",
				children: [
					msgs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-10 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto grid size-16 place-items-center rounded-full bg-primary text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									className: "size-6",
									strokeWidth: 1.6
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-6 text-2xl font-semibold tracking-tight",
								children: "How can I help today?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Answers are grounded in your institution's student data."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2",
								children: SUGGESTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => send(s),
									className: "rounded-full border bg-surface px-4 py-2 text-xs hover:bg-surface-2",
									children: s
								}, s))
							})
						]
					}),
					msgs.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("flex", m.role === "user" && "justify-end"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("max-w-[85%] space-y-1 rounded-2xl px-4 py-3 text-sm leading-relaxed", m.role === "user" ? "bg-primary text-primary-foreground" : "card-surface"),
							children: [
								m.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-subtle",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), " Answer"]
								}),
								render(m.content),
								m.failed && i === msgs.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										const prev = msgs.slice(0, -1);
										const last = prev[prev.length - 1];
										setMsgs(prev.slice(0, -1));
										if (last) send(last.content, prev.slice(0, -1));
									},
									className: "press mt-2 flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), " Retry"]
								})
							]
						})
					}, i)),
					busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-surface w-fit px-4 py-3 text-sm text-subtle",
						children: "Analysing student data…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: end })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					send(input);
				},
				className: "sticky bottom-24 mt-4 flex items-center gap-2 rounded-2xl border bg-background p-2 shadow-soft lg:bottom-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: "Ask about your students…",
					className: "h-10 flex-1 bg-transparent px-3 text-sm outline-none"
				}), busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: stop,
					"aria-label": "Stop generating",
					className: "press flex h-10 items-center gap-1.5 rounded-xl bg-foreground px-3 text-xs font-medium text-background",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5 fill-current" }), " Stop"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: !input.trim(),
					"aria-label": "Send",
					className: "grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
				})]
			})
		]
	});
}
//#endregion
export { Insights as component };
