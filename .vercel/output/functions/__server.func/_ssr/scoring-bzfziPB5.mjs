//#region node_modules/.nitro/vite/services/ssr/assets/scoring-bzfziPB5.js
var clamp = (num) => Math.max(0, Math.min(100, num));
var round = (num) => Math.round(num);
var n = (v) => {
	const x = Number(v);
	return Number.isFinite(x) ? x : 0;
};
/** Academic index: CGPA 50%, attendance 30%, LMS activity 20%, minus 5 per backlog. */
function academicIndex(s) {
	return round(clamp(n(s.cgpa) / 10 * 100 * .5 + n(s.attendance) * .3 + n(s.lms_activity) * .2 - n(s.backlogs) * 5));
}
/** Placement index: readiness 50%, skills 30%, feedback 20%. */
function placementIndex(s) {
	return round(clamp(n(s.placement_readiness) * .5 + n(s.skills_score) * .3 + n(s.feedback_score) * .2));
}
/** Student Success Score: academic 45%, placement 35%, engagement 20%. */
function successScore(s) {
	return round(clamp(academicIndex(s) * .45 + placementIndex(s) * .35 + n(s.engagement) * .2));
}
function academicRisk(s) {
	const a = academicIndex(s);
	if (a < 55 || n(s.backlogs) >= 2 || n(s.attendance) < 60) return "High";
	if (a < 70 || n(s.attendance) < 75) return "Medium";
	return "Low";
}
function placementRisk(s) {
	const p = placementIndex(s);
	if (p < 45) return "High";
	if (p < 65) return "Medium";
	return "Low";
}
function segmentOf(s) {
	const hiA = academicIndex(s) >= 65;
	const hiP = placementIndex(s) >= 60;
	return `${hiA ? "High" : "Low"} Academic / ${hiP ? "High" : "Low"} Placement`;
}
function riskFactors(s) {
	const f = [];
	if (n(s.cgpa) < 6) f.push(`Low CGPA (${n(s.cgpa)})`);
	if (n(s.attendance) < 75) f.push(`Attendance below 75% (${n(s.attendance)}%)`);
	if (n(s.backlogs) > 0) f.push(`${n(s.backlogs)} active backlog${n(s.backlogs) > 1 ? "s" : ""}`);
	if (n(s.lms_activity) < 45) f.push(`Low LMS activity (${n(s.lms_activity)})`);
	if (n(s.engagement) < 40) f.push(`Low campus engagement (${n(s.engagement)})`);
	if (n(s.placement_readiness) < 45) f.push(`Low placement readiness (${n(s.placement_readiness)})`);
	if (n(s.skills_score) < 40) f.push(`Skill gaps (${n(s.skills_score)})`);
	return f;
}
function score(s) {
	return {
		...s,
		cgpa: n(s.cgpa),
		academicIndex: academicIndex(s),
		placementIndex: placementIndex(s),
		successScore: successScore(s),
		academicRisk: academicRisk(s),
		placementRisk: placementRisk(s),
		segment: segmentOf(s),
		riskFactors: riskFactors(s)
	};
}
//#endregion
export { score as t };
