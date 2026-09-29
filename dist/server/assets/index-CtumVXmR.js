import { G as updateStandaloneExpense, Tt as useSubmission, V as getExpenses, Z as getFamilies, dt as formatDateLocal, yt as useConfirm, z as createStandaloneExpense } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, memo, scope, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createSignal } from "solid-js";
//#region src/routes/expenses/index.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<wa-card",
	"><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"Search\" type=\"search\" placeholder=\"Search expenses...\"",
	"></wa-input><wa-select label=\"Filter by Family\"",
	"><wa-option value>All Families</wa-option><!--$-->",
	"<!--/--></wa-select></div></wa-card>"
];
var _tmpl$2 = [
	"<wa-card",
	"><div class=\"wa-cluster wa-gap-xl\"><div class=\"wa-stack wa-gap-xs\"><div class=\"wa-body-s wa-color-text-quiet\">Total Expenses</div><div class=\"wa-heading-xl\">",
	"</div></div><div class=\"wa-stack wa-gap-xs\"><div class=\"wa-body-s wa-color-text-quiet\">Number of Expenses</div><div class=\"wa-heading-xl\">",
	"</div></div></div></wa-card>"
];
var _tmpl$3 = [
	"<wa-card",
	" style=\"",
	"\"><div style=\"",
	"\" class=\"table-responsive\"><table style=\"",
	"\"><thead><tr style=\"",
	"\"><th style=\"",
	"\">Date <!--$-->",
	"<!--/--></th><th style=\"",
	"\">Description <!--$-->",
	"<!--/--></th><th style=\"",
	"\">Category <!--$-->",
	"<!--/--></th><th style=\"",
	"\">Family <!--$-->",
	"<!--/--></th><th style=\"",
	"\">Amount <!--$-->",
	"<!--/--></th><th style=\"",
	"\">Actions</th></tr></thead><tbody>",
	"</tbody></table></div></wa-card>"
];
var _tmpl$4 = [
	"<div",
	" style=\"",
	"\"><wa-card style=\"",
	"\"><h2 class=\"wa-heading-l\" style=\"",
	"\">Add New Expense</h2><form",
	" method=\"post\" class=\"wa-stack wa-gap-m\"><wa-input label=\"Description *\" name=\"description\" required></wa-input><wa-input label=\"Amount *\" name=\"amount\" type=\"number\" step=\"0.01\" min=\"0\" required></wa-input><wa-select label=\"Category\" name=\"category\"><wa-option value>Select a category</wa-option><!--$-->",
	"<!--/--></wa-select><wa-input label=\"Expense Date\" name=\"expenseDate\" type=\"date\"",
	"></wa-input><wa-select label=\"Family (Optional)\" name=\"familyId\"><wa-option value>General (No specific family)</wa-option><!--$-->",
	"<!--/--></wa-select><wa-textarea label=\"Notes\" name=\"notes\" rows=\"3\"></wa-textarea><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button type=\"button\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"brand\" appearance=\"filled\"",
	">Add Expense</wa-button></div></form></wa-card></div>"
];
var _tmpl$5 = ["<wa-button", " variant=\"brand\" appearance=\"filled\">+ Add Expense</wa-button>"];
var _tmpl$6 = [
	"<wa-option",
	"",
	">",
	"</wa-option>"
];
var _tmpl$7 = [
	"<tr",
	"><td colSpan=\"6\" style=\"",
	"\" class=\"wa-color-text-quiet\">No expenses found</td></tr>"
];
var _tmpl$8 = [
	"<div",
	" class=\"wa-body-s wa-color-text-quiet\" style=\"",
	"\">",
	"</div>"
];
var _tmpl$9 = [
	"<a",
	" href=\"",
	"\">",
	"</a>"
];
var _tmpl$10 = [
	"<tr",
	" style=\"",
	"\"><td style=\"",
	"\">",
	"</td><td style=\"",
	"\"><div class=\"wa-heading-s\">",
	"</div><!--$-->",
	"<!--/--></td><td style=\"",
	"\"><wa-badge variant=\"success\" appearance=\"filled-outlined\" pill>",
	"</wa-badge></td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\"><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button appearance=\"outlined\" size=\"small\">Edit</wa-button><wa-button variant=\"danger\" appearance=\"outlined\" size=\"small\">Delete</wa-button></div></td></tr>"
];
var _tmpl$11 = ["<span", " class=\"wa-color-text-quiet\">General</span>"];
var _tmpl$12 = [
	"<div",
	" style=\"",
	"\"><wa-card style=\"",
	"\"><h2 class=\"wa-heading-l\" style=\"",
	"\">Edit Expense</h2><form",
	" method=\"post\" class=\"wa-stack wa-gap-m\"><input type=\"hidden\" name=\"id\"",
	"><wa-input label=\"Description *\" name=\"description\"",
	" required></wa-input><wa-input label=\"Amount *\" name=\"amount\" type=\"number\" step=\"0.01\" min=\"0\"",
	" required></wa-input><wa-select label=\"Category\" name=\"category\"",
	"><wa-option value>Select a category</wa-option><!--$-->",
	"<!--/--></wa-select><wa-input label=\"Expense Date\" name=\"expenseDate\" type=\"date\"",
	"></wa-input><wa-select label=\"Family (Optional)\" name=\"familyId\"",
	"><wa-option value>General (No specific family)</wa-option><!--$-->",
	"<!--/--></wa-select><wa-textarea label=\"Notes\" name=\"notes\" rows=\"3\"",
	"></wa-textarea><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button type=\"button\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"brand\" appearance=\"filled\"",
	">Update Expense</wa-button></div></form></wa-card></div>"
];
var EXPENSE_CATEGORIES = [
	"FOOD",
	"ACTIVITY",
	"SUPPLIES",
	"TRANSPORTATION",
	"BUSINESS",
	"OTHER"
];
function ExpensesPage() {
	var _v$, _g$, _v$4, _v$5, _v$6, _v$7, _v$8, _v$9, _v$10, _v$11, _v$12, _v$13, _v$14, _v$15, _v$16, _v$17, _v$18, _v$19;
	const { confirm } = useConfirm();
	const families = createMemo(() => getFamilies());
	const [selectedFamilyId, setSelectedFamilyId] = createSignal("");
	const expenses = createMemo(() => {
		const familyId = selectedFamilyId();
		return getExpenses(familyId || void 0);
	});
	const [searchTerm, setSearchTerm] = createSignal("");
	const [sortField, setSortField] = createSignal("date");
	const [sortDirection, setSortDirection] = createSignal("desc");
	const [showNewExpense, setShowNewExpense] = createSignal(false);
	const [editingExpense, setEditingExpense] = createSignal(null);
	const createSubmission = useSubmission(createStandaloneExpense);
	const updateSubmission = useSubmission(updateStandaloneExpense);
	const formatDate = formatDateLocal;
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD"
		}).format(Number(String(amount ?? 0).replace(/[$,\s]/g, "")) || 0);
	};
	const filteredExpenses = () => {
		const expensesList = expenses();
		if (!expensesList) return [];
		let filtered = expensesList;
		const term = searchTerm().toLowerCase();
		if (term) filtered = filtered.filter((exp) => exp.description.toLowerCase().includes(term) || exp.category?.toLowerCase().includes(term) || exp.family?.familyName.toLowerCase().includes(term) || exp.notes?.toLowerCase().includes(term));
		filtered = [...filtered].sort((a, b) => {
			let aVal;
			let bVal;
			switch (sortField()) {
				case "date":
					aVal = new Date(a.expenseDate).getTime();
					bVal = new Date(b.expenseDate).getTime();
					break;
				case "description":
					aVal = a.description.toLowerCase();
					bVal = b.description.toLowerCase();
					break;
				case "amount":
					aVal = a.amount;
					bVal = b.amount;
					break;
				case "category":
					aVal = a.category || "";
					bVal = b.category || "";
					break;
				case "family":
					aVal = a.family?.familyName || "";
					bVal = b.family?.familyName || "";
					break;
				default: return 0;
			}
			if (aVal < bVal) return sortDirection() === "asc" ? -1 : 1;
			if (aVal > bVal) return sortDirection() === "asc" ? 1 : -1;
			return 0;
		});
		return filtered;
	};
	const totalExpenses = () => {
		return filteredExpenses().reduce((sum, exp) => {
			return sum + (Number(String(exp.amount ?? 0).replace(/[$,\s]/g, "")) || 0);
		}, 0);
	};
	return PageContent({ get children() {
		return [
			PageHeader({
				title: "Expenses",
				get actions() {
					var _v$20 = ssrHydrationKey();
					return ssr(_tmpl$5, _v$20);
				}
			}),
			(_v$ = ssrHydrationKey(), _g$ = ssrGroup(() => {
				return [ssrAttribute("value", escape(searchTerm(), true)), ssrAttribute("value", escape(selectedFamilyId(), true))];
			}, 2), _v$4 = escape(For({
				get each() {
					return families();
				},
				children: (family) => {
					var _v$21, _v$22, _v$23;
					return _v$21 = ssrHydrationKey(), _v$22 = () => {
						return ssrAttribute("value", escape(family.id, true));
					}, _v$23 = () => {
						return escape(family.familyName);
					}, ssr(_tmpl$6, _v$21, _v$22, _v$23);
				}
			})), ssr(_tmpl$, _v$, ssrStyleProperty("--min-column-size:", "200px"), _g$, _g$, _v$4)),
			(_v$5 = ssrHydrationKey(), _v$6 = scope(() => {
				return escape(formatCurrency(totalExpenses()));
			}), _v$7 = () => {
				return escape(filteredExpenses().length);
			}, ssr(_tmpl$2, _v$5, _v$6, _v$7)),
			(_v$8 = ssrHydrationKey(), _v$9 = (() => {
				var _c$ = memo(() => {
					return sortField() === "date";
				});
				return () => {
					return _c$() && (sortDirection() === "asc" ? "↑" : "↓");
				};
			})(), _v$10 = (() => {
				var _c$2 = memo(() => {
					return sortField() === "description";
				});
				return () => {
					return _c$2() && (sortDirection() === "asc" ? "↑" : "↓");
				};
			})(), _v$11 = (() => {
				var _c$3 = memo(() => {
					return sortField() === "category";
				});
				return () => {
					return _c$3() && (sortDirection() === "asc" ? "↑" : "↓");
				};
			})(), _v$12 = (() => {
				var _c$4 = memo(() => {
					return sortField() === "family";
				});
				return () => {
					return _c$4() && (sortDirection() === "asc" ? "↑" : "↓");
				};
			})(), _v$13 = (() => {
				var _c$5 = memo(() => {
					return sortField() === "amount";
				});
				return () => {
					return _c$5() && (sortDirection() === "asc" ? "↑" : "↓");
				};
			})(), _v$14 = escape(Show({
				get when() {
					return filteredExpenses().length > 0;
				},
				get fallback() {
					var _v$24 = ssrHydrationKey();
					return ssr(_tmpl$7, _v$24, ssrStyleProperty("padding:", "2rem") + ssrStyleProperty(";text-align:", "center"));
				},
				get children() {
					return For({
						get each() {
							return filteredExpenses();
						},
						children: (expense) => {
							var _v$28, _v$29, _v$32, _v$33, _v$34, _v$25, _v$26, _v$27, _v$30, _v$31, _v$35, _v$36;
							return _v$25 = ssrHydrationKey(), _v$26 = scope(() => {
								return escape(formatDate(expense.expenseDate));
							}), _v$27 = () => {
								return escape(expense.description);
							}, _v$30 = escape(Show({
								get when() {
									return expense.notes;
								},
								get children() {
									return _v$28 = ssrHydrationKey(), _v$29 = () => {
										return escape(expense.notes);
									}, ssr(_tmpl$8, _v$28, ssrStyleProperty("margin-top:", "0.25rem"), _v$29);
								}
							})), _v$31 = () => {
								return escape(expense.category || "Uncategorized");
							}, _v$35 = escape(Show({
								get when() {
									return expense.family;
								},
								get fallback() {
									var _v$37 = ssrHydrationKey();
									return ssr(_tmpl$11, _v$37);
								},
								get children() {
									return _v$32 = ssrHydrationKey(), _v$33 = () => {
										return `/families/${escape(expense.family.id, true)}`;
									}, _v$34 = () => {
										return escape(expense.family.familyName);
									}, ssr(_tmpl$9, _v$32, _v$33, _v$34);
								}
							})), _v$36 = scope(() => {
								return escape(formatCurrency(expense.amount));
							}), ssr(_tmpl$10, _v$25, ssrStyleProperty("border-bottom:", "1px solid var(--wa-color-neutral-90)"), ssrStyleProperty("padding:", "1rem"), _v$26, ssrStyleProperty("padding:", "1rem"), _v$27, _v$30, ssrStyleProperty("padding:", "1rem"), _v$31, ssrStyleProperty("padding:", "1rem"), _v$35, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";font-weight:", "600"), _v$36, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";text-align:", "center"), ssrStyleProperty("justify-content:", "center"));
						}
					});
				}
			})), ssr(_tmpl$3, _v$8, ssrStyleProperty("overflow:", "hidden") + ssrStyleProperty(";padding:", 0), ssrStyleProperty("overflow:", "auto"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";border-collapse:", "collapse"), ssrStyleProperty("background-color:", "var(--wa-color-neutral-95)") + ssrStyleProperty(";border-bottom:", "2px solid var(--wa-color-neutral-90)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";cursor:", "pointer"), _v$9, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";cursor:", "pointer"), _v$10, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";cursor:", "pointer"), _v$11, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";cursor:", "pointer"), _v$12, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";cursor:", "pointer"), _v$13, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "center"), _v$14)),
			Show({
				get when() {
					return showNewExpense();
				},
				get children() {
					return _v$15 = ssrHydrationKey(), _v$16 = escape(For({
						each: EXPENSE_CATEGORIES,
						children: (cat) => {
							var _v$38, _v$39;
							return _v$38 = ssrHydrationKey(), _v$39 = escape(cat), ssr(_tmpl$6, _v$38, ssrAttribute("value", escape(cat, true)), _v$39);
						}
					})), _v$17 = () => {
						return ssrAttribute("value", escape((/* @__PURE__ */ new Date()).toISOString().split("T")[0], true));
					}, _v$18 = escape(For({
						get each() {
							return families();
						},
						children: (family) => {
							var _v$40, _v$41, _v$42;
							return _v$40 = ssrHydrationKey(), _v$41 = () => {
								return ssrAttribute("value", escape(family.id, true));
							}, _v$42 = () => {
								return escape(family.familyName);
							}, ssr(_tmpl$6, _v$40, _v$41, _v$42);
						}
					})), _v$19 = () => {
						return ssrAttribute("disabled", escape(createSubmission.pending || void 0, true));
					}, ssr(_tmpl$4, _v$15, ssrStyleProperty("position:", "fixed") + ssrStyleProperty(";inset:", 0) + ssrStyleProperty(";background-color:", "rgba(0, 0, 0, 0.5)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";z-index:", 1e3) + ssrStyleProperty(";padding:", "1.5rem"), ssrStyleProperty("max-width:", "500px") + ssrStyleProperty(";width:", "90%") + ssrStyleProperty(";max-height:", "90vh") + ssrStyleProperty(";overflow:", "auto"), ssrStyleProperty("margin-bottom:", "var(--wa-space-m)"), ssrAttribute("action", escape(createStandaloneExpense, true)), _v$16, _v$17, _v$18, ssrStyleProperty("justify-content:", "flex-end"), _v$19);
				}
			}),
			Show({
				get when() {
					return editingExpense();
				},
				children: () => {
					const expense = expenses()?.find((e) => e.id === editingExpense());
					if (!expense) return null;
					var _v$43 = ssrHydrationKey(), _g$3 = ssrGroup(() => {
						return [
							ssrAttribute("value", escape(expense.description, true)),
							ssrAttribute("value", escape(String(expense.amount), true)),
							ssrAttribute("value", escape(expense.category || "", true))
						];
					}, 3), _v$48 = escape(For({
						each: EXPENSE_CATEGORIES,
						children: (cat) => {
							var _v$54, _v$55;
							return _v$54 = ssrHydrationKey(), _v$55 = escape(cat), ssr(_tmpl$6, _v$54, ssrAttribute("value", escape(cat, true)), _v$55);
						}
					})), _g$2 = ssrGroup(() => {
						return [ssrAttribute("value", escape(new Date(expense.expenseDate).toISOString().split("T")[0], true)), ssrAttribute("value", escape(expense.familyId || "", true))];
					}, 2), _v$51 = escape(For({
						get each() {
							return families();
						},
						children: (family) => {
							var _v$56, _v$57, _v$58;
							return _v$56 = ssrHydrationKey(), _v$57 = () => {
								return ssrAttribute("value", escape(family.id, true));
							}, _v$58 = () => {
								return escape(family.familyName);
							}, ssr(_tmpl$6, _v$56, _v$57, _v$58);
						}
					})), _v$52 = () => {
						return ssrAttribute("value", escape(expense.notes || "", true));
					}, _v$53 = () => {
						return ssrAttribute("disabled", escape(updateSubmission.pending || void 0, true));
					}, _v$44 = () => {
						return ssrAttribute("value", escape(expense.id, true));
					};
					return ssr(_tmpl$12, _v$43, ssrStyleProperty("position:", "fixed") + ssrStyleProperty(";inset:", 0) + ssrStyleProperty(";background-color:", "rgba(0, 0, 0, 0.5)") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center") + ssrStyleProperty(";z-index:", 1e3) + ssrStyleProperty(";padding:", "1.5rem"), ssrStyleProperty("max-width:", "500px") + ssrStyleProperty(";width:", "90%") + ssrStyleProperty(";max-height:", "90vh") + ssrStyleProperty(";overflow:", "auto"), ssrStyleProperty("margin-bottom:", "var(--wa-space-m)"), ssrAttribute("action", escape(updateStandaloneExpense, true)), _v$44, _g$3, _g$3, _g$3, _v$48, _g$2, _g$2, _v$51, _v$52, ssrStyleProperty("justify-content:", "flex-end"), _v$53);
				}
			})
		];
	} });
}
//#endregion
export { ExpensesPage as default };
