import { useSubmission } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { createUnavailability } from "~/lib/unavailability";

export default function NewUnavailability() {
  const submission = useSubmission(createUnavailability);
  const [allDay, setAllDay] = createSignal(true);
  const today = new Date().toISOString().split("T")[0];

  return (
    <PageContent>
      <wa-button href="/schedule" appearance="plain" size="small">
        ← Back to Schedule
      </wa-button>
      <PageHeader
        title="Block Out Time"
        description="Mark days or times when you're unavailable for care sessions"
      />

      <wa-card>
        <form action={createUnavailability} method="post" class="wa-stack wa-gap-l">
          <fieldset class="wa-stack wa-gap-m" style={{ border: "1px solid var(--wa-color-neutral-90)", "border-radius": "var(--wa-border-radius-m)", padding: "var(--wa-space-m)", margin: 0 }}>
            <legend class="wa-heading-s">Time Period</legend>

            <wa-checkbox
              name="allDay"
              value="true"
              checked={allDay() || undefined}
              onChange={(e) => setAllDay((e.currentTarget as HTMLInputElement).checked)}
            >
              All Day Unavailability — entire day(s) are blocked out
            </wa-checkbox>

            <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
              <wa-input label="Start Date *" name="startDate" type="date" required value={today} />
              <wa-input label="End Date *" name="endDate" type="date" required value={today} />
            </div>

            <Show when={!allDay()}>
              <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
                <wa-input label="Start Time *" name="startTime" type="time" required={!allDay() || undefined} />
                <wa-input label="End Time *" name="endTime" type="time" required={!allDay() || undefined} />
              </div>
              <p class="wa-body-s wa-color-text-quiet">Only block specific hours within these dates</p>
            </Show>
          </fieldset>

          <wa-input
            label="Reason"
            name="reason"
            placeholder="e.g., Vacation, Holiday, Personal"
            hint="Optional: Add a reason for your records"
          />

          <wa-textarea
            label="Notes"
            name="notes"
            rows={4}
            placeholder="Any additional details..."
          />

          <wa-callout variant="warning">
            <strong>Note:</strong> Blocking time will prevent new sessions from being scheduled during
            this period. Existing sessions will not be automatically cancelled.
          </wa-callout>

          <Show when={submission.result}>
            <wa-callout variant="danger">{submission.result!.message}</wa-callout>
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
              {submission.pending ? "Blocking..." : "Block Time"}
            </wa-button>
          </div>
        </form>
      </wa-card>
    </PageContent>
  );
}
