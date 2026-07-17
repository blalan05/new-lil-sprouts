import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, Show, type JSX } from "solid-js";
import { isServer } from "solid-js/web";
import { getRequestEvent } from "solid-js/web";
import AppShell from "./components/AppShell";
import AppErrorBoundary from "./components/ErrorBoundary";
import { ConfirmProvider } from "./components/wa/ConfirmProvider";
import { initTheme } from "./lib/theme";
import "./app.css";
import "./styles/responsive.css";

if (typeof document !== "undefined") {
  initTheme();
}

function isLoginPath(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/login?");
}

function AppRoot(props: { children: JSX.Element }) {
  const location = useLocation();

  // Prefer the real request URL during SSR so we never mount AppShell on /login
  // (shell queries previously could redirect and stall the HTML stream).
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
          <Suspense>{props.children}</Suspense>
        </AppErrorBoundary>
      }
    >
      <ConfirmProvider>
        <AppShell>
          <AppErrorBoundary>
            <Suspense fallback={<div class="page-loading">Loading...</div>}>
              {props.children}
            </Suspense>
          </AppErrorBoundary>
        </AppShell>
      </ConfirmProvider>
    </Show>
  );
}

export default function App() {
  return (
    <Router root={(props) => <AppRoot>{props.children}</AppRoot>}>
      <FileRoutes />
    </Router>
  );
}
