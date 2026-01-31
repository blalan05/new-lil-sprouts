/**
 * Client-side timezone utilities
 * These functions only work in the browser (client-side)
 */

/**
 * Gets the user's timezone offset in minutes
 * Returns negative for timezones behind UTC (e.g., -360 for UTC-6)
 * Returns positive for timezones ahead of UTC (e.g., 480 for UTC+8)
 */
export function getTimezoneOffsetMinutes(): number {
  if (typeof window === "undefined") {
    // Server-side: return 0 (will need to be provided from client)
    return 0;
  }
  return new Date().getTimezoneOffset() * -1; // Invert because getTimezoneOffset returns opposite sign
}

/**
 * Gets the user's timezone offset in hours
 */
export function getTimezoneOffsetHours(): number {
  return getTimezoneOffsetMinutes() / 60;
}
