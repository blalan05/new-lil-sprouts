import { createAsync, type RouteDefinition, A, useSubmission } from "@solidjs/router";
import { Show, For, createSignal } from "solid-js";
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
  const deleteSubmission = useSubmission(deleteStandaloneExpense);

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

    // Filter by search term
    const term = searchTerm().toLowerCase();
    if (term) {
      filtered = filtered.filter(
        (exp) =>
          exp.description.toLowerCase().includes(term) ||
          exp.category?.toLowerCase().includes(term) ||
          exp.family?.familyName.toLowerCase().includes(term) ||
          exp.notes?.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let aVal: any;
      let bVal: any;

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
    if (confirm(`Are you sure you want to delete expense "${description}"?`)) {
      const formData = new FormData();
      formData.append("id", id);
      await deleteStandaloneExpense(formData);
    }
  };

  return (
    <div style={{ padding: "1.5rem", "max-width": "1400px", margin: "0 auto" }}>
      <header style={{ "margin-bottom": "0.75rem" }}>
        <div
          style={{
            display: "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "flex-wrap": "wrap",
            gap: "0.75rem",
          }}
          class="flex-row-mobile"
        >
          <div style={{ display: "flex", "align-items": "center", gap: "0.75rem", "flex-wrap": "wrap" }}>
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
            <h1 style={{ "font-size": "1.5rem", "font-weight": "700", color: "#2d3748", margin: 0 }}>
              Expenses
            </h1>
          </div>
          <button
            onClick={() => setShowNewExpense(true)}
            style={{
              "background-color": "#4299e1",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              "border-radius": "4px",
              cursor: "pointer",
              "font-weight": "600",
              "font-size": "0.875rem",
            }}
          >
            + Add Expense
          </button>
        </div>
      </header>

      {/* Filters */}
      <div
        style={{
          "background-color": "#fff",
          padding: "0.75rem",
          "border-radius": "8px",
          border: "1px solid #e2e8f0",
          "margin-bottom": "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            "grid-template-columns": "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                color: "#4a5568",
                "font-weight": "600",
              }}
            >
              Search
            </label>
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm()}
              onInput={(e) => setSearchTerm(e.currentTarget.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                "font-size": "1rem",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                color: "#4a5568",
                "font-weight": "600",
              }}
            >
              Filter by Family
            </label>
            <select
              value={selectedFamilyId()}
              onChange={(e) => setSelectedFamilyId(e.currentTarget.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                "font-size": "1rem",
              }}
            >
              <option value="">All Families</option>
              <For each={families()}>
                {(family) => <option value={family.id}>{family.familyName}</option>}
              </For>
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          "background-color": "#fff",
          padding: "0.75rem",
          "border-radius": "8px",
          border: "1px solid #e2e8f0",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ display: "flex", gap: "2rem", "flex-wrap": "wrap" }}>
          <div>
            <div style={{ color: "#718096", "font-size": "0.875rem" }}>Total Expenses</div>
            <div style={{ color: "#2d3748", "font-size": "1.5rem", "font-weight": "700" }}>
              {formatCurrency(totalExpenses())}
            </div>
          </div>
          <div>
            <div style={{ color: "#718096", "font-size": "0.875rem" }}>Number of Expenses</div>
            <div style={{ color: "#2d3748", "font-size": "1.5rem", "font-weight": "700" }}>
              {filteredExpenses().length}
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div
        style={{
          "background-color": "#fff",
          "border-radius": "8px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", "border-collapse": "collapse" }}>
          <thead>
            <tr style={{ "background-color": "#f7fafc", "border-bottom": "2px solid #e2e8f0" }}>
              <th
                style={{
                  padding: "0.75rem",
                  "text-align": "left",
                  "font-weight": "600",
                  color: "#2d3748",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("date")}
              >
                Date {sortField() === "date" && (sortDirection() === "asc" ? "↑" : "↓")}
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  "text-align": "left",
                  "font-weight": "600",
                  color: "#2d3748",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("description")}
              >
                Description {sortField() === "description" && (sortDirection() === "asc" ? "↑" : "↓")}
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  "text-align": "left",
                  "font-weight": "600",
                  color: "#2d3748",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("category")}
              >
                Category {sortField() === "category" && (sortDirection() === "asc" ? "↑" : "↓")}
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  "text-align": "left",
                  "font-weight": "600",
                  color: "#2d3748",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("family")}
              >
                Family {sortField() === "family" && (sortDirection() === "asc" ? "↑" : "↓")}
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  "text-align": "right",
                  "font-weight": "600",
                  color: "#2d3748",
                  cursor: "pointer",
                }}
                onClick={() => handleSort("amount")}
              >
                Amount {sortField() === "amount" && (sortDirection() === "asc" ? "↑" : "↓")}
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  "text-align": "center",
                  "font-weight": "600",
                  color: "#2d3748",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={filteredExpenses().length > 0}
              fallback={
                <tr>
                  <td colSpan={6} style={{ padding: "2rem", "text-align": "center", color: "#718096" }}>
                    No expenses found
                  </td>
                </tr>
              }
            >
              <For each={filteredExpenses()}>
                {(expense) => (
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
                    <td style={{ padding: "1rem" }}>{formatDate(expense.expenseDate)}</td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ "font-weight": "600", color: "#2d3748" }}>
                        {expense.description}
                      </div>
                      <Show when={expense.notes}>
                        <div style={{ color: "#718096", "font-size": "0.875rem", "margin-top": "0.25rem" }}>
                          {expense.notes}
                        </div>
                      </Show>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          "border-radius": "12px",
                          "font-size": "0.875rem",
                          "font-weight": "600",
                          "background-color": "#e6fffa",
                          color: "#234e52",
                        }}
                      >
                        {expense.category || "Uncategorized"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <Show
                        when={expense.family}
                        fallback={<span style={{ color: "#718096" }}>General</span>}
                      >
                        <A
                          href={`/families/${expense.family!.id}`}
                          style={{
                            color: "#4299e1",
                            "text-decoration": "none",
                          }}
                        >
                          {expense.family!.familyName}
                        </A>
                      </Show>
                    </td>
                    <td style={{ padding: "1rem", "text-align": "right", "font-weight": "600" }}>
                      {formatCurrency(expense.amount)}
                    </td>
                    <td style={{ padding: "1rem", "text-align": "center" }}>
                      <div style={{ display: "flex", gap: "0.5rem", "justify-content": "center" }}>
                        <button
                          onClick={() => setEditingExpense(expense.id)}
                          style={{
                            padding: "0.5rem",
                            border: "1px solid #cbd5e0",
                            "background-color": "#fff",
                            "border-radius": "4px",
                            cursor: "pointer",
                            color: "#4299e1",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id, expense.description)}
                          style={{
                            padding: "0.5rem",
                            border: "1px solid #cbd5e0",
                            "background-color": "#fff",
                            "border-radius": "4px",
                            cursor: "pointer",
                            color: "#e53e3e",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>

      {/* New Expense Modal */}
      <Show when={showNewExpense()}>
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
            zIndex: 1000,
            padding: "1.5rem",
          }}
          onClick={() => setShowNewExpense(false)}
        >
          <div
            style={{
              "background-color": "#fff",
              padding: "1.5rem",
              "border-radius": "8px",
              "max-width": "500px",
              width: "90%",
              "max-height": "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ "margin-top": 0, "margin-bottom": "1rem", "font-size": "1.25rem" }}>Add New Expense</h2>
            <form
              action={createStandaloneExpense}
              method="post"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await createStandaloneExpense(formData);
                setShowNewExpense(false);
              }}
            >
              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    color: "#4a5568",
                    "font-weight": "600",
                  }}
                >
                  Description *
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                  }}
                />
              </div>
              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    color: "#4a5568",
                    "font-weight": "600",
                  }}
                >
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  min="0"
                  required
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                  }}
                />
              </div>
              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    color: "#4a5568",
                    "font-weight": "600",
                  }}
                >
                  Category
                </label>
                <select
                  name="category"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                  }}
                >
                  <option value="">Select a category</option>
                  <For each={EXPENSE_CATEGORIES}>
                    {(cat) => <option value={cat}>{cat}</option>}
                  </For>
                </select>
              </div>
              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    color: "#4a5568",
                    "font-weight": "600",
                  }}
                >
                  Expense Date
                </label>
                <input
                  type="date"
                  name="expenseDate"
                  value={new Date().toISOString().split("T")[0]}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                  }}
                />
              </div>
              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    color: "#4a5568",
                    "font-weight": "600",
                  }}
                >
                  Family (Optional)
                </label>
                <select
                  name="familyId"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                  }}
                >
                  <option value="">General (No specific family)</option>
                  <For each={families()}>
                    {(family) => <option value={family.id}>{family.familyName}</option>}
                  </For>
                </select>
              </div>
              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    color: "#4a5568",
                    "font-weight": "600",
                  }}
                >
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "1rem", "justify-content": "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowNewExpense(false)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "1px solid #cbd5e0",
                    "background-color": "#fff",
                    "border-radius": "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "none",
                    "background-color": "#4299e1",
                    color: "white",
                    "border-radius": "6px",
                    cursor: "pointer",
                    "font-weight": "600",
                  }}
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      </Show>

      {/* Edit Expense Modal */}
      <Show when={editingExpense()}>
        {() => {
          const expense = expenses()?.find((e) => e.id === editingExpense());
          if (!expense) return null;

          return (
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
                zIndex: 1000,
                padding: "1.5rem",
              }}
              onClick={() => setEditingExpense(null)}
            >
              <div
                style={{
                  "background-color": "#fff",
                  padding: "1.5rem",
                  "border-radius": "8px",
                  "max-width": "500px",
                  width: "90%",
                  "max-height": "90vh",
                  overflow: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ "margin-top": 0, "margin-bottom": "1rem", "font-size": "1.25rem" }}>Edit Expense</h2>
                <form
                  action={updateStandaloneExpense}
                  method="post"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    await updateStandaloneExpense(formData);
                    setEditingExpense(null);
                  }}
                >
                  <input type="hidden" name="id" value={expense.id} />
                  <div style={{ "margin-bottom": "1rem" }}>
                    <label
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        color: "#4a5568",
                        "font-weight": "600",
                      }}
                    >
                      Description *
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={expense.description}
                      required
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                      }}
                    />
                  </div>
                  <div style={{ "margin-bottom": "1rem" }}>
                    <label
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        color: "#4a5568",
                        "font-weight": "600",
                      }}
                    >
                      Amount *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      min="0"
                      value={expense.amount}
                      required
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                      }}
                    />
                  </div>
                  <div style={{ "margin-bottom": "1rem" }}>
                    <label
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        color: "#4a5568",
                        "font-weight": "600",
                      }}
                    >
                      Category
                    </label>
                    <select
                      name="category"
                      value={expense.category || ""}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                      }}
                    >
                      <option value="">Select a category</option>
                      <For each={EXPENSE_CATEGORIES}>
                        {(cat) => <option value={cat}>{cat}</option>}
                      </For>
                    </select>
                  </div>
                  <div style={{ "margin-bottom": "1rem" }}>
                    <label
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        color: "#4a5568",
                        "font-weight": "600",
                      }}
                    >
                      Expense Date
                    </label>
                    <input
                      type="date"
                      name="expenseDate"
                      value={new Date(expense.expenseDate).toISOString().split("T")[0]}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                      }}
                    />
                  </div>
                  <div style={{ "margin-bottom": "1rem" }}>
                    <label
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        color: "#4a5568",
                        "font-weight": "600",
                      }}
                    >
                      Family (Optional)
                    </label>
                    <select
                      name="familyId"
                      value={expense.familyId || ""}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                      }}
                    >
                      <option value="">General (No specific family)</option>
                      <For each={families()}>
                        {(family) => <option value={family.id}>{family.familyName}</option>}
                      </For>
                    </select>
                  </div>
                  <div style={{ "margin-bottom": "1rem" }}>
                    <label
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        color: "#4a5568",
                        "font-weight": "600",
                      }}
                    >
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      value={expense.notes || ""}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "1rem", "justify-content": "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => setEditingExpense(null)}
                      style={{
                        padding: "0.75rem 1.5rem",
                        border: "1px solid #cbd5e0",
                        "background-color": "#fff",
                        "border-radius": "6px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: "0.75rem 1.5rem",
                        border: "none",
                        "background-color": "#4299e1",
                        color: "white",
                        "border-radius": "6px",
                        cursor: "pointer",
                        "font-weight": "600",
                      }}
                    >
                      Update Expense
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        }}
      </Show>
    </div>
  );
}

