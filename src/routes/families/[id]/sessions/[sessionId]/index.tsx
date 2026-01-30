import { createAsync, type RouteDefinition, A, useParams, useSubmission } from "@solidjs/router";
import { Show, For, createSignal, createMemo, createEffect } from "solid-js";
import { getCareSession, updateCareSession } from "~/lib/schedule";
import {
  formatDateLocal,
  formatDateTimeLocal,
  formatTimeLocal,
  utcToDatetimeLocal,
} from "~/lib/datetime";
import { recordDropOff, recordPickUp } from "~/lib/care-schedules";
import { getSessionReports } from "~/lib/session-reports";
import { getFamilyMembers } from "~/lib/family-members";
import {
  getSessionExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getSessionExpenseTotal,
} from "~/lib/expenses";

export const route = {
  preload({ params }) {
    if (params.sessionId) {
      getCareSession(params.sessionId);
      getSessionReports(params.sessionId);
      getSessionExpenses(params.sessionId);
      getSessionExpenseTotal(params.sessionId);
      if (params.id) {
        getFamilyMembers(params.id);
      }
    }
  },
  info: {
    ssr: false, // Disable SSR for authenticated pages
  },
} satisfies RouteDefinition;

export default function CareSessionDetail() {
  const params = useParams();
  const session = createAsync(() => getCareSession(params.sessionId!));
  const reports = createAsync(() => getSessionReports(params.sessionId!));
  const expenses = createAsync(() => getSessionExpenses(params.sessionId!));
  const expenseTotal = createAsync(() => getSessionExpenseTotal(params.sessionId!));
  const familyMembers = createAsync(() => getFamilyMembers(params.id!));

  // Create combined list of primary parent + family members for drop-off/pickup
  const allPeople = createMemo(() => {
    const people = [];

    // Add primary parent
    if (session()?.family?.parentFirstName && session()?.family?.parentLastName) {
      people.push({
        id: "primary-parent",
        firstName: session()!.family.parentFirstName,
        lastName: session()!.family.parentLastName,
        relationship: "PARENT",
      });
    }

    // Add family members
    if (familyMembers()) {
      people.push(...familyMembers()!);
    }

    return people;
  });

  const dropOffSubmission = useSubmission(recordDropOff);
  const pickUpSubmission = useSubmission(recordPickUp);
  const expenseSubmission = useSubmission(createExpense);
  const updateExpenseSubmission = useSubmission(updateExpense);
  const deleteExpenseSubmission = useSubmission(deleteExpense);
  const updateSessionSubmission = useSubmission(updateCareSession);

  const [showDropOffForm, setShowDropOffForm] = createSignal(false);
  const [showPickUpForm, setShowPickUpForm] = createSignal(false);
  const [showExpenseForm, setShowExpenseForm] = createSignal(false);
  const [editingExpenseId, setEditingExpenseId] = createSignal<string | null>(null);
  const [editingMeals, setEditingMeals] = createSignal(false);
  const [breakfastCount, setBreakfastCount] = createSignal(0);
  const [morningSnackCount, setMorningSnackCount] = createSignal(0);
  const [lunchCount, setLunchCount] = createSignal(0);
  const [afternoonSnackCount, setAfternoonSnackCount] = createSignal(0);
  const [dinnerCount, setDinnerCount] = createSignal(0);

  // Initialize meal counts when editing starts or session loads
  createEffect(() => {
    const currentSession = session();
    if (currentSession) {
      setBreakfastCount(currentSession.breakfastCount || 0);
      setMorningSnackCount(currentSession.morningSnackCount || 0);
      setLunchCount(currentSession.lunchCount || 0);
      setAfternoonSnackCount(currentSession.afternoonSnackCount || 0);
      setDinnerCount(currentSession.dinnerCount || 0);
    }
  });

  const formatDate = formatDateLocal;
  const formatDateTime = formatDateTimeLocal;
  const formatTime = formatTimeLocal;

  const formatStatus = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "Scheduled";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "INFO":
        return { bg: "#bee3f8", color: "#2c5282" };
      case "MINOR":
        return { bg: "#c6f6d5", color: "#276749" };
      case "MODERATE":
        return { bg: "#feebc8", color: "#7c2d12" };
      case "SEVERE":
        return { bg: "#fed7d7", color: "#c53030" };
      default:
        return { bg: "#e2e8f0", color: "#2d3748" };
    }
  };

  return (
    <main
      style={{
        "max-width": "1200px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <Show
        when={session()}
        fallback={
          <div style={{ "text-align": "center", padding: "3rem" }}>Loading session details...</div>
        }
      >
        <header style={{ "margin-bottom": "2rem" }}>
          <A
            href={`/families/${params.id}`}
            style={{
              color: "#4299e1",
              "text-decoration": "none",
              "margin-bottom": "0.5rem",
              display: "inline-block",
            }}
          >
            ← Back to Family
          </A>
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
            }}
          >
            <div>
              <h1 style={{ color: "#2d3748", "font-size": "2rem", "margin-bottom": "0.5rem" }}>
                Care Session
              </h1>
              <p style={{ color: "#718096", margin: 0 }}>
                {session()?.scheduledStart && formatDateTime(session()!.scheduledStart)}
              </p>
            </div>
            <div style={{ display: "flex", "align-items": "center", gap: "1rem" }}>
              <A
                href={`/families/${params.id}/sessions/${params.sessionId}/edit`}
                style={{
                  padding: "0.5rem 1rem",
                  "background-color": "#4299e1",
                  color: "#fff",
                  border: "none",
                  "border-radius": "4px",
                  "text-decoration": "none",
                  "font-weight": "600",
                  "font-size": "0.875rem",
                }}
              >
                Edit Session
              </A>
              <button
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this session?")) {
                    const formData = new FormData();
                    formData.append("id", params.sessionId!);
                    const { deleteCareSession } = await import("~/lib/schedule");
                    await deleteCareSession(formData);
                    window.location.href = `/families/${params.id}`;
                  }
                }}
                style={{
                  padding: "0.5rem 1rem",
                  "background-color": "#f56565",
                  color: "#fff",
                  border: "none",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-weight": "600",
                  "font-size": "0.875rem",
                }}
              >
                Delete Session
              </button>
              <span
                style={{
                  padding: "0.5rem 1.5rem",
                  "border-radius": "9999px",
                  "background-color": getStatusColor(session()?.status || "").bg,
                  color: getStatusColor(session()?.status || "").color,
                  "font-weight": "600",
                }}
              >
                {formatStatus(session()?.status || "")}
              </span>
            </div>
          </div>
        </header>

        {/* Session Details */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "margin-bottom": "2rem",
          }}
        >
          <h2
            style={{
              "font-size": "1.25rem",
              "margin-bottom": "1rem",
              color: "#2d3748",
            }}
          >
            Session Information
          </h2>
          <div
            style={{
              display: "grid",
              "grid-template-columns": "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <strong style={{ color: "#4a5568" }}>Scheduled Time:</strong>
              <p style={{ margin: "0.25rem 0 0 0" }}>
                {session()?.scheduledStart && formatTime(session()!.scheduledStart)} -{" "}
                {session()?.scheduledEnd && formatTime(session()!.scheduledEnd)}
              </p>
            </div>
            <Show when={session()?.hourlyRate}>
              <div>
                <strong style={{ color: "#4a5568" }}>Rate:</strong>
                <p style={{ margin: "0.25rem 0 0 0" }}>${session()?.hourlyRate}/hour</p>
              </div>
            </Show>
            <div>
              <strong style={{ color: "#4a5568" }}>Status:</strong>
              <p style={{ margin: "0.25rem 0 0 0" }}>
                {session()?.isConfirmed ? "✓ Confirmed" : "⚠️ Not Confirmed"}
              </p>
            </div>
          </div>

          <Show when={session()?.children?.length}>
            <div style={{ "margin-top": "1rem" }}>
              <strong style={{ color: "#4a5568" }}>Children:</strong>
              <p style={{ margin: "0.25rem 0 0 0" }}>
                {session()
                  ?.children?.map((c: any) => `${c.firstName} ${c.lastName}`)
                  .join(", ")}
              </p>
            </div>
          </Show>

          <Show when={session()?.notes}>
            <div style={{ "margin-top": "1rem" }}>
              <strong style={{ color: "#4a5568" }}>Notes:</strong>
              <p style={{ margin: "0.25rem 0 0 0", color: "#718096" }}>{session()?.notes}</p>
            </div>
          </Show>
        </div>

        {/* Drop-off Tracking */}
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
            <h2 style={{ "font-size": "1.25rem", color: "#2d3748", margin: 0 }}>Drop-off</h2>
            <Show when={!session()?.dropOffTime && !showDropOffForm()}>
              <button
                onClick={() => setShowDropOffForm(true)}
                style={{
                  padding: "0.5rem 1rem",
                  "background-color": "#48bb78",
                  color: "white",
                  border: "none",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-weight": "600",
                  "font-size": "0.875rem",
                }}
              >
                Record Drop-off
              </button>
            </Show>
          </div>

          <Show
            when={session()?.dropOffTime}
            fallback={
              <Show
                when={showDropOffForm()}
                fallback={<p style={{ color: "#718096", margin: 0 }}>Not yet recorded</p>}
              >
                <form
                  action={recordDropOff}
                  method="post"
                  style={{
                    "background-color": "#f7fafc",
                    padding: "1rem",
                    "border-radius": "4px",
                  }}
                >
                  <input type="hidden" name="sessionId" value={params.sessionId} />

                  <div style={{ "margin-bottom": "1rem" }}>
                    <label
                      for="dropOffBy"
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        "font-weight": "600",
                        color: "#2d3748",
                      }}
                    >
                      Dropped off by: *
                    </label>
                    <select
                      id="dropOffBy"
                      name="dropOffBy"
                      required
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                      }}
                    >
                      <option value="">Select person...</option>
                      <For each={allPeople()}>
                        {(member) => (
                          <option value={`${member.firstName} ${member.lastName}`}>
                            {member.firstName} {member.lastName} ({member.relationship})
                          </option>
                        )}
                      </For>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div style={{ "margin-bottom": "1rem" }}>
                    <label
                      for="dropOffTime"
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        "font-weight": "600",
                        color: "#2d3748",
                      }}
                    >
                      Time:
                    </label>
                    <input
                      id="dropOffTime"
                      name="dropOffTime"
                      type="datetime-local"
                      value={utcToDatetimeLocal(new Date())}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="submit"
                      disabled={dropOffSubmission.pending}
                      style={{
                        padding: "0.5rem 1rem",
                        "background-color": "#48bb78",
                        color: "white",
                        border: "none",
                        "border-radius": "4px",
                        cursor: dropOffSubmission.pending ? "not-allowed" : "pointer",
                        "font-weight": "600",
                      }}
                    >
                      {dropOffSubmission.pending ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDropOffForm(false)}
                      style={{
                        padding: "0.5rem 1rem",
                        "background-color": "#edf2f7",
                        color: "#2d3748",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Show>
            }
          >
            <div
              style={{
                "background-color": "#f0fff4",
                padding: "1rem",
                "border-radius": "4px",
                border: "1px solid #c6f6d5",
              }}
            >
              <div style={{ "margin-bottom": "0.5rem" }}>
                <strong style={{ color: "#276749" }}>Time:</strong>{" "}
                <span style={{ color: "#2d3748" }}>
                  {session()?.dropOffTime ? formatDateTime(session()!.dropOffTime!) : "N/A"}
                </span>
              </div>
              <div>
                <strong style={{ color: "#276749" }}>Dropped off by:</strong>{" "}
                <span style={{ color: "#2d3748" }}>{session()?.dropOffBy}</span>
              </div>
            </div>
          </Show>
        </div>

        {/* Pick-up Tracking */}
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
            <h2 style={{ "font-size": "1.25rem", color: "#2d3748", margin: 0 }}>Pick-up</h2>
            <Show when={!session()?.pickUpTime && !showPickUpForm()}>
              <button
                onClick={() => setShowPickUpForm(true)}
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
                Record Pick-up
              </button>
            </Show>
          </div>

          <Show
            when={session()?.pickUpTime}
            fallback={
              <Show
                when={showPickUpForm()}
                fallback={<p style={{ color: "#718096", margin: 0 }}>Not yet recorded</p>}
              >
                <form
                  action={recordPickUp}
                  method="post"
                  style={{
                    "background-color": "#f7fafc",
                    padding: "1rem",
                    "border-radius": "4px",
                  }}
                >
                  <input type="hidden" name="sessionId" value={params.sessionId} />

                  <div style={{ "margin-bottom": "1rem" }}>
                    <label
                      for="pickUpBy"
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        "font-weight": "600",
                        color: "#2d3748",
                      }}
                    >
                      Picked up by: *
                    </label>
                    <select
                      id="pickUpBy"
                      name="pickUpBy"
                      required
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                      }}
                    >
                      <option value="">Select person...</option>
                      <For each={allPeople()}>
                        {(member) => (
                          <option value={`${member.firstName} ${member.lastName}`}>
                            {member.firstName} {member.lastName} ({member.relationship})
                          </option>
                        )}
                      </For>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div style={{ "margin-bottom": "1rem" }}>
                    <label
                      for="pickUpTime"
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        "font-weight": "600",
                        color: "#2d3748",
                      }}
                    >
                      Time:
                    </label>
                    <input
                      id="pickUpTime"
                      name="pickUpTime"
                      type="datetime-local"
                      value={utcToDatetimeLocal(new Date())}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="submit"
                      disabled={pickUpSubmission.pending}
                      style={{
                        padding: "0.5rem 1rem",
                        "background-color": "#4299e1",
                        color: "white",
                        border: "none",
                        "border-radius": "4px",
                        cursor: pickUpSubmission.pending ? "not-allowed" : "pointer",
                        "font-weight": "600",
                      }}
                    >
                      {pickUpSubmission.pending ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPickUpForm(false)}
                      style={{
                        padding: "0.5rem 1rem",
                        "background-color": "#edf2f7",
                        color: "#2d3748",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Show>
            }
          >
            <div
              style={{
                "background-color": "#ebf8ff",
                padding: "1rem",
                "border-radius": "4px",
                border: "1px solid #bee3f8",
              }}
            >
              <div style={{ "margin-bottom": "0.5rem" }}>
                <strong style={{ color: "#2c5282" }}>Time:</strong>{" "}
                <span style={{ color: "#2d3748" }}>
                  {session()?.pickUpTime ? formatDateTime(session()!.pickUpTime!) : "N/A"}
                </span>
              </div>
              <div>
                <strong style={{ color: "#2c5282" }}>Picked up by:</strong>{" "}
                <span style={{ color: "#2d3748" }}>{session()?.pickUpBy}</span>
              </div>
            </div>
          </Show>
        </div>

        {/* Meal Counts */}
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
            <h2 style={{ "font-size": "1.25rem", color: "#2d3748", margin: 0 }}>Meal Counts</h2>
            <Show when={!editingMeals()}>
              <button
                onClick={() => {
                  const currentSession = session();
                  if (currentSession) {
                    setBreakfastCount(currentSession.breakfastCount || 0);
                    setMorningSnackCount(currentSession.morningSnackCount || 0);
                    setLunchCount(currentSession.lunchCount || 0);
                    setAfternoonSnackCount(currentSession.afternoonSnackCount || 0);
                    setDinnerCount(currentSession.dinnerCount || 0);
                  }
                  setEditingMeals(true);
                }}
                style={{
                  padding: "0.5rem 1rem",
                  "background-color": "#48bb78",
                  color: "white",
                  border: "none",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-weight": "600",
                  "font-size": "0.875rem",
                }}
              >
                Edit Meal Counts
              </button>
            </Show>
          </div>

          <Show
            when={editingMeals()}
            fallback={
              <div
                style={{
                  display: "grid",
                  "grid-template-columns": "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    padding: "1rem",
                    "background-color": "#f7fafc",
                    "border-radius": "4px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      color: "#718096",
                      "font-size": "0.875rem",
                      "margin-bottom": "0.25rem",
                    }}
                  >
                    Breakfast
                  </div>
                  <div style={{ "font-size": "1.5rem", "font-weight": "700", color: "#2d3748" }}>
                    {session()?.breakfastCount || 0}
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    "background-color": "#f7fafc",
                    "border-radius": "4px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      color: "#718096",
                      "font-size": "0.875rem",
                      "margin-bottom": "0.25rem",
                    }}
                  >
                    Morning Snack
                  </div>
                  <div style={{ "font-size": "1.5rem", "font-weight": "700", color: "#2d3748" }}>
                    {session()?.morningSnackCount || 0}
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    "background-color": "#f7fafc",
                    "border-radius": "4px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      color: "#718096",
                      "font-size": "0.875rem",
                      "margin-bottom": "0.25rem",
                    }}
                  >
                    Lunch
                  </div>
                  <div style={{ "font-size": "1.5rem", "font-weight": "700", color: "#2d3748" }}>
                    {session()?.lunchCount || 0}
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    "background-color": "#f7fafc",
                    "border-radius": "4px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      color: "#718096",
                      "font-size": "0.875rem",
                      "margin-bottom": "0.25rem",
                    }}
                  >
                    Afternoon Snack
                  </div>
                  <div style={{ "font-size": "1.5rem", "font-weight": "700", color: "#2d3748" }}>
                    {session()?.afternoonSnackCount || 0}
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    "background-color": "#f7fafc",
                    "border-radius": "4px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      color: "#718096",
                      "font-size": "0.875rem",
                      "margin-bottom": "0.25rem",
                    }}
                  >
                    Dinner
                  </div>
                  <div style={{ "font-size": "1.5rem", "font-weight": "700", color: "#2d3748" }}>
                    {session()?.dinnerCount || 0}
                  </div>
                </div>
              </div>
            }
          >
            <form
              action={updateCareSession}
              method="post"
              style={{
                "background-color": "#f7fafc",
                padding: "1rem",
                "border-radius": "4px",
              }}
            >
              <input type="hidden" name="sessionId" value={params.sessionId} />
              <input type="hidden" name="notes" value={session()?.notes || ""} />

              <div
                style={{
                  display: "grid",
                  "grid-template-columns": "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "1rem",
                  "margin-bottom": "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                    }}
                  >
                    Breakfast
                  </label>
                  <input
                    type="number"
                    name="breakfastCount"
                    min="0"
                    value={breakfastCount()}
                    onInput={(e) => setBreakfastCount(parseInt(e.currentTarget.value) || 0)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                    }}
                  >
                    Morning Snack
                  </label>
                  <input
                    type="number"
                    name="morningSnackCount"
                    min="0"
                    value={morningSnackCount()}
                    onInput={(e) => setMorningSnackCount(parseInt(e.currentTarget.value) || 0)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                    }}
                  >
                    Lunch
                  </label>
                  <input
                    type="number"
                    name="lunchCount"
                    min="0"
                    value={lunchCount()}
                    onInput={(e) => setLunchCount(parseInt(e.currentTarget.value) || 0)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                    }}
                  >
                    Afternoon Snack
                  </label>
                  <input
                    type="number"
                    name="afternoonSnackCount"
                    min="0"
                    value={afternoonSnackCount()}
                    onInput={(e) => setAfternoonSnackCount(parseInt(e.currentTarget.value) || 0)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                    }}
                  >
                    Dinner
                  </label>
                  <input
                    type="number"
                    name="dinnerCount"
                    min="0"
                    value={dinnerCount()}
                    onInput={(e) => setDinnerCount(parseInt(e.currentTarget.value) || 0)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", "justify-content": "flex-end" }}>
                <button
                  type="submit"
                  disabled={updateSessionSubmission.pending}
                  onClick={() => {
                    // Close edit mode immediately when save button is clicked
                    setEditingMeals(false);
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    "background-color": "#48bb78",
                    color: "white",
                    border: "none",
                    "border-radius": "4px",
                    cursor: updateSessionSubmission.pending ? "not-allowed" : "pointer",
                    "font-weight": "600",
                  }}
                >
                  {updateSessionSubmission.pending ? "Saving..." : "Save Meal Counts"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMeals(false)}
                  style={{
                    padding: "0.5rem 1rem",
                    "background-color": "#edf2f7",
                    color: "#2d3748",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Show>
        </div>

        {/* Session Reports */}
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
            <h2 style={{ "font-size": "1.25rem", color: "#2d3748", margin: 0 }}>
              Reports & Notes ({reports()?.length || 0})
            </h2>
            <A
              href={`/families/${params.id}/sessions/${params.sessionId}/reports/new`}
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#805ad5",
                color: "white",
                border: "none",
                "border-radius": "4px",
                "text-decoration": "none",
                "font-weight": "600",
                "font-size": "0.875rem",
              }}
            >
              + Add Report
            </A>
          </div>

          <Show
            when={reports()?.length}
            fallback={
              <p style={{ color: "#718096", "text-align": "center", padding: "2rem" }}>
                No reports yet. Add incidents, meals, naps, or activities.
              </p>
            }
          >
            <div style={{ display: "grid", gap: "1rem" }}>
              <For each={reports()}>
                {(report: any) => {
                  const severityColors = getSeverityColor(report.severity);
                  return (
                    <div
                      style={{
                        padding: "1rem",
                        border: "1px solid #e2e8f0",
                        "border-radius": "4px",
                        "background-color": "#f7fafc",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          "justify-content": "space-between",
                          "margin-bottom": "0.5rem",
                        }}
                      >
                        <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                          <h3 style={{ color: "#2d3748", margin: 0 }}>{report.title}</h3>
                          <span
                            style={{
                              padding: "0.25rem 0.5rem",
                              "border-radius": "4px",
                              "background-color": severityColors.bg,
                              color: severityColors.color,
                              "font-size": "0.75rem",
                              "font-weight": "600",
                            }}
                          >
                            {report.type}
                          </span>
                          <Show when={report.followUpNeeded}>
                            <span
                              style={{
                                padding: "0.25rem 0.5rem",
                                "border-radius": "4px",
                                "background-color": "#fef3c7",
                                color: "#92400e",
                                "font-size": "0.75rem",
                                "font-weight": "600",
                              }}
                            >
                              Follow-up Needed
                            </span>
                          </Show>
                        </div>
                        <span style={{ color: "#718096", "font-size": "0.875rem" }}>
                          {formatTime(report.timestamp)}
                        </span>
                      </div>
                      <p style={{ color: "#4a5568", "margin-bottom": "0.5rem" }}>
                        {report.description}
                      </p>
                      <div style={{ "font-size": "0.875rem", color: "#718096" }}>
                        Child: {report.child.firstName} {report.child.lastName}
                      </div>
                      <Show when={report.actionTaken}>
                        <div
                          style={{
                            "margin-top": "0.5rem",
                            "padding-top": "0.5rem",
                            "border-top": "1px solid #e2e8f0",
                          }}
                        >
                          <strong style={{ color: "#4a5568", "font-size": "0.875rem" }}>
                            Action Taken:
                          </strong>
                          <p
                            style={{
                              color: "#718096",
                              "font-size": "0.875rem",
                              margin: "0.25rem 0 0 0",
                            }}
                          >
                            {report.actionTaken}
                          </p>
                        </div>
                      </Show>
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>
        </div>

        {/* Session Expenses */}
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
            <div>
              <h2 style={{ "font-size": "1.25rem", color: "#2d3748", margin: 0 }}>
                Expenses ({expenses()?.length || 0})
              </h2>
              <Show when={expenseTotal() && expenseTotal()! > 0}>
                <p style={{ margin: "0.25rem 0 0 0", color: "#718096", "font-size": "0.875rem" }}>
                  Total: <strong style={{ color: "#2d3748" }}>${expenseTotal()?.toFixed(2)}</strong>
                </p>
              </Show>
            </div>
            <Show when={!showExpenseForm() && editingExpenseId() === null}>
              <button
                onClick={() => setShowExpenseForm(true)}
                style={{
                  padding: "0.5rem 1rem",
                  "background-color": "#48bb78",
                  color: "white",
                  border: "none",
                  "border-radius": "4px",
                  cursor: "pointer",
                  "font-weight": "600",
                  "font-size": "0.875rem",
                }}
              >
                + Add Expense
              </button>
            </Show>
          </div>

          <Show when={showExpenseForm() || editingExpenseId() !== null}>
            <form
              action={editingExpenseId() ? updateExpense : createExpense}
              method="post"
              style={{
                "background-color": "#f7fafc",
                padding: "1rem",
                "border-radius": "4px",
                "margin-bottom": "1rem",
              }}
            >
              <input type="hidden" name="sessionId" value={params.sessionId} />
              <Show when={editingExpenseId()}>
                <input type="hidden" name="id" value={editingExpenseId()!} />
              </Show>

              <div
                style={{
                  display: "grid",
                  "grid-template-columns": "2fr 1fr 1fr",
                  gap: "1rem",
                  "margin-bottom": "1rem",
                }}
              >
                <div>
                  <label
                    for="description"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                      "font-size": "0.875rem",
                    }}
                  >
                    Description *
                  </label>
                  <input
                    id="description"
                    name="description"
                    type="text"
                    required
                    placeholder="e.g., Lunch at McDonald's"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                    }}
                  />
                </div>
                <div>
                  <label
                    for="amount"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                      "font-size": "0.875rem",
                    }}
                  >
                    Amount ($) *
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                    }}
                  />
                </div>
                <div>
                  <label
                    for="category"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                      "font-size": "0.875rem",
                    }}
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="FOOD">Food</option>
                    <option value="ACTIVITY">Activity</option>
                    <option value="SUPPLIES">Supplies</option>
                    <option value="TRANSPORTATION">Transportation</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  for="notes"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                    "font-size": "0.875rem",
                  }}
                >
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  placeholder="Additional details..."
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-family": "inherit",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="submit"
                  disabled={expenseSubmission.pending || updateExpenseSubmission.pending}
                  style={{
                    padding: "0.5rem 1rem",
                    "background-color": "#48bb78",
                    color: "white",
                    border: "none",
                    "border-radius": "4px",
                    cursor:
                      expenseSubmission.pending || updateExpenseSubmission.pending
                        ? "not-allowed"
                        : "pointer",
                    "font-weight": "600",
                  }}
                >
                  {expenseSubmission.pending || updateExpenseSubmission.pending
                    ? "Saving..."
                    : editingExpenseId()
                      ? "Update"
                      : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExpenseForm(false);
                    setEditingExpenseId(null);
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    "background-color": "#edf2f7",
                    color: "#2d3748",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Show>

          <Show
            when={expenses()?.length}
            fallback={
              <p style={{ color: "#718096", "text-align": "center", padding: "2rem" }}>
                No expenses recorded yet. Add lunch, trips, supplies, or other expenses.
              </p>
            }
          >
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <For each={expenses()}>
                {(expense: any) => {
                  const categoryLabels: Record<string, string> = {
                    FOOD: "Food",
                    ACTIVITY: "Activity",
                    SUPPLIES: "Supplies",
                    TRANSPORTATION: "Transportation",
                    OTHER: "Other",
                  };
                  return (
                    <div
                      style={{
                        display: "flex",
                        "justify-content": "space-between",
                        "align-items": "flex-start",
                        padding: "1rem",
                        border: "1px solid #e2e8f0",
                        "border-radius": "4px",
                        "background-color": "#f7fafc",
                      }}
                    >
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            display: "flex",
                            "align-items": "center",
                            gap: "0.5rem",
                            "margin-bottom": "0.25rem",
                          }}
                        >
                          <strong style={{ color: "#2d3748" }}>{expense.description}</strong>
                          {expense.category && (
                            <span
                              style={{
                                padding: "0.125rem 0.5rem",
                                "border-radius": "4px",
                                "background-color": "#e6fffa",
                                color: "#234e52",
                                "font-size": "0.75rem",
                                "font-weight": "600",
                              }}
                            >
                              {categoryLabels[expense.category] || expense.category}
                            </span>
                          )}
                        </div>
                        <div style={{ "font-size": "0.875rem", color: "#718096" }}>
                          {formatTime(expense.createdAt)}
                        </div>
                        <Show when={expense.notes}>
                          <p
                            style={{
                              "margin-top": "0.5rem",
                              color: "#4a5568",
                              "font-size": "0.875rem",
                            }}
                          >
                            {expense.notes}
                          </p>
                        </Show>
                      </div>
                      <div style={{ display: "flex", "align-items": "center", gap: "1rem" }}>
                        <div style={{ "text-align": "right" }}>
                          <div
                            style={{
                              "font-size": "1.125rem",
                              "font-weight": "600",
                              color: "#2d3748",
                            }}
                          >
                            ${expense.amount.toFixed(2)}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => {
                              setEditingExpenseId(expense.id);
                              setShowExpenseForm(false);
                            }}
                            style={{
                              padding: "0.25rem 0.5rem",
                              "background-color": "#edf2f7",
                              color: "#2d3748",
                              border: "1px solid #cbd5e0",
                              "border-radius": "4px",
                              cursor: "pointer",
                              "font-size": "0.75rem",
                            }}
                          >
                            Edit
                          </button>
                          <form
                            action={deleteExpense}
                            method="post"
                            style={{ display: "inline" }}
                            onSubmit={(e) => {
                              if (!confirm("Are you sure you want to delete this expense?")) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="id" value={expense.id} />
                            <button
                              type="submit"
                              disabled={deleteExpenseSubmission.pending}
                              style={{
                                padding: "0.25rem 0.5rem",
                                "background-color": "#fff5f5",
                                color: "#c53030",
                                border: "1px solid #feb2b2",
                                "border-radius": "4px",
                                cursor: deleteExpenseSubmission.pending ? "not-allowed" : "pointer",
                                "font-size": "0.75rem",
                              }}
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>
        </div>
      </Show>
    </main>
  );
}
