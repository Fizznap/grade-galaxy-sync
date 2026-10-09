import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-BhqelEmK.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-CMevzYJH.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-DokWGCKy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-CTSwYEur.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askInsights = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => {
	if (!Array.isArray(d?.messages) || d.messages.length === 0) throw new Error("No messages");
	return { messages: d.messages.slice(-12).map((m) => ({
		role: m.role,
		content: String(m.content).slice(0, 4e3)
	})) };
}).handler(createSsrRpc("861b5837d5d14a2cace1c0406cb690ef1f3ce322d9941ca5c4cd6af48ed23e1d"));
//#endregion
export { askInsights as t };
