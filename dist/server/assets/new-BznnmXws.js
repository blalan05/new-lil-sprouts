import { w as useParams } from "./action-6MWjotYm.js";
import { Q as getFamily, Tt as useSubmission, et as createSessionReport } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, scope, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createSignal } from "solid-js";
//#region src/routes/families/[id]/sessions/[sessionId]/reports/new.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<wa-button",
	" href=\"",
	"\" appearance=\"plain\" size=\"small\">← Back to Session</wa-button>"
];
var _tmpl$2 = [
	"<div",
	" class=\"wa-stack wa-gap-s\">",
	"</div>"
];
var _tmpl$3 = ["<wa-textarea", " label=\"Action Taken\" name=\"actionTaken\" rows=\"3\" placeholder=\"What did you do in response? First aid applied? Comfort given?\"></wa-textarea>"];
var _tmpl$4 = [
	"<wa-callout",
	" variant=\"danger\"><strong>Important:</strong> Parents will be notified of this <!--$-->",
	"<!--/-->. Make sure to include all relevant details.</wa-callout>"
];
var _tmpl$5 = [
	"<wa-callout",
	" variant=\"danger\">",
	"</wa-callout>"
];
var _tmpl$6 = [
	"<wa-card",
	"><form",
	" method=\"post\" class=\"wa-stack wa-gap-l\"><input type=\"hidden\" name=\"careSessionId\"",
	"><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Report Type</legend><wa-select label=\"What happened? *\" name=\"type\" required",
	"><wa-option value=\"GENERAL\">General Update</wa-option><wa-option value=\"ACTIVITY\">Activity/Play</wa-option><wa-option value=\"MEAL\">Meal/Snack</wa-option><wa-option value=\"NAP\">Nap/Rest</wa-option><wa-option value=\"BEHAVIOR\">Behavior Note</wa-option><wa-option value=\"MILESTONE\">Milestone Achieved</wa-option><wa-option value=\"INCIDENT\">Minor Incident</wa-option><wa-option value=\"ACCIDENT\">Accident/Injury</wa-option><wa-option value=\"MEDICATION\">Medication Given</wa-option></wa-select><wa-select label=\"Severity *\" name=\"severity\" required",
	"><wa-option value=\"INFO\">Info - FYI only</wa-option><wa-option value=\"MINOR\">Minor - No action needed</wa-option><wa-option value=\"MODERATE\">Moderate - May need follow-up</wa-option><wa-option value=\"SEVERE\">Severe - Requires attention</wa-option></wa-select></fieldset><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Which Child?</legend><!--$-->",
	"<!--/--></fieldset><div class=\"wa-stack wa-gap-s\"><label class=\"wa-heading-s\">When did this happen? *</label><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input type=\"date\" name=\"timestampDate\" required",
	"></wa-input><wa-input type=\"time\" name=\"timestampTime\" required",
	"></wa-input></div><input type=\"hidden\" name=\"timestamp\" value=\"",
	"\"></div><wa-input label=\"Brief Summary *\" name=\"title\" required",
	"></wa-input><wa-textarea label=\"Details *\" name=\"description\" rows=\"6\" required",
	"></wa-textarea><!--$-->",
	"<!--/--><wa-checkbox name=\"followUpNeeded\" value=\"true\">Follow-up Needed — check if parents need to take action or be contacted</wa-checkbox><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button href=\"",
	"\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"brand\" appearance=\"filled\"",
	">",
	"</wa-button></div></form></wa-card>"
];
var _tmpl$7 = [
	"<p",
	" class=\"wa-color-text-quiet\" style=\"",
	"\">No children for this family</p>"
];
var _tmpl$8 = [
	"<div",
	" class=\"wa-body-s\" style=\"",
	"\">Allergies: <!--$-->",
	"<!--/--></div>"
];
var _tmpl$9 = [
	"<label",
	" style=\"",
	"\"><input type=\"radio\" name=\"childId\"",
	" required><div><div class=\"wa-heading-s\"><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--></div></label>"
];
function NewSessionReport() {
	var _v$, _v$2;
	const params = useParams();
	const family = createMemo(() => getFamily(params.id));
	const submission = useSubmission(createSessionReport);
	const [reportType, setReportType] = createSignal("GENERAL");
	const now = /* @__PURE__ */ new Date();
	const currentDate = now.toISOString().split("T")[0];
	const currentTime = now.toTimeString().slice(0, 5);
	const isIncidentType = () => {
		const type = reportType();
		return type === "INCIDENT" || type === "ACCIDENT";
	};
	const getDefaultSeverity = () => {
		switch (reportType()) {
			case "ACCIDENT": return "SEVERE";
			case "INCIDENT": return "MODERATE";
			case "BEHAVIOR": return "MINOR";
			default: return "INFO";
		}
	};
	return PageContent({ get children() {
		return [
			(_v$ = ssrHydrationKey(), _v$2 = () => {
				return `/families/${escape(params.id, true)}/sessions/${escape(params.sessionId, true)}`;
			}, ssr(_tmpl$, _v$, _v$2)),
			PageHeader({
				title: "Add Session Report",
				description: "Document an incident, activity, meal, or update during this care session"
			}),
			Show({
				get when() {
					return family();
				},
				children: (familyData) => {
					var _v$7, _v$8, _v$12, _v$14, _v$15, _v$17, _v$18, _v$3, _g$3, _v$9, _g$2, _v$13, _v$16, _v$19, _g$, _v$22, _v$4;
					return _v$3 = ssrHydrationKey(), _g$3 = ssrGroup(() => {
						return [ssrAttribute("value", escape(reportType(), true)), ssrAttribute("value", escape(getDefaultSeverity(), true))];
					}, 2), _v$9 = escape(Show({
						get when() {
							return familyData().children?.length;
						},
						get fallback() {
							var _v$23 = ssrHydrationKey();
							return ssr(_tmpl$7, _v$23, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "var(--wa-space-m)"));
						},
						get children() {
							return _v$7 = ssrHydrationKey(), _v$8 = escape(For({
								get each() {
									return familyData().children;
								},
								children: (child) => {
									var _v$28, _v$29, _v$24, _v$26, _v$27, _v$30, _v$25;
									return _v$24 = ssrHydrationKey(), _v$26 = () => {
										return escape(child.firstName);
									}, _v$27 = () => {
										return escape(child.lastName);
									}, _v$30 = escape(Show({
										get when() {
											return child.allergies;
										},
										get children() {
											return _v$28 = ssrHydrationKey(), _v$29 = () => {
												return escape(child.allergies);
											}, ssr(_tmpl$8, _v$28, ssrStyleProperty("color:", "var(--wa-color-danger-40)"), _v$29);
										}
									})), _v$25 = () => {
										return ssrAttribute("value", escape(child.id, true));
									}, ssr(_tmpl$9, _v$24, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "var(--wa-space-s)") + ssrStyleProperty(";padding:", "var(--wa-space-s)") + ssrStyleProperty(";border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";cursor:", "pointer"), _v$25, _v$26, _v$27, _v$30);
								}
							})), ssr(_tmpl$2, _v$7, _v$8);
						}
					})), _g$2 = ssrGroup(() => {
						return [ssrAttribute("placeholder", reportType() === "MEAL" ? "e.g., Lunch - ate most of meal" : reportType() === "NAP" ? "e.g., Afternoon nap - 1.5 hours" : reportType() === "INCIDENT" ? "e.g., Minor bump on playground" : "Brief description..."), ssrAttribute("placeholder", reportType() === "MEAL" ? "What did they eat? How much? Any issues?" : reportType() === "NAP" ? "How long did they sleep? Any difficulty falling asleep?" : reportType() === "INCIDENT" ? "What happened? Where? How did the child react?" : "Provide detailed information about what happened...")];
					}, 2), _v$13 = escape(Show({
						get when() {
							return isIncidentType();
						},
						get children() {
							return _v$12 = ssrHydrationKey(), ssr(_tmpl$3, _v$12);
						}
					})), _v$16 = escape(Show({
						get when() {
							return isIncidentType();
						},
						get children() {
							return _v$14 = ssrHydrationKey(), _v$15 = scope(() => {
								return escape(reportType().toLowerCase());
							}), ssr(_tmpl$4, _v$14, _v$15);
						}
					})), _v$19 = escape(Show({
						get when() {
							return submission.result;
						},
						get children() {
							return _v$17 = ssrHydrationKey(), _v$18 = () => {
								return escape(submission.result.message);
							}, ssr(_tmpl$5, _v$17, _v$18);
						}
					})), _g$ = ssrGroup(() => {
						return [`/families/${escape(params.id, true)}/sessions/${escape(params.sessionId, true)}`, ssrAttribute("disabled", escape(submission.pending || void 0, true))];
					}, 2), _v$22 = () => {
						return submission.pending ? "Saving..." : "Save Report";
					}, _v$4 = () => {
						return ssrAttribute("value", escape(params.sessionId, true));
					}, ssr(_tmpl$6, _v$3, ssrAttribute("action", escape(createSessionReport, true)), _v$4, ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), _g$3, _g$3, ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), _v$9, ssrStyleProperty("--min-column-size:", "200px"), ssrAttribute("value", escape(currentDate, true)), ssrAttribute("value", escape(currentTime, true)), `${escape(currentDate, true)}T${escape(currentTime, true)}`, _g$2, _g$2, _v$13, _v$16, _v$19, ssrStyleProperty("justify-content:", "flex-end"), _g$, _g$, _v$22);
				}
			})
		];
	} });
}
//#endregion
export { NewSessionReport as default };
