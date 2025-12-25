import { useSubmission, A } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { createUnavailability } from "~/lib/unavailability";

export default function NewUnavailability() {
  const submission = useSubmission(createUnavailability);
  const [allDay, setAllDay] = createSignal(true);

  // Get today's date in YYYY-MM-DD format for default
  const today = new Date().toISOString().split("T")[0];

  return (
    <main
      style={{
        "max-width": "800px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <header style={{ "margin-bottom": "2rem" }}>
        <A
          href="/schedule"
          style={{
            color: "#4299e1",
            "text-decoration": "none",
            "margin-bottom": "0.5rem",
            display: "inline-block",
          }}
        >
          ← Back to Schedule
        </A>
        <h1 style={{ color: "#2d3748", "font-size": "2rem" }}>Block Out Time</h1>
        <p style={{ color: "#718096", margin: "0.5rem 0 0 0" }}>
          Mark days or times when you're unavailable for care sessions
        </p>
      </header>

      <form
        action={createUnavailability}
        method="post"
        style={{
          "background-color": "#fff",
          padding: "2rem",
          "border-radius": "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <fieldset
          style={{
            border: "1px solid #e2e8f0",
            "border-radius": "4px",
            padding: "1.5rem",
            "margin-bottom": "1.5rem",
          }}
        >
          <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
            Time Period
          </legend>

          <div style={{ "margin-bottom": "1.5rem" }}>
            <label
              style={{
                display: "flex",
                "align-items": "center",
                gap: "0.75rem",
                cursor: "pointer",
                padding: "0.75rem",
                border: "1px solid #e2e8f0",
                "border-radius": "4px",
                "background-color": "#f7fafc",
              }}
            >
              <input
                type="checkbox"
                name="allDay"
                value="true"
                checked={allDay()}
                onChange={(e) => setAllDay(e.currentTarget.checked)}
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  cursor: "pointer",
                }}
              />
              <div>
                <div style={{ "font-weight": "600", color: "#2d3748" }}>All Day Unavailability</div>
                <div style={{ "font-size": "0.875rem", color: "#718096" }}>
                  Entire day(s) are blocked out
                </div>
              </div>
            </label>
          </div>

          <div
            style={{
              display: "grid",
              "grid-template-columns": "1fr 1fr",
              gap: "1rem",
              "margin-bottom": allDay() ? "0" : "1rem",
            }}
          >
            <div>
              <label
                for="startDate"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "600",
                  color: "#2d3748",
                }}
              >
                Start Date *
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                value={today}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "1rem",
                }}
              />
            </div>
            <div>
              <label
                for="endDate"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "600",
                  color: "#2d3748",
                }}
              >
                End Date *
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                required
                value={today}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "1rem",
                }}
              />
            </div>
          </div>

          <Show when={!allDay()}>
            <div
              style={{
                display: "grid",
                "grid-template-columns": "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  for="startTime"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  Start Time *
                </label>
                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  required={!allDay()}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                  }}
                />
              </div>
              <div>
                <label
                  for="endTime"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  End Time *
                </label>
                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  required={!allDay()}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                  }}
                />
              </div>
            </div>
            <p style={{ "margin-top": "0.5rem", "font-size": "0.875rem", color: "#718096" }}>
              Only block specific hours within these dates
            </p>
          </Show>
        </fieldset>

        <div style={{ "margin-bottom": "1.5rem" }}>
          <label
            for="reason"
            style={{
              display: "block",
              "margin-bottom": "0.5rem",
              "font-weight": "600",
              color: "#2d3748",
            }}
          >
            Reason
          </label>
          <input
            id="reason"
            name="reason"
            type="text"
            placeholder="e.g., Vacation, Holiday, Personal"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #cbd5e0",
              "border-radius": "4px",
              "font-size": "1rem",
            }}
          />
          <p style={{ "margin-top": "0.5rem", "font-size": "0.875rem", color: "#718096" }}>
            Optional: Add a reason for your records
          </p>
        </div>

        <div style={{ "margin-bottom": "1.5rem" }}>
          <label
            for="notes"
            style={{
              display: "block",
              "margin-bottom": "0.5rem",
              "font-weight": "600",
              color: "#2d3748",
            }}
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Any additional details..."
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #cbd5e0",
              "border-radius": "4px",
              "font-size": "1rem",
              "font-family": "inherit",
            }}
          />
        </div>

        <div
          style={{
            padding: "1rem",
            "background-color": "#fffbeb",
            border: "1px solid #fcd34d",
            "border-radius": "4px",
            "margin-bottom": "1.5rem",
          }}
        >
          <p style={{ margin: 0, color: "#92400e", "font-size": "0.875rem" }}>
            <strong>⚠️ Note:</strong> Blocking time will prevent new sessions from being scheduled
            during this period. Existing sessions will not be automatically cancelled.
          </p>
        </div>

        <Show when={submission.result}>
          <div
            style={{
              padding: "1rem",
              "background-color": "#fff5f5",
              border: "1px solid #feb2b2",
              "border-radius": "4px",
              color: "#c53030",
              "margin-bottom": "1rem",
            }}
          >
            {submission.result!.message}
          </div>
        </Show>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            "justify-content": "flex-end",
          }}
        >
          <A
            href="/schedule"
            style={{
              padding: "0.75rem 1.5rem",
              "background-color": "#edf2f7",
              color: "#2d3748",
              border: "1px solid #cbd5e0",
              "border-radius": "4px",
              "text-decoration": "none",
              "font-weight": "600",
            }}
          >
            Cancel
          </A>
          <button
            type="submit"
            disabled={submission.pending}
            style={{
              padding: "0.75rem 1.5rem",
              "background-color": "#e53e3e",
              color: "white",
              border: "none",
              "border-radius": "4px",
              cursor: submission.pending ? "not-allowed" : "pointer",
              opacity: submission.pending ? "0.6" : "1",
              "font-weight": "600",
            }}
          >
            {submission.pending ? "Blocking..." : "Block Time"}
          </button>
        </div>
      </form>
    </main>
  );
}
