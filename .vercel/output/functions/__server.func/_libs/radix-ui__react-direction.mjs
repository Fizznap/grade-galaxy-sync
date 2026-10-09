import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "./@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./radix-ui__react-context+react.mjs";
//#region node_modules/@radix-ui/react-direction/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
require_jsx_runtime();
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
var Direction = {
	LTR: "ltr",
	RTL: "rtl"
};
var DirectionContext = import_react.createContext(void 0);
function useDirection(localDir) {
	const globalDir = import_react.useContext(DirectionContext);
	return localDir || globalDir || Direction.LTR;
}
__name(useDirection, "useDirection");
//#endregion
export { useDirection as t };
