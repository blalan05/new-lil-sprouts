import { useSubmission } from "~/lib/use-submission";
import { createSignal, Show, For, createMemo, createEffect } from "solid-js";
import Modal from "~/components/Modal";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import EmptyState from "~/components/EmptyState";
import ListToolbar from "~/components/ListToolbar";
import { useConfirm } from "~/components/wa/ConfirmProvider";
import { SessionStatusBadge } from "~/components/wa/StatusBadge";
import { getCareSessionsForRange, getUnavailabilitiesForRange } from "~/lib/schedule";
import { getUpcomingUnavailabilities, deleteUnavailability } from "~/lib/unavailability";
import { getServices } from "~/lib/services";
import { createCareSchedule } from "~/lib/care-schedules";
import { getFamilies, getFamily } from "~/lib/families";
import { formatTimeLocal, ensureDate, isSameDay } from "~/lib/datetime";
import ClientTime from "~/components/ClientTime";
import {
  SESSION_STATUS_OPTIONS,
  SESSION_STATUS_ORDER,
  compareSort,
  compareStatus,
  formatDateInput,
  matchesQuery,
  parseDateParam,
  sessionSearchParts,
} from "~/lib/list-query";
import { useListQuery } from "~/lib/use-list-query";

export const route = {
  // Remove preload entirely - let the component handle data fetching client-side only
  info: {
    ssr: false, // Disable SSR to prevent timezone mismatch between server and client
  },
};

type ViewType = "month" | "week" | "day" | "list";

