import { w as useParams } from "./action-6MWjotYm.js";
import { Tt as useSubmission, h as updateFamilyMember, p as getFamilyMember } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { Show } from "solid-js";
//#region src/routes/families/[id]/members/[memberId]/edit.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<wa-button",
	" href=\"",
	"\" appearance=\"plain\" size=\"small\">← Back to Family</wa-button>"
];
var _tmpl$2 = ["<p", " class=\"wa-color-text-quiet\">Loading...</p>"];
var _tmpl$3 = [
	"<wa-callout",
	" variant=\"danger\">",
	"</wa-callout>"
];
var _tmpl$4 = [
	"<wa-card",
	"><form",
	" method=\"post\" class=\"wa-stack wa-gap-m\"><input type=\"hidden\" name=\"id\"",
	"><input type=\"hidden\" name=\"familyId\"",
	"><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"First Name *\" name=\"firstName\" required",
	"></wa-input><wa-input label=\"Last Name *\" name=\"lastName\" required",
	"></wa-input></div><wa-select label=\"Relationship *\" name=\"relationship\" required",
	"><wa-option value=\"PARENT\">Parent</wa-option><wa-option value=\"GRANDPARENT\">Grandparent</wa-option><wa-option value=\"AUNT_UNCLE\">Aunt/Uncle</wa-option><wa-option value=\"SIBLING\">Sibling</wa-option><wa-option value=\"BABYSITTER\">Babysitter</wa-option><wa-option value=\"NANNY\">Nanny</wa-option><wa-option value=\"OTHER\">Other</wa-option></wa-select><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"Email\" name=\"email\" type=\"email\"",
	"></wa-input><wa-input label=\"Phone\" name=\"phone\" type=\"tel\"",
	"></wa-input></div><wa-textarea label=\"Allergies\" name=\"allergies\" rows=\"2\"",
	"></wa-textarea><wa-checkbox name=\"canPickup\" value=\"true\"",
	">Authorized to pick up children</wa-checkbox><wa-textarea label=\"Notes\" name=\"notes\" rows=\"4\"",
	"></wa-textarea><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button href=\"",
	"\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"brand\" appearance=\"filled\"",
	">",
	"</wa-button></div></form></wa-card>"
];
function EditFamilyMember() {
	var _v$, _v$2;
	const params = useParams();
	const member = createMemo(() => getFamilyMember(params.memberId));
	const submission = useSubmission(updateFamilyMember);
	return PageContent({ get children() {
		return [
			(_v$ = ssrHydrationKey(), _v$2 = () => {
				return `/families/${escape(params.id, true)}`;
			}, ssr(_tmpl$, _v$, _v$2)),
			PageHeader({ title: "Edit Family Member" }),
			Show({
				get when() {
					return member();
				},
				get fallback() {
					var _v$3 = ssrHydrationKey();
					return ssr(_tmpl$2, _v$3);
				},
				children: (m) => {
					var _v$15, _v$16, _v$4, _g$3, _g$2, _v$17, _g$, _v$20, _v$5, _v$6;
					return _v$4 = ssrHydrationKey(), _g$3 = ssrGroup(() => {
						return [
							ssrAttribute("value", escape(m().firstName, true)),
							ssrAttribute("value", escape(m().lastName, true)),
							ssrAttribute("value", escape(m().relationship, true))
						];
					}, 3), _g$2 = ssrGroup(() => {
						return [
							ssrAttribute("value", escape(m().email || "", true)),
							ssrAttribute("value", escape(m().phone || "", true)),
							ssrAttribute("value", escape(m().allergies || "", true)),
							ssrAttribute("checked", escape(m().canPickup || void 0, true)),
							ssrAttribute("value", escape(m().notes || "", true))
						];
					}, 5), _v$17 = escape(Show({
						get when() {
							return submission.result instanceof Error;
						},
						get children() {
							return _v$15 = ssrHydrationKey(), _v$16 = () => {
								return escape(submission.result.message);
							}, ssr(_tmpl$3, _v$15, _v$16);
						}
					})), _g$ = ssrGroup(() => {
						return [`/families/${escape(params.id, true)}`, ssrAttribute("disabled", escape(submission.pending || void 0, true))];
					}, 2), _v$20 = () => {
						return submission.pending ? "Saving..." : "Save Changes";
					}, _v$5 = () => {
						return ssrAttribute("value", escape(m().id, true));
					}, _v$6 = () => {
						return ssrAttribute("value", escape(params.id, true));
					}, ssr(_tmpl$4, _v$4, ssrAttribute("action", escape(updateFamilyMember, true)), _v$5, _v$6, ssrStyleProperty("--min-column-size:", "200px"), _g$3, _g$3, _g$3, ssrStyleProperty("--min-column-size:", "200px"), _g$2, _g$2, _g$2, _g$2, _g$2, _v$17, ssrStyleProperty("justify-content:", "flex-end"), _g$, _g$, _v$20);
				}
			})
		];
	} });
}
//#endregion
export { EditFamilyMember as default };
