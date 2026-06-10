/**
 * Money utilities using Prisma Decimal for precise currency math.
 * Serialize amounts as strings at query boundaries (SolidStart wire format).
 */

import { Decimal } from "../generated/prisma-client/internal/prismaNamespace.js";

export type MoneyInput = Decimal | string | number | null | undefined;

export function toDecimal(value: MoneyInput): Decimal {
  if (value == null) {
    return new Decimal(0);
  }
  if (value instanceof Decimal) {
    return value;
  }
  if (typeof value === "number") {
    if (isNaN(value) || !isFinite(value)) {
      return new Decimal(0);
    }
    return new Decimal(value.toFixed(2));
  }

  const cleaned = String(value).replace(/[$,\s]/g, "");
  if (!cleaned) {
    return new Decimal(0);
  }

  try {
    return new Decimal(cleaned);
  } catch {
    return new Decimal(0);
  }
}

/** Serialize a money value for API responses and form display. */
export function moneyToString(value: MoneyInput): string {
  return toDecimal(value).toDecimalPlaces(2).toFixed(2);
}

export function parseMoney(moneyString: string): Decimal {
  return toDecimal(moneyString);
}

export function addMoney(amount1: MoneyInput, amount2: MoneyInput): Decimal {
  return toDecimal(amount1).plus(toDecimal(amount2));
}

export function subtractMoney(amount1: MoneyInput, amount2: MoneyInput): Decimal {
  return toDecimal(amount1).minus(toDecimal(amount2));
}

export function multiplyMoney(amount: MoneyInput, multiplier: number): Decimal {
  return toDecimal(amount).times(multiplier).toDecimalPlaces(2);
}

export function divideMoney(amount: MoneyInput, divisor: number): Decimal {
  if (divisor === 0) {
    throw new Error("Cannot divide by zero");
  }
  return toDecimal(amount).dividedBy(divisor).toDecimalPlaces(2);
}

export function sumMoney(amounts: MoneyInput[]): Decimal {
  return amounts.reduce((total, amount) => total.plus(toDecimal(amount)), new Decimal(0));
}

export function calculateSessionCost(hours: number, hourlyRate: MoneyInput): Decimal {
  return toDecimal(hourlyRate).times(hours).toDecimalPlaces(2);
}

export function calculateHours(startTime: Date | number, endTime: Date | number): number {
  const startMs = typeof startTime === "number" ? startTime : startTime.getTime();
  const endMs = typeof endTime === "number" ? endTime : endTime.getTime();
  const hours = (endMs - startMs) / (1000 * 60 * 60);
  return Math.round(hours * 100) / 100;
}

/** Format money for UI — accepts serialized strings from server queries. */
export function moneyDisplay(value: MoneyInput, decimalPlaces = 2): string {
  return toDecimal(value).toFixed(decimalPlaces);
}

export function formatMoney(
  amount: MoneyInput,
  options: {
    includeCurrencySymbol?: boolean;
    decimalPlaces?: number;
  } = {},
): string {
  const { includeCurrencySymbol = true, decimalPlaces = 2 } = options;
  const formatted = toDecimal(amount).toFixed(decimalPlaces);
  return includeCurrencySymbol ? `$${formatted}` : formatted;
}

export function moneyEquals(amount1: MoneyInput, amount2: MoneyInput): boolean {
  return toDecimal(amount1).equals(toDecimal(amount2));
}

export function compareMoney(amount1: MoneyInput, amount2: MoneyInput): number {
  return toDecimal(amount1).comparedTo(toDecimal(amount2));
}

export function isPositiveMoney(amount: MoneyInput): boolean {
  return toDecimal(amount).greaterThan(0);
}

/** Round to cents and return as a serialized string. */
export function roundMoney(amount: MoneyInput): string {
  return moneyToString(amount);
}

/** Map nullable Decimal fields to strings for client serialization. */
export function serializeOptionalMoney(value: MoneyInput | null | undefined): string | null {
  return value == null ? null : moneyToString(value);
}

const MONEY_FIELD_NAMES = new Set(["amount", "hourlyRate", "defaultHourlyRate", "amountOwed"]);

function isDecimalLike(value: unknown): value is { toFixed: (digits: number) => string } {
  return (
    value != null &&
    typeof value === "object" &&
    "toFixed" in value &&
    typeof (value as { toFixed?: unknown }).toFixed === "function"
  );
}

/** Recursively convert Prisma Decimal money fields to strings for SolidStart wire format. */
export function serializeMoneyDeep<T>(value: T): T {
  if (value == null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeMoneyDeep(item)) as T;
  }

  if (value instanceof Date) {
    return value;
  }

  if (isDecimalLike(value)) {
    return moneyToString(value) as T;
  }

  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      if (MONEY_FIELD_NAMES.has(key) && nestedValue != null) {
        result[key] = moneyToString(nestedValue);
      } else {
        result[key] = serializeMoneyDeep(nestedValue);
      }
    }
    return result as T;
  }

  return value;
}
