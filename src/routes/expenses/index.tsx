import { createAsync, type RouteDefinition, A, useSubmission } from "@solidjs/router";
import { Show, For, createSignal } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { useConfirm } from "~/components/wa/ConfirmProvider";
import { getFamilies } from "~/lib/families";
import {
  getExpenses,
  createStandaloneExpense,
  updateStandaloneExpense,
  deleteStandaloneExpense,
} from "~/lib/expenses";
import { formatDateLocal } from "~/lib/datetime";

export const route = {
  preload() {
    getFamilies();
    getExpenses();
  },
} satisfies RouteDefinition;

type SortField = "date" | "description" | "amount" | "category" | "family";
type SortDirection = "asc" | "desc";

const EXPENSE_CATEGORIES = [
  "FOOD",
  "ACTIVITY",
  "SUPPLIES",
  "TRANSPORTATION",
  "BUSINESS",
  "OTHER",
] as const;

export default function ExpensesPage() {
  const { confirm } = useConfirm();
  const families = createAsync(() => getFamilies());
  const [selectedFamilyId, setSelectedFamilyId] = createSignal<string>("");
  const expenses = createAsync(() => {
    const familyId = selectedFamilyId();
    return getExpenses(familyId || undefined);
  });
  const [searchTerm, setSearchTerm] = createSignal<string>("");
  const [sortField, setSortField] = createSignal<SortField>("date");
  const [sortDirection, setSortDirection] = createSignal<SortDirection>("desc");
  const [showNewExpense, setShowNewExpense] = createSignal(false);
  const [editingExpense, setEditingExpense] = createSignal<string | null>(null);

  const createSubmission = useSubmission(createStandaloneExpense);
  const updateSubmission = useSubmission(updateStandaloneExpense);

  const formatDate = formatDateLocal;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const filteredExpenses = () => {
    const expensesList = expenses();
    if (!expensesList) return [];

    let filtered = expensesList;

    const term = searchTerm().toLowerCase();
    if (term) {
      filtered = filtered.filter(
        (exp) =>
          exp.description.toLowerCase().includes(term) ||
          exp.category?.toLowerCase().includes(term) ||
          exp.family?.familyName.toLowerCase().includes(term) ||
          exp.notes?.toLowerCase().includes(term),
      );
    }

    filtered = [...filtered].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortField()) {
        case "date":
          aVal = new Date(a.expenseDate).getTime();
          bVal = new Date(b.expenseDate).getTime();
          break;
        case "description":
          aVal = a.description.toLowerCase();
          bVal = b.description.toLowerCase();
          break;
        case "amount":
          aVal = a.amount;
          bVal = b.amount;
          break;
        case "category":
          aVal = a.category || "";
          bVal = b.category || "";
          break;
        case "family":
          aVal = a.family?.familyName || "";
          bVal = b.family?.familyName || "";
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection() === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection() === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const totalExpenses = () => {
    return filteredExpenses().reduce((sum, exp) => sum + exp.amount, 0);
  };

  const handleSort = (field: SortField) => {
    if (sortField() === field) {
      setSortDirection(sortDirection() === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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
        actions={
          <wa-button variant="brand" appearance="filled" onClick={() => setShowNewExpense(true)}>
            + Add Expense
          </wa-button>
        }
      />

      <wa-card>
        <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
          <wa-input
            label="Search"
            type="search"
            placeholder="Search expenses..."
            value={searchTerm()}
            onInput={(e) => setSearchTerm((e.currentTarget as HTMLInputElement & { value: string }).value)}
          />
          <wa-select
            label="Filter by Family"
            value={selectedFamilyId()}
            onChange={(e) =>
              setSelectedFamilyId((e.currentTarget as HTMLSelectElement & { value: string }).value)
            }
          >
            <wa-option value="">All Families</wa-option>
            <For each={families()}>
              {(family) => <wa-option value={family.id}>{family.familyName}</wa-option>}
            </For>
          </wa-select>
        </div>
      </wa-card>

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
                  onClick={() => handleSort("date")}
                >
                  Date {sortField() === "date" && (sortDirection() === "asc" ? "↑" : "↓")}
                </th>
                <th
                  style={{ padding: "0.75rem", "text-align": "left", cursor: "pointer" }}
                  onClick={() => handleSort("description")}
                >
                  Description {sortField() === "description" && (sortDirection() === "asc" ? "↑" : "↓")}
                </th>
                <th
                  style={{ padding: "0.75rem", "text-align": "left", cursor: "pointer" }}
                  onClick={() => handleSort("category")}
                >
                  Category {sortField() === "category" && (sortDirection() === "asc" ? "↑" : "↓")}
                </th>
                <th
                  style={{ padding: "0.75rem", "text-align": "left", cursor: "pointer" }}
                  onClick={() => handleSort("family")}
                >
                  Family {sortField() === "family" && (sortDirection() === "asc" ? "↑" : "↓")}
                </th>
                <th
                  style={{ padding: "0.75rem", "text-align": "right", cursor: "pointer" }}
                  onClick={() => handleSort("amount")}
                >
                  Amount {sortField() === "amount" && (sortDirection() === "asc" ? "↑" : "↓")}
                </th>
                <th style={{ padding: "0.75rem", "text-align": "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <Show
                when={filteredExpenses().length > 0}
                fallback={
                  <tr>
                    <td colSpan={6} style={{ padding: "2rem", "text-align": "center" }} class="wa-color-text-quiet">
                      No expenses found
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
                          {expense.category || "Uncategorized"}
                        </wa-badge>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <Show when={expense.family} fallback={<span class="wa-color-text-quiet">General</span>}>
                          <A href={`/families/${expense.family!.id}`}>{expense.family!.familyName}</A>
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
                <For each={EXPENSE_CATEGORIES}>
                  {(cat) => <wa-option value={cat}>{cat}</wa-option>}
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
                    <For each={EXPENSE_CATEGORIES}>
                      {(cat) => <wa-option value={cat}>{cat}</wa-option>}
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
