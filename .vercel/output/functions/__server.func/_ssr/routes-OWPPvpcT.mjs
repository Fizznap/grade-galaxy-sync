import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DORdWICZ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-D4TI73S7.mjs";
import { f as Wordmark } from "./kr-CoUFKPyh.mjs";
import { C as Eye, G as ArrowRight, w as EyeOff } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-BqL9iJXA.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-OWPPvpcT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		...opts,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function Welcome() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [show, setShow] = (0, import_react.useState)(false);
	async function forgot() {
		if (!email) {
			toast.error("Enter your email first");
			return;
		}
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
		if (error && /rate/i.test(error.message)) toast.error("Too many requests. Please wait a minute and try again.");
		else toast.success("If an account exists for that email, a reset link is on its way.");
	}
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({ to: "/dashboard" });
		});
		const { data } = supabase.auth.onAuthStateChange((_e, session) => {
			if (session) navigate({ to: "/dashboard" });
		});
		return () => data.subscription.unsubscribe();
	}, [navigate]);
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "in") {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
			} else {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: { full_name: name }
					}
				});
				if (error) throw error;
				if (!data.session) toast.success("Check your inbox to confirm your email.");
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setBusy(false);
		}
	}
	async function google() {
		if ((await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })).error) toast.error("Google sign-in failed");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "campus-canvas grid min-h-screen lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden flex-col justify-between overflow-hidden p-12 lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 flex items-center gap-2 text-sm font-medium text-primary-deep",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-9 place-items-center rounded-full bg-secondary",
							children: "K"
						}), " Your campus, connected"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-5xl font-semibold leading-[1.05] tracking-tight",
						children: [
							"KRYPTEDU",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-primary-deep",
								children: [
									"Smart Campus",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Analytics."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-lg font-medium",
						children: "Understand. Predict. Improve Student Success."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-md text-sm text-muted-foreground",
						children: "One view of academics, attendance, LMS, engagement, placement and skills — with a Student Success Score and early risk signals for every learner."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-subtle",
					children: "KPMG India · Challenge 04"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col justify-center px-6 py-12 sm:px-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rise mx-auto w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "mb-12 lg:hidden" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl font-semibold tracking-tight",
						children: mode === "in" ? "Welcome back" : "Create account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: mode === "in" ? "Sign in to your campus analytics workspace." : "Faculty access to the KRYPTEDU workspace."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "mt-8 space-y-3",
						children: [
							mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Full name",
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "h-12 rounded-xl"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								required: true,
								placeholder: "Email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "h-12 rounded-xl"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: show ? "text" : "password",
									required: true,
									minLength: 6,
									placeholder: "Password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									className: "h-12 rounded-xl pr-12"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShow(!show),
									"aria-label": show ? "Hide password" : "Show password",
									className: "absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-secondary",
									children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
								})]
							}),
							mode === "in" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: forgot,
								className: "block text-xs font-medium text-muted-foreground hover:text-foreground",
								children: "Forgot password?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: busy,
								className: "h-12 w-full rounded-xl",
								children: [
									busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-5 flex items-center gap-3 text-xs text-subtle",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
							" or ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: google,
						className: "h-12 w-full rounded-xl border",
						children: "Continue with Google"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setMode(mode === "in" ? "up" : "in"),
						className: "mt-6 w-full text-center text-sm text-muted-foreground hover:text-foreground",
						children: mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"
					})
				]
			})
		})]
	});
}
//#endregion
export { Welcome as component };
