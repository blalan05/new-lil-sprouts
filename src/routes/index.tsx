import { createAsync, type RouteDefinition, A, useSubmission } from "@solidjs/router";
import { Show, For, createSignal, createEffect } from "solid-js";
import { getUser } from "~/lib";
import { getUpcomingSessions } from "~/lib/schedule";
import { getRecentReports } from "~/lib/session-reports";
import { getFamilies } from "~/lib/families";
import { getFamily } from "~/lib/families";
import { createCareSchedule } from "~/lib/care-schedules";
import { getServices } from "~/lib/services";
import { getWeeklyStats, getDashboardStats, getStatsForPeriod } from "~/lib/stats";

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
  },
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => getUser(), { deferStream: true });
  const upcomingSessions = createAsync(() => getUpcomingSessions(10));
  const recentIncidents = createAsync(() => getRecentReports(10));
  const families = createAsync(() => getFamilies());
  const services = createAsync(() => getServices());
  const weeklyStats = createAsync(() => getWeeklyStats());
  const dashboardStats = createAsync(() => getDashboardStats());
  
  // Time period selection for hours and money widgets
  const [hoursPeriod, setHoursPeriod] = createSignal<"lastWeek" | "thisWeek" | "month" | "ytd">("thisWeek");
  const [moneyPeriod, setMoneyPeriod] = createSignal<"lastWeek" | "thisWeek" | "month" | "ytd">("thisWeek");
  
  const hoursStats = createAsync(() => getStatsForPeriod(hoursPeriod()));
  const moneyStats = createAsync(() => getStatsForPeriod(moneyPeriod()));
  const [showQuickAddModal, setShowQuickAddModal] = createSignal(false);
  const [selectedFamilyId, setSelectedFamilyId] = createSignal<string>("");
  
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
      if (!currentServiceId || currentServiceId === "" || (family && defaultId && defaultId !== currentServiceId)) {
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
    return new Date().toISOString().split("T")[0];
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
  };

  // Watch for successful submission
  createEffect(() => {
    if (submission.result && !(submission.result instanceof Error)) {
      handleCloseModal();
      window.location.reload();
    }
  });

  return (
    <main
      style={{
        "max-width": "1200px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <header
        style={{
          "margin-bottom": "2rem",
          "padding-bottom": "1rem",
          "border-bottom": "2px solid #e2e8f0",
          display: "flex",
          "justify-content": "space-between",
          "align-items": "flex-start",
          "flex-wrap": "wrap",
          gap: "1rem",
        }}
        class="flex-row-mobile"
      >
        <div>
          <h1
            style={{
              color: "#2d3748",
              "font-size": "2rem",
              "margin-bottom": "0.5rem",
            }}
          >
            Dashboard
          </h1>
          <Show when={user()}>
            <p style={{ color: "#718096", "font-size": "1.1rem" }}>
              Welcome back, <strong>{user()?.firstName || user()?.username}</strong>
            </p>
          </Show>
        </div>
        <button
          onClick={() => setShowQuickAddModal(true)}
          style={{
            padding: "0.75rem 1.5rem",
            "background-color": "#48bb78",
            color: "white",
            border: "none",
            "border-radius": "6px",
            "font-weight": "600",
            "font-size": "1rem",
            display: "inline-flex",
            "align-items": "center",
            gap: "0.5rem",
            "box-shadow": "0 2px 4px rgba(72, 187, 120, 0.3)",
            transition: "all 0.2s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#38a169";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(72, 187, 120, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#48bb78";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(72, 187, 120, 0.3)";
          }}
        >
          <span>+</span>
          <span>Quick Add Session</span>
        </button>
      </header>

      {/* Hours and Money Stats with Period Selectors */}
      <div
        style={{
          display: "grid",
          "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          "margin-bottom": "2rem",
        }}
      >
        {/* Hours Widget */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "1rem",
            }}
          >
            <div style={{ "font-size": "1rem", "font-weight": "600", color: "#2d3748" }}>Hours</div>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button
                onClick={() => setHoursPeriod("lastWeek")}
                style={{
                  padding: "0.375rem 0.75rem",
                  border: `2px solid ${hoursPeriod() === "lastWeek" ? "#2d3748" : "#e2e8f0"}`,
                  "background-color": hoursPeriod() === "lastWeek" ? "#2d3748" : "#fff",
                  color: hoursPeriod() === "lastWeek" ? "#fff" : "#2d3748",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-size": "0.75rem",
                  "font-weight": "600",
                  transition: "all 0.2s",
                }}
              >
                Last Week
              </button>
              <button
                onClick={() => setHoursPeriod("thisWeek")}
                style={{
                  padding: "0.375rem 0.75rem",
                  border: `2px solid ${hoursPeriod() === "thisWeek" ? "#2d3748" : "#e2e8f0"}`,
                  "background-color": hoursPeriod() === "thisWeek" ? "#2d3748" : "#fff",
                  color: hoursPeriod() === "thisWeek" ? "#fff" : "#2d3748",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-size": "0.75rem",
                  "font-weight": "600",
                  transition: "all 0.2s",
                }}
              >
                Week
              </button>
              <button
                onClick={() => setHoursPeriod("month")}
                style={{
                  padding: "0.375rem 0.75rem",
                  border: `2px solid ${hoursPeriod() === "month" ? "#2d3748" : "#e2e8f0"}`,
                  "background-color": hoursPeriod() === "month" ? "#2d3748" : "#fff",
                  color: hoursPeriod() === "month" ? "#fff" : "#2d3748",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-size": "0.75rem",
                  "font-weight": "600",
                  transition: "all 0.2s",
                }}
              >
                Month
              </button>
              <button
                onClick={() => setHoursPeriod("ytd")}
                style={{
                  padding: "0.375rem 0.75rem",
                  border: `2px solid ${hoursPeriod() === "ytd" ? "#2d3748" : "#e2e8f0"}`,
                  "background-color": hoursPeriod() === "ytd" ? "#2d3748" : "#fff",
                  color: hoursPeriod() === "ytd" ? "#fff" : "#2d3748",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-size": "0.75rem",
                  "font-weight": "600",
                  transition: "all 0.2s",
                }}
              >
                YTD
              </button>
            </div>
          </div>
          <Show when={hoursStats()}>
            <div style={{ "font-size": "2.5rem", "font-weight": "700", color: "#2d3748" }}>
              {hoursStats()?.hours.toFixed(1) || "0.0"}
            </div>
          </Show>
        </div>

        {/* Money Widget */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "1rem",
            }}
          >
            <div style={{ "font-size": "1rem", "font-weight": "600", color: "#2d3748" }}>Money</div>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button
                onClick={() => setMoneyPeriod("lastWeek")}
                style={{
                  padding: "0.375rem 0.75rem",
                  border: `2px solid ${moneyPeriod() === "lastWeek" ? "#2d3748" : "#e2e8f0"}`,
                  "background-color": moneyPeriod() === "lastWeek" ? "#2d3748" : "#fff",
                  color: moneyPeriod() === "lastWeek" ? "#fff" : "#2d3748",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-size": "0.75rem",
                  "font-weight": "600",
                  transition: "all 0.2s",
                }}
              >
                Last Week
              </button>
              <button
                onClick={() => setMoneyPeriod("thisWeek")}
                style={{
                  padding: "0.375rem 0.75rem",
                  border: `2px solid ${moneyPeriod() === "thisWeek" ? "#2d3748" : "#e2e8f0"}`,
                  "background-color": moneyPeriod() === "thisWeek" ? "#2d3748" : "#fff",
                  color: moneyPeriod() === "thisWeek" ? "#fff" : "#2d3748",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-size": "0.75rem",
                  "font-weight": "600",
                  transition: "all 0.2s",
                }}
              >
                Week
              </button>
              <button
                onClick={() => setMoneyPeriod("month")}
                style={{
                  padding: "0.375rem 0.75rem",
                  border: `2px solid ${moneyPeriod() === "month" ? "#2d3748" : "#e2e8f0"}`,
                  "background-color": moneyPeriod() === "month" ? "#2d3748" : "#fff",
                  color: moneyPeriod() === "month" ? "#fff" : "#2d3748",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-size": "0.75rem",
                  "font-weight": "600",
                  transition: "all 0.2s",
                }}
              >
                Month
              </button>
              <button
                onClick={() => setMoneyPeriod("ytd")}
                style={{
                  padding: "0.375rem 0.75rem",
                  border: `2px solid ${moneyPeriod() === "ytd" ? "#2d3748" : "#e2e8f0"}`,
                  "background-color": moneyPeriod() === "ytd" ? "#2d3748" : "#fff",
                  color: moneyPeriod() === "ytd" ? "#fff" : "#2d3748",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-size": "0.75rem",
                  "font-weight": "600",
                  transition: "all 0.2s",
                }}
              >
                YTD
              </button>
            </div>
          </div>
          <Show when={moneyStats()}>
            <div style={{ "font-size": "2.5rem", "font-weight": "700", color: "#48bb78" }}>
              ${moneyStats()?.money.toFixed(2) || "0.00"}
            </div>
          </Show>
        </div>
      </div>

      {/* Other Dashboard Stats */}
      <Show when={dashboardStats()}>
        <div
          style={{
            display: "grid",
            "grid-template-columns": "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            "margin-bottom": "2rem",
          }}
        >

          <Show when={dashboardStats()}>
            <div
              style={{
                "background-color": "#fff",
                padding: "1.5rem",
                "border-radius": "8px",
                border: "1px solid #e2e8f0",
                "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ "font-size": "0.875rem", color: "#718096", "margin-bottom": "0.5rem" }}>
                Hours This Month
              </div>
              <div style={{ "font-size": "2rem", "font-weight": "700", color: "#2d3748" }}>
                {dashboardStats()?.thisMonthHours.toFixed(1) || "0.0"}
              </div>
              <div style={{ "font-size": "0.75rem", color: "#a0aec0", "margin-top": "0.25rem" }}>
                ${dashboardStats()?.thisMonthMoney.toFixed(2) || "0.00"} earned
              </div>
            </div>

            <div
              style={{
                "background-color": "#fff",
                padding: "1.5rem",
                "border-radius": "8px",
                border: "1px solid #e2e8f0",
                "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ "font-size": "0.875rem", color: "#718096", "margin-bottom": "0.5rem" }}>
                Upcoming Sessions
              </div>
              <div style={{ "font-size": "2rem", "font-weight": "700", color: "#4299e1" }}>
                {dashboardStats()?.upcomingSessions || 0}
              </div>
              <div style={{ "font-size": "0.75rem", color: "#a0aec0", "margin-top": "0.25rem" }}>
                Next 7 days
              </div>
            </div>

            <div
              style={{
                "background-color": "#fff",
                padding: "1.5rem",
                "border-radius": "8px",
                border: "1px solid #e2e8f0",
                "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ "font-size": "0.875rem", color: "#718096", "margin-bottom": "0.5rem" }}>
                Unpaid Sessions
              </div>
              <div style={{ "font-size": "2rem", "font-weight": "700", color: "#ed8936" }}>
                {dashboardStats()?.unpaidSessions || 0}
              </div>
              <div style={{ "font-size": "0.75rem", color: "#a0aec0", "margin-top": "0.25rem" }}>
                Awaiting payment
              </div>
            </div>

            <div
              style={{
                "background-color": "#fff",
                padding: "1.5rem",
                "border-radius": "8px",
                border: "1px solid #e2e8f0",
                "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ "font-size": "0.875rem", color: "#718096", "margin-bottom": "0.5rem" }}>
                Active Families
              </div>
              <div style={{ "font-size": "2rem", "font-weight": "700", color: "#805ad5" }}>
                {dashboardStats()?.activeFamilies || 0}
              </div>
              <div style={{ "font-size": "0.75rem", color: "#a0aec0", "margin-top": "0.25rem" }}>
                This month
              </div>
            </div>

            <Show when={dashboardStats()?.averageHourlyRate && dashboardStats()!.averageHourlyRate > 0}>
              <div
                style={{
                  "background-color": "#fff",
                  padding: "1.5rem",
                  "border-radius": "8px",
                  border: "1px solid #e2e8f0",
                  "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ "font-size": "0.875rem", color: "#718096", "margin-bottom": "0.5rem" }}>
                  Avg Hourly Rate
                </div>
                <div style={{ "font-size": "2rem", "font-weight": "700", color: "#2d3748" }}>
                  ${dashboardStats()?.averageHourlyRate.toFixed(2) || "0.00"}
                </div>
                <div style={{ "font-size": "0.75rem", color: "#a0aec0", "margin-top": "0.25rem" }}>
                  This month
                </div>
              </div>
            </Show>
          </Show>
        </div>
      </Show>

      {/* Upcoming Sessions and Incidents */}
      <div
        style={{
          display: "grid",
          "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          "margin-bottom": "2rem",
        }}
        class="grid-responsive"
      >
        {/* Upcoming Sessions */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "1rem",
            }}
          >
            <h2
              style={{
                "font-size": "1.25rem",
                color: "#2d3748",
                margin: 0,
              }}
            >
              Upcoming Sessions
            </h2>
            <A
              href="/schedule"
              style={{
                color: "#4299e1",
                "text-decoration": "none",
                "font-size": "0.875rem",
              }}
            >
              View All →
            </A>
          </div>
          <Show
            when={!upcomingSessions.loading && upcomingSessions()}
            fallback={
              <div style={{ "text-align": "center", padding: "2rem", color: "#718096" }}>
                Loading...
              </div>
            }
          >
            <Show
              when={upcomingSessions()?.length}
              fallback={
                <div style={{ "text-align": "center", padding: "2rem", color: "#718096" }}>
                  No upcoming sessions scheduled
                </div>
              }
            >
              <div style={{ display: "flex", "flex-direction": "column", gap: "0.75rem" }}>
                <For each={upcomingSessions()}>
                  {(session) => {
                    const sessionDate = new Date(session.scheduledStart);
                    const isToday =
                      sessionDate.toDateString() === new Date().toDateString();
                    const isTomorrow =
                      sessionDate.toDateString() ===
                      new Date(Date.now() + 86400000).toDateString();

                    const statusColors = {
                      SCHEDULED: { bg: "#bee3f8", color: "#2c5282" },
                      IN_PROGRESS: { bg: "#feebc8", color: "#7c2d12" },
                      COMPLETED: { bg: "#c6f6d5", color: "#276749" },
                      CANCELLED: { bg: "#fed7d7", color: "#c53030" },
                    }[session.status] || { bg: "#e2e8f0", color: "#2d3748" };

                    return (
                      <A
                        href={`/families/${session.familyId}/sessions/${session.id}`}
                        style={{
                          padding: "1rem",
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
                            "margin-bottom": "0.5rem",
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
                              <h3
                                style={{
                                  "font-size": "1rem",
                                  color: "#2d3748",
                                  margin: 0,
                                  "font-weight": "600",
                                }}
                              >
                                {session.family.familyName}
                              </h3>
                              <span
                                style={{
                                  padding: "0.125rem 0.5rem",
                                  "border-radius": "9999px",
                                  "background-color": statusColors.bg,
                                  color: statusColors.color,
                                  "font-size": "0.75rem",
                                  "font-weight": "600",
                                }}
                              >
                                {session.status}
                              </span>
                              {session.isConfirmed && (
                                <span
                                  style={{
                                    padding: "0.125rem 0.5rem",
                                    "border-radius": "9999px",
                                    "background-color": "#c6f6d5",
                                    color: "#276749",
                                    "font-size": "0.75rem",
                                    "font-weight": "600",
                                  }}
                                >
                                  ✓ Confirmed
                                </span>
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
                                color: isToday
                                  ? "#e53e3e"
                                  : isTomorrow
                                    ? "#ed8936"
                                    : "#2d3748",
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
                              {sessionDate.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
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
        </div>

        {/* Recent Incidents */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "1rem",
            }}
          >
            <h2
              style={{
                "font-size": "1.25rem",
                color: "#2d3748",
                margin: 0,
              }}
            >
              Recent Incidents & Reports
            </h2>
            <A
              href="/reports"
              style={{
                color: "#4299e1",
                "text-decoration": "none",
                "font-size": "0.875rem",
              }}
            >
              View All →
            </A>
          </div>
          <Show
            when={!recentIncidents.loading && recentIncidents()}
            fallback={
              <div style={{ "text-align": "center", padding: "2rem", color: "#718096" }}>
                Loading...
              </div>
            }
          >
            <Show
              when={recentIncidents()?.length}
              fallback={
                <div style={{ "text-align": "center", padding: "2rem", color: "#718096" }}>
                  No recent incidents or reports
                </div>
              }
            >
              <div style={{ display: "flex", "flex-direction": "column", gap: "0.75rem" }}>
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
                    const isToday =
                      reportDate.toDateString() === new Date().toDateString();

                    return (
                      <A
                        href={`/families/${report.careSession.family.id}/sessions/${report.careSessionId}`}
                        style={{
                          padding: "1rem",
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
                            "margin-bottom": "0.5rem",
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
                              <span style={{ "font-size": "1.25rem" }}>
                                {severityColors.icon}
                              </span>
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
                              {reportDate.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
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
        </div>
      </div>

      {/* Quick Add Session Modal */}
      <Show when={showQuickAddModal()}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            "background-color": "rgba(0, 0, 0, 0.5)",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "z-index": 1000,
            padding: "2rem",
          }}
          class="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div
            style={{
              "background-color": "#fff",
              "border-radius": "8px",
              padding: "2rem",
              "max-width": "500px",
              width: "100%",
              "max-height": "90vh",
              overflow: "auto",
              "box-shadow": "0 10px 25px rgba(0, 0, 0, 0.2)",
            }}
            class="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                "justify-content": "space-between",
                "align-items": "center",
                "margin-bottom": "1.5rem",
              }}
            >
              <h2 style={{ color: "#2d3748", "font-size": "1.5rem", margin: 0 }}>
                Quick Add Session
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: "none",
                  border: "none",
                  "font-size": "1.5rem",
                  color: "#718096",
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  "line-height": 1,
                }}
              >
                ×
              </button>
            </div>

            <form
              action={createCareSchedule}
              method="post"
            >
              <input type="hidden" name="recurrence" value="ONCE" />

              <div style={{ "margin-bottom": "1.5rem" }}>
                <label
                  for="serviceId"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  Service *
                </label>
                <Show
                  when={services()}
                  fallback={
                    <div style={{ padding: "0.75rem", color: "#718096" }}>Loading services...</div>
                  }
                >
                  <select
                    id="serviceId"
                    name="serviceId"
                    required
                    value={serviceId()}
                    onChange={(e) => setServiceId(e.currentTarget.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                      "font-size": "1rem",
                      "margin-bottom": "1.5rem",
                    }}
                  >
                    <Show
                      when={selectedFamily()?.services && selectedFamily()!.services.length > 0}
                      fallback={
                        <>
                          <option value="">Select a service...</option>
                          <For each={services()}>
                            {(service) => (
                              <option value={service.id}>
                                {service.name}
                                {service.defaultHourlyRate &&
                                  ` ($${service.defaultHourlyRate}/hr${service.pricingType === "PER_CHILD" ? " per child" : ""})`}
                              </option>
                            )}
                          </For>
                        </>
                      }
                    >
                      <For each={selectedFamily()?.services || []}>
                        {(fs) => (
                          <option value={fs.service.id}>
                            {fs.service.name}
                            {fs.service.defaultHourlyRate &&
                              ` ($${fs.service.defaultHourlyRate}/hr${fs.service.pricingType === "PER_CHILD" ? " per child" : ""})`}
                          </option>
                        )}
                      </For>
                    </Show>
                  </select>
                  <Show when={selectedFamilyId() && (!selectedFamily()?.services || selectedFamily()!.services.length === 0)}>
                    <p style={{ "margin-top": "0.5rem", "font-size": "0.875rem", color: "#718096" }}>
                      No services assigned to this family. <A href={`/families/${selectedFamilyId()}/edit`} style={{ color: "#4299e1" }}>Assign services</A> to default this selection.
                    </p>
                  </Show>
                </Show>
              </div>

              <div style={{ "margin-bottom": "1.5rem" }}>
                <label
                  for="familyId"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  Family *
                </label>
                <select
                  id="familyId"
                  name="familyId"
                  required
                  value={selectedFamilyId()}
                  onChange={(e) => setSelectedFamilyId(e.currentTarget.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                  }}
                >
                  <option value="">Select a family...</option>
                  <For each={families()}>
                    {(family) => (
                      <option value={family.id}>{family.familyName}</option>
                    )}
                  </For>
                </select>
              </div>

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
                          return selectedService?.requiresChildren ? "Children *" : "Student (optional)";
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

              <div style={{ "margin-bottom": "1.5rem" }}>
                <label
                  for="startDate"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  Date *
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  value={getCurrentDate()}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  "grid-template-columns": "1fr 1fr",
                  gap: "1rem",
                  "margin-bottom": "1.5rem",
                }}
              >
                <div>
                  <label
                    for="startTime"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                    }}
                  >
                    Start Time *
                  </label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    required
                    value={getCurrentTime()}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                      "font-size": "1rem",
                    }}
                  />
                </div>
                <div>
                  <label
                    for="endTime"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                    }}
                  >
                    End Time *
                  </label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                      "font-size": "1rem",
                    }}
                  />
                </div>
              </div>

              <Show when={submission.result instanceof Error}>
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
                  {submission.result.message}
                </div>
              </Show>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  "justify-content": "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: "0.75rem 1.5rem",
                    "background-color": "#edf2f7",
                    color: "#2d3748",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    cursor: "pointer",
                    "font-weight": "600",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submission.pending}
                  style={{
                    padding: "0.75rem 1.5rem",
                    "background-color": "#48bb78",
                    color: "white",
                    border: "none",
                    "border-radius": "4px",
                    cursor: submission.pending ? "not-allowed" : "pointer",
                    opacity: submission.pending ? "0.6" : "1",
                    "font-weight": "600",
                  }}
                >
                  {submission.pending ? "Creating..." : "Create Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Show>
    </main>
  );
}
