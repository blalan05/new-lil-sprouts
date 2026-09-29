import { w as useParams } from "./action-6MWjotYm.js";
import { Tt as useSubmission, f as createFamilyMember } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { Show } from "solid-js";
//#region src/routes/families/[id]/members/new.tsx?pick=default&pick=$css&lang.tsx
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
	" method=\"post\" class=\"wa-stack wa-gap-m\"><input type=\"hidden\" name=\"familyId\"",
	"><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"First Name *\" name=\"firstName\" required placeholder=\"Jane\"></wa-input><wa-input label=\"Last Name *\" name=\"lastName\" required placeholder=\"Doe\"></wa-input></div><wa-select label=\"Relationship *\" name=\"relationship\" required><wa-option value>Select relationship...</wa-option><wa-option value=\"PARENT\">Parent</wa-option><wa-option value=\"GRANDPARENT\">Grandparent</wa-option><wa-option value=\"AUNT_UNCLE\">Aunt/Uncle</wa-option><wa-option value=\"SIBLING\">Sibling</wa-option><wa-option value=\"BABYSITTER\">Babysitter</wa-option><wa-option value=\"NANNY\">Nanny</wa-option><wa-option value=\"OTHER\">Other</wa-option></wa-select><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"Email\" name=\"email\" type=\"email\" placeholder=\"jane.doe@example.com\" hint=\"Required if you want to invite them to the app\"></wa-input><wa-input label=\"Phone\" name=\"phone\" type=\"tel\" placeholder=\"(555) 123-4567\"></wa-input></div><wa-textarea label=\"Allergies\" name=\"allergies\" rows=\"2\" placeholder=\"Any known allergies...\" hint=\"Important for caregivers to know about any allergies\"></wa-textarea><wa-checkbox name=\"canPickup\" value=\"true\">Authorized to pick up children</wa-checkbox><p class=\"wa-body-s wa-color-text-quiet\">Check this box if this person is allowed to pick up children from care sessions</p><wa-textarea label=\"Notes\" name=\"notes\" rows=\"4\" placeholder=\"Any additional information about this family member...\"></wa-textarea><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button href=\"",
	"\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"brand\" appearance=\"filled\"",
	">",
	"</wa-button></div></form></wa-card>"
];
function NewFamilyMember() {
	var _v$, _v$2, _v$5, _v$6, _v$3, _v$7, _g$, _v$10, _v$4;
	const params = useParams();
	const submission = useSubmission(createFamilyMember);
	return PageContent({ get children() {
		return [
			(_v$ = ssrHydrationKey(), _v$2 = () => {
				return `/families/${escape(params.id, true)}`;
			}, ssr(_tmpl$, _v$, _v$2)),
			PageHeader({ title: "Add Family Member" }),
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
				return submission.pending ? "Adding..." : "Add Family Member";
			}, _v$4 = () => {
				return ssrAttribute("value", escape(params.id, true));
			}, ssr(_tmpl$3, _v$3, ssrAttribute("action", escape(createFamilyMember, true)), _v$4, ssrStyleProperty("--min-column-size:", "200px"), ssrStyleProperty("--min-column-size:", "200px"), _v$7, ssrStyleProperty("justify-content:", "flex-end"), _g$, _g$, _v$10))
		];
	} });
}
//#endregion
export { NewFamilyMember as default };
