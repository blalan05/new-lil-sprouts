import { useSubmission, type RouteSectionProps } from "@solidjs/router";
import { Show } from "solid-js";
import { loginOrRegister } from "~/lib";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);

  return (
    <div class="login-page">
      <wa-card class="login-card">
        <div class="wa-stack wa-gap-l">
          <div class="wa-stack wa-gap-s" style={{ "text-align": "center" }}>
            <img src="/icons/icon-192x192.png" alt="Lil Sprouts" width="96" height="96" />
            <h1 class="wa-heading-xl">Lil Sprouts</h1>
            <p class="wa-body-m wa-color-text-quiet">Sign in to your account</p>
          </div>

          <Show when={loggingIn.error}>
            <wa-callout variant="danger">
              Invalid username or password. Please try again.
            </wa-callout>
          </Show>

          <form action={loginOrRegister} method="post" class="wa-stack wa-gap-m">
            <input type="hidden" name="loginType" value="login" />
            <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />
            <wa-input
              label="Username"
              name="username"
              placeholder="username"
              required
              autocomplete="username"
            />
            <wa-input
              label="Password"
              name="password"
              type="password"
              placeholder="password"
              required
              autocomplete="current-password"
              password-toggle
            />
            <wa-button
              type="submit"
              variant="brand"
              appearance="filled"
              disabled={loggingIn.pending || undefined}
              style={{ width: "100%" }}
            >
              {loggingIn.pending ? "Signing in..." : "Sign In"}
            </wa-button>
          </form>
        </div>
      </wa-card>
    </div>
  );
}
