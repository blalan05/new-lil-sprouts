import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, Show } from "solid-js";
import AppShell from "./components/AppShell";
import AppErrorBoundary from "./components/ErrorBoundary";
import { ConfirmProvider } from "./components/wa/ConfirmProvider";
import { initTheme } from "./lib/theme";
import "./app.css";
import "./styles/responsive.css";

if (typeof document !== "undefined") {
  initTheme();
}

function AppRoot(props: { children: unknown }) {
  const location = useLocation();
  const isLogin = () => location.pathname === "/login";

  return (
    <ConfirmProvider>
      <Show
        when={!isLogin()}
        fallback={
          <AppErrorBoundary>
            <Suspense>{props.children}</Suspense>
          </AppErrorBoundary>
        }
      >
        <AppShell>
          <AppErrorBoundary>
            <Suspense fallback={<div class="page-loading">Loading...</div>}>
              {props.children}
            </Suspense>
          </AppErrorBoundary>
        </AppShell>
      </Show>
    </ConfirmProvider>
  );
}

export default function App() {
  return (
    <Router root={(props) => <AppRoot>{props.children}</AppRoot>}>
      <FileRoutes />
    </Router>
  );
}
