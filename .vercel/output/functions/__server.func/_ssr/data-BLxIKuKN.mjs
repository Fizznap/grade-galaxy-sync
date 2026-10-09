import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-BLxIKuKN.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	role: "alert",
	className: "text-sm",
	children: String(error?.message ?? error)
});
//#endregion
export { SplitErrorComponent as errorComponent };
