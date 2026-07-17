import { ErrorBoundary as SolidErrorBoundary, JSX } from "solid-js";
import { A } from "@solidjs/router";

export default function AppErrorBoundary(props: { children: JSX.Element }) {
  return (
    <SolidErrorBoundary
      fallback={(err) => (
        <main
          style={{
            "max-width": "600px",
            margin: "4rem auto",
            padding: "2rem",
            "text-align": "center",
          }}
        >
          <h1 style={{ color: "var(--color-text)", "font-size": "1.5rem" }}>Something went wrong</h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            {err instanceof Error ? err.message : "An unexpected error occurred."}
          </p>
          <A
            href="/"
            style={{
              display: "inline-block",
              "margin-top": "1rem",
              padding: "0.75rem 1.5rem",
              "background-color": "#4299e1",
              color: "#fff",
              "border-radius": "4px",
              "text-decoration": "none",
              "font-weight": "600",
            }}
          >
            Back to Dashboard
          </A>
        </main>
      )}
    >
      {props.children}
    </SolidErrorBoundary>
  );
}
