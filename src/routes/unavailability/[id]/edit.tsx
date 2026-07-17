import { createAsync, useSubmission, useParams, type RouteDefinition } from "@solidjs/router";
import { Show, createSignal, createEffect } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { getUnavailability, updateUnavailability } from "~/lib/unavailability";

export const route = {
  preload({ params }) {
    return getUnavailability(params.id);
  },
} satisfies RouteDefinition;

function toDateInput(value: string | Date) {
  return new Date(value).toISOString().split("T")[0];
}

export default function EditUnavailability() {
  const params = useParams();
  const unavailability = createAsync(() => getUnavailability(params.id));
  const submission = useSubmission(updateUnavailability);
  const [allDay, setAllDay] = createSignal(true);

  createEffect(() => {
    const item = unavailability();
    if (item) setAllDay(item.allDay);
  });

  return (
    <PageContent>
      <wa-button href="/schedule" appearance="plain" size="small">
        ← Back to Schedule
      </wa-button>
      <PageHeader title="Edit Blocked Time" />

      <Show when={unavailability()} fallback={<p class="wa-color-text-quiet">Loading...</p>}>
        {(item) => (
          <wa-card>
            <form action={updateUnavailability} method="post" class="wa-stack wa-gap-l">
              <input type="hidden" name="id" value={item().id} />

              <fieldset class="wa-stack wa-gap-m" style={{ border: "1px solid var(--wa-color-neutral-90)", "border-radius": "var(--wa-border-radius-m)", padding: "var(--wa-space-m)", margin: 0 }}>
                <legend class="wa-heading-s">Time Period</legend>

                <wa-checkbox
                  name="allDay"
                  value="true"
                  checked={allDay() || undefined}
                  onChange={(e) => setAllDay((e.currentTarget as HTMLInputElement).checked)}
                >
                  All Day Unavailability
                </wa-checkbox>

                <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
                  <wa-input
                    label="Start Date *"
                    name="startDate"
                    type="date"
                    required
                    value={toDateInput(item().startDate)}
                  />
                  <wa-input
                    label="End Date *"
                    name="endDate"
                    type="date"
                    required
                    value={toDateInput(item().endDate)}
                  />
                </div>

                <Show when={!allDay()}>
                  <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
                    <wa-input
                      label="Start Time *"
                      name="startTime"
                      type="time"
                      required={!allDay() || undefined}
                      value={item().startTime || ""}
                    />
                    <wa-input
                      label="End Time *"
                      name="endTime"
                      type="time"
                      required={!allDay() || undefined}
                      value={item().endTime || ""}
                    />
                  </div>
                </Show>
              </fieldset>

              <wa-input label="Reason" name="reason" value={item().reason || ""} />
              <wa-textarea label="Notes" name="notes" rows={4} value={item().notes || ""} />

              <Show when={submission.result instanceof Error}>
                <wa-callout variant="danger">{(submission.result as Error).message}</wa-callout>
              </Show>

              <div class="wa-cluster wa-gap-s" style={{ "justify-content": "flex-end" }}>
                <wa-button href="/schedule" appearance="outlined">
                  Cancel
                </wa-button>
                <wa-button
                  type="submit"
                  variant="danger"
                  appearance="filled"
                  disabled={submission.pending || undefined}
                >
                  {submission.pending ? "Saving..." : "Save Changes"}
                </wa-button>
              </div>
            </form>
          </wa-card>
        )}
      </Show>
    </PageContent>
  );
}
