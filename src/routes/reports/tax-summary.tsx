import { ensureOwner } from "~/lib/route-guards";
import { createAsync, type RouteDefinition, A } from "@solidjs/router";
import { createSignal, Show, For } from "solid-js";
import { getUser } from "~/lib";
import { getAnnualTaxSummary, getAllFamiliesForReports } from "~/lib/reports";

export const route = {
  preload() {
    ensureOwner();
    getUser();
    getAllFamiliesForReports();
  },
} satisfies RouteDefinition;

function formatCurrency(amount: number | string) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function TaxSummaryReport() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = createSignal(currentYear);
  const [selectedFamilyId, setSelectedFamilyId] = createSignal<string>("");

  const families = createAsync(() => getAllFamiliesForReports());

  const summary = createAsync(() => {
    const year = selectedYear();
    const familyId = selectedFamilyId();
    return getAnnualTaxSummary(year, familyId || undefined);
  });

  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <main class="page">
      <header style={{ "margin-bottom": "1.5rem" }}>
        <p style={{ margin: 0 }}>
          <A href="/reports">← Back to reports</A>
        </p>
        <h1 class="page-title" style={{ margin: "0.5rem 0 0" }}>
          Annual tax summary
        </h1>
        <p class="text-muted" style={{ margin: "0.5rem 0 0" }}>
          Cash-basis gross income, expenses by category, and net income for tax planning.
        </p>
      </header>

      <div
        class="card"
        style={{
          padding: "1.25rem",
          "margin-bottom": "1.5rem",
          display: "flex",
          "flex-wrap": "wrap",
          gap: "1rem",
          "align-items": "flex-end",
        }}
      >
        <div>
          <label for="tax-year" class="text-muted" style={{ display: "block", "margin-bottom": "0.25rem" }}>
            Tax year
          </label>
          <select
            id="tax-year"
            class="input-field"
            value={selectedYear()}
            onChange={(e) => setSelectedYear(parseInt(e.currentTarget.value, 10))}
          >
            <For each={years}>{(year) => <option value={year}>{year}</option>}</For>
          </select>
        </div>
        <div style={{ "min-width": "200px", flex: "1" }}>
          <label for="tax-family" class="text-muted" style={{ display: "block", "margin-bottom": "0.25rem" }}>
            Family (optional)
          </label>
          <select
            id="tax-family"
            class="input-field"
            value={selectedFamilyId()}
            onChange={(e) => setSelectedFamilyId(e.currentTarget.value)}
          >
            <option value="">All families</option>
            <For each={families()}>{(family) => <option value={family.id}>{family.familyName}</option>}</For>
          </select>
        </div>
      </div>

      <Show when={summary()} fallback={<p class="empty-state">Loading tax summary…</p>}>
        {(data) => (
          <>
            <div
              style={{
                display: "grid",
                "grid-template-columns": "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1rem",
                "margin-bottom": "1.5rem",
              }}
            >
              <div class="stat-card stat-card--success">
                <div class="text-muted stat-label">Gross income</div>
                <div class="stat-value">{formatCurrency(data().grossIncome)}</div>
              </div>
              <div class="stat-card stat-card--danger">
                <div class="text-muted stat-label">Total expenses</div>
                <div class="stat-value">{formatCurrency(data().totalExpenses)}</div>
              </div>
              <div class="stat-card">
                <div class="text-muted stat-label">Net income</div>
                <div class="stat-value">{formatCurrency(data().netIncome)}</div>
              </div>
              <div class="stat-card">
                <div class="text-muted stat-label">Payments</div>
                <div class="stat-value">{data().paymentCount}</div>
              </div>
            </div>

            <section class="card" style={{ padding: "1.25rem" }}>
              <h2 style={{ margin: "0 0 1rem", "font-size": "1.125rem" }}>Expenses by category</h2>
              <Show
                when={data().byCategory.length}
                fallback={<p class="empty-state">No expenses recorded for this period.</p>}
              >
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th style={{ "text-align": "right" }}>Amount</th>
                      <th style={{ "text-align": "right" }}>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={data().byCategory}>
                      {(row) => (
                        <tr>
                          <td>{row.category}</td>
                          <td style={{ "text-align": "right" }}>{formatCurrency(row.amount)}</td>
                          <td style={{ "text-align": "right" }}>{row.count}</td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </Show>
            </section>
          </>
        )}
      </Show>
    </main>
  );
}
