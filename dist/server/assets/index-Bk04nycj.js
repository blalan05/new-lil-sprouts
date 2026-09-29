import { S as getService, Tt as useSubmission, b as createService, w as updateService, x as getAllServices } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { t as formatMoneyDisplay } from "./money-display-DvMwur0H.js";
import { escape, memo, scope, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createEffect, createSignal } from "solid-js";
//#region src/routes/reports/index.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = ["<wa-button", " variant=\"brand\">+ Add Service</wa-button>"];
var _tmpl$2 = [
	"<input",
	" type=\"hidden\" name=\"id\"",
	">"
];
var _tmpl$3 = ["<wa-callout", " variant=\"neutral\">Code cannot be changed after creation</wa-callout>"];
var _tmpl$4 = [
	"<wa-checkbox",
	" name=\"isActive\" value=\"true\"",
	">Active</wa-checkbox>"
];
var _tmpl$5 = [
	"<wa-card",
	"><div class=\"wa-stack wa-gap-l\"><h2 class=\"wa-heading-m\">",
	"</h2><form",
	" method=\"post\" class=\"wa-stack wa-gap-m\"><!--$-->",
	"<!--/--><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"Service Name *\" id=\"name\" name=\"name\" type=\"text\" required placeholder=\"e.g., Childcare, Piano Lesson\"",
	"></wa-input><div class=\"wa-stack wa-gap-xs\"><wa-input",
	" id=\"code\" name=\"code\" type=\"text\" required",
	" placeholder=\"CHILDCARE\"",
	"></wa-input><!--$-->",
	"<!--/--></div></div><wa-textarea label=\"Description\" id=\"description\" name=\"description\" rows=\"2\" placeholder=\"Brief description of the service...\"",
	"></wa-textarea><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"Default Hourly Rate ($)\" id=\"defaultHourlyRate\" name=\"defaultHourlyRate\" type=\"number\" step=\"0.01\" min=\"0\" placeholder=\"0.00\"",
	"></wa-input><wa-select label=\"Pricing Type *\" id=\"pricingType\" name=\"pricingType\" required",
	"><wa-option value=\"FLAT\">Flat Rate</wa-option><wa-option value=\"PER_CHILD\">Per Child</wa-option></wa-select><div class=\"wa-stack wa-gap-s\"><span class=\"wa-body-s wa-color-text-normal\" style=\"",
	"\">Options</span><wa-checkbox name=\"requiresChildren\" value=\"true\"",
	">Requires Children</wa-checkbox><!--$-->",
	"<!--/--></div></div><div class=\"wa-cluster wa-gap-s\"><wa-button type=\"submit\" variant=\"brand\"",
	">",
	"</wa-button><wa-button type=\"button\" appearance=\"outlined\">Cancel</wa-button></div></form></div></wa-card>"
];
var _tmpl$6 = [
	"<wa-card",
	"><div class=\"wa-stack wa-gap-m\">",
	"</div></wa-card>"
];
var _tmpl$7 = [
	"<wa-tab-group",
	"><wa-tab slot=\"nav\" panel=\"reports\" active>Reports</wa-tab><wa-tab slot=\"nav\" panel=\"services\">Services</wa-tab><wa-tab-panel name=\"reports\"><div class=\"wa-grid wa-gap-l\" style=\"",
	"\"><wa-card><div class=\"wa-stack wa-gap-m\"><div style=\"",
	"\">📄</div><h2 class=\"wa-heading-m\">Year-End Receipt Report</h2><p class=\"wa-body-s wa-color-text-quiet\">Generate detailed year-end reports for families including dates, children, hours worked, and money paid. Exportable to PDF.</p><a href=\"/reports/year-end\"><wa-button variant=\"brand\">View Report</wa-button></a></div></wa-card><wa-card><div class=\"wa-stack wa-gap-m\"><div style=\"",
	"\">📅</div><h2 class=\"wa-heading-m\">Calendar View Report</h2><p class=\"wa-body-s wa-color-text-quiet\">View all care sessions in a calendar format for any month. Perfect for printing to show how busy you were.</p><a href=\"/reports/calendar\"><wa-button variant=\"brand\">View Report</wa-button></a></div></wa-card><wa-card><div class=\"wa-stack wa-gap-m\"><div style=\"",
	"\">💰</div><h2 class=\"wa-heading-m\">Income Report (Gross & Net)</h2><p class=\"wa-body-s wa-color-text-quiet\">View gross income, expenses, and net income for your business. Breakdown by family and month. Exportable to PDF and CSV.</p><a href=\"/reports/income\"><wa-button variant=\"brand\">View Report</wa-button></a></div></wa-card></div></wa-tab-panel><wa-tab-panel name=\"services\"><div class=\"wa-stack wa-gap-l\"><header class=\"wa-flank wa-gap-m\"><div class=\"wa-stack wa-gap-xs\"><h2 class=\"wa-heading-l\">Services</h2><p class=\"wa-body-m wa-color-text-quiet\">Manage your service types and pricing</p></div><!--$-->",
	"<!--/--></header><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div></wa-tab-panel></wa-tab-group>"
];
var _tmpl$8 = [
	"<p",
	" class=\"wa-body-m wa-color-text-quiet\" style=\"",
	"\">Loading services...</p>"
];
var _tmpl$9 = [
	"<wa-card",
	"><div class=\"wa-stack wa-gap-m\" style=\"",
	"\"><p class=\"wa-body-m wa-color-text-quiet\">No services yet.</p><wa-button variant=\"brand\">Create Your First Service</wa-button></div></wa-card>"
];
var _tmpl$10 = ["<wa-tag", " variant=\"warning\" appearance=\"filled-outlined\">Per Child</wa-tag>"];
var _tmpl$11 = [
	"<p",
	" class=\"wa-body-s wa-color-text-quiet\">",
	"</p>"
];
var _tmpl$12 = [
	"<span",
	" class=\"wa-body-s wa-color-text-quiet\"><strong class=\"wa-color-text-normal\">Rate:</strong> <!--$-->",
	"<!--/-->/hr<!--$-->",
	"<!--/--></span>"
];
var _tmpl$13 = ["<span", " class=\"wa-body-s wa-color-text-quiet\"><strong class=\"wa-color-text-normal\">Requires:</strong> Children</span>"];
var _tmpl$14 = [
	"<wa-card",
	"><div class=\"wa-flank wa-gap-m\"><div class=\"wa-stack wa-gap-s\" style=\"",
	"\"><div class=\"wa-cluster wa-gap-s\"><h3 class=\"wa-heading-s\">",
	"</h3><wa-tag variant=\"brand\" appearance=\"filled-outlined\">",
	"</wa-tag><!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-l\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div></div><wa-button appearance=\"outlined\">Edit</wa-button></div></wa-card>"
];
function Reports() {
	var _v$2, _v$7, _v$8, _v$14, _v$20, _v$21, _v$4, _v$5, _v$6, _v$9, _g$2, _v$15, _v$16, _g$, _v$19, _v$22, _v$23, _v$24, _v$26, _v$27, _v$, _v$3, _v$25, _v$28;
	const allServices = createMemo(() => getAllServices());
	const createSubmission = useSubmission(createService);
	const updateSubmission = useSubmission(updateService);
	const [showCreateForm, setShowCreateForm] = createSignal(false);
	const [editingServiceId, setEditingServiceId] = createSignal(null);
	const editingService = createMemo(() => {
		const id = editingServiceId();
		return id ? getService(id) : null;
	});
	createEffect(() => {
		if (createSubmission.result && !(createSubmission.result instanceof Error) || updateSubmission.result && !(updateSubmission.result instanceof Error)) {
			setShowCreateForm(false);
			setEditingServiceId(null);
			window.location.reload();
		}
	});
	return PageContent({ get children() {
		return [PageHeader({
			title: "Reports",
			description: "Manage services and generate reports for your business."
		}), (_v$ = ssrHydrationKey(), _v$3 = escape(Show({
			get when() {
				return memo(() => {
					return !showCreateForm();
				})() && editingServiceId() === null;
			},
			get children() {
				return _v$2 = ssrHydrationKey(), ssr(_tmpl$, _v$2);
			}
		})), _v$25 = escape(Show({
			get when() {
				return showCreateForm() || editingServiceId() !== null;
			},
			get children() {
				return _v$4 = ssrHydrationKey(), _v$5 = () => {
					return editingServiceId() ? "Edit Service" : "Create New Service";
				}, _v$6 = () => {
					return ssrAttribute("action", editingServiceId() ? escape(updateService, true) : escape(createService, true));
				}, _v$9 = escape(Show({
					get when() {
						return editingServiceId();
					},
					get children() {
						return _v$7 = ssrHydrationKey(), _v$8 = () => {
							return ssrAttribute("value", escape(editingServiceId(), true));
						}, ssr(_tmpl$2, _v$7, _v$8);
					}
				})), _g$2 = ssrGroup(() => {
					return [
						ssrAttribute("value", escape(editingService()?.name || "", true)),
						ssrAttribute("label", editingServiceId() ? "Code *" : "Code * (e.g., CHILDCARE)"),
						ssrAttribute("disabled", escape(!!editingServiceId() || void 0, true)),
						ssrAttribute("value", escape(editingService()?.code || "", true))
					];
				}, 4), _v$15 = escape(Show({
					get when() {
						return editingServiceId();
					},
					get children() {
						return _v$14 = ssrHydrationKey(), ssr(_tmpl$3, _v$14);
					}
				})), _v$16 = () => {
					return ssrAttribute("value", escape(editingService()?.description || "", true));
				}, _g$ = ssrGroup(() => {
					return [ssrAttribute("value", escape(editingService()?.defaultHourlyRate?.toString() || "", true)), ssrAttribute("value", escape(editingService()?.pricingType || "FLAT", true))];
				}, 2), _v$19 = () => {
					return ssrAttribute("checked", escape(editingService()?.requiresChildren || void 0, true));
				}, _v$22 = escape(Show({
					get when() {
						return editingServiceId();
					},
					get children() {
						return _v$20 = ssrHydrationKey(), _v$21 = () => {
							return ssrAttribute("checked", escape(editingService()?.isActive !== false || void 0, true));
						}, ssr(_tmpl$4, _v$20, _v$21);
					}
				})), _v$23 = () => {
					return ssrAttribute("disabled", escape(createSubmission.pending || updateSubmission.pending || void 0, true));
				}, _v$24 = (() => {
					var _c$ = memo(() => {
						return !!(createSubmission.pending || updateSubmission.pending);
					});
					return () => {
						return _c$() ? "Saving..." : editingServiceId() ? "Update Service" : "Create Service";
					};
				})(), ssr(_tmpl$5, _v$4, _v$5, _v$6, _v$9, ssrStyleProperty("--min-column-size:", "16rem"), _g$2, _g$2, _g$2, _g$2, _v$15, _v$16, ssrStyleProperty("--min-column-size:", "14rem"), _g$, _g$, ssrStyleProperty("font-weight:", "600"), _v$19, _v$22, _v$23, _v$24);
			}
		})), _v$28 = escape(Show({
			get when() {
				return allServices();
			},
			get fallback() {
				var _v$29 = ssrHydrationKey();
				return ssr(_tmpl$8, _v$29, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "3rem"));
			},
			get children() {
				return Show({
					get when() {
						return allServices()?.length;
					},
					get fallback() {
						var _v$30 = ssrHydrationKey();
						return ssr(_tmpl$9, _v$30, ssrStyleProperty("text-align:", "center"));
					},
					get children() {
						return _v$26 = ssrHydrationKey(), _v$27 = escape(For({
							get each() {
								return allServices();
							},
							children: (service) => {
								var _v$34, _v$36, _v$37, _v$39, _v$40, _v$41, _v$43, _v$31, _v$32, _v$33, _v$35, _v$38, _v$42, _v$44;
								return _v$31 = ssrHydrationKey(), _v$32 = () => {
									return escape(service.name);
								}, _v$33 = () => {
									return escape(service.code);
								}, _v$35 = escape(Show({
									get when() {
										return service.pricingType === "PER_CHILD";
									},
									get children() {
										return _v$34 = ssrHydrationKey(), ssr(_tmpl$10, _v$34);
									}
								})), _v$38 = escape(Show({
									get when() {
										return service.description;
									},
									get children() {
										return _v$36 = ssrHydrationKey(), _v$37 = () => {
											return escape(service.description);
										}, ssr(_tmpl$11, _v$36, _v$37);
									}
								})), _v$42 = escape(Show({
									get when() {
										return service.defaultHourlyRate;
									},
									get children() {
										return _v$39 = ssrHydrationKey(), _v$40 = scope(() => {
											return escape(formatMoneyDisplay(service.defaultHourlyRate));
										}), _v$41 = () => {
											return service.pricingType === "PER_CHILD" && " per child";
										}, ssr(_tmpl$12, _v$39, _v$40, _v$41);
									}
								})), _v$44 = escape(Show({
									get when() {
										return service.requiresChildren;
									},
									get children() {
										return _v$43 = ssrHydrationKey(), ssr(_tmpl$13, _v$43);
									}
								})), ssr(_tmpl$14, _v$31, ssrStyleProperty("flex:", "1"), _v$32, _v$33, _v$35, _v$38, _v$42, _v$44);
							}
						})), ssr(_tmpl$6, _v$26, _v$27);
					}
				});
			}
		})), ssr(_tmpl$7, _v$, ssrStyleProperty("--min-column-size:", "18rem"), ssrStyleProperty("font-size:", "2rem"), ssrStyleProperty("font-size:", "2rem"), ssrStyleProperty("font-size:", "2rem"), _v$3, _v$25, _v$28))];
	} });
}
//#endregion
export { Reports as default };
