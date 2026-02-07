import { Router, useLocation, useNavigate } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, Show, onMount } from "solid-js";
import Topbar from "./components/Topbar";
import "./app.css";
import "./styles/responsive.css";

function AppRoot(props: { children: any }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ensure root path always has trailing slash for proper routing
  onMount(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      const href = window.location.href;
      const origin = window.location.origin;
      const search = window.location.search;
      const hash = window.location.hash;
      
      // Check if URL ends with origin (no trailing slash) or origin + query/hash (no trailing slash)
      // If so, redirect to add trailing slash
      const urlWithoutQueryHash = href.split("?")[0].split("#")[0];
      if (urlWithoutQueryHash === origin) {
        // Root URL without trailing slash - redirect to add it
        window.location.replace(origin + "/" + search + hash);
      }
    }
  });
  
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
