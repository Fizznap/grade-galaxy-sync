//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-CJLizM8Q.js
var manifest = { "861b5837d5d14a2cace1c0406cb690ef1f3ce322d9941ca5c4cd6af48ed23e1d": {
	functionName: "askInsights_createServerFn_handler",
	importer: () => import("./_ssr/ai.functions-JpOSChDE.mjs")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
