import { useSubmission, useParams, createAsync } from "@solidjs/router";
import { Show, For, createSignal } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
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
    <PageContent>
      <wa-button href={`/families/${params.id}/sessions/${params.sessionId}`} appearance="plain" size="small">
        ← Back to Session
      </wa-button>
      <PageHeader
        title="Add Session Report"
        description="Document an incident, activity, meal, or update during this care session"
      />

      <Show when={family()}>
        {(familyData) => (
          <wa-card>
            <form action={createSessionReport} method="post" class="wa-stack wa-gap-l">
              <input type="hidden" name="careSessionId" value={params.sessionId} />

              <fieldset class="wa-stack wa-gap-m" style={{ border: "1px solid var(--wa-color-neutral-90)", "border-radius": "var(--wa-border-radius-m)", padding: "var(--wa-space-m)", margin: 0 }}>
                <legend class="wa-heading-s">Report Type</legend>
                <wa-select
                  label="What happened? *"
                  name="type"
                  required
                  value={reportType()}
                  onChange={(e) => setReportType((e.currentTarget as HTMLSelectElement).value)}
                >
                  <wa-option value="GENERAL">General Update</wa-option>
                  <wa-option value="ACTIVITY">Activity/Play</wa-option>
                  <wa-option value="MEAL">Meal/Snack</wa-option>
                  <wa-option value="NAP">Nap/Rest</wa-option>
                  <wa-option value="BEHAVIOR">Behavior Note</wa-option>
                  <wa-option value="MILESTONE">Milestone Achieved</wa-option>
                  <wa-option value="INCIDENT">Minor Incident</wa-option>
                  <wa-option value="ACCIDENT">Accident/Injury</wa-option>
                  <wa-option value="MEDICATION">Medication Given</wa-option>
                </wa-select>
                <wa-select label="Severity *" name="severity" required value={getDefaultSeverity()}>
                  <wa-option value="INFO">Info - FYI only</wa-option>
                  <wa-option value="MINOR">Minor - No action needed</wa-option>
                  <wa-option value="MODERATE">Moderate - May need follow-up</wa-option>
                  <wa-option value="SEVERE">Severe - Requires attention</wa-option>
                </wa-select>
              </fieldset>

              <fieldset class="wa-stack wa-gap-m" style={{ border: "1px solid var(--wa-color-neutral-90)", "border-radius": "var(--wa-border-radius-m)", padding: "var(--wa-space-m)", margin: 0 }}>
                <legend class="wa-heading-s">Which Child?</legend>
                <Show
                  when={familyData().children?.length}
                  fallback={
                    <p class="wa-color-text-quiet" style={{ "text-align": "center", padding: "var(--wa-space-m)" }}>
                      No children for this family
                    </p>
                  }
                >
                  <div class="wa-stack wa-gap-s">
                    <For each={familyData().children}>
                      {(child: any) => (
                        <label
                          style={{
                            display: "flex",
                            "align-items": "center",
                            gap: "var(--wa-space-s)",
                            padding: "var(--wa-space-s)",
                            border: "1px solid var(--wa-color-neutral-90)",
                            "border-radius": "var(--wa-border-radius-m)",
                            cursor: "pointer",
                          }}
                        >
                          <input type="radio" name="childId" value={child.id} required />
                          <div>
                            <div class="wa-heading-s">
                              {child.firstName} {child.lastName}
                            </div>
                            <Show when={child.allergies}>
                              <div class="wa-body-s" style={{ color: "var(--wa-color-danger-40)" }}>
                                Allergies: {child.allergies}
                              </div>
                            </Show>
                          </div>
                        </label>
                      )}
                    </For>
                  </div>
                </Show>
              </fieldset>

              <div class="wa-stack wa-gap-s">
                <label class="wa-heading-s">When did this happen? *</label>
                <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
                  <wa-input type="date" name="timestampDate" required value={currentDate} />
                  <wa-input type="time" name="timestampTime" required value={currentTime} />
                </div>
                <input type="hidden" name="timestamp" value={`${currentDate}T${currentTime}`} />
              </div>

              <wa-input
                label="Brief Summary *"
                name="title"
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
              />

              <wa-textarea
                label="Details *"
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
              />

              <Show when={isIncidentType()}>
                <wa-textarea
                  label="Action Taken"
                  name="actionTaken"
                  rows={3}
                  placeholder="What did you do in response? First aid applied? Comfort given?"
                />
              </Show>

              <wa-checkbox name="followUpNeeded" value="true">
                Follow-up Needed — check if parents need to take action or be contacted
              </wa-checkbox>

              <Show when={isIncidentType()}>
                <wa-callout variant="danger">
                  <strong>Important:</strong> Parents will be notified of this {reportType().toLowerCase()}.
                  Make sure to include all relevant details.
                </wa-callout>
              </Show>

              <Show when={submission.result}>
                <wa-callout variant="danger">{submission.result!.message}</wa-callout>
              </Show>

              <div class="wa-cluster wa-gap-s" style={{ "justify-content": "flex-end" }}>
                <wa-button href={`/families/${params.id}/sessions/${params.sessionId}`} appearance="outlined">
                  Cancel
                </wa-button>
                <wa-button type="submit" variant="brand" appearance="filled" disabled={submission.pending || undefined}>
                  {submission.pending ? "Saving..." : "Save Report"}
                </wa-button>
              </div>
            </form>
          </wa-card>
        )}
      </Show>
    </PageContent>
  );
}
