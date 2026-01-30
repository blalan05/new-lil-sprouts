import { createAsync, type RouteDefinition, A, useSubmission } from "@solidjs/router";
import { createSignal, Show, For, createMemo, createResource, createEffect } from "solid-js";
import { getCareSessionsForRange, getUnavailabilitiesForRange } from "~/lib/schedule";
import { getUpcomingUnavailabilities, deleteUnavailability } from "~/lib/unavailability";
import { getServices } from "~/lib/services";
import { createCareSchedule } from "~/lib/care-schedules";
import { getFamilies, getFamily } from "~/lib/families";
import { formatTimeLocal } from "~/lib/datetime";

export const route = {
  preload() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
    getCareSessionsForRange(startOfMonth, endOfMonth);
    getUnavailabilitiesForRange(startOfMonth, endOfMonth);
    getUpcomingUnavailabilities();
    getFamilies();
    getServices();
  },
  info: {
    ssr: false, // Disable SSR to prevent timezone mismatch between server and client
  },
} satisfies RouteDefinition;

type ViewType = "month" | "week" | "day" | "list";

export default function SchedulePage() {
  const [view, setView] = createSignal<ViewType>("month");
  const [currentDate, setCurrentDate] = createSignal(new Date());
  const [searchTerm, setSearchTerm] = createSignal<string>("");
  const services = createAsync(() => getServices());
  const [serviceFilter, setServiceFilter] = createSignal<string>("ALL");
  const [sortField, setSortField] = createSignal<"date" | "family" | "status">("date");
  const [sortDirection, setSortDirection] = createSignal<"asc" | "desc">("asc");

  // Calculate date range based on view
  const getDateRange = () => {
    const date = currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    if (view() === "month") {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0, 23, 59, 59);
      return { start, end };
    } else if (view() === "week") {
      const dayOfWeek = date.getDay();
      const start = new Date(year, month, day - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    } else if (view() === "day") {
      // day view
      const start = new Date(year, month, day);
      start.setHours(0, 0, 0, 0);
      const end = new Date(year, month, day);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    } else {
      // list view - show past 30 days and next 90 days for comprehensive view
      const start = new Date();
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setDate(end.getDate() + 90);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  };

  const dateRange = () => getDateRange();

  // Create a source signal that changes when date or view changes
  const dateRangeSource = createMemo(() => {
    const date = currentDate();
    const currentView = view();
    const range = getDateRange();
    return { start: range.start, end: range.end, key: `${date.getTime()}-${currentView}` };
  });

  // Use createResource which properly tracks reactive dependencies
  const [sessions] = createResource(dateRangeSource, async (source) => {
    return getCareSessionsForRange(source.start, source.end);
  });

  const [unavailabilities] = createResource(dateRangeSource, async (source) => {
    return getUnavailabilitiesForRange(source.start, source.end);
  });
  const upcomingUnavailabilities = createAsync(() => getUpcomingUnavailabilities());
  const [showUnavailabilityPanel, setShowUnavailabilityPanel] = createSignal(false);
  const [showAddSessionModal, setShowAddSessionModal] = createSignal(false);
  const [selectedDate, setSelectedDate] = createSignal<string>("");
  const [selectedFamilyId, setSelectedFamilyId] = createSignal<string>("");
  const families = createAsync(() => getFamilies());
  const submission = useSubmission(createCareSchedule);

  const selectedFamily = createAsync(() => {
    const id = selectedFamilyId();
    return id ? getFamily(id) : null;
  });

  const [serviceId, setServiceId] = createSignal<string>("");

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

  createEffect(() => {
    const family = selectedFamily();
    const allServices = services();
    const currentServiceId = serviceId();

    if (allServices && allServices.length > 0) {
      const defaultId = defaultServiceId();
      if (
        !currentServiceId ||
        currentServiceId === "" ||
        (family && defaultId && defaultId !== currentServiceId)
      ) {
        if (defaultId) {
          setServiceId(defaultId);
        } else if (allServices.length > 0) {
          setServiceId(allServices[0].id);
        }
      }
    }
  });

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
    setShowAddSessionModal(false);
    setSelectedFamilyId("");
    setSelectedDate("");
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    setSelectedDate(dateStr);
    setShowAddSessionModal(true);
  };

  createEffect(() => {
    if (submission.result && !(submission.result instanceof Error)) {
      handleCloseModal();
      window.location.reload();
    }
  });

  const navigateDate = (direction: "prev" | "next") => {
    const date = new Date(currentDate());
    if (view() === "month") {
      date.setMonth(date.getMonth() + (direction === "next" ? 1 : -1));
    } else if (view() === "week") {
      date.setDate(date.getDate() + (direction === "next" ? 7 : -7));
    } else {
      date.setDate(date.getDate() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(date);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle view change
  const handleViewChange = (newView: ViewType) => {
    setView(newView);
  };

  const formatDateHeader = () => {
    const date = currentDate();
    if (view() === "month") {
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } else if (view() === "week") {
      const range = getDateRange();
      return `${range.start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${range.end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

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

  const handleDeleteUnavailability = async (id: string) => {
    if (confirm("Are you sure you want to delete this unavailability period?")) {
      await deleteUnavailability(id);
      window.location.reload();
    }
  };

  return (
    <main
      style={{
        "max-width": "1600px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <header style={{ "margin-bottom": "2rem" }}>
        <div
          style={{
            display: "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "margin-bottom": "1rem",
            "flex-wrap": "wrap",
            gap: "1rem",
          }}
          class="flex-row-mobile"
        >
          <div
            style={{ display: "flex", "align-items": "center", gap: "1rem", "flex-wrap": "wrap" }}
          >
            <A
              href="/"
              style={{
                color: "#4299e1",
                "text-decoration": "none",
                display: "inline-block",
              }}
            >
              ← Back to Dashboard
            </A>
            <h1 style={{ color: "#2d3748", "font-size": "2rem", margin: 0 }}>Schedule</h1>
          </div>
          <div
            style={{ display: "flex", gap: "0.5rem", "flex-wrap": "wrap" }}
            class="calendar-view-buttons"
          >
            <button
              onClick={() => setShowUnavailabilityPanel(!showUnavailabilityPanel())}
              style={{
                padding: "0.5rem 1rem",
                "background-color": showUnavailabilityPanel() ? "#4299e1" : "#edf2f7",
                color: showUnavailabilityPanel() ? "white" : "#2d3748",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                cursor: "pointer",
                "font-size": "0.875rem",
              }}
            >
              {showUnavailabilityPanel() ? "Hide" : "Show"} Unavailability
            </button>
            <button
              onClick={() => {
                setSelectedDate("");
                setShowAddSessionModal(true);
              }}
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#48bb78",
                color: "white",
                border: "none",
                "border-radius": "4px",
                cursor: "pointer",
                "font-size": "0.875rem",
                "font-weight": "600",
                display: "inline-flex",
                "align-items": "center",
                gap: "0.375rem",
              }}
            >
              <span>+</span>
              <span>Add Care Session</span>
            </button>
            <A
              href="/unavailability/new"
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#e53e3e",
                color: "white",
                border: "none",
                "border-radius": "4px",
                "text-decoration": "none",
                "font-size": "0.875rem",
              }}
            >
              + Block Time
            </A>
          </div>
        </div>

        {/* View Switcher and Navigation */}
        <div
          style={{
            display: "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "margin-top": "1rem",
            "flex-wrap": "wrap",
            gap: "1rem",
          }}
          class="calendar-controls flex-row-mobile"
        >
          <div
            style={{ display: "flex", gap: "0.5rem", "flex-wrap": "wrap" }}
            class="calendar-view-buttons"
          >
            <button
              onClick={() => handleViewChange("month")}
              style={{
                padding: "0.5rem 1rem",
                "background-color": view() === "month" ? "#4299e1" : "#edf2f7",
                color: view() === "month" ? "white" : "#2d3748",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                cursor: "pointer",
                "font-weight": view() === "month" ? "600" : "400",
              }}
            >
              Month
            </button>
            <button
              onClick={() => handleViewChange("week")}
              style={{
                padding: "0.5rem 1rem",
                "background-color": view() === "week" ? "#4299e1" : "#edf2f7",
                color: view() === "week" ? "white" : "#2d3748",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                cursor: "pointer",
                "font-weight": view() === "week" ? "600" : "400",
              }}
            >
              Week
            </button>
            <button
              onClick={() => handleViewChange("day")}
              style={{
                padding: "0.5rem 1rem",
                "background-color": view() === "day" ? "#4299e1" : "#edf2f7",
                color: view() === "day" ? "white" : "#2d3748",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                cursor: "pointer",
                "font-weight": view() === "day" ? "600" : "400",
              }}
            >
              Day
            </button>
            <button
              onClick={() => handleViewChange("list")}
              style={{
                padding: "0.5rem 1rem",
                "background-color": view() === "list" ? "#4299e1" : "#edf2f7",
                color: view() === "list" ? "white" : "#2d3748",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                cursor: "pointer",
                "font-weight": view() === "list" ? "600" : "400",
              }}
            >
              List
            </button>
          </div>
          <Show when={view() !== "list"}>
            <div
              style={{
                display: "flex",
                "align-items": "center",
                gap: "0.5rem",
                "flex-wrap": "wrap",
              }}
            >
              <button
                onClick={() => navigateDate("prev")}
                style={{
                  padding: "0.5rem",
                  "background-color": "#edf2f7",
                  color: "#2d3748",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-size": "1rem",
                  "min-width": "40px",
                }}
              >
                ←
              </button>
              <button
                onClick={goToToday}
                style={{
                  padding: "0.5rem 1rem",
                  "background-color": "#4299e1",
                  color: "white",
                  border: "none",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-weight": "600",
                }}
              >
                Today
              </button>
              <button
                onClick={() => navigateDate("next")}
                style={{
                  padding: "0.5rem",
                  "background-color": "#edf2f7",
                  color: "#2d3748",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-size": "1rem",
                  "min-width": "40px",
                }}
              >
                →
              </button>
              <span style={{ color: "#2d3748", "font-weight": "500", "margin-left": "0.5rem" }}>
                {formatDateHeader()}
              </span>
            </div>
          </Show>
        </div>
      </header>

      {/* Unavailability Panel */}
      <Show when={showUnavailabilityPanel()}>
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "margin-bottom": "2rem",
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
            <h2 style={{ color: "#2d3748", "font-size": "1.25rem", margin: 0 }}>
              Upcoming Unavailable Times
            </h2>
            <A
              href="/unavailability/new"
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#e53e3e",
                color: "white",
                border: "none",
                "border-radius": "4px",
                "text-decoration": "none",
                "font-size": "0.875rem",
              }}
            >
              + Add New
            </A>
          </div>
          <Show
            when={upcomingUnavailabilities()?.length}
            fallback={
              <p style={{ color: "#718096", "text-align": "center", padding: "2rem" }}>
                No upcoming unavailable times. Click "+ Add New" to block out time.
              </p>
            }
          >
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <For each={upcomingUnavailabilities()}>
                {(unavailability) => (
                  <div
                    style={{
                      padding: "1rem",
                      "background-color": "#fff5f5",
                      border: "1px solid #feb2b2",
                      "border-radius": "4px",
                      display: "flex",
                      "justify-content": "space-between",
                      "align-items": "start",
                    }}
                  >
                    <div style={{ flex: "1" }}>
                      <div
                        style={{
                          display: "flex",
                          "align-items": "center",
                          gap: "0.75rem",
                          "margin-bottom": "0.5rem",
                        }}
                      >
                        <h3 style={{ color: "#2d3748", margin: 0, "font-size": "1rem" }}>
                          {unavailability.reason || "Time Off"}
                        </h3>
                        <span
                          style={{
                            padding: "0.25rem 0.5rem",
                            "border-radius": "9999px",
                            "background-color": "#fed7d7",
                            color: "#c53030",
                            "font-size": "0.75rem",
                            "font-weight": "600",
                          }}
                        >
                          {unavailability.allDay ? "All Day" : "Specific Hours"}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "2rem", "font-size": "0.875rem" }}>
                        <div>
                          <span style={{ color: "#718096" }}>From: </span>
                          <span style={{ color: "#2d3748", "font-weight": "500" }}>
                            {formatDate(unavailability.startDate)}
                            {!unavailability.allDay &&
                              unavailability.startTime &&
                              ` at ${formatTime(unavailability.startTime)}`}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "#718096" }}>To: </span>
                          <span style={{ color: "#2d3748", "font-weight": "500" }}>
                            {formatDate(unavailability.endDate)}
                            {!unavailability.allDay &&
                              unavailability.endTime &&
                              ` at ${formatTime(unavailability.endTime)}`}
                          </span>
                        </div>
                      </div>
                      <Show when={unavailability.notes}>
                        <p
                          style={{
                            color: "#718096",
                            "font-size": "0.875rem",
                            margin: "0.5rem 0 0 0",
                          }}
                        >
                          {unavailability.notes}
                        </p>
                      </Show>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <A
                        href={`/unavailability/${unavailability.id}/edit`}
                        style={{
                          padding: "0.5rem 1rem",
                          "background-color": "#edf2f7",
                          color: "#2d3748",
                          border: "1px solid #cbd5e0",
                          "border-radius": "4px",
                          "text-decoration": "none",
                          "font-size": "0.875rem",
                        }}
                      >
                        Edit
                      </A>
                      <button
                        onClick={() => handleDeleteUnavailability(unavailability.id)}
                        style={{
                          padding: "0.5rem 1rem",
                          "background-color": "#fff5f5",
                          color: "#c53030",
                          border: "1px solid #feb2b2",
                          "border-radius": "4px",
                          cursor: "pointer",
                          "font-size": "0.875rem",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </Show>

      <Show
        when={!sessions.loading && !unavailabilities.loading}
        fallback={
          <div style={{ "text-align": "center", padding: "3rem" }}>Loading schedule...</div>
        }
      >
        {view() === "month" && (
          <MonthView
            currentDate={currentDate()}
            sessions={sessions() || []}
            unavailabilities={unavailabilities() || []}
            onDateClick={handleDateClick}
          />
        )}
        {view() === "week" && (
          <WeekView
            currentDate={currentDate()}
            sessions={sessions() || []}
            unavailabilities={unavailabilities() || []}
          />
        )}
        {view() === "day" && (
          <DayView
            currentDate={currentDate()}
            sessions={sessions() || []}
            unavailabilities={unavailabilities() || []}
          />
        )}
        {view() === "list" && (
          <ListView
            sessions={sessions() || []}
            searchTerm={searchTerm()}
            onSearchChange={setSearchTerm}
            serviceFilter={serviceFilter()}
            onServiceFilterChange={setServiceFilter}
            services={services()}
            sortField={sortField()}
            onSortFieldChange={setSortField}
            sortDirection={sortDirection()}
            onSortDirectionChange={setSortDirection}
          />
        )}
      </Show>

      {/* Add Care Session Modal */}
      <Show when={showAddSessionModal()}>
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
                Add Care Session
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

            <form action={createCareSchedule} method="post">
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
                  <Show
                    when={
                      selectedFamilyId() &&
                      (!selectedFamily()?.services || selectedFamily()!.services.length === 0)
                    }
                  >
                    <p
                      style={{ "margin-top": "0.5rem", "font-size": "0.875rem", color: "#718096" }}
                    >
                      No services assigned to this family.{" "}
                      <A href={`/families/${selectedFamilyId()}/edit`} style={{ color: "#4299e1" }}>
                        Assign services
                      </A>{" "}
                      to default this selection.
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
                    {(family) => <option value={family.id}>{family.familyName}</option>}
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

// List View Component
function ListView(props: {
  sessions: any[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (filter: string) => void;
  services?: Array<{ id: string; name: string; code: string }>;
  sortField: "date" | "family" | "status";
  onSortFieldChange: (field: "date" | "family" | "status") => void;
  sortDirection: "asc" | "desc";
  onSortDirectionChange: (dir: "asc" | "desc") => void;
}) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: string | Date) => {
    return formatTimeLocal(date);
  };

  const formatDuration = (start: Date, end: Date) => {
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return `${hours.toFixed(1)}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return { bg: "#bee3f8", color: "#2c5282" };
      case "IN_PROGRESS":
        return { bg: "#feebc8", color: "#7c2d12" };
      case "COMPLETED":
        return { bg: "#c6f6d5", color: "#276749" };
      case "CANCELLED":
        return { bg: "#fed7d7", color: "#c53030" };
      default:
        return { bg: "#e2e8f0", color: "#2d3748" };
    }
  };

  // Filter sessions by search term and service type
  const filteredSessions = () => {
    let filtered = props.sessions;

    // Filter by service if provided
    if (props.serviceFilter && props.serviceFilter !== "ALL") {
      filtered = filtered.filter((session) => session.service?.id === props.serviceFilter);
    }

    // Filter by search term
    const search = props.searchTerm.toLowerCase();
    if (!search) return filtered;

    return filtered.filter(
      (session) =>
        session.family?.familyName?.toLowerCase().includes(search) ||
        session.children?.some((c: any) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(search),
        ) ||
        session.status?.toLowerCase().includes(search) ||
        formatDate(session.scheduledStart).toLowerCase().includes(search) ||
        session.service?.name?.toLowerCase().includes(search) ||
        session.service?.code?.toLowerCase().includes(search),
    );
  };

  // Sort sessions
  const sortedSessions = () => {
    const filtered = filteredSessions();
    return [...filtered].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (props.sortField) {
        case "date":
          aVal = new Date(a.scheduledStart).getTime();
          bVal = new Date(b.scheduledStart).getTime();
          break;
        case "family":
          aVal = a.family?.familyName || "";
          bVal = b.family?.familyName || "";
          break;
        case "status":
          aVal = a.status || "";
          bVal = b.status || "";
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return props.sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return props.sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (field: "date" | "family" | "status") => {
    if (props.sortField === field) {
      props.onSortDirectionChange(props.sortDirection === "asc" ? "desc" : "asc");
    } else {
      props.onSortFieldChange(field);
      props.onSortDirectionChange("asc");
    }
  };

  const getSortIcon = (field: "date" | "family" | "status") => {
    if (props.sortField !== field) return "↕️";
    return props.sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div
      style={{
        "background-color": "#fff",
        "border-radius": "8px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      {/* Search and Sort Controls */}
      <div
        style={{
          padding: "1.5rem",
          "border-bottom": "1px solid #e2e8f0",
          "background-color": "#f7fafc",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            "flex-wrap": "wrap",
            "align-items": "center",
            "margin-bottom": "1rem",
          }}
        >
          <div style={{ flex: "1", "min-width": "200px" }}>
            <input
              type="text"
              placeholder="Search by family, child, status, or date..."
              value={props.searchTerm}
              onInput={(e) => props.onSearchChange(e.currentTarget.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                "font-size": "1rem",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", "flex-wrap": "wrap" }}>
            <button
              onClick={() => handleSort("date")}
              style={{
                padding: "0.5rem 1rem",
                "background-color": props.sortField === "date" ? "#4299e1" : "#edf2f7",
                color: props.sortField === "date" ? "white" : "#2d3748",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                cursor: "pointer",
                "font-size": "0.875rem",
              }}
            >
              Date {getSortIcon("date")}
            </button>
            <button
              onClick={() => handleSort("family")}
              style={{
                padding: "0.5rem 1rem",
                "background-color": props.sortField === "family" ? "#4299e1" : "#edf2f7",
                color: props.sortField === "family" ? "white" : "#2d3748",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                cursor: "pointer",
                "font-size": "0.875rem",
              }}
            >
              Family {getSortIcon("family")}
            </button>
            <button
              onClick={() => handleSort("status")}
              style={{
                padding: "0.5rem 1rem",
                "background-color": props.sortField === "status" ? "#4299e1" : "#edf2f7",
                color: props.sortField === "status" ? "white" : "#2d3748",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                cursor: "pointer",
                "font-size": "0.875rem",
              }}
            >
              Status {getSortIcon("status")}
            </button>
          </div>
        </div>
        <div style={{ color: "#718096", "font-size": "0.875rem" }}>
          Showing {sortedSessions().length} session{sortedSessions().length !== 1 ? "s" : ""}
          {props.searchTerm && ` matching "${props.searchTerm}"`}
        </div>
      </div>

      {/* Sessions List */}
      <div style={{ "max-height": "70vh", overflow: "auto" }}>
        <Show
          when={sortedSessions().length > 0}
          fallback={
            <div style={{ padding: "3rem", "text-align": "center", color: "#718096" }}>
              No sessions found.
            </div>
          }
        >
          <div style={{ display: "flex", "flex-direction": "column" }}>
            <For each={sortedSessions()}>
              {(session) => {
                const statusColors = getStatusColor(session.status);
                const startTime = new Date(session.scheduledStart);
                const endTime = new Date(session.scheduledEnd);
                const isPast = endTime < new Date();

                return (
                  <A
                    href={`/families/${session.familyId}/sessions/${session.id}`}
                    style={{
                      display: "block",
                      padding: "1rem 1.5rem",
                      "border-bottom": "1px solid #e2e8f0",
                      "text-decoration": "none",
                      color: "inherit",
                      transition: "background-color 0.2s",
                      opacity: isPast ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f7fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        "align-items": "flex-start",
                        "flex-wrap": "wrap",
                      }}
                    >
                      <div style={{ flex: "1", "min-width": "200px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            "align-items": "center",
                            "margin-bottom": "0.25rem",
                          }}
                        >
                          <span
                            style={{
                              padding: "0.25rem 0.75rem",
                              "border-radius": "12px",
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
                                padding: "0.25rem 0.75rem",
                                "border-radius": "12px",
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
                        <div
                          style={{
                            "font-weight": "600",
                            color: "#2d3748",
                            "font-size": "1.125rem",
                          }}
                        >
                          {session.family?.familyName || "Unknown Family"}
                        </div>
                        <div
                          style={{
                            color: "#718096",
                            "font-size": "0.875rem",
                            "margin-top": "0.25rem",
                          }}
                        >
                          {session.children
                            ?.map((c: any) => `${c.firstName} ${c.lastName}`)
                            .join(", ") || "No children"}
                        </div>
                      </div>
                      <div style={{ "min-width": "150px" }}>
                        <div style={{ "font-weight": "600", color: "#2d3748" }}>
                          {formatDate(session.scheduledStart)}
                        </div>
                        <div
                          style={{
                            color: "#718096",
                            "font-size": "0.875rem",
                            "margin-top": "0.25rem",
                          }}
                        >
                          {formatTime(session.scheduledStart)} - {formatTime(session.scheduledEnd)}
                        </div>
                        <div style={{ color: "#718096", "font-size": "0.875rem" }}>
                          {formatDuration(startTime, endTime)}
                        </div>
                      </div>
                      <Show when={session.hourlyRate}>
                        <div style={{ "min-width": "100px", "text-align": "right" }}>
                          <div style={{ color: "#718096", "font-size": "0.875rem" }}>Rate</div>
                          <div style={{ "font-weight": "600", color: "#2d3748" }}>
                            ${session.hourlyRate}/hr
                          </div>
                        </div>
                      </Show>
                    </div>
                  </A>
                );
              }}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}

// Month View Component
function MonthView(props: {
  currentDate: Date;
  sessions: any[];
  unavailabilities: any[];
  onDateClick?: (date: Date) => void;
}) {
  const year = props.currentDate.getFullYear();
  const month = props.currentDate.getMonth();

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

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  const getSessionsForDay = (date: Date) => {
    return props.sessions.filter((session) => {
      const sessionDate = ensureDate(session.scheduledStart);
      return (
        sessionDate.getDate() === date.getDate() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getUnavailabilitiesForDay = (date: Date) => {
    return props.unavailabilities.filter((unav) => {
      const unavStart = ensureDate(unav.startDate);
      const unavEnd = ensureDate(unav.endDate);
      const checkDate = new Date(date);
      checkDate.setHours(12, 0, 0, 0);
      return checkDate >= unavStart && checkDate <= unavEnd;
    });
  };

  const formatTime = (date: Date) => {
    return formatTimeLocal(date);
  };

  return (
    <div
      style={{
        "background-color": "#fff",
        "border-radius": "8px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          "grid-template-columns": "repeat(7, 1fr)",
          "background-color": "#f7fafc",
          borderBottom: "2px solid #e2e8f0",
        }}
      >
        <For each={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}>
          {(day) => (
            <div
              style={{
                padding: "0.75rem",
                "text-align": "center",
                "font-weight": "600",
                color: "#4a5568",
              }}
            >
              {day}
            </div>
          )}
        </For>
      </div>
      <div style={{ display: "grid", "grid-template-columns": "repeat(7, 1fr)" }}>
        <For each={days}>
          {(day) => {
            const daySessions = getSessionsForDay(day);
            const dayUnavailabilities = getUnavailabilitiesForDay(day);
            const isCurrentMonthDay = isCurrentMonth(day);
            const isTodayDay = isToday(day);

            return (
              <div
                onClick={() => props.onDateClick?.(day)}
                style={{
                  minHeight: "120px",
                  border: "1px solid #e2e8f0",
                  padding: "0.5rem",
                  "background-color": isCurrentMonthDay ? "#fff" : "#f7fafc",
                  position: "relative",
                  cursor: props.onDateClick ? "pointer" : "default",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (isCurrentMonthDay && props.onDateClick) {
                    e.currentTarget.style.backgroundColor = "#f7fafc";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isCurrentMonthDay ? "#fff" : "#f7fafc";
                }}
              >
                <div
                  style={{
                    "font-weight": isTodayDay ? "700" : "400",
                    color: isCurrentMonthDay ? "#2d3748" : "#a0aec0",
                    "margin-bottom": "0.25rem",
                    "font-size": isTodayDay ? "1rem" : "0.875rem",
                  }}
                >
                  {day.getDate()}
                </div>
                <div style={{ display: "flex", "flex-direction": "column", gap: "0.25rem" }}>
                  <For each={dayUnavailabilities}>
                    {(unav) => (
                      <div
                        style={{
                          padding: "0.25rem 0.5rem",
                          "background-color": "#fed7d7",
                          color: "#c53030",
                          "border-radius": "4px",
                          "font-size": "0.75rem",
                          "font-weight": "600",
                        }}
                        title={unav.reason || "Unavailable"}
                      >
                        {unav.allDay ? "🚫 Unavailable" : "🚫 Busy"}
                      </div>
                    )}
                  </For>
                  <For each={daySessions.slice(0, 3)}>
                    {(session) => {
                      const statusColors = {
                        SCHEDULED: { bg: "#bee3f8", color: "#2c5282" },
                        IN_PROGRESS: { bg: "#feebc8", color: "#7c2d12" },
                        COMPLETED: { bg: "#c6f6d5", color: "#276749" },
                        CANCELLED: { bg: "#fed7d7", color: "#c53030" },
                      }[session.status] || { bg: "#e2e8f0", color: "#2d3748" };

                      const isConfirmed = session.isConfirmed;
                      const isRecurring = !!session.scheduleId;

                      return (
                        <A
                          href={`/families/${session.familyId}/sessions/${session.id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            padding: "0.25rem 0.5rem",
                            "background-color": isConfirmed ? statusColors.bg : "transparent",
                            color: statusColors.color,
                            border: isConfirmed
                              ? `2px solid ${statusColors.color}`
                              : `2px dashed ${statusColors.color}`,
                            "border-radius": "4px",
                            "font-size": "0.75rem",
                            "text-decoration": "none",
                            display: "block",
                            opacity: isConfirmed ? 1 : 0.7,
                            "font-weight": isConfirmed ? "600" : "400",
                          }}
                          title={`${session.family.familyName} - ${formatTime(
                            session.scheduledStart,
                          )}${isConfirmed ? " ✓ Confirmed" : isRecurring ? " (Planned)" : ""}`}
                        >
                          {isConfirmed && "✓ "}
                          {formatTime(session.scheduledStart)} - {session.family.familyName}
                        </A>
                      );
                    }}
                  </For>
                  {daySessions.length > 3 && (
                    <div
                      style={{
                        "font-size": "0.75rem",
                        color: "#718096",
                        padding: "0.25rem",
                      }}
                    >
                      +{daySessions.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}

// Week View Component
function WeekView(props: { currentDate: Date; sessions: any[]; unavailabilities: any[] }) {
  const date = props.currentDate;
  const dayOfWeek = date.getDay();
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - dayOfWeek);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getSessionsForDayAndHour = (day: Date, hour: number) => {
    return props.sessions.filter((session) => {
      const sessionDate = ensureDate(session.scheduledStart);
      const sessionHour = sessionDate.getHours();
      return (
        sessionDate.getDate() === day.getDate() &&
        sessionDate.getMonth() === day.getMonth() &&
        sessionDate.getFullYear() === day.getFullYear() &&
        sessionHour === hour
      );
    });
  };

  const getUnavailabilitiesForDay = (day: Date) => {
    return props.unavailabilities.filter((unav) => {
      const unavStart = ensureDate(unav.startDate);
      const unavEnd = ensureDate(unav.endDate);
      const checkDate = new Date(day);
      checkDate.setHours(12, 0, 0, 0);
      return checkDate >= unavStart && checkDate <= unavEnd;
    });
  };

  const formatTime = (hour: number) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  };

  return (
    <div
      style={{
        "background-color": "#fff",
        "border-radius": "8px",
        border: "1px solid #e2e8f0",
        overflow: "auto",
      }}
    >
      <div style={{ display: "grid", "grid-template-columns": "80px repeat(7, 1fr)" }}>
        {/* Header row */}
        <div style={{ padding: "1rem", "font-weight": "600", color: "#4a5568" }}>Time</div>
        <For each={days}>
          {(day) => (
            <div
              style={{
                padding: "1rem",
                "text-align": "center",
                "font-weight": "600",
                color: "#2d3748",
                borderLeft: "1px solid #e2e8f0",
              }}
            >
              <div>{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
              <div style={{ "font-size": "1.25rem", "margin-top": "0.25rem" }}>{day.getDate()}</div>
            </div>
          )}
        </For>

        {/* Hour rows */}
        <For each={hours}>
          {(hour) => (
            <>
              <div
                style={{
                  padding: "0.5rem",
                  "font-size": "0.875rem",
                  color: "#718096",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                {formatTime(hour)}
              </div>
              <For each={days}>
                {(day) => {
                  const daySessions = getSessionsForDayAndHour(day, hour);
                  const dayUnavailabilities = getUnavailabilitiesForDay(day);

                  return (
                    <div
                      style={{
                        minHeight: "60px",
                        borderTop: "1px solid #e2e8f0",
                        borderLeft: "1px solid #e2e8f0",
                        padding: "0.25rem",
                        position: "relative",
                      }}
                    >
                      <For each={dayUnavailabilities}>
                        {(unav) => {
                          if (
                            unav.allDay ||
                            (unav.startTime && hour >= parseInt(unav.startTime.split(":")[0]))
                          ) {
                            return (
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  "background-color": "#fed7d7",
                                  opacity: 0.3,
                                  "z-index": 1,
                                }}
                              />
                            );
                          }
                        }}
                      </For>
                      <For each={daySessions}>
                        {(session) => {
                          const statusColors = {
                            SCHEDULED: { bg: "#bee3f8", color: "#2c5282" },
                            IN_PROGRESS: { bg: "#feebc8", color: "#7c2d12" },
                            COMPLETED: { bg: "#c6f6d5", color: "#276749" },
                            CANCELLED: { bg: "#fed7d7", color: "#c53030" },
                          }[session.status] || { bg: "#e2e8f0", color: "#2d3748" };

                          const isConfirmed = session.isConfirmed;
                          const isRecurring = !!session.scheduleId;

                          return (
                            <A
                              href={`/families/${session.familyId}/sessions/${session.id}`}
                              style={{
                                display: "block",
                                padding: "0.25rem 0.5rem",
                                "background-color": isConfirmed ? statusColors.bg : "transparent",
                                color: statusColors.color,
                                border: isConfirmed
                                  ? `2px solid ${statusColors.color}`
                                  : `2px dashed ${statusColors.color}`,
                                "border-radius": "4px",
                                "font-size": "0.75rem",
                                "text-decoration": "none",
                                "margin-bottom": "0.25rem",
                                "z-index": 2,
                                position: "relative",
                                opacity: isConfirmed ? 1 : 0.7,
                                "font-weight": isConfirmed ? "600" : "400",
                              }}
                              title={`${session.family.familyName}${isConfirmed ? " ✓ Confirmed" : isRecurring ? " (Planned)" : ""}`}
                            >
                              {isConfirmed && "✓ "}
                              {session.family.familyName}
                            </A>
                          );
                        }}
                      </For>
                    </div>
                  );
                }}
              </For>
            </>
          )}
        </For>
      </div>
    </div>
  );
}

// Day View Component with Time Intervals
function DayView(props: { currentDate: Date; sessions: any[]; unavailabilities: any[] }) {
  const date = props.currentDate;
  const intervals = Array.from({ length: 48 }, (_, i) => i * 30); // 30-minute intervals

  const getSessionsForInterval = (minutes: number) => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const intervalStart = new Date(date);
    intervalStart.setHours(hour, minute, 0, 0);
    const intervalEnd = new Date(intervalStart);
    intervalEnd.setMinutes(intervalEnd.getMinutes() + 30);

    return props.sessions.filter((session) => {
      const sessionStart = ensureDate(session.scheduledStart);
      const sessionEnd = ensureDate(session.scheduledEnd);
      // Only show session in the interval where it starts (to avoid duplicates)
      return (
        sessionStart.getDate() === date.getDate() &&
        sessionStart.getMonth() === date.getMonth() &&
        sessionStart.getFullYear() === date.getFullYear() &&
        sessionStart >= intervalStart &&
        sessionStart < intervalEnd
      );
    });
  };

  const getUnavailabilitiesForInterval = (minutes: number) => {
    const hour = Math.floor(minutes / 60);
    return props.unavailabilities.filter((unav) => {
      if (unav.allDay) return true;
      if (!unav.startTime || !unav.endTime) return false;
      const startHour = parseInt(unav.startTime.split(":")[0]);
      const endHour = parseInt(unav.endTime.split(":")[0]);
      return hour >= startHour && hour < endHour;
    });
  };

  const formatTime = (minutes: number) => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div
      style={{
        "background-color": "#fff",
        "border-radius": "8px",
        border: "1px solid #e2e8f0",
        overflow: "auto",
      }}
    >
      <div style={{ display: "grid", "grid-template-columns": "120px 1fr" }}>
        <div
          style={{
            padding: "1rem",
            "font-weight": "600",
            color: "#4a5568",
            borderBottom: "2px solid #e2e8f0",
          }}
        >
          Time
        </div>
        <div
          style={{
            padding: "1rem",
            "font-weight": "600",
            color: "#2d3748",
            borderBottom: "2px solid #e2e8f0",
            "text-align": "center",
          }}
        >
          {date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>

        <For each={intervals}>
          {(intervalMinutes) => {
            const intervalSessions = getSessionsForInterval(intervalMinutes);
            const intervalUnavailabilities = getUnavailabilitiesForInterval(intervalMinutes);

            return (
              <>
                <div
                  style={{
                    padding: "0.5rem",
                    "font-size": "0.875rem",
                    color: "#718096",
                    borderTop: "1px solid #e2e8f0",
                    "min-height": "60px",
                  }}
                >
                  {formatTime(intervalMinutes)}
                </div>
                <div
                  style={{
                    padding: "0.5rem",
                    borderTop: "1px solid #e2e8f0",
                    "min-height": "60px",
                    position: "relative",
                  }}
                >
                  <For each={intervalUnavailabilities}>
                    {(unav) => (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          "background-color": "#fed7d7",
                          opacity: 0.3,
                          "z-index": 1,
                        }}
                        title={unav.reason || "Unavailable"}
                      />
                    )}
                  </For>
                  <For each={intervalSessions}>
                    {(session) => {
                      const statusColors = {
                        SCHEDULED: { bg: "#bee3f8", color: "#2c5282" },
                        IN_PROGRESS: { bg: "#feebc8", color: "#7c2d12" },
                        COMPLETED: { bg: "#c6f6d5", color: "#276749" },
                        CANCELLED: { bg: "#fed7d7", color: "#c53030" },
                      }[session.status] || { bg: "#e2e8f0", color: "#2d3748" };

                      const isConfirmed = session.isConfirmed;
                      const isRecurring = !!session.scheduleId;
                      const startTime = ensureDate(session.scheduledStart);
                      const endTime = ensureDate(session.scheduledEnd);
                      const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
                      const height = Math.max(60, (duration / 30) * 60);

                      return (
                        <A
                          href={`/families/${session.familyId}/sessions/${session.id}`}
                          style={{
                            display: "block",
                            padding: "0.5rem",
                            "background-color": isConfirmed ? statusColors.bg : "transparent",
                            color: statusColors.color,
                            border: isConfirmed
                              ? `2px solid ${statusColors.color}`
                              : `2px dashed ${statusColors.color}`,
                            "border-radius": "4px",
                            "font-size": "0.875rem",
                            "text-decoration": "none",
                            "margin-bottom": "0.25rem",
                            "z-index": 2,
                            position: "relative",
                            "min-height": `${height}px`,
                            opacity: isConfirmed ? 1 : 0.7,
                          }}
                          title={`${session.family.familyName}${isConfirmed ? " ✓ Confirmed" : isRecurring ? " (Planned Recurring)" : ""}`}
                        >
                          <div style={{ "font-weight": isConfirmed ? "700" : "500" }}>
                            {isConfirmed && "✓ "}
                            {session.family.familyName}
                            {!isConfirmed && isRecurring && " (Planned)"}
                          </div>
                          <div style={{ "font-size": "0.75rem", "margin-top": "0.25rem" }}>
                            {formatTimeLocal(startTime)}{" "}
                            -{" "}
                            {formatTimeLocal(endTime)}
                          </div>
                          <div style={{ "font-size": "0.75rem", "margin-top": "0.25rem" }}>
                            {session.children.map((c: any) => c.firstName).join(", ")}
                          </div>
                        </A>
                      );
                    }}
                  </For>
                </div>
              </>
            );
          }}
        </For>
      </div>
    </div>
  );
}
