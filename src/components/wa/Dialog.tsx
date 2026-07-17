import { JSX, Show, createEffect, onCleanup } from "solid-js";

export type DialogProps = {
  open: boolean;
  title: string;
  maxWidth?: string;
  onClose: () => void;
  children: JSX.Element;
  footer?: JSX.Element;
};

export default function Dialog(props: DialogProps) {
  let dialogEl: HTMLElement & { open: boolean } | undefined;

  createEffect(() => {
    if (dialogEl) {
      dialogEl.open = props.open;
    }
  });

  createEffect(() => {
    if (props.open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  onCleanup(() => {
    document.body.style.overflow = "";
  });

  const handleHide = () => {
    props.onClose();
  };

  return (
    <Show when={props.open}>
      <wa-dialog
        ref={dialogEl}
        open
        label={props.title}
        light-dismiss
        style={{ "--width": props.maxWidth ?? "500px" }}
        on:wa-hide={handleHide}
      >
        {props.children}
        <Show when={props.footer}>
          <div slot="footer">{props.footer}</div>
        </Show>
      </wa-dialog>
    </Show>
  );
}
