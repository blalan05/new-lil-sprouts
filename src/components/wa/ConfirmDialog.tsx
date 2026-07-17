import Dialog from "./Dialog";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "neutral" | "brand" | "success" | "warning" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <Dialog
      open={props.open}
      title={props.title}
      maxWidth="420px"
      onClose={props.onCancel}
      footer={
        <div class="wa-cluster wa-gap-s">
          <wa-button appearance="outlined" onClick={props.onCancel}>
            {props.cancelLabel ?? "Cancel"}
          </wa-button>
          <wa-button variant={props.variant ?? "danger"} onClick={() => props.onConfirm()}>
            {props.confirmLabel ?? "Confirm"}
          </wa-button>
        </div>
      }
    >
      <p>{props.message}</p>
    </Dialog>
  );
}
