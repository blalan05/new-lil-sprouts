
import { useSubmission } from "~/lib/use-submission";
import { Show, For, createSignal, createMemo } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import EmptyState from "~/components/EmptyState";
import ListToolbar from "~/components/ListToolbar";
import { useConfirm } from "~/components/wa/ConfirmProvider";
import { getFamilies } from "~/lib/families";
import {
  getExpenses,
  createStandaloneExpense,
  updateStandaloneExpense,
  deleteStandaloneExpense,
} from "~/lib/expenses";
import { formatDateLocal } from "~/lib/datetime";
import {
  EXPENSE_CATEGORY_OPTIONS,
  compareSort,
  inDateRange,
  matchesQuery,
  moneyNumber,
  optionLabel,
} from "~/lib/list-query";
import { useListQuery } from "~/lib/use-list-query";

export const route = {
  preload() {
    getFamilies();
    getExpenses();
  },
};

type SortField = "date" | "description" | "amount" | "category" | "family";

export default function ExpensesPage() {
  const { confirm } = useConfirm();
  const list = useListQuery({ sort: "date", dir: "desc" });
  const families = createMemo(() => getFamilies());
  const expenses = createMemo(() => getExpenses());
  const [showNewExpense, setShowNewExpense] = createSignal(false);
  const [editingExpense, setEditingExpense] = createSignal<string | null>(null);

  const createSubmission = useSubmission(createStandaloneExpense);
  const updateSubmission = useSubmission(updateStandaloneExpense);

  const formatDate = formatDateLocal;

  const formatCurrency = (amount: number | string | null | undefined) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(String(amount ?? 0).replace(/[$,\s]/g, "")) || 0);
  };

  const filteredExpenses = () => {
    const expensesList = expenses();
    if (!expensesList) return [];

    let filtered = expensesList.filter((expense) => {
      if (list.family() && expense.familyId !== list.family()) return false;
      if (list.category() && expense.category !== list.category()) return false;
      if (!inDateRange(expense.expenseDate, list.from(), list.to())) return false;
      return matchesQuery(list.q(), [
        expense.description,
        expense.category,
        expense.category ? optionLabel(EXPENSE_CATEGORY_OPTIONS, expense.category) : "",
        expense.family?.familyName,
        expense.notes,
      ]);
    });

    const field = (["date", "description", "amount", "category", "family"].includes(list.sort())
      ? list.sort()
      : "date") as SortField;
    const dir = list.dir();
    filtered = [...filtered].sort((a, b) => {
      switch (field) {
        case "description":
          return compareSort(a.description.toLowerCase(), b.description.toLowerCase(), dir);
        case "amount":
          return compareSort(moneyNumber(a.amount), moneyNumber(b.amount), dir);
        case "category":
          return compareSort(
            optionLabel(EXPENSE_CATEGORY_OPTIONS, a.category).toLowerCase(),
            optionLabel(EXPENSE_CATEGORY_OPTIONS, b.category).toLowerCase(),
            dir,
          );
        case "family":
          return compareSort(
            (a.family?.familyName || "").toLowerCase(),
            (b.family?.familyName || "").toLowerCase(),
            dir,
          );
        default:
          return compareSort(new Date(a.expenseDate).getTime(), new Date(b.expenseDate).getTime(), dir);
      }
    });

    return filtered;
  };

  const sortMark = (field: SortField) => {
    if (list.sort() !== field) return "";
    return list.dir() === "asc" ? " (asc)" : " (desc)";
  };

  const totalExpenses = () => {
    return filteredExpenses().reduce((sum, exp) => sum + moneyNumber(exp.amount), 0);
  };

  const handleDelete = async (id: string, description: string) => {
    const ok = await confirm({
      title: "Delete Expense",
      message: `Are you sure you want to delete expense "${description}"?`,
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (ok) {
      const formData = new FormData();
      formData.append("id", id);
      await deleteStandaloneExpense(formData);
    }
  };

  return (
    <PageContent>
      <PageHeader
        title="Expenses"
        description="Standalone business expenses. Costs logged during a care session stay on that session."
        actions={
          <wa-button variant="brand" appearance="filled" onClick={() => setShowNewExpense(true)}>
            + Add Expense
          </wa-button>
        }
      />

      <ListToolbar
        query={list}
        searchPlaceholder="Search description, category, family, or notes"
        families={families() ?? []}
        chipGroups={[{ param: "category", label: "Category", options: EXPENSE_CATEGORY_OPTIONS }]}
        sortOptions={[
          { value: "date", label: "Date" },
          { value: "description", label: "Description" },
          { value: "category", label: "Category" },
          { value: "family", label: "Family" },
          { value: "amount", label: "Amount" },
        ]}
        dateRange
        total={expenses()?.length ?? 0}
        visible={filteredExpenses().length}
      />

      <wa-card>
        <div class="wa-cluster wa-gap-xl">
          <div class="wa-stack wa-gap-xs">
            <div class="wa-body-s wa-color-text-quiet">Total Expenses</div>
            <div class="wa-heading-xl">{formatCurrency(totalExpenses())}</div>
          </div>
          <div class="wa-stack wa-gap-xs">
            <div class="wa-body-s wa-color-text-quiet">Number of Expenses</div>
            <div class="wa-heading-xl">{filteredExpenses().length}</div>
          </div>
        </div>
      </wa-card>

      <wa-card style={{ overflow: "hidden", padding: 0 }}>
        <div style={{ overflow: "auto" }} class="table-responsive">
          <table style={{ width: "100%", "border-collapse": "collapse" }}>
            <thead>
              <tr style={{ "background-color": "var(--wa-color-neutral-95)", "border-bottom": "2px solid var(--wa-color-neutral-90)" }}>
                <th
                  style={{ padding: "0.75rem", "text-align": "left", cursor: "pointer" }}
                  onClick={() => list.toggleSort("date")}
                >
                  Date {sortMark("date")}
                </th>
                <th
                  style={{ padding: "0.75rem", "text-align": "left", cursor: "pointer" }}
                  onClick={() => list.toggleSort("description")}
                >
                  Description {sortMark("description")}
                </th>
                <th
                  style={{ padding: "0.75rem", "text-align": "left", cursor: "pointer" }}
                  onClick={() => list.toggleSort("category")}
                >
                  Category {sortMark("category")}
                </th>
                <th
                  style={{ padding: "0.75rem", "text-align": "left", cursor: "pointer" }}
                  onClick={() => list.toggleSort("family")}
                >
                  Family {sortMark("family")}
                </th>
                <th
                  style={{ padding: "0.75rem", "text-align": "right", cursor: "pointer" }}
                  onClick={() => list.toggleSort("amount")}
                >
                  Amount {sortMark("amount")}
                </th>
                <th style={{ padding: "0.75rem", "text-align": "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <Show
                when={filteredExpenses().length > 0}
                fallback={
                  <tr>
                    <td colSpan={6} style={{ padding: 0 }}>
                      <EmptyState
                        message={
                          (expenses()?.length ?? 0) === 0
                            ? "No standalone expenses yet."
                            : "No expenses match these filters."
                        }
                        actionLabel={(expenses()?.length ?? 0) > 0 && list.hasFilters() ? "Clear filters" : undefined}
                        onAction={() => list.clearFilters()}
                      />
                    </td>
                  </tr>
                }
              >
                <For each={filteredExpenses()}>
                  {(expense) => (
                    <tr style={{ "border-bottom": "1px solid var(--wa-color-neutral-90)" }}>
                      <td style={{ padding: "1rem" }}>{formatDate(expense.expenseDate)}</td>
                      <td style={{ padding: "1rem" }}>
                        <div class="wa-heading-s">{expense.description}</div>
                        <Show when={expense.notes}>
                          <div class="wa-body-s wa-color-text-quiet" style={{ "margin-top": "0.25rem" }}>
                            {expense.notes}
                          </div>
                        </Show>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <wa-badge variant="success" appearance="filled-outlined" pill>
                          {optionLabel(EXPENSE_CATEGORY_OPTIONS, expense.category) || "Uncategorized"}
                        </wa-badge>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <Show when={expense.family} fallback={<span class="wa-color-text-quiet">General</span>}>
                          <a href={`/families/${expense.family!.id}`}>{expense.family!.familyName}</a>
                        </Show>
                      </td>
                      <td style={{ padding: "1rem", "text-align": "right", "font-weight": "600" }}>
                        {formatCurrency(expense.amount)}
                      </td>
                      <td style={{ padding: "1rem", "text-align": "center" }}>
                        <div class="wa-cluster wa-gap-s" style={{ "justify-content": "center" }}>
                          <wa-button
                            appearance="outlined"
                            size="small"
                            onClick={() => setEditingExpense(expense.id)}
                          >
                            Edit
                          </wa-button>
                          <wa-button
                            variant="danger"
                            appearance="outlined"
                            size="small"
                            onClick={() => handleDelete(expense.id, expense.description)}
                          >
                            Delete
                          </wa-button>
                        </div>
                      </td>
                    </tr>
                  )}
                </For>
              </Show>
            </tbody>
          </table>
        </div>
      </wa-card>

      <Show when={showNewExpense()}>
        <div
          style={{
            position: "fixed",
            inset: 0,
            "background-color": "rgba(0, 0, 0, 0.5)",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "z-index": 1000,
            padding: "1.5rem",
          }}
          onClick={() => setShowNewExpense(false)}
        >
          <wa-card
            style={{ "max-width": "500px", width: "90%", "max-height": "90vh", overflow: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 class="wa-heading-l" style={{ "margin-bottom": "var(--wa-space-m)" }}>
              Add New Expense
            </h2>
            <form
              action={createStandaloneExpense}
              method="post"
              class="wa-stack wa-gap-m"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await createStandaloneExpense(formData);
                setShowNewExpense(false);
              }}
            >
              <wa-input label="Description *" name="description" required />
              <wa-input label="Amount *" name="amount" type="number" step="0.01" min="0" required />
              <wa-select label="Category" name="category">
                <wa-option value="">Select a category</wa-option>
                <For each={EXPENSE_CATEGORY_OPTIONS}>
                  {(cat) => <wa-option value={cat.value}>{cat.label}</wa-option>}
                </For>
              </wa-select>
              <wa-input
                label="Expense Date"
                name="expenseDate"
                type="date"
                value={new Date().toISOString().split("T")[0]}
              />
              <wa-select label="Family (Optional)" name="familyId">
                <wa-option value="">General (No specific family)</wa-option>
                <For each={families()}>
                  {(family) => <wa-option value={family.id}>{family.familyName}</wa-option>}
                </For>
              </wa-select>
              <wa-textarea label="Notes" name="notes" rows={3} />
              <div class="wa-cluster wa-gap-s" style={{ "justify-content": "flex-end" }}>
                <wa-button type="button" appearance="outlined" onClick={() => setShowNewExpense(false)}>
                  Cancel
                </wa-button>
                <wa-button type="submit" variant="brand" appearance="filled" disabled={createSubmission.pending || undefined}>
                  Add Expense
                </wa-button>
              </div>
            </form>
          </wa-card>
        </div>
      </Show>

      <Show when={editingExpense()}>
        {() => {
          const expense = expenses()?.find((e) => e.id === editingExpense());
          if (!expense) return null;

          return (
            <div
              style={{
                position: "fixed",
                inset: 0,
                "background-color": "rgba(0, 0, 0, 0.5)",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
                "z-index": 1000,
                padding: "1.5rem",
              }}
              onClick={() => setEditingExpense(null)}
            >
              <wa-card
                style={{ "max-width": "500px", width: "90%", "max-height": "90vh", overflow: "auto" }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 class="wa-heading-l" style={{ "margin-bottom": "var(--wa-space-m)" }}>
                  Edit Expense
                </h2>
                <form
                  action={updateStandaloneExpense}
                  method="post"
                  class="wa-stack wa-gap-m"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    await updateStandaloneExpense(formData);
                    setEditingExpense(null);
                  }}
                >
                  <input type="hidden" name="id" value={expense.id} />
                  <wa-input label="Description *" name="description" value={expense.description} required />
                  <wa-input
                    label="Amount *"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={String(expense.amount)}
                    required
                  />
                  <wa-select label="Category" name="category" value={expense.category || ""}>
                    <wa-option value="">Select a category</wa-option>
                    <For each={EXPENSE_CATEGORY_OPTIONS}>
                      {(cat) => <wa-option value={cat.value}>{cat.label}</wa-option>}
                    </For>
                  </wa-select>
                  <wa-input
                    label="Expense Date"
                    name="expenseDate"
                    type="date"
                    value={new Date(expense.expenseDate).toISOString().split("T")[0]}
                  />
                  <wa-select label="Family (Optional)" name="familyId" value={expense.familyId || ""}>
                    <wa-option value="">General (No specific family)</wa-option>
                    <For each={families()}>
                      {(family) => <wa-option value={family.id}>{family.familyName}</wa-option>}
                    </For>
                  </wa-select>
                  <wa-textarea label="Notes" name="notes" rows={3} value={expense.notes || ""} />
                  <div class="wa-cluster wa-gap-s" style={{ "justify-content": "flex-end" }}>
                    <wa-button type="button" appearance="outlined" onClick={() => setEditingExpense(null)}>
                      Cancel
                    </wa-button>
                    <wa-button type="submit" variant="brand" appearance="filled" disabled={updateSubmission.pending || undefined}>
                      Update Expense
                    </wa-button>
                  </div>
                </form>
              </wa-card>
            </div>
          );
        }}
      </Show>
    </PageContent>
  );
}
