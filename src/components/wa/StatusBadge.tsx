import { formatPaymentStatus, formatSessionStatus } from "~/lib/display";

type BadgeVariant = "brand" | "neutral" | "success" | "warning" | "danger";

function sessionVariant(status: string): BadgeVariant {
  switch (status) {
    case "SCHEDULED":
      return "brand";
    case "IN_PROGRESS":
      return "warning";
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "danger";
    default:
      return "neutral";
  }
}

function paymentVariant(status: string): BadgeVariant {
  switch (status) {
    case "PAID":
      return "success";
    case "PENDING":
      return "warning";
    case "OVERDUE":
      return "danger";
    case "CANCELLED":
      return "neutral";
    default:
      return "neutral";
  }
}

export function SessionStatusBadge(props: { status: string }) {
  return (
    <wa-badge variant={sessionVariant(props.status)} appearance="filled-outlined" pill>
      {formatSessionStatus(props.status)}
    </wa-badge>
  );
}

export function PaymentStatusBadge(props: { status: string }) {
  return (
    <wa-badge variant={paymentVariant(props.status)} appearance="filled-outlined" pill>
      {formatPaymentStatus(props.status)}
    </wa-badge>
  );
}
