import { A, useSubmission, createAsync } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { getUser, logout } from "~/lib";

export default function Topbar() {
  const user = createAsync(() => getUser(), { deferStream: true });
  const logoutSubmission = useSubmission(logout);
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);

  return (
    <>
      <nav
        class="no-print"
        style={{
          "background-color": "#2d3748",
          color: "#fff",
          padding: "0.75rem 2rem",
          "box-shadow": "0 2px 4px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          "z-index": 1000,
        }}
      >
        <div
          style={{
            "max-width": "1600px",
            margin: "0 auto",
            display: "flex",
            "justify-content": "space-between",
            "align-items": "center",
          }}
        >
          <div style={{ display: "flex", "align-items": "center", gap: "2rem", "flex-wrap": "wrap" }}>
            <A
              href="/"
              style={{
                "font-size": "1.25rem",
                "font-weight": "700",
                color: "#fff",
                "text-decoration": "none",
              }}
            >
              Lil Sprouts
            </A>
            {/* Desktop Navigation */}
            <div style={{ display: "flex", gap: "0.5rem", "flex-wrap": "wrap" }} class="nav-links desktop-nav">
              <A
                href="/families"
                style={{
                  padding: "0.5rem 1rem",
                  color: "#fff",
                  "text-decoration": "none",
                  "border-radius": "4px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Families
              </A>
              <A
                href="/schedule"
                style={{
                  padding: "0.5rem 1rem",
                  color: "#fff",
                  "text-decoration": "none",
                  "border-radius": "4px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Schedule
              </A>
              <A
                href="/payments"
                style={{
                  padding: "0.5rem 1rem",
                  color: "#fff",
                  "text-decoration": "none",
                  "border-radius": "4px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Payments
              </A>
              <A
                href="/expenses"
                style={{
                  padding: "0.5rem 1rem",
                  color: "#fff",
                  "text-decoration": "none",
                  "border-radius": "4px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Expenses
              </A>
              <A
                href="/reports"
                style={{
                  padding: "0.5rem 1rem",
                  color: "#fff",
                  "text-decoration": "none",
                  "border-radius": "4px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Settings
              </A>
            </div>
          </div>
          <div style={{ display: "flex", "align-items": "center", gap: "1rem" }}>
            {/* Desktop User Menu */}
            <div class="desktop-nav" style={{ display: "flex", "align-items": "center", gap: "1rem" }}>
              <Show when={user()}>
                <A
                  href="/account"
                  style={{
                    padding: "0.5rem 1rem",
                    color: "#fff",
                    "text-decoration": "none",
                    "border-radius": "4px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {user()?.firstName || user()?.username}
                </A>
              </Show>
              <form action={logout} method="post">
                <button
                  type="submit"
                  disabled={logoutSubmission.pending}
                  style={{
                    padding: "0.5rem 1rem",
                    "background-color": "#e53e3e",
                    color: "#fff",
                    border: "none",
                    "border-radius": "4px",
                    cursor: logoutSubmission.pending ? "not-allowed" : "pointer",
                    opacity: logoutSubmission.pending ? "0.6" : "1",
                    "font-weight": "600",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!logoutSubmission.pending) {
                      e.currentTarget.style.backgroundColor = "#c53030";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!logoutSubmission.pending) {
                      e.currentTarget.style.backgroundColor = "#e53e3e";
                    }
                  }}
                >
                  {logoutSubmission.pending ? "Logging out..." : "Logout"}
                </button>
              </form>
            </div>
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen())}
              class="mobile-menu-toggle"
              style={{
                display: "none",
                "background-color": "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: "0.5rem",
                "font-size": "1.5rem",
                "line-height": 1,
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen() ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Off-Canvas Menu */}
      <Show when={mobileMenuOpen()}>
        <div
          class="mobile-menu-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            "background-color": "rgba(0, 0, 0, 0.5)",
            "z-index": 999,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          class="mobile-menu-sidebar"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            width: "280px",
            "max-width": "85vw",
            "background-color": "#2d3748",
            "z-index": 1001,
            padding: "2rem 1.5rem",
            "box-shadow": "2px 0 10px rgba(0,0,0,0.3)",
            overflow: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "2rem",
            }}
          >
            <A
              href="/"
              style={{
                "font-size": "1.25rem",
                "font-weight": "700",
                color: "#fff",
                "text-decoration": "none",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Lil Sprouts
            </A>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                "background-color": "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: "0.5rem",
                "font-size": "1.5rem",
                "line-height": 1,
              }}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
            <A
              href="/families"
              style={{
                padding: "1rem",
                color: "#fff",
                "text-decoration": "none",
                "border-radius": "4px",
                transition: "background-color 0.2s",
                display: "block",
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Families
            </A>
            <A
              href="/schedule"
              style={{
                padding: "1rem",
                color: "#fff",
                "text-decoration": "none",
                "border-radius": "4px",
                transition: "background-color 0.2s",
                display: "block",
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Schedule
            </A>
            <A
              href="/payments"
              style={{
                padding: "1rem",
                color: "#fff",
                "text-decoration": "none",
                "border-radius": "4px",
                transition: "background-color 0.2s",
                display: "block",
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Payments
            </A>
            <A
              href="/expenses"
              style={{
                padding: "1rem",
                color: "#fff",
                "text-decoration": "none",
                "border-radius": "4px",
                transition: "background-color 0.2s",
                display: "block",
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Expenses
            </A>
            <A
              href="/reports"
              style={{
                padding: "1rem",
                color: "#fff",
                "text-decoration": "none",
                "border-radius": "4px",
                transition: "background-color 0.2s",
                display: "block",
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Settings
            </A>
            <div
              style={{
                "margin-top": "1rem",
                padding: "1rem",
                "border-top": "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Show when={user()}>
                <A
                  href="/account"
                  style={{
                    padding: "1rem",
                    color: "#fff",
                    "text-decoration": "none",
                    "border-radius": "4px",
                    transition: "background-color 0.2s",
                    display: "block",
                    "margin-bottom": "0.5rem",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {user()?.firstName || user()?.username}
                </A>
              </Show>
              <form action={logout} method="post">
                <button
                  type="submit"
                  disabled={logoutSubmission.pending}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    "background-color": "#e53e3e",
                    color: "#fff",
                    border: "none",
                    "border-radius": "4px",
                    cursor: logoutSubmission.pending ? "not-allowed" : "pointer",
                    opacity: logoutSubmission.pending ? "0.6" : "1",
                    "font-weight": "600",
                    transition: "background-color 0.2s",
                    "text-align": "left",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={(e) => {
                    if (!logoutSubmission.pending) {
                      e.currentTarget.style.backgroundColor = "#c53030";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!logoutSubmission.pending) {
                      e.currentTarget.style.backgroundColor = "#e53e3e";
                    }
                  }}
                >
                  {logoutSubmission.pending ? "Logging out..." : "Logout"}
                </button>
              </form>
            </div>
          </nav>
        </div>
      </Show>
    </>
  );
}

