import { A, useSubmission, createAsync } from "@solidjs/router";
import { Show, JSX } from "solid-js";
import { getUser, logout } from "~/lib";

function NavLink(props: { href: string; children: JSX.Element }) {
  return (
    <A href={props.href}>
      <wa-button appearance="plain" class="nav-link">
        {props.children}
      </wa-button>
    </A>
  );
}

export default function AppShell(props: { children: JSX.Element }) {
  const user = createAsync(() => getUser(), { deferStream: true });
  const logoutSubmission = useSubmission(logout);

  return (
    <wa-page class="app-shell no-print">
      <header slot="header" class="app-header wa-split wa-align-items-center">
        <div class="wa-cluster wa-gap-m wa-align-items-center">
          <A href="/" class="brand-link wa-cluster wa-gap-s wa-align-items-center">
            <img src="/icons/icon-96x96.png" alt="Lil Sprouts" width="32" height="32" />
            <span class="wa-heading-m">Lil Sprouts</span>
          </A>
          <nav class="desktop-nav wa-cluster wa-gap-xs">
            <NavLink href="/families">Families</NavLink>
            <NavLink href="/schedule">Schedule</NavLink>
            <Show when={user()?.isOwner}>
              <NavLink href="/payments">Payments</NavLink>
              <NavLink href="/expenses">Expenses</NavLink>
              <NavLink href="/reports">Reports</NavLink>
            </Show>
          </nav>
        </div>
        <div class="desktop-nav wa-cluster wa-gap-s wa-align-items-center">
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
        <NavLink href="/families">Families</NavLink>
        <NavLink href="/schedule">Schedule</NavLink>
        <Show when={user()?.isOwner}>
          <NavLink href="/payments">Payments</NavLink>
          <NavLink href="/expenses">Expenses</NavLink>
          <NavLink href="/reports">Reports</NavLink>
        </Show>
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