export default function SchedulePage() {
  const { confirm } = useConfirm();
  const list = useListQuery({ view: "month", sort: "date", dir: "asc" });
  const view = (): ViewType => {
    const value = list.view();
    if (value === "week" || value === "day" || value === "list" || value === "month") return value;
    return "month";
  };
  const [currentDate, setCurrentDate] = createSignal(parseDateParam(list.date()) ?? new Date());
  createEffect(() => {
    const parsed = parseDateParam(list.date());
    if (!parsed) return;
    if (formatDateInput(parsed) !== formatDateInput(currentDate())) setCurrentDate(parsed);
  });
  const services = createMemo(() => getServices());

  // Calculate date range based on view
  const getDateRange = () => {
    const date = currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    if (view() === "month" || view() === "list") {
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
    } else {
      // day view
      const start = new Date(year, month, day);
      start.setHours(0, 0, 0, 0);
      const end = new Date(year, month, day);
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

  const sessions = createMemo(() => {
    const source = dateRangeSource();
    return getCareSessionsForRange(source.start, source.end);
  });

  const unavailabilities = createMemo(() => {
    const source = dateRangeSource();
    return getUnavailabilitiesForRange(source.start, source.end);
  });
  const upcomingUnavailabilities = createMemo(() => getUpcomingUnavailabilities());
  const [showUnavailabilityPanel, setShowUnavailabilityPanel] = createSignal(false);
  const [showAddSessionModal, setShowAddSessionModal] = createSignal(false);
  const [selectedDate, setSelectedDate] = createSignal<string>("");
  const [selectedFamilyId, setSelectedFamilyId] = createSignal<string>("");
  const families = createMemo(() => getFamilies());
  const submission = useSubmission(createCareSchedule);

  const selectedFamily = createMemo(() => {
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
    if (view() === "month" || view() === "list") {
      date.setMonth(date.getMonth() + (direction === "next" ? 1 : -1));
    } else if (view() === "week") {
      date.setDate(date.getDate() + (direction === "next" ? 7 : -7));
    } else {
      date.setDate(date.getDate() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(date);
    list.setDate(formatDateInput(date));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    list.setDate(formatDateInput(today));
  };

  const handleViewChange = (newView: ViewType) => {
    list.setView(newView);
  };

  const formatDateHeader = () => {
    const date = currentDate();
    if (view() === "month" || view() === "list") {
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

  const filteredSessions = () => {
    const rows = (sessions() ?? []).filter((session) => {
      if (list.family() && session.familyId !== list.family() && session.family?.id !== list.family()) return false;
      if (list.service() && session.service?.id !== list.service()) return false;
      if (list.status() && session.status !== list.status()) return false;
      return matchesQuery(list.q(), sessionSearchParts(session));
    });
    return rows;
  };

  const sortedSessions = () => {
    const field = list.sort() === "family" || list.sort() === "status" ? list.sort() : "date";
    const dir = list.dir();
    return [...filteredSessions()].sort((a, b) => {
      if (field === "family") {
        return compareSort(
          (a.family?.familyName || "").toLowerCase(),
          (b.family?.familyName || "").toLowerCase(),
          dir,
        );
      }
      if (field === "status") return compareStatus(a.status || "", b.status || "", dir, SESSION_STATUS_ORDER);
      return compareSort(new Date(a.scheduledStart).getTime(), new Date(b.scheduledStart).getTime(), dir);
    });
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
              <Show when={view() === "list"}>
                <span class="wa-body-s wa-color-text-quiet">List uses this month</span>
              </Show>
            </div>
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
              <p style={{ color: "var(--color-text-muted)", "text-align": "center", padding: "2rem" }}>
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
                      "background-color": "var(--wa-color-danger-fill-quiet)",
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
                        <h3 style={{ color: "var(--color-text)", margin: 0, "font-size": "1rem" }}>
                          {unavailability.reason || "Time Off"}
                        </h3>
                        <span
                          style={{
                            padding: "0.25rem 0.5rem",
                            "border-radius": "9999px",
                            "background-color": "var(--wa-color-danger-fill-normal)",
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
                          <span style={{ color: "var(--color-text-muted)" }}>From: </span>
                          <span style={{ color: "var(--color-text)", "font-weight": "500" }}>
                            {formatDate(unavailability.startDate)}
                            {!unavailability.allDay &&
                              unavailability.startTime &&
                              ` at ${formatTime(unavailability.startTime)}`}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "var(--color-text-muted)" }}>To: </span>
                          <span style={{ color: "var(--color-text)", "font-weight": "500" }}>
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
                            color: "var(--color-text-muted)",
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

      <ListToolbar
        query={list}
        searchPlaceholder="Search family, child, service, or status"
        families={families() ?? []}
        services={services() ?? []}
        chipGroups={[{ param: "status", label: "Status", options: SESSION_STATUS_OPTIONS }]}
        sortOptions={[
          { value: "date", label: "Date" },
          { value: "family", label: "Family" },
          { value: "status", label: "Status" },
        ]}
        total={sessions()?.length ?? 0}
        visible={filteredSessions().length}
      />

      <Show
        when={sessions() && unavailabilities()}
        fallback={
          <div style={{ "text-align": "center", padding: "3rem" }}>Loading schedule...</div>
        }
      >
        <Show when={filteredSessions().length === 0 && ((sessions()?.length ?? 0) > 0 || view() === "list")}>
          <EmptyState
            message={
              (sessions()?.length ?? 0) === 0
                ? view() === "week"
                  ? "No sessions this week."
                  : view() === "day"
                    ? "No sessions on this day."
                    : "No sessions in this month."
                : "No sessions match these filters."
            }
            actionLabel={(sessions()?.length ?? 0) > 0 ? "Clear filters" : undefined}
            onAction={() => list.clearFilters()}
          />
        </Show>
        {view() === "month" && (
          <MonthView
            currentDate={currentDate()}
            sessions={filteredSessions()}
            unavailabilities={unavailabilities() || []}
            onDateClick={handleDateClick}
          />
        )}
        {view() === "week" && (
          <WeekView
            currentDate={currentDate()}
            sessions={filteredSessions()}
            unavailabilities={unavailabilities() || []}
          />
        )}
        {view() === "day" && (
          <DayView
            currentDate={currentDate()}
            sessions={filteredSessions()}
            unavailabilities={unavailabilities() || []}
          />
        )}
        {view() === "list" && filteredSessions().length > 0 && (
          <ListView sessions={sortedSessions()} />
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
                    <a href={`/families/${selectedFamilyId()}/edit`}>Assign services</a> to default
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
                          color: "var(--color-text)",
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
                                e.currentTarget.style.backgroundColor = "var(--color-surface-muted)";
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

function ListView(props: { sessions: any[] }) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDuration = (start: Date, end: Date) => {
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return `${hours.toFixed(1)}h`;
  };

  return (
    <wa-card style={{ overflow: "hidden", padding: 0 }}>
      <div style={{ "max-height": "70vh", overflow: "auto" }}>
        <div style={{ display: "flex", "flex-direction": "column" }}>
            <For each={props.sessions}>
              {(session) => {
                const startTime = new Date(session.scheduledStart);
                const endTime = new Date(session.scheduledEnd);
                const isPast = endTime < new Date();

                return (
                  <a
                    href={`/families/${session.familyId}/sessions/${session.id}`}
                    style={{
                      display: "block",
                      padding: "1rem 1.5rem",
                      "border-bottom": "1px solid var(--color-border)",
                      "text-decoration": "none",
                      color: "inherit",
                      transition: "background-color 0.2s",
                      opacity: isPast ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--color-surface-muted)";
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
                            color: "var(--color-text)",
                            "font-size": "1.125rem",
                          }}
                        >
                          {session.family?.familyName || "Unknown Family"}
                        </div>
                        <div
                          style={{
                            color: "var(--color-text-muted)",
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
                        <div style={{ "font-weight": "600", color: "var(--color-text)" }}>
                          {formatDate(session.scheduledStart)}
                        </div>
                        <div
                          style={{
                            color: "var(--color-text-muted)",
                            "font-size": "0.875rem",
                            "margin-top": "0.25rem",
                          }}
                        >
                          <ClientTime date={session.scheduledStart} /> - <ClientTime date={session.scheduledEnd} />
                        </div>
                        <div style={{ color: "var(--color-text-muted)", "font-size": "0.875rem" }}>
                          {formatDuration(startTime, endTime)}
                        </div>
                      </div>
                      <Show when={session.hourlyRate}>
                        <div style={{ "min-width": "100px", "text-align": "right" }}>
                          <div style={{ color: "var(--color-text-muted)", "font-size": "0.875rem" }}>Rate</div>
                          <div style={{ "font-weight": "600", color: "var(--color-text)" }}>
                            ${session.hourlyRate}/hr
                          </div>
                        </div>
                      </Show>
                    </div>
                  </a>
                );
              }}
            </For>
          </div>
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
        "background-color": "var(--color-surface)",
        "border-radius": "8px",
        border: "1px solid var(--color-border)",
        overflow: "hidden",
      }}
    >
      <div class="calendar-grid-inner">
      <div
        style={{
          display: "grid",
          "grid-template-columns": "repeat(7, 1fr)",
          "background-color": "var(--color-surface-muted)",
          borderBottom: "2px solid var(--color-border)",
        }}
      >
        <For each={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}>
          {(day) => (
            <div
              style={{
                padding: "0.75rem",
                "text-align": "center",
                "font-weight": "600",
                color: "var(--color-text)",
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
                  border: "1px solid var(--color-border)",
                  padding: "0.5rem",
                  "background-color": isCurrentMonthDay ? "var(--color-surface)" : "var(--color-surface-muted)",
                  position: "relative",
                  cursor: props.onDateClick ? "pointer" : "default",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (isCurrentMonthDay && props.onDateClick) {
                    e.currentTarget.style.backgroundColor = "var(--color-surface-muted)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isCurrentMonthDay ? "var(--color-surface)" : "var(--color-surface-muted)";
                }}
              >
                <div
                  style={{
                    "font-weight": isTodayDay ? "700" : "400",
                    color: isCurrentMonthDay ? "var(--color-text)" : "var(--color-text-subtle)",
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
                          "background-color": "var(--wa-color-danger-fill-normal)",
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
                        SCHEDULED: { bg: "var(--wa-color-brand-fill-normal)", color: "#2c5282" },
                        IN_PROGRESS: { bg: "#feebc8", color: "#7c2d12" },
                        COMPLETED: { bg: "#c6f6d5", color: "#276749" },
                        CANCELLED: { bg: "var(--wa-color-danger-fill-normal)", color: "#c53030" },
                      }[session.status] || { bg: "var(--color-border)", color: "var(--color-text)" };

                      const isConfirmed = session.isConfirmed;
                      const isRecurring = !!session.scheduleId;

                      return (
                        <a
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
                        </a>
                      );
                    }}
                  </For>
                  {daySessions.length > 3 && (
                    <div
                      style={{
                        "font-size": "0.75rem",
                        color: "var(--color-text-muted)",
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
        "background-color": "var(--color-surface)",
        "border-radius": "8px",
        border: "1px solid var(--color-border)",
        overflow: "auto",
      }}
    >
      <div class="calendar-grid-inner calendar-week-grid" style={{ display: "grid", "grid-template-columns": "80px repeat(7, 1fr)" }}>
        {/* Header row */}
        <div style={{ padding: "1rem", "font-weight": "600", color: "var(--color-text)" }}>Time</div>
        <For each={days}>
          {(day) => (
            <div
              style={{
                padding: "1rem",
                "text-align": "center",
                "font-weight": "600",
                color: "var(--color-text)",
                borderLeft: "1px solid var(--color-border)",
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
                  color: "var(--color-text-muted)",
                  borderTop: "1px solid var(--color-border)",
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
                        borderTop: "1px solid var(--color-border)",
                        borderLeft: "1px solid var(--color-border)",
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
                                  "background-color": "var(--wa-color-danger-fill-normal)",
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
                            SCHEDULED: { bg: "var(--wa-color-brand-fill-normal)", color: "#2c5282" },
                            IN_PROGRESS: { bg: "#feebc8", color: "#7c2d12" },
                            COMPLETED: { bg: "#c6f6d5", color: "#276749" },
                            CANCELLED: { bg: "var(--wa-color-danger-fill-normal)", color: "#c53030" },
                          }[session.status] || { bg: "var(--color-border)", color: "var(--color-text)" };

                          const isConfirmed = session.isConfirmed;
                          const isRecurring = !!session.scheduleId;

                          return (
                            <a
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
                            </a>
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
        "background-color": "var(--color-surface)",
        "border-radius": "8px",
        border: "1px solid var(--color-border)",
        overflow: "auto",
      }}
    >
      <div style={{ display: "grid", "grid-template-columns": "120px 1fr" }}>
        <div
          style={{
            padding: "1rem",
            "font-weight": "600",
            color: "var(--color-text)",
            borderBottom: "2px solid var(--color-border)",
          }}
        >
          Time
        </div>
        <div
          style={{
            padding: "1rem",
            "font-weight": "600",
            color: "var(--color-text)",
            borderBottom: "2px solid var(--color-border)",
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
                    color: "var(--color-text-muted)",
                    borderTop: "1px solid var(--color-border)",
                    "min-height": "60px",
                  }}
                >
                  {formatTime(intervalMinutes)}
                </div>
                <div
                  style={{
                    padding: "0.5rem",
                    borderTop: "1px solid var(--color-border)",
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
                          "background-color": "var(--wa-color-danger-fill-normal)",
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
                        SCHEDULED: { bg: "var(--wa-color-brand-fill-normal)", color: "#2c5282" },
                        IN_PROGRESS: { bg: "#feebc8", color: "#7c2d12" },
                        COMPLETED: { bg: "#c6f6d5", color: "#276749" },
                        CANCELLED: { bg: "var(--wa-color-danger-fill-normal)", color: "#c53030" },
                      }[session.status] || { bg: "var(--color-border)", color: "var(--color-text)" };

                      const isConfirmed = session.isConfirmed;
                      const isRecurring = !!session.scheduleId;
                      const startTime = ensureDate(session.scheduledStart);
                      const endTime = ensureDate(session.scheduledEnd);
                      const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
                      const height = Math.max(60, (duration / 30) * 60);

                      return (
                        <a
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
                        </a>
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
