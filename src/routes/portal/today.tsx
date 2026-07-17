import { ensureParent } from "~/lib/route-guards";
import { createAsync, type RouteDefinition, A, useNavigate } from "@solidjs/router";
import { createSignal, For, Show, createEffect } from "solid-js";
import { getUser } from "~/lib";
import { getMyDailyDigest } from "~/lib/portal";
import { formatTimeLocal } from "~/lib/datetime";
import { hoursDisplay } from "~/lib/money-display";

export const route = {
  preload() {
    ensureParent();
    getUser();
    getMyDailyDigest();
  },
} satisfies RouteDefinition;

export default function PortalToday() {
  const navigate = useNavigate();
  const user = createAsync(() => getUser());
  const today = new Date();
  const [selectedDate, setSelectedDate] = createSignal(
    today.toISOString().slice(0, 10),
  );

  createEffect(() => {
    const u = user();
    if (u?.isOwner) navigate("/", { replace: true });
  });

  const digest = createAsync(() => {
    const [y, m, d] = selectedDate().split("-").map(Number);
    return getMyDailyDigest(new Date(y, m - 1, d));
  });

  const isToday = () => selectedDate() === today.toISOString().slice(0, 10);

  return (
    <main class="page">
      <header style={{ "margin-bottom": "1.5rem" }}>
        <p style={{ margin: 0 }}>
          <A href="/portal">← Back to portal</A>
        </p>
        <h1 style={{ margin: "0.5rem 0 0" }}>{isToday() ? "Today" : "Daily summary"}</h1>
        <p class="text-muted" style={{ margin: "0.5rem 0 0" }}>
          Meals, sessions, and reports for the selected day.
        </p>
      </header>

      <div class="card" style={{ padding: "1rem", "margin-bottom": "1.5rem" }}>
        <label for="digest-date" class="text-muted" style={{ display: "block", "margin-bottom": "0.5rem" }}>
          Date
        </label>
        <input
          id="digest-date"
          type="date"
          class="input-field"
          value={selectedDate()}
          onInput={(e) => setSelectedDate(e.currentTarget.value)}
        />
      </div>

      <section class="card" style={{ padding: "1.25rem" }}>
        <Show when={digest()?.length} fallback={<p class="empty-state">Nothing scheduled for this day.</p>}>
          <For each={digest()}>
            {(session) => (
              <article
                style={{
                  "margin-bottom": "1rem",
                  "padding-bottom": "1rem",
                  "border-bottom": "1px solid var(--color-border)",
                }}
              >
                <div style={{ "font-weight": "600" }}>
                  {formatTimeLocal(session.scheduledStart)} – {formatTimeLocal(session.scheduledEnd)}
                  <span class="text-muted" style={{ "font-weight": "400", "margin-left": "0.5rem" }}>
                    ({hoursDisplay(session.hours)} hrs)
                  </span>
                </div>
                <Show when={session.children.length > 0}>
                  <div class="text-muted" style={{ "font-size": "0.875rem", "margin-top": "0.25rem" }}>
                    {session.children.map((c) => `${c.firstName} ${c.lastName}`).join(", ")}
                  </div>
                </Show>
                <div class="text-muted" style={{ "font-size": "0.875rem", "margin-top": "0.25rem" }}>
                  Meals: B{session.mealCounts.breakfast} · AM{session.mealCounts.morningSnack} · L
                  {session.mealCounts.lunch} · PM{session.mealCounts.afternoonSnack} · D
                  {session.mealCounts.dinner}
                </div>
                <Show when={session.reports.length > 0}>
                  <ul style={{ "margin-top": "0.5rem", "padding-left": "1.25rem" }}>
                    <For each={session.reports}>
                      {(report) => (
                        <li>
                          {report.title} ({report.child.firstName})
                        </li>
                      )}
                    </For>
                  </ul>
                </Show>
              </article>
            )}
          </For>
        </Show>
      </section>
    </main>
  );
}
