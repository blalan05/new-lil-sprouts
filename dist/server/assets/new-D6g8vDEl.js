import { w as useParams } from "./action-6MWjotYm.js";
import { N as createChild, Tt as useSubmission } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { Show } from "solid-js";
//#region src/routes/families/[id]/children/new.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<wa-button",
	" href=\"",
	"\" appearance=\"plain\" size=\"small\">← Back to Family</wa-button>"
];
var _tmpl$2 = [
	"<wa-callout",
	" variant=\"danger\">",
	"</wa-callout>"
];
var _tmpl$3 = [
	"<wa-card",
	"><form",
	" method=\"post\" class=\"wa-stack wa-gap-l\"><input type=\"hidden\" name=\"familyId\"",
	"><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Basic Information</legend><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"First Name *\" name=\"firstName\" required placeholder=\"Emma\"></wa-input><wa-input label=\"Last Name *\" name=\"lastName\" required placeholder=\"Smith\"></wa-input></div><wa-input label=\"Date of Birth *\" name=\"dateOfBirth\" type=\"date\" required></wa-input><wa-select label=\"Gender\" name=\"gender\"><wa-option value>Select gender...</wa-option><wa-option value=\"MALE\">Male</wa-option><wa-option value=\"FEMALE\">Female</wa-option><wa-option value=\"OTHER\">Other</wa-option><wa-option value=\"PREFER_NOT_TO_SAY\">Prefer not to say</wa-option></wa-select></fieldset><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">School Information</legend><wa-input label=\"School Name\" name=\"schoolName\" placeholder=\"Lincoln Elementary School\"></wa-input><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"Grade\" name=\"schoolGrade\" placeholder=\"3rd Grade\"></wa-input><wa-input label=\"Teacher Name\" name=\"schoolTeacher\" placeholder=\"Ms. Johnson\"></wa-input></div></fieldset><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Medical Information</legend><wa-textarea label=\"Allergies\" name=\"allergies\" rows=\"2\" placeholder=\"Peanuts, tree nuts, dairy, etc.\" hint=\"List any known allergies\"></wa-textarea><wa-textarea label=\"Medications\" name=\"medications\" rows=\"2\" placeholder=\"List any regular medications...\"></wa-textarea><wa-textarea label=\"Special Needs\" name=\"specialNeeds\" rows=\"2\" placeholder=\"Any special needs or accommodations...\"></wa-textarea></fieldset><wa-textarea label=\"Additional Notes\" name=\"notes\" rows=\"4\" placeholder=\"Any additional information about the child...\"></wa-textarea><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button href=\"",
	"\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"success\" appearance=\"filled\"",
	">",
	"</wa-button></div></form></wa-card>"
];
function NewChild() {
	var _v$, _v$2, _v$5, _v$6, _v$3, _v$7, _g$, _v$10, _v$4;
	const params = useParams();
	const submission = useSubmission(createChild);
	return PageContent({ get children() {
		return [
			(_v$ = ssrHydrationKey(), _v$2 = () => {
				return `/families/${escape(params.id, true)}`;
			}, ssr(_tmpl$, _v$, _v$2)),
			PageHeader({ title: "Add Child" }),
			(_v$3 = ssrHydrationKey(), _v$7 = escape(Show({
				get when() {
					return submission.result;
				},
				get children() {
					return _v$5 = ssrHydrationKey(), _v$6 = () => {
						return escape(submission.result.message);
					}, ssr(_tmpl$2, _v$5, _v$6);
				}
			})), _g$ = ssrGroup(() => {
				return [`/families/${escape(params.id, true)}`, ssrAttribute("disabled", escape(submission.pending || void 0, true))];
			}, 2), _v$10 = () => {
				return submission.pending ? "Adding..." : "Add Child";
			}, _v$4 = () => {
				return ssrAttribute("value", escape(params.id, true));
			}, ssr(_tmpl$3, _v$3, ssrAttribute("action", escape(createChild, true)), _v$4, ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), ssrStyleProperty("--min-column-size:", "200px"), ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), ssrStyleProperty("--min-column-size:", "200px"), ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), _v$7, ssrStyleProperty("justify-content:", "flex-end"), _g$, _g$, _v$10))
		];
	} });
}
//#endregion
export { NewChild as default };
