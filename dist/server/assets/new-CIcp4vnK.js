import { Tt as useSubmission, t as createUnavailability } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { Show, createSignal } from "solid-js";
//#region src/routes/unavailability/new.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = ["<wa-button", " href=\"/schedule\" appearance=\"plain\" size=\"small\">← Back to Schedule</wa-button>"];
var _tmpl$2 = [
	"<div",
	" class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"Start Time *\" name=\"startTime\" type=\"time\"",
	"></wa-input><wa-input label=\"End Time *\" name=\"endTime\" type=\"time\"",
	"></wa-input></div>"
];
var _tmpl$3 = ["<p", " class=\"wa-body-s wa-color-text-quiet\">Only block specific hours within these dates</p>"];
var _tmpl$4 = [
	"<wa-callout",
	" variant=\"danger\">",
	"</wa-callout>"
];
var _tmpl$5 = [
	"<wa-card",
	"><form",
	" method=\"post\" class=\"wa-stack wa-gap-l\"><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Time Period</legend><wa-checkbox name=\"allDay\" value=\"true\"",
	">All Day Unavailability — entire day(s) are blocked out</wa-checkbox><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"Start Date *\" name=\"startDate\" type=\"date\" required",
	"></wa-input><wa-input label=\"End Date *\" name=\"endDate\" type=\"date\" required",
	"></wa-input></div><!--$-->",
	"<!--/--></fieldset><wa-input label=\"Reason\" name=\"reason\" placeholder=\"e.g., Vacation, Holiday, Personal\" hint=\"Optional: Add a reason for your records\"></wa-input><wa-textarea label=\"Notes\" name=\"notes\" rows=\"4\" placeholder=\"Any additional details...\"></wa-textarea><wa-callout variant=\"warning\"><strong>Note:</strong> Blocking time will prevent new sessions from being scheduled during this period. Existing sessions will not be automatically cancelled.</wa-callout><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button href=\"/schedule\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"danger\" appearance=\"filled\"",
	">",
	"</wa-button></div></form></wa-card>"
];
function NewUnavailability() {
	var _v$, _v$4, _g$, _v$7, _v$9, _v$10, _v$2, _v$3, _v$8, _v$11, _v$12, _v$13;
	const submission = useSubmission(createUnavailability);
	const [allDay, setAllDay] = createSignal(true);
	const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	return PageContent({ get children() {
		return [
			(_v$ = ssrHydrationKey(), ssr(_tmpl$, _v$)),
			PageHeader({
				title: "Block Out Time",
				description: "Mark days or times when you're unavailable for care sessions"
			}),
			(_v$2 = ssrHydrationKey(), _v$3 = () => {
				return ssrAttribute("checked", escape(allDay() || void 0, true));
			}, _v$8 = escape(Show({
				get when() {
					return !allDay();
				},
				get children() {
					return [(_v$4 = ssrHydrationKey(), _g$ = ssrGroup(() => {
						return [ssrAttribute("required", escape(!allDay() || void 0, true)), ssrAttribute("required", escape(!allDay() || void 0, true))];
					}, 2), ssr(_tmpl$2, _v$4, ssrStyleProperty("--min-column-size:", "200px"), _g$, _g$)), (_v$7 = ssrHydrationKey(), ssr(_tmpl$3, _v$7))];
				}
			})), _v$11 = escape(Show({
				get when() {
					return submission.result;
				},
				get children() {
					return _v$9 = ssrHydrationKey(), _v$10 = () => {
						return escape(submission.result.message);
					}, ssr(_tmpl$4, _v$9, _v$10);
				}
			})), _v$12 = () => {
				return ssrAttribute("disabled", escape(submission.pending || void 0, true));
			}, _v$13 = () => {
				return submission.pending ? "Blocking..." : "Block Time";
			}, ssr(_tmpl$5, _v$2, ssrAttribute("action", escape(createUnavailability, true)), ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), _v$3, ssrStyleProperty("--min-column-size:", "200px"), ssrAttribute("value", escape(today, true)), ssrAttribute("value", escape(today, true)), _v$8, _v$11, ssrStyleProperty("justify-content:", "flex-end"), _v$12, _v$13))
		];
	} });
}
//#endregion
export { NewUnavailability as default };
