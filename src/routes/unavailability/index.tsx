import { ensureOwner } from "~/lib/route-guards";
import { createAsync, A } from "@solidjs/router";
import { Show, For } from "solid-js";
import { getUpcomingUnavailabilities } from "~/lib/unavailability";

export const route = {
  preload() {
    ensureOwner();
  },
} satisfies import("@solidjs/router").RouteDefinition;

export default function UnavailabilityList() {
  const unavailabilities = createAsync(() => getUpcomingUnavailabilities());

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <main class="page">
      <header style={{ "margin-bottom": "1rem" }}>
        <div
          style={{
            display: "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "margin-bottom": "1rem",
          }}
        >
          <div>
            <h1 style={{ color: "var(--color-text)", "font-size": "2rem", "margin-bottom": "0.5rem" }}>
              Unavailable Times
            </h1>
            <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
              Manage days and times when care is not available
            </p>
          </div>
          <A
            href="/unavailability/new"
            style={{
              padding: "0.75rem 1.5rem",
              "background-color": "#e53e3e",
              color: "white",
              border: "none",
              "border-radius": "4px",
              "text-decoration": "none",
              "font-weight": "600",
            }}
          >
            + Block Time
          </A>
        </div>
      </header>

      <div
        style={{
          "background-color": "var(--color-surface)",
          "border-radius": "8px",
          border: "1px solid var(--color-border)",
        }}
      >
        <Show
          when={unavailabilities()?.length}
          fallback={
            <div style={{ padding: "3rem", "text-align": "center" }}>
              <p style={{ color: "var(--color-text-muted)", "margin-bottom": "1rem", "font-size": "1.125rem" }}>
                No unavailable times set
              </p>
              <p style={{ color: "#a0aec0", "margin-bottom": "2rem" }}>
                Block out vacation days, holidays, or specific times when you're unavailable
              </p>
              <A
                href="/unavailability/new"
                style={{
                  padding: "0.75rem 1.5rem",
                  "background-color": "#e53e3e",
                  color: "white",
                  border: "none",
                  "border-radius": "4px",
                  "text-decoration": "none",
                  "font-weight": "600",
                  display: "inline-block",
                }}
              >
                Block Your First Time
              </A>
            </div>
          }
        >
          <div style={{ display: "grid", gap: "1px", "background-color": "#e2e8f0" }}>
            <For each={unavailabilities()}>
              {(unavailability) => (
                <div
                  style={{
                    padding: "1.5rem",
                    "background-color": "var(--color-surface)",
                    display: "flex",
                    "justify-content": "space-between",
                    "align-items": "start",
                  }}
                >
                  <div style={{ flex: "1" }}>
                    <div
                      style={{
                        display: "flex",
                        "align-items": "center",
                        gap: "0.75rem",
                        "margin-bottom": "0.5rem",
                      }}
                    >
                      <h3 style={{ color: "var(--color-text)", margin: 0, "font-size": "1.125rem" }}>
                        {unavailability.reason || "Time Off"}
                      </h3>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          "border-radius": "9999px",
                          "background-color": "#fed7d7",
                          color: "#c53030",
                          "font-size": "0.75rem",
                          "font-weight": "600",
                        }}
                      >
                        {unavailability.allDay ? "All Day" : "Specific Hours"}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "2rem", "margin-bottom": "0.5rem" }}>
                      <div>
                        <span style={{ color: "var(--color-text-muted)", "font-size": "0.875rem" }}>From: </span>
                        <span style={{ color: "var(--color-text)", "font-weight": "500" }}>
                          {formatDate(unavailability.startDate)}
                          {!unavailability.allDay &&
                            unavailability.startTime &&
                            ` at ${formatTime(unavailability.startTime)}`}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "var(--color-text-muted)", "font-size": "0.875rem" }}>To: </span>
                        <span style={{ color: "var(--color-text)", "font-weight": "500" }}>
                          {formatDate(unavailability.endDate)}
                          {!unavailability.allDay &&
                            unavailability.endTime &&
                            ` at ${formatTime(unavailability.endTime)}`}
                        </span>
                      </div>
                    </div>

                    <Show when={unavailability.notes}>
                      <p style={{ color: "var(--color-text-muted)", "font-size": "0.875rem", margin: "0.5rem 0 0 0" }}>
                        {unavailability.notes}
                      </p>
                    </Show>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <A
                      href={`/unavailability/${unavailability.id}/edit`}
                      style={{
                        padding: "0.5rem 1rem",
                        "background-color": "#edf2f7",
                        color: "var(--color-text)",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                        "text-decoration": "none",
                        "font-size": "0.875rem",
                      }}
                    >
                      Edit
                    </A>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to delete this unavailability period?`
                          )
                        ) {
                          // TODO: Implement delete
                        }
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        "background-color": "#fff5f5",
                        color: "#c53030",
                        border: "1px solid #feb2b2",
                        "border-radius": "4px",
                        cursor: "pointer",
                        "font-size": "0.875rem",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </main>
  );
}
