import { w as useParams } from "./action-6MWjotYm.js";
import { F as getChild, L as updateChild, Tt as useSubmission } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { Show } from "solid-js";
//#region src/routes/families/[id]/children/[childId]/edit.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<wa-button",
	" href=\"",
	"\" appearance=\"plain\" size=\"small\">← Back to Child Details</wa-button>"
];
var _tmpl$2 = [
	"<wa-callout",
	" variant=\"danger\">",
	"</wa-callout>"
];
var _tmpl$3 = [
	"<wa-card",
	"><form",
	" method=\"post\" class=\"wa-stack wa-gap-l\"><input type=\"hidden\" name=\"id\"",
	"><input type=\"hidden\" name=\"familyId\"",
	"><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Basic Information</legend><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"First Name *\" name=\"firstName\" required",
	" placeholder=\"Emma\"></wa-input><wa-input label=\"Last Name *\" name=\"lastName\" required",
	" placeholder=\"Smith\"></wa-input></div><wa-input label=\"Date of Birth *\" name=\"dateOfBirth\" type=\"date\" required",
	"></wa-input><wa-select label=\"Gender\" name=\"gender\"",
	"><wa-option value>Select gender...</wa-option><wa-option value=\"MALE\">Male</wa-option><wa-option value=\"FEMALE\">Female</wa-option><wa-option value=\"OTHER\">Other</wa-option><wa-option value=\"PREFER_NOT_TO_SAY\">Prefer not to say</wa-option></wa-select></fieldset><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">School Information</legend><wa-input label=\"School Name\" name=\"schoolName\"",
	" placeholder=\"Lincoln Elementary School\"></wa-input><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"Grade\" name=\"schoolGrade\"",
	" placeholder=\"3rd Grade\"></wa-input><wa-input label=\"Teacher Name\" name=\"schoolTeacher\"",
	" placeholder=\"Ms. Johnson\"></wa-input></div></fieldset><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Medical Information</legend><wa-textarea label=\"Allergies\" name=\"allergies\" rows=\"2\"",
	" placeholder=\"Peanuts, tree nuts, dairy, etc.\" hint=\"List any known allergies\"></wa-textarea><wa-textarea label=\"Medications\" name=\"medications\" rows=\"2\"",
	" placeholder=\"List any regular medications...\"></wa-textarea><wa-textarea label=\"Special Needs\" name=\"specialNeeds\" rows=\"2\"",
	" placeholder=\"Any special needs or accommodations...\"></wa-textarea></fieldset><wa-textarea label=\"Additional Notes\" name=\"notes\" rows=\"4\"",
	" placeholder=\"Any additional information about the child...\"></wa-textarea><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button href=\"",
	"\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"brand\" appearance=\"filled\"",
	">",
	"</wa-button></div></form></wa-card>"
];
function EditChild() {
	var _v$, _v$2;
	const params = useParams();
	const child = createMemo(() => getChild(params.childId));
	const submission = useSubmission(updateChild);
	const formatDateForInput = (date) => {
		return new Date(date).toISOString().split("T")[0];
	};
	return PageContent({ get children() {
		return [
			(_v$ = ssrHydrationKey(), _v$2 = () => {
				return `/families/${escape(params.id, true)}/children/${escape(params.childId, true)}`;
			}, ssr(_tmpl$, _v$, _v$2)),
			PageHeader({ title: "Edit Child" }),
			Show({
				get when() {
					return child();
				},
				children: (childData) => {
					var _v$17, _v$18, _v$3, _g$4, _v$10, _g$3, _g$2, _v$19, _g$, _v$22, _v$4, _v$5;
					return _v$3 = ssrHydrationKey(), _g$4 = ssrGroup(() => {
						return [
							ssrAttribute("value", escape(childData().firstName, true)),
							ssrAttribute("value", escape(childData().lastName, true)),
							ssrAttribute("value", escape(formatDateForInput(childData().dateOfBirth), true)),
							ssrAttribute("value", escape(childData().gender || "", true))
						];
					}, 4), _v$10 = () => {
						return ssrAttribute("value", escape(childData().schoolName || "", true));
					}, _g$3 = ssrGroup(() => {
						return [ssrAttribute("value", escape(childData().schoolGrade || "", true)), ssrAttribute("value", escape(childData().schoolTeacher || "", true))];
					}, 2), _g$2 = ssrGroup(() => {
						return [
							ssrAttribute("value", escape(childData().allergies || "", true)),
							ssrAttribute("value", escape(childData().medications || "", true)),
							ssrAttribute("value", escape(childData().specialNeeds || "", true)),
							ssrAttribute("value", escape(childData().notes || "", true))
						];
					}, 4), _v$19 = escape(Show({
						get when() {
							return submission.result;
						},
						get children() {
							return _v$17 = ssrHydrationKey(), _v$18 = () => {
								return escape(submission.result.message);
							}, ssr(_tmpl$2, _v$17, _v$18);
						}
					})), _g$ = ssrGroup(() => {
						return [`/families/${escape(params.id, true)}/children/${escape(params.childId, true)}`, ssrAttribute("disabled", escape(submission.pending || void 0, true))];
					}, 2), _v$22 = () => {
						return submission.pending ? "Saving..." : "Save Changes";
					}, _v$4 = () => {
						return ssrAttribute("value", escape(childData().id, true));
					}, _v$5 = () => {
						return ssrAttribute("value", escape(childData().familyId, true));
					}, ssr(_tmpl$3, _v$3, ssrAttribute("action", escape(updateChild, true)), _v$4, _v$5, ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), ssrStyleProperty("--min-column-size:", "200px"), _g$4, _g$4, _g$4, _g$4, ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), _v$10, ssrStyleProperty("--min-column-size:", "200px"), _g$3, _g$3, ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), _g$2, _g$2, _g$2, _g$2, _v$19, ssrStyleProperty("justify-content:", "flex-end"), _g$, _g$, _v$22);
				}
			})
		];
	} });
}
//#endregion
export { EditChild as default };
