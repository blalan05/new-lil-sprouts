import { useSubmission, A, createAsync } from "@solidjs/router";
import { Show, createSignal, For } from "solid-js";
import { createFamily } from "~/lib/families";
import { getServices } from "~/lib/services";

type ChildData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
};

export default function NewFamily() {
  const submission = useSubmission(createFamily);
  const services = createAsync(() => getServices());
  const [includeSpouse, setIncludeSpouse] = createSignal(false);
  const [includeChildren, setIncludeChildren] = createSignal(false);
  const [children, setChildren] = createSignal<ChildData[]>([
    { firstName: "", lastName: "", dateOfBirth: "", gender: "" },
  ]);

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
          href="/families"
          style={{
            color: "#4299e1",
            "text-decoration": "none",
            "margin-bottom": "0.5rem",
            display: "inline-block",
          }}
        >
          ← Back to Families
        </A>
        <h1 style={{ color: "#2d3748", "font-size": "2rem" }}>Add New Family</h1>
      </header>

      <form
        action={createFamily}
        method="post"
        style={{
          "background-color": "#fff",
          padding: "2rem",
          "border-radius": "8px",
          border: "1px solid #e2e8f0",
        }}
      >
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

        {/* Spouse/Partner Section */}
        <div style={{ "margin-bottom": "1.5rem" }}>
          <label
            style={{
              display: "flex",
              "align-items": "center",
              gap: "0.5rem",
              cursor: "pointer",
              padding: "0.75rem",
              border: "1px solid #e2e8f0",
              "border-radius": "4px",
              "background-color": "#f7fafc",
            }}
          >
            <input
              type="checkbox"
              checked={includeSpouse()}
              onChange={(e) => setIncludeSpouse(e.currentTarget.checked)}
              style={{
                width: "1.25rem",
                height: "1.25rem",
                cursor: "pointer",
              }}
            />
            <span style={{ "font-weight": "600", color: "#2d3748" }}>
              Add Spouse/Partner Information
            </span>
          </label>
        </div>

        <Show when={includeSpouse()}>
          <fieldset
            style={{
              border: "1px solid #e2e8f0",
              "border-radius": "4px",
              padding: "1.5rem",
              "margin-bottom": "1.5rem",
              "background-color": "#f7fafc",
            }}
          >
            <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
              Spouse/Partner Information
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
                  for="spouseFirstName"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  First Name
                </label>
                <input
                  id="spouseFirstName"
                  name="spouseFirstName"
                  type="text"
                  placeholder="Jane"
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
                  for="spouseLastName"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  Last Name
                </label>
                <input
                  id="spouseLastName"
                  name="spouseLastName"
                  type="text"
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

            <div
              style={{
                display: "grid",
                "grid-template-columns": "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  for="spouseEmail"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  Email
                </label>
                <input
                  id="spouseEmail"
                  name="spouseEmail"
                  type="email"
                  placeholder="jane.smith@example.com"
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
                  for="spousePhone"
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
                  id="spousePhone"
                  name="spousePhone"
                  type="tel"
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
            </div>
            <p style={{ "margin-top": "0.75rem", "font-size": "0.875rem", color: "#718096" }}>
              Spouse/partner will be added as a family member with pickup authorization enabled by default.
            </p>
          </fieldset>
        </Show>

        {/* Children Section */}
        <div style={{ "margin-bottom": "1.5rem" }}>
          <label
            style={{
              display: "flex",
              "align-items": "center",
              gap: "0.5rem",
              cursor: "pointer",
              padding: "0.75rem",
              border: "1px solid #e2e8f0",
              "border-radius": "4px",
              "background-color": "#f7fafc",
            }}
          >
            <input
              type="checkbox"
              checked={includeChildren()}
              onChange={(e) => {
                setIncludeChildren(e.currentTarget.checked);
                if (!e.currentTarget.checked) {
                  setChildren([{ firstName: "", lastName: "", dateOfBirth: "", gender: "" }]);
                }
              }}
              style={{
                width: "1.25rem",
                height: "1.25rem",
                cursor: "pointer",
              }}
            />
            <span style={{ "font-weight": "600", color: "#2d3748" }}>
              Add Children Information
            </span>
          </label>
        </div>

        <Show when={includeChildren()}>
          <fieldset
            style={{
              border: "1px solid #e2e8f0",
              "border-radius": "4px",
              padding: "1.5rem",
              "margin-bottom": "1.5rem",
              "background-color": "#f7fafc",
            }}
          >
            <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
              Children Information
            </legend>

            <For each={children()}>
              {(child, index) => (
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e2e8f0",
                    "border-radius": "4px",
                    "margin-bottom": "1rem",
                    "background-color": "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      "justify-content": "space-between",
                      "align-items": "center",
                      "margin-bottom": "0.75rem",
                    }}
                  >
                    <h3 style={{ color: "#2d3748", "font-size": "1rem", margin: 0 }}>
                      Child {index() + 1}
                    </h3>
                    <Show when={children().length > 1}>
                      <button
                        type="button"
                        onClick={() => {
                          setChildren(children().filter((_, i) => i !== index()));
                        }}
                        style={{
                          padding: "0.25rem 0.75rem",
                          "background-color": "#fed7d7",
                          color: "#c53030",
                          border: "none",
                          "border-radius": "4px",
                          cursor: "pointer",
                          "font-size": "0.875rem",
                        }}
                      >
                        Remove
                      </button>
                    </Show>
                  </div>

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
                        for={`childFirstName_${index()}`}
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
                        id={`childFirstName_${index()}`}
                        name={`childFirstName_${index()}`}
                        type="text"
                        required={includeChildren()}
                        placeholder="Emma"
                        value={child.firstName}
                        onInput={(e) => {
                          const newChildren = [...children()];
                          newChildren[index()].firstName = e.currentTarget.value;
                          setChildren(newChildren);
                        }}
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
                        for={`childLastName_${index()}`}
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
                        id={`childLastName_${index()}`}
                        name={`childLastName_${index()}`}
                        type="text"
                        required={includeChildren()}
                        placeholder="Smith"
                        value={child.lastName}
                        onInput={(e) => {
                          const newChildren = [...children()];
                          newChildren[index()].lastName = e.currentTarget.value;
                          setChildren(newChildren);
                        }}
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

                  <div
                    style={{
                      display: "grid",
                      "grid-template-columns": "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <label
                        for={`childDateOfBirth_${index()}`}
                        style={{
                          display: "block",
                          "margin-bottom": "0.5rem",
                          "font-weight": "500",
                          color: "#4a5568",
                        }}
                      >
                        Date of Birth *
                      </label>
                      <input
                        id={`childDateOfBirth_${index()}`}
                        name={`childDateOfBirth_${index()}`}
                        type="date"
                        required={includeChildren()}
                        value={child.dateOfBirth}
                        onInput={(e) => {
                          const newChildren = [...children()];
                          newChildren[index()].dateOfBirth = e.currentTarget.value;
                          setChildren(newChildren);
                        }}
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
                        for={`childGender_${index()}`}
                        style={{
                          display: "block",
                          "margin-bottom": "0.5rem",
                          "font-weight": "500",
                          color: "#4a5568",
                        }}
                      >
                        Gender
                      </label>
                      <select
                        id={`childGender_${index()}`}
                        name={`childGender_${index()}`}
                        value={child.gender}
                        onChange={(e) => {
                          const newChildren = [...children()];
                          newChildren[index()].gender = e.currentTarget.value;
                          setChildren(newChildren);
                        }}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #cbd5e0",
                          "border-radius": "4px",
                          "font-size": "1rem",
                        }}
                      >
                        <option value="">Select gender...</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </For>

            <button
              type="button"
              onClick={() => {
                setChildren([...children(), { firstName: "", lastName: "", dateOfBirth: "", gender: "" }]);
              }}
              style={{
                padding: "0.75rem 1.5rem",
                "background-color": "#edf2f7",
                color: "#2d3748",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                cursor: "pointer",
                "font-weight": "600",
                width: "100%",
              }}
            >
              + Add Another Child
            </button>
            <p style={{ "margin-top": "0.75rem", "font-size": "0.875rem", color: "#718096" }}>
              You can add more children later or provide additional information (allergies, medications, etc.) after creating the family.
            </p>
          </fieldset>
        </Show>

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
            Select which services this family will use. This will default when creating new schedules.
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
                  // Default to checking CHILDCARE if it exists
                  const isDefaultChecked = service.code === "CHILDCARE";
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
                        checked={isDefaultChecked}
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
          />
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
            href="/families"
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
              "background-color": "#48bb78",
              color: "white",
              border: "none",
              "border-radius": "4px",
              cursor: submission.pending ? "not-allowed" : "pointer",
              opacity: submission.pending ? "0.6" : "1",
              "font-weight": "600",
            }}
          >
            {submission.pending ? "Creating..." : "Create Family"}
          </button>
        </div>
      </form>
    </main>
  );
}
