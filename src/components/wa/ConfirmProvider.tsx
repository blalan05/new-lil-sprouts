import { JSX, createContext, createSignal, useContext } from "solid-js";
import ConfirmDialog from "./ConfirmDialog";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "neutral" | "brand" | "success" | "warning" | "danger";
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue>();

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return ctx;
}

export function ConfirmProvider(props: { children: JSX.Element }) {
  const [open, setOpen] = createSignal(false);
  const [options, setOptions] = createSignal<ConfirmOptions>({ message: "" });
  let resolvePromise: ((value: boolean) => void) | null = null;

  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });
  };

  const close = (result: boolean) => {
    setOpen(false);
    resolvePromise?.(result);
    resolvePromise = null;
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {props.children}
      <ConfirmDialog
        open={open()}
        title={options().title ?? "Confirm"}
        message={options().message}
        confirmLabel={options().confirmLabel}
        cancelLabel={options().cancelLabel}
        variant={options().variant}
        onConfirm={() => close(true)}
        onCancel={() => close(false)}
      />
    </ConfirmContext.Provider>
  );
}
