import { createAsync, A } from "@solidjs/router";
import { Show, For } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { useConfirm } from "~/components/wa/ConfirmProvider";
import { getUpcomingUnavailabilities, deleteUnavailability } from "~/lib/unavailability";

export default function UnavailabilityList() {
  const { confirm } = useConfirm();
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

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Unavailability",
      message: "Are you sure you want to delete this unavailability period?",
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (ok) {
      await deleteUnavailability(id);
      window.location.reload();
    }
  };

  return (
    <PageContent>
      <PageHeader
        title="Unavailable Times"
        description="Manage days and times when care is not available"
        actions={
          <wa-button href="/unavailability/new" variant="danger" appearance="filled">
            + Block Time
          </wa-button>
        }
      />

      <wa-card>
        <Show
          when={unavailabilities()?.length}
          fallback={
            <div class="wa-stack wa-gap-m" style={{ padding: "var(--wa-space-xl)", "text-align": "center" }}>
              <p class="wa-body-l wa-color-text-quiet">No unavailable times set</p>
              <p class="wa-body-m wa-color-text-quiet">
                Block out vacation days, holidays, or specific times when you&apos;re unavailable
              </p>
              <wa-button href="/unavailability/new" variant="danger" appearance="filled">
                Block Your First Time
              </wa-button>
            </div>
          }
        >
          <div class="wa-stack wa-gap-s">
            <For each={unavailabilities()}>
              {(unavailability) => (
                <div
                  class="wa-flank wa-gap-m"
                  style={{
                    padding: "var(--wa-space-m)",
                    "border-bottom": "1px solid var(--wa-color-neutral-90)",
                  }}
                >
                  <div class="wa-stack wa-gap-xs" style={{ flex: "1" }}>
                    <div class="wa-cluster wa-gap-s">
                      <h3 class="wa-heading-m">{unavailability.reason || "Time Off"}</h3>
                      <wa-badge variant="danger" appearance="filled-outlined" pill>
                        {unavailability.allDay ? "All Day" : "Specific Hours"}
                      </wa-badge>
                    </div>

                    <div class="wa-cluster wa-gap-l">
                      <div>
                        <span class="wa-body-s wa-color-text-quiet">From: </span>
                        <span class="wa-body-s">
                          {formatDate(unavailability.startDate)}
                          {!unavailability.allDay &&
                            unavailability.startTime &&
                            ` at ${formatTime(unavailability.startTime)}`}
                        </span>
                      </div>
                      <div>
                        <span class="wa-body-s wa-color-text-quiet">To: </span>
                        <span class="wa-body-s">
                          {formatDate(unavailability.endDate)}
                          {!unavailability.allDay &&
                            unavailability.endTime &&
                            ` at ${formatTime(unavailability.endTime)}`}
                        </span>
                      </div>
                    </div>

                    <Show when={unavailability.notes}>
                      <p class="wa-body-s wa-color-text-quiet">{unavailability.notes}</p>
                    </Show>
                  </div>

                  <div class="wa-cluster wa-gap-s">
                    <wa-button
                      href={`/unavailability/${unavailability.id}/edit`}
                      appearance="outlined"
                      size="small"
                    >
                      Edit
                    </wa-button>
                    <wa-button
                      variant="danger"
                      appearance="outlined"
                      size="small"
                      onClick={() => handleDelete(unavailability.id)}
                    >
                      Delete
                    </wa-button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </wa-card>
    </PageContent>
  );
}
