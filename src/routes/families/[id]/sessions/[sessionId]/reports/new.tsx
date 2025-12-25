import { useSubmission, A, useParams, createAsync } from "@solidjs/router";
import { Show, For, createSignal } from "solid-js";
import { createSessionReport } from "~/lib/session-reports";
import { getFamily } from "~/lib/families";

export default function NewSessionReport() {
  const params = useParams();
  const family = createAsync(() => getFamily(params.id!));
  const submission = useSubmission(createSessionReport);
  const [reportType, setReportType] = createSignal<string>("GENERAL");

  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const isIncidentType = () => {
    const type = reportType();
    return type === "INCIDENT" || type === "ACCIDENT";
  };

  const getDefaultSeverity = () => {
    const type = reportType();
    switch (type) {
      case "ACCIDENT":
        return "SEVERE";
      case "INCIDENT":
        return "MODERATE";
      case "BEHAVIOR":
        return "MINOR";
      default:
        return "INFO";
    }
  };

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
        <h1 style={{ color: "#2d3748", "font-size": "2rem" }}>Add Session Report</h1>
        <p style={{ color: "#718096", margin: "0.5rem 0 0 0" }}>
          Document an incident, activity, meal, or update during this care session
        </p>
      </header>

      <Show when={family()}>
        {(familyData) => (
          <form
            action={createSessionReport}
            method="post"
            style={{
              "background-color": "#fff",
              padding: "2rem",
              "border-radius": "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <input type="hidden" name="careSessionId" value={params.sessionId} />

            <fieldset
              style={{
                border: "1px solid #e2e8f0",
                "border-radius": "4px",
                padding: "1.5rem",
                "margin-bottom": "1.5rem",
              }}
            >
              <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
                Report Type
              </legend>

              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  for="type"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  What happened? *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={reportType()}
                  onChange={(e) => setReportType(e.currentTarget.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                  }}
                >
                  <option value="GENERAL">General Update</option>
                  <option value="ACTIVITY">Activity/Play</option>
                  <option value="MEAL">Meal/Snack</option>
                  <option value="NAP">Nap/Rest</option>
                  <option value="BEHAVIOR">Behavior Note</option>
                  <option value="MILESTONE">Milestone Achieved</option>
                  <option value="INCIDENT">Minor Incident</option>
                  <option value="ACCIDENT">Accident/Injury</option>
                  <option value="MEDICATION">Medication Given</option>
                </select>
              </div>

              <div>
                <label
                  for="severity"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  Severity *
                </label>
                <select
                  id="severity"
                  name="severity"
                  required
                  value={getDefaultSeverity()}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                  }}
                >
                  <option value="INFO">Info - FYI only</option>
                  <option value="MINOR">Minor - No action needed</option>
                  <option value="MODERATE">Moderate - May need follow-up</option>
                  <option value="SEVERE">Severe - Requires attention</option>
                </select>
              </div>
            </fieldset>

            <fieldset
              style={{
                border: "1px solid #e2e8f0",
                "border-radius": "4px",
                padding: "1.5rem",
                "margin-bottom": "1.5rem",
              }}
            >
              <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
                Which Child?
              </legend>

              <Show
                when={familyData().children?.length}
                fallback={
                  <p style={{ color: "#718096", "text-align": "center", padding: "1rem" }}>
                    No children for this family
                  </p>
                }
              >
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <For each={familyData().children}>
                    {(child: any) => (
                      <label
                        style={{
                          display: "flex",
                          "align-items": "center",
                          gap: "0.75rem",
                          padding: "0.75rem",
                          border: "1px solid #e2e8f0",
                          "border-radius": "4px",
                          cursor: "pointer",
                          "background-color": "#f7fafc",
                        }}
                      >
                        <input
                          type="radio"
                          name="childId"
                          value={child.id}
                          required
                          style={{
                            width: "1.25rem",
                            height: "1.25rem",
                            cursor: "pointer",
                          }}
                        />
                        <div style={{ flex: "1" }}>
                          <div style={{ "font-weight": "600", color: "#2d3748" }}>
                            {child.firstName} {child.lastName}
                          </div>
                          <Show when={child.allergies}>
                            <div style={{ "font-size": "0.75rem", color: "#c53030" }}>
                              ⚠️ Allergies: {child.allergies}
                            </div>
                          </Show>
                        </div>
                      </label>
                    )}
                  </For>
                </div>
              </Show>
            </fieldset>

            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                for="timestamp"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "600",
                  color: "#2d3748",
                }}
              >
                When did this happen? *
              </label>
              <div
                style={{
                  display: "grid",
                  "grid-template-columns": "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <input
                  type="date"
                  name="timestampDate"
                  required
                  value={currentDate}
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                  }}
                />
                <input
                  type="time"
                  name="timestampTime"
                  required
                  value={currentTime}
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                  }}
                />
              </div>
              <input type="hidden" name="timestamp" value={`${currentDate}T${currentTime}`} />
            </div>

            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                for="title"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "600",
                  color: "#2d3748",
                }}
              >
                Brief Summary *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder={
                  reportType() === "MEAL"
                    ? "e.g., Lunch - ate most of meal"
                    : reportType() === "NAP"
                      ? "e.g., Afternoon nap - 1.5 hours"
                      : reportType() === "INCIDENT"
                        ? "e.g., Minor bump on playground"
                        : "Brief description..."
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "1rem",
                }}
              />
            </div>

            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                for="description"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "600",
                  color: "#2d3748",
                }}
              >
                Details *
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                placeholder={
                  reportType() === "MEAL"
                    ? "What did they eat? How much? Any issues?"
                    : reportType() === "NAP"
                      ? "How long did they sleep? Any difficulty falling asleep?"
                      : reportType() === "INCIDENT"
                        ? "What happened? Where? How did the child react?"
                        : "Provide detailed information about what happened..."
                }
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

            <Show when={isIncidentType()}>
              <div style={{ "margin-bottom": "1.5rem" }}>
                <label
                  for="actionTaken"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  Action Taken
                </label>
                <textarea
                  id="actionTaken"
                  name="actionTaken"
                  rows={3}
                  placeholder="What did you do in response? First aid applied? Comfort given?"
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
            </Show>

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
                  "background-color": "#fffbeb",
                }}
              >
                <input
                  type="checkbox"
                  name="followUpNeeded"
                  value="true"
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    cursor: "pointer",
                  }}
                />
                <div>
                  <div style={{ "font-weight": "600", color: "#2d3748" }}>Follow-up Needed</div>
                  <div style={{ "font-size": "0.875rem", color: "#78350f" }}>
                    Check this if parents need to take action or be contacted
                  </div>
                </div>
              </label>
            </div>

            <Show when={isIncidentType()}>
              <div
                style={{
                  padding: "1rem",
                  "background-color": "#fff5f5",
                  border: "1px solid #feb2b2",
                  "border-radius": "4px",
                  "margin-bottom": "1.5rem",
                }}
              >
                <p style={{ margin: 0, color: "#c53030", "font-size": "0.875rem" }}>
                  <strong>⚠️ Important:</strong> Parents will be notified of this{" "}
                  {reportType().toLowerCase()}. Make sure to include all relevant details.
                </p>
              </div>
            </Show>

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
                href={`/families/${params.id}/sessions/${params.sessionId}`}
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
                  "background-color": "#4299e1",
                  color: "white",
                  border: "none",
                  "border-radius": "4px",
                  cursor: submission.pending ? "not-allowed" : "pointer",
                  opacity: submission.pending ? "0.6" : "1",
                  "font-weight": "600",
                }}
              >
                {submission.pending ? "Saving..." : "Save Report"}
              </button>
            </div>
          </form>
        )}
      </Show>
    </main>
  );
}
