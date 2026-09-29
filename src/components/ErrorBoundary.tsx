import type { JSX } from "@solidjs/web";
import { Errored, type } from "solid-js";


export default function AppErrorBoundary(props: { children: JSX.Element }) {
  return (
    <Errored
      fallback={(error) => (
        <div class="error-boundary">
          <h1>Something went wrong</h1>
          <p>{error()?.message ?? "An unexpected error occurred."}</p>
          <a href="/">Return home</a>
        </div>
      )}
    >
      {props.children}
    </Errored>
  );
}
