import { createEffect, createSignal, onSettled, Show } from "solid-js";
import { ensureDate, formatTimeLocal } from "~/lib/datetime";

interface ClientTimeProps {
  date: Date | string;
  class?: string;
  style?: Record<string, string | number>;
}

export default function ClientTime(props: ClientTimeProps) {
  const [formattedTime, setFormattedTime] = createSignal("");
  const [mounted, setMounted] = createSignal(false);

  onSettled(() => {
    setMounted(true);
    if (props.date) {
      const date =
        typeof props.date === "string" ? new Date(props.date) : ensureDate(props.date);

      if (isNaN(date.getTime())) {
        console.error("[ClientTime] Invalid date:", props.date);
        setFormattedTime("");
        return;
      }

      setFormattedTime(formatTimeLocal(date));
    }
  });

  createEffect(
    () => [mounted(), props.date] as const,
    ([isMounted, dateValue]) => {
      if (!isMounted || !dateValue) return;
      const date =
        typeof dateValue === "string" ? new Date(dateValue) : ensureDate(dateValue);

      if (!isNaN(date.getTime())) {
        setFormattedTime(formatTimeLocal(date));
      }
    },
  );

  return (
    <Show
      when={mounted()}
      fallback={<span class={props.class} style={props.style}>{"\u00A0"}</span>}
    >
      <span class={props.class} style={props.style}>
        {formattedTime()}
      </span>
    </Show>
  );
}
