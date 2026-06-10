import { ensureOwner } from "~/lib/route-guards";
import { createAsync, type RouteDefinition, A } from "@solidjs/router";
import { createSignal, Show, For } from "solid-js";
import { getUser } from "~/lib";
import { getAllFamiliesForReports, getYearEndFamilyReport, getAllYearEndReports, exportYearEndCsv, type YearEndFamilyReport } from "~/lib/reports";
import { formatParentNames } from "~/lib/families";
import { formatTimeLocal } from "~/lib/datetime";

export const route = {
  preload() {
    ensureOwner();
    getUser();
    getAllFamiliesForReports();
  },
} satisfies RouteDefinition;

export default function YearEndReports() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = createSignal<number>(currentYear);
  const [selectedFamilyId, setSelectedFamilyId] = createSignal<string>("");
  const [viewMode, setViewMode] = createSignal<"all" | "single">("all");

  const families = createAsync(() => getAllFamiliesForReports());
  
  const singleReport = createAsync(() => {
    const familyId = selectedFamilyId();
    const year = selectedYear();
    if (familyId && year) {
      return getYearEndFamilyReport(familyId, year);
    }
    return null;
  });

  const allReports = createAsync(() => {
    const year = selectedYear();
    if (viewMode() === "all" && year) {
      return getAllYearEndReports(year);
    }
    return null;
  });

  const formatCurrency = (amount: number | string) => {
    const value = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return formatTimeLocal(date);
  };

  const exportToPDF = async (report: YearEndFamilyReport) => {
    // For now, we'll use window.print() which works well for PDF generation
    // In the future, we could use a library like jsPDF or html2pdf
    printReport(report);
  };

  const downloadCsvFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = async (report: YearEndFamilyReport) => {
    const result = await exportYearEndCsv(selectedYear(), report.familyId);
    downloadCsvFile(result.filename, result.content);
  };

  const exportAllToCSV = async () => {
    const result = await exportYearEndCsv(selectedYear());
    downloadCsvFile(result.filename, result.content);
  };

  const printReport = (report: YearEndFamilyReport) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Year-End Report - ${report.familyName} - ${selectedYear()}</title>
          <style>
            @media print {
              @page {
                margin: 1in;
              }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 2rem;
              max-width: 800px;
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
            .info-section {
              margin: 1.5rem 0;
            }
            .info-row {
              margin: 0.5rem 0;
            }
            .info-label {
              font-weight: 600;
              display: inline-block;
              width: 150px;
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
            .totals {
              margin-top: 2rem;
              padding: 1rem;
              background-color: #f7fafc;
              border-radius: 4px;
              border: 1px solid #e2e8f0;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 0.5rem 0;
              font-size: 1.1rem;
            }
            .total-label {
              font-weight: 600;
            }
            .total-amount {
              font-weight: 700;
              color: #2d3748;
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
        </${"head"}>
        <body>
          <h1>Year-End Report ${selectedYear()}</h1>
          
          <div class="info-section">
            <h2>Family Information</h2>
            <div class="info-row">
              <span class="info-label">Family Name:</span>
              <span>${report.familyName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Parent/Guardian:</span>
              <span>${report.parentName}</span>
            </div>
            ${report.email ? `<div class="info-row"><span class="info-label">Email:</span><span>${report.email}</span></div>` : ""}
            ${report.phone ? `<div class="info-row"><span class="info-label">Phone:</span><span>${report.phone}</span></div>` : ""}
            ${report.address ? `<div class="info-row"><span class="info-label">Address:</span><span>${report.address}${report.city ? `, ${report.city}` : ""}${report.state ? `, ${report.state}` : ""} ${report.zipCode || ""}</span></div>` : ""}
          </div>

          <div class="info-section">
            <h2>Children</h2>
            <ul>
              ${report.children.map(child => {
                const dob = new Date(child.dateOfBirth);
                const age = selectedYear() - dob.getFullYear();
                return `<li>${child.firstName} ${child.lastName} (Age ${age} as of ${selectedYear()})</li>`;
              }).join("")}
            </ul>
          </div>

          <div class="info-section">
            <h2>Session Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service</th>
                  <th>Children</th>
                  <th>Time</th>
                  <th>Hours</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${report.sessions.map(session => `
                  <tr>
                    <td>${formatDate(session.date)}</td>
                    <td>${session.serviceName}</td>
                    <td>${session.children.map(c => `${c.firstName} ${c.lastName}`).join(", ") || "N/A"}</td>
                    <td>${formatTime(session.startTime)} - ${formatTime(session.endTime)}</td>
                    <td>${session.hours.toFixed(2)}</td>
                    <td>${session.hourlyRate ? formatCurrency(session.hourlyRate) : "N/A"}</td>
                    <td>${formatCurrency(session.sessionAmount)}</td>
                    <td>${formatCurrency(session.totalAmount)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>

          <div class="totals">
            <h2>Summary</h2>
            <div class="total-row">
              <span class="total-label">Total Sessions:</span>
              <span class="total-amount">${report.totalSessions}</span>
            </div>
            <div class="total-row">
              <span class="total-label">Total Hours:</span>
              <span class="total-amount">${report.totalHours.toFixed(2)} hours</span>
            </div>
            <div class="total-row">
              <span class="total-label">Total Amount:</span>
              <span class="total-amount">${formatCurrency(report.totalAmount)}</span>
            </div>
            <div class="total-row">
              <span class="total-label">Total Paid:</span>
              <span class="total-amount">${formatCurrency(report.totalPaid)}</span>
            </div>
            ${report.totalOutstanding > 0 ? `
              <div class="total-row">
                <span class="total-label">Outstanding Balance:</span>
                <span class="total-amount" style="color: #e53e3e;">${formatCurrency(report.totalOutstanding)}</span>
              </div>
            ` : ""}
          </div>

          <div class="footer">
            Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </${"body"}>
      </${"html"}>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <main class="page">
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
        <h1 style={{ "font-size": "2rem", "font-weight": "700", color: "var(--color-text)", "margin-bottom": "0.5rem" }}>
          Year-End Receipt Report
        </h1>
        <p style={{ color: "var(--color-text-muted)", "font-size": "1rem" }}>
          Generate detailed year-end reports for families with session details, hours, and payment information.
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          "background-color": "var(--color-surface)",
          padding: "1.5rem",
          "border-radius": "8px",
          border: "1px solid var(--color-border)",
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
                color: "var(--color-text)",
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

          <div style={{ "flex": "1", "min-width": "200px" }}>
            <label
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "600",
                color: "var(--color-text)",
              }}
            >
              View Mode
            </label>
            <select
              value={viewMode()}
              onChange={(e) => {
                setViewMode(e.currentTarget.value as "all" | "single");
                if (e.currentTarget.value === "all") {
                  setSelectedFamilyId("");
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
              <option value="all">All Families</option>
              <option value="single">Single Family</option>
            </select>
          </div>

          <Show when={viewMode() === "single"}>
            <div style={{ "flex": "2", "min-width": "250px" }}>
              <label
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "600",
                  color: "var(--color-text)",
                }}
              >
                Family
              </label>
              <select
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
                  {(family) => (
                    <option value={family.id}>
                      {family.familyName} ({formatParentNames(
                        family.parentFirstName,
                        family.parentLastName,
                        family.familyMembers
                      )})
                    </option>
                  )}
                </For>
              </select>
            </div>
          </Show>
        </div>
      </div>

      {/* Single Family Report */}
      <Show when={viewMode() === "single" && singleReport()}>
        {(report) => (
          <div
            style={{
              "background-color": "var(--color-surface)",
              padding: "2rem",
              "border-radius": "8px",
              border: "1px solid var(--color-border)",
              "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "2rem", "flex-wrap": "wrap", gap: "1rem" }}>
              <h2 style={{ "font-size": "1.5rem", "font-weight": "700", color: "var(--color-text)" }}>
                {report().familyName} - {selectedYear()} Report
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
>
                  📊 Export CSV
                </button>
              </div>
            </div>

            {/* Family Info */}
            <div style={{ "margin-bottom": "2rem" }}>
              <h3 style={{ "font-size": "1.25rem", "font-weight": "600", color: "#4a5568", "margin-bottom": "1rem" }}>
                Family Information
              </h3>
              <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
                <div>
                  <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)", "margin-bottom": "0.25rem" }}>Family Name</div>
                  <div style={{ "font-weight": "600", color: "var(--color-text)" }}>{report().familyName}</div>
                </div>
                <div>
                  <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)", "margin-bottom": "0.25rem" }}>Parent/Guardian</div>
                  <div style={{ "font-weight": "600", color: "var(--color-text)" }}>{report().parentName}</div>
                </div>
                {report().email && (
                  <div>
                    <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)", "margin-bottom": "0.25rem" }}>Email</div>
                    <div style={{ "font-weight": "600", color: "var(--color-text)" }}>{report().email}</div>
                  </div>
                )}
                {report().phone && (
                  <div>
                    <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)", "margin-bottom": "0.25rem" }}>Phone</div>
                    <div style={{ "font-weight": "600", color: "var(--color-text)" }}>{report().phone}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Children */}
            <div style={{ "margin-bottom": "2rem" }}>
              <h3 style={{ "font-size": "1.25rem", "font-weight": "600", color: "#4a5568", "margin-bottom": "1rem" }}>
                Children
              </h3>
              <div style={{ display: "flex", "flex-wrap": "wrap", gap: "1rem" }}>
                <For each={report().children}>
                  {(child) => {
                    const dob = new Date(child.dateOfBirth);
                    const age = selectedYear() - dob.getFullYear();
                    return (
                      <div
                        style={{
                          padding: "1rem",
                          "background-color": "#f7fafc",
                          "border-radius": "4px",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        <div style={{ "font-weight": "600", color: "var(--color-text)" }}>
                          {child.firstName} {child.lastName}
                        </div>
                        <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)" }}>
                          Age {age} as of {selectedYear()}
                        </div>
                      </div>
                    );
                  }}
                </For>
              </div>
            </div>

            {/* Sessions Table */}
            <div style={{ "margin-bottom": "2rem" }}>
              <h3 style={{ "font-size": "1.25rem", "font-weight": "600", color: "#4a5568", "margin-bottom": "1rem" }}>
                Sessions ({report().totalSessions})
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
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
                        Date
                      </th>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
                        Service
                      </th>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
                        Children
                      </th>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
                        Time
                      </th>
                      <th style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
                        Hours
                      </th>
                      <th style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
                        Rate
                      </th>
                      <th style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
                        Amount
                      </th>
                      <th style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={report().sessions}>
                      {(session) => (
                        <tr>
                          <td style={{ padding: "0.75rem", border: "1px solid var(--color-border)" }}>{formatDate(session.date)}</td>
                          <td style={{ padding: "0.75rem", border: "1px solid var(--color-border)" }}>{session.serviceName}</td>
                          <td style={{ padding: "0.75rem", border: "1px solid var(--color-border)" }}>
                            {session.children.map((c) => `${c.firstName} ${c.lastName}`).join(", ") || "N/A"}
                          </td>
                          <td style={{ padding: "0.75rem", border: "1px solid var(--color-border)" }}>
                            {formatTime(session.startTime)} - {formatTime(session.endTime)}
                          </td>
                          <td style={{ padding: "0.75rem", border: "1px solid var(--color-border)", "text-align": "right" }}>
                            {session.hours.toFixed(2)}
                          </td>
                          <td style={{ padding: "0.75rem", border: "1px solid var(--color-border)", "text-align": "right" }}>
                            {session.hourlyRate ? formatCurrency(session.hourlyRate) : "N/A"}
                          </td>
                          <td style={{ padding: "0.75rem", border: "1px solid var(--color-border)", "text-align": "right" }}>
                            {formatCurrency(session.sessionAmount)}
                          </td>
                          <td style={{ padding: "0.75rem", border: "1px solid var(--color-border)", "text-align": "right", "font-weight": "600" }}>
                            {formatCurrency(session.totalAmount)}
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div
              style={{
                padding: "1.5rem",
                "background-color": "#f7fafc",
                "border-radius": "8px",
                border: "1px solid var(--color-border)",
              }}
            >
              <h3 style={{ "font-size": "1.25rem", "font-weight": "600", color: "#4a5568", "margin-bottom": "1rem" }}>
                Summary
              </h3>
              <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div>
                  <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)", "margin-bottom": "0.25rem" }}>Total Sessions</div>
                  <div style={{ "font-size": "1.5rem", "font-weight": "700", color: "var(--color-text)" }}>{report().totalSessions}</div>
                </div>
                <div>
                  <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)", "margin-bottom": "0.25rem" }}>Total Hours</div>
                  <div style={{ "font-size": "1.5rem", "font-weight": "700", color: "var(--color-text)" }}>
                    {report().totalHours.toFixed(2)} hrs
                  </div>
                </div>
                <div>
                  <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)", "margin-bottom": "0.25rem" }}>Total Amount</div>
                  <div style={{ "font-size": "1.5rem", "font-weight": "700", color: "var(--color-text)" }}>
                    {formatCurrency(report().totalAmount)}
                  </div>
                </div>
                <div>
                  <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)", "margin-bottom": "0.25rem" }}>Total Paid</div>
                  <div style={{ "font-size": "1.5rem", "font-weight": "700", color: "#38a169" }}>
                    {formatCurrency(report().totalPaid)}
                  </div>
                </div>
                {report().totalOutstanding > 0 && (
                  <div>
                    <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)", "margin-bottom": "0.25rem" }}>Outstanding</div>
                    <div style={{ "font-size": "1.5rem", "font-weight": "700", color: "#e53e3e" }}>
                      {formatCurrency(report().totalOutstanding)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Standalone Expenses Section */}
            <Show when={report().standaloneExpenses && report().standaloneExpenses.length > 0}>
              <div style={{ "margin-bottom": "2rem" }}>
                <h3 style={{ "font-size": "1.25rem", "font-weight": "600", color: "#4a5568", "margin-bottom": "1rem" }}>
                  Standalone Expenses ({report().standaloneExpenses.length})
                </h3>
                <div
                  style={{
                    "background-color": "var(--color-surface)",
                    "border-radius": "8px",
                    border: "1px solid var(--color-border)",
                    overflow: "hidden",
                  }}
                >
                  <table style={{ width: "100%", "border-collapse": "collapse" }}>
                    <thead>
                      <tr style={{ "background-color": "#f7fafc", "border-bottom": "2px solid #e2e8f0" }}>
                        <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)" }}>
                          Date
                        </th>
                        <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)" }}>
                          Description
                        </th>
                        <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)" }}>
                          Category
                        </th>
                        <th style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600", color: "var(--color-text)" }}>
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={report().standaloneExpenses}>
                        {(expense) => (
                          <tr style={{ "border-bottom": "1px solid #e2e8f0" }}>
                            <td style={{ padding: "0.75rem" }}>{formatDate(expense.expenseDate)}</td>
                            <td style={{ padding: "0.75rem" }}>{expense.description}</td>
                            <td style={{ padding: "0.75rem" }}>
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
                            <td style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600" }}>
                              {formatCurrency(expense.amount)}
                            </td>
                          </tr>
                        )}
                      </For>
                      <tr style={{ "background-color": "#f7fafc", "font-weight": "700" }}>
                        <td colSpan={3} style={{ padding: "0.75rem", "text-align": "right" }}>
                          Total Standalone Expenses:
                        </td>
                        <td style={{ padding: "0.75rem", "text-align": "right" }}>
                          {formatCurrency(report().totalStandaloneExpenses)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Show>
          </div>
        )}
      </Show>

      {/* All Families Reports */}
      <Show when={viewMode() === "all" && allReports()}>
        {(reports) => (
          <div style={{ display: "flex", "flex-direction": "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", "justify-content": "space-between", "align-items": "center", "flex-wrap": "wrap", gap: "1rem" }}>
              <h2 style={{ "font-size": "1.5rem", "font-weight": "700", color: "var(--color-text)", margin: 0 }}>
                All Families - {selectedYear()} Reports
              </h2>
              <button type="button" class="btn btn-primary" onClick={() => exportAllToCSV()}>
                Download all CSV
              </button>
            </div>
            <For each={reports()}>
              {(report) => (
                <div
                  style={{
                    "background-color": "var(--color-surface)",
                    padding: "1.5rem",
                    "border-radius": "8px",
                    border: "1px solid var(--color-border)",
                    "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ display: "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "1rem", "flex-wrap": "wrap", gap: "1rem" }}>
                    <div>
                      <h3 style={{ "font-size": "1.25rem", "font-weight": "600", color: "var(--color-text)", "margin-bottom": "0.25rem" }}>
                        {report.familyName}
                      </h3>
                      <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)" }}>{report.parentName}</div>
                    </div>
                    <A
                      href={`/reports/year-end?family=${report.familyId}&year=${selectedYear()}`}
                      style={{
                        padding: "0.5rem 1rem",
                        "background-color": "#2d3748",
                        color: "#fff",
                        "text-decoration": "none",
                        "border-radius": "4px",
                        "font-weight": "600",
                        transition: "background-color 0.2s",
                      }}
>
                      View Full Report
                    </A>
                  </div>
                  <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
                    <div>
                      <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)" }}>Sessions</div>
                      <div style={{ "font-weight": "600", color: "var(--color-text)" }}>{report.totalSessions}</div>
                    </div>
                    <div>
                      <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)" }}>Hours</div>
                      <div style={{ "font-weight": "600", color: "var(--color-text)" }}>{report.totalHours.toFixed(2)}</div>
                    </div>
                    <div>
                      <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)" }}>Total Amount</div>
                      <div style={{ "font-weight": "600", color: "var(--color-text)" }}>{formatCurrency(report.totalAmount)}</div>
                    </div>
                    <div>
                      <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)" }}>Paid</div>
                      <div style={{ "font-weight": "600", color: "#38a169" }}>{formatCurrency(report.totalPaid)}</div>
                    </div>
                    {report.totalOutstanding > 0 && (
                      <div>
                        <div style={{ "font-size": "0.875rem", color: "var(--color-text-muted)" }}>Outstanding</div>
                        <div style={{ "font-weight": "600", color: "#e53e3e" }}>{formatCurrency(report.totalOutstanding)}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </For>
          </div>
        )}
      </Show>

      {/* Empty State */}
      <Show when={viewMode() === "single" && !selectedFamilyId()}>
        <div
          style={{
            "background-color": "var(--color-surface)",
            padding: "3rem",
            "border-radius": "8px",
            border: "1px solid var(--color-border)",
            "text-align": "center",
          }}
        >
          <div style={{ "font-size": "1.25rem", "font-weight": "600", color: "var(--color-text)", "margin-bottom": "0.5rem" }}>
            Select a family to view their year-end report
          </div>
          <div style={{ color: "var(--color-text-muted)" }}>Choose a family from the dropdown above to generate their report for {selectedYear()}.</div>
        </div>
      </Show>
    </main>
  );
}

