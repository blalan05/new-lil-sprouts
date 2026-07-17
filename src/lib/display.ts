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
