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
  const [formattedTime, setFormattedTime] = createSignal("");
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    // Only format after mount - this ensures we're definitely client-side
    setMounted(true);
    // Format immediately on mount
    if (props.date) {
      // Ensure date is properly parsed as UTC
      const date = ensureDate(props.date);
      setFormattedTime(formatTimeLocal(date));
    }
  });

  createEffect(() => {
    // Only format after mount (client-side only)
    if (mounted() && props.date) {
      // Ensure date is properly parsed as UTC
      const date = ensureDate(props.date);
      setFormattedTime(formatTimeLocal(date));
    }
  });

  // Return empty during SSR, show formatted time on client
  // Use Show to ensure we only render on the client
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
