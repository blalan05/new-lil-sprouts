import { createAsync, type RouteDefinition, A, useSubmission } from "@solidjs/router";
import { Show, createSignal, createEffect } from "solid-js";
import { getUser, updateUser, updatePassword } from "~/lib";
import { getDefaultHourlyRate, getDefaultPianoLessonRate, setSetting } from "~/lib/settings";

export const route = {
  preload() {
    getUser();
    getDefaultHourlyRate();
    getDefaultPianoLessonRate();
  },
} satisfies RouteDefinition;

export default function AccountPage() {
  const user = createAsync(() => getUser());
  const updateSubmission = useSubmission(updateUser);
  const passwordSubmission = useSubmission(updatePassword);
  const settingSubmission = useSubmission(setSetting);
  
  const defaultHourlyRate = createAsync(() => getDefaultHourlyRate());
  const defaultPianoLessonRate = createAsync(() => getDefaultPianoLessonRate());
  const [hourlyRateValue, setHourlyRateValue] = createSignal<string>("");
  const [pianoLessonRateValue, setPianoLessonRateValue] = createSignal<string>("");

  createEffect(() => {
    const rate = defaultHourlyRate();
    if (rate !== null && rate !== undefined) {
      setHourlyRateValue(rate.toString());
    }
  });

  createEffect(() => {
    const rate = defaultPianoLessonRate();
    if (rate !== null && rate !== undefined) {
      setPianoLessonRateValue(rate.toString());
    }
  });

  return (
    <main
      style={{
        "max-width": "800px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <header style={{ "margin-bottom": "2rem" }}>
        <h1 style={{ color: "#2d3748", "font-size": "2rem" }}>Account Settings</h1>
        <p style={{ color: "#718096", "margin-top": "0.5rem" }}>
          Manage your account information and password
        </p>
      </header>

      <Show
        when={user()}
        fallback={
          <div style={{ "text-align": "center", padding: "3rem" }}>Loading account information...</div>
        }
      >
        {(userData) => (
          <>
            {/* Profile Information */}
            <div
              style={{
                "background-color": "#fff",
                padding: "2rem",
                "border-radius": "8px",
                border: "1px solid #e2e8f0",
                "margin-bottom": "2rem",
              }}
            >
              <h2
                style={{
                  "font-size": "1.25rem",
                  "margin-bottom": "1.5rem",
                  color: "#2d3748",
                }}
              >
                Profile Information
              </h2>

              <form action={updateUser} method="post">
                <div
                  style={{
                    display: "grid",
                    "grid-template-columns": "1fr 1fr",
                    gap: "1rem",
                    "margin-bottom": "1rem",
                  }}
                >
                  <div>
                    <label
                      for="firstName"
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        "font-weight": "600",
                        color: "#2d3748",
                      }}
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={userData().firstName || ""}
                      placeholder="John"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                        "font-size": "1rem",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      for="lastName"
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        "font-weight": "600",
                        color: "#2d3748",
                      }}
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={userData().lastName || ""}
                      placeholder="Doe"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                        "font-size": "1rem",
                      }}
                    />
                  </div>
                </div>

                <div style={{ "margin-bottom": "1rem" }}>
                  <label
                    for="email"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                    }}
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={userData().email}
                    placeholder="john@example.com"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                      "font-size": "1rem",
                    }}
                  />
                </div>

                <div style={{ "margin-bottom": "1.5rem" }}>
                  <label
                    for="phone"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                    }}
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={userData().phone || ""}
                    placeholder="(555) 123-4567"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                      "font-size": "1rem",
                    }}
                  />
                </div>

                <Show when={userData().isOwner}>
                  <div
                    style={{
                      "background-color": "#fff",
                      padding: "2rem",
                      "border-radius": "8px",
                      border: "1px solid #e2e8f0",
                      "margin-bottom": "2rem",
                    }}
                  >
                    <h2
                      style={{
                        "font-size": "1.25rem",
                        "margin-bottom": "1.5rem",
                        color: "#2d3748",
                      }}
                    >
                      Business Settings
                    </h2>

                    <form action={setSetting} method="post">
                      <input type="hidden" name="key" value="defaultHourlyRate" />
                      <input type="hidden" name="type" value="number" />
                      
                      <div style={{ "margin-bottom": "1.5rem" }}>
                        <label
                          for="defaultHourlyRate"
                          style={{
                            display: "block",
                            "margin-bottom": "0.5rem",
                            "font-weight": "600",
                            color: "#2d3748",
                          }}
                        >
                          Default Hourly Rate (per child)
                        </label>
                        <div style={{ position: "relative" }}>
                          <span
                            style={{
                              position: "absolute",
                              left: "0.75rem",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#718096",
                              "font-size": "1rem",
                            }}
                          >
                            $
                          </span>
                          <input
                            id="defaultHourlyRate"
                            name="value"
                            type="number"
                            step="0.01"
                            min="0"
                            value={hourlyRateValue()}
                            onInput={(e) => setHourlyRateValue(e.currentTarget.value)}
                            placeholder="0.00"
                            style={{
                              width: "100%",
                              padding: "0.75rem 0.75rem 0.75rem 1.75rem",
                              border: "1px solid #cbd5e0",
                              "border-radius": "4px",
                              "font-size": "1rem",
                            }}
                          />
                        </div>
                        <p style={{ "margin-top": "0.5rem", "font-size": "0.875rem", color: "#718096" }}>
                          This default rate will be used when creating sessions if no specific rate is provided. The rate is per child per hour.
                        </p>
                      </div>

                      <button
                        type="submit"
                        style={{
                          padding: "0.75rem 1.5rem",
                          "background-color": "#4299e1",
                          color: "white",
                          border: "none",
                          "border-radius": "4px",
                          "font-size": "1rem",
                          "font-weight": "600",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#3182ce";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#4299e1";
                        }}
                      >
                        Save Settings
                      </button>
                    </form>
                    
                    {/* Separate form for piano lesson rate */}
                    <form action={setSetting} method="post" style={{ "margin-top": "1rem" }}>
                      <input type="hidden" name="key" value="defaultPianoLessonRate" />
                      <input type="hidden" name="type" value="number" />
                      <input type="hidden" name="value" value={pianoLessonRateValue()} />
                      <button
                        type="submit"
                        style={{
                          padding: "0.75rem 1.5rem",
                          "background-color": "#4299e1",
                          color: "white",
                          border: "none",
                          "border-radius": "4px",
                          "font-size": "1rem",
                          "font-weight": "600",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#3182ce";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#4299e1";
                        }}
                      >
                        Save Piano Lesson Rate
                      </button>
                    </form>

                    <Show when={settingSubmission.result}>
                      <div
                        style={{
                          "margin-top": "1rem",
                          padding: "1rem",
                          "background-color": settingSubmission.result instanceof Error
                            ? "#fff5f5"
                            : "#f0fff4",
                          border: `1px solid ${settingSubmission.result instanceof Error ? "#feb2b2" : "#9ae6b4"}`,
                          "border-radius": "4px",
                          color: settingSubmission.result instanceof Error ? "#c53030" : "#276749",
                        }}
                      >
                        {settingSubmission.result instanceof Error
                          ? settingSubmission.result.message
                          : "Settings saved successfully"}
                      </div>
                    </Show>
                  </div>
                </Show>

                <div style={{ "margin-bottom": "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                    }}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    value={userData().username}
                    disabled
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                      "font-size": "1rem",
                      "background-color": "#f7fafc",
                      color: "#718096",
                    }}
                  />
                  <p style={{ "font-size": "0.875rem", color: "#718096", "margin-top": "0.25rem" }}>
                    Username cannot be changed
                  </p>
                </div>

                <Show when={updateSubmission.result}>
                  <div
                    style={{
                      padding: "1rem",
                      "background-color": updateSubmission.result instanceof Error
                        ? "#fff5f5"
                        : "#f0fff4",
                      border: `1px solid ${updateSubmission.result instanceof Error ? "#feb2b2" : "#9ae6b4"}`,
                      "border-radius": "4px",
                      color: updateSubmission.result instanceof Error ? "#c53030" : "#276749",
                      "margin-bottom": "1rem",
                    }}
                  >
                    {updateSubmission.result instanceof Error
                      ? updateSubmission.result.message
                      : "Profile updated successfully!"}
                  </div>
                </Show>

                <div style={{ display: "flex", gap: "1rem", "justify-content": "flex-end" }}>
                  <button
                    type="submit"
                    disabled={updateSubmission.pending}
                    style={{
                      padding: "0.75rem 1.5rem",
                      "background-color": "#4299e1",
                      color: "white",
                      border: "none",
                      "border-radius": "4px",
                      cursor: updateSubmission.pending ? "not-allowed" : "pointer",
                      opacity: updateSubmission.pending ? "0.6" : "1",
                      "font-weight": "600",
                    }}
                  >
                    {updateSubmission.pending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* Password Change */}
            <div
              style={{
                "background-color": "#fff",
                padding: "2rem",
                "border-radius": "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h2
                style={{
                  "font-size": "1.25rem",
                  "margin-bottom": "1.5rem",
                  color: "#2d3748",
                }}
              >
                Change Password
              </h2>

              <form action={updatePassword} method="post">
                <div style={{ "margin-bottom": "1rem" }}>
                  <label
                    for="currentPassword"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                    }}
                  >
                    Current Password *
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    placeholder="Enter current password"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                      "font-size": "1rem",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    "grid-template-columns": "1fr 1fr",
                    gap: "1rem",
                    "margin-bottom": "1.5rem",
                  }}
                >
                  <div>
                    <label
                      for="newPassword"
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        "font-weight": "600",
                        color: "#2d3748",
                      }}
                    >
                      New Password *
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      placeholder="Enter new password"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                        "font-size": "1rem",
                      }}
                    />
                    <p style={{ "font-size": "0.875rem", color: "#718096", "margin-top": "0.25rem" }}>
                      Must be at least 6 characters
                    </p>
                  </div>
                  <div>
                    <label
                      for="confirmPassword"
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        "font-weight": "600",
                        color: "#2d3748",
                      }}
                    >
                      Confirm New Password *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Confirm new password"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #cbd5e0",
                        "border-radius": "4px",
                        "font-size": "1rem",
                      }}
                    />
                  </div>
                </div>

                <Show when={passwordSubmission.result}>
                  <div
                    style={{
                      padding: "1rem",
                      "background-color": passwordSubmission.result instanceof Error
                        ? "#fff5f5"
                        : "#f0fff4",
                      border: `1px solid ${passwordSubmission.result instanceof Error ? "#feb2b2" : "#9ae6b4"}`,
                      "border-radius": "4px",
                      color: passwordSubmission.result instanceof Error ? "#c53030" : "#276749",
                      "margin-bottom": "1rem",
                    }}
                  >
                    {passwordSubmission.result instanceof Error
                      ? passwordSubmission.result.message
                      : "Password updated successfully!"}
                  </div>
                </Show>

                <div style={{ display: "flex", gap: "1rem", "justify-content": "flex-end" }}>
                  <button
                    type="submit"
                    disabled={passwordSubmission.pending}
                    style={{
                      padding: "0.75rem 1.5rem",
                      "background-color": "#48bb78",
                      color: "white",
                      border: "none",
                      "border-radius": "4px",
                      cursor: passwordSubmission.pending ? "not-allowed" : "pointer",
                      opacity: passwordSubmission.pending ? "0.6" : "1",
                      "font-weight": "600",
                    }}
                  >
                    {passwordSubmission.pending ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </Show>
    </main>
  );
}

