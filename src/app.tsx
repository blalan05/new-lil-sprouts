import { useLocation } from "@solidjs/router";
import { Loading, Show } from "solid-js";
import type { JSX } from "@solidjs/web";
import { getRequestEvent, isServer } from "@solidjs/web";
import AppShell from "~/components/AppShell";
import AppErrorBoundary from "~/components/ErrorBoundary";
import { ConfirmProvider } from "~/components/wa/ConfirmProvider";
import { initTheme } from "~/lib/theme";
import { Router } from "~/router";
import "~/app.css";
import "~/styles/responsive.css";

if (typeof document !== "undefined") {
  initTheme();
}

function isLoginPath(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/login?");
}

function AppRoot(props: { children: JSX.Element }) {
  const location = useLocation();

  const onLogin = () => {
    if (isServer) {
      try {
        const url = getRequestEvent()?.request?.url;
        if (url) return isLoginPath(new URL(url).pathname);
      } catch {
        // fall through to router location
      }
    }
    return isLoginPath(location.pathname);
  };

  return (
    <Show
      when={!onLogin()}
      fallback={
        <AppErrorBoundary>
          <Loading>{props.children}</Loading>
        </AppErrorBoundary>
      }
    >
      <ConfirmProvider>
        <AppShell>
          <AppErrorBoundary>
            <Loading fallback={<div class="page-loading">Loading...</div>}>
              {props.children}
            </Loading>
          </AppErrorBoundary>
        </AppShell>
      </ConfirmProvider>
    </Show>
  );
}

export default function App() {
  return <Router>{(props) => <AppRoot>{props.children}</AppRoot>}</Router>;
}
