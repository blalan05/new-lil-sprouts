/** Client-safe money formatting (no Prisma/Node deps). */

export type MoneyDisplayInput = string | number | null | undefined;

function toNumber(value: MoneyDisplayInput): number {
  if (value == null) return 0;
  if (typeof value === "number") {
    return isNaN(value) || !isFinite(value) ? 0 : value;
  }
  if (typeof value === "object" && value !== null && "toFixed" in value) {
    const parsed = Number(String(value));
    return isNaN(parsed) ? 0 : parsed;
  }
  const cleaned = String(value).replace(/[$,\s]/g, "");
  if (!cleaned) return 0;
  const parsed = Number(cleaned);
  return isNaN(parsed) ? 0 : parsed;
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
