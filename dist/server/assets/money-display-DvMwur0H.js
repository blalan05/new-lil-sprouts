//#region src/lib/money-display.ts
function toNumber(value) {
	if (value == null) return 0;
	if (typeof value === "number") return isNaN(value) || !isFinite(value) ? 0 : value;
	const cleaned = String(value).replace(/[$,\s]/g, "");
	if (!cleaned) return 0;
	const parsed = Number(cleaned);
	return isNaN(parsed) ? 0 : parsed;
}
/** Format hours that may arrive as number or string over the wire. */
function hoursDisplay(value, decimalPlaces = 1) {
	return toNumber(value).toFixed(decimalPlaces);
}
/** Format serialized money strings or numbers for UI display. */
function moneyDisplay(value, decimalPlaces = 2) {
	return toNumber(value).toFixed(decimalPlaces);
}
function formatMoneyDisplay(amount, options = {}) {
	const { includeCurrencySymbol = true, decimalPlaces = 2 } = options;
	const formatted = moneyDisplay(amount, decimalPlaces);
	return includeCurrencySymbol ? `$${formatted}` : formatted;
}
//#endregion
export { hoursDisplay as n, moneyDisplay as r, formatMoneyDisplay as t };
