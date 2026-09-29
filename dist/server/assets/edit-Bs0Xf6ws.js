import { w as useParams } from "./action-6MWjotYm.js";
import { $ as updateFamily, C as getServices, Q as getFamily, Tt as useSubmission } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, memo, scope, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show } from "solid-js";
//#region src/routes/families/[id]/edit.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<wa-button",
	" href=\"",
	"\" appearance=\"plain\" size=\"small\">← Back to Family Details</wa-button>"
];
var _tmpl$2 = [
	"<div",
	" style=\"",
	"\">",
	"</div>"
];
var _tmpl$3 = [
	"<wa-callout",
	" variant=\"danger\">",
	"</wa-callout>"
];
var _tmpl$4 = [
	"<wa-card",
	"><form",
	" method=\"post\" class=\"wa-stack wa-gap-l\"><input type=\"hidden\" name=\"id\"",
	"><wa-input label=\"Family Name *\" id=\"familyName\" name=\"familyName\" required",
	" placeholder=\"Smith Family\"></wa-input><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Parent/Guardian Information</legend><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"First Name *\" id=\"parentFirstName\" name=\"parentFirstName\" required",
	" placeholder=\"John\"></wa-input><wa-input label=\"Last Name *\" id=\"parentLastName\" name=\"parentLastName\" required",
	" placeholder=\"Smith\"></wa-input></div><wa-input label=\"Email *\" id=\"email\" name=\"email\" type=\"email\" required",
	" placeholder=\"john.smith@example.com\"></wa-input><wa-input label=\"Phone\" id=\"phone\" name=\"phone\" type=\"tel\"",
	" placeholder=\"(555) 123-4567\"></wa-input></fieldset><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Address Information</legend><wa-input label=\"Street Address\" id=\"address\" name=\"address\"",
	" placeholder=\"123 Main St\"></wa-input><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"City\" id=\"city\" name=\"city\"",
	" placeholder=\"City\"></wa-input><wa-input label=\"State\" id=\"state\" name=\"state\"",
	" placeholder=\"State\"></wa-input><wa-input label=\"ZIP Code\" id=\"zipCode\" name=\"zipCode\"",
	" placeholder=\"12345\"></wa-input></div></fieldset><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Emergency Contact</legend><wa-input label=\"Emergency Contact Name\" id=\"emergencyContact\" name=\"emergencyContact\"",
	" placeholder=\"Jane Doe\"></wa-input><wa-input label=\"Emergency Phone\" id=\"emergencyPhone\" name=\"emergencyPhone\" type=\"tel\"",
	" placeholder=\"(555) 123-4567\"></wa-input></fieldset><fieldset style=\"",
	"\"><legend style=\"",
	"\">Services</legend><p style=\"",
	"\">Select which services this family uses. This will default when creating new schedules.</p><!--$-->",
	"<!--/--></fieldset><wa-textarea label=\"Notes\" id=\"notes\" name=\"notes\" rows=\"4\"",
	" placeholder=\"Any additional information about the family...\"></wa-textarea><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button href=\"",
	"\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"brand\" appearance=\"filled\"",
	">",
	"</wa-button></div></form></wa-card>"
];
var _tmpl$5 = [
	"<div",
	" style=\"",
	"\">Loading services...</div>"
];
var _tmpl$6 = [
	"<label",
	" style=\"",
	"\"><input type=\"checkbox\" name=\"serviceIds\"",
	"",
	" style=\"",
	"\"><div style=\"",
	"\"><span style=\"",
	"\">",
	"</span><!--$-->",
	"<!--/--></div></label>"
];
var _tmpl$7 = [
	"<span",
	" style=\"",
	"\">($<!--$-->",
	"<!--/-->/hr<!--$-->",
	"<!--/-->)</span>"
];
function EditFamily() {
	var _v$, _v$2;
	const params = useParams();
	const family = createMemo(() => getFamily(params.id));
	const services = createMemo(() => getServices());
	const submission = useSubmission(updateFamily);
	return PageContent({ get children() {
		return [
			(_v$ = ssrHydrationKey(), _v$2 = () => {
				return `/families/${escape(params.id, true)}`;
			}, ssr(_tmpl$, _v$, _v$2)),
			PageHeader({ title: "Edit Family" }),
			Show({
				get when() {
					return family();
				},
				children: (familyData) => {
					var _v$16, _v$17, _v$20, _v$21, _v$3, _v$5, _g$4, _v$10, _g$3, _g$2, _v$18, _v$19, _v$22, _g$, _v$25, _v$4;
					return _v$3 = ssrHydrationKey(), _v$5 = () => {
						return ssrAttribute("value", escape(familyData().familyName, true));
					}, _g$4 = ssrGroup(() => {
						return [
							ssrAttribute("value", escape(familyData().parentFirstName, true)),
							ssrAttribute("value", escape(familyData().parentLastName, true)),
							ssrAttribute("value", escape(familyData().email, true)),
							ssrAttribute("value", escape(familyData().phone || "", true))
						];
					}, 4), _v$10 = () => {
						return ssrAttribute("value", escape(familyData().address || "", true));
					}, _g$3 = ssrGroup(() => {
						return [
							ssrAttribute("value", escape(familyData().city || "", true)),
							ssrAttribute("value", escape(familyData().state || "", true)),
							ssrAttribute("value", escape(familyData().zipCode || "", true))
						];
					}, 3), _g$2 = ssrGroup(() => {
						return [ssrAttribute("value", escape(familyData().emergencyContact || "", true)), ssrAttribute("value", escape(familyData().emergencyPhone || "", true))];
					}, 2), _v$18 = escape(Show({
						get when() {
							return services();
						},
						get fallback() {
							var _v$26 = ssrHydrationKey();
							return ssr(_tmpl$5, _v$26, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
						},
						get children() {
							return _v$16 = ssrHydrationKey(), _v$17 = escape(For({
								get each() {
									return services();
								},
								children: (service) => {
									const isAssigned = familyData().services?.some((fs) => fs.service.id === service.id);
									var _v$27 = ssrHydrationKey(), _v$29 = () => {
										return escape(service.name);
									}, _v$30 = scope((() => {
										var _c$ = memo(() => {
											return !!service.defaultHourlyRate;
										});
										return () => {
											var _v$31, _v$32, _v$33;
											return _c$() ? (_v$31 = ssrHydrationKey(), _v$32 = () => {
												return escape(service.defaultHourlyRate);
											}, _v$33 = () => {
												return service.pricingType === "PER_CHILD" ? " per child" : "";
											}, ssr(_tmpl$7, _v$31, ssrStyleProperty("margin-left:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$32, _v$33)) : escape(service.defaultHourlyRate);
										};
									})()), _v$28 = () => {
										return ssrAttribute("value", escape(service.id, true));
									};
									return ssr(_tmpl$6, _v$27, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";transition:", "background-color 0.2s"), _v$28, ssrAttribute("checked", escape(isAssigned, true)), ssrStyleProperty("width:", "1.25rem") + ssrStyleProperty(";height:", "1.25rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("flex:", "1"), ssrStyleProperty("font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _v$29, _v$30);
								}
							})), ssr(_tmpl$2, _v$16, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.75rem"), _v$17);
						}
					})), _v$19 = () => {
						return ssrAttribute("value", escape(familyData().notes || "", true));
					}, _v$22 = escape(Show({
						get when() {
							return submission.result;
						},
						get children() {
							return _v$20 = ssrHydrationKey(), _v$21 = () => {
								return escape(submission.result.message);
							}, ssr(_tmpl$3, _v$20, _v$21);
						}
					})), _g$ = ssrGroup(() => {
						return [`/families/${escape(params.id, true)}`, ssrAttribute("disabled", escape(submission.pending || void 0, true))];
					}, 2), _v$25 = () => {
						return submission.pending ? "Saving..." : "Save Changes";
					}, _v$4 = () => {
						return ssrAttribute("value", escape(familyData().id, true));
					}, ssr(_tmpl$4, _v$3, ssrAttribute("action", escape(updateFamily, true)), _v$4, _v$5, ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), ssrStyleProperty("--min-column-size:", "200px"), _g$4, _g$4, _g$4, _g$4, ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), _v$10, ssrStyleProperty("--min-column-size:", "140px"), _g$3, _g$3, _g$3, ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), _g$2, _g$2, ssrStyleProperty("border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";margin-bottom:", "1.5rem"), ssrStyleProperty("padding:", "0 0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("margin-bottom:", "1rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$18, _v$19, _v$22, ssrStyleProperty("justify-content:", "flex-end"), _g$, _g$, _v$25);
				}
			})
		];
	} });
}
//#endregion
export { EditFamily as default };
