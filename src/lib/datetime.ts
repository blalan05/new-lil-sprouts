/**
 * Utility functions for handling dates and times with proper timezone support
 */

/**
 * Converts a datetime-local string (from HTML input) to a Date object in UTC
 * datetime-local inputs return strings like "2024-01-15T14:30" (no timezone)
 * We need to interpret this as the user's local time and convert to UTC for storage
 */
export function datetimeLocalToUTC(datetimeLocal: string): Date {
  if (!datetimeLocal) {
    throw new Error("datetimeLocal string is required");
  }
  
  // datetime-local format: "YYYY-MM-DDTHH:mm"
  // Parse it as local time and convert to UTC
  const [datePart, timePart] = datetimeLocal.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  
  // Create date in local timezone
  const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  
  // Return as-is (JavaScript Date objects are stored internally as UTC)
  // When sent to PostgreSQL, Prisma will handle the conversion correctly
  return localDate;
}

/**
 * Converts a UTC Date from the database to a datetime-local string for HTML inputs
 * This ensures the displayed time matches what the user expects in their local timezone
 */
export function utcToDatetimeLocal(utcDate: Date | string): string {
  if (!utcDate) {
    return "";
  }
  
  const date = typeof utcDate === "string" ? new Date(utcDate) : utcDate;
  
  // Get local date components
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

