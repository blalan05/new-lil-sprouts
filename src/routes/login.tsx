import { useSubmission, type RouteSectionProps } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { loginOrRegister } from "~/lib";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);
  const [isRegister, setIsRegister] = createSignal(false);

  return (
    <main class="page-narrow">
      <div style={{ "text-align": "center", "margin-bottom": "2rem" }}>
        <img
          src="/icons/icon-192x192.png"
          alt="Lil Sprouts"
          style={{ width: "96px", height: "96px", "margin-bottom": "1rem" }}
        />
        <h1 class="page-title" style={{ "text-align": "center", margin: 0 }}>
          Login
        </h1>
      </div>

      <form action={loginOrRegister} method="post" class="surface-panel" style={{ padding: "1.5rem" }}>
        <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />

        <fieldset
          style={{
            border: "1px solid var(--color-border)",
            "border-radius": "var(--radius-lg)",
            padding: "1rem",
            "margin-bottom": "1.5rem",
          }}
        >
          <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "var(--color-text)" }}>
            Login or Register?
          </legend>
          <label style={{ display: "block", "margin-bottom": "0.5rem", cursor: "pointer" }}>
            <input
              type="radio"
              name="loginType"
              value="login"
              checked={!isRegister()}
              onChange={() => setIsRegister(false)}
            />{" "}
            Login
          </label>
          <label style={{ display: "block", cursor: "pointer" }}>
            <input
              type="radio"
              name="loginType"
              value="register"
              checked={isRegister()}
              onChange={() => setIsRegister(true)}
            />{" "}
            Register
          </label>
        </fieldset>

        <div style={{ "margin-bottom": "1rem" }}>
          <label
            for="username-input"
            style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "var(--color-text)" }}
          >
            Username
          </label>
          <input
            id="username-input"
            name="username"
            class="input-field"
            placeholder="kody"
            required
          />
        </div>

        <Show when={isRegister()}>
          <div style={{ "margin-bottom": "1rem" }}>
            <label
              for="email-input"
              style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "var(--color-text)" }}
            >
              Email
            </label>
            <input
              id="email-input"
              name="email"
              type="email"
              class="input-field"
              placeholder="kody@example.com"
              required={isRegister()}
            />
          </div>
        </Show>

        <div style={{ "margin-bottom": "1.5rem" }}>
          <label
            for="password-input"
            style={{ display: "block", "margin-bottom": "0.5rem", "font-weight": "500", color: "var(--color-text)" }}
          >
            Password
          </label>
          <input
            id="password-input"
            name="password"
            type="password"
            class="input-field"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary" disabled={loggingIn.pending} style={{ width: "100%" }}>
          {loggingIn.pending ? "Processing..." : isRegister() ? "Register" : "Login"}
        </button>

        <Show when={loggingIn.result}>
          <p
            style={{
              color: "var(--color-danger)",
              "margin-top": "1rem",
              "text-align": "center",
              "font-weight": "500",
            }}
            role="alert"
            id="error-message"
          >
            {loggingIn.result!.message}
          </p>
        </Show>
      </form>
    </main>
  );
}
