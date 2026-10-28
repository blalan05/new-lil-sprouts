export function formatSessionStatus(status: string): string {
  switch (status) {
    case "SCHEDULED":
      return "Scheduled";
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

export function formatPaymentStatus(status: string): string {
  switch (status) {
    case "PAID":
      return "Paid";
    case "PENDING":
      return "Pending";
    case "OVERDUE":
      return "Overdue";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

export function formatReportType(type: string): string {
  switch (type) {
    case "INCIDENT":
      return "Incident";
    case "ACCIDENT":
      return "Accident";
    case "BEHAVIOR":
      return "Behavior";
    case "MEAL":
      return "Meal";
    case "NAP":
      return "Nap";
    case "ACTIVITY":
      return "Activity";
    case "MEDICATION":
      return "Medication";
    case "MILESTONE":
      return "Milestone";
    case "GENERAL":
      return "General";
    default:
      return type;
  }
}

export function formatReportSeverity(severity: string): string {
  switch (severity) {
    case "INFO":
      return "Info";
    case "MINOR":
      return "Minor";
    case "MODERATE":
      return "Moderate";
    case "SEVERE":
      return "Severe";
    default:
      return severity;
  }
}

export function formatCaregiverName(user: {
  firstName?: string | null;
  lastName?: string | null;
  username?: string;
}): string {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.username || "Caregiver";
}

export function allergyLabel(allergies: string | null | undefined): string {
  if (!allergies) return "";
  return `Allergy: ${allergies}`;
}
