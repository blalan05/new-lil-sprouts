import { useSearchParams } from "@solidjs/router";
import { useSubmission } from "~/lib/use-submission";
import { Show, For, createSignal, createEffect, createMemo, onSettled } from "solid-js";
import Modal from "~/components/Modal";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import EmptyState from "~/components/EmptyState";
import ListToolbar from "~/components/ListToolbar";
import { PaymentStatusBadge, SessionStatusBadge } from "~/components/wa/StatusBadge";
import { getFamilies } from "~/lib/families";
import { getUnpaidSessions, getUnpaidQueue, createPayment, getPayments } from "~/lib/payments";
import { formatTimeLocal } from "~/lib/datetime";
import { formatMoneyDisplay, moneyDisplay } from "~/lib/money-display";
import {
  compareSort,
  matchesQuery,
  moneyNumber,
  paymentSearchParts,
  sessionSearchParts,
} from "~/lib/list-query";
import { useListQuery } from "~/lib/use-list-query";

export const route = {
  preload() {
    getFamilies();
    const currentYear = new Date().getFullYear();
    getPayments(currentYear);
    getUnpaidQueue();
  },
};

type SortField = "date" | "family" | "amount" | "method";

export default function PaymentsPage() {
  const [searchParams] = useSearchParams();
  const list = useListQuery({ sort: "date", dir: "desc" });
  const families = createMemo(() => getFamilies());
  const currentYear = new Date().getFullYear();
  const selectedYear = () => {
    const parsed = Number(list.year());
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    return years.includes(parsed) ? parsed : currentYear;
  };
  const [showRecordPayment, setShowRecordPayment] = createSignal(false);
  
  const allPayments = createMemo(() => getPayments(selectedYear()));
  const unpaidQueue = createMemo(() => getUnpaidQueue());
  const [selectedFamilyId, setSelectedFamilyId] = createSignal<string>("");
  const unpaidSessions = createMemo(async () => {
    const familyId = selectedFamilyId();
    if (!familyId) {
      return [];
    }
    return getUnpaidSessions(familyId);
  });

  onSettled(() => {
    if (searchParams.record === "1" || searchParams.record === "true") {
      setShowRecordPayment(true);
    }
  });

  createEffect(() => {
    const familyId = list.family();
    if (familyId !== selectedFamilyId()) setSelectedFamilyId(familyId);
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
    selectedFamilyId();
    setSelectedSessionIds([]);
    setTips("0");
  });

  const sortMark = (field: SortField) => {
    if (list.sort() !== field) return "";
    return list.dir() === "asc" ? " (asc)" : " (desc)";
  };

  const filteredAndSortedPayments = () => {
    let payments = (allPayments() || []).filter((payment) => {
      if (list.family() && payment.family?.id !== list.family() && payment.familyId !== list.family()) {
        return false;
      }
      return matchesQuery(list.q(), paymentSearchParts(payment));
    });

    const field = (list.sort() || "date") as SortField;
    const dir = list.dir();
    payments = [...payments].sort((a, b) => {
      switch (field) {
        case "family":
          return compareSort(
            (a.family?.familyName || "").toLowerCase(),
            (b.family?.familyName || "").toLowerCase(),
            dir,
          );
        case "amount":
          return compareSort(moneyNumber(a.amount), moneyNumber(b.amount), dir);
        case "method":
          return compareSort((a.method || "").toLowerCase(), (b.method || "").toLowerCase(), dir);
        default:
          return compareSort(
            new Date(a.paidDate || a.createdAt).getTime(),
            new Date(b.paidDate || b.createdAt).getTime(),
            dir,
          );
      }
    });

    return payments;
  };

  const sessionAmount = (session: {
    scheduledStart: string | Date;
    scheduledEnd: string | Date;
    hourlyRate: unknown;
    expenses?: { amount: unknown }[];
  }) => {
    const hours =
      (new Date(session.scheduledEnd).getTime() - new Date(session.scheduledStart).getTime()) / (1000 * 60 * 60);
    const expenses = (session.expenses ?? []).reduce((sum, expense) => sum + moneyNumber(expense.amount as never), 0);
    return hours * moneyNumber(session.hourlyRate as never) + expenses;
  };

  const filteredUnpaid = () => {
    let sessions = unpaidQueue() || [];
    sessions = sessions.filter((session) => {
      if (list.family() && session.familyId !== list.family() && session.family?.id !== list.family()) return false;
      return matchesQuery(list.q(), sessionSearchParts(session));
    });
    const field = list.sort() || "date";
    const dir = list.dir();
    return [...sessions].sort((a, b) => {
      if (field === "family") {
        return compareSort(
          (a.family?.familyName || "").toLowerCase(),
          (b.family?.familyName || "").toLowerCase(),
          dir,
        );
      }
      if (field === "amount") return compareSort(sessionAmount(a), sessionAmount(b), dir);
      return compareSort(new Date(a.scheduledStart).getTime(), new Date(b.scheduledStart).getTime(), dir);
    });
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
        description="Recorded payments are stored as paid. Unpaid sessions are confirmed care that does not have a paid payment yet."
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

      <ListToolbar
        query={list}
        searchPlaceholder="Search family, invoice, method, notes, or status"
        families={families() ?? []}
        chipGroups={[
          {
            param: "queue",
            label: "Show",
            options: [{ value: "unpaid", label: "Unpaid sessions" }],
          },
        ]}
        sortOptions={
          list.queue() === "unpaid"
            ? [
                { value: "date", label: "Date" },
                { value: "family", label: "Family" },
                { value: "amount", label: "Amount" },
              ]
            : [
                { value: "date", label: "Date" },
                { value: "family", label: "Family" },
                { value: "amount", label: "Amount" },
                { value: "method", label: "Method" },
              ]
        }
        sortValue={
          (list.queue() === "unpaid" ? ["date", "family", "amount"] : ["date", "family", "amount", "method"]).includes(
            list.sort(),
          )
            ? list.sort()
            : "date"
        }
        total={list.queue() === "unpaid" ? (unpaidQueue()?.length ?? 0) : (allPayments()?.length ?? 0)}
        visible={list.queue() === "unpaid" ? filteredUnpaid().length : filteredAndSortedPayments().length}
      >
        <Show when={list.queue() !== "unpaid"}>
          <wa-select
            label="Year"
            value={String(selectedYear())}
            onChange={(e) =>
              list.setYear((e.currentTarget as HTMLSelectElement & { value: string }).value)
            }
          >
            {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
              <wa-option value={String(year)}>{year}</wa-option>
            ))}
          </wa-select>
        </Show>
      </ListToolbar>

      <Show
        when={list.queue() !== "unpaid"}
        fallback={
          <wa-card>
            <Show
              when={unpaidQueue()}
              fallback={<p class="wa-body-m wa-color-text-quiet" style={{ "text-align": "center" }}>Loading unpaid sessions...</p>}
            >
              <Show
                when={filteredUnpaid().length > 0}
                fallback={
                  <EmptyState
                    message={
                      (unpaidQueue()?.length ?? 0) === 0
                        ? "No unpaid sessions. Confirmed sessions without a paid payment show up here."
                        : "No unpaid sessions match these filters."
                    }
                    actionLabel={(unpaidQueue()?.length ?? 0) > 0 && list.hasFilters() ? "Clear filters" : undefined}
                    onAction={() => list.clearFilters()}
                  />
                }
              >
                <div style={{ overflow: "auto" }} class="table-responsive">
                  <table style={{ width: "100%", "border-collapse": "collapse" }}>
                    <thead style={{ "background-color": "var(--color-surface-muted)" }}>
                      <tr>
                        <th style={{ padding: "0.75rem", "text-align": "left" }}>Date</th>
                        <th style={{ padding: "0.75rem", "text-align": "left" }}>Family</th>
                        <th style={{ padding: "0.75rem", "text-align": "left" }}>Children</th>
                        <th style={{ padding: "0.75rem", "text-align": "left" }}>Status</th>
                        <th style={{ padding: "0.75rem", "text-align": "right" }}>Estimated</th>
                        <th style={{ padding: "0.75rem", "text-align": "right" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={filteredUnpaid()}>
                        {(session) => (
                          <tr style={{ "border-bottom": "1px solid var(--color-border)" }}>
                            <td style={{ padding: "0.75rem" }}>
                              <a href={`/families/${session.familyId}/sessions/${session.id}`}>
                                {formatDate(session.scheduledStart)}
                              </a>
                              <div class="wa-body-s wa-color-text-quiet">{formatTime(session.scheduledStart)}</div>
                            </td>
                            <td style={{ padding: "0.75rem" }}>{session.family?.familyName || "N/A"}</td>
                            <td style={{ padding: "0.75rem" }}>
                              {session.children?.map((child) => child.firstName).join(", ") || "—"}
                            </td>
                            <td style={{ padding: "0.75rem" }}>
                              <SessionStatusBadge status={session.status} />
                            </td>
                            <td style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600" }}>
                              {formatMoneyDisplay(sessionAmount(session))}
                            </td>
                            <td style={{ padding: "0.75rem", "text-align": "right" }}>
                              <wa-button
                                size="small"
                                variant="success"
                                appearance="filled"
                                onClick={() => {
                                  list.setFamily(session.familyId);
                                  setShowRecordPayment(true);
                                }}
                              >
                                Record
                              </wa-button>
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </Show>
            </Show>
          </wa-card>
        }
      >
      <wa-card>
        <Show
          when={allPayments()}
          fallback={
            <div style={{ "text-align": "center", padding: "3rem", color: "var(--color-text-muted)" }}>
              Loading payments...
            </div>
          }
        >
          <Show
            when={filteredAndSortedPayments().length > 0}
            fallback={
              <EmptyState
                message={
                  (allPayments()?.length ?? 0) === 0
                    ? `No payments recorded for ${selectedYear()}.`
                    : "No payments match these filters."
                }
                actionLabel={(allPayments()?.length ?? 0) > 0 && list.hasFilters() ? "Clear filters" : undefined}
                onAction={() => list.clearFilters()}
              />
            }
          >
            <div style={{ overflow: "auto" }} class="table-responsive">
              <table style={{ width: "100%", "border-collapse": "collapse" }}>
                <thead style={{ "background-color": "var(--color-surface-muted)" }}>
                  <tr>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid var(--color-border)",
                        cursor: "pointer",
                        "user-select": "none",
                      }}
                      onClick={() => list.toggleSort("date")}
                    >
                      Date {sortMark("date")}
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid var(--color-border)",
                        cursor: "pointer",
                        "user-select": "none",
                      }}
                      onClick={() => list.toggleSort("family")}
                    >
                      Family {sortMark("family")}
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid var(--color-border)",
                      }}
                    >
                      Invoice #
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "right",
                        "border-bottom": "2px solid var(--color-border)",
                        cursor: "pointer",
                        "user-select": "none",
                      }}
                      onClick={() => list.toggleSort("amount")}
                    >
                      Amount {sortMark("amount")}
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid var(--color-border)",
                        cursor: "pointer",
                        "user-select": "none",
                      }}
                      onClick={() => list.toggleSort("method")}
                    >
                      Method {sortMark("method")}
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "2px solid var(--color-border)",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <For each={filteredAndSortedPayments()}>
                    {(payment) => {
                      return (
                        <tr
                          style={{
                            "border-bottom": "1px solid var(--color-border)",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--color-surface-muted)";
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
                          <td style={{ padding: "0.75rem", "font-size": "0.875rem", color: "var(--color-text-muted)" }}>
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
                <tfoot style={{ "background-color": "var(--color-surface-muted)", "border-top": "2px solid var(--color-border)" }}>
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
      </Show>

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
                  "background-color": "var(--color-surface-muted)",
                  "border-radius": "4px",
                  color: "var(--color-text-muted)",
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
                    color: "var(--color-text)",
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
                    border: "1px solid var(--color-border)",
                    "border-radius": "4px",
                  }}
                  class="table-responsive"
                >
                  <table style={{ width: "100%", "border-collapse": "collapse" }}>
                    <thead style={{ "background-color": "var(--color-surface-muted)", position: "sticky", top: 0 }}>
                      <tr>
                        <th
                          style={{
                            padding: "0.75rem",
                            "text-align": "left",
                            "border-bottom": "1px solid var(--color-border)",
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
                            "border-bottom": "1px solid var(--color-border)",
                          }}
                        >
                          Date & Time
                        </th>
                        <th
                          style={{
                            padding: "0.75rem",
                            "text-align": "left",
                            "border-bottom": "1px solid var(--color-border)",
                          }}
                        >
                          Children
                        </th>
                        <th
                          style={{
                            padding: "0.75rem",
                            "text-align": "right",
                            "border-bottom": "1px solid var(--color-border)",
                          }}
                        >
                          Duration
                        </th>
                        <th
                          style={{
                            padding: "0.75rem",
                            "text-align": "right",
                            "border-bottom": "1px solid var(--color-border)",
                          }}
                        >
                          Rate
                        </th>
                        <th
                          style={{
                            padding: "0.75rem",
                            "text-align": "right",
                            "border-bottom": "1px solid var(--color-border)",
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
                                "border-bottom": "1px solid var(--color-border)",
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
                                <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)" }}>
                                  {formatTime(session.scheduledStart)} - {formatTime(session.scheduledEnd)}
                                </div>
                                <div style={{ "font-size": "0.75rem", color: "var(--color-text-subtle)", "margin-top": "0.25rem" }}>
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
              "background-color": "var(--color-surface-muted)",
              "border-radius": "4px",
              "margin-bottom": "1rem",
            }}
          >
            <h3 style={{ color: "var(--color-text)", "font-size": "1rem", "margin-bottom": "0.5rem" }}>
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
                "background-color": "var(--color-surface)",
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
                  color: "var(--color-text)",
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
              "background-color": "var(--wa-color-danger-fill-quiet)",
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

