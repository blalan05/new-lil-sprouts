import { w as useParams } from "./action-6MWjotYm.js";
import { Tt as useSubmission, i as updateUnavailability, n as getUnavailability } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { Show, createEffect, createSignal } from "solid-js";
//#region src/routes/unavailability/[id]/edit.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = ["<wa-button", " href=\"/schedule\" appearance=\"plain\" size=\"small\">← Back to Schedule</wa-button>"];
var _tmpl$2 = ["<p", " class=\"wa-color-text-quiet\">Loading...</p>"];
var _tmpl$3 = [
	"<div",
	" class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"Start Time *\" name=\"startTime\" type=\"time\"",
	"",
	"></wa-input><wa-input label=\"End Time *\" name=\"endTime\" type=\"time\"",
	"",
	"></wa-input></div>"
];
var _tmpl$4 = [
	"<wa-callout",
	" variant=\"danger\">",
	"</wa-callout>"
];
var _tmpl$5 = [
	"<wa-card",
	"><form",
	" method=\"post\" class=\"wa-stack wa-gap-l\"><input type=\"hidden\" name=\"id\"",
	"><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Time Period</legend><wa-checkbox name=\"allDay\" value=\"true\"",
	">All Day Unavailability</wa-checkbox><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"Start Date *\" name=\"startDate\" type=\"date\" required",
	"></wa-input><wa-input label=\"End Date *\" name=\"endDate\" type=\"date\" required",
	"></wa-input></div><!--$-->",
	"<!--/--></fieldset><wa-input label=\"Reason\" name=\"reason\"",
	"></wa-input><wa-textarea label=\"Notes\" name=\"notes\" rows=\"4\"",
	"></wa-textarea><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button href=\"/schedule\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"danger\" appearance=\"filled\"",
	">",
	"</wa-button></div></form></wa-card>"
];
function toDateInput(value) {
	return new Date(value).toISOString().split("T")[0];
}
function EditUnavailability() {
	var _v$;
	const params = useParams();
	const unavailability = createMemo(() => getUnavailability(params.id));
	const submission = useSubmission(updateUnavailability);
	const [allDay, setAllDay] = createSignal(true);
	createEffect(() => {
		const item = unavailability();
		if (item) setAllDay(item.allDay);
	});
	return PageContent({ get children() {
		return [
			(_v$ = ssrHydrationKey(), ssr(_tmpl$, _v$)),
			PageHeader({ title: "Edit Blocked Time" }),
			Show({
				get when() {
					return unavailability();
				},
				get fallback() {
					var _v$2 = ssrHydrationKey();
					return ssr(_tmpl$2, _v$2);
				},
				children: (item) => {
					var _v$8, _g$, _v$16, _v$17, _v$3, _v$5, _g$3, _v$13, _g$2, _v$18, _v$19, _v$20, _v$4;
					return _v$3 = ssrHydrationKey(), _v$5 = () => {
						return ssrAttribute("checked", escape(allDay() || void 0, true));
					}, _g$3 = ssrGroup(() => {
						return [ssrAttribute("value", escape(toDateInput(item().startDate), true)), ssrAttribute("value", escape(toDateInput(item().endDate), true))];
					}, 2), _v$13 = escape(Show({
						get when() {
							return !allDay();
						},
						get children() {
							return _v$8 = ssrHydrationKey(), _g$ = ssrGroup(() => {
								return [
									ssrAttribute("required", escape(!allDay() || void 0, true)),
									ssrAttribute("value", escape(item().startTime || "", true)),
									ssrAttribute("required", escape(!allDay() || void 0, true)),
									ssrAttribute("value", escape(item().endTime || "", true))
								];
							}, 4), ssr(_tmpl$3, _v$8, ssrStyleProperty("--min-column-size:", "200px"), _g$, _g$, _g$, _g$);
						}
					})), _g$2 = ssrGroup(() => {
						return [ssrAttribute("value", escape(item().reason || "", true)), ssrAttribute("value", escape(item().notes || "", true))];
					}, 2), _v$18 = escape(Show({
						get when() {
							return submission.result instanceof Error;
						},
						get children() {
							return _v$16 = ssrHydrationKey(), _v$17 = () => {
								return escape(submission.result.message);
							}, ssr(_tmpl$4, _v$16, _v$17);
						}
					})), _v$19 = () => {
						return ssrAttribute("disabled", escape(submission.pending || void 0, true));
					}, _v$20 = () => {
						return submission.pending ? "Saving..." : "Save Changes";
					}, _v$4 = () => {
						return ssrAttribute("value", escape(item().id, true));
					}, ssr(_tmpl$5, _v$3, ssrAttribute("action", escape(updateUnavailability, true)), _v$4, ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), _v$5, ssrStyleProperty("--min-column-size:", "200px"), _g$3, _g$3, _v$13, _g$2, _g$2, _v$18, ssrStyleProperty("justify-content:", "flex-end"), _v$19, _v$20);
				}
			})
		];
	} });
}
//#endregion
export { EditUnavailability as default };
