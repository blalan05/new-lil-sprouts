import { createEffect, createSignal, onMount, Show } from "solid-js";
import { ensureDate, formatTimeLocal } from "~/lib/datetime";

/**
 * ClientTime component - Renders time only on the client to avoid SSR timezone issues
 *
 * This component prevents the timezone mismatch that occurs when:
 * 1. Server renders the page using server's timezone
 * 2. Client hydrates using user's timezone
 * 3. Visual flash occurs as time changes
 *
 * By only rendering on the client, we ensure consistent timezone display.
 */

interface ClientTimeProps {
  date: Date | string;
  class?: string;
  style?: Record<string, string | number>;
}

export default function ClientTime(props: ClientTimeProps) {
  const [isClient, setIsClient] = createSignal(typeof window !== "undefined");
  const [formattedTime, setFormattedTime] = createSignal("");

  onMount(() => {
    // Ensure we're marked as client-side after mount
    setIsClient(true);
    // Format immediately on mount
    if (props.date) {
      setFormattedTime(formatTimeLocal(props.date));
    }
  });

  createEffect(() => {
    // Only format on client-side
    if (isClient() && props.date) {
      setFormattedTime(formatTimeLocal(props.date));
    }
  });

  // Return empty during SSR, show formatted time on client
  // Use Show to ensure we only render on client-side
  return (
    <Show
      when={isClient()}
      fallback={<span class={props.class} style={props.style}>{"\u00A0"}</span>}
    >
      <span class={props.class} style={props.style}>
        {formattedTime()}
      </span>
    </Show>
  );
}
