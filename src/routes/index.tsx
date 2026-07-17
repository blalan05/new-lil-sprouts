import { createAsync, type RouteDefinition, A, useSubmission } from "@solidjs/router";
import { Show, For, createSignal, createEffect } from "solid-js";
import Modal from "~/components/Modal";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { SessionStatusBadge } from "~/components/wa/StatusBadge";
import { getUser } from "~/lib";
import { getUpcomingSessions, getSessionsForDay } from "~/lib/schedule";
import { getRecentReports } from "~/lib/session-reports";
import { getFamilies } from "~/lib/families";
import { getFamily } from "~/lib/families";
import { createCareSchedule } from "~/lib/care-schedules";
import { getServices } from "~/lib/services";
import { getWeeklyStats, getDashboardStats, getStatsForPeriod } from "~/lib/stats";
import { formatTimeLocal, ensureDate, isSameDay } from "~/lib/datetime";
import { formatMoneyDisplay, hoursDisplay, moneyDisplay } from "~/lib/money-display";

export const route = {
  preload() {
    getUser();
    getUpcomingSessions(10);
    getRecentReports(10);
    getFamilies();
    getWeeklyStats();
    getDashboardStats();
    getStatsForPeriod("thisWeek");
    getStatsForPeriod("lastWeek");

    // Preload sessions for yesterday, today, and tomorrow
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    getSessionsForDay(yesterday);
    getSessionsForDay(today);
    getSessionsForDay(tomorrow);
  },
  info: {
    ssr: false, // Disable SSR to prevent timezone mismatch between server and client
  },
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => getUser(), { deferStream: true });
  const isOwner = () => user()?.isOwner ?? false;
  const upcomingSessions = createAsync(() => getUpcomingSessions(10));
  const recentIncidents = createAsync(() => getRecentReports(10));
  const families = createAsync(() => getFamilies());
  const services = createAsync(() => getServices());
  const weeklyStats = createAsync(() => getWeeklyStats());
  const dashboardStats = createAsync(() => getDashboardStats());

  // Time period selection for hours and money widgets
  const [hoursPeriod, setHoursPeriod] = createSignal<"lastWeek" | "thisWeek" | "month" | "ytd">(
    "thisWeek",
  );
  const [moneyPeriod, setMoneyPeriod] = createSignal<"lastWeek" | "thisWeek" | "month" | "ytd">(
    "thisWeek",
  );

  const hoursStats = createAsync(() => getStatsForPeriod(hoursPeriod()));
  const moneyStats = createAsync(() => getStatsForPeriod(moneyPeriod()));
  const [showQuickAddModal, setShowQuickAddModal] = createSignal(false);
  const [selectedFamilyId, setSelectedFamilyId] = createSignal<string>("");
  const [selectedDate, setSelectedDate] = createSignal<string>("");
  const [calendarMonth, setCalendarMonth] = createSignal(new Date());

  // Get sessions for yesterday, today, and tomorrow
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterdaySessions = createAsync(() => getSessionsForDay(yesterday));
  const todaySessions = createAsync(() => getSessionsForDay(today));
  const tomorrowSessions = createAsync(() => getSessionsForDay(tomorrow));

  // Default service ID based on selected family's assigned services
  const selectedFamily = createAsync(() => {
    const id = selectedFamilyId();
    return id ? getFamily(id) : null;
  });

  const defaultServiceId = () => {
    const family = selectedFamily();
    if (family?.services && family.services.length > 0) {
      return family.services[0].service.id;
    }
    const allServices = services();
    if (allServices && allServices.length > 0) {
      return allServices[0].id;
    }
    return "";
  };

  const [serviceId, setServiceId] = createSignal<string>("");

  // Update service ID when family or services change
  createEffect(() => {
    const family = selectedFamily();
    const allServices = services();
    const currentServiceId = serviceId();

    if (allServices && allServices.length > 0) {
      const defaultId = defaultServiceId();
      // Set serviceId if it's empty or if the family changed and we have a new default
      if (
        !currentServiceId ||
        currentServiceId === "" ||
        (family && defaultId && defaultId !== currentServiceId)
      ) {
        if (defaultId) {
          setServiceId(defaultId);
        } else if (allServices.length > 0) {
          // Fallback to first service if no family-specific default
          setServiceId(allServices[0].id);
        }
      }
    }
  });
  const submission = useSubmission(createCareSchedule);

  // Get current date and time
  const getCurrentDate = () => {
    return selectedDate() || new Date().toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleCloseModal = () => {
    setShowQuickAddModal(false);
    setSelectedFamilyId("");
    setSelectedDate("");
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    setSelectedDate(dateStr);
    setShowQuickAddModal(true);
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Calendar helpers
  const getCalendarDays = () => {
    const month = calendarMonth();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

    const days: Date[] = [];
    const current = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    const month = calendarMonth();
    return date.getMonth() === month.getMonth();
  };

  // Watch for successful submission
  createEffect(() => {
    if (submission.result && !(submission.result instanceof Error)) {
      handleCloseModal();
      window.location.reload();
    }
  });

  return (
    <PageContent>
      <PageHeader
        title="Dashboard"
        description={
          user()
            ? `Welcome back, ${user()?.firstName || user()?.username}`
            : undefined
        }
        actions={
          <Show when={isOwner()}>
            <wa-button
              variant="success"
              appearance="filled"
              onClick={() => {
                setSelectedDate("");
                setShowQuickAddModal(true);
              }}
            >
              + Add Care Session
            </wa-button>
          </Show>
        }
      />

      <Show when={user() && !isOwner() && user()!.familyId}>
        <wa-callout variant="brand">
          View your family&apos;s schedule, sessions, and updates on the{" "}
          <A href={`/families/${user()!.familyId}`}>family page</A>.
        </wa-callout>
      </Show>

      {/* Mini Calendar */}
      <wa-card style={{ "max-width": "350px" }}>
        <div class="wa-flank wa-gap-s" style={{ "margin-bottom": "var(--wa-space-s)" }}>
          <wa-button
            appearance="outlined"
            size="small"
            onClick={() => {
              const newMonth = new Date(calendarMonth());
              newMonth.setMonth(newMonth.getMonth() - 1);
              setCalendarMonth(newMonth);
            }}
          >
            ←
          </wa-button>
          <h3 class="wa-heading-s" style={{ margin: 0, flex: 1, "text-align": "center" }}>
            {calendarMonth().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <wa-button
            appearance="outlined"
            size="small"
            onClick={() => {
              const newMonth = new Date(calendarMonth());
              newMonth.setMonth(newMonth.getMonth() + 1);
              setCalendarMonth(newMonth);
            }}
          >
            →
          </wa-button>
        </div>
        <div class="calendar-grid">
        <div
          class="calendar-grid-inner"
          style={{
            display: "grid",
            "grid-template-columns": "repeat(7, 1fr)",
            gap: "0.25rem",
          }}
        >
          <For each={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}>
            {(day) => (
              <div
                style={{
                  padding: "0.25rem",
                  "text-align": "center",
                  "font-size": "0.75rem",
                  "font-weight": "600",
                  color: "#718096",
                }}
              >
                {day}
              </div>
            )}
          </For>
          <For each={getCalendarDays()}>
            {(day) => {
              const isCurrentMonthDay = isCurrentMonth(day);
              const isTodayDay = isToday(day);

              return (
                <button
                  onClick={() => isOwner() && handleDateClick(day)}
                  style={{
                    padding: "0.5rem",
                    "background-color": isTodayDay
                      ? "#bee3f8"
                      : isCurrentMonthDay
                        ? "#fff"
                        : "#f7fafc",
                    color: isCurrentMonthDay ? "#2d3748" : "#a0aec0",
                    border: isTodayDay ? "2px solid #4299e1" : "1px solid #e2e8f0",
                    "border-radius": "4px",
                    cursor: isOwner() ? "pointer" : "default",
                    "font-size": "0.75rem",
                    "font-weight": isTodayDay ? "700" : "400",
                    transition: "all 0.2s",
                    "min-height": "32px",
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                  }}
                  onMouseEnter={(e) => {
                    if (isCurrentMonthDay) {
                      e.currentTarget.style.backgroundColor = "#edf2f7";
                      e.currentTarget.style.borderColor = "#cbd5e0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isCurrentMonthDay) {
                      e.currentTarget.style.backgroundColor = isTodayDay ? "#bee3f8" : "#fff";
                      e.currentTarget.style.borderColor = isTodayDay ? "#4299e1" : "#e2e8f0";
                    }
                  }}
                >
                  {day.getDate()}
                </button>
              );
            }}
          </For>
        </div>
        </div>
      </wa-card>

      {/* Yesterday, Today, Tomorrow Sessions */}
      <div class="wa-grid wa-gap-m grid-responsive" style={{ "--min-column-size": "280px" }}>
        {/* Yesterday Sessions */}
        <wa-card>
          <div class="wa-flank wa-gap-s" style={{ "margin-bottom": "var(--wa-space-m)" }}>
            <h2 class="wa-heading-m">Yesterday</h2>
            <wa-badge variant="neutral" appearance="filled-outlined" pill>
              {yesterdaySessions()?.length || 0}
            </wa-badge>
          </div>
          <Show
            when={yesterdaySessions() && yesterdaySessions()!.length > 0}
            fallback={
              <p
                style={{
                  color: "#a0aec0",
                  "font-size": "0.875rem",
                  "text-align": "center",
                  padding: "0.75rem",
                }}
              >
                No sessions
              </p>
            }
          >
            <div style={{ display: "flex", "flex-direction": "column", gap: "0.375rem" }}>
              <For each={yesterdaySessions()}>
                {(session) => (
                  <A
                    href={`/families/${session.family.id}/sessions/${session.id}`}
                    style={{
                      padding: "0.5rem 0.75rem",
                      "background-color": "#f7fafc",
                      "border-radius": "4px",
                      border: "1px solid #e2e8f0",
                      "text-decoration": "none",
                      color: "inherit",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#edf2f7";
                      e.currentTarget.style.borderColor = "#cbd5e0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f7fafc";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                  >
                    <div
                      style={{
                        "font-weight": "600",
                        color: "#2d3748",
                        "margin-bottom": "0.125rem",
                        "font-size": "0.875rem",
                      }}
                    >
                      {session.family.familyName}
                    </div>
                    <div style={{ "font-size": "0.8125rem", color: "#718096" }}>
                      {formatTimeLocal(session.scheduledStart)}{" "}
                      -{" "}
                      {formatTimeLocal(session.scheduledEnd)}
                    </div>
                    <div
                      style={{ "font-size": "0.75rem", color: "#a0aec0", "margin-top": "0.125rem" }}
                    >
                      {session.service.name}
                      {session.children.length > 0 &&
                        ` • ${session.children.length} child${session.children.length > 1 ? "ren" : ""}`}
                    </div>
                  </A>
                )}
              </For>
            </div>
          </Show>
        </wa-card>

        {/* Today Sessions */}
        <wa-card style={{ border: "2px solid var(--wa-color-brand-50)" }}>
          <div class="wa-flank wa-gap-s" style={{ "margin-bottom": "var(--wa-space-m)" }}>
            <h2 class="wa-heading-m">Today</h2>
            <wa-badge variant="brand" appearance="filled-outlined" pill>
              {todaySessions()?.length || 0}
            </wa-badge>
          </div>
          <Show
            when={todaySessions() && todaySessions()!.length > 0}
            fallback={
              <p
                style={{
                  color: "#a0aec0",
                  "font-size": "0.875rem",
                  "text-align": "center",
                  padding: "0.75rem",
                }}
              >
                No sessions
              </p>
            }
          >
            <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
              <For each={todaySessions()}>
                {(session) => (
                  <A
                    href={`/families/${session.family.id}/sessions/${session.id}`}
                    style={{
                      padding: "0.5rem",
                      "background-color": "#f7fafc",
                      "border-radius": "4px",
                      border: "1px solid #e2e8f0",
                      "text-decoration": "none",
                      color: "inherit",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#edf2f7";
                      e.currentTarget.style.borderColor = "#cbd5e0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f7fafc";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                  >
                    <div
                      style={{
                        "font-weight": "600",
                        color: "#2d3748",
                        "margin-bottom": "0.125rem",
                        "font-size": "0.875rem",
                      }}
                    >
                      {session.family.familyName}
                    </div>
                    <div style={{ "font-size": "0.8125rem", color: "#718096" }}>
                      {formatTimeLocal(session.scheduledStart)}{" "}
                      -{" "}
                      {formatTimeLocal(session.scheduledEnd)}
                    </div>
                    <div
                      style={{ "font-size": "0.75rem", color: "#a0aec0", "margin-top": "0.125rem" }}
                    >
                      {session.service.name}
                      {session.children.length > 0 &&
                        ` • ${session.children.length} child${session.children.length > 1 ? "ren" : ""}`}
                    </div>
                  </A>
                )}
              </For>
            </div>
          </Show>
        </wa-card>

        {/* Tomorrow Sessions */}
        <wa-card>
          <div class="wa-flank wa-gap-s" style={{ "margin-bottom": "var(--wa-space-m)" }}>
            <h2 class="wa-heading-m">Tomorrow</h2>
            <wa-badge variant="neutral" appearance="filled-outlined" pill>
              {tomorrowSessions()?.length || 0}
            </wa-badge>
          </div>
          <Show
            when={tomorrowSessions() && tomorrowSessions()!.length > 0}
            fallback={
              <p
                style={{
                  color: "#a0aec0",
                  "font-size": "0.875rem",
                  "text-align": "center",
                  padding: "0.75rem",
                }}
              >
                No sessions
              </p>
            }
          >
            <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
              <For each={tomorrowSessions()}>
                {(session) => (
                  <A
                    href={`/families/${session.family.id}/sessions/${session.id}`}
                    style={{
                      padding: "0.5rem",
                      "background-color": "#f7fafc",
                      "border-radius": "4px",
                      border: "1px solid #e2e8f0",
                      "text-decoration": "none",
                      color: "inherit",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#edf2f7";
                      e.currentTarget.style.borderColor = "#cbd5e0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f7fafc";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                  >
                    <div
                      style={{
                        "font-weight": "600",
                        color: "#2d3748",
                        "margin-bottom": "0.125rem",
                        "font-size": "0.875rem",
                      }}
                    >
                      {session.family.familyName}
                    </div>
                    <div style={{ "font-size": "0.8125rem", color: "#718096" }}>
                      {formatTimeLocal(session.scheduledStart)}{" "}
                      -{" "}
                      {formatTimeLocal(session.scheduledEnd)}
                    </div>
                    <div
                      style={{ "font-size": "0.75rem", color: "#a0aec0", "margin-top": "0.125rem" }}
                    >
                      {session.service.name}
                      {session.children.length > 0 &&
                        ` • ${session.children.length} child${session.children.length > 1 ? "ren" : ""}`}
                    </div>
                  </A>
                )}
              </For>
            </div>
          </Show>
        </wa-card>
      </div>

      {/* Hours and Money Stats with Period Selectors (owner only) */}
      <Show when={isOwner()}>
      <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "280px" }}>
        {/* Hours Widget */}
        <wa-card>
          <div class="wa-flank wa-gap-s" style={{ "margin-bottom": "var(--wa-space-s)" }}>
            <div class="wa-heading-m">Hours</div>
            <div class="wa-cluster wa-gap-xs">
              <wa-button
                size="small"
                appearance={hoursPeriod() === "lastWeek" ? "filled" : "outlined"}
                variant={hoursPeriod() === "lastWeek" ? "brand" : "neutral"}
                onClick={() => setHoursPeriod("lastWeek")}
              >
                Last Week
              </wa-button>
              <wa-button
                size="small"
                appearance={hoursPeriod() === "thisWeek" ? "filled" : "outlined"}
                variant={hoursPeriod() === "thisWeek" ? "brand" : "neutral"}
                onClick={() => setHoursPeriod("thisWeek")}
              >
                Week
              </wa-button>
              <wa-button
                size="small"
                appearance={hoursPeriod() === "month" ? "filled" : "outlined"}
                variant={hoursPeriod() === "month" ? "brand" : "neutral"}
                onClick={() => setHoursPeriod("month")}
              >
                Month
              </wa-button>
              <wa-button
                size="small"
                appearance={hoursPeriod() === "ytd" ? "filled" : "outlined"}
                variant={hoursPeriod() === "ytd" ? "brand" : "neutral"}
                onClick={() => setHoursPeriod("ytd")}
              >
                YTD
              </wa-button>
            </div>
          </div>
          <Show when={hoursStats()}>
            <div class="wa-heading-xl">{hoursDisplay(hoursStats()?.hours)}</div>
          </Show>
        </wa-card>

        {/* Money Widget */}
        <wa-card>
          <div class="wa-flank wa-gap-s" style={{ "margin-bottom": "var(--wa-space-s)" }}>
            <div class="wa-heading-m">Money</div>
            <div class="wa-cluster wa-gap-xs">
              <wa-button
                size="small"
                appearance={moneyPeriod() === "lastWeek" ? "filled" : "outlined"}
                variant={moneyPeriod() === "lastWeek" ? "brand" : "neutral"}
                onClick={() => setMoneyPeriod("lastWeek")}
              >
                Last Week
              </wa-button>
              <wa-button
                size="small"
                appearance={moneyPeriod() === "thisWeek" ? "filled" : "outlined"}
                variant={moneyPeriod() === "thisWeek" ? "brand" : "neutral"}
                onClick={() => setMoneyPeriod("thisWeek")}
              >
                Week
              </wa-button>
              <wa-button
                size="small"
                appearance={moneyPeriod() === "month" ? "filled" : "outlined"}
                variant={moneyPeriod() === "month" ? "brand" : "neutral"}
                onClick={() => setMoneyPeriod("month")}
              >
                Month
              </wa-button>
              <wa-button
                size="small"
                appearance={moneyPeriod() === "ytd" ? "filled" : "outlined"}
                variant={moneyPeriod() === "ytd" ? "brand" : "neutral"}
                onClick={() => setMoneyPeriod("ytd")}
              >
                YTD
              </wa-button>
            </div>
          </div>
          <Show when={moneyStats()}>
            <div class="wa-heading-xl" style={{ color: "var(--wa-color-success-40)" }}>
              {formatMoneyDisplay(moneyStats()?.money)}
            </div>
          </Show>
        </wa-card>
      </div>
      </Show>

      {/* Dashboard stats */}
      <Show when={dashboardStats()}>
        <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "180px" }}>
          <Show when={isOwner()}>
            <wa-card>
              <div class="wa-body-s wa-color-text-quiet">Hours This Month</div>
              <div class="wa-heading-xl">{hoursDisplay(dashboardStats()?.thisMonthHours)}</div>
              <div class="wa-body-s wa-color-text-quiet">
                {formatMoneyDisplay(dashboardStats()?.thisMonthMoney)} earned
              </div>
            </wa-card>
          </Show>

          <Show when={!isOwner()}>
            <wa-card>
              <div class="wa-body-s wa-color-text-quiet">Care Hours This Month</div>
              <div class="wa-heading-xl">{hoursDisplay(dashboardStats()?.thisMonthHours)}</div>
            </wa-card>
          </Show>

          <wa-card>
            <div class="wa-body-s wa-color-text-quiet">Upcoming Sessions</div>
            <div class="wa-heading-xl" style={{ color: "var(--wa-color-brand-50)" }}>
              {dashboardStats()?.upcomingSessions || 0}
            </div>
            <div class="wa-body-s wa-color-text-quiet">Next 7 days</div>
          </wa-card>

          <Show when={isOwner()}>
            <wa-card>
              <div class="wa-body-s wa-color-text-quiet">Unpaid Sessions</div>
              <div class="wa-heading-xl" style={{ color: "var(--wa-color-warning-40)" }}>
                {dashboardStats()?.unpaidSessions || 0}
              </div>
              <div class="wa-body-s wa-color-text-quiet">Awaiting payment</div>
            </wa-card>

            <wa-card>
              <div class="wa-body-s wa-color-text-quiet">Active Families</div>
              <div class="wa-heading-xl">{dashboardStats()?.activeFamilies || 0}</div>
              <div class="wa-body-s wa-color-text-quiet">This month</div>
            </wa-card>

            <Show when={Number(moneyDisplay(dashboardStats()?.averageHourlyRate)) > 0}>
              <wa-card>
                <div class="wa-body-s wa-color-text-quiet">Avg Hourly Rate</div>
                <div class="wa-heading-xl">
                  {formatMoneyDisplay(dashboardStats()?.averageHourlyRate)}
                </div>
                <div class="wa-body-s wa-color-text-quiet">This month</div>
              </wa-card>
            </Show>
          </Show>
        </div>
      </Show>

      {/* Upcoming Sessions and Incidents */}
      <div class="wa-grid wa-gap-m grid-responsive" style={{ "--min-column-size": "280px" }}>
        {/* Upcoming Sessions */}
        <wa-card>
          <div class="wa-flank wa-gap-s" style={{ "margin-bottom": "var(--wa-space-s)" }}>
            <h2 class="wa-heading-m">Upcoming Sessions</h2>
            <A href="/schedule">View All →</A>
          </div>
          <Show
            when={!upcomingSessions.loading && upcomingSessions()}
            fallback={
              <div style={{ "text-align": "center", padding: "1.5rem", color: "#718096" }}>
                Loading...
              </div>
            }
          >
            <Show
              when={upcomingSessions()?.length}
              fallback={
                <div style={{ "text-align": "center", padding: "1.5rem", color: "#718096" }}>
                  No upcoming sessions scheduled
                </div>
              }
            >
              <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                <For each={upcomingSessions()}>
                  {(session) => {
                    const sessionDate = ensureDate(session.scheduledStart);
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const isToday = isSameDay(sessionDate, today);
                    const isTomorrow = isSameDay(sessionDate, tomorrow);

                    return (
                      <A
                        href={`/families/${session.familyId}/sessions/${session.id}`}
                        style={{
                          padding: "0.75rem",
                          "background-color": "#f7fafc",
                          border: "1px solid #e2e8f0",
                          "border-radius": "6px",
                          "text-decoration": "none",
                          color: "inherit",
                          display: "block",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#edf2f7";
                          e.currentTarget.style.borderColor = "#cbd5e0";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#f7fafc";
                          e.currentTarget.style.borderColor = "#e2e8f0";
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            "justify-content": "space-between",
                            "align-items": "start",
                            "margin-bottom": "0.375rem",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                "align-items": "center",
                                gap: "0.5rem",
                                "margin-bottom": "0.25rem",
                              }}
                            >
                              <h3 class="wa-heading-s">{session.family.familyName}</h3>
                              <SessionStatusBadge status={session.status} />
                              {session.isConfirmed && (
                                <wa-badge variant="success" appearance="filled-outlined" pill>
                                  ✓ Confirmed
                                </wa-badge>
                              )}
                            </div>
                            <div style={{ "font-size": "0.875rem", color: "#4a5568" }}>
                              {session.children.map((c: any) => c.firstName).join(", ")}
                            </div>
                          </div>
                          <div style={{ "text-align": "right" }}>
                            <div
                              style={{
                                "font-size": "0.875rem",
                                "font-weight": "600",
                                color: isToday ? "#e53e3e" : isTomorrow ? "#ed8936" : "#2d3748",
                              }}
                            >
                              {isToday
                                ? "Today"
                                : isTomorrow
                                  ? "Tomorrow"
                                  : sessionDate.toLocaleDateString("en-US", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    })}
                            </div>
                            <div style={{ "font-size": "0.875rem", color: "#718096" }}>
                              {formatTimeLocal(sessionDate)}
                            </div>
                          </div>
                        </div>
                      </A>
                    );
                  }}
                </For>
              </div>
            </Show>
          </Show>
        </wa-card>

        {/* Recent Incidents */}
        <wa-card>
          <div class="wa-flank wa-gap-s" style={{ "margin-bottom": "var(--wa-space-s)" }}>
            <h2 class="wa-heading-m">Recent Incidents & Reports</h2>
            <A href="/reports">View All →</A>
          </div>
          <Show
            when={!recentIncidents.loading && recentIncidents()}
            fallback={
              <div style={{ "text-align": "center", padding: "1.5rem", color: "#718096" }}>
                Loading...
              </div>
            }
          >
            <Show
              when={recentIncidents()?.length}
              fallback={
                <div style={{ "text-align": "center", padding: "1.5rem", color: "#718096" }}>
                  No recent incidents or reports
                </div>
              }
            >
              <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                <For each={recentIncidents()}>
                  {(report) => {
                    const severityColors = {
                      INFO: { bg: "#e6fffa", color: "#234e52", icon: "ℹ️" },
                      MINOR: { bg: "#feebc8", color: "#7c2d12", icon: "⚠️" },
                      MODERATE: { bg: "#fed7aa", color: "#7c2d12", icon: "⚡" },
                      SEVERE: { bg: "#fed7d7", color: "#c53030", icon: "🚨" },
                    }[report.severity] || { bg: "#e2e8f0", color: "#2d3748", icon: "📝" };

                    const typeLabels: Record<string, string> = {
                      INCIDENT: "Incident",
                      ACCIDENT: "Accident",
                      BEHAVIOR: "Behavior",
                      MEAL: "Meal",
                      NAP: "Nap",
                      ACTIVITY: "Activity",
                      MEDICATION: "Medication",
                      MILESTONE: "Milestone",
                      GENERAL: "General",
                    };

                    const reportDate = new Date(report.timestamp);
                    const isToday = reportDate.toDateString() === new Date().toDateString();

                    return (
                      <A
                        href={`/families/${report.careSession.family.id}/sessions/${report.careSessionId}`}
                        style={{
                          padding: "0.75rem",
                          "background-color": "#f7fafc",
                          border: "1px solid #e2e8f0",
                          "border-radius": "6px",
                          "text-decoration": "none",
                          color: "inherit",
                          display: "block",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#edf2f7";
                          e.currentTarget.style.borderColor = "#cbd5e0";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#f7fafc";
                          e.currentTarget.style.borderColor = "#e2e8f0";
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            "justify-content": "space-between",
                            "align-items": "start",
                            "margin-bottom": "0.375rem",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                "align-items": "center",
                                gap: "0.5rem",
                                "margin-bottom": "0.25rem",
                              }}
                            >
                              <span style={{ "font-size": "1.25rem" }}>{severityColors.icon}</span>
                              <h3
                                style={{
                                  "font-size": "1rem",
                                  color: "#2d3748",
                                  margin: 0,
                                  "font-weight": "600",
                                }}
                              >
                                {report.title}
                              </h3>
                              <span
                                style={{
                                  padding: "0.125rem 0.5rem",
                                  "border-radius": "9999px",
                                  "background-color": severityColors.bg,
                                  color: severityColors.color,
                                  "font-size": "0.75rem",
                                  "font-weight": "600",
                                }}
                              >
                                {typeLabels[report.type] || report.type}
                              </span>
                              {report.followUpNeeded && (
                                <span
                                  style={{
                                    padding: "0.125rem 0.5rem",
                                    "border-radius": "9999px",
                                    "background-color": "#fed7d7",
                                    color: "#c53030",
                                    "font-size": "0.75rem",
                                    "font-weight": "600",
                                  }}
                                >
                                  Follow-up Needed
                                </span>
                              )}
                            </div>
                            <div style={{ "font-size": "0.875rem", color: "#4a5568" }}>
                              {report.child.firstName} {report.child.lastName} •{" "}
                              {report.careSession.family.familyName}
                            </div>
                            <div
                              style={{
                                "font-size": "0.875rem",
                                color: "#718096",
                                "margin-top": "0.25rem",
                              }}
                            >
                              {report.description.length > 100
                                ? `${report.description.substring(0, 100)}...`
                                : report.description}
                            </div>
                          </div>
                          <div style={{ "text-align": "right" }}>
                            <div
                              style={{
                                "font-size": "0.875rem",
                                color: isToday ? "#e53e3e" : "#718096",
                                "font-weight": isToday ? "600" : "400",
                              }}
                            >
                              {isToday
                                ? "Today"
                                : reportDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                            </div>
                            <div style={{ "font-size": "0.75rem", color: "#a0aec0" }}>
                              {formatTimeLocal(reportDate)}
                            </div>
                          </div>
                        </div>
                      </A>
                    );
                  }}
                </For>
              </div>
            </Show>
          </Show>
        </wa-card>
      </div>

      <Show when={isOwner()}>
      <Modal open={showQuickAddModal()} title="Quick Add Session" onClose={handleCloseModal}>
            <form action={createCareSchedule} method="post" class="wa-stack wa-gap-m">
              <input type="hidden" name="recurrence" value="ONCE" />
              <input type="hidden" name="timezoneOffset" value={new Date().getTimezoneOffset() * -1} />

              <Show
                when={services()}
                fallback={
                  <div class="wa-color-text-quiet">Loading services...</div>
                }
              >
                <wa-select
                  label="Service *"
                  name="serviceId"
                  required
                  value={serviceId()}
                  onChange={(e) =>
                    setServiceId((e.currentTarget as HTMLSelectElement & { value: string }).value)
                  }
                >
                  <Show
                    when={selectedFamily()?.services && selectedFamily()!.services.length > 0}
                    fallback={
                      <>
                        <wa-option value="">Select a service...</wa-option>
                        <For each={services()}>
                          {(service) => (
                            <wa-option value={service.id}>
                              {service.name}
                              {service.defaultHourlyRate &&
                                ` ($${service.defaultHourlyRate}/hr${service.pricingType === "PER_CHILD" ? " per child" : ""})`}
                            </wa-option>
                          )}
                        </For>
                      </>
                    }
                  >
                    <For each={selectedFamily()?.services || []}>
                      {(fs) => (
                        <wa-option value={fs.service.id}>
                          {fs.service.name}
                          {fs.service.defaultHourlyRate &&
                            ` ($${fs.service.defaultHourlyRate}/hr${fs.service.pricingType === "PER_CHILD" ? " per child" : ""})`}
                        </wa-option>
                      )}
                    </For>
                  </Show>
                </wa-select>
                <Show
                  when={
                    selectedFamilyId() &&
                    (!selectedFamily()?.services || selectedFamily()!.services.length === 0)
                  }
                >
                  <p class="wa-body-s wa-color-text-quiet">
                    No services assigned to this family.{" "}
                    <A href={`/families/${selectedFamilyId()}/edit`}>Assign services</A> to default
                    this selection.
                  </p>
                </Show>
              </Show>

              <wa-select
                label="Family *"
                name="familyId"
                required
                value={selectedFamilyId()}
                onChange={(e) =>
                  setSelectedFamilyId((e.currentTarget as HTMLSelectElement & { value: string }).value)
                }
              >
                <wa-option value="">Select a family...</wa-option>
                <For each={families()}>
                  {(family) => <wa-option value={family.id}>{family.familyName}</wa-option>}
                </For>
              </wa-select>

              <Show when={selectedFamilyId() && selectedFamily()}>
                {(family) => (
                  <Show
                    when={(() => {
                      const selectedService = services()?.find((s) => s.id === serviceId());
                      return !selectedService?.requiresChildren || family().children.length > 0;
                    })()}
                  >
                    <div style={{ "margin-bottom": "1.5rem" }}>
                      <label
                        style={{
                          display: "block",
                          "margin-bottom": "0.5rem",
                          "font-weight": "600",
                          color: "#2d3748",
                        }}
                      >
                        {(() => {
                          const selectedService = services()?.find((s) => s.id === serviceId());
                          return selectedService?.requiresChildren
                            ? "Children *"
                            : "Student (optional)";
                        })()}
                      </label>
                      <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                        <For each={family().children}>
                          {(child) => (
                            <label
                              style={{
                                display: "flex",
                                "align-items": "center",
                                gap: "0.5rem",
                                cursor: "pointer",
                                padding: "0.5rem",
                                "border-radius": "4px",
                                transition: "background-color 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#f7fafc";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <input
                                type="checkbox"
                                name="childIds"
                                value={child.id}
                                style={{
                                  width: "1.25rem",
                                  height: "1.25rem",
                                  cursor: "pointer",
                                }}
                              />
                              <span>
                                {child.firstName} {child.lastName}
                                {child.allergies && " ⚠️"}
                              </span>
                            </label>
                          )}
                        </For>
                      </div>
                    </div>
                  </Show>
                )}
              </Show>

              <wa-input
                label="Date *"
                name="startDate"
                type="date"
                required
                value={getCurrentDate()}
              />

              <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "140px" }}>
                <wa-input
                  label="Start Time *"
                  name="startTime"
                  type="time"
                  required
                  value={getCurrentTime()}
                />
                <wa-input label="End Time *" name="endTime" type="time" required />
              </div>

              <Show when={submission.result instanceof Error}>
                <wa-callout variant="danger">{submission.result.message}</wa-callout>
              </Show>

              <div class="wa-cluster wa-gap-s" style={{ "justify-content": "flex-end" }}>
                <wa-button type="button" appearance="outlined" onClick={handleCloseModal}>
                  Cancel
                </wa-button>
                <wa-button
                  type="submit"
                  variant="success"
                  appearance="filled"
                  disabled={submission.pending || undefined}
                >
                  {submission.pending ? "Creating..." : "Create Session"}
                </wa-button>
              </div>
            </form>
      </Modal>
      </Show>
    </PageContent>
  );
}
