import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DORdWICZ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-D4TI73S7.mjs";
import { f as Wordmark } from "./kr-CoUFKPyh.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-BqL9iJXA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-DdMwb4tR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Reset() {
	const navigate = useNavigate();
	const [pw, setPw] = (0, import_react.useState)("");
	const [pw2, setPw2] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [state, setState] = (0, import_react.useState)("checking");
	(0, import_react.useEffect)(() => {
		const hash = new URLSearchParams(window.location.hash.slice(1));
		const query = new URLSearchParams(window.location.search);
		if (hash.get("error") || query.get("error")) {
			setState("invalid");
			return;
		}
		const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "PASSWORD_RECOVERY" || session) setState("ready");
		});
		const t = setTimeout(async () => {
			const { data } = await supabase.auth.getSession();
			setState((s) => s === "checking" ? data.session ? "ready" : "invalid" : s);
		}, 1500);
		return () => {
			sub.subscription.unsubscribe();
			clearTimeout(t);
		};
	}, []);
	async function save(e) {
		e.preventDefault();
		if (pw !== pw2) {
			toast.error("Passwords don't match");
			return;
		}
		setBusy(true);
		const { error } = await supabase.auth.updateUser({ password: pw });
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Password updated");
		navigate({ to: "/dashboard" });
	}
	if (state !== "ready") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "campus-canvas grid min-h-screen place-items-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface w-full max-w-sm space-y-4 rounded-[24px] p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: state === "checking" ? "Checking your link…" : "This reset link isn't valid"
				}),
				state === "invalid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "The link may have expired or already been used. Go back to sign in and choose \"Forgot password?\" to get a new one."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: () => navigate({ to: "/" }),
					className: "w-full",
					children: "Back to sign in"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "campus-canvas grid min-h-screen place-items-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: save,
			className: "surface w-full max-w-sm space-y-4 rounded-[24px] p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Set a new password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					required: true,
					minLength: 6,
					placeholder: "New password",
					value: pw,
					onChange: (e) => setPw(e.target.value),
					className: "h-12 rounded-xl"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					required: true,
					minLength: 6,
					placeholder: "Confirm new password",
					value: pw2,
					onChange: (e) => setPw2(e.target.value),
					className: "h-12 rounded-xl"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					className: "h-12 w-full rounded-xl",
					children: busy ? "Saving…" : "Update password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: () => navigate({ to: "/" }),
					className: "w-full",
					children: "Back to sign in"
				})
			]
		})
	});
}
//#endregion
export { Reset as component };
