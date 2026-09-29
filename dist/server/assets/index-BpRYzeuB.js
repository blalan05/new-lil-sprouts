import { T as useSearchParams } from "./action-6MWjotYm.js";
import { A as createPayment, M as getUnpaidSessions, Tt as useSubmission, Z as getFamilies, bt as Dialog, j as getPayments, pt as formatTimeLocal } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { t as PaymentStatusBadge } from "./StatusBadge-Zr2kRO1T.js";
import { r as moneyDisplay, t as formatMoneyDisplay } from "./money-display-DvMwur0H.js";
import { escape, memo, scope, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createEffect, createSignal, onSettled } from "solid-js";
//#region src/routes/payments/index.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<div",
	" style=\"",
	"\" class=\"table-responsive\"><table style=\"",
	"\"><thead style=\"",
	"\"><tr><th style=\"",
	"\">Date <!--$-->",
	"<!--/--></th><th style=\"",
	"\">Family <!--$-->",
	"<!--/--></th><th style=\"",
	"\">Invoice #</th><th style=\"",
	"\">Amount <!--$-->",
	"<!--/--></th><th style=\"",
	"\">Method <!--$-->",
	"<!--/--></th><th style=\"",
	"\">Status <!--$-->",
	"<!--/--></th></tr></thead><tbody>",
	"</tbody><tfoot style=\"",
	"\"><tr><td colSpan=\"3\" style=\"",
	"\">Total (<!--$-->",
	"<!--/--> payments):</td><td style=\"",
	"\">",
	"</td><td colSpan=\"2\"></td></tr></tfoot></table></div>"
];
var _tmpl$2 = [
	"<wa-card",
	"><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-select label=\"Year\"",
	">",
	"</wa-select><wa-input label=\"Search\" type=\"search\" placeholder=\"Search by family, invoice, method...\"",
	"></wa-input></div><!--$-->",
	"<!--/--></wa-card>"
];
var _tmpl$3 = [
	"<wa-button",
	" type=\"button\" appearance=\"outlined\" size=\"small\">",
	"</wa-button>"
];
var _tmpl$4 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><label style=\"",
	"\">Select Unpaid Sessions *</label><!--$-->",
	"<!--/--></div><div style=\"",
	"\" class=\"table-responsive\"><table style=\"",
	"\"><thead style=\"",
	"\"><tr><th style=\"",
	"\"><input type=\"checkbox\"",
	" style=\"",
	"\"></th><th style=\"",
	"\">Date & Time</th><th style=\"",
	"\">Children</th><th style=\"",
	"\">Duration</th><th style=\"",
	"\">Rate</th><th style=\"",
	"\">Amount</th></tr></thead><tbody>",
	"</tbody></table></div></div>"
];
var _tmpl$5 = [
	"<div",
	" style=\"",
	"\"><h3 style=\"",
	"\">Payment Summary</h3><div style=\"",
	"\"><wa-input label=\"Tips / Bonuses ($)\" name=\"tips\" type=\"number\" step=\"0.01\" min=\"0\"",
	" placeholder=\"0.00\"></wa-input><wa-select label=\"Payment Method\" name=\"method\"",
	"><wa-option value>Select method...</wa-option><wa-option value=\"cash\">Cash</wa-option><wa-option value=\"check\">Check</wa-option><wa-option value=\"venmo\">Venmo</wa-option><wa-option value=\"zelle\">Zelle</wa-option><wa-option value=\"paypal\">PayPal</wa-option><wa-option value=\"bank_transfer\">Bank Transfer</wa-option><wa-option value=\"other\">Other</wa-option></wa-select><wa-textarea label=\"Notes (Optional)\" name=\"notes\"",
	" rows=\"3\" placeholder=\"Additional notes about this payment...\"></wa-textarea></div><div style=\"",
	"\"><div style=\"",
	"\"><span>Total Amount:</span><span style=\"",
	"\">",
	"</span></div></div></div>"
];
var _tmpl$6 = [
	"<div",
	" style=\"",
	"\">",
	"</div>"
];
var _tmpl$7 = [
	"<form",
	"",
	" method=\"post\"><input type=\"hidden\" name=\"familyId\"",
	"><input type=\"hidden\" name=\"paidDate\"",
	"><wa-select label=\"Select Family *\" name=\"familySelect\" required",
	"><wa-option value>Select a family...</wa-option><!--$-->",
	"<!--/--></wa-select><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button type=\"button\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"success\" appearance=\"filled\"",
	">",
	"</wa-button></div></form>"
];
var _tmpl$8 = [
	"<wa-button",
	" variant=\"success\" appearance=\"filled\">",
	"</wa-button>"
];
var _tmpl$9 = [
	"<wa-option",
	"",
	">",
	"</wa-option>"
];
var _tmpl$10 = [
	"<div",
	" style=\"",
	"\">Loading payments...</div>"
];
var _tmpl$11 = [
	"<div",
	" style=\"",
	"\">No payments found for <!--$-->",
	"<!--/-->.</div>"
];
var _tmpl$12 = [
	"<tr",
	" style=\"",
	"\"><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
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
	" style=\"",
	"\">No unpaid confirmed sessions found for this family.</div>"
];
var _tmpl$14 = [
	"<tr",
	" style=\"",
	"\"><td style=\"",
	"\"><input type=\"checkbox\" name=\"sessionIds\"",
	"",
	" style=\"",
	"\"></td><td style=\"",
	"\"><div style=\"",
	"\">",
	"</div><div style=\"",
	"\"><!--$-->",
	"<!--/--> - <!--$-->",
	"<!--/--></div><div style=\"",
	"\">",
	"</div></td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\"><!--$-->",
	"<!--/-->/hr</td><td style=\"",
	"\">",
	"</td></tr>"
];
function PaymentsPage() {
	var _v$5, _v$6, _v$7, _v$8, _v$9, _v$10, _v$11, _v$12, _v$13, _v$, _v$2, _v$3, _v$4, _v$14, _v$21, _v$22, _v$20, _v$23, _v$25, _v$24, _v$27, _g$, _v$31, _v$33, _v$34, _v$15, _v$18, _v$19, _v$26, _v$32, _v$35, _v$36, _v$37, _v$16, _v$17;
	const [searchParams] = useSearchParams();
	const families = createMemo(() => getFamilies());
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const [selectedYear, setSelectedYear] = createSignal(currentYear);
	const [searchTerm, setSearchTerm] = createSignal("");
	const [sortField, setSortField] = createSignal("date");
	const [sortDirection, setSortDirection] = createSignal("desc");
	const [showRecordPayment, setShowRecordPayment] = createSignal(false);
	const allPayments = createMemo(() => {
		const year = selectedYear();
		return getPayments(year);
	});
	const [selectedFamilyId, setSelectedFamilyId] = createSignal("");
	const unpaidSessions = createMemo(async () => {
		const familyId = selectedFamilyId();
		if (!familyId) return [];
		return getUnpaidSessions(familyId);
	});
	onSettled(() => {
		const familyId = searchParams.familyId;
		if (typeof familyId === "string" && familyId) setSelectedFamilyId(familyId);
		if (searchParams.record === "1" || searchParams.record === "true") setShowRecordPayment(true);
	});
	const [selectedSessionIds, setSelectedSessionIds] = createSignal([]);
	const [tips, setTips] = createSignal("0");
	const [method, setMethod] = createSignal("");
	const [notes, setNotes] = createSignal("");
	const submission = useSubmission(createPayment);
	const calculateTotal = () => {
		const sessions = unpaidSessions();
		if (!sessions) return 0;
		const selected = sessions.filter((s) => selectedSessionIds().includes(s.id));
		let total = 0;
		for (const session of selected) {
			const startTime = new Date(session.scheduledStart).getTime();
			const hours = (new Date(session.scheduledEnd).getTime() - startTime) / 36e5;
			const rate = Number(moneyDisplay(session.hourlyRate));
			total += hours * rate;
			const expenseTotal = session.expenses?.reduce((sum, exp) => sum + Number(moneyDisplay(exp.amount)), 0) || 0;
			total += expenseTotal;
		}
		const tipsAmount = parseFloat(tips()) || 0;
		return total + tipsAmount;
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
	const formatDuration = (start, end) => {
		return `${((end.getTime() - start.getTime()) / 36e5).toFixed(1)} hours`;
	};
	createEffect(() => {
		setSelectedSessionIds([]);
		setTips("0");
	});
	const filteredAndSortedPayments = () => {
		let payments = allPayments() || [];
		const search = searchTerm().toLowerCase();
		if (search) payments = payments.filter((p) => p.family?.familyName.toLowerCase().includes(search) || p.invoiceNumber?.toLowerCase().includes(search) || p.method?.toLowerCase().includes(search) || p.notes?.toLowerCase().includes(search) || p.status.toLowerCase().includes(search));
		payments = [...payments].sort((a, b) => {
			let aVal;
			let bVal;
			switch (sortField()) {
				case "date":
					aVal = a.paidDate || a.createdAt;
					bVal = b.paidDate || b.createdAt;
					break;
				case "family":
					aVal = a.family?.familyName || "";
					bVal = b.family?.familyName || "";
					break;
				case "amount":
					aVal = a.amount;
					bVal = b.amount;
					break;
				case "method":
					aVal = a.method || "";
					bVal = b.method || "";
					break;
				case "status":
					aVal = a.status;
					bVal = b.status;
					break;
				default: return 0;
			}
			if (aVal < bVal) return sortDirection() === "asc" ? -1 : 1;
			if (aVal > bVal) return sortDirection() === "asc" ? 1 : -1;
			return 0;
		});
		return payments;
	};
	const getSortIcon = (field) => {
		if (sortField() !== field) return "↕️";
		return sortDirection() === "asc" ? "↑" : "↓";
	};
	createEffect(() => {
		if (submission.result && !(submission.result instanceof Error)) {
			setSelectedFamilyId("");
			setSelectedSessionIds([]);
			setTips("0");
			setMethod("");
			setNotes("");
			setShowRecordPayment(false);
			window.location.reload();
		}
	});
	return PageContent({ get children() {
		return [
			PageHeader({
				title: "Payments",
				get actions() {
					var _v$38 = ssrHydrationKey(), _v$39 = () => {
						return showRecordPayment() ? "Hide Record Payment" : "+ Record Payment";
					};
					return ssr(_tmpl$8, _v$38, _v$39);
				}
			}),
			(_v$ = ssrHydrationKey(), _v$2 = () => {
				return ssrAttribute("value", escape(String(selectedYear()), true));
			}, _v$3 = scope(() => {
				return escape(Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => {
					var _v$40, _v$41, _v$42;
					return _v$40 = ssrHydrationKey(), _v$41 = () => {
						return ssrAttribute("value", escape(String(year), true));
					}, _v$42 = escape(year), ssr(_tmpl$9, _v$40, _v$41, _v$42);
				}));
			}), _v$4 = () => {
				return ssrAttribute("value", escape(searchTerm(), true));
			}, _v$14 = escape(Show({
				get when() {
					return allPayments();
				},
				get fallback() {
					var _v$43 = ssrHydrationKey();
					return ssr(_tmpl$10, _v$43, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "3rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
				},
				get children() {
					return Show({
						get when() {
							return filteredAndSortedPayments().length > 0;
						},
						get fallback() {
							var _v$44 = ssrHydrationKey(), _v$45 = scope(() => {
								return escape(selectedYear());
							});
							return ssr(_tmpl$11, _v$44, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "2rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$45);
						},
						get children() {
							return _v$5 = ssrHydrationKey(), _v$6 = scope(() => {
								return escape(getSortIcon("date"));
							}), _v$7 = scope(() => {
								return escape(getSortIcon("family"));
							}), _v$8 = scope(() => {
								return escape(getSortIcon("amount"));
							}), _v$9 = scope(() => {
								return escape(getSortIcon("method"));
							}), _v$10 = scope(() => {
								return escape(getSortIcon("status"));
							}), _v$11 = escape(For({
								get each() {
									return filteredAndSortedPayments();
								},
								children: (payment) => {
									var _v$46 = ssrHydrationKey(), _v$47 = scope(() => {
										return escape(formatDate(payment.paidDate || payment.createdAt));
									}), _v$48 = () => {
										return escape(payment.family?.familyName || "N/A");
									}, _v$49 = () => {
										return escape(payment.invoiceNumber || "-");
									}, _v$50 = scope(() => {
										return escape(formatMoneyDisplay(payment.amount));
									}), _v$51 = () => {
										return escape(payment.method || "-");
									}, _v$52 = escape(PaymentStatusBadge({ get status() {
										return payment.status;
									} }));
									return ssr(_tmpl$12, _v$46, ssrStyleProperty("border-bottom:", "1px solid var(--color-border)") + ssrStyleProperty(";transition:", "background-color 0.2s"), ssrStyleProperty("padding:", "0.75rem"), _v$47, ssrStyleProperty("padding:", "0.75rem"), _v$48, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$49, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";font-weight:", "600"), _v$50, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";font-size:", "0.875rem"), _v$51, ssrStyleProperty("padding:", "0.75rem"), _v$52);
								}
							})), _v$12 = () => {
								return escape(filteredAndSortedPayments().length);
							}, _v$13 = scope(() => {
								return escape(formatMoneyDisplay(filteredAndSortedPayments().reduce((sum, p) => sum + Number(moneyDisplay(p.amount)), 0)));
							}), ssr(_tmpl$, _v$5, ssrStyleProperty("overflow:", "auto"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";border-collapse:", "collapse"), ssrStyleProperty("background-color:", "var(--color-surface-muted)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";user-select:", "none"), _v$6, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";user-select:", "none"), _v$7, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";user-select:", "none"), _v$8, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";user-select:", "none"), _v$9, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";user-select:", "none"), _v$10, _v$11, ssrStyleProperty("background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-top:", "2px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";text-align:", "right"), _v$12, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";font-size:", "1.125rem") + ssrStyleProperty(";color:", "#48bb78"), _v$13);
						}
					});
				}
			})), ssr(_tmpl$2, _v$, ssrStyleProperty("--min-column-size:", "200px") + ssrStyleProperty(";margin-bottom:", "var(--wa-space-m)"), _v$2, _v$3, _v$4, _v$14)),
			Dialog({
				get open() {
					return showRecordPayment();
				},
				title: "Record Payment",
				maxWidth: "900px",
				onClose: () => setShowRecordPayment(false),
				get children() {
					return _v$15 = ssrHydrationKey(), _v$18 = () => {
						return ssrAttribute("value", escape(selectedFamilyId(), true));
					}, _v$19 = escape(For({
						get each() {
							return families();
						},
						children: (family) => {
							var _v$53, _v$54, _v$55;
							return _v$53 = ssrHydrationKey(), _v$54 = () => {
								return ssrAttribute("value", escape(family.id, true));
							}, _v$55 = () => {
								return escape(family.familyName);
							}, ssr(_tmpl$9, _v$53, _v$54, _v$55);
						}
					})), _v$26 = escape(Show({
						get when() {
							return selectedFamilyId();
						},
						get children() {
							return Show({
								get when() {
									return memo(() => {
										return !!unpaidSessions();
									})() ? unpaidSessions().length > 0 : unpaidSessions();
								},
								get fallback() {
									var _v$56 = ssrHydrationKey();
									return ssr(_tmpl$13, _v$56, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-bottom:", "1rem"));
								},
								get children() {
									return _v$20 = ssrHydrationKey(), _v$23 = escape(Show({
										get when() {
											return memo(() => {
												return !!unpaidSessions();
											})() ? unpaidSessions().length > 0 : unpaidSessions();
										},
										get children() {
											return _v$21 = ssrHydrationKey(), _v$22 = () => {
												return selectedSessionIds().length === unpaidSessions().length ? "Deselect All" : "Select All";
											}, ssr(_tmpl$3, _v$21, _v$22);
										}
									})), _v$25 = escape(For({
										get each() {
											return unpaidSessions();
										},
										children: (session) => {
											const startTime = new Date(session.scheduledStart);
											const endTime = new Date(session.scheduledEnd);
											const hours = (endTime.getTime() - startTime.getTime()) / 36e5;
											const rate = Number(moneyDisplay(session.hourlyRate));
											const amount = hours * rate + (session.expenses?.reduce((sum, exp) => sum + Number(moneyDisplay(exp.amount)), 0) || 0);
											const isSelected = selectedSessionIds().includes(session.id);
											var _v$57 = ssrHydrationKey(), _v$59 = scope(() => {
												return escape(formatDate(session.scheduledStart));
											}), _v$60 = scope(() => {
												return escape(formatTime(session.scheduledStart));
											}), _v$61 = scope(() => {
												return escape(formatTime(session.scheduledEnd));
											}), _v$62 = () => {
												return escape(session.service?.name || "");
											}, _v$63 = scope((() => {
												var _c$ = memo(() => {
													return !!(session.children && session.children.length > 0);
												});
												return () => {
													return _c$() ? escape(session.children.map((c) => c.firstName).join(", ")) : "N/A";
												};
											})()), _v$64 = scope(() => {
												return escape(formatDuration(startTime, endTime));
											}), _v$65 = scope(() => {
												return escape(formatMoneyDisplay(rate));
											}), _v$66 = scope(() => {
												return escape(formatMoneyDisplay(amount));
											}), _v$58 = () => {
												return ssrAttribute("value", escape(session.id, true));
											};
											return ssr(_tmpl$14, _v$57, ssrStyleProperty("border-bottom:", "1px solid var(--color-border)") + ssrStyleProperty(";background-color:", isSelected ? "#f0fff4" : "transparent"), ssrStyleProperty("padding:", "0.75rem"), _v$58, ssrAttribute("checked", escape(isSelected, true)), ssrStyleProperty("width:", "1.25rem") + ssrStyleProperty(";height:", "1.25rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("padding:", "0.75rem"), ssrStyleProperty("font-weight:", "500"), _v$59, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$60, _v$61, ssrStyleProperty("font-size:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text-subtle)") + ssrStyleProperty(";margin-top:", "0.25rem"), _v$62, ssrStyleProperty("padding:", "0.75rem"), _v$63, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right"), _v$64, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right"), _v$65, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";font-weight:", "600"), _v$66);
										}
									})), _v$24 = () => {
										return ssrAttribute("checked", unpaidSessions() && unpaidSessions().length > 0 && escape(selectedSessionIds().length, true) === escape(unpaidSessions().length, true));
									}, ssr(_tmpl$4, _v$20, ssrStyleProperty("margin-bottom:", "1rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$23, ssrStyleProperty("max-height:", "400px") + ssrStyleProperty(";overflow:", "auto") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";border-collapse:", "collapse"), ssrStyleProperty("background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";position:", "sticky") + ssrStyleProperty(";top:", 0), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)") + ssrStyleProperty(";width:", "40px"), _v$24, ssrStyleProperty("width:", "1.25rem") + ssrStyleProperty(";height:", "1.25rem") + ssrStyleProperty(";cursor:", "pointer"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)"), _v$25);
								}
							});
						}
					})), _v$32 = escape(Show({
						get when() {
							return selectedSessionIds().length > 0;
						},
						get children() {
							return _v$27 = ssrHydrationKey(), _g$ = ssrGroup(() => {
								return [
									ssrAttribute("value", escape(tips(), true)),
									ssrAttribute("value", escape(method(), true)),
									ssrAttribute("value", escape(notes(), true))
								];
							}, 3), _v$31 = scope(() => {
								return escape(formatMoneyDisplay(calculateTotal()));
							}), ssr(_tmpl$5, _v$27, ssrStyleProperty("padding:", "1.5rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "1rem") + ssrStyleProperty(";margin-bottom:", "0.5rem"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";gap:", "0.75rem") + ssrStyleProperty(";margin-bottom:", "1rem"), _g$, _g$, _g$, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";background-color:", "var(--color-surface)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";border:", "2px solid #48bb78"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";font-size:", "1.25rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("color:", "#48bb78"), _v$31);
						}
					})), _v$35 = escape(Show({
						get when() {
							return memo(() => {
								return !!submission.result;
							})() ? submission.result instanceof Error : submission.result;
						},
						get children() {
							return _v$33 = ssrHydrationKey(), _v$34 = () => {
								return escape(submission.result?.message);
							}, ssr(_tmpl$6, _v$33, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";background-color:", "var(--wa-color-danger-fill-quiet)") + ssrStyleProperty(";border:", "1px solid #feb2b2") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";color:", "#c53030") + ssrStyleProperty(";margin-bottom:", "0.75rem"), _v$34);
						}
					})), _v$36 = () => {
						return ssrAttribute("disabled", escape(submission.pending || selectedSessionIds().length === 0 || void 0, true));
					}, _v$37 = () => {
						return submission.pending ? "Recording Payment..." : "Record Payment";
					}, _v$16 = () => {
						return ssrAttribute("value", escape(selectedFamilyId(), true));
					}, _v$17 = () => {
						return ssrAttribute("value", escape((/* @__PURE__ */ new Date()).toISOString(), true));
					}, ssr(_tmpl$7, _v$15, ssrAttribute("action", escape(createPayment, true)), _v$16, _v$17, _v$18, _v$19, _v$26, _v$32, _v$35, ssrStyleProperty("justify-content:", "flex-end"), _v$36, _v$37);
				}
			})
		];
	} });
}
//#endregion
export { PaymentsPage as default };
