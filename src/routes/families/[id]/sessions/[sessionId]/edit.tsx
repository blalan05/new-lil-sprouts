import { createAsync, type RouteDefinition, A, useParams, useSubmission } from "@solidjs/router";
import { Show, For } from "solid-js";
import { getCareSession } from "~/lib/schedule";
import { editCareSessionFull } from "~/lib/schedule";
import { getChildren } from "~/lib/children";
import { utcToDatetimeLocal } from "~/lib/datetime";

export const route = {
  preload({ params }) {
    if (params.id && params.sessionId) {
      getCareSession(params.sessionId);
      getChildren(params.id);
    }
  },
} satisfies RouteDefinition;

export default function EditCareSession() {
  const params = useParams();
  const session = createAsync(() => getCareSession(params.sessionId!));
  const children = createAsync(() => getChildren(params.id!));
  const editSubmission = useSubmission(editCareSessionFull);

  const isChildSelected = (childId: string): boolean => {
    return session()?.children?.some((c) => c.id === childId) || false;
  };

  return (
    <main
      style={{
        "max-width": "800px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <Show
        when={session() && children()}
        fallback={
          <div style={{ "text-align": "center", padding: "3rem" }}>Loading...</div>
        }
      >
        <header style={{ "margin-bottom": "2rem" }}>
          <A
            href={`/families/${params.id}/sessions/${params.sessionId}`}
            style={{
              color: "#4299e1",
              "text-decoration": "none",
              "margin-bottom": "0.5rem",
              display: "inline-block",
            }}
          >
            ← Back to Session
          </A>
          <h1 style={{ color: "#2d3748", "font-size": "2rem", "margin-bottom": "0.5rem" }}>
            Edit Care Session
          </h1>
          <p style={{ color: "#718096", margin: 0 }}>
            Update session details, times, and assigned children
          </p>
        </header>

        <div
          style={{
            "background-color": "#fff",
            padding: "2rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <form action={editCareSessionFull} method="post">
            <input type="hidden" name="sessionId" value={params.sessionId} />
            <input type="hidden" name="timezoneOffset" value={new Date().getTimezoneOffset() * -1} />

            {/* Scheduled Start Time */}
            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                for="scheduledStart"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "500",
                  color: "#2d3748",
                }}
              >
                Scheduled Start Time *
              </label>
              <input
                type="datetime-local"
                id="scheduledStart"
                name="scheduledStart"
                value={session()?.scheduledStart ? utcToDatetimeLocal(session()!.scheduledStart) : ""}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "1rem",
                }}
              />
            </div>

            {/* Scheduled End Time */}
            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                for="scheduledEnd"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "500",
                  color: "#2d3748",
                }}
              >
                Scheduled End Time *
              </label>
              <input
                type="datetime-local"
                id="scheduledEnd"
                name="scheduledEnd"
                value={session()?.scheduledEnd ? utcToDatetimeLocal(session()!.scheduledEnd) : ""}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "1rem",
                }}
              />
            </div>

            {/* Status */}
            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                for="status"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "500",
                  color: "#2d3748",
                }}
              >
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={session()?.status || "SCHEDULED"}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "1rem",
                }}
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Hourly Rate */}
            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                for="hourlyRate"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "500",
                  color: "#2d3748",
                }}
              >
                Hourly Rate (optional)
              </label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={session()?.hourlyRate || ""}
                step="0.01"
                min="0"
                placeholder="Leave empty to use service default"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "1rem",
                }}
              />
            </div>

            {/* Confirmed */}
            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                style={{
                  display: "flex",
                  "align-items": "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="isConfirmed"
                  value="true"
                  checked={session()?.isConfirmed || false}
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    cursor: "pointer",
                  }}
                />
                <span style={{ color: "#2d3748", "font-weight": "500" }}>
                  Session Confirmed
                </span>
              </label>
            </div>

            {/* Children Selection */}
            <Show when={children() && children()!.length > 0}>
              <div style={{ "margin-bottom": "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#2d3748",
                  }}
                >
                  Children (select all that apply)
                </label>
                <div
                  style={{
                    display: "flex",
                    "flex-direction": "column",
                    gap: "0.75rem",
                    padding: "1rem",
                    "background-color": "#f7fafc",
                    "border-radius": "4px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <For each={children()}>
                    {(child) => (
                      <label
                        style={{
                          display: "flex",
                          "align-items": "center",
                          gap: "0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          name={`child_${child.id}`}
                          value={child.id}
                          checked={isChildSelected(child.id)}
                          style={{
                            width: "1.25rem",
                            height: "1.25rem",
                            cursor: "pointer",
                          }}
                        />
                        <span style={{ color: "#2d3748" }}>
                          {child.firstName} {child.lastName}
                        </span>
                      </label>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            {/* Notes */}
            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                for="notes"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "500",
                  color: "#2d3748",
                }}
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Add any notes about this session..."
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "1rem",
                  "font-family": "inherit",
                  resize: "vertical",
                }}
              >
                {session()?.notes || ""}
              </textarea>
            </div>

            {/* Submit Buttons */}
            <div style={{ display: "flex", gap: "1rem", "justify-content": "flex-end" }}>
              <A
                href={`/families/${params.id}/sessions/${params.sessionId}`}
                style={{
                  padding: "0.75rem 1.5rem",
                  "background-color": "#fff",
                  color: "#4a5568",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "text-decoration": "none",
                  display: "inline-block",
                }}
              >
                Cancel
              </A>
              <button
                type="submit"
                disabled={editSubmission.pending}
                style={{
                  padding: "0.75rem 1.5rem",
                  "background-color": "#4299e1",
                  color: "#fff",
                  border: "none",
                  "border-radius": "4px",
                  cursor: editSubmission.pending ? "not-allowed" : "pointer",
                  "font-weight": "600",
                  opacity: editSubmission.pending ? "0.6" : "1",
                }}
              >
                {editSubmission.pending ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <Show when={editSubmission.result instanceof Error}>
              <div
                style={{
                  "margin-top": "1rem",
                  padding: "1rem",
                  "background-color": "#fed7d7",
                  color: "#c53030",
                  "border-radius": "4px",
                }}
              >
                Error: {(editSubmission.result as Error).message}
              </div>
            </Show>
          </form>
        </div>
      </Show>
    </main>
  );
}