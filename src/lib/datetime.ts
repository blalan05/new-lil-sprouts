/**
 * Utility functions for handling dates and times with proper timezone support
 *
 * IMPORTANT: PostgreSQL columns are TIMESTAMPTZ (with timezone)
 * - When saving: We convert user's local datetime to UTC Date object
 * - When reading: PostgreSQL returns UTC, we convert to local for display
 *
 * SSR Note: Time formatting functions use browser APIs that depend on client timezone.
 * Always use ClientOnly wrapper or check for browser environment when rendering times.
 */

/**
 * Safely converts a Date or string to a Date object
 * Handles data from both fresh server responses and cached router data
 *
 * @param date - Can be a Date object or ISO string from database
 * @returns Date object
 */
export function ensureDate(date: Date | string): Date {
  if (!date) {
    throw new Error("date is required");
  }

  // If it's already a Date object, return it
  if (date instanceof Date) {
    return date;
  }

  // If it's a string, parse it as ISO format (UTC)
  // This handles strings from both fresh Prisma responses and router cache
  return new Date(date);
}

/**
 * Converts a datetime-local string (from HTML input) to a UTC Date object
 * datetime-local inputs return strings like "2024-01-15T14:30" (no timezone)
 * We interpret this as the user's LOCAL time and return a Date in UTC
 *
 * IMPORTANT: This function runs on the SERVER, so it uses the SERVER's timezone.
 * To properly convert user's local time, we need the user's timezone offset.
 *
 * @param datetimeLocal - String in format "YYYY-MM-DDTHH:mm"
 * @param userTimezoneOffset - Optional timezone offset in minutes (e.g., -360 for UTC-6)
 *                            If not provided, uses server's timezone (may be incorrect!)
 * @returns Date object in UTC
 *
 * Example: User enters "2024-01-15T14:30" in PST (UTC-8, offset -480 minutes)
 *   -> Returns Date object representing "2024-01-15T22:30:00.000Z"
 */
export function datetimeLocalToUTC(datetimeLocal: string, userTimezoneOffset?: number): Date {
  if (!datetimeLocal) {
    throw new Error("datetimeLocal string is required");
  }

  const [datePart, timePart] = datetimeLocal.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  // If user timezone offset is provided, use it to convert properly
  if (userTimezoneOffset !== undefined) {
    // Create a Date object assuming UTC, then adjust by the offset
    // This ensures we're converting from the user's timezone to UTC correctly
    const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
    // Subtract the offset to convert from user's local time to UTC
    // Offset is in HOURS (e.g., -6 for UTC-6)
    // (offset is negative for timezones behind UTC, so subtracting it adds hours)
    return new Date(utcDate.getTime() - (userTimezoneOffset * 60 * 60 * 1000));
  }

  // Fallback: Use server's timezone (may be incorrect if server and user are in different timezones!)
  // This is the old behavior - kept for backward compatibility
  const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return localDate;
}

/**
 * Converts a UTC Date from the database to a datetime-local string for HTML inputs
 * PostgreSQL TIMESTAMPTZ returns dates in UTC, we convert to local for display
 *
 * Example: Database has "2024-01-15T22:30:00.000Z"
 *   -> User in PST sees "2024-01-15T14:30" in the input field
 */
export function utcToDatetimeLocal(utcDate: Date | string): string {
  if (!utcDate) {
    return "";
  }

  const date = typeof utcDate === "string" ? new Date(utcDate) : utcDate;

  // Get local date components (automatically converts from UTC to local)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Formats a date for display in the user's local timezone
 */
export function formatDateLocal(date: Date | string): string {
  if (!date) {
    return "";
  }

  const d = ensureDate(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a datetime for display in the user's local timezone
 */
export function formatDateTimeLocal(date: Date | string): string {
  if (!date) {
    return "";
  }

  const d = ensureDate(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a time for display in the user's local timezone
 * Note: This uses browser's timezone. On SSR, it will use server's timezone initially,
 * then hydrate to client's timezone. This may cause a visual flash.
 * For critical time displays, consider using ClientOnly component wrapper.
 */
export function formatTimeLocal(date: Date | string): string {
  if (!date) {
    return "";
  }

  const d = ensureDate(date);

  // Always format in local timezone - let browser handle it
  // SSR will show server time briefly, then hydrate to client time
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Get ISO time string for data attributes (timezone-agnostic)
 * Use this in data-time attributes for client-side formatting
 */
export function getISOTime(date: Date | string): string {
  if (!date) {
    return "";
  }

  const d = ensureDate(date);
  return d.toISOString();
}

/**
 * Converts a date string (from form) to UTC Date
 * Handles both date-only and datetime-local formats
 */
export function parseFormDate(dateString: string): Date {
  if (!dateString) {
    throw new Error("dateString is required");
  }

  // If it includes 'T', it's a datetime-local format
  if (dateString.includes("T")) {
    return datetimeLocalToUTC(dateString);
  }

  // Otherwise, it's a date-only format (YYYY-MM-DD)
  // Parse as local date at midnight
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Gets the start of day in UTC for a given local date
 * Useful for date range queries
 */
export function startOfDayUTC(date: Date | string): Date {
  const d = new Date(ensureDate(date));
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Gets the end of day in UTC for a given local date
 * Useful for date range queries
 */
export function endOfDayUTC(date: Date | string): Date {
  const d = new Date(ensureDate(date));
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Compares two dates to see if they're on the same calendar day
 * Uses local date components to avoid timezone issues
 * 
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns true if both dates are on the same calendar day in local timezone
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = ensureDate(date1);
  const d2 = ensureDate(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
