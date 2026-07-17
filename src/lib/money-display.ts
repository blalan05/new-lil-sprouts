/** Client-safe money formatting (no Prisma/Node deps). */

export type MoneyDisplayInput = string | number | null | undefined | { toString(): string };

function toNumber(value: MoneyDisplayInput): number {
  if (value == null) return 0;
  if (typeof value === "number") {
    return isNaN(value) || !isFinite(value) ? 0 : value;
  }
  // Prisma Decimal / Decimal-like objects (or serialized strings)
  const cleaned = String(value).replace(/[$,\s]/g, "");
  if (!cleaned) return 0;
  const parsed = Number(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/** Format hours that may arrive as number or string over the wire. */
export function hoursDisplay(value: MoneyDisplayInput, decimalPlaces = 1): string {
  return toNumber(value).toFixed(decimalPlaces);
}

/** Format serialized money strings or numbers for UI display. */
export function moneyDisplay(value: MoneyDisplayInput, decimalPlaces = 2): string {
  return toNumber(value).toFixed(decimalPlaces);
}

export function formatMoneyDisplay(
  amount: MoneyDisplayInput,
  options: { includeCurrencySymbol?: boolean; decimalPlaces?: number } = {},
): string {
  const { includeCurrencySymbol = true, decimalPlaces = 2 } = options;
  const formatted = moneyDisplay(amount, decimalPlaces);
  return includeCurrencySymbol ? `$${formatted}` : formatted;
}
