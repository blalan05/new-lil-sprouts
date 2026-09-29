import { i as formatSessionStatus, r as formatPaymentStatus } from "./display-CkIy29Ue.js";
import { escape, scope, ssr, ssrAttribute, ssrHydrationKey } from "@solidjs/web";
//#region src/components/wa/StatusBadge.tsx
var _tmpl$ = [
	"<wa-badge",
	"",
	" appearance=\"filled-outlined\" pill>",
	"</wa-badge>"
];
function sessionVariant(status) {
	switch (status) {
		case "SCHEDULED": return "brand";
		case "IN_PROGRESS": return "warning";
		case "COMPLETED": return "success";
		case "CANCELLED": return "danger";
		default: return "neutral";
	}
}
function paymentVariant(status) {
	switch (status) {
		case "PAID": return "success";
		case "PENDING": return "warning";
		case "OVERDUE": return "danger";
		case "CANCELLED": return "neutral";
		default: return "neutral";
	}
}
function SessionStatusBadge(props) {
	var _v$ = ssrHydrationKey(), _v$2 = () => {
		return ssrAttribute("variant", escape(sessionVariant(props.status), true));
	}, _v$3 = scope(() => {
		return escape(formatSessionStatus(props.status));
	});
	return ssr(_tmpl$, _v$, _v$2, _v$3);
}
function PaymentStatusBadge(props) {
	var _v$4 = ssrHydrationKey(), _v$5 = () => {
		return ssrAttribute("variant", escape(paymentVariant(props.status), true));
	}, _v$6 = scope(() => {
		return escape(formatPaymentStatus(props.status));
	});
	return ssr(_tmpl$, _v$4, _v$5, _v$6);
}
//#endregion
export { SessionStatusBadge as n, PaymentStatusBadge as t };
