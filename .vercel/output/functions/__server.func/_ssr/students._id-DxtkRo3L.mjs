import { X as notFound, _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as studentsQuery, r as interventionsQuery } from "./data-BpmQLrZk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students._id-DxtkRo3L.js
var $$splitErrorComponentImporter = () => import("./students._id-5xy1Inet.mjs");
var $$splitNotFoundComponentImporter = () => import("./students._id-DOl7wLGq.mjs");
var $$splitComponentImporter = () => import("./students._id-sGQ4cDLE.mjs");
var Route = createFileRoute("/_authenticated/students/$id")({
	head: () => ({ meta: [
		{ title: "Student profile — KRYPTEDU" },
		{
			name: "description",
			content: "Student intelligence profile."
		},
		{
			property: "og:title",
			content: "Student profile — KRYPTEDU"
		},
		{
			property: "og:description",
			content: "Student intelligence profile."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	loader: async ({ context, params }) => {
		const list = await context.queryClient.ensureQueryData(studentsQuery);
		await context.queryClient.ensureQueryData(interventionsQuery);
		if (!list.find((s) => s.id === params.id)) throw notFound();
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
//#endregion
export { Route as t };
