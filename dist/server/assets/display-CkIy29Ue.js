//#region src/lib/display.ts
function formatSessionStatus(status) {
	switch (status) {
		case "SCHEDULED": return "Scheduled";
		case "IN_PROGRESS": return "In Progress";
		case "COMPLETED": return "Completed";
		case "CANCELLED": return "Cancelled";
		default: return status;
	}
}
function formatPaymentStatus(status) {
	switch (status) {
		case "PAID": return "Paid";
		case "PENDING": return "Pending";
		case "OVERDUE": return "Overdue";
		case "CANCELLED": return "Cancelled";
		default: return status;
	}
}
function formatCaregiverName(user) {
	return [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.username || "Caregiver";
}
function allergyLabel(allergies) {
	if (!allergies) return "";
	return `Allergy: ${allergies}`;
}
//#endregion
export { formatSessionStatus as i, formatCaregiverName as n, formatPaymentStatus as r, allergyLabel as t };
