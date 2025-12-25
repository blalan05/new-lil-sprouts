import { createAsync, type RouteDefinition, A, useSubmission } from "@solidjs/router";
import { Show, For, createSignal, createEffect } from "solid-js";
import { getFamilies } from "~/lib/families";
import { getUnpaidSessions, createPayment, getPayments } from "~/lib/payments";

export const route = {
  preload() {
    getFamilies();
    const currentYear = new Date().getFullYear();
    getPayments(currentYear);
  },
} satisfies RouteDefinition;

type SortField = "date" | "family" | "amount" | "method" | "status";
type SortDirection = "asc" | "desc";

export default function PaymentsPage() {
  const families = createAsync(() => getFamilies());
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = createSignal<number>(currentYear);
  const [searchTerm, setSearchTerm] = createSignal<string>("");
  const [sortField, setSortField] = createSignal<SortField>("date");
  const [sortDirection, setSortDirection] = createSignal<SortDirection>("desc");
  const [showRecordPayment, setShowRecordPayment] = createSignal(false);
  
  const allPayments = createAsync(() => {
    const year = selectedYear();
    return getPayments(year);
  });
  const [selectedFamilyId, setSelectedFamilyId] = createSignal<string>("");
  const unpaidSessions = createAsync(() => {
    const familyId = selectedFamilyId();
    return familyId ? getUnpaidSessions(familyId) : Promise.resolve([]);
  });
  const [selectedSessionIds, setSelectedSessionIds] = createSignal<string[]>([]);
  const [tips, setTips] = createSignal<string>("0");
  const [method, setMethod] = createSignal<string>("");
  const [notes, setNotes] = createSignal<string>("");
  const submission = useSubmission(createPayment);

  // Calculate total when sessions or tips change
  const calculateTotal = () => {
    const sessions = unpaidSessions();
    if (!sessions) return 0;

    const selected = sessions.filter((s) => selectedSessionIds().includes(s.id));
    let total = 0;

    for (const session of selected) {
      const startTime = new Date(session.scheduledStart).getTime();
      const endTime = new Date(session.scheduledEnd).getTime();
      const hours = (endTime - startTime) / (1000 * 60 * 60);
      const rate = session.hourlyRate || 0;
      total += hours * rate;

      // Add expenses for this session
      const expenseTotal = (session as any).expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0;
      total += expenseTotal;
    }

    const tipsAmount = parseFloat(tips()) || 0;
    return total + tipsAmount;
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDuration = (start: Date, end: Date) => {
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return `${hours.toFixed(1)} hours`;
  };

  const toggleSession = (sessionId: string) => {
    const current = selectedSessionIds();
    if (current.includes(sessionId)) {
      setSelectedSessionIds(current.filter((id) => id !== sessionId));
    } else {
      setSelectedSessionIds([...current, sessionId]);
    }
  };

  const toggleAllSessions = () => {
    const sessions = unpaidSessions();
    if (!sessions) return;

    if (selectedSessionIds().length === sessions.length) {
      setSelectedSessionIds([]);
    } else {
      setSelectedSessionIds(sessions.map((s) => s.id));
    }
  };

  // Reset selections when family changes
  createEffect(() => {
    setSelectedSessionIds([]);
    setTips("0");
  });

  // Filter and sort payments
  const filteredAndSortedPayments = () => {
    let payments = allPayments() || [];
    const search = searchTerm().toLowerCase();

    // Filter by search term
    if (search) {
      payments = payments.filter(
        (p) =>
          p.family?.familyName.toLowerCase().includes(search) ||
          p.invoiceNumber?.toLowerCase().includes(search) ||
          p.method?.toLowerCase().includes(search) ||
          p.notes?.toLowerCase().includes(search) ||
          p.status.toLowerCase().includes(search)
      );
    }

    // Sort payments
    payments = [...payments].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortField()) {
        case "date":
          aVal = a.paidDate || a.createdAt;
          bVal = b.paidDate || b.createdAt;
          break;
        case "family":
          aVal = a.family?.familyName || "";
          bVal = b.family?.familyName || "";
          break;
        case "amount":
          aVal = a.amount;
          bVal = b.amount;
          break;
        case "method":
          aVal = a.method || "";
          bVal = b.method || "";
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection() === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection() === "asc" ? 1 : -1;
      return 0;
    });

    return payments;
  };

  const handleSort = (field: SortField) => {
    if (sortField() === field) {
      setSortDirection(sortDirection() === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField() !== field) return "↕️";
    return sortDirection() === "asc" ? "↑" : "↓";
  };

  // Watch for successful submission
  createEffect(() => {
    if (submission.result && !(submission.result instanceof Error)) {
      setSelectedFamilyId("");
      setSelectedSessionIds([]);
      setTips("0");
      setMethod("");
      setNotes("");
      setShowRecordPayment(false);
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
      <header style={{ "margin-bottom": "2rem" }}>
        <A
          href="/"
          style={{
            color: "#4299e1",
            "text-decoration": "none",
            "margin-bottom": "0.5rem",
            display: "inline-block",
          }}
        >
          ← Back to Dashboard
        </A>
        <div
          style={{
            display: "flex",
            "justify-content": "space-between",
            "align-items": "flex-start",
            "flex-wrap": "wrap",
            gap: "1rem",
          }}
          class="flex-row-mobile"
        >
          <div>
            <h1 style={{ color: "#2d3748", "font-size": "2rem" }}>Payments</h1>
            <p style={{ color: "#718096", margin: "0.5rem 0 0 0" }}>
              View received payments and record new payments
            </p>
          </div>
          <button
            onClick={() => setShowRecordPayment(!showRecordPayment())}
            style={{
              padding: "0.75rem 1.5rem",
              "background-color": "#48bb78",
              color: "white",
              border: "none",
              "border-radius": "6px",
              "font-weight": "600",
              cursor: "pointer",
            }}
          >
            {showRecordPayment() ? "Hide Record Payment" : "+ Record Payment"}
          </button>
        </div>
      </header>

      {/* Payments Table */}
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
            "margin-bottom": "1.5rem",
            "flex-wrap": "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", "align-items": "center", "flex-wrap": "wrap" }}>
            <div>
              <label
                for="yearFilter"
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
                id="yearFilter"
                value={selectedYear()}
                onChange={(e) => setSelectedYear(parseInt(e.currentTarget.value))}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "0.875rem",
                }}
              >
                {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
                  <option value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: "1", "min-width": "200px" }}>
              <label
                for="searchPayments"
                style={{
                  display: "block",
                  "margin-bottom": "0.25rem",
                  "font-size": "0.875rem",
                  color: "#4a5568",
                  "font-weight": "500",
                }}
              >
                Search
              </label>
              <input
                id="searchPayments"
                type="text"
                placeholder="Search by family, invoice, method..."
                value={searchTerm()}
                onInput={(e) => setSearchTerm(e.currentTarget.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "0.875rem",
                }}
              />
            </div>
          </div>
        </div>

        <Show
          when={allPayments()}
          fallback={
            <div style={{ "text-align": "center", padding: "3rem", color: "#718096" }}>
              Loading payments...
            </div>
          }
        >
          <Show
            when={filteredAndSortedPayments().length > 0}
            fallback={
              <div style={{ "text-align": "center", padding: "3rem", color: "#718096" }}>
                No payments found for {selectedYear()}.
              </div>
            }
          >
            <div style={{ overflow: "auto" }} class="table-responsive">
              <table style={{ width: "100%", "border-collapse": "collapse" }}>
                <thead style={{ "background-color": "#f7fafc" }}>
                  <tr>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                        cursor: "pointer",
                        "user-select": "none",
                      }}
                      onClick={() => handleSort("date")}
                    >
                      Date {getSortIcon("date")}
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                        cursor: "pointer",
                        "user-select": "none",
                      }}
                      onClick={() => handleSort("family")}
                    >
                      Family {getSortIcon("family")}
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                      }}
                    >
                      Invoice #
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "right",
                        "border-bottom": "2px solid #e2e8f0",
                        cursor: "pointer",
                        "user-select": "none",
                      }}
                      onClick={() => handleSort("amount")}
                    >
                      Amount {getSortIcon("amount")}
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                        cursor: "pointer",
                        "user-select": "none",
                      }}
                      onClick={() => handleSort("method")}
                    >
                      Method {getSortIcon("method")}
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid #e2e8f0",
                        cursor: "pointer",
                        "user-select": "none",
                      }}
                      onClick={() => handleSort("status")}
                    >
                      Status {getSortIcon("status")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <For each={filteredAndSortedPayments()}>
                    {(payment) => {
                      const statusColors = {
                        PAID: { bg: "#c6f6d5", color: "#276749" },
                        PENDING: { bg: "#feebc8", color: "#7c2d12" },
                        OVERDUE: { bg: "#fed7d7", color: "#c53030" },
                        CANCELLED: { bg: "#e2e8f0", color: "#4a5568" },
                      }[payment.status] || { bg: "#e2e8f0", color: "#4a5568" };

                      return (
                        <tr
                          style={{
                            "border-bottom": "1px solid #e2e8f0",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f7fafc";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <td style={{ padding: "0.75rem" }}>
                            {formatDate(payment.paidDate || payment.createdAt)}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            {payment.family?.familyName || "N/A"}
                          </td>
                          <td style={{ padding: "0.75rem", "font-size": "0.875rem", color: "#718096" }}>
                            {payment.invoiceNumber || "-"}
                          </td>
                          <td style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600" }}>
                            ${payment.amount.toFixed(2)}
                          </td>
                          <td style={{ padding: "0.75rem", "font-size": "0.875rem" }}>
                            {payment.method || "-"}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <span
                              style={{
                                padding: "0.25rem 0.75rem",
                                "border-radius": "12px",
                                "background-color": statusColors.bg,
                                color: statusColors.color,
                                "font-size": "0.875rem",
                                "font-weight": "600",
                              }}
                            >
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      );
                    }}
                  </For>
                </tbody>
                <tfoot style={{ "background-color": "#f7fafc", "border-top": "2px solid #e2e8f0" }}>
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        padding: "0.75rem",
                        "font-weight": "700",
                        "text-align": "right",
                      }}
                    >
                      Total ({filteredAndSortedPayments().length} payments):
                    </td>
                    <td
                      style={{
                        padding: "0.75rem",
                        "text-align": "right",
                        "font-weight": "700",
                        "font-size": "1.125rem",
                        color: "#48bb78",
                      }}
                    >
                      $
                      {filteredAndSortedPayments()
                        .reduce((sum, p) => sum + p.amount, 0)
                        .toFixed(2)}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Show>
        </Show>
      </div>

      {/* Record Payment Modal */}
      <Show when={showRecordPayment()}>
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
              setShowRecordPayment(false);
            }
          }}
        >
          <div
            style={{
              "background-color": "#fff",
              "border-radius": "8px",
              padding: "2rem",
              "max-width": "900px",
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
                Record Payment
              </h2>
              <button
                onClick={() => setShowRecordPayment(false)}
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
              action={createPayment}
              method="post"
            >
        <input type="hidden" name="familyId" value={selectedFamilyId()} />
        <input type="hidden" name="paidDate" value={new Date().toISOString()} />

        {/* Family Selection */}
        <div style={{ "margin-bottom": "2rem" }}>
          <label
            for="familySelect"
            style={{
              display: "block",
              "margin-bottom": "0.5rem",
              "font-weight": "600",
              color: "#2d3748",
            }}
          >
            Select Family *
          </label>
          <select
            id="familySelect"
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

        {/* Unpaid Sessions */}
        <Show when={selectedFamilyId() && unpaidSessions() && unpaidSessions()!.length > 0}>
          {(sessions) => (
            <div style={{ "margin-bottom": "2rem" }}>
              <div
                style={{
                  display: "flex",
                  "justify-content": "space-between",
                  "align-items": "center",
                  "margin-bottom": "1rem",
                }}
              >
                <label
                  style={{
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  Select Unpaid Sessions *
                </label>
                <Show when={sessions().length > 0}>
                  <button
                    type="button"
                    onClick={toggleAllSessions}
                    style={{
                      padding: "0.5rem 1rem",
                      "background-color": "#edf2f7",
                      color: "#2d3748",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                      cursor: "pointer",
                      "font-size": "0.875rem",
                    }}
                  >
                    {selectedSessionIds().length === sessions().length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </Show>
              </div>

              <Show
                when={sessions().length > 0}
                fallback={
                  <div
                    style={{
                      padding: "2rem",
                      "text-align": "center",
                      "background-color": "#f7fafc",
                      "border-radius": "4px",
                      color: "#718096",
                    }}
                  >
                    No unpaid confirmed sessions found for this family.
                  </div>
                }
              >
                <div
                  style={{
                    "max-height": "400px",
                    overflow: "auto",
                    border: "1px solid #e2e8f0",
                    "border-radius": "4px",
                  }}
                  class="table-responsive"
                >
                  <table style={{ width: "100%", "border-collapse": "collapse" }}>
                    <thead style={{ "background-color": "#f7fafc", position: "sticky", top: 0 }}>
                      <tr>
                        <th
                          style={{
                            padding: "0.75rem",
                            "text-align": "left",
                            "border-bottom": "1px solid #e2e8f0",
                            width: "40px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={
                              sessions().length > 0 &&
                              selectedSessionIds().length === sessions().length
                            }
                            onChange={toggleAllSessions}
                            style={{
                              width: "1.25rem",
                              height: "1.25rem",
                              cursor: "pointer",
                            }}
                          />
                        </th>
                        <th
                          style={{
                            padding: "0.75rem",
                            "text-align": "left",
                            "border-bottom": "1px solid #e2e8f0",
                          }}
                        >
                          Date & Time
                        </th>
                        <th
                          style={{
                            padding: "0.75rem",
                            "text-align": "left",
                            "border-bottom": "1px solid #e2e8f0",
                          }}
                        >
                          Children
                        </th>
                        <th
                          style={{
                            padding: "0.75rem",
                            "text-align": "right",
                            "border-bottom": "1px solid #e2e8f0",
                          }}
                        >
                          Duration
                        </th>
                        <th
                          style={{
                            padding: "0.75rem",
                            "text-align": "right",
                            "border-bottom": "1px solid #e2e8f0",
                          }}
                        >
                          Rate
                        </th>
                        <th
                          style={{
                            padding: "0.75rem",
                            "text-align": "right",
                            "border-bottom": "1px solid #e2e8f0",
                          }}
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={sessions()}>
                        {(session) => {
                          const startTime = new Date(session.scheduledStart);
                          const endTime = new Date(session.scheduledEnd);
                          const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
                          const rate = session.hourlyRate || 0;
                          const sessionAmount = hours * rate;
                          const expenseTotal = (session as any).expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0;
                          const amount = sessionAmount + expenseTotal;
                          const isSelected = selectedSessionIds().includes(session.id);

                          return (
                            <tr
                              style={{
                                "border-bottom": "1px solid #e2e8f0",
                                "background-color": isSelected ? "#f0fff4" : "transparent",
                              }}
                            >
                              <td style={{ padding: "0.75rem" }}>
                                <input
                                  type="checkbox"
                                  name="sessionIds"
                                  value={session.id}
                                  checked={isSelected}
                                  onChange={() => toggleSession(session.id)}
                                  style={{
                                    width: "1.25rem",
                                    height: "1.25rem",
                                    cursor: "pointer",
                                  }}
                                />
                              </td>
                              <td style={{ padding: "0.75rem" }}>
                                <div style={{ "font-weight": "500" }}>
                                  {formatDate(session.scheduledStart)}
                                </div>
                                <div style={{ "font-size": "0.875rem", color: "#718096" }}>
                                  {formatTime(session.scheduledStart)} - {formatTime(session.scheduledEnd)}
                                </div>
                                <div style={{ "font-size": "0.75rem", color: "#a0aec0", "margin-top": "0.25rem" }}>
                                  {session.service?.name || ""}
                                </div>
                              </td>
                              <td style={{ padding: "0.75rem" }}>
                                {session.children && session.children.length > 0 
                                  ? session.children.map((c: any) => c.firstName).join(", ")
                                  : session.service?.requiresChildren ? "No children" : "N/A"}
                              </td>
                              <td style={{ padding: "0.75rem", "text-align": "right" }}>
                                {formatDuration(startTime, endTime)}
                              </td>
                              <td style={{ padding: "0.75rem", "text-align": "right" }}>
                                ${rate.toFixed(2)}/hr
                              </td>
                              <td style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600" }}>
                                ${amount.toFixed(2)}
                              </td>
                            </tr>
                          );
                        }}
                      </For>
                    </tbody>
                  </table>
                </div>
              </Show>
            </div>
          )}
        </Show>

        {/* Payment Details */}
        <Show when={selectedSessionIds().length > 0}>
          <div
            style={{
              padding: "1.5rem",
              "background-color": "#f7fafc",
              "border-radius": "4px",
              "margin-bottom": "2rem",
            }}
          >
            <h3 style={{ color: "#2d3748", "font-size": "1.125rem", "margin-bottom": "1rem" }}>
              Payment Summary
            </h3>

            <div style={{ display: "grid", gap: "1rem", "margin-bottom": "1.5rem" }}>
              <div>
                <label
                  for="tips"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  Tips / Bonuses ($)
                </label>
                <input
                  id="tips"
                  name="tips"
                  type="number"
                  step="0.01"
                  min="0"
                  value={tips()}
                  onInput={(e) => setTips(e.currentTarget.value)}
                  placeholder="0.00"
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
                  for="method"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  Payment Method
                </label>
                <select
                  id="method"
                  name="method"
                  value={method()}
                  onChange={(e) => setMethod(e.currentTarget.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                  }}
                >
                  <option value="">Select method...</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="venmo">Venmo</option>
                  <option value="zelle">Zelle</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  for="notes"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={notes()}
                  onInput={(e) => setNotes(e.currentTarget.value)}
                  rows={3}
                  placeholder="Additional notes about this payment..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                    "font-family": "inherit",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                padding: "1rem",
                "background-color": "#fff",
                "border-radius": "4px",
                border: "2px solid #48bb78",
              }}
            >
              <div
                style={{
                  display: "flex",
                  "justify-content": "space-between",
                  "align-items": "center",
                  "font-size": "1.25rem",
                  "font-weight": "700",
                  color: "#2d3748",
                }}
              >
                <span>Total Amount:</span>
                <span style={{ color: "#48bb78" }}>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Show>

        {/* Error Display */}
        <Show when={submission.result && submission.result instanceof Error}>
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

              {/* Submit Button */}
              <div style={{ display: "flex", gap: "1rem", "justify-content": "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowRecordPayment(false)}
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
                  disabled={submission.pending || selectedSessionIds().length === 0}
                  style={{
                    padding: "0.75rem 1.5rem",
                    "background-color": "#48bb78",
                    color: "white",
                    border: "none",
                    "border-radius": "4px",
                    cursor: submission.pending || selectedSessionIds().length === 0 ? "not-allowed" : "pointer",
                    opacity: submission.pending || selectedSessionIds().length === 0 ? "0.6" : "1",
                    "font-weight": "600",
                  }}
                >
                  {submission.pending ? "Recording Payment..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Show>
    </main>
  );
}

