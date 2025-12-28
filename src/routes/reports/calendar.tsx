import { type RouteDefinition, A, createAsync } from "@solidjs/router";
import { Show, For, createSignal, createMemo, createEffect } from "solid-js";
import { getCareSessionsForRange } from "~/lib/schedule";

export const route = {
  preload() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
    getCareSessionsForRange(lastMonth, endOfLastMonth);
  },
} satisfies RouteDefinition;

export default function CalendarReport() {
  const today = new Date();
  const previousMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
  const previousYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
  
  const [selectedYear, setSelectedYear] = createSignal<number>(previousYear);
  const [selectedMonth, setSelectedMonth] = createSignal<number>(previousMonth); // Default to previous month

  const dateRange = createMemo(() => {
    const year = selectedYear();
    const month = selectedMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59);
    return { start, end };
  });

  const sessions = createAsync(() => {
    const range = dateRange();
    return getCareSessionsForRange(range.start, range.end);
  });

  const formatTime = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) {
      console.error("Invalid date:", date);
      return "Invalid";
    }
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDuration = (start: Date, end: Date) => {
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return `${hours.toFixed(1)}h`;
  };

  // Generate calendar days
  const calendarDays = createMemo(() => {
    const year = selectedYear();
    const month = selectedMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

    const days: Date[] = [];
    const current = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  });

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === selectedMonth() && date.getFullYear() === selectedYear();
  };

  const getSessionsForDay = (date: Date) => {
    const allSessions = sessions();
    if (!allSessions || allSessions.length === 0) return [];
    
    // Normalize the target date to local date components
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth();
    const targetDay = date.getDate();
    
    const daySessions = allSessions.filter((session) => {
      // Parse the session date - handle both Date objects and ISO strings
      const sessionDate = typeof session.scheduledStart === 'string' 
        ? new Date(session.scheduledStart) 
        : new Date(session.scheduledStart);
      
      // Check if date is valid
      if (isNaN(sessionDate.getTime())) {
        return false;
      }
      
      // Compare date components directly
      return (
        sessionDate.getFullYear() === targetYear &&
        sessionDate.getMonth() === targetMonth &&
        sessionDate.getDate() === targetDay
      );
    });
    
    return daySessions.sort((a, b) => {
      const aTime = new Date(a.scheduledStart).getTime();
      const bTime = new Date(b.scheduledStart).getTime();
      return aTime - bTime;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const monthName = createMemo(() => {
    return new Date(selectedYear(), selectedMonth(), 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  });

  const totalHours = createMemo(() => {
    const allSessions = sessions() || [];
    let total = 0;
    for (const session of allSessions) {
      const start = new Date(session.scheduledStart).getTime();
      const end = new Date(session.scheduledEnd).getTime();
      total += (end - start) / (1000 * 60 * 60);
    }
    return total.toFixed(1);
  });

  const totalSessions = createMemo(() => {
    return sessions()?.length || 0;
  });

  return (
    <div style={{ "max-width": "1200px", margin: "0 auto", padding: "1.5rem" }}>
      {/* Print Controls - Hidden when printing */}
      <div style={{ "margin-bottom": "1rem" }} class="no-print">
        <A
          href="/reports"
          style={{
            color: "#4299e1",
            "text-decoration": "none",
            "margin-bottom": "0.5rem",
            display: "inline-block",
          }}
        >
          ← Back to Reports
        </A>
        <div
          style={{
            display: "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "flex-wrap": "wrap",
            gap: "1rem",
            "margin-top": "0.5rem",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", "align-items": "center", "flex-wrap": "wrap" }}>
            <div>
              <label
                style={{
                  display: "block",
                  "margin-bottom": "0.25rem",
                  "font-size": "0.875rem",
                  color: "#4a5568",
                  "font-weight": "500",
                }}
              >
                Month
              </label>
              <select
                value={selectedMonth()}
                onChange={(e) => setSelectedMonth(parseInt(e.currentTarget.value))}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "0.875rem",
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option value={i}>
                    {new Date(selectedYear(), i, 1).toLocaleDateString("en-US", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  "margin-bottom": "0.25rem",
                  "font-size": "0.875rem",
                  color: "#4a5568",
                  "font-weight": "500",
                }}
              >
                Year
              </label>
              <select
                value={selectedYear()}
                onChange={(e) => setSelectedYear(parseInt(e.currentTarget.value))}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "0.875rem",
                }}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = today.getFullYear() - i;
                  return <option value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>
          <button
            onClick={handlePrint}
            style={{
              padding: "0.5rem 1rem",
              "background-color": "#4299e1",
              color: "white",
              border: "none",
              "border-radius": "4px",
              cursor: "pointer",
              "font-weight": "600",
              "font-size": "0.875rem",
            }}
          >
            🖨️ Print Calendar
          </button>
        </div>
      </div>

      {/* Report Header - Always visible */}
      <div style={{ "margin-bottom": "1rem", "text-align": "center" }} class="print-header">
        <h1 style={{ "font-size": "1.75rem", "font-weight": "700", color: "#2d3748", margin: "0 0 0.5rem 0" }} class="print-title no-print">
          Care Sessions Calendar
        </h1>
        <div style={{ "font-size": "1.125rem", color: "#4a5568", "margin-bottom": "0.5rem" }} class="print-month">
          {monthName()}
        </div>
        <div style={{ "font-size": "0.875rem", color: "#718096" }} class="print-summary">
          Total Sessions: {totalSessions()} | Total Hours: {totalHours()}h
        </div>
      </div>

      {/* Calendar */}
      <div
        style={{
          "background-color": "#fff",
          "border-radius": "8px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
        class="calendar-container"
      >
        {/* Day Headers */}
        <div
          style={{
            display: "grid",
            "grid-template-columns": "repeat(7, 1fr)",
            "background-color": "#f7fafc",
            borderBottom: "2px solid #e2e8f0",
          }}
          class="calendar-day-headers"
        >
          <For each={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}>
            {(day) => (
              <div
                style={{
                  padding: "0.75rem",
                  "text-align": "center",
                  "font-weight": "600",
                  color: "#4a5568",
                  "font-size": "0.875rem",
                }}
                class="calendar-day-header"
              >
                {day}
              </div>
            )}
          </For>
        </div>

        {/* Calendar Grid */}
        <Show
          when={sessions() !== undefined}
          fallback={
            <div style={{ padding: "2rem", "text-align": "center", color: "#718096" }}>
              Loading sessions...
            </div>
          }
        >
          <div style={{ display: "grid", "grid-template-columns": "repeat(7, 1fr)" }} class="calendar-grid">
            <For each={calendarDays()}>
              {(day) => {
                // Make daySessions reactive to sessions() changes
                const daySessions = createMemo(() => {
                  const sess = sessions();
                  if (!sess) return [];
                  return getSessionsForDay(day);
                });
                const isCurrentMonthDay = isCurrentMonth(day);
              const isToday =
                day.getDate() === today.getDate() &&
                day.getMonth() === today.getMonth() &&
                day.getFullYear() === today.getFullYear();

              return (
                <div
                  style={{
                    minHeight: "120px",
                    border: "1px solid #e2e8f0",
                    padding: "0.5rem",
                    "background-color": isCurrentMonthDay ? "#fff" : "#f7fafc",
                    position: "relative",
                  }}
                  class="calendar-day-cell"
                >
                  <div
                    style={{
                      "font-weight": isToday ? "700" : "400",
                      color: isCurrentMonthDay ? "#2d3748" : "#a0aec0",
                      "margin-bottom": "0.25rem",
                      "font-size": isToday ? "1rem" : "0.875rem",
                    }}
                    class="calendar-day-number"
                  >
                    {day.getDate()}
                  </div>
                  <div style={{ display: "flex", "flex-direction": "column", gap: "0.25rem" }} class="calendar-sessions">
                    <Show
                      when={daySessions().length > 0}
                      fallback={
                        <div
                          style={{
                            "font-size": "0.75rem",
                            color: "#a0aec0",
                            "font-style": "italic",
                          }}
                          class="no-sessions-text"
                        >
                          No sessions
                        </div>
                      }
                    >
                      <For each={daySessions()}>
                        {(session) => {
                          const startTime = new Date(session.scheduledStart);
                          const endTime = new Date(session.scheduledEnd);
                          const duration = formatDuration(startTime, endTime);

                          return (
                            <div
                              style={{
                                padding: "0.25rem 0.375rem",
                                "background-color": "#bee3f8",
                                color: "#2c5282",
                                "border-radius": "4px",
                                "font-size": "0.7rem",
                                "line-height": "1.3",
                                "border-left": "2px solid #2c5282",
                                "margin-bottom": "0.2rem",
                              }}
                              class="session-block"
                            >
                              <div style={{ "font-weight": "600", "font-size": "0.7rem", "margin-bottom": "0.125rem" }} class="session-family">
                                {session.family.familyName}
                              </div>
                              <Show when={session.children && session.children.length > 0}>
                                <div style={{ "font-size": "0.65rem", color: "#4a5568", "margin-bottom": "0.125rem" }} class="session-children">
                                  {session.children.map((c) => `${c.firstName} ${c.lastName}`).join(", ")}
                                </div>
                              </Show>
                              <div style={{ "font-size": "0.65rem", color: "#1a365d", "font-weight": "500" }} class="session-time">
                                {formatTime(startTime)} - {formatTime(endTime)} ({duration})
                              </div>
                            </div>
                          );
                        }}
                      </For>
                    </Show>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
        </Show>
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            
            /* Optimize for landscape orientation - single page */
            @page {
              size: landscape;
              margin: 0.05in 0.2in;
            }
            
            * {
              box-sizing: border-box;
            }
            
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              height: 100% !important;
            }
            
            /* Container optimization */
            div[style*="max-width"] {
              max-width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
              height: 100% !important;
            }
            
            /* Ultra-compact header for single page - override all inline styles */
            .print-header {
              page-break-after: avoid;
              margin-bottom: 0.05rem !important;
              padding: 0 !important;
              line-height: 1 !important;
              height: auto !important;
              text-align: center !important;
            }
            
            /* Hide title in print */
            .print-header h1.print-title,
            .print-title {
              display: none !important;
            }
            
            /* Month name - bigger for print */
            .print-header .print-month,
            .print-month {
              font-size: 0.85rem !important;
              margin: 0 0 0.02rem 0 !important;
              padding: 0 !important;
              line-height: 1 !important;
              display: block !important;
              font-weight: 600 !important;
            }
            
            /* Summary - show in print with appropriate size */
            .print-header .print-summary,
            .print-summary {
              font-size: 0.65rem !important;
              margin: 0 !important;
              padding: 0 !important;
              line-height: 1 !important;
              display: block !important;
            }
            
            /* Calendar container - maximize space */
            .calendar-container {
              page-break-inside: avoid;
              border-radius: 0 !important;
              border: 1px solid #2d3748 !important;
              margin-top: 0.02rem !important;
              height: calc(100% - 0.2in) !important;
              display: flex !important;
              flex-direction: column !important;
            }
            
            /* Day headers - ultra compact */
            .calendar-day-headers {
              padding: 0.08rem 0.06rem !important;
              border-bottom: 1px solid #2d3748 !important;
              flex-shrink: 0 !important;
            }
            
            .calendar-day-header {
              padding: 0.08rem 0.06rem !important;
              font-size: 0.6rem !important;
              font-weight: 700 !important;
              line-height: 1 !important;
            }
            
            /* Calendar grid - ensure proper layout */
            .calendar-grid {
              display: grid !important;
              grid-template-columns: repeat(7, 1fr) !important;
              flex: 1 !important;
              min-height: 0 !important;
            }
            
            /* Calendar day cells - fit on single page with header */
            /* Landscape: 11in - 0.1in margins = 10.9in usable */
            /* Header ~0.12in + Day headers ~0.12in = 0.24in */
            /* Remaining ~10.66in / 6 rows = ~1.78in per row, use 1.15in to be safe */
            .calendar-day-cell {
              min-height: 0 !important;
              height: 1.15in !important;
              max-height: 1.15in !important;
              padding: 0.08rem 0.08rem !important;
              border: 1px solid #cbd5e0 !important;
              overflow: hidden !important;
              display: flex !important;
              flex-direction: column !important;
            }
            
            /* Date numbers - compact */
            .calendar-day-number {
              font-size: 0.7rem !important;
              margin-bottom: 0.08rem !important;
              line-height: 1 !important;
              flex-shrink: 0 !important;
            }
            
            /* Sessions container */
            .calendar-sessions {
              gap: 0.08rem !important;
              flex: 1 !important;
              overflow: hidden !important;
              min-height: 0 !important;
            }
            
            /* Hide "No sessions" text in print */
            .no-sessions-text {
              display: none !important;
            }
            
            /* Session blocks - ultra compact for print */
            .session-block {
              padding: 0.1rem 0.15rem !important;
              margin-bottom: 0.06rem !important;
              font-size: 0.55rem !important;
              line-height: 1.1 !important;
              border-left-width: 1.5px !important;
            }
            
            .session-family {
              font-size: 0.6rem !important;
              font-weight: 700 !important;
              margin-bottom: 0.03rem !important;
              line-height: 1.1 !important;
            }
            
            .session-children {
              font-size: 0.5rem !important;
              margin-bottom: 0.03rem !important;
              line-height: 1.1 !important;
            }
            
            .session-time {
              font-size: 0.5rem !important;
              line-height: 1.1 !important;
            }
          }
        `}
      </style>
    </div>
  );
}

