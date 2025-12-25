import { useSubmission, type RouteSectionProps } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { loginOrRegister } from "~/lib";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);
  const [isRegister, setIsRegister] = createSignal(false);

  return (
    <main
      style={{
        "max-width": "500px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          "text-align": "center",
          color: "#4a5568",
          "margin-bottom": "2rem",
        }}
      >
        LOGIN
      </h1>
      <form action={loginOrRegister} method="post">
        <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />
        <fieldset
          style={{
            border: "1px solid #e2e8f0",
            "border-radius": "8px",
            padding: "1rem",
            "margin-bottom": "1.5rem",
          }}
        >
          <legend
            style={{
              padding: "0 0.5rem",
              "font-weight": "600",
            }}
          >
            Login or Register?
          </legend>
          <label
            style={{
              display: "block",
              "margin-bottom": "0.5rem",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="loginType"
              value="login"
              checked={!isRegister()}
              onChange={() => setIsRegister(false)}
            />{" "}
            Login
          </label>
          <label
            style={{
              display: "block",
              cursor: "pointer",
            }}
          >
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
            style={{
              display: "block",
              "margin-bottom": "0.5rem",
              "font-weight": "500",
            }}
          >
            Username
          </label>
          <input
            id="username-input"
            name="username"
            placeholder="kody"
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #cbd5e0",
              "border-radius": "4px",
              "font-size": "1rem",
            }}
          />
        </div>
        <Show when={isRegister()}>
          <div style={{ "margin-bottom": "1rem" }}>
            <label
              for="email-input"
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "500",
              }}
            >
              Email
            </label>
            <input
              id="email-input"
              name="email"
              type="email"
              placeholder="kody@example.com"
              required={isRegister()}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                "font-size": "1rem",
              }}
            />
          </div>
        </Show>
        <div style={{ "margin-bottom": "1.5rem" }}>
          <label
            for="password-input"
            style={{
              display: "block",
              "margin-bottom": "0.5rem",
              "font-weight": "500",
            }}
          >
            Password
          </label>
          <input
            id="password-input"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #cbd5e0",
              "border-radius": "4px",
              "font-size": "1rem",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loggingIn.pending}
          style={{
            width: "100%",
            padding: "0.75rem",
            "background-color": "#4299e1",
            color: "white",
            border: "none",
            "border-radius": "4px",
            "font-size": "1rem",
            "font-weight": "600",
            cursor: loggingIn.pending ? "not-allowed" : "pointer",
            opacity: loggingIn.pending ? "0.6" : "1",
          }}
        >
          {loggingIn.pending ? "Processing..." : isRegister() ? "Register" : "Login"}
        </button>
        <Show when={loggingIn.result}>
          <p
            style={{
              color: "red",
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
