import { type RouteDefinition, A } from "@solidjs/router";
import { getUser } from "~/lib";

export const route = {
  preload() {
    getUser();
  },
} satisfies RouteDefinition;

export default function Reports() {
  return (
    <main
      style={{
        "max-width": "1600px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <div style={{ "margin-bottom": "2rem" }}>
        <h1 style={{ "font-size": "2rem", "font-weight": "700", color: "#2d3748", "margin-bottom": "0.5rem" }}>
          Reports
        </h1>
        <p style={{ color: "#718096", "font-size": "1rem" }}>
          Generate and export various reports for your business.
        </p>
      </div>

      <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {/* Year-End Receipt Report */}
        <A
          href="/reports/year-end"
          style={{
            "background-color": "#fff",
            padding: "2rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
            "text-decoration": "none",
            color: "inherit",
            display: "block",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
          }}
        >
          <div style={{ "font-size": "2rem", "margin-bottom": "1rem" }}>📄</div>
          <h2 style={{ "font-size": "1.25rem", "font-weight": "600", color: "#2d3748", "margin-bottom": "0.5rem" }}>
            Year-End Receipt Report
          </h2>
          <p style={{ color: "#718096", "font-size": "0.875rem", "line-height": "1.5" }}>
            Generate detailed year-end reports for families including dates, children, hours worked, and money paid. Exportable to PDF.
          </p>
        </A>

        {/* Income Report */}
        <A
          href="/reports/income"
          style={{
            "background-color": "#fff",
            padding: "2rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
            "text-decoration": "none",
            color: "inherit",
            display: "block",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
          }}
        >
          <div style={{ "font-size": "2rem", "margin-bottom": "1rem" }}>💰</div>
          <h2 style={{ "font-size": "1.25rem", "font-weight": "600", color: "#2d3748", "margin-bottom": "0.5rem" }}>
            Income Report (Gross & Net)
          </h2>
          <p style={{ color: "#718096", "font-size": "0.875rem", "line-height": "1.5" }}>
            View gross income, expenses, and net income for your business. Breakdown by family and month. Exportable to PDF and CSV.
          </p>
        </A>

        {/* Placeholder for future reports */}
        {/* 
        <div
          style={{
            "background-color": "#fff",
            padding: "2rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
            opacity: "0.6",
          }}
        >
          <div style={{ "font-size": "2rem", "margin-bottom": "1rem" }}>📊</div>
          <h2 style={{ "font-size": "1.25rem", "font-weight": "600", color: "#2d3748", "margin-bottom": "0.5rem" }}>
            Monthly Summary Report
          </h2>
          <p style={{ color: "#718096", "font-size": "0.875rem", "line-height": "1.5" }}>
            Coming soon...
          </p>
        </div>
        */}
      </div>
    </main>
  );
}
