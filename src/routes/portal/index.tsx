import { ensureParent } from "~/lib/route-guards";
import { createAsync, type RouteDefinition, A, useAction, useNavigate } from "@solidjs/router";
import { createSignal, For, Show, createEffect } from "solid-js";
import { getUser } from "~/lib";
import {
  getMyFamily,
  getMyUpcomingSessions,
  getMyChildReports,
  confirmMySession,
} from "~/lib/portal";
import { formatTimeLocal } from "~/lib/datetime";

export const route = {
  preload() {
    ensureParent();
    getUser();
    getMyFamily();
    getMyUpcomingSessions();
    getMyChildReports();
  },
} satisfies RouteDefinition;

export default function ParentPortal() {
  const navigate = useNavigate();
  const user = createAsync(() => getUser());
  const family = createAsync(() => getMyFamily());
  const sessions = createAsync(() => getMyUpcomingSessions());
  const reports = createAsync(() => getMyChildReports());
  const confirmSession = useAction(confirmMySession);
  const [confirmingId, setConfirmingId] = createSignal<string | null>(null);

  // Belt-and-suspenders: owners should never stay on the parent portal
  createEffect(() => {
    const u = user();
    if (u?.isOwner) navigate("/", { replace: true });
  });

  const handleConfirm = async (sessionId: string) => {
    setConfirmingId(sessionId);
    try {
      await confirmSession(sessionId);
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <main class="page">
      <header style={{ "margin-bottom": "1.5rem" }}>
        <h1 style={{ margin: 0 }}>Parent Portal</h1>
        <Show when={family()}>
          {(f) => <p style={{ color: "var(--color-text-muted)", margin: "0.5rem 0 0" }}>{f().familyName}</p>}
        </Show>
      </header>

      <section class="card" style={{ "margin-bottom": "1.5rem" }}>
        <h2 style={{ "margin-top": 0 }}>Upcoming sessions</h2>
        <Show when={sessions()?.length} fallback={<p class="empty-state">No upcoming sessions.</p>}>
          <ul style={{ "list-style": "none", padding: 0, margin: 0 }}>
            <For each={sessions()}>
              {(session) => (
                <li
                  style={{
                    display: "flex",
                    "justify-content": "space-between",
                    "align-items": "center",
                    gap: "1rem",
                    padding: "0.75rem 0",
                    "border-bottom": "1px solid var(--color-border)",
                  }}
                >
                  <div>
                    <div style={{ "font-weight": "600" }}>{session.service.name}</div>
                    <div style={{ color: "var(--color-text-muted)", "font-size": "0.875rem" }}>
                      {new Date(session.scheduledStart).toLocaleDateString()} ·{" "}
                      {formatTimeLocal(session.scheduledStart)} – {formatTimeLocal(session.scheduledEnd)}
                    </div>
                  </div>
                  <Show when={!session.isConfirmed}>
                    <button
                      type="button"
                      class="btn btn-primary"
                      disabled={confirmingId() === session.id}
                      onClick={() => handleConfirm(session.id)}
                    >
                      {confirmingId() === session.id ? "Confirming…" : "Confirm"}
                    </button>
                  </Show>
                  <Show when={session.isConfirmed}>
                    <span style={{ color: "var(--color-success)", "font-size": "0.875rem" }}>Confirmed</span>
                  </Show>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </section>

      <section class="card" style={{ "margin-bottom": "1.5rem" }}>
        <div style={{ display: "flex", "justify-content": "space-between", "align-items": "center", gap: "1rem" }}>
          <h2 style={{ margin: 0 }}>Today's summary</h2>
          <A href="/portal/today" class="btn" style={{ "font-size": "0.875rem" }}>
            View full day →
          </A>
        </div>
        <p class="text-muted" style={{ margin: "0.75rem 0 0", "font-size": "0.875rem" }}>
          See meals, sessions, and reports for today on the daily digest page.
        </p>
      </section>

      <section class="card">
        <h2 style={{ "margin-top": 0 }}>Recent reports</h2>
        <Show when={reports()?.length} fallback={<p class="empty-state">No reports yet.</p>}>
          <ul style={{ "list-style": "none", padding: 0, margin: 0 }}>
            <For each={reports()}>
              {(report) => (
                <li style={{ padding: "0.75rem 0", "border-bottom": "1px solid var(--color-border)" }}>
                  <div style={{ "font-weight": "600" }}>{report.title}</div>
                  <div style={{ color: "var(--color-text-muted)", "font-size": "0.875rem" }}>
                    {report.child.firstName} {report.child.lastName} ·{" "}
                    {new Date(report.timestamp).toLocaleString()}
                  </div>
                  <p style={{ margin: "0.5rem 0 0" }}>{report.description}</p>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </section>

      <p style={{ "margin-top": "1.5rem" }}>
        <A href="/account">Account settings</A>
      </p>
    </main>
  );
}
