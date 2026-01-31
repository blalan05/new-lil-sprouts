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
      // Parse the date - if it's a string (ISO format), new Date() will parse it as UTC
      // If it's already a Date object, use it directly
      const date = typeof props.date === "string" 
        ? new Date(props.date)  // ISO strings like "2026-01-05T06:35:00.000Z" parse as UTC
        : ensureDate(props.date);
      
      // Verify the date was parsed correctly
      if (isNaN(date.getTime())) {
        console.error("[ClientTime] Invalid date:", props.date);
        setFormattedTime("");
        return;
      }
      
      // Format using the browser's local timezone
      setFormattedTime(formatTimeLocal(date));
    }
  });

  createEffect(() => {
    // Only format after mount (client-side only)
    if (mounted() && props.date) {
      const date = typeof props.date === "string" 
        ? new Date(props.date)
        : ensureDate(props.date);
      
      if (!isNaN(date.getTime())) {
        setFormattedTime(formatTimeLocal(date));
      }
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
