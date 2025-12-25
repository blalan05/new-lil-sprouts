import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, Show } from "solid-js";
import Topbar from "./components/Topbar";
import "./app.css";
import "./styles/responsive.css";

function AppRoot(props: { children: any }) {
  const location = useLocation();
  
  return (
    <>
      <Show when={location.pathname !== "/login"}>
        <Topbar />
      </Show>
      <Suspense>{props.children}</Suspense>
    </>
  );
}

export default function App() {
  return (
    <Router
      root={props => <AppRoot>{props.children}</AppRoot>}
    >
      <FileRoutes />
    </Router>
  );
}
