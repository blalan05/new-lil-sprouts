import { createAsync, type RouteDefinition, A } from "@solidjs/router";
import { createSignal, Show, For } from "solid-js";
import { getUser } from "~/lib";
import { getIncomeReport, type IncomeReport } from "~/lib/reports";

export const route = {
  preload() {
    getUser();
  },
} satisfies RouteDefinition;

export default function IncomeReport() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = createSignal<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = createSignal<number | null>(null);
  const [viewMode, setViewMode] = createSignal<"year" | "month">("year");

  const incomeReport = createAsync(() => {
    const year = selectedYear();
    const month = viewMode() === "month" ? (selectedMonth() || currentMonth) : null;
    return getIncomeReport(year, month || undefined);
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  const printReport = (report: IncomeReport) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Income Report - ${report.period}</title>
          <style>
            @media print {
              @page {
                margin: 1in;
              }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 2rem;
              max-width: 1000px;
              margin: 0 auto;
              color: #2d3748;
            }
            h1 {
              color: #2d3748;
              border-bottom: 3px solid #2d3748;
              padding-bottom: 0.5rem;
              margin-bottom: 1.5rem;
            }
            h2 {
              color: #4a5568;
              margin-top: 2rem;
              margin-bottom: 1rem;
              font-size: 1.25rem;
            }
            .summary {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 1rem;
              margin: 2rem 0;
              padding: 1.5rem;
              background-color: #f7fafc;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .summary-item {
              text-align: center;
            }
            .summary-label {
              font-size: 0.875rem;
              color: #718096;
              margin-bottom: 0.5rem;
            }
            .summary-value {
              font-size: 1.5rem;
              font-weight: 700;
              color: #2d3748;
            }
            .summary-value.gross {
              color: #38a169;
            }
            .summary-value.expenses {
              color: #e53e3e;
            }
            .summary-value.net {
              color: #2d3748;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 1rem 0;
              font-size: 0.875rem;
            }
            th {
              background-color: #2d3748;
              color: white;
              padding: 0.75rem;
              text-align: left;
              font-weight: 600;
            }
            td {
              padding: 0.75rem;
              border-bottom: 1px solid #e2e8f0;
            }
            tr:nth-child(even) {
              background-color: #f7fafc;
            }
            .text-right {
              text-align: right;
            }
            .footer {
              margin-top: 3rem;
              font-size: 0.875rem;
              color: #718096;
              text-align: center;
              border-top: 1px solid #e2e8f0;
              padding-top: 1rem;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1>Income Report - ${report.period}</h1>
          
          <div class="summary">
            <div class="summary-item">
              <div class="summary-label">Gross Income</div>
              <div class="summary-value gross">${formatCurrency(report.grossIncome)}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Expenses</div>
              <div class="summary-value expenses">${formatCurrency(report.totalExpenses)}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Net Income</div>
              <div class="summary-value net">${formatCurrency(report.netIncome)}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Payments</div>
              <div class="summary-value">${report.paymentCount}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Expense Items</div>
              <div class="summary-value">${report.expenseCount}</div>
            </div>
          </div>

          <h2>Income by Family</h2>
          <table>
            <thead>
              <tr>
                <th>Family</th>
                <th class="text-right">Payments</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${report.byFamily.map(family => `
                <tr>
                  <td>${family.familyName}</td>
                  <td class="text-right">${family.paymentCount}</td>
                  <td class="text-right">${formatCurrency(family.amount)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <h2>Income by Month</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th class="text-right">Gross Income</th>
                <th class="text-right">Expenses</th>
                <th class="text-right">Net Income</th>
              </tr>
            </thead>
            <tbody>
              ${report.byMonth.map(month => `
                <tr>
                  <td>${formatMonth(month.month)}</td>
                  <td class="text-right">${formatCurrency(month.grossIncome)}</td>
                  <td class="text-right">${formatCurrency(month.expenses)}</td>
                  <td class="text-right">${formatCurrency(month.netIncome)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const exportToCSV = (report: IncomeReport) => {
    const csvRows: string[] = [];
    
    csvRows.push(`Income Report - ${report.period}`);
    csvRows.push("");
    csvRows.push("Summary");
    csvRows.push(`Gross Income,${formatCurrency(report.grossIncome)}`);
    csvRows.push(`Total Expenses,${formatCurrency(report.totalExpenses)}`);
    csvRows.push(`Net Income,${formatCurrency(report.netIncome)}`);
    csvRows.push(`Payment Count,${report.paymentCount}`);
    csvRows.push(`Expense Count,${report.expenseCount}`);
    csvRows.push("");
    
    csvRows.push("Income by Family");
    csvRows.push("Family,Payments,Amount");
    report.byFamily.forEach(family => {
      csvRows.push(`${family.familyName},${family.paymentCount},${formatCurrency(family.amount)}`);
    });
    csvRows.push("");
    
    csvRows.push("Income by Month");
    csvRows.push("Month,Gross Income,Expenses,Net Income");
    report.byMonth.forEach(month => {
      csvRows.push(`${formatMonth(month.month)},${formatCurrency(month.grossIncome)},${formatCurrency(month.expenses)},${formatCurrency(month.netIncome)}`);
    });
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Income_Report_${report.period}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main
      style={{
        "max-width": "1600px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <div style={{ "margin-bottom": "2rem" }}>
        <A
          href="/reports"
          style={{
            display: "inline-flex",
            "align-items": "center",
            gap: "0.5rem",
            color: "#4299e1",
            "text-decoration": "none",
            "margin-bottom": "1rem",
            "font-weight": "600",
          }}
        >
          ← Back to Reports
        </A>
        <h1 style={{ "font-size": "2rem", "font-weight": "700", color: "#2d3748", "margin-bottom": "0.5rem" }}>
          Income Report (Gross & Net)
        </h1>
        <p style={{ color: "#718096", "font-size": "1rem" }}>
          View gross income, expenses, and net income for your business.
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          "background-color": "#fff",
          padding: "1.5rem",
          "border-radius": "8px",
          border: "1px solid #e2e8f0",
          "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
          "margin-bottom": "2rem",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", "flex-wrap": "wrap", "align-items": "end" }}>
          <div style={{ "flex": "1", "min-width": "200px" }}>
            <label
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "600",
                color: "#2d3748",
              }}
            >
              View Period
            </label>
            <select
              value={viewMode()}
              onChange={(e) => {
                setViewMode(e.currentTarget.value as "year" | "month");
                if (e.currentTarget.value === "year") {
                  setSelectedMonth(null);
                }
              }}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                "font-size": "1rem",
              }}
            >
              <option value="year">Year</option>
              <option value="month">Month</option>
            </select>
          </div>

          <div style={{ "flex": "1", "min-width": "200px" }}>
            <label
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "600",
                color: "#2d3748",
              }}
            >
              Year
            </label>
            <select
              value={selectedYear()}
              onChange={(e) => setSelectedYear(parseInt(e.currentTarget.value))}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                "font-size": "1rem",
              }}
            >
              {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
                <option value={year}>{year}</option>
              ))}
            </select>
          </div>

          <Show when={viewMode() === "month"}>
            <div style={{ "flex": "1", "min-width": "200px" }}>
              <label
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "600",
                  color: "#2d3748",
                }}
              >
                Month
              </label>
              <select
                value={selectedMonth() || currentMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.currentTarget.value))}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "1rem",
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option value={month}>
                    {new Date(selectedYear(), month - 1, 1).toLocaleDateString("en-US", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>
          </Show>
        </div>
      </div>

      {/* Report Display */}
      <Show when={incomeReport()}>
        {(report) => (
          <div
            style={{
              "background-color": "#fff",
              padding: "2rem",
              "border-radius": "8px",
              border: "1px solid #e2e8f0",
              "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "2rem", "flex-wrap": "wrap", gap: "1rem" }}>
              <h2 style={{ "font-size": "1.5rem", "font-weight": "700", color: "#2d3748" }}>
                Income Report - {report().period}
              </h2>
              <div style={{ display: "flex", gap: "0.5rem", "flex-wrap": "wrap" }}>
                <button
                  onClick={() => printReport(report())}
                  style={{
                    padding: "0.75rem 1.5rem",
                    "background-color": "#2d3748",
                    color: "#fff",
                    border: "none",
                    "border-radius": "4px",
                    cursor: "pointer",
                    "font-weight": "600",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1a202c";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#2d3748";
                  }}
                >
                  📄 Print/PDF
                </button>
                <button
                  onClick={() => exportToCSV(report())}
                  style={{
                    padding: "0.75rem 1.5rem",
                    "background-color": "#38a169",
                    color: "#fff",
                    border: "none",
                    "border-radius": "4px",
                    cursor: "pointer",
                    "font-weight": "600",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2f855a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#38a169";
                  }}
                >
                  📊 Export CSV
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div
              style={{
                display: "grid",
                "grid-template-columns": "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                "margin-bottom": "2rem",
              }}
            >
              <div
                style={{
                  padding: "1.5rem",
                  "background-color": "#f0fff4",
                  "border-radius": "8px",
                  border: "1px solid #9ae6b4",
                  "text-align": "center",
                }}
              >
                <div style={{ "font-size": "0.875rem", color: "#718096", "margin-bottom": "0.5rem" }}>Gross Income</div>
                <div style={{ "font-size": "2rem", "font-weight": "700", color: "#38a169" }}>
                  {formatCurrency(report().grossIncome)}
                </div>
              </div>
              <div
                style={{
                  padding: "1.5rem",
                  "background-color": "#fff5f5",
                  "border-radius": "8px",
                  border: "1px solid #fc8181",
                  "text-align": "center",
                }}
              >
                <div style={{ "font-size": "0.875rem", color: "#718096", "margin-bottom": "0.5rem" }}>Total Expenses</div>
                <div style={{ "font-size": "2rem", "font-weight": "700", color: "#e53e3e" }}>
                  {formatCurrency(report().totalExpenses)}
                </div>
              </div>
              <div
                style={{
                  padding: "1.5rem",
                  "background-color": "#f7fafc",
                  "border-radius": "8px",
                  border: "1px solid #2d3748",
                  "text-align": "center",
                }}
              >
                <div style={{ "font-size": "0.875rem", color: "#718096", "margin-bottom": "0.5rem" }}>Net Income</div>
                <div style={{ "font-size": "2rem", "font-weight": "700", color: "#2d3748" }}>
                  {formatCurrency(report().netIncome)}
                </div>
              </div>
              <div
                style={{
                  padding: "1.5rem",
                  "background-color": "#f7fafc",
                  "border-radius": "8px",
                  border: "1px solid #e2e8f0",
                  "text-align": "center",
                }}
              >
                <div style={{ "font-size": "0.875rem", color: "#718096", "margin-bottom": "0.5rem" }}>Payments</div>
                <div style={{ "font-size": "2rem", "font-weight": "700", color: "#2d3748" }}>{report().paymentCount}</div>
              </div>
              <div
                style={{
                  padding: "1.5rem",
                  "background-color": "#f7fafc",
                  "border-radius": "8px",
                  border: "1px solid #e2e8f0",
                  "text-align": "center",
                }}
              >
                <div style={{ "font-size": "0.875rem", color: "#718096", "margin-bottom": "0.5rem" }}>Expense Items</div>
                <div style={{ "font-size": "2rem", "font-weight": "700", color: "#2d3748" }}>{report().expenseCount}</div>
              </div>
            </div>

            {/* By Family */}
            <div style={{ "margin-bottom": "2rem" }}>
              <h3 style={{ "font-size": "1.25rem", "font-weight": "600", color: "#4a5568", "margin-bottom": "1rem" }}>
                Income by Family
              </h3>
              <div style={{ overflow: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    "border-collapse": "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ "background-color": "#f7fafc" }}>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "#2d3748", border: "1px solid #e2e8f0" }}>
                        Family
                      </th>
                      <th style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600", color: "#2d3748", border: "1px solid #e2e8f0" }}>
                        Payments
                      </th>
                      <th style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600", color: "#2d3748", border: "1px solid #e2e8f0" }}>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={report().byFamily}>
                      {(family) => (
                        <tr>
                          <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{family.familyName}</td>
                          <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", "text-align": "right" }}>
                            {family.paymentCount}
                          </td>
                          <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", "text-align": "right", "font-weight": "600" }}>
                            {formatCurrency(family.amount)}
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </div>

            {/* By Month */}
            <Show when={viewMode() === "year"}>
              <div>
                <h3 style={{ "font-size": "1.25rem", "font-weight": "600", color: "#4a5568", "margin-bottom": "1rem" }}>
                  Income by Month
                </h3>
                <div style={{ overflow: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      "border-collapse": "collapse",
                    }}
                  >
                    <thead>
                      <tr style={{ "background-color": "#f7fafc" }}>
                        <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "#2d3748", border: "1px solid #e2e8f0" }}>
                          Month
                        </th>
                        <th style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600", color: "#2d3748", border: "1px solid #e2e8f0" }}>
                          Gross Income
                        </th>
                        <th style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600", color: "#2d3748", border: "1px solid #e2e8f0" }}>
                          Expenses
                        </th>
                        <th style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600", color: "#2d3748", border: "1px solid #e2e8f0" }}>
                          Net Income
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={report().byMonth}>
                        {(month) => (
                          <tr>
                            <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{formatMonth(month.month)}</td>
                            <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", "text-align": "right" }}>
                              {formatCurrency(month.grossIncome)}
                            </td>
                            <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", "text-align": "right" }}>
                              {formatCurrency(month.expenses)}
                            </td>
                            <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", "text-align": "right", "font-weight": "600" }}>
                              {formatCurrency(month.netIncome)}
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>
            </Show>
          </div>
        )}
      </Show>
    </main>
  );
}

