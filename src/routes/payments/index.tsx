import { createAsync, type RouteDefinition, A, useSubmission, useSearchParams } from "@solidjs/router";
import { Show, For, createSignal, createEffect, onMount } from "solid-js";
import Modal from "~/components/Modal";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { PaymentStatusBadge } from "~/components/wa/StatusBadge";
import { getFamilies } from "~/lib/families";
import { getUnpaidSessions, createPayment, getPayments } from "~/lib/payments";
import { formatTimeLocal } from "~/lib/datetime";
import { formatMoneyDisplay, moneyDisplay } from "~/lib/money-display";

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
  const [searchParams] = useSearchParams();
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
  const unpaidSessions = createAsync(async () => {
    const familyId = selectedFamilyId();
    if (!familyId) {
      return [];
    }
    return getUnpaidSessions(familyId);
  });

  onMount(() => {
    const familyId = searchParams.familyId;
    if (typeof familyId === "string" && familyId) {
      setSelectedFamilyId(familyId);
    }
    if (searchParams.record === "1" || searchParams.record === "true") {
      setShowRecordPayment(true);
    }
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
      const rate = Number(moneyDisplay(session.hourlyRate));
      total += hours * rate;

      // Add expenses for this session
      const expenseTotal =
        (session as any).expenses?.reduce(
          (sum: number, exp: any) => sum + Number(moneyDisplay(exp.amount)),
          0,
        ) || 0;
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
    return formatTimeLocal(date);
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
    <PageContent>
      <PageHeader
        title="Payments"
        actions={
          <wa-button
            variant="success"
            appearance="filled"
            onClick={() => setShowRecordPayment(!showRecordPayment())}
          >
            {showRecordPayment() ? "Hide Record Payment" : "+ Record Payment"}
          </wa-button>
        }
      />

      <wa-card>
        <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px", "margin-bottom": "var(--wa-space-m)" }}>
          <wa-select
            label="Year"
            value={String(selectedYear())}
            onChange={(e) =>
              setSelectedYear(parseInt((e.currentTarget as HTMLSelectElement & { value: string }).value))
            }
          >
            {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
              <wa-option value={String(year)}>{year}</wa-option>
            ))}
          </wa-select>
          <wa-input
            label="Search"
            type="search"
            placeholder="Search by family, invoice, method..."
            value={searchTerm()}
            onInput={(e) => setSearchTerm((e.currentTarget as HTMLInputElement & { value: string }).value)}
          />
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
              <div style={{ "text-align": "center", padding: "2rem", color: "#718096" }}>
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
                            {formatMoneyDisplay(payment.amount)}
                          </td>
                          <td style={{ padding: "0.75rem", "font-size": "0.875rem" }}>
                            {payment.method || "-"}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <PaymentStatusBadge status={payment.status} />
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
                      {formatMoneyDisplay(
                        filteredAndSortedPayments().reduce(
                          (sum, p) => sum + Number(moneyDisplay(p.amount)),
                          0,
                        ),
                      )}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Show>
        </Show>
      </wa-card>

      <Modal
        open={showRecordPayment()}
        title="Record Payment"
        maxWidth="900px"
        onClose={() => setShowRecordPayment(false)}
      >
            <form
              action={createPayment}
              method="post"
            >
        <input type="hidden" name="familyId" value={selectedFamilyId()} />
        <input type="hidden" name="paidDate" value={new Date().toISOString()} />

        <wa-select
          label="Select Family *"
          name="familySelect"
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

        {/* Unpaid Sessions */}
        <Show when={selectedFamilyId()}>
          <Show 
            when={unpaidSessions() && unpaidSessions()!.length > 0}
            fallback={
              <div
                style={{
                  padding: "1rem",
                  "text-align": "center",
                  "background-color": "#f7fafc",
                  "border-radius": "4px",
                  color: "#718096",
                  "margin-bottom": "1rem",
                }}
              >
                No unpaid confirmed sessions found for this family.
              </div>
            }
          >
            <div style={{ "margin-bottom": "1rem" }}>
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
                <Show when={unpaidSessions() && unpaidSessions()!.length > 0}>
                  <wa-button type="button" appearance="outlined" size="small" onClick={toggleAllSessions}>
                    {selectedSessionIds().length === unpaidSessions()!.length
                      ? "Deselect All"
                      : "Select All"}
                  </wa-button>
                </Show>
              </div>

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
                              unpaidSessions() && unpaidSessions()!.length > 0 &&
                              selectedSessionIds().length === unpaidSessions()!.length
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
                      <For each={unpaidSessions()}>
                        {(session) => {
                          const startTime = new Date(session.scheduledStart);
                          const endTime = new Date(session.scheduledEnd);
                          const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
                          const rate = Number(moneyDisplay(session.hourlyRate));
                          const sessionAmount = hours * rate;
                          const expenseTotal =
                            (session as any).expenses?.reduce(
                              (sum: number, exp: any) => sum + Number(moneyDisplay(exp.amount)),
                              0,
                            ) || 0;
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
                                  : "N/A"}
                              </td>
                              <td style={{ padding: "0.75rem", "text-align": "right" }}>
                                {formatDuration(startTime, endTime)}
                              </td>
                              <td style={{ padding: "0.75rem", "text-align": "right" }}>
                                {formatMoneyDisplay(rate)}/hr
                              </td>
                              <td style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600" }}>
                                {formatMoneyDisplay(amount)}
                              </td>
                            </tr>
                          );
                        }}
                      </For>
                    </tbody>
                  </table>
                </div>
            </div>
          </Show>
        </Show>

        {/* Payment Details */}
        <Show when={selectedSessionIds().length > 0}>
          <div
            style={{
              padding: "1.5rem",
              "background-color": "#f7fafc",
              "border-radius": "4px",
              "margin-bottom": "1rem",
            }}
          >
            <h3 style={{ color: "#2d3748", "font-size": "1rem", "margin-bottom": "0.5rem" }}>
              Payment Summary
            </h3>

            <div style={{ display: "grid", gap: "0.75rem", "margin-bottom": "1rem" }}>
              <wa-input
                label="Tips / Bonuses ($)"
                name="tips"
                type="number"
                step="0.01"
                min="0"
                value={tips()}
                onInput={(e) => setTips((e.currentTarget as HTMLInputElement & { value: string }).value)}
                placeholder="0.00"
              />

              <wa-select
                label="Payment Method"
                name="method"
                value={method()}
                onChange={(e) => setMethod((e.currentTarget as HTMLSelectElement & { value: string }).value)}
              >
                <wa-option value="">Select method...</wa-option>
                <wa-option value="cash">Cash</wa-option>
                <wa-option value="check">Check</wa-option>
                <wa-option value="venmo">Venmo</wa-option>
                <wa-option value="zelle">Zelle</wa-option>
                <wa-option value="paypal">PayPal</wa-option>
                <wa-option value="bank_transfer">Bank Transfer</wa-option>
                <wa-option value="other">Other</wa-option>
              </wa-select>

              <wa-textarea
                label="Notes (Optional)"
                name="notes"
                value={notes()}
                onInput={(e) => setNotes((e.currentTarget as HTMLTextAreaElement & { value: string }).value)}
                rows={3}
                placeholder="Additional notes about this payment..."
              />
            </div>

            <div
              style={{
                padding: "0.75rem",
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
                <span style={{ color: "#48bb78" }}>{formatMoneyDisplay(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </Show>

        {/* Error Display */}
        <Show when={submission.result && submission.result instanceof Error}>
          <div
            style={{
              padding: "0.75rem",
              "background-color": "#fff5f5",
              border: "1px solid #feb2b2",
              "border-radius": "4px",
              color: "#c53030",
              "margin-bottom": "0.75rem",
            }}
          >
            {submission.result?.message}
          </div>
        </Show>

              <div class="wa-cluster wa-gap-s" style={{ "justify-content": "flex-end" }}>
                <wa-button type="button" appearance="outlined" onClick={() => setShowRecordPayment(false)}>
                  Cancel
                </wa-button>
                <wa-button
                  type="submit"
                  variant="success"
                  appearance="filled"
                  disabled={submission.pending || selectedSessionIds().length === 0 || undefined}
                >
                  {submission.pending ? "Recording Payment..." : "Record Payment"}
                </wa-button>
              </div>
            </form>
      </Modal>
    </PageContent>
  );
}

