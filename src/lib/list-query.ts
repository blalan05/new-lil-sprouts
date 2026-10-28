import { formatPaymentStatus, formatReportSeverity, formatReportType, formatSessionStatus } from "~/lib/display";
import { moneyDisplay, type MoneyDisplayInput } from "~/lib/money-display";

export type SortDir = "asc" | "desc";

export type ChipOption = { value: string; label: string };

export const SESSION_STATUS_OPTIONS: ChipOption[] = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const SESSION_STATUS_ORDER = SESSION_STATUS_OPTIONS.map((option) => option.value);

export const EXPENSE_CATEGORY_OPTIONS: ChipOption[] = [
  { value: "FOOD", label: "Food" },
  { value: "ACTIVITY", label: "Activity" },
  { value: "SUPPLIES", label: "Supplies" },
  { value: "TRANSPORTATION", label: "Transportation" },
  { value: "BUSINESS", label: "Business" },
  { value: "OTHER", label: "Other" },
];

export const REPORT_TYPE_OPTIONS: ChipOption[] = [
  { value: "INCIDENT", label: "Incident" },
  { value: "ACCIDENT", label: "Accident" },
  { value: "BEHAVIOR", label: "Behavior" },
  { value: "MEAL", label: "Meal" },
  { value: "NAP", label: "Nap" },
  { value: "ACTIVITY", label: "Activity" },
  { value: "MEDICATION", label: "Medication" },
  { value: "MILESTONE", label: "Milestone" },
  { value: "GENERAL", label: "General" },
];

export const REPORT_SEVERITY_OPTIONS: ChipOption[] = [
  { value: "INFO", label: "Info" },
  { value: "MINOR", label: "Minor" },
  { value: "MODERATE", label: "Moderate" },
  { value: "SEVERE", label: "Severe" },
];

export function optionLabel(options: readonly ChipOption[], value: string | null | undefined): string {
  if (!value) return "";
  return options.find((option) => option.value === value)?.label ?? value;
}

export function moneyNumber(value: MoneyDisplayInput): number {
  return Number(moneyDisplay(value));
}

/** Match a search box against raw values and human labels ("in progress", "In Progress"). */
export function matchesQuery(query: string, parts: Array<string | null | undefined>): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return parts.some((part) => {
    if (!part) return false;
    const raw = part.toLowerCase();
    const spaced = raw.replace(/_/g, " ");
    return raw.includes(q) || spaced.includes(q);
  });
}

export function compareSort(a: string | number, b: string | number, dir: SortDir): number {
  if (a < b) return dir === "asc" ? -1 : 1;
  if (a > b) return dir === "asc" ? 1 : -1;
  return 0;
}

export function compareStatus(a: string, b: string, dir: SortDir, order: readonly string[]): number {
  const ai = order.indexOf(a);
  const bi = order.indexOf(b);
  return compareSort(ai < 0 ? order.length : ai, bi < 0 ? order.length : bi, dir);
}

export function inDateRange(value: string | Date | null | undefined, from: string, to: string): boolean {
  if (!from && !to) return true;
  if (!value) return false;
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return false;
  if (from) {
    const start = new Date(`${from}T00:00:00`).getTime();
    if (time < start) return false;
  }
  if (to) {
    const end = new Date(`${to}T23:59:59.999`).getTime();
    if (time > end) return false;
  }
  return true;
}

export function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateParam(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

export function sessionSearchParts(session: {
  status?: string | null;
  notes?: string | null;
  scheduledStart?: string | Date | null;
  family?: { familyName?: string | null } | null;
  service?: { name?: string | null; code?: string | null } | null;
  children?: Array<{ firstName?: string | null; lastName?: string | null }> | null;
}): string[] {
  const childParts = (session.children ?? []).flatMap((child) => [
    child.firstName,
    child.lastName,
    `${child.firstName ?? ""} ${child.lastName ?? ""}`.trim(),
  ]);
  const when = session.scheduledStart ? new Date(session.scheduledStart).toLocaleDateString("en-US") : "";
  return [
    session.family?.familyName,
    session.service?.name,
    session.service?.code,
    session.status,
    session.status ? formatSessionStatus(session.status) : "",
    session.notes,
    when,
    ...childParts,
  ].filter((part): part is string => !!part);
}

export function paymentSearchParts(payment: {
  status?: string | null;
  method?: string | null;
  notes?: string | null;
  invoiceNumber?: string | null;
  family?: { familyName?: string | null } | null;
}): string[] {
  return [
    payment.family?.familyName,
    payment.invoiceNumber,
    payment.method,
    payment.notes,
    payment.status,
    payment.status ? formatPaymentStatus(payment.status) : "",
  ].filter((part): part is string => !!part);
}

export function reportSearchParts(report: {
  type?: string | null;
  severity?: string | null;
  title?: string | null;
  description?: string | null;
  child?: { firstName?: string | null; lastName?: string | null } | null;
  careSession?: { family?: { familyName?: string | null } | null } | null;
}): string[] {
  return [
    report.title,
    report.description,
    report.type,
    report.type ? formatReportType(report.type) : "",
    report.severity,
    report.severity ? formatReportSeverity(report.severity) : "",
    report.child?.firstName,
    report.child?.lastName,
    report.careSession?.family?.familyName,
  ].filter((part): part is string => !!part);
}
