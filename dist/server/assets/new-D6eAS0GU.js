import { C as getServices, Tt as useSubmission, Y as createFamily } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, memo, scope, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createSignal } from "solid-js";
//#region src/routes/families/new.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = ["<wa-button", " href=\"/families\" appearance=\"plain\" size=\"small\">← Back to Families</wa-button>"];
var _tmpl$2 = [
	"<fieldset",
	" style=\"",
	"\"><legend style=\"",
	"\">Spouse/Partner Information</legend><div style=\"",
	"\"><div><label for=\"spouseFirstName\" style=\"",
	"\">First Name</label><input id=\"spouseFirstName\" name=\"spouseFirstName\" type=\"text\" placeholder=\"Jane\" style=\"",
	"\"></div><div><label for=\"spouseLastName\" style=\"",
	"\">Last Name</label><input id=\"spouseLastName\" name=\"spouseLastName\" type=\"text\" placeholder=\"Smith\" style=\"",
	"\"></div></div><div style=\"",
	"\"><div><label for=\"spouseEmail\" style=\"",
	"\">Email</label><input id=\"spouseEmail\" name=\"spouseEmail\" type=\"email\" placeholder=\"jane.smith@example.com\" style=\"",
	"\"></div><div><label for=\"spousePhone\" style=\"",
	"\">Phone</label><input id=\"spousePhone\" name=\"spousePhone\" type=\"tel\" placeholder=\"(555) 123-4567\" style=\"",
	"\"></div></div><p style=\"",
	"\">Spouse/partner will be added as a family member with pickup authorization enabled by default.</p></fieldset>"
];
var _tmpl$3 = [
	"<fieldset",
	" style=\"",
	"\"><legend style=\"",
	"\">Children Information</legend><!--$-->",
	"<!--/--><button type=\"button\" style=\"",
	"\">+ Add Another Child</button><p style=\"",
	"\">You can add more children later or provide additional information (allergies, medications, etc.) after creating the family.</p></fieldset>"
];
var _tmpl$4 = [
	"<div",
	" style=\"",
	"\">",
	"</div>"
];
var _tmpl$5 = [
	"<wa-callout",
	" variant=\"danger\">",
	"</wa-callout>"
];
var _tmpl$6 = [
	"<wa-card",
	"><form",
	" method=\"post\" class=\"wa-stack wa-gap-l\"><wa-input label=\"Family Name *\" id=\"familyName\" name=\"familyName\" required placeholder=\"Smith Family\"></wa-input><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Parent/Guardian Information</legend><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"First Name *\" id=\"parentFirstName\" name=\"parentFirstName\" required placeholder=\"John\"></wa-input><wa-input label=\"Last Name *\" id=\"parentLastName\" name=\"parentLastName\" required placeholder=\"Smith\"></wa-input></div><wa-input label=\"Email *\" id=\"email\" name=\"email\" type=\"email\" required placeholder=\"john.smith@example.com\"></wa-input><wa-input label=\"Phone\" id=\"phone\" name=\"phone\" type=\"tel\" placeholder=\"(555) 123-4567\"></wa-input></fieldset><div style=\"",
	"\"><label style=\"",
	"\"><input type=\"checkbox\"",
	" style=\"",
	"\"><span style=\"",
	"\">Add Spouse/Partner Information</span></label></div><!--$-->",
	"<!--/--><div style=\"",
	"\"><label style=\"",
	"\"><input type=\"checkbox\"",
	" style=\"",
	"\"><span style=\"",
	"\">Add Children Information</span></label></div><!--$-->",
	"<!--/--><fieldset style=\"",
	"\"><legend style=\"",
	"\">Services</legend><p style=\"",
	"\">Select which services this family will use. This will default when creating new schedules.</p><!--$-->",
	"<!--/--></fieldset><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Address Information</legend><wa-input label=\"Street Address\" id=\"address\" name=\"address\" placeholder=\"123 Main St\"></wa-input><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"City\" id=\"city\" name=\"city\" placeholder=\"City\"></wa-input><wa-input label=\"State\" id=\"state\" name=\"state\" placeholder=\"State\"></wa-input><wa-input label=\"ZIP Code\" id=\"zipCode\" name=\"zipCode\" placeholder=\"12345\"></wa-input></div></fieldset><fieldset class=\"wa-stack wa-gap-m\" style=\"",
	"\"><legend class=\"wa-heading-s\">Emergency Contact</legend><wa-input label=\"Emergency Contact Name\" id=\"emergencyContact\" name=\"emergencyContact\" placeholder=\"Jane Doe\"></wa-input><wa-input label=\"Emergency Phone\" id=\"emergencyPhone\" name=\"emergencyPhone\" type=\"tel\" placeholder=\"(555) 123-4567\"></wa-input></fieldset><wa-textarea label=\"Notes\" id=\"notes\" name=\"notes\" rows=\"4\" placeholder=\"Any additional information about the family...\"></wa-textarea><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button href=\"/families\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"success\" appearance=\"filled\"",
	">",
	"</wa-button></div></form></wa-card>"
];
var _tmpl$7 = [
	"<button",
	" type=\"button\" style=\"",
	"\">Remove</button>"
];
var _tmpl$8 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><h3 style=\"",
	"\">Child <!--$-->",
	"<!--/--></h3><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><div><label for=\"",
	"\" style=\"",
	"\">First Name *</label><input id=\"",
	"\" name=\"",
	"\" type=\"text\"",
	" placeholder=\"Emma\"",
	" style=\"",
	"\"></div><div><label for=\"",
	"\" style=\"",
	"\">Last Name *</label><input id=\"",
	"\" name=\"",
	"\" type=\"text\"",
	" placeholder=\"Smith\"",
	" style=\"",
	"\"></div></div><div style=\"",
	"\"><div><label for=\"",
	"\" style=\"",
	"\">Date of Birth *</label><input id=\"",
	"\" name=\"",
	"\" type=\"date\"",
	"",
	" style=\"",
	"\"></div><div><label for=\"",
	"\" style=\"",
	"\">Gender</label><select id=\"",
	"\" name=\"",
	"\"",
	" style=\"",
	"\"><option value>Select gender...</option><option value=\"MALE\">Male</option><option value=\"FEMALE\">Female</option><option value=\"OTHER\">Other</option><option value=\"PREFER_NOT_TO_SAY\">Prefer not to say</option></select></div></div></div>"
];
var _tmpl$9 = [
	"<div",
	" style=\"",
	"\">Loading services...</div>"
];
var _tmpl$10 = [
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
var _tmpl$11 = [
	"<span",
	" style=\"",
	"\">($<!--$-->",
	"<!--/-->/hr<!--$-->",
	"<!--/-->)</span>"
];
function NewFamily() {
	var _v$, _v$4, _v$7, _v$8, _v$10, _v$11, _v$13, _v$14, _v$2, _v$5, _v$9, _v$12, _v$15, _v$16, _v$17, _v$3, _v$6;
	const submission = useSubmission(createFamily);
	const services = createMemo(() => getServices());
	const [includeSpouse, setIncludeSpouse] = createSignal(false);
	const [includeChildren, setIncludeChildren] = createSignal(false);
	const [children, setChildren] = createSignal([{
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		gender: ""
	}]);
	return PageContent({ get children() {
		return [
			(_v$ = ssrHydrationKey(), ssr(_tmpl$, _v$)),
			PageHeader({ title: "Add New Family" }),
			(_v$2 = ssrHydrationKey(), _v$5 = escape(Show({
				get when() {
					return includeSpouse();
				},
				get children() {
					return _v$4 = ssrHydrationKey(), ssr(_tmpl$2, _v$4, ssrStyleProperty("border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";margin-bottom:", "1.5rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("padding:", "0 0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "1fr 1fr") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "1fr 1fr") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), ssrStyleProperty("margin-top:", "0.75rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
				}
			})), _v$9 = escape(Show({
				get when() {
					return includeChildren();
				},
				get children() {
					return _v$7 = ssrHydrationKey(), _v$8 = escape(For({
						get each() {
							return children();
						},
						children: (child, index) => {
							var _v$20, _v$18, _v$19, _v$21, _v$22, _g$4, _v$27, _g$3, _v$32, _g$2, _v$37, _g$, _v$26, _v$31, _v$36, _v$40;
							return _v$18 = ssrHydrationKey(), _v$19 = () => {
								return escape(index()) + 1;
							}, _v$21 = escape(Show({
								get when() {
									return children().length > 1;
								},
								get children() {
									return _v$20 = ssrHydrationKey(), ssr(_tmpl$7, _v$20, ssrStyleProperty("padding:", "0.25rem 0.75rem") + ssrStyleProperty(";background-color:", "var(--wa-color-danger-fill-normal)") + ssrStyleProperty(";color:", "#c53030") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-size:", "0.875rem"));
								}
							})), _v$22 = () => {
								return `childFirstName_${escape(index(), true)}`;
							}, _g$4 = ssrGroup(() => {
								return [
									`childFirstName_${escape(index(), true)}`,
									`childFirstName_${escape(index(), true)}`,
									ssrAttribute("required", escape(includeChildren(), true))
								];
							}, 3), _v$27 = () => {
								return `childLastName_${escape(index(), true)}`;
							}, _g$3 = ssrGroup(() => {
								return [
									`childLastName_${escape(index(), true)}`,
									`childLastName_${escape(index(), true)}`,
									ssrAttribute("required", escape(includeChildren(), true))
								];
							}, 3), _v$32 = () => {
								return `childDateOfBirth_${escape(index(), true)}`;
							}, _g$2 = ssrGroup(() => {
								return [
									`childDateOfBirth_${escape(index(), true)}`,
									`childDateOfBirth_${escape(index(), true)}`,
									ssrAttribute("required", escape(includeChildren(), true))
								];
							}, 3), _v$37 = () => {
								return `childGender_${escape(index(), true)}`;
							}, _g$ = ssrGroup(() => {
								return [`childGender_${escape(index(), true)}`, `childGender_${escape(index(), true)}`];
							}, 2), _v$26 = () => {
								return ssrAttribute("value", escape(child.firstName, true));
							}, _v$31 = () => {
								return ssrAttribute("value", escape(child.lastName, true));
							}, _v$36 = () => {
								return ssrAttribute("value", escape(child.dateOfBirth, true));
							}, _v$40 = () => {
								return ssrAttribute("value", escape(child.gender, true));
							}, ssr(_tmpl$8, _v$18, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";margin-bottom:", "1rem") + ssrStyleProperty(";background-color:", "var(--color-surface)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "0.75rem"), ssrStyleProperty("color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "1rem") + ssrStyleProperty(";margin:", 0), _v$19, _v$21, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "1fr 1fr") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";margin-bottom:", "1rem"), _v$22, ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _g$4, _g$4, _g$4, _v$26, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), _v$27, ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _g$3, _g$3, _g$3, _v$31, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "1fr 1fr") + ssrStyleProperty(";gap:", "1rem"), _v$32, ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _g$2, _g$2, _g$2, _v$36, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), _v$37, ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _g$, _g$, _v$40, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"));
						}
					})), ssr(_tmpl$3, _v$7, ssrStyleProperty("border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";margin-bottom:", "1.5rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("padding:", "0 0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$8, ssrStyleProperty("padding:", "0.75rem 1.5rem") + ssrStyleProperty(";background-color:", "var(--color-hover)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";width:", "100%"), ssrStyleProperty("margin-top:", "0.75rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
				}
			})), _v$12 = escape(Show({
				get when() {
					return services();
				},
				get fallback() {
					var _v$41 = ssrHydrationKey();
					return ssr(_tmpl$9, _v$41, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
				},
				get children() {
					return _v$10 = ssrHydrationKey(), _v$11 = escape(For({
						get each() {
							return services();
						},
						children: (service) => {
							const isDefaultChecked = service.code === "CHILDCARE";
							var _v$42 = ssrHydrationKey(), _v$44 = () => {
								return escape(service.name);
							}, _v$45 = scope((() => {
								var _c$ = memo(() => {
									return !!service.defaultHourlyRate;
								});
								return () => {
									var _v$46, _v$47, _v$48;
									return _c$() ? (_v$46 = ssrHydrationKey(), _v$47 = () => {
										return escape(service.defaultHourlyRate);
									}, _v$48 = () => {
										return service.pricingType === "PER_CHILD" ? " per child" : "";
									}, ssr(_tmpl$11, _v$46, ssrStyleProperty("margin-left:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$47, _v$48)) : escape(service.defaultHourlyRate);
								};
							})()), _v$43 = () => {
								return ssrAttribute("value", escape(service.id, true));
							};
							return ssr(_tmpl$10, _v$42, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";transition:", "background-color 0.2s"), _v$43, ssrAttribute("checked", escape(isDefaultChecked, true)), ssrStyleProperty("width:", "1.25rem") + ssrStyleProperty(";height:", "1.25rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("flex:", "1"), ssrStyleProperty("font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _v$44, _v$45);
						}
					})), ssr(_tmpl$4, _v$10, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.75rem"), _v$11);
				}
			})), _v$15 = escape(Show({
				get when() {
					return submission.result;
				},
				get children() {
					return _v$13 = ssrHydrationKey(), _v$14 = () => {
						return escape(submission.result.message);
					}, ssr(_tmpl$5, _v$13, _v$14);
				}
			})), _v$16 = () => {
				return ssrAttribute("disabled", escape(submission.pending || void 0, true));
			}, _v$17 = () => {
				return submission.pending ? "Creating..." : "Create Family";
			}, _v$3 = () => {
				return ssrAttribute("checked", escape(includeSpouse(), true));
			}, _v$6 = () => {
				return ssrAttribute("checked", escape(includeChildren(), true));
			}, ssr(_tmpl$6, _v$2, ssrAttribute("action", escape(createFamily, true)), ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), ssrStyleProperty("--min-column-size:", "200px"), ssrStyleProperty("margin-bottom:", "1.5rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), _v$3, ssrStyleProperty("width:", "1.25rem") + ssrStyleProperty(";height:", "1.25rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$5, ssrStyleProperty("margin-bottom:", "1.5rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), _v$6, ssrStyleProperty("width:", "1.25rem") + ssrStyleProperty(";height:", "1.25rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$9, ssrStyleProperty("border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";margin-bottom:", "1.5rem"), ssrStyleProperty("padding:", "0 0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("margin-bottom:", "1rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$12, ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), ssrStyleProperty("--min-column-size:", "140px"), ssrStyleProperty("border:", "1px solid var(--wa-color-neutral-90)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)") + ssrStyleProperty(";padding:", "var(--wa-space-m)") + ssrStyleProperty(";margin:", 0), _v$15, ssrStyleProperty("justify-content:", "flex-end"), _v$16, _v$17))
		];
	} });
}
//#endregion
export { NewFamily as default };
