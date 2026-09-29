import { X as formatParentNames, _ as getAllYearEndReports, g as getAllFamiliesForReports, pt as formatTimeLocal, y as getYearEndFamilyReport } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { n as hoursDisplay } from "./money-display-DvMwur0H.js";
import { escape, memo, scope, ssr, ssrAttribute, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createSignal } from "solid-js";
//#region src/routes/reports/year-end.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = ["<wa-button", " href=\"/reports\" appearance=\"plain\" size=\"small\">← Back to Reports</wa-button>"];
var _tmpl$2 = [
	"<div",
	" style=\"",
	"\"><label style=\"",
	"\">Family</label><select",
	" style=\"",
	"\"><option value>Select a family...</option><!--$-->",
	"<!--/--></select></div>"
];
var _tmpl$3 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><label style=\"",
	"\">Year</label><select",
	" style=\"",
	"\">",
	"</select></div><div style=\"",
	"\"><label style=\"",
	"\">View Mode</label><select",
	" style=\"",
	"\"><option value=\"all\">All Families</option><option value=\"single\">Single Family</option></select></div><!--$-->",
	"<!--/--></div></div>"
];
var _tmpl$4 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\">Select a family to view their year-end report</div><div style=\"",
	"\">Choose a family from the dropdown above to generate their report for <!--$-->",
	"<!--/-->.</div></div>"
];
var _tmpl$5 = [
	"<option",
	"",
	">",
	"</option>"
];
var _tmpl$6 = [
	"<option",
	"",
	"><!--$-->",
	"<!--/--> (<!--$-->",
	"<!--/-->)</option>"
];
var _tmpl$7 = [
	"<div",
	" style=\"",
	"\"><h3 style=\"",
	"\">Standalone Expenses (<!--$-->",
	"<!--/-->)</h3><div style=\"",
	"\"><table style=\"",
	"\"><thead><tr style=\"",
	"\"><th style=\"",
	"\">Date</th><th style=\"",
	"\">Description</th><th style=\"",
	"\">Category</th><th style=\"",
	"\">Amount</th></tr></thead><tbody><!--$-->",
	"<!--/--><tr style=\"",
	"\"><td colSpan=\"3\" style=\"",
	"\">Total Standalone Expenses:</td><td style=\"",
	"\">",
	"</td></tr></tbody></table></div></div>"
];
var _tmpl$8 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><h2 style=\"",
	"\"><!--$-->",
	"<!--/--> - <!--$-->",
	"<!--/--> Report</h2><div style=\"",
	"\"><button style=\"",
	"\">📄 Print/PDF</button><button style=\"",
	"\">📊 Export CSV</button></div></div><div style=\"",
	"\"><h3 style=\"",
	"\">Family Information</h3><div style=\"",
	"\"><div><div style=\"",
	"\">Family Name</div><div style=\"",
	"\">",
	"</div></div><div><div style=\"",
	"\">Parent/Guardian</div><div style=\"",
	"\">",
	"</div></div><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div></div><div style=\"",
	"\"><h3 style=\"",
	"\">Children</h3><div style=\"",
	"\">",
	"</div></div><div style=\"",
	"\"><h3 style=\"",
	"\">Sessions (<!--$-->",
	"<!--/-->)</h3><div style=\"",
	"\"><table style=\"",
	"\"><thead><tr style=\"",
	"\"><th style=\"",
	"\">Date</th><th style=\"",
	"\">Service</th><th style=\"",
	"\">Children</th><th style=\"",
	"\">Time</th><th style=\"",
	"\">Hours</th><th style=\"",
	"\">Rate</th><th style=\"",
	"\">Amount</th><th style=\"",
	"\">Total</th></tr></thead><tbody>",
	"</tbody></table></div></div><div style=\"",
	"\"><h3 style=\"",
	"\">Summary</h3><div style=\"",
	"\"><div><div style=\"",
	"\">Total Sessions</div><div style=\"",
	"\">",
	"</div></div><div><div style=\"",
	"\">Total Hours</div><div style=\"",
	"\"><!--$-->",
	"<!--/--> hrs</div></div><div><div style=\"",
	"\">Total Amount</div><div style=\"",
	"\">",
	"</div></div><div><div style=\"",
	"\">Total Paid</div><div style=\"",
	"\">",
	"</div></div><!--$-->",
	"<!--/--></div></div><!--$-->",
	"<!--/--></div>"
];
var _tmpl$9 = [
	"<div",
	"><div style=\"",
	"\">Email</div><div style=\"",
	"\">",
	"</div></div>"
];
var _tmpl$10 = [
	"<div",
	"><div style=\"",
	"\">Phone</div><div style=\"",
	"\">",
	"</div></div>"
];
var _tmpl$11 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--></div><div style=\"",
	"\">Age <!--$-->",
	"<!--/--> as of <!--$-->",
	"<!--/--></div></div>"
];
var _tmpl$12 = [
	"<tr",
	"><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\"><!--$-->",
	"<!--/--> - <!--$-->",
	"<!--/--></td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td></tr>"
];
var _tmpl$13 = [
	"<div",
	"><div style=\"",
	"\">Outstanding</div><div style=\"",
	"\">",
	"</div></div>"
];
var _tmpl$14 = [
	"<tr",
	" style=\"",
	"\"><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\"><span style=\"",
	"\">",
	"</span></td><td style=\"",
	"\">",
	"</td></tr>"
];
var _tmpl$15 = [
	"<div",
	" style=\"",
	"\"><h2 style=\"",
	"\">All Families - <!--$-->",
	"<!--/--> Reports</h2><!--$-->",
	"<!--/--></div>"
];
var _tmpl$16 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><div><h3 style=\"",
	"\">",
	"</h3><div style=\"",
	"\">",
	"</div></div><a href=\"",
	"\" style=\"",
	"\">View Full Report</a></div><div style=\"",
	"\"><div><div style=\"",
	"\">Sessions</div><div style=\"",
	"\">",
	"</div></div><div><div style=\"",
	"\">Hours</div><div style=\"",
	"\">",
	"</div></div><div><div style=\"",
	"\">Total Amount</div><div style=\"",
	"\">",
	"</div></div><div><div style=\"",
	"\">Paid</div><div style=\"",
	"\">",
	"</div></div><!--$-->",
	"<!--/--></div></div>"
];
function YearEndReports() {
	var _v$, _v$6, _v$8, _v$7, _v$2, _v$4, _v$9, _v$3, _v$5, _v$10, _v$11;
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const [selectedYear, setSelectedYear] = createSignal(currentYear);
	const [selectedFamilyId, setSelectedFamilyId] = createSignal("");
	const [viewMode, setViewMode] = createSignal("all");
	const families = createMemo(() => getAllFamiliesForReports());
	const singleReport = createMemo(() => {
		const familyId = selectedFamilyId();
		const year = selectedYear();
		if (familyId && year) return getYearEndFamilyReport(familyId, year);
		return null;
	});
	const allReports = createMemo(() => {
		const year = selectedYear();
		if (viewMode() === "all" && year) return getAllYearEndReports(year);
		return null;
	});
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD"
		}).format(Number(String(amount ?? 0).replace(/[$,\s]/g, "")) || 0);
	};
	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
	};
	const formatTime = (date) => {
		return formatTimeLocal(date);
	};
	return PageContent({ get children() {
		return [
			(_v$ = ssrHydrationKey(), ssr(_tmpl$, _v$)),
			PageHeader({
				title: "Year-End Receipt Report",
				description: "Generate detailed year-end reports for families with session details, hours, and payment information."
			}),
			(_v$2 = ssrHydrationKey(), _v$4 = scope(() => {
				return escape(Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => {
					var _v$12, _v$13;
					return _v$12 = ssrHydrationKey(), _v$13 = escape(year), ssr(_tmpl$5, _v$12, ssrAttribute("value", escape(year, true)), _v$13);
				}));
			}), _v$9 = escape(Show({
				get when() {
					return viewMode() === "single";
				},
				get children() {
					return _v$6 = ssrHydrationKey(), _v$8 = escape(For({
						get each() {
							return families();
						},
						children: (family) => {
							var _v$14, _v$16, _v$17, _v$15;
							return _v$14 = ssrHydrationKey(), _v$16 = () => {
								return escape(family.familyName);
							}, _v$17 = scope(() => {
								return escape(formatParentNames(family.parentFirstName, family.parentLastName, family.familyMembers));
							}), _v$15 = () => {
								return ssrAttribute("value", escape(family.id, true));
							}, ssr(_tmpl$6, _v$14, _v$15, _v$16, _v$17);
						}
					})), _v$7 = () => {
						return ssrAttribute("value", escape(selectedFamilyId(), true));
					}, ssr(_tmpl$2, _v$6, ssrStyleProperty("flex:", "2") + ssrStyleProperty(";min-width:", "250px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$7, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), _v$8);
				}
			})), _v$3 = () => {
				return ssrAttribute("value", escape(selectedYear(), true));
			}, _v$5 = () => {
				return ssrAttribute("value", escape(viewMode(), true));
			}, ssr(_tmpl$3, _v$2, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";box-shadow:", "0 1px 3px rgba(0,0,0,0.1)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";flex-wrap:", "wrap") + ssrStyleProperty(";align-items:", "end"), ssrStyleProperty("flex:", "1") + ssrStyleProperty(";min-width:", "200px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$3, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), _v$4, ssrStyleProperty("flex:", "1") + ssrStyleProperty(";min-width:", "200px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$5, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), _v$9)),
			Show({
				get when() {
					return memo(() => {
						return viewMode() === "single";
					})() && singleReport();
				},
				children: (report) => {
					var _v$33, _v$34, _v$35, _v$36, _v$18, _v$19, _v$20, _v$21, _v$22, _v$23, _v$24, _v$25, _v$26, _v$27, _v$28, _v$29, _v$30, _v$31, _v$32, _v$37;
					return _v$18 = ssrHydrationKey(), _v$19 = () => {
						return escape(report().familyName);
					}, _v$20 = scope(() => {
						return escape(selectedYear());
					}), _v$21 = () => {
						return escape(report().familyName);
					}, _v$22 = () => {
						return escape(report().parentName);
					}, _v$23 = scope((() => {
						var _c$ = memo(() => {
							return !!report().email;
						});
						return () => {
							var _v$38, _v$39;
							return _c$() ? (_v$38 = ssrHydrationKey(), _v$39 = () => {
								return escape(report().email);
							}, ssr(_tmpl$9, _v$38, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$39)) : escape(report().email);
						};
					})()), _v$24 = scope((() => {
						var _c$2 = memo(() => {
							return !!report().phone;
						});
						return () => {
							var _v$40, _v$41;
							return _c$2() ? (_v$40 = ssrHydrationKey(), _v$41 = () => {
								return escape(report().phone);
							}, ssr(_tmpl$10, _v$40, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$41)) : escape(report().phone);
						};
					})()), _v$25 = escape(For({
						get each() {
							return report().children;
						},
						children: (child) => {
							const dob = new Date(child.dateOfBirth);
							const age = selectedYear() - dob.getFullYear();
							var _v$42 = ssrHydrationKey(), _v$43 = () => {
								return escape(child.firstName);
							}, _v$44 = () => {
								return escape(child.lastName);
							}, _v$45 = escape(age), _v$46 = scope(() => {
								return escape(selectedYear());
							});
							return ssr(_tmpl$11, _v$42, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$43, _v$44, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$45, _v$46);
						}
					})), _v$26 = () => {
						return escape(report().totalSessions);
					}, _v$27 = escape(For({
						get each() {
							return report().sessions;
						},
						children: (session) => {
							var _v$47, _v$48, _v$49, _v$50, _v$51, _v$52, _v$53, _v$54, _v$55, _v$56;
							return _v$47 = ssrHydrationKey(), _v$48 = scope(() => {
								return escape(formatDate(session.date));
							}), _v$49 = () => {
								return escape(session.serviceName);
							}, _v$50 = () => {
								return escape(session.children.map((c) => `${c.firstName} ${c.lastName}`).join(", ") || "N/A");
							}, _v$51 = scope(() => {
								return escape(formatTime(session.startTime));
							}), _v$52 = scope(() => {
								return escape(formatTime(session.endTime));
							}), _v$53 = scope(() => {
								return escape(hoursDisplay(session.hours, 2));
							}), _v$54 = scope((() => {
								var _c$4 = memo(() => {
									return !!session.hourlyRate;
								});
								return () => {
									return _c$4() ? escape(formatCurrency(session.hourlyRate)) : "N/A";
								};
							})()), _v$55 = scope(() => {
								return escape(formatCurrency(session.sessionAmount));
							}), _v$56 = scope(() => {
								return escape(formatCurrency(session.totalAmount));
							}), ssr(_tmpl$12, _v$47, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), _v$48, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), _v$49, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), _v$50, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), _v$51, _v$52, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";text-align:", "right"), _v$53, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";text-align:", "right"), _v$54, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";text-align:", "right"), _v$55, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";font-weight:", "600"), _v$56);
						}
					})), _v$28 = () => {
						return escape(report().totalSessions);
					}, _v$29 = scope(() => {
						return escape(hoursDisplay(report().totalHours, 2));
					}), _v$30 = scope(() => {
						return escape(formatCurrency(report().totalAmount));
					}), _v$31 = scope(() => {
						return escape(formatCurrency(report().totalPaid));
					}), _v$32 = scope((() => {
						var _c$3 = memo(() => {
							return report().totalOutstanding > 0;
						});
						return () => {
							var _v$57, _v$58;
							return _c$3() && (_v$57 = ssrHydrationKey(), _v$58 = scope(() => {
								return escape(formatCurrency(report().totalOutstanding));
							}), ssr(_tmpl$13, _v$57, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-size:", "1.5rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "#e53e3e"), _v$58));
						};
					})()), _v$37 = escape(Show({
						get when() {
							return memo(() => {
								return !!report().standaloneExpenses;
							})() ? report().standaloneExpenses.length > 0 : report().standaloneExpenses;
						},
						get children() {
							return _v$33 = ssrHydrationKey(), _v$34 = () => {
								return escape(report().standaloneExpenses.length);
							}, _v$35 = escape(For({
								get each() {
									return report().standaloneExpenses;
								},
								children: (expense) => {
									var _v$59, _v$60, _v$61, _v$62, _v$63;
									return _v$59 = ssrHydrationKey(), _v$60 = scope(() => {
										return escape(formatDate(expense.expenseDate));
									}), _v$61 = () => {
										return escape(expense.description);
									}, _v$62 = () => {
										return escape(expense.category || "Uncategorized");
									}, _v$63 = scope(() => {
										return escape(formatCurrency(expense.amount));
									}), ssr(_tmpl$14, _v$59, ssrStyleProperty("border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem"), _v$60, ssrStyleProperty("padding:", "0.75rem"), _v$61, ssrStyleProperty("padding:", "0.75rem"), ssrStyleProperty("display:", "inline-block") + ssrStyleProperty(";padding:", "0.25rem 0.75rem") + ssrStyleProperty(";border-radius:", "12px") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";background-color:", "#e6fffa") + ssrStyleProperty(";color:", "#234e52"), _v$62, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";font-weight:", "600"), _v$63);
								}
							})), _v$36 = scope(() => {
								return escape(formatCurrency(report().totalStandaloneExpenses));
							}), ssr(_tmpl$7, _v$33, ssrStyleProperty("margin-bottom:", "2rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin-bottom:", "1rem"), _v$34, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";overflow:", "hidden"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";border-collapse:", "collapse"), ssrStyleProperty("background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$35, ssrStyleProperty("background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";font-weight:", "700"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right"), _v$36);
						}
					})), ssr(_tmpl$8, _v$18, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "2rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";box-shadow:", "0 1px 3px rgba(0,0,0,0.1)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "2rem") + ssrStyleProperty(";flex-wrap:", "wrap") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("font-size:", "1.5rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "var(--color-text)"), _v$19, _v$20, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";flex-wrap:", "wrap"), ssrStyleProperty("padding:", "0.75rem 1.5rem") + ssrStyleProperty(";background-color:", "var(--color-text)") + ssrStyleProperty(";color:", "#fff") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";transition:", "background-color 0.2s"), ssrStyleProperty("padding:", "0.75rem 1.5rem") + ssrStyleProperty(";background-color:", "#38a169") + ssrStyleProperty(";color:", "#fff") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";transition:", "background-color 0.2s"), ssrStyleProperty("margin-bottom:", "2rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(250px, 1fr))") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$21, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$22, _v$23, _v$24, ssrStyleProperty("margin-bottom:", "2rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-wrap:", "wrap") + ssrStyleProperty(";gap:", "1rem"), _v$25, ssrStyleProperty("margin-bottom:", "2rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin-bottom:", "1rem"), _v$26, ssrStyleProperty("overflow:", "auto"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";border-collapse:", "collapse"), ssrStyleProperty("background-color:", "var(--color-surface-muted)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), _v$27, ssrStyleProperty("padding:", "1.5rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(200px, 1fr))") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-size:", "1.5rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "var(--color-text)"), _v$28, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-size:", "1.5rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "var(--color-text)"), _v$29, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-size:", "1.5rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "var(--color-text)"), _v$30, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-size:", "1.5rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "#38a169"), _v$31, _v$32, _v$37);
				}
			}),
			Show({
				get when() {
					return memo(() => {
						return viewMode() === "all";
					})() && allReports();
				},
				children: (reports) => {
					var _v$64, _v$65, _v$66;
					return _v$64 = ssrHydrationKey(), _v$65 = scope(() => {
						return escape(selectedYear());
					}), _v$66 = escape(For({
						get each() {
							return reports();
						},
						children: (report) => {
							var _v$67, _v$68, _v$69, _v$70, _v$71, _v$72, _v$73, _v$74, _v$75;
							return _v$67 = ssrHydrationKey(), _v$68 = () => {
								return escape(report.familyName);
							}, _v$69 = () => {
								return escape(report.parentName);
							}, _v$70 = () => {
								return `/reports/year-end?family=${escape(report.familyId, true)}&amp;year=${escape(selectedYear(), true)}`;
							}, _v$71 = () => {
								return escape(report.totalSessions);
							}, _v$72 = scope(() => {
								return escape(hoursDisplay(report.totalHours, 2));
							}), _v$73 = scope(() => {
								return escape(formatCurrency(report.totalAmount));
							}), _v$74 = scope(() => {
								return escape(formatCurrency(report.totalPaid));
							}), _v$75 = scope((() => {
								var _c$5 = memo(() => {
									return report.totalOutstanding > 0;
								});
								return () => {
									var _v$76, _v$77;
									return _c$5() && (_v$76 = ssrHydrationKey(), _v$77 = scope(() => {
										return escape(formatCurrency(report.totalOutstanding));
									}), ssr(_tmpl$13, _v$76, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "#e53e3e"), _v$77));
								};
							})()), ssr(_tmpl$16, _v$67, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";box-shadow:", "0 1px 3px rgba(0,0,0,0.1)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem") + ssrStyleProperty(";flex-wrap:", "wrap") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin-bottom:", "0.25rem"), _v$68, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$69, _v$70, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "var(--color-text)") + ssrStyleProperty(";color:", "#fff") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";transition:", "background-color 0.2s"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(150px, 1fr))") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$71, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$72, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$73, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "#38a169"), _v$74, _v$75);
						}
					})), ssr(_tmpl$15, _v$64, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "1.5rem"), ssrStyleProperty("font-size:", "1.5rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "var(--color-text)"), _v$65, _v$66);
				}
			}),
			Show({
				get when() {
					return memo(() => {
						return viewMode() === "single";
					})() && !selectedFamilyId();
				},
				get children() {
					return _v$10 = ssrHydrationKey(), _v$11 = scope(() => {
						return escape(selectedYear());
					}), ssr(_tmpl$4, _v$10, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "3rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";text-align:", "center"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin-bottom:", "0.5rem"), ssrStyleProperty("color:", "var(--color-text-muted)"), _v$11);
				}
			})
		];
	} });
}
//#endregion
export { YearEndReports as default };
