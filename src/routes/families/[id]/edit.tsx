import { createAsync, type RouteDefinition, A, useParams, useSubmission } from "@solidjs/router";
import { Show, For } from "solid-js";
import { getFamily, updateFamily } from "~/lib/families";
import { getServices } from "~/lib/services";

export const route = {
  preload({ params }) {
    if (params.id) {
      getFamily(params.id);
    }
  },
} satisfies RouteDefinition;

export default function EditFamily() {
  const params = useParams();
  const family = createAsync(() => getFamily(params.id!));
  const services = createAsync(() => getServices());
  const submission = useSubmission(updateFamily);

  return (
    <main
      style={{
        "max-width": "800px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <header style={{ "margin-bottom": "2rem" }}>
        <A
          href={`/families/${params.id}`}
          style={{
            color: "#4299e1",
            "text-decoration": "none",
            "margin-bottom": "0.5rem",
            display: "inline-block",
          }}
        >
          ← Back to Family Details
        </A>
        <h1 style={{ color: "#2d3748", "font-size": "2rem" }}>Edit Family</h1>
      </header>

      <Show when={family()}>
        {(familyData) => (
          <form
            action={updateFamily}
            method="post"
            style={{
              "background-color": "#fff",
              padding: "2rem",
              "border-radius": "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <input type="hidden" name="id" value={familyData().id} />

            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                for="familyName"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "600",
                  color: "#2d3748",
                }}
              >
                Family Name *
              </label>
              <input
                id="familyName"
                name="familyName"
                type="text"
                required
                value={familyData().familyName}
                placeholder="Smith Family"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "1rem",
                }}
              />
            </div>

            <fieldset
              style={{
                border: "1px solid #e2e8f0",
                "border-radius": "4px",
                padding: "1.5rem",
                "margin-bottom": "1.5rem",
              }}
            >
              <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
                Parent/Guardian Information
              </legend>

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
                    for="parentFirstName"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "500",
                      color: "#4a5568",
                    }}
                  >
                    First Name *
                  </label>
                  <input
                    id="parentFirstName"
                    name="parentFirstName"
                    type="text"
                    required
                    value={familyData().parentFirstName}
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
                    for="parentLastName"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "500",
                      color: "#4a5568",
                    }}
                  >
                    Last Name *
                  </label>
                  <input
                    id="parentLastName"
                    name="parentLastName"
                    type="text"
                    required
                    value={familyData().parentLastName}
                    placeholder="Smith"
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
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={familyData().email}
                  placeholder="john.smith@example.com"
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
                  for="phone"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={familyData().phone || ""}
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
            </fieldset>

            <fieldset
              style={{
                border: "1px solid #e2e8f0",
                "border-radius": "4px",
                padding: "1.5rem",
                "margin-bottom": "1.5rem",
              }}
            >
              <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
                Address Information
              </legend>

              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  for="address"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  Street Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={familyData().address || ""}
                  placeholder="123 Main St"
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
                  "grid-template-columns": "1fr 1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    for="city"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "500",
                      color: "#4a5568",
                    }}
                  >
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={familyData().city || ""}
                    placeholder="City"
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
                    for="state"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "500",
                      color: "#4a5568",
                    }}
                  >
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={familyData().state || ""}
                    placeholder="State"
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
                    for="zipCode"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "500",
                      color: "#4a5568",
                    }}
                  >
                    ZIP Code
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={familyData().zipCode || ""}
                    placeholder="12345"
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
            </fieldset>

            <fieldset
              style={{
                border: "1px solid #e2e8f0",
                "border-radius": "4px",
                padding: "1.5rem",
                "margin-bottom": "1.5rem",
              }}
            >
              <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
                Emergency Contact
              </legend>

              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  for="emergencyContact"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  Emergency Contact Name
                </label>
                <input
                  id="emergencyContact"
                  name="emergencyContact"
                  type="text"
                  value={familyData().emergencyContact || ""}
                  placeholder="Jane Doe"
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
                  for="emergencyPhone"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  Emergency Phone
                </label>
                <input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  type="tel"
                  value={familyData().emergencyPhone || ""}
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
            </fieldset>

            <fieldset
              style={{
                border: "1px solid #e2e8f0",
                "border-radius": "4px",
                padding: "1.5rem",
                "margin-bottom": "1.5rem",
              }}
            >
              <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
                Services
              </legend>
              <p style={{ "margin-bottom": "1rem", "font-size": "0.875rem", color: "#718096" }}>
                Select which services this family uses. This will default when creating new schedules.
              </p>
              <Show
                when={services()}
                fallback={
                  <div style={{ padding: "1rem", color: "#718096" }}>Loading services...</div>
                }
              >
                <div style={{ display: "flex", "flex-direction": "column", gap: "0.75rem" }}>
                  <For each={services()}>
                    {(service) => {
                      const isAssigned = familyData().services?.some(
                        (fs) => fs.service.id === service.id
                      );
                      return (
                        <label
                          style={{
                            display: "flex",
                            "align-items": "center",
                            gap: "0.5rem",
                            cursor: "pointer",
                            padding: "0.5rem",
                            "border-radius": "4px",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f7fafc";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <input
                            type="checkbox"
                            name="serviceIds"
                            value={service.id}
                            checked={isAssigned}
                            style={{
                              width: "1.25rem",
                              height: "1.25rem",
                              cursor: "pointer",
                            }}
                          />
                          <div style={{ flex: "1" }}>
                            <span style={{ "font-weight": "500", color: "#2d3748" }}>
                              {service.name}
                            </span>
                            {service.defaultHourlyRate && (
                              <span
                                style={{
                                  "margin-left": "0.5rem",
                                  "font-size": "0.875rem",
                                  color: "#718096",
                                }}
                              >
                                (${service.defaultHourlyRate}/hr
                                {service.pricingType === "PER_CHILD" ? " per child" : ""})
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    }}
                  </For>
                </div>
              </Show>
            </fieldset>

            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                for="notes"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "600",
                  color: "#2d3748",
                }}
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Any additional information about the family..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-size": "1rem",
                  "font-family": "inherit",
                }}
              >
                {familyData().notes || ""}
              </textarea>
            </div>

            <Show when={submission.result}>
              <div
                style={{
                  padding: "1rem",
                  "background-color": "#fff5f5",
                  border: "1px solid #feb2b2",
                  "border-radius": "4px",
                  color: "#c53030",
                  "margin-bottom": "1rem",
                }}
              >
                {submission.result!.message}
              </div>
            </Show>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                "justify-content": "flex-end",
              }}
            >
              <A
                href={`/families/${params.id}`}
                style={{
                  padding: "0.75rem 1.5rem",
                  "background-color": "#edf2f7",
                  color: "#2d3748",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "text-decoration": "none",
                  "font-weight": "600",
                }}
              >
                Cancel
              </A>
              <button
                type="submit"
                disabled={submission.pending}
                style={{
                  padding: "0.75rem 1.5rem",
                  "background-color": "#4299e1",
                  color: "white",
                  border: "none",
                  "border-radius": "4px",
                  cursor: submission.pending ? "not-allowed" : "pointer",
                  opacity: submission.pending ? "0.6" : "1",
                  "font-weight": "600",
                }}
              >
                {submission.pending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Show>
    </main>
  );
}
