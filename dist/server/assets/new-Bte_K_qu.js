import { w as useParams } from "./action-6MWjotYm.js";
import { C as getServices, Q as getFamily, Tt as useSubmission, a as createCareSchedule } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, memo, scope, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createEffect, createSignal } from "solid-js";
//#region src/routes/families/[id]/schedules/new.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<wa-button",
	" href=\"",
	"\" appearance=\"plain\" size=\"small\">← Back to Family</wa-button>"
];
var _tmpl$2 = [
	"<select",
	" id=\"serviceId\" name=\"serviceId\" required",
	" style=\"",
	"\">",
	"</select>"
];
var _tmpl$3 = [
	"<p",
	" style=\"",
	"\">No services assigned to this family. <a href=\"",
	"\">Assign services</a> to default this selection.</p>"
];
var _tmpl$4 = [
	"<div",
	" style=\"",
	"\"><label for=\"name\" style=\"",
	"\">Schedule Name *</label><input id=\"name\" name=\"name\" type=\"text\"",
	" placeholder=\"e.g., Regular Weekday Care\" style=\"",
	"\"></div>"
];
var _tmpl$5 = [
	"<div",
	"><label style=\"",
	"\">Days of Week *</label><div style=\"",
	"\"><label style=\"",
	"\"><input type=\"checkbox\" name=\"day_MONDAY\" value=\"true\" checked style=\"",
	"\"><span style=\"",
	"\">Monday</span></label><label style=\"",
	"\"><input type=\"checkbox\" name=\"day_TUESDAY\" value=\"true\" style=\"",
	"\"><span style=\"",
	"\">Tuesday</span></label><label style=\"",
	"\"><input type=\"checkbox\" name=\"day_WEDNESDAY\" value=\"true\" checked style=\"",
	"\"><span style=\"",
	"\">Wednesday</span></label><label style=\"",
	"\"><input type=\"checkbox\" name=\"day_THURSDAY\" value=\"true\" style=\"",
	"\"><span style=\"",
	"\">Thursday</span></label><label style=\"",
	"\"><input type=\"checkbox\" name=\"day_FRIDAY\" value=\"true\" checked style=\"",
	"\"><span style=\"",
	"\">Friday</span></label><label style=\"",
	"\"><input type=\"checkbox\" name=\"day_SATURDAY\" value=\"true\" style=\"",
	"\"><span style=\"",
	"\">Saturday</span></label><label style=\"",
	"\"><input type=\"checkbox\" name=\"day_SUNDAY\" value=\"true\" style=\"",
	"\"><span style=\"",
	"\">Sunday</span></label></div><p style=\"",
	"\">Default is Mon/Wed/Fri - adjust as needed</p></div>"
];
var _tmpl$6 = [
	"<div",
	" style=\"",
	"\"><label for=\"startDate\" style=\"",
	"\">Date *</label><input id=\"startDate\" name=\"startDate\" type=\"date\" required",
	" style=\"",
	"\"></div>"
];
var _tmpl$7 = [
	"<div",
	" style=\"",
	"\"><div><label for=\"startTime\" style=\"",
	"\">Start Time *</label><input id=\"startTime\" name=\"startTime\" type=\"time\" required value=\"06:00\" style=\"",
	"\"></div><div><label for=\"endTime\" style=\"",
	"\">End Time *</label><input id=\"endTime\" name=\"endTime\" type=\"time\" required value=\"14:30\" style=\"",
	"\"></div></div>"
];
var _tmpl$8 = [
	"<p",
	" style=\"",
	"\">Default is 6:00 AM - 2:30 PM</p>"
];
var _tmpl$9 = [
	"<fieldset",
	" style=\"",
	"\"><legend style=\"",
	"\">Schedule Duration</legend><div style=\"",
	"\"><div><label for=\"recurringStartDate\" style=\"",
	"\">Start Date *</label><input id=\"recurringStartDate\" name=\"startDate\" type=\"date\" required",
	" style=\"",
	"\"></div><div><label for=\"endDate\" style=\"",
	"\">End Date (Optional)</label><input id=\"endDate\" name=\"endDate\" type=\"date\" style=\"",
	"\"></div></div><p style=\"",
	"\">Leave end date empty for ongoing schedules</p></fieldset>"
];
var _tmpl$10 = [
	"<span",
	" style=\"",
	"\">* (at least one required)</span>"
];
var _tmpl$11 = [
	"<input",
	" type=\"hidden\" name=\"childIds\" value required data-validate-children=\"true\" style=\"",
	"\">"
];
var _tmpl$12 = [
	"<div",
	" style=\"",
	"\">",
	"</div>"
];
var _tmpl$13 = [
	"<p",
	" style=\"",
	"\">Select which children will attend <!--$-->",
	"<!--/--></p>"
];
var _tmpl$14 = [
	"<div",
	" style=\"",
	"\"><p style=\"",
	"\"><strong>📅 Note:</strong> After creating this schedule, you'll be able to generate session instances for specific date ranges. Sessions will need to be confirmed by the family before they're finalized.</p></div>"
];
var _tmpl$15 = [
	"<wa-callout",
	" variant=\"danger\">",
	"</wa-callout>"
];
var _tmpl$16 = [
	"<wa-card",
	"><form",
	" method=\"post\" class=\"wa-stack wa-gap-l\"><input type=\"hidden\" name=\"familyId\"",
	"><input type=\"hidden\" name=\"serviceId\"",
	"><input type=\"hidden\" name=\"timezoneOffset\"",
	"><fieldset style=\"",
	"\"><legend style=\"",
	"\">Schedule Type</legend><div style=\"",
	"\"><label for=\"serviceId\" style=\"",
	"\">Service *</label><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><label for=\"recurrence\" style=\"",
	"\">How often? *</label><select id=\"recurrence\" name=\"recurrence\" required",
	" style=\"",
	"\"><option value=\"ONCE\">One-time session</option><option value=\"WEEKLY\">Recurring weekly</option><option value=\"BIWEEKLY\">Recurring bi-weekly</option><option value=\"MONTHLY\">Recurring monthly</option></select></div><!--$-->",
	"<!--/--></fieldset><fieldset style=\"",
	"\"><legend style=\"",
	"\">",
	"</legend><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></fieldset><!--$-->",
	"<!--/--><fieldset style=\"",
	"\"><legend style=\"",
	"\">Children<!--$-->",
	"<!--/--></legend><!--$-->",
	"<!--/--></fieldset><div style=\"",
	"\"><label for=\"hourlyRate\" style=\"",
	"\">Hourly Rate</label><div style=\"",
	"\"><span style=\"",
	"\">$</span><input id=\"hourlyRate\" name=\"hourlyRate\" type=\"number\" step=\"0.01\" min=\"0\" placeholder=\"0.00\" style=\"",
	"\"></div><p style=\"",
	"\">Optional: Set an hourly rate for billing</p></div><wa-textarea label=\"Notes\" id=\"notes\" name=\"notes\" rows=\"4\" placeholder=\"Any special instructions or notes...\"></wa-textarea><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button href=\"",
	"\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"brand\" appearance=\"filled\"",
	">",
	"</wa-button></div></form></wa-card>"
];
var _tmpl$17 = [
	"<div",
	" style=\"",
	"\">Loading services...</div>"
];
var _tmpl$18 = ["<option", " value>Select a service...</option>"];
var _tmpl$19 = [
	"<option",
	"",
	"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></option>"
];
var _tmpl$20 = [
	"<div",
	" style=\"",
	"\"><p style=\"",
	"\">No children found. Please add children to the family first.</p><wa-button href=\"",
	"\" variant=\"success\" appearance=\"filled\">Add First Child</wa-button></div>"
];
var _tmpl$21 = [
	"<label",
	" style=\"",
	"\"><input type=\"checkbox\" name=\"childIds\"",
	" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--></div><div style=\"",
	"\">Age: <!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div></div></label>"
];
var _tmpl$22 = [
	"<span",
	" style=\"",
	"\">⚠️ Has allergies</span>"
];
function NewCareSchedule() {
	var _v$, _v$2;
	const params = useParams();
	const family = createMemo(() => getFamily(params.id));
	const services = createMemo(() => getServices());
	const submission = useSubmission(createCareSchedule);
	const [recurrence, setRecurrence] = createSignal("ONCE");
	const defaultServiceId = () => {
		const familyData = family();
		if (familyData?.services && familyData.services.length > 0) return familyData.services[0].service.id;
		const allServices = services();
		if (allServices && allServices.length > 0) return allServices[0].id;
		return "";
	};
	const [serviceId, setServiceId] = createSignal(defaultServiceId());
	createEffect(() => {
		const familyData = family();
		const allServices = services();
		if (familyData && allServices) {
			const defaultId = defaultServiceId();
			if (defaultId) setServiceId(defaultId);
		}
	});
	const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	const isRecurring = () => recurrence() !== "ONCE";
	const selectedService = () => {
		const id = serviceId();
		const allServices = services();
		if (!id || !allServices) return null;
		return allServices.find((s) => s.id === id);
	};
	const requiresChildren = () => selectedService()?.requiresChildren ?? false;
	return PageContent({ get children() {
		return [
			(_v$ = ssrHydrationKey(), _v$2 = () => {
				return `/families/${escape(params.id, true)}`;
			}, ssr(_tmpl$, _v$, _v$2)),
			PageHeader({
				title: "Schedule Care Session",
				get description() {
					return `Create a ${recurrence() === "ONCE" ? "one-time" : "recurring"} care schedule for ${family()?.familyName ?? "this family"}`;
				}
			}),
			Show({
				get when() {
					return family();
				},
				children: (familyData) => {
					var _v$7, _v$9, _v$8, _v$10, _v$11, _v$15, _v$16, _v$17, _v$20, _v$21, _v$23, _v$25, _v$27, _v$29, _v$30, _v$31, _v$32, _v$33, _v$35, _v$37, _v$38, _v$3, _v$12, _v$13, _v$18, _v$19, _v$22, _v$24, _v$26, _v$28, _v$34, _v$36, _v$39, _g$, _v$42, _v$4, _v$5, _v$6, _v$14;
					return _v$3 = ssrHydrationKey(), _v$12 = escape(Show({
						get when() {
							return services();
						},
						get fallback() {
							var _v$43 = ssrHydrationKey();
							return ssr(_tmpl$17, _v$43, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
						},
						get children() {
							return [(_v$7 = ssrHydrationKey(), _v$9 = escape(Show({
								get when() {
									return memo(() => {
										return !!familyData().services;
									})() ? familyData().services.length > 0 : familyData().services;
								},
								get fallback() {
									var _v$44;
									return [(_v$44 = ssrHydrationKey(), ssr(_tmpl$18, _v$44)), For({
										get each() {
											return services();
										},
										children: (service) => {
											var _v$45, _v$47, _v$48, _v$46;
											return _v$45 = ssrHydrationKey(), _v$47 = () => {
												return escape(service.name);
											}, _v$48 = (() => {
												var _c$2 = memo(() => {
													return !!service.defaultHourlyRate;
												});
												return () => {
													return _c$2() ? ` ($${escape(service.defaultHourlyRate)}/hr${service.pricingType === "PER_CHILD" ? " per child" : ""})` : escape(service.defaultHourlyRate);
												};
											})(), _v$46 = () => {
												return ssrAttribute("value", escape(service.id, true));
											}, ssr(_tmpl$19, _v$45, _v$46, _v$47, _v$48);
										}
									})];
								},
								get children() {
									return For({
										get each() {
											return familyData().services;
										},
										children: (fs) => {
											var _v$49, _v$51, _v$52, _v$50;
											return _v$49 = ssrHydrationKey(), _v$51 = () => {
												return escape(fs.service.name);
											}, _v$52 = (() => {
												var _c$3 = memo(() => {
													return !!fs.service.defaultHourlyRate;
												});
												return () => {
													return _c$3() ? ` ($${escape(fs.service.defaultHourlyRate)}/hr${fs.service.pricingType === "PER_CHILD" ? " per child" : ""})` : escape(fs.service.defaultHourlyRate);
												};
											})(), _v$50 = () => {
												return ssrAttribute("value", escape(fs.service.id, true));
											}, ssr(_tmpl$19, _v$49, _v$50, _v$51, _v$52);
										}
									});
								}
							})), _v$8 = () => {
								return ssrAttribute("value", escape(serviceId(), true));
							}, ssr(_tmpl$2, _v$7, _v$8, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), _v$9)), Show({
								get when() {
									return !familyData().services || familyData().services.length === 0;
								},
								get children() {
									return _v$10 = ssrHydrationKey(), _v$11 = () => {
										return `/families/${escape(params.id, true)}/edit`;
									}, ssr(_tmpl$3, _v$10, ssrStyleProperty("margin-top:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$11);
								}
							})];
						}
					})), _v$13 = () => {
						return ssrStyleProperty("margin-bottom:", isRecurring() ? "1rem" : "0");
					}, _v$18 = escape(Show({
						get when() {
							return isRecurring();
						},
						get children() {
							return [(_v$15 = ssrHydrationKey(), _v$16 = () => {
								return ssrAttribute("required", escape(isRecurring(), true));
							}, ssr(_tmpl$4, _v$15, ssrStyleProperty("margin-bottom:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _v$16, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"))), (_v$17 = ssrHydrationKey(), ssr(_tmpl$5, _v$17, ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.75rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(2, 1fr)") + ssrStyleProperty(";gap:", "0.5rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("width:", "1rem") + ssrStyleProperty(";height:", "1rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("width:", "1rem") + ssrStyleProperty(";height:", "1rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("width:", "1rem") + ssrStyleProperty(";height:", "1rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("width:", "1rem") + ssrStyleProperty(";height:", "1rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("width:", "1rem") + ssrStyleProperty(";height:", "1rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("width:", "1rem") + ssrStyleProperty(";height:", "1rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("width:", "1rem") + ssrStyleProperty(";height:", "1rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin-top:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)")))];
						}
					})), _v$19 = () => {
						return recurrence() === "ONCE" ? "Session Date & Time" : "Session Times";
					}, _v$22 = escape(Show({
						get when() {
							return recurrence() === "ONCE";
						},
						get fallback() {
							var _v$53 = ssrHydrationKey();
							return ssr(_tmpl$7, _v$53, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "1fr 1fr") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"));
						},
						get children() {
							return [(_v$20 = ssrHydrationKey(), ssr(_tmpl$6, _v$20, ssrStyleProperty("margin-bottom:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrAttribute("value", escape(today, true)), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"))), (_v$21 = ssrHydrationKey(), ssr(_tmpl$7, _v$21, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "1fr 1fr") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem")))];
						}
					})), _v$24 = escape(Show({
						get when() {
							return isRecurring();
						},
						get children() {
							return _v$23 = ssrHydrationKey(), ssr(_tmpl$8, _v$23, ssrStyleProperty("margin-top:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
						}
					})), _v$26 = escape(Show({
						get when() {
							return isRecurring();
						},
						get children() {
							return _v$25 = ssrHydrationKey(), ssr(_tmpl$9, _v$25, ssrStyleProperty("border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";margin-bottom:", "1.5rem"), ssrStyleProperty("padding:", "0 0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "1fr 1fr") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrAttribute("value", escape(today, true)), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), ssrStyleProperty("margin-top:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
						}
					})), _v$28 = escape(Show({
						get when() {
							return requiresChildren();
						},
						get children() {
							return _v$27 = ssrHydrationKey(), ssr(_tmpl$10, _v$27, ssrStyleProperty("color:", "#e53e3e") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";margin-left:", "0.5rem"));
						}
					})), _v$34 = escape(Show({
						get when() {
							return familyData().children?.length;
						},
						get fallback() {
							var _v$54 = ssrHydrationKey(), _v$55 = () => {
								return `/families/${escape(params.id, true)}/children/new`;
							};
							return ssr(_tmpl$20, _v$54, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "2rem"), ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-bottom:", "1rem"), _v$55);
						},
						get children() {
							return [
								Show({
									get when() {
										return requiresChildren();
									},
									get children() {
										return _v$29 = ssrHydrationKey(), ssr(_tmpl$11, _v$29, ssrStyleProperty("display:", "none"));
									}
								}),
								(_v$30 = ssrHydrationKey(), _v$31 = escape(For({
									get each() {
										return familyData().children;
									},
									children: (child) => {
										var _v$56, _v$58, _v$59, _v$60, _v$61, _v$57;
										return _v$56 = ssrHydrationKey(), _v$58 = () => {
											return escape(child.firstName);
										}, _v$59 = () => {
											return escape(child.lastName);
										}, _v$60 = () => {
											return escape((/* @__PURE__ */ new Date()).getFullYear()) - escape(new Date(child.dateOfBirth).getFullYear());
										}, _v$61 = scope((() => {
											var _c$4 = memo(() => {
												return !!child.allergies;
											});
											return () => {
												var _v$62;
												return _c$4() ? (_v$62 = ssrHydrationKey(), ssr(_tmpl$22, _v$62, ssrStyleProperty("margin-left:", "0.5rem") + ssrStyleProperty(";color:", "#c53030"))) : escape(child.allergies);
											};
										})()), _v$57 = () => {
											return ssrAttribute("value", escape(child.id, true));
										}, ssr(_tmpl$21, _v$56, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.75rem") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), _v$57, ssrStyleProperty("width:", "1.25rem") + ssrStyleProperty(";height:", "1.25rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("flex:", "1"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$58, _v$59, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$60, _v$61);
									}
								})), ssr(_tmpl$12, _v$30, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";gap:", "0.75rem"), _v$31)),
								(_v$32 = ssrHydrationKey(), _v$33 = () => {
									return recurrence() === "ONCE" ? "this session" : "these sessions";
								}, ssr(_tmpl$13, _v$32, ssrStyleProperty("margin-top:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$33))
							];
						}
					})), _v$36 = escape(Show({
						get when() {
							return isRecurring();
						},
						get children() {
							return _v$35 = ssrHydrationKey(), ssr(_tmpl$14, _v$35, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";background-color:", "#ebf8ff") + ssrStyleProperty(";border:", "1px solid var(--wa-color-brand-fill-normal)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";margin-bottom:", "1.5rem"), ssrStyleProperty("margin:", 0) + ssrStyleProperty(";color:", "#2c5282") + ssrStyleProperty(";font-size:", "0.875rem"));
						}
					})), _v$39 = escape(Show({
						get when() {
							return submission.result;
						},
						get children() {
							return _v$37 = ssrHydrationKey(), _v$38 = () => {
								return escape(submission.result.message);
							}, ssr(_tmpl$15, _v$37, _v$38);
						}
					})), _g$ = ssrGroup(() => {
						return [`/families/${escape(params.id, true)}`, ssrAttribute("disabled", escape(submission.pending || !familyData().children?.length || void 0, true))];
					}, 2), _v$42 = (() => {
						var _c$ = memo(() => {
							return !!submission.pending;
						});
						return () => {
							return _c$() ? "Creating..." : recurrence() === "ONCE" ? "Schedule Session" : "Create Schedule";
						};
					})(), _v$4 = () => {
						return ssrAttribute("value", escape(params.id, true));
					}, _v$5 = () => {
						return ssrAttribute("value", escape(serviceId(), true));
					}, _v$6 = () => {
						return ssrAttribute("value", escape((/* @__PURE__ */ new Date()).getTimezoneOffset(), true) * -1);
					}, _v$14 = () => {
						return ssrAttribute("value", escape(recurrence(), true));
					}, ssr(_tmpl$16, _v$3, ssrAttribute("action", escape(createCareSchedule, true)), _v$4, _v$5, _v$6, ssrStyleProperty("border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";margin-bottom:", "1.5rem"), ssrStyleProperty("padding:", "0 0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("margin-bottom:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _v$12, _v$13, ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _v$14, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), _v$18, ssrStyleProperty("border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";margin-bottom:", "1.5rem"), ssrStyleProperty("padding:", "0 0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$19, _v$22, _v$24, _v$26, ssrStyleProperty("border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";margin-bottom:", "1.5rem"), ssrStyleProperty("padding:", "0 0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$28, _v$34, ssrStyleProperty("margin-bottom:", "1.5rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("position:", "relative"), ssrStyleProperty("position:", "absolute") + ssrStyleProperty(";left:", "0.75rem") + ssrStyleProperty(";top:", "50%") + ssrStyleProperty(";transform:", "translateY(-50%)") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "1rem"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem 0.75rem 0.75rem 1.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), ssrStyleProperty("margin-top:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$36, _v$39, ssrStyleProperty("justify-content:", "flex-end"), _g$, _g$, _v$42);
				}
			})
		];
	} });
}
//#endregion
export { NewCareSchedule as default };
