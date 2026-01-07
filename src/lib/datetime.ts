/**
 * Utility functions for handling dates and times with proper timezone support
 * 
 * IMPORTANT: PostgreSQL columns are TIMESTAMPTZ (with timezone)
 * - When saving: We convert user's local datetime to UTC Date object
 * - When reading: PostgreSQL returns UTC, we convert to local for display
 */

/**
 * Converts a datetime-local string (from HTML input) to a UTC Date object
 * datetime-local inputs return strings like "2024-01-15T14:30" (no timezone)
 * We interpret this as the user's LOCAL time and return a Date in UTC
 * 
 * Example: User enters "2024-01-15T14:30" in PST (UTC-8)
 *   -> Returns Date object representing "2024-01-15T22:30:00.000Z"
 */
export function datetimeLocalToUTC(datetimeLocal: string): Date {
  if (!datetimeLocal) {
    throw new Error("datetimeLocal string is required");
  }
  
  // datetime-local format: "YYYY-MM-DDTHH:mm"
  // The Date constructor with a string interprets it as LOCAL time when no timezone is specified
  // But we need to be explicit about the conversion
  
  const [datePart, timePart] = datetimeLocal.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  
  // Create a Date object in the user's LOCAL timezone
  // This uses the browser's/server's timezone offset
  const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  
  // JavaScript Date objects are ALWAYS stored internally as UTC milliseconds since epoch
  // When we use new Date(year, month, day, hours, minutes), it:
  // 1. Takes these as LOCAL time values
  // 2. Converts to UTC internally based on the system's timezone
  // 3. When sent to PostgreSQL with TIMESTAMPTZ, it preserves the UTC value
  
  // So this actually IS returning UTC - the Date object's internal representation
  // is UTC milliseconds since epoch
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
  
  const d = typeof date === "string" ? new Date(date) : date;
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
  
  const d = typeof date === "string" ? new Date(date) : date;
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
 */
export function formatTimeLocal(date: Date | string): string {
  if (!date) {
    return "";
  }
  
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
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
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Gets the end of day in UTC for a given local date
 * Useful for date range queries
 */
export function endOfDayUTC(date: Date | string): Date {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}