import { N as Decimal } from "./auth-CglT72yL.js";
//#region src/lib/money.ts
/**
* Money utilities using Prisma Decimal for precise currency math.
* Serialize amounts as strings at query boundaries (SolidStart wire format).
*/
function toDecimal(value) {
	if (value == null) return new Decimal(0);
	if (value instanceof Decimal) return value;
	if (typeof value === "number") {
		if (isNaN(value) || !isFinite(value)) return new Decimal(0);
		return new Decimal(value.toFixed(2));
	}
	const cleaned = String(value).replace(/[$,\s]/g, "");
	if (!cleaned) return new Decimal(0);
	try {
		return new Decimal(cleaned);
	} catch {
		return new Decimal(0);
	}
}
/** Serialize a money value for API responses and form display. */
function moneyToString(value) {
	return toDecimal(value).toDecimalPlaces(2).toFixed(2);
}
function parseMoney(moneyString) {
	return toDecimal(moneyString);
}
function addMoney(amount1, amount2) {
	return toDecimal(amount1).plus(toDecimal(amount2));
}
function subtractMoney(amount1, amount2) {
	return toDecimal(amount1).minus(toDecimal(amount2));
}
function multiplyMoney(amount, multiplier) {
	return toDecimal(amount).times(multiplier).toDecimalPlaces(2);
}
function sumMoney(amounts) {
	return amounts.reduce((total, amount) => total.plus(toDecimal(amount)), new Decimal(0));
}
function calculateSessionCost(hours, hourlyRate) {
	return toDecimal(hourlyRate).times(hours).toDecimalPlaces(2);
}
function calculateHours(startTime, endTime) {
	const startMs = typeof startTime === "number" ? startTime : startTime.getTime();
	const hours = ((typeof endTime === "number" ? endTime : endTime.getTime()) - startMs) / 36e5;
	return Math.round(hours * 100) / 100;
}
function compareMoney(amount1, amount2) {
	return toDecimal(amount1).comparedTo(toDecimal(amount2));
}
function isPositiveMoney(amount) {
	return toDecimal(amount).greaterThan(0);
}
/** Round to cents and return as a serialized string. */
function roundMoney(amount) {
	return moneyToString(amount);
}
var MONEY_FIELD_NAMES = /* @__PURE__ */ new Set([
	"amount",
	"hourlyRate",
	"defaultHourlyRate",
	"amountOwed"
]);
function isDecimalLike(value) {
	return value != null && typeof value === "object" && "toFixed" in value && typeof value.toFixed === "function";
}
/** Recursively convert Prisma Decimal money fields to strings for SolidStart wire format. */
function serializeMoneyDeep(value) {
	if (value == null) return value;
	if (Array.isArray(value)) return value.map((item) => serializeMoneyDeep(item));
	if (value instanceof Date) return value;
	if (isDecimalLike(value)) return moneyToString(value);
	if (typeof value === "object") {
		const result = {};
		for (const [key, nestedValue] of Object.entries(value)) if (MONEY_FIELD_NAMES.has(key) && nestedValue != null) result[key] = moneyToString(nestedValue);
		else result[key] = serializeMoneyDeep(nestedValue);
		return result;
	}
	return value;
}
//#endregion
export { isPositiveMoney as a, parseMoney as c, subtractMoney as d, sumMoney as f, compareMoney as i, roundMoney as l, calculateHours as n, moneyToString as o, toDecimal as p, calculateSessionCost as r, multiplyMoney as s, addMoney as t, serializeMoneyDeep as u };
