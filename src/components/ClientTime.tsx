import { createEffect, createSignal, onMount } from "solid-js";
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
  const [isMounted, setIsMounted] = createSignal(false);
  const [formattedTime, setFormattedTime] = createSignal("");

  onMount(() => {
    // Only format on client after mount
    setIsMounted(true);
    // Format immediately on mount
    if (props.date) {
      setFormattedTime(formatTimeLocal(props.date));
    }
  });

  createEffect(() => {
    if (isMounted() && props.date) {
      setFormattedTime(formatTimeLocal(props.date));
    }
  });

  // Return empty during SSR and initial render
  // Show formatted time after client hydration
  // Use a non-breaking space to maintain layout
  return (
    <span class={props.class} style={props.style}>
      {isMounted() ? formattedTime() : "\u00A0"}
    </span>
  );
}
