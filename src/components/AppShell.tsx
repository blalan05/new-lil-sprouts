import { A, useSubmission, createAsync, revalidate } from "@solidjs/router";
import { For, Show, createSignal, createEffect, onCleanup, onMount, JSX } from "solid-js";
import { getUser, logout } from "~/lib";
import { readRoleCookie } from "~/lib/role-cookie";
import { getStoredTheme, initTheme, resolveTheme, setTheme, type Theme } from "~/lib/theme";
import { authenticatedHomePath } from "~/lib/route-access";
import { getMyNotifications, getUnreadCount, markNotificationRead } from "~/lib/notifications";

const OWNER_NAV_LINKS = [
  { href: "/", label: "Home" },
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

function NavLink(props: { href: string; children: JSX.Element; onClick?: () => void }) {
  return (
    <A href={props.href} onClick={props.onClick}>
      <wa-button appearance="plain" class="nav-link">
        {props.children}
      </wa-button>
    </A>
  );
}

export default function AppShell(props: { children: JSX.Element }) {
  const user = createAsync(() => getUser(), { deferStream: true });
  const logoutSubmission = useSubmission(logout);
  const notifications = createAsync(async () => {
    const u = await getUser();
    if (!u) return [];
    return getMyNotifications(10);
  }, { deferStream: true });
  const unreadCount = createAsync(async () => {
    const u = await getUser();
    if (!u) return 0;
    return getUnreadCount();
  }, { deferStream: true });

  const [navReady, setNavReady] = createSignal(false);
  const [notifOpen, setNotifOpen] = createSignal(false);
  const [theme, setThemeState] = createSignal<Theme>("system");

  onMount(() => {
    initTheme();
    setThemeState(getStoredTheme());
    setNavReady(true);
  });

  const isOwner = () => {
    const u = user();
    if (u?.isOwner) return true;
    if (u && !u.isOwner) return false;
    return readRoleCookie() === "owner";
  };

  const navLinks = () => (isOwner() ? OWNER_NAV_LINKS : PARENT_NAV_LINKS);
  // Only resolve after mount (navReady) so SSR doesn't stamp href="/portal" for owners
  // when user()/role cookie aren't available on the server.
  const homeHref = () =>
    authenticatedHomePath(isOwner(), user()?.familyId);

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
    if (!notifOpen()) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.(".notif-menu")) return;
      setNotifOpen(false);
    };
    document.addEventListener("click", onDocClick);
    onCleanup(() => document.removeEventListener("click", onDocClick));
  });

  const handleNotificationClick = async (notification: {
    id: string;
    careSessionId: string | null;
    familyId: string | null;
  }) => {
    await markNotificationRead(notification.id);
    await revalidate(["my-notifications", "unread-notification-count"]);
    setNotifOpen(false);
    if (notification.careSessionId && isOwner() && notification.familyId) {
      window.location.href = `/families/${notification.familyId}/sessions/${notification.careSessionId}`;
    } else if (notification.careSessionId) {
      window.location.href = "/portal";
    }
  };

  return (
    <wa-page class="app-shell no-print">
      <header slot="header" class="app-header wa-split wa-align-items-center">
        <div class="wa-cluster wa-gap-m wa-align-items-center">
          <Show
            when={navReady()}
            fallback={
              <span class="brand-link wa-cluster wa-gap-s wa-align-items-center">
                <img src="/icons/icon-96x96.png" alt="Lil Sprouts" width="32" height="32" />
                <span class="wa-heading-m">Lil Sprouts</span>
              </span>
            }
          >
            <A href={homeHref()} class="brand-link wa-cluster wa-gap-s wa-align-items-center">
              <img src="/icons/icon-96x96.png" alt="Lil Sprouts" width="32" height="32" />
              <span class="wa-heading-m">Lil Sprouts</span>
            </A>
          </Show>
          <Show when={navReady()}>
            <nav class="desktop-nav wa-cluster wa-gap-xs">
              <For each={navLinks()}>{(link) => <NavLink href={link.href}>{link.label}</NavLink>}</For>
            </nav>
          </Show>
        </div>
        <div class="desktop-nav wa-cluster wa-gap-s wa-align-items-center">
          <wa-button appearance="plain" onClick={cycleTheme} title={themeLabel()} aria-label={themeLabel()}>
            <wa-icon name={resolveTheme(theme()) === "dark" ? "moon" : "sun"} />
          </wa-button>

          <div class="notif-menu" style={{ position: "relative" }}>
            <wa-button
              appearance="plain"
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                setNotifOpen(!notifOpen());
              }}
              aria-label="Notifications"
            >
              <wa-icon name="bell" />
              <Show when={(unreadCount() ?? 0) > 0}>
                <wa-badge variant="danger" pill style={{ "margin-left": "0.25rem" }}>
                  {unreadCount()}
                </wa-badge>
              </Show>
            </wa-button>
            <Show when={notifOpen()}>
              <div class="notif-dropdown wa-stack wa-gap-xs">
                <Show
                  when={(notifications() ?? []).length > 0}
                  fallback={<p class="wa-caption">No notifications</p>}
                >
                  <For each={notifications() ?? []}>
                    {(n) => (
                      <button
                        type="button"
                        class="notif-item"
                        classList={{ unread: !n.read }}
                        onClick={() => handleNotificationClick(n)}
                      >
                        <strong>{n.title}</strong>
                        <span>{n.body}</span>
                      </button>
                    )}
                  </For>
                </Show>
              </div>
            </Show>
          </div>

          <Show when={user()}>
            <A href="/account">
              <wa-button appearance="plain">{user()?.firstName || user()?.username}</wa-button>
            </A>
          </Show>
          <form action={logout} method="post">
            <wa-button
              type="submit"
              variant="danger"
              appearance="filled"
              disabled={logoutSubmission.pending || undefined}
            >
              {logoutSubmission.pending ? "Logging out..." : "Logout"}
            </wa-button>
          </form>
        </div>
      </header>

      <nav slot="navigation" class="mobile-nav wa-stack wa-gap-xs">
        <Show when={navReady()}>
          <For each={navLinks()}>{(link) => <NavLink href={link.href}>{link.label}</NavLink>}</For>
        </Show>
        <wa-button appearance="outlined" onClick={cycleTheme}>
          {themeLabel()}
        </wa-button>
        <Show when={user()}>
          <NavLink href="/account">{user()?.firstName || user()?.username}</NavLink>
        </Show>
        <form action={logout} method="post">
          <wa-button
            type="submit"
            variant="danger"
            appearance="filled"
            disabled={logoutSubmission.pending || undefined}
            style={{ width: "100%" }}
          >
            {logoutSubmission.pending ? "Logging out..." : "Logout"}
          </wa-button>
        </form>
      </nav>

      {props.children}
    </wa-page>
  );
}
