import { createAsync, type RouteDefinition, useParams } from "@solidjs/router";
import { Show, For } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { SessionStatusBadge } from "~/components/wa/StatusBadge";
import { getChild } from "~/lib/children";

export const route = {
  preload({ params }) {
    if (params.childId) {
      getChild(params.childId);
    }
  },
} satisfies RouteDefinition;

export default function ChildDetailPage() {
  const params = useParams();
  const child = createAsync(() => getChild(params.childId!));

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <PageContent>
      <Show
        when={child()}
        fallback={
          <div style={{ "text-align": "center", padding: "var(--wa-space-2xl)" }} class="wa-color-text-quiet">
            Loading child details...
          </div>
        }
      >
        <wa-button href={`/families/${params.id}`} appearance="plain" size="small">
          ← Back to Family
        </wa-button>
        <PageHeader
          title={`${child()?.firstName} ${child()?.lastName}`}
          actions={
            <wa-button href={`/families/${params.id}/children/${params.childId}/edit`} variant="brand" appearance="filled">
              Edit Child
            </wa-button>
          }
        />

        <wa-card>
          <div class="wa-stack wa-gap-m">
            <h2 class="wa-heading-l">Basic Information</h2>
            <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
              <div>
                <strong class="wa-color-text-quiet">Date of Birth:</strong>
                <p>{child()?.dateOfBirth && formatDate(child()!.dateOfBirth)}</p>
              </div>
              <div>
                <strong class="wa-color-text-quiet">Age:</strong>
                <p>{child()?.dateOfBirth && calculateAge(child()!.dateOfBirth)} years old</p>
              </div>
              <Show when={child()?.gender}>
                <div>
                  <strong class="wa-color-text-quiet">Gender:</strong>
                  <p>
                    {child()
                      ?.gender?.replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                </div>
              </Show>
            </div>
          </div>
        </wa-card>

        <Show when={child()?.schoolName || child()?.schoolGrade || child()?.schoolTeacher}>
          <wa-card>
            <div class="wa-stack wa-gap-m">
              <h2 class="wa-heading-l">School Information</h2>
              <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
                <Show when={child()?.schoolName}>
                  <div>
                    <strong class="wa-color-text-quiet">School:</strong>
                    <p>{child()?.schoolName}</p>
                  </div>
                </Show>
                <Show when={child()?.schoolGrade}>
                  <div>
                    <strong class="wa-color-text-quiet">Grade:</strong>
                    <p>{child()?.schoolGrade}</p>
                  </div>
                </Show>
                <Show when={child()?.schoolTeacher}>
                  <div>
                    <strong class="wa-color-text-quiet">Teacher:</strong>
                    <p>{child()?.schoolTeacher}</p>
                  </div>
                </Show>
              </div>
            </div>
          </wa-card>
        </Show>

        <Show when={child()?.allergies || child()?.medications || child()?.specialNeeds}>
          <wa-callout variant="danger">
            <div class="wa-stack wa-gap-s">
              <h2 class="wa-heading-m">Medical Information</h2>
              <Show when={child()?.allergies}>
                <div>
                  <strong>Allergies:</strong> {child()?.allergies}
                </div>
              </Show>
              <Show when={child()?.medications}>
                <div>
                  <strong>Medications:</strong> {child()?.medications}
                </div>
              </Show>
              <Show when={child()?.specialNeeds}>
                <div>
                  <strong>Special Needs:</strong> {child()?.specialNeeds}
                </div>
              </Show>
            </div>
          </wa-callout>
        </Show>

        <Show when={child()?.notes}>
          <wa-card>
            <div class="wa-stack wa-gap-s">
              <h2 class="wa-heading-l">Additional Notes</h2>
              <p>{child()?.notes}</p>
            </div>
          </wa-card>
        </Show>

        <wa-card>
          <div class="wa-stack wa-gap-m">
            <h2 class="wa-heading-l">Recent Care Sessions ({child()?.careSessions?.length || 0})</h2>
            <Show
              when={child()?.careSessions?.length}
              fallback={
                <p class="wa-color-text-quiet" style={{ "text-align": "center", padding: "var(--wa-space-xl)" }}>
                  No care sessions recorded yet.
                </p>
              }
            >
              <div style={{ "overflow-x": "auto" }}>
                <table style={{ width: "100%", "border-collapse": "collapse" }}>
                  <thead>
                    <tr style={{ "border-bottom": "1px solid var(--wa-color-neutral-90)" }}>
                      <th style={{ padding: "var(--wa-space-s)", "text-align": "left" }}>Date/Time</th>
                      <th style={{ padding: "var(--wa-space-s)", "text-align": "left" }}>Duration</th>
                      <th style={{ padding: "var(--wa-space-s)", "text-align": "left" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={child()?.careSessions}>
                      {(session) => (
                        <tr style={{ "border-bottom": "1px solid var(--wa-color-neutral-90)" }}>
                          <td style={{ padding: "var(--wa-space-s)" }}>{formatDateTime(session.scheduledStart)}</td>
                          <td style={{ padding: "var(--wa-space-s)" }}>
                            {session.scheduledEnd
                              ? `${Math.round(
                                  (new Date(session.scheduledEnd).getTime() -
                                    new Date(session.scheduledStart).getTime()) /
                                    (1000 * 60 * 60),
                                )} hours`
                              : "N/A"}
                          </td>
                          <td style={{ padding: "var(--wa-space-s)" }}>
                            <SessionStatusBadge status={session.status} />
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </Show>
          </div>
        </wa-card>
      </Show>
    </PageContent>
  );
}
