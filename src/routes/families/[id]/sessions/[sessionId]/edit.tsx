import { createAsync, type RouteDefinition, useParams, useSubmission } from "@solidjs/router";
import { Show, For } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
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
    <PageContent>
      <Show
        when={session() && children()}
        fallback={
          <div style={{ "text-align": "center", padding: "var(--wa-space-2xl)" }} class="wa-color-text-quiet">
            Loading...
          </div>
        }
      >
        <wa-button href={`/families/${params.id}/sessions/${params.sessionId}`} appearance="plain" size="small">
          ← Back to Session
        </wa-button>
        <PageHeader
          title="Edit Care Session"
          description="Update session details, times, and assigned children"
        />

        <wa-card>
          <form action={editCareSessionFull} method="post" class="wa-stack wa-gap-m">
            <input type="hidden" name="sessionId" value={params.sessionId} />
            <input type="hidden" name="timezoneOffset" value={new Date().getTimezoneOffset() * -1} />

            <wa-input
              label="Scheduled Start Time *"
              name="scheduledStart"
              type="datetime-local"
              required
              value={session()?.scheduledStart ? utcToDatetimeLocal(session()!.scheduledStart) : ""}
            />
            <wa-input
              label="Scheduled End Time *"
              name="scheduledEnd"
              type="datetime-local"
              required
              value={session()?.scheduledEnd ? utcToDatetimeLocal(session()!.scheduledEnd) : ""}
            />

            <wa-select label="Status *" name="status" required value={session()?.status || "SCHEDULED"}>
              <wa-option value="SCHEDULED">Scheduled</wa-option>
              <wa-option value="IN_PROGRESS">In Progress</wa-option>
              <wa-option value="COMPLETED">Completed</wa-option>
              <wa-option value="CANCELLED">Cancelled</wa-option>
            </wa-select>

            <wa-input
              label="Hourly Rate (optional)"
              name="hourlyRate"
              type="number"
              step="0.01"
              min="0"
              value={session()?.hourlyRate?.toString() || ""}
              placeholder="Leave empty to use service default"
            />

            <wa-checkbox name="isConfirmed" value="true" checked={session()?.isConfirmed || undefined}>
              Session Confirmed
            </wa-checkbox>

            <Show when={children() && children()!.length > 0}>
              <div class="wa-stack wa-gap-s">
                <label class="wa-heading-s">Children (select all that apply)</label>
                <div class="wa-stack wa-gap-s" style={{ padding: "var(--wa-space-m)", "background-color": "var(--wa-color-neutral-95)", "border-radius": "var(--wa-border-radius-m)" }}>
                  <For each={children()}>
                    {(child) => (
                      <wa-checkbox name={`child_${child.id}`} value={child.id} checked={isChildSelected(child.id) || undefined}>
                        {child.firstName} {child.lastName}
                      </wa-checkbox>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            <wa-textarea label="Notes" name="notes" rows={4} value={session()?.notes || ""} placeholder="Add any notes about this session..." />

            <Show when={editSubmission.result instanceof Error}>
              <wa-callout variant="danger">Error: {(editSubmission.result as Error).message}</wa-callout>
            </Show>

            <div class="wa-cluster wa-gap-s" style={{ "justify-content": "flex-end" }}>
              <wa-button href={`/families/${params.id}/sessions/${params.sessionId}`} appearance="outlined">
                Cancel
              </wa-button>
              <wa-button type="submit" variant="brand" appearance="filled" disabled={editSubmission.pending || undefined}>
                {editSubmission.pending ? "Saving..." : "Save Changes"}
              </wa-button>
            </div>
          </form>
        </wa-card>
      </Show>
    </PageContent>
  );
}
