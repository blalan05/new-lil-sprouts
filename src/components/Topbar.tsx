import { A, useSubmission, createAsync } from "@solidjs/router";
import { Show, createSignal, createEffect, onCleanup, For } from "solid-js";
import { isServer } from "solid-js/web";
import { getUser, logout } from "~/lib";
import { getStoredTheme, initTheme, resolveTheme, setTheme, type Theme } from "~/lib/theme";
import { getMyNotifications, getUnreadCount, markNotificationRead } from "~/lib/notifications";

const OWNER_NAV_LINKS = [
  { href: "/families", label: "Families" },
  { href: "/schedule", label: "Schedule" },
  { href: "/payments", label: "Payments" },
  { href: "/expenses", label: "Expenses" },
  { href: "/reports", label: "Reports" },
] as const;

const PARENT_NAV_LINKS = [
  { href: "/portal", label: "Portal" },
  { href: "/portal/today", label: "Today" },
] as const;

export default function Topbar() {
  const user = createAsync(() => getUser(), { deferStream: true });
  const notifications = createAsync(() => getMyNotifications(10), { deferStream: true });
  const unreadCount = createAsync(() => getUnreadCount(), { deferStream: true });
  const logoutSubmission = useSubmission(logout);
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);
  const [menuClosing, setMenuClosing] = createSignal(false);
  const [notifOpen, setNotifOpen] = createSignal(false);
  const navLinks = () => (user()?.isOwner ? OWNER_NAV_LINKS : PARENT_NAV_LINKS);
  const homeHref = () => (user()?.isOwner ? "/" : "/portal");
  const [theme, setThemeState] = createSignal<Theme>("system");
  let menuRef: HTMLDivElement | undefined;
  let toggleRef: HTMLButtonElement | undefined;
  let closeBtnRef: HTMLButtonElement | undefined;

  createEffect(() => {
    if (isServer) return;
    initTheme();
    setThemeState(getStoredTheme());
  });

  createEffect(() => {
    if (isServer) return;
    if (mobileMenuOpen() && !menuClosing()) {
      document.body.classList.add("mobile-menu-open");
      queueMicrotask(() => closeBtnRef?.focus());
    } else if (!mobileMenuOpen()) {
      document.body.classList.remove("mobile-menu-open");
    }
  });

  onCleanup(() => {
    if (isServer) return;
    document.body.classList.remove("mobile-menu-open");
  });

  const closeMobileMenu = (restoreFocus = true) => {
    if (!mobileMenuOpen() || menuClosing()) return;
    setMenuClosing(true);
    const finish = () => {
      setMobileMenuOpen(false);
      setMenuClosing(false);
      if (restoreFocus) toggleRef?.focus();
    };
    const sidebar = menuRef;
    if (sidebar) {
      const onEnd = (e: AnimationEvent) => {
        if (e.target === sidebar) {
          sidebar.removeEventListener("animationend", onEnd);
          finish();
        }
      };
      sidebar.addEventListener("animationend", onEnd);
    } else {
      finish();
    }
  };

  const openMobileMenu = () => {
    setMenuClosing(false);
    setMobileMenuOpen(true);
  };

  const cycleTheme = () => {
    const order: Theme[] = ["light", "dark", "system"];
    const next = order[(order.indexOf(theme()) + 1) % order.length];
    setTheme(next);
    setThemeState(next);
  };

  const themeLabel = () => {
    const t = theme();
    if (t === "system") return `Theme: system (${resolveTheme("system")})`;
    return `Theme: ${t}`;
  };

  createEffect(() => {
    if (isServer || !mobileMenuOpen()) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobileMenu();
        return;
      }
      if (e.key !== "Tab" || !menuRef) return;
      const focusable = menuRef.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => document.removeEventListener("keydown", onKeyDown));
  });

  return (
    <>
      <nav class="topbar no-print">
        <div class="topbar-inner">
          <div style={{ display: "flex", "align-items": "center", gap: "2rem", "flex-wrap": "wrap" }}>
            <A href={homeHref()} class="topbar-brand">
              <img src="/icons/icon-96x96.png" alt="Lil Sprouts" />
              Lil Sprouts
            </A>
            <div class="nav-links desktop-nav" style={{ display: "flex", gap: "0.5rem", "flex-wrap": "wrap" }}>
              <For each={navLinks()}>
                {(link) => (
                  <A href={link.href} class="nav-link">
                    {link.label}
                  </A>
                )}
              </For>
            </div>
          </div>
          <div style={{ display: "flex", "align-items": "center", gap: "1rem" }}>
            <div class="desktop-nav" style={{ display: "flex", "align-items": "center", gap: "1rem" }}>
              <button
                type="button"
                class="btn btn-toggle"
                onClick={cycleTheme}
                aria-label={themeLabel()}
                title={themeLabel()}
              >
                {resolveTheme(theme()) === "dark" ? "☾" : "☀"}
              </button>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  class="btn btn-toggle"
                  aria-label="Notifications"
                  aria-expanded={notifOpen()}
                  onClick={() => setNotifOpen((open) => !open)}
                >
                  🔔
                  <Show when={(unreadCount() ?? 0) > 0}>
                    <span
                      style={{
                        "margin-left": "0.25rem",
                        "font-size": "0.75rem",
                        "font-weight": "700",
                        color: "var(--color-danger)",
                      }}
                    >
                      {unreadCount()}
                    </span>
                  </Show>
                </button>
                <Show when={notifOpen()}>
                  <div
                    class="card"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 0.5rem)",
                      width: "320px",
                      "max-height": "360px",
                      overflow: "auto",
                      "z-index": 200,
                      padding: "0.75rem",
                    }}
                  >
                    <Show when={notifications()?.length} fallback={<p style={{ margin: 0 }}>No notifications</p>}>
                      <For each={notifications()}>
                        {(notification) => (
                          <button
                            type="button"
                            class="nav-link"
                            style={{
                              display: "block",
                              width: "100%",
                              "text-align": "left",
                              opacity: notification.read ? 0.7 : 1,
                              "margin-bottom": "0.5rem",
                            }}
                            onClick={async () => {
                              await markNotificationRead(notification.id);
                              setNotifOpen(false);
                              if (notification.careSessionId && user()?.isOwner) {
                                window.location.href = `/families/${notification.familyId}/sessions/${notification.careSessionId}`;
                              } else if (notification.careSessionId) {
                                window.location.href = "/portal";
                              }
                            }}
                          >
                            <div style={{ "font-weight": "600" }}>{notification.title}</div>
                            <div style={{ "font-size": "0.8125rem", color: "var(--color-text-muted)" }}>
                              {notification.body.slice(0, 80)}
                              {notification.body.length > 80 ? "…" : ""}
                            </div>
                          </button>
                        )}
                      </For>
                    </Show>
                  </div>
                </Show>
              </div>
              <Show when={user()}>
                <A href="/account" class="nav-link">
                  {user()?.firstName || user()?.username}
                </A>
              </Show>
              <form action={logout} method="post">
                <button type="submit" class="btn btn-danger" disabled={logoutSubmission.pending}>
                  {logoutSubmission.pending ? "Logging out..." : "Logout"}
                </button>
              </form>
            </div>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => (mobileMenuOpen() ? closeMobileMenu(false) : openMobileMenu())}
              class="mobile-menu-toggle btn btn-toggle"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen()}
            >
              {mobileMenuOpen() ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      <Show when={mobileMenuOpen() || menuClosing()}>
        <div
          class={`mobile-menu-overlay${menuClosing() ? " closing" : ""}`}
          onClick={() => closeMobileMenu()}
          aria-hidden="true"
        />
        <div
          ref={menuRef}
          class={`mobile-menu-sidebar${menuClosing() ? " closing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "2rem",
            }}
          >
            <A href={homeHref()} class="topbar-brand" onClick={() => closeMobileMenu(false)}>
              <img src="/icons/icon-96x96.png" alt="Lil Sprouts" />
              Lil Sprouts
            </A>
            <button
              ref={closeBtnRef}
              type="button"
              class="btn btn-toggle"
              onClick={() => closeMobileMenu()}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
            <For each={navLinks()}>
              {(link) => (
                <A href={link.href} class="nav-link nav-link-mobile" onClick={() => closeMobileMenu(false)}>
                  {link.label}
                </A>
              )}
            </For>
            <button
              type="button"
              class="nav-link nav-link-mobile btn btn-toggle"
              style={{ "text-align": "left", width: "100%" }}
              onClick={cycleTheme}
            >
              {themeLabel()}
            </button>
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
                  class="nav-link nav-link-mobile"
                  style={{ "margin-bottom": "0.5rem" }}
                  onClick={() => closeMobileMenu(false)}
                >
                  {user()?.firstName || user()?.username}
                </A>
              </Show>
              <form action={logout} method="post">
                <button
                  type="submit"
                  class="btn btn-danger"
                  style={{ width: "100%", "text-align": "left" }}
                  disabled={logoutSubmission.pending}
                  onClick={() => closeMobileMenu(false)}
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
