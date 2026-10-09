import { t as supabase } from "./client-DORdWICZ.mjs";
import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { t as score } from "./scoring-bzfziPB5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-C0Xm0G2z.js
var studentsQuery = queryOptions({
	queryKey: ["students"],
	queryFn: async () => {
		const { data, error } = await supabase.from("students").select("*").order("name");
		if (error) throw error;
		return data.map(score);
	}
});
var interventionsQuery = queryOptions({
	queryKey: ["interventions"],
	queryFn: async () => {
		const { data, error } = await supabase.from("interventions").select("*").order("created_at", { ascending: false });
		if (error) throw error;
		return data;
	}
});
var importsQuery = queryOptions({
	queryKey: ["imports"],
	queryFn: async () => {
		const { data, error } = await supabase.from("data_imports").select("*").order("created_at", { ascending: false });
		if (error) throw error;
		return data;
	}
});
function avg(nums) {
	return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
}
//#endregion
export { studentsQuery as i, importsQuery as n, interventionsQuery as r, avg as t };
