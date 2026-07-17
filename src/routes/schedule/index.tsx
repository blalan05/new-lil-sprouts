import { createAsync, type RouteDefinition, A, useSubmission } from "@solidjs/router";
import { createSignal, Show, For, createMemo, createResource, createEffect } from "solid-js";
import Modal from "~/components/Modal";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { useConfirm } from "~/components/wa/ConfirmProvider";
import { SessionStatusBadge } from "~/components/wa/StatusBadge";
import { getCareSessionsForRange, getUnavailabilitiesForRange } from "~/lib/schedule";
import { getUpcomingUnavailabilities, deleteUnavailability } from "~/lib/unavailability";
import { getServices } from "~/lib/services";
import { createCareSchedule } from "~/lib/care-schedules";
import { getFamilies, getFamily } from "~/lib/families";
import { formatTimeLocal, ensureDate, isSameDay } from "~/lib/datetime";
import ClientTime from "~/components/ClientTime";

export const route = {
  // Remove preload entirely - let the component handle data fetching client-side only
  info: {
    ssr: false, // Disable SSR to prevent timezone mismatch between server and client
  },
} satisfies RouteDefinition;

type ViewType = "month" | "week" | "day" | "list";

export default function SchedulePage() {
  const { confirm } = useConfirm();
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
    // Data is already serialized as ISO strings in getCareSessionsForRange
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
        title="Schedule"
        actions={
          <div class="wa-cluster wa-gap-s calendar-view-buttons">
            <wa-button
              appearance={showUnavailabilityPanel() ? "filled" : "outlined"}
              variant={showUnavailabilityPanel() ? "brand" : "neutral"}
              onClick={() => setShowUnavailabilityPanel(!showUnavailabilityPanel())}
            >
              {showUnavailabilityPanel() ? "Hide" : "Show"} Unavailability
            </wa-button>
            <wa-button
              variant="success"
              appearance="filled"
              onClick={() => {
                setSelectedDate("");
                setShowAddSessionModal(true);
              }}
            >
              + Add Care Session
            </wa-button>
            <wa-button href="/unavailability/new" variant="danger" appearance="filled">
              + Block Time
            </wa-button>
          </div>
        }
      />

        {/* View Switcher and Navigation */}
        <div
          class="wa-flank wa-gap-m calendar-controls flex-row-mobile"
          style={{ "margin-top": "var(--wa-space-m)", "flex-wrap": "wrap" }}
        >
          <div class="wa-cluster wa-gap-s calendar-view-buttons">
            <wa-button
              appearance={view() === "month" ? "filled" : "outlined"}
              variant={view() === "month" ? "brand" : "neutral"}
              onClick={() => handleViewChange("month")}
            >
              Month
            </wa-button>
            <wa-button
              appearance={view() === "week" ? "filled" : "outlined"}
              variant={view() === "week" ? "brand" : "neutral"}
              onClick={() => handleViewChange("week")}
            >
              Week
            </wa-button>
            <wa-button
              appearance={view() === "day" ? "filled" : "outlined"}
              variant={view() === "day" ? "brand" : "neutral"}
              onClick={() => handleViewChange("day")}
            >
              Day
            </wa-button>
            <wa-button
              appearance={view() === "list" ? "filled" : "outlined"}
              variant={view() === "list" ? "brand" : "neutral"}
              onClick={() => handleViewChange("list")}
            >
              List
            </wa-button>
          </div>
          <Show when={view() !== "list"}>
            <div class="wa-cluster wa-gap-s">
              <wa-button appearance="outlined" onClick={() => navigateDate("prev")}>
                ←
              </wa-button>
              <wa-button variant="brand" appearance="filled" onClick={goToToday}>
                Today
              </wa-button>
              <wa-button appearance="outlined" onClick={() => navigateDate("next")}>
                →
              </wa-button>
              <span class="wa-body-m">{formatDateHeader()}</span>
            </div>
          </Show>
        </div>

      <Show when={showUnavailabilityPanel()}>
        <wa-card>
          <div class="wa-flank wa-gap-m" style={{ "margin-bottom": "var(--wa-space-m)" }}>
            <h2 class="wa-heading-l">Upcoming Unavailable Times</h2>
            <wa-button href="/unavailability/new" variant="danger" appearance="filled" size="small">
              + Add New
            </wa-button>
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
                        onClick={() => handleDeleteUnavailability(unavailability.id)}
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

      <Modal open={showAddSessionModal()} title="Add Care Session" onClose={handleCloseModal}>
            <form action={createCareSchedule} method="post" class="wa-stack wa-gap-m">
              <input type="hidden" name="recurrence" value="ONCE" />
              <input type="hidden" name="timezoneOffset" value={new Date().getTimezoneOffset() * -1} />

              <Show
                when={services()}
                fallback={
                  <div style={{ padding: "0.75rem" }} class="wa-color-text-quiet">Loading services...</div>
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
    </PageContent>
  );
}

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
    <wa-card style={{ overflow: "hidden", padding: 0 }}>
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
            <wa-input
              type="search"
              placeholder="Search by family, child, status, or date..."
              value={props.searchTerm}
              onInput={(e) =>
                props.onSearchChange((e.currentTarget as HTMLInputElement & { value: string }).value)
              }
            />
          </div>
          <div class="wa-cluster wa-gap-s">
            <wa-button
              appearance={props.sortField === "date" ? "filled" : "outlined"}
              variant={props.sortField === "date" ? "brand" : "neutral"}
              size="small"
              onClick={() => handleSort("date")}
            >
              Date {getSortIcon("date")}
            </wa-button>
            <wa-button
              appearance={props.sortField === "family" ? "filled" : "outlined"}
              variant={props.sortField === "family" ? "brand" : "neutral"}
              size="small"
              onClick={() => handleSort("family")}
            >
              Family {getSortIcon("family")}
            </wa-button>
            <wa-button
              appearance={props.sortField === "status" ? "filled" : "outlined"}
              variant={props.sortField === "status" ? "brand" : "neutral"}
              size="small"
              onClick={() => handleSort("status")}
            >
              Status {getSortIcon("status")}
            </wa-button>
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
                        <div class="wa-cluster wa-gap-s" style={{ "margin-bottom": "0.25rem" }}>
                          <SessionStatusBadge status={session.status} />
                          {session.isConfirmed && (
                            <wa-badge variant="success" appearance="filled-outlined" pill>
                              ✓ Confirmed
                            </wa-badge>
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
                          <ClientTime date={session.scheduledStart} /> - <ClientTime date={session.scheduledEnd} />
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
    </wa-card>
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
      return isSameDay(session.scheduledStart, date);
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

  const formatTime = (date: Date | string) => {
    return formatTimeLocal(date);
  };

  return (
    <div
      class="calendar-grid"
      style={{
        "background-color": "#fff",
        "border-radius": "8px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      <div class="calendar-grid-inner">
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
                          title={`${session.family.familyName}${isConfirmed ? " ✓ Confirmed" : isRecurring ? " (Planned)" : ""}`}
                        >
                          {isConfirmed && "✓ "}
                          <ClientTime date={session.scheduledStart} /> - {session.family.familyName}
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
      if (!isSameDay(session.scheduledStart, day)) {
        return false;
      }
      const sessionDate = ensureDate(session.scheduledStart);
      const sessionHour = sessionDate.getHours();
      return sessionHour === hour;
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
      class="calendar-grid"
      style={{
        "background-color": "#fff",
        "border-radius": "8px",
        border: "1px solid #e2e8f0",
        overflow: "auto",
      }}
    >
      <div class="calendar-grid-inner calendar-week-grid" style={{ display: "grid", "grid-template-columns": "80px repeat(7, 1fr)" }}>
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
      // Only show session in the interval where it starts (to avoid duplicates)
      // First check if it's the same day
      if (!isSameDay(sessionStart, date)) {
        return false;
      }
      // Then check if it falls within the interval
      return sessionStart >= intervalStart && sessionStart < intervalEnd;
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
                            <ClientTime date={session.scheduledStart} />{" "}
                            -{" "}
                            <ClientTime date={session.scheduledEnd} />
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
