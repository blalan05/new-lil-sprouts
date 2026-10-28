import type { JSX } from "@solidjs/web";
import { Show, createEffect } from "solid-js";


export type DialogProps = {
  open: boolean;
  title: string;
  maxWidth?: string;
  onClose: () => void;
  children: JSX.Element;
  footer?: JSX.Element;
};

export default function Dialog(props: DialogProps) {
  let dialogEl: (HTMLElement & { open: boolean }) | undefined;

  createEffect(
    () => props.open,
    (open) => {
      const el = dialogEl;
      if (!el) return;
      el.open = open;
      if (!open) return;
      const onHide = () => props.onClose();
      el.addEventListener("wa-hide", onHide);
      return () => el.removeEventListener("wa-hide", onHide);
    },
  );

  createEffect(
    () => props.open,
    (open) => {
      if (open) {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "";
        };
      }
      document.body.style.overflow = "";
    },
  );

  return (
    <Show when={props.open}>
      <wa-dialog
        ref={dialogEl}
        open
        label={props.title}
        light-dismiss
        style={{ "--width": props.maxWidth ?? "500px" }}
      >
        {props.children}
        <Show when={props.footer}>
          <div slot="footer">{props.footer}</div>
        </Show>
      </wa-dialog>
    </Show>
  );
}
