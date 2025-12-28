import { useSubmission, A, useParams, createAsync } from "@solidjs/router";
import { Show, For, createSignal, createEffect } from "solid-js";
import { createCareSchedule } from "~/lib/care-schedules";
import { getFamily } from "~/lib/families";
import { getServices } from "~/lib/services";

export default function NewCareSchedule() {
  const params = useParams();
  const family = createAsync(() => getFamily(params.id!));
  const services = createAsync(() => getServices());
  const submission = useSubmission(createCareSchedule);
  const [recurrence, setRecurrence] = createSignal<string>("ONCE");
  
  // Default to first assigned service, or first available service if none assigned
  const defaultServiceId = () => {
    const familyData = family();
    if (familyData?.services && familyData.services.length > 0) {
      return familyData.services[0].service.id;
    }
    const allServices = services();
    if (allServices && allServices.length > 0) {
      return allServices[0].id;
    }
    return "";
  };
  
  const [serviceId, setServiceId] = createSignal<string>(defaultServiceId());
  
  // Update service ID when family data loads
  createEffect(() => {
    const familyData = family();
    const allServices = services();
    if (familyData && allServices) {
      const defaultId = defaultServiceId();
      if (defaultId) {
        setServiceId(defaultId);
      }
    }
  });

  // Get today's date in YYYY-MM-DD format for default
  const today = new Date().toISOString().split("T")[0];

  const isRecurring = () => recurrence() !== "ONCE";

  // Get the selected service to check if it requires children
  const selectedService = () => {
    const id = serviceId();
    const allServices = services();
    if (!id || !allServices) return null;
    return allServices.find((s) => s.id === id);
  };

  const requiresChildren = () => selectedService()?.requiresChildren ?? false;

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
          ← Back to Family
        </A>
        <h1 style={{ color: "#2d3748", "font-size": "2rem" }}>Schedule Care Session</h1>
        <p style={{ color: "#718096", margin: "0.5rem 0 0 0" }}>
          Create a {recurrence() === "ONCE" ? "one-time" : "recurring"} care schedule for{" "}
          {family()?.familyName}
        </p>
      </header>

      <Show when={family()}>
        {(familyData) => (
          <form
            action={createCareSchedule}
            method="post"
            onSubmit={(e) => {
              // Custom validation: if service requires children, at least one must be selected
              if (requiresChildren()) {
                const form = e.currentTarget;
                const checkedBoxes = form.querySelectorAll('input[name="childIds"][type="checkbox"]:checked');
                if (checkedBoxes.length === 0) {
                  e.preventDefault();
                  alert("Please select at least one child for this service.");
                  return false;
                }
              }
            }}
            style={{
              "background-color": "#fff",
              padding: "2rem",
              "border-radius": "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <input type="hidden" name="familyId" value={params.id} />
            <input type="hidden" name="serviceId" value={serviceId()} />

            <fieldset
              style={{
                border: "1px solid #e2e8f0",
                "border-radius": "4px",
                padding: "1.5rem",
                "margin-bottom": "1.5rem",
              }}
            >
              <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
                Schedule Type
              </legend>

              <div style={{ "margin-bottom": "1rem" }}>
                <label
                  for="serviceId"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  Service *
                </label>
                <Show
                  when={services()}
                  fallback={
                    <div style={{ padding: "0.75rem", color: "#718096" }}>Loading services...</div>
                  }
                >
                  <select
                    id="serviceId"
                    name="serviceId"
                    required
                    value={serviceId()}
                    onChange={(e) => setServiceId(e.currentTarget.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e0",
                      "border-radius": "4px",
                      "font-size": "1rem",
                    }}
                  >
                    <Show
                      when={familyData().services && familyData().services.length > 0}
                      fallback={
                        <>
                          <option value="">Select a service...</option>
                          <For each={services()}>
                            {(service) => (
                              <option value={service.id}>
                                {service.name}
                                {service.defaultHourlyRate &&
                                  ` ($${service.defaultHourlyRate}/hr${service.pricingType === "PER_CHILD" ? " per child" : ""})`}
                              </option>
                            )}
                          </For>
                        </>
                      }
                    >
                      <For each={familyData().services}>
                        {(fs) => (
                          <option value={fs.service.id}>
                            {fs.service.name}
                            {fs.service.defaultHourlyRate &&
                              ` ($${fs.service.defaultHourlyRate}/hr${fs.service.pricingType === "PER_CHILD" ? " per child" : ""})`}
                          </option>
                        )}
                      </For>
                    </Show>
                  </select>
                  <Show when={!familyData().services || familyData().services.length === 0}>
                    <p style={{ "margin-top": "0.5rem", "font-size": "0.875rem", color: "#718096" }}>
                      No services assigned to this family. <A href={`/families/${params.id}/edit`} style={{ color: "#4299e1" }}>Assign services</A> to default this selection.
                    </p>
                  </Show>
                </Show>
              </div>

              <div style={{ "margin-bottom": isRecurring() ? "1rem" : "0" }}>
                <label
                  for="recurrence"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "500",
                    color: "#4a5568",
                  }}
                >
                  How often? *
                </label>
                <select
                  id="recurrence"
                  name="recurrence"
                  required
                  value={recurrence()}
                  onChange={(e) => setRecurrence(e.currentTarget.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                  }}
                >
                  <option value="ONCE">One-time session</option>
                  <option value="WEEKLY">Recurring weekly</option>
                  <option value="BIWEEKLY">Recurring bi-weekly</option>
                  <option value="MONTHLY">Recurring monthly</option>
                </select>
              </div>

              <Show when={isRecurring()}>
                <div style={{ "margin-bottom": "1rem" }}>
                  <label
                    for="name"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "500",
                      color: "#4a5568",
                    }}
                  >
                    Schedule Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={isRecurring()}
                    placeholder="e.g., Regular Weekday Care"
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
                    style={{
                      display: "block",
                      "margin-bottom": "0.75rem",
                      "font-weight": "500",
                      color: "#4a5568",
                    }}
                  >
                    Days of Week *
                  </label>
                  <div
                    style={{
                      display: "grid",
                      "grid-template-columns": "repeat(2, 1fr)",
                      gap: "0.5rem",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        "align-items": "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        border: "1px solid #e2e8f0",
                        "border-radius": "4px",
                        cursor: "pointer",
                        "background-color": "#f7fafc",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="day_MONDAY"
                        value="true"
                        checked
                        style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                      />
                      <span style={{ color: "#2d3748" }}>Monday</span>
                    </label>
                    <label
                      style={{
                        display: "flex",
                        "align-items": "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        border: "1px solid #e2e8f0",
                        "border-radius": "4px",
                        cursor: "pointer",
                        "background-color": "#f7fafc",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="day_TUESDAY"
                        value="true"
                        style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                      />
                      <span style={{ color: "#2d3748" }}>Tuesday</span>
                    </label>
                    <label
                      style={{
                        display: "flex",
                        "align-items": "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        border: "1px solid #e2e8f0",
                        "border-radius": "4px",
                        cursor: "pointer",
                        "background-color": "#f7fafc",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="day_WEDNESDAY"
                        value="true"
                        checked
                        style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                      />
                      <span style={{ color: "#2d3748" }}>Wednesday</span>
                    </label>
                    <label
                      style={{
                        display: "flex",
                        "align-items": "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        border: "1px solid #e2e8f0",
                        "border-radius": "4px",
                        cursor: "pointer",
                        "background-color": "#f7fafc",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="day_THURSDAY"
                        value="true"
                        style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                      />
                      <span style={{ color: "#2d3748" }}>Thursday</span>
                    </label>
                    <label
                      style={{
                        display: "flex",
                        "align-items": "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        border: "1px solid #e2e8f0",
                        "border-radius": "4px",
                        cursor: "pointer",
                        "background-color": "#f7fafc",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="day_FRIDAY"
                        value="true"
                        checked
                        style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                      />
                      <span style={{ color: "#2d3748" }}>Friday</span>
                    </label>
                    <label
                      style={{
                        display: "flex",
                        "align-items": "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        border: "1px solid #e2e8f0",
                        "border-radius": "4px",
                        cursor: "pointer",
                        "background-color": "#f7fafc",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="day_SATURDAY"
                        value="true"
                        style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                      />
                      <span style={{ color: "#2d3748" }}>Saturday</span>
                    </label>
                    <label
                      style={{
                        display: "flex",
                        "align-items": "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        border: "1px solid #e2e8f0",
                        "border-radius": "4px",
                        cursor: "pointer",
                        "background-color": "#f7fafc",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="day_SUNDAY"
                        value="true"
                        style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                      />
                      <span style={{ color: "#2d3748" }}>Sunday</span>
                    </label>
                  </div>
                  <p style={{ "margin-top": "0.5rem", "font-size": "0.875rem", color: "#718096" }}>
                    Default is Mon/Wed/Fri - adjust as needed
                  </p>
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
                {recurrence() === "ONCE" ? "Session Date & Time" : "Session Times"}
              </legend>

              <Show
                when={recurrence() === "ONCE"}
                fallback={
                  <div
                    style={{
                      display: "grid",
                      "grid-template-columns": "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <label
                        for="startTime"
                        style={{
                          display: "block",
                          "margin-bottom": "0.5rem",
                          "font-weight": "500",
                          color: "#4a5568",
                        }}
                      >
                        Start Time *
                      </label>
                      <input
                        id="startTime"
                        name="startTime"
                        type="time"
                        required
                        value="06:00"
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
                        for="endTime"
                        style={{
                          display: "block",
                          "margin-bottom": "0.5rem",
                          "font-weight": "500",
                          color: "#4a5568",
                        }}
                      >
                        End Time *
                      </label>
                      <input
                        id="endTime"
                        name="endTime"
                        type="time"
                        required
                        value="14:30"
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
                }
              >
                <div style={{ "margin-bottom": "1rem" }}>
                  <label
                    for="startDate"
                    style={{
                      display: "block",
                      "margin-bottom": "0.5rem",
                      "font-weight": "600",
                      color: "#2d3748",
                    }}
                  >
                    Date *
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    required
                    value={today}
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
                  }}
                >
                  <div>
                    <label
                      for="startTime"
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        "font-weight": "500",
                        color: "#4a5568",
                      }}
                    >
                      Start Time *
                    </label>
                    <input
                      id="startTime"
                      name="startTime"
                      type="time"
                      required
                      value="06:00"
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
                      for="endTime"
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        "font-weight": "500",
                        color: "#4a5568",
                      }}
                    >
                      End Time *
                    </label>
                    <input
                      id="endTime"
                      name="endTime"
                      type="time"
                      required
                      value="14:30"
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
              </Show>

              <Show when={isRecurring()}>
                <p style={{ "margin-top": "0.5rem", "font-size": "0.875rem", color: "#718096" }}>
                  Default is 6:00 AM - 2:30 PM
                </p>
              </Show>
            </fieldset>

            <Show when={isRecurring()}>
              <fieldset
                style={{
                  border: "1px solid #e2e8f0",
                  "border-radius": "4px",
                  padding: "1.5rem",
                  "margin-bottom": "1.5rem",
                }}
              >
                <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
                  Schedule Duration
                </legend>

                <div
                  style={{
                    display: "grid",
                    "grid-template-columns": "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      for="recurringStartDate"
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        "font-weight": "500",
                        color: "#4a5568",
                      }}
                    >
                      Start Date *
                    </label>
                    <input
                      id="recurringStartDate"
                      name="startDate"
                      type="date"
                      required
                      value={today}
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
                      for="endDate"
                      style={{
                        display: "block",
                        "margin-bottom": "0.5rem",
                        "font-weight": "500",
                        color: "#4a5568",
                      }}
                    >
                      End Date (Optional)
                    </label>
                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
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
                <p style={{ "margin-top": "0.5rem", "font-size": "0.875rem", color: "#718096" }}>
                  Leave end date empty for ongoing schedules
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
                Children
                <Show when={requiresChildren()}>
                  <span style={{ color: "#e53e3e", "font-size": "0.875rem", "margin-left": "0.5rem" }}>
                    * (at least one required)
                  </span>
                </Show>
              </legend>

              <Show
                when={familyData().children?.length}
                fallback={
                  <div style={{ "text-align": "center", padding: "2rem" }}>
                    <p style={{ color: "#718096", "margin-bottom": "1rem" }}>
                      No children found. Please add children to the family first.
                    </p>
                    <A
                      href={`/families/${params.id}/children/new`}
                      style={{
                        padding: "0.75rem 1.5rem",
                        "background-color": "#48bb78",
                        color: "white",
                        border: "none",
                        "border-radius": "4px",
                        "text-decoration": "none",
                        "font-weight": "600",
                      }}
                    >
                      Add First Child
                    </A>
                  </div>
                }
              >
                {/* Hidden input for validation - only required when service requires children */}
                <Show when={requiresChildren()}>
                  <input
                    type="hidden"
                    name="childIds"
                    value=""
                    required={true}
                    data-validate-children="true"
                    style={{ display: "none" }}
                  />
                </Show>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <For each={familyData().children}>
                    {(child) => (
                      <label
                        style={{
                          display: "flex",
                          "align-items": "center",
                          gap: "0.75rem",
                          padding: "0.75rem",
                          border: "1px solid #e2e8f0",
                          "border-radius": "4px",
                          cursor: "pointer",
                          "background-color": "#f7fafc",
                        }}
                      >
                        <input
                          type="checkbox"
                          name="childIds"
                          value={child.id}
                          style={{
                            width: "1.25rem",
                            height: "1.25rem",
                            cursor: "pointer",
                          }}
                          onChange={(e) => {
                            // Remove the hidden required input when at least one child is selected
                            if (e.currentTarget.checked && requiresChildren()) {
                              const hiddenInput = document.querySelector('input[data-validate-children="true"]') as HTMLInputElement;
                              if (hiddenInput) {
                                hiddenInput.removeAttribute("required");
                              }
                            }
                          }}
                        />
                        <div style={{ flex: "1" }}>
                          <div style={{ "font-weight": "600", color: "#2d3748" }}>
                            {child.firstName} {child.lastName}
                          </div>
                          <div style={{ "font-size": "0.875rem", color: "#718096" }}>
                            Age:{" "}
                            {new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear()}
                            {child.allergies && (
                              <span style={{ "margin-left": "0.5rem", color: "#c53030" }}>
                                ⚠️ Has allergies
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    )}
                  </For>
                </div>
                <p style={{ "margin-top": "0.5rem", "font-size": "0.875rem", color: "#718096" }}>
                  Select which children will attend{" "}
                  {recurrence() === "ONCE" ? "this session" : "these sessions"}
                </p>
              </Show>
            </fieldset>

            <div style={{ "margin-bottom": "1.5rem" }}>
              <label
                for="hourlyRate"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "600",
                  color: "#2d3748",
                }}
              >
                Hourly Rate
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
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
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
                Optional: Set an hourly rate for billing
              </p>
            </div>

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
                placeholder="Any special instructions or notes..."
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

            <Show when={isRecurring()}>
              <div
                style={{
                  padding: "1rem",
                  "background-color": "#ebf8ff",
                  border: "1px solid #bee3f8",
                  "border-radius": "4px",
                  "margin-bottom": "1.5rem",
                }}
              >
                <p style={{ margin: 0, color: "#2c5282", "font-size": "0.875rem" }}>
                  <strong>📅 Note:</strong> After creating this schedule, you'll be able to generate
                  session instances for specific date ranges. Sessions will need to be confirmed by
                  the family before they're finalized.
                </p>
              </div>
            </Show>

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
                disabled={submission.pending || !familyData().children?.length}
                style={{
                  padding: "0.75rem 1.5rem",
                  "background-color": "#4299e1",
                  color: "white",
                  border: "none",
                  "border-radius": "4px",
                  cursor:
                    submission.pending || !familyData().children?.length
                      ? "not-allowed"
                      : "pointer",
                  opacity: submission.pending || !familyData().children?.length ? "0.6" : "1",
                  "font-weight": "600",
                }}
              >
                {submission.pending
                  ? "Creating..."
                  : recurrence() === "ONCE"
                    ? "Schedule Session"
                    : "Create Schedule"}
              </button>
            </div>
          </form>
        )}
      </Show>
    </main>
  );
}
