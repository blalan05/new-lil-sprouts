import { g as getAllFamiliesForReports, v as getAnnualTaxSummary } from "../server.js";
import { escape, scope, ssr, ssrAttribute, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createSignal } from "solid-js";
//#region src/routes/reports/tax-summary.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<main",
	" class=\"page\"><header style=\"",
	"\"><p style=\"",
	"\"><a href=\"/reports\">← Back to reports</a></p><h1 class=\"page-title\" style=\"",
	"\">Annual tax summary</h1><p class=\"text-muted\" style=\"",
	"\">Cash-basis gross income, expenses by category, and net income for tax planning.</p></header><div class=\"card\" style=\"",
	"\"><div><label for=\"tax-year\" class=\"text-muted\" style=\"",
	"\">Tax year</label><select id=\"tax-year\" class=\"input-field\"",
	">",
	"</select></div><div style=\"",
	"\"><label for=\"tax-family\" class=\"text-muted\" style=\"",
	"\">Family (optional)</label><select id=\"tax-family\" class=\"input-field\"",
	"><option value>All families</option><!--$-->",
	"<!--/--></select></div></div><!--$-->",
	"<!--/--></main>"
];
var _tmpl$2 = [
	"<option",
	"",
	">",
	"</option>"
];
var _tmpl$3 = ["<p", " class=\"empty-state\">Loading tax summary…</p>"];
var _tmpl$4 = [
	"<div",
	" style=\"",
	"\"><div class=\"stat-card stat-card--success\"><div class=\"text-muted stat-label\">Gross income</div><div class=\"stat-value\">",
	"</div></div><div class=\"stat-card stat-card--danger\"><div class=\"text-muted stat-label\">Total expenses</div><div class=\"stat-value\">",
	"</div></div><div class=\"stat-card\"><div class=\"text-muted stat-label\">Net income</div><div class=\"stat-value\">",
	"</div></div><div class=\"stat-card\"><div class=\"text-muted stat-label\">Payments</div><div class=\"stat-value\">",
	"</div></div></div>"
];
var _tmpl$5 = [
	"<table",
	" class=\"data-table\"><thead><tr><th>Category</th><th style=\"",
	"\">Amount</th><th style=\"",
	"\">Count</th></tr></thead><tbody>",
	"</tbody></table>"
];
var _tmpl$6 = [
	"<section",
	" class=\"card\" style=\"",
	"\"><h2 style=\"",
	"\">Expenses by category</h2><!--$-->",
	"<!--/--></section>"
];
var _tmpl$7 = ["<p", " class=\"empty-state\">No expenses recorded for this period.</p>"];
var _tmpl$8 = [
	"<tr",
	"><td>",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td></tr>"
];
function formatCurrency(amount) {
	const value = typeof amount === "string" ? parseFloat(amount) : amount;
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(value);
}
function TaxSummaryReport() {
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const [selectedYear, setSelectedYear] = createSignal(currentYear);
	const [selectedFamilyId, setSelectedFamilyId] = createSignal("");
	const families = createMemo(() => getAllFamiliesForReports());
	const summary = createMemo(() => {
		const year = selectedYear();
		const familyId = selectedFamilyId();
		return getAnnualTaxSummary(year, familyId || void 0);
	});
	const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
	var _v$ = ssrHydrationKey(), _v$3 = escape(For({
		each: years,
		children: (year) => {
			var _v$7, _v$8;
			return _v$7 = ssrHydrationKey(), _v$8 = escape(year), ssr(_tmpl$2, _v$7, ssrAttribute("value", escape(year, true)), _v$8);
		}
	})), _v$5 = escape(For({
		get each() {
			return families();
		},
		children: (family) => {
			var _v$9, _v$11, _v$10;
			return _v$9 = ssrHydrationKey(), _v$11 = () => {
				return escape(family.familyName);
			}, _v$10 = () => {
				return ssrAttribute("value", escape(family.id, true));
			}, ssr(_tmpl$2, _v$9, _v$10, _v$11);
		}
	})), _v$6 = escape(Show({
		get when() {
			return summary();
		},
		get fallback() {
			var _v$12 = ssrHydrationKey();
			return ssr(_tmpl$3, _v$12);
		},
		children: (data) => {
			var _v$13, _v$14, _v$15, _v$16, _v$17, _v$19, _v$20, _v$18, _v$21;
			return [(_v$13 = ssrHydrationKey(), _v$14 = scope(() => {
				return escape(formatCurrency(data().grossIncome));
			}), _v$15 = scope(() => {
				return escape(formatCurrency(data().totalExpenses));
			}), _v$16 = scope(() => {
				return escape(formatCurrency(data().netIncome));
			}), _v$17 = () => {
				return escape(data().paymentCount);
			}, ssr(_tmpl$4, _v$13, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(180px, 1fr))") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";margin-bottom:", "1.5rem"), _v$14, _v$15, _v$16, _v$17)), (_v$18 = ssrHydrationKey(), _v$21 = escape(Show({
				get when() {
					return data().byCategory.length;
				},
				get fallback() {
					var _v$22 = ssrHydrationKey();
					return ssr(_tmpl$7, _v$22);
				},
				get children() {
					return _v$19 = ssrHydrationKey(), _v$20 = escape(For({
						get each() {
							return data().byCategory;
						},
						children: (row) => {
							var _v$23, _v$24, _v$25, _v$26;
							return _v$23 = ssrHydrationKey(), _v$24 = () => {
								return escape(row.category);
							}, _v$25 = scope(() => {
								return escape(formatCurrency(row.amount));
							}), _v$26 = () => {
								return escape(row.count);
							}, ssr(_tmpl$8, _v$23, _v$24, ssrStyleProperty("text-align:", "right"), _v$25, ssrStyleProperty("text-align:", "right"), _v$26);
						}
					})), ssr(_tmpl$5, _v$19, ssrStyleProperty("text-align:", "right"), ssrStyleProperty("text-align:", "right"), _v$20);
				}
			})), ssr(_tmpl$6, _v$18, ssrStyleProperty("padding:", "1.25rem"), ssrStyleProperty("margin:", "0 0 1rem") + ssrStyleProperty(";font-size:", "1.125rem"), _v$21))];
		}
	})), _v$2 = () => {
		return ssrAttribute("value", escape(selectedYear(), true));
	}, _v$4 = () => {
		return ssrAttribute("value", escape(selectedFamilyId(), true));
	};
	return ssr(_tmpl$, _v$, ssrStyleProperty("margin-bottom:", "1.5rem"), ssrStyleProperty("margin:", 0), ssrStyleProperty("margin:", "0.5rem 0 0"), ssrStyleProperty("margin:", "0.5rem 0 0"), ssrStyleProperty("padding:", "1.25rem") + ssrStyleProperty(";margin-bottom:", "1.5rem") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";flex-wrap:", "wrap") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";align-items:", "flex-end"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.25rem"), _v$2, _v$3, ssrStyleProperty("min-width:", "200px") + ssrStyleProperty(";flex:", "1"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.25rem"), _v$4, _v$5, _v$6);
}
//#endregion
export { TaxSummaryReport as default };
