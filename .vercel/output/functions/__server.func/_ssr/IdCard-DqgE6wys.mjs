import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DORdWICZ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { p as require_react_dom } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as cn } from "./button-D4TI73S7.mjs";
import { m as RotateCw, t as X } from "../_libs/lucide-react.mjs";
import { t as QRCodeSVG } from "../_libs/qrcode.react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/IdCard-DqgE6wys.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
function useMe() {
	const [me, setMe] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => {
			const u = data.user;
			if (!u) return;
			setMe({
				id: u.id,
				email: u.email,
				name: u.user_metadata?.["full_name"] || u.email?.split("@")[0] || "User",
				created: u.created_at
			});
		});
	}, []);
	return me;
}
function Spark({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": true,
		className: cn("inline-block leading-none", className),
		children: "✦"
	});
}
function IdCard({ className }) {
	const me = useMe();
	const [flip, setFlip] = (0, import_react.useState)(false);
	const idNo = me ? "KR-" + me.id.replace(/-/g, "").slice(0, 8).toUpperCase() : "KR-········";
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col items-center", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flip-scene rise w-full max-w-[300px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setFlip((f) => !f),
				"aria-label": "Flip ID card",
				className: "flip-inner relative block aspect-[5/8] w-full text-left",
				style: { transform: flip ? "rotateY(180deg)" : void 0 },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "face absolute inset-0 overflow-hidden rounded-[26px] bg-id text-id-foreground shadow-float",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							"aria-hidden": true,
							className: "absolute -right-3 top-6 text-[64px] font-bold leading-none opacity-10",
							children: [
								"KRYPT",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								year
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1.5 text-sm font-semibold tracking-[0.14em]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spark, { className: "text-primary" }), " KRYPTEDU"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] opacity-70",
								children: "Smart Campus Analytics"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute left-1/2 top-[34%] grid size-28 -translate-x-1/2 place-items-center rounded-full border border-id-foreground/20 bg-id-foreground/10 text-5xl font-bold",
							children: me?.name?.[0]?.toUpperCase() ?? "·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-id-ink to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-x-0 bottom-0 p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "break-words text-3xl font-bold uppercase leading-none tracking-tight",
									children: me?.name ?? "Loading"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 truncate text-xs opacity-75",
									children: me?.email
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-2 inline-block rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground",
									children: "Faculty · Staff"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "face-back absolute inset-0 flex flex-col items-center overflow-hidden rounded-[26px] bg-id p-5 text-id-foreground shadow-float",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1.5 self-start text-sm font-semibold tracking-[0.14em]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spark, { className: "text-primary" }), " KRYPTEDU"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 rounded-2xl bg-card p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeSVG, {
								value: idNo,
								size: 170,
								level: "M"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-mono text-xs tracking-wider opacity-80",
							children: idNo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-auto text-2xl font-bold uppercase tracking-tight",
							children: "Staff ID"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground",
							children: ["Valid till 06/", year + 1]
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setFlip((f) => !f),
			className: "glass press mt-5 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "size-4" }),
				" ",
				flip ? "Show front" : "Show QR code"
			]
		})]
	});
}
function ProfileIdButton({ className }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const me = useMe();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": "Show my ID card",
		onClick: () => setOpen(true),
		className: cn("press grid size-10 shrink-0 place-items-center rounded-full bg-ai text-sm font-bold text-primary-foreground shadow-float", className),
		children: me?.name?.[0]?.toUpperCase() ?? "·"
	}), open && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "My ID card",
		className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm",
		onClick: () => setOpen(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdCard, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setOpen(false),
				className: "glass press mx-auto mt-3 flex items-center gap-1 rounded-full px-4 py-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), " Close"]
			})]
		})
	}), document.body)] });
}
//#endregion
export { ProfileIdButton as n, IdCard as t };
