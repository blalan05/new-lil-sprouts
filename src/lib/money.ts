/**
 * Money utility functions for precise currency calculations
 *
 * All money amounts are stored in the database as Float (representing dollars with cents as decimals)
 * but we convert to integers (cents) for calculations to avoid floating-point precision errors.
 *
 * Example:
 *   $10.50 is stored as 10.50 in the database
 *   We convert to 1050 cents for calculations
 *   Then convert back to 10.50 for storage/display
 */

/**
 * Convert dollars to cents (integer representation)
 * @param dollars - Amount in dollars (e.g., 10.50)
 * @returns Amount in cents as integer (e.g., 1050)
 */
export function dollarsToCents(dollars: number): number {
  if (isNaN(dollars) || !isFinite(dollars)) {
    return 0;
  }
  // Round to avoid floating point issues: 10.50 * 100 = 1050
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars (decimal representation)
 * @param cents - Amount in cents as integer (e.g., 1050)
 * @returns Amount in dollars (e.g., 10.50)
 */
export function centsToDollars(cents: number): number {
  if (isNaN(cents) || !isFinite(cents)) {
    return 0;
  }
  return cents / 100;
}

/**
 * Add two money amounts precisely
 * @param amount1 - First amount in dollars
 * @param amount2 - Second amount in dollars
 * @returns Sum in dollars
 */
export function addMoney(amount1: number, amount2: number): number {
  const cents1 = dollarsToCents(amount1);
  const cents2 = dollarsToCents(amount2);
  return centsToDollars(cents1 + cents2);
}

/**
 * Subtract two money amounts precisely
 * @param amount1 - First amount in dollars
 * @param amount2 - Second amount in dollars (to subtract)
 * @returns Difference in dollars
 */
export function subtractMoney(amount1: number, amount2: number): number {
  const cents1 = dollarsToCents(amount1);
  const cents2 = dollarsToCents(amount2);
  return centsToDollars(cents1 - cents2);
}

/**
 * Multiply a money amount by a number precisely
 * @param amount - Amount in dollars
 * @param multiplier - Number to multiply by (can have decimals for partial hours, etc.)
 * @returns Product in dollars
 */
export function multiplyMoney(amount: number, multiplier: number): number {
  const cents = dollarsToCents(amount);
  // Multiply cents by the multiplier, then round to avoid floating point errors
  return centsToDollars(Math.round(cents * multiplier));
}

/**
 * Divide a money amount by a number precisely
 * @param amount - Amount in dollars
 * @param divisor - Number to divide by
 * @returns Quotient in dollars
 */
export function divideMoney(amount: number, divisor: number): number {
  if (divisor === 0) {
    throw new Error("Cannot divide by zero");
  }
  const cents = dollarsToCents(amount);
  // Divide cents and round to nearest cent
  return centsToDollars(Math.round(cents / divisor));
}

/**
 * Sum an array of money amounts precisely
 * @param amounts - Array of amounts in dollars
 * @returns Total in dollars
 */
export function sumMoney(amounts: number[]): number {
  const totalCents = amounts.reduce((sum, amount) => {
    return sum + dollarsToCents(amount);
  }, 0);
  return centsToDollars(totalCents);
}

/**
 * Calculate session cost: hours * hourly rate
 * @param hours - Number of hours (can have decimals)
 * @param hourlyRate - Hourly rate in dollars
 * @returns Total cost in dollars
 */
export function calculateSessionCost(hours: number, hourlyRate: number): number {
  return multiplyMoney(hourlyRate, hours);
}

/**
 * Calculate hours from start and end times
 * @param startTime - Start time as Date or timestamp
 * @param endTime - End time as Date or timestamp
 * @returns Number of hours (with decimal precision to 2 places)
 */
export function calculateHours(startTime: Date | number, endTime: Date | number): number {
  const startMs = typeof startTime === 'number' ? startTime : startTime.getTime();
  const endMs = typeof endTime === 'number' ? endTime : endTime.getTime();
  const hours = (endMs - startMs) / (1000 * 60 * 60);
  // Round to 2 decimal places (e.g., 2.33 hours)
  return Math.round(hours * 100) / 100;
}

/**
 * Format money amount for display
 * @param amount - Amount in dollars
 * @param options - Formatting options
 * @returns Formatted string (e.g., "$10.50")
 */
export function formatMoney(
  amount: number,
  options: {
    includeCurrencySymbol?: boolean;
    decimalPlaces?: number;
  } = {}
): string {
  const { includeCurrencySymbol = true, decimalPlaces = 2 } = options;

  if (isNaN(amount) || !isFinite(amount)) {
    return includeCurrencySymbol ? "$0.00" : "0.00";
  }

  const formatted = amount.toFixed(decimalPlaces);
  return includeCurrencySymbol ? `$${formatted}` : formatted;
}

/**
 * Parse a money string to number
 * @param moneyString - String like "$10.50" or "10.50"
 * @returns Amount in dollars as number
 */
export function parseMoney(moneyString: string): number {
  if (!moneyString || typeof moneyString !== 'string') {
    return 0;
  }

  // Remove currency symbols, commas, and whitespace
  const cleaned = moneyString.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Check if two money amounts are equal (accounting for floating-point precision)
 * @param amount1 - First amount in dollars
 * @param amount2 - Second amount in dollars
 * @returns True if amounts are equal to the cent
 */
export function moneyEquals(amount1: number, amount2: number): boolean {
  return dollarsToCents(amount1) === dollarsToCents(amount2);
}

/**
 * Compare two money amounts
 * @param amount1 - First amount in dollars
 * @param amount2 - Second amount in dollars
 * @returns -1 if amount1 < amount2, 0 if equal, 1 if amount1 > amount2
 */
export function compareMoney(amount1: number, amount2: number): number {
  const cents1 = dollarsToCents(amount1);
  const cents2 = dollarsToCents(amount2);

  if (cents1 < cents2) return -1;
  if (cents1 > cents2) return 1;
  return 0;
}

/**
 * Round money to nearest cent (mainly for display/storage consistency)
 * @param amount - Amount in dollars
 * @returns Rounded amount in dollars
 */
export function roundMoney(amount: number): number {
  return centsToDollars(dollarsToCents(amount));
}
