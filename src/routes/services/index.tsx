import { createAsync, type RouteDefinition, A, useSubmission } from "@solidjs/router";
import { Show, For, createSignal, createEffect } from "solid-js";
import { getAllServices, getService, createService, updateService } from "~/lib/services";

export const route = {
  preload() {
    getAllServices();
  },
} satisfies RouteDefinition;

export default function ServicesPage() {
  const allServices = createAsync(() => getAllServices());
  const createSubmission = useSubmission(createService);
  const updateSubmission = useSubmission(updateService);
  
  const [showCreateForm, setShowCreateForm] = createSignal(false);
  const [editingServiceId, setEditingServiceId] = createSignal<string | null>(null);
  
  const editingService = createAsync(() => {
    const id = editingServiceId();
    return id ? getService(id) : null;
  });
  
  // Watch for successful submission
  createEffect(() => {
    if ((createSubmission.result && !(createSubmission.result instanceof Error)) ||
        (updateSubmission.result && !(updateSubmission.result instanceof Error))) {
      setShowCreateForm(false);
      setEditingServiceId(null);
      // Reload services
      window.location.reload();
    }
  });

  return (
    <main
      style={{
        "max-width": "1000px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <header
        style={{
          display: "flex",
          "justify-content": "space-between",
          "align-items": "center",
          "margin-bottom": "2rem",
        }}
      >
        <div>
          <h1 style={{ color: "#2d3748", "font-size": "2rem", margin: 0 }}>Services</h1>
          <p style={{ color: "#718096", "margin-top": "0.5rem" }}>
            Manage your service types and pricing
          </p>
        </div>
        <Show when={!showCreateForm() && editingServiceId() === null}>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: "0.75rem 1.5rem",
              "background-color": "#48bb78",
              color: "white",
              border: "none",
              "border-radius": "6px",
              "font-weight": "600",
              cursor: "pointer",
            }}
          >
            + Add Service
          </button>
        </Show>
      </header>

      {/* Create/Edit Form */}
      <Show when={showCreateForm() || editingServiceId() !== null}>
        <div
          style={{
            "background-color": "#fff",
            padding: "2rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "margin-bottom": "2rem",
            "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ "font-size": "1.25rem", color: "#2d3748", "margin-bottom": "1.5rem" }}>
            {editingServiceId() ? "Edit Service" : "Create New Service"}
          </h2>
          
          <form
            action={editingServiceId() ? updateService : createService}
            method="post"
          >
            <Show when={editingServiceId()}>
              <input type="hidden" name="id" value={editingServiceId()!} />
            </Show>

            <div style={{ display: "grid", "grid-template-columns": "1fr 1fr", gap: "1rem", "margin-bottom": "1rem" }}>
              <div>
                <label
                  for="name"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  Service Name *
                </label>
                  <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g., Childcare, Piano Lesson"
                  value={editingService()?.name || ""}
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
                  for="code"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  Code * {!editingServiceId() && <span style={{ color: "#718096", "font-weight": "normal" }}>(e.g., CHILDCARE)</span>}
                </label>
                  <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  disabled={!!editingServiceId()}
                  placeholder="CHILDCARE"
                  value={editingService()?.code || ""}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                    "background-color": editingServiceId() ? "#f7fafc" : "#fff",
                  }}
                />
                {editingServiceId() && (
                  <p style={{ "font-size": "0.75rem", color: "#718096", "margin-top": "0.25rem" }}>
                    Code cannot be changed after creation
                  </p>
                )}
              </div>
            </div>

            <div style={{ "margin-bottom": "1rem" }}>
              <label
                for="description"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "600",
                  color: "#2d3748",
                }}
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={2}
                placeholder="Brief description of the service..."
                value={editingService()?.description || ""}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  "font-family": "inherit",
                  "font-size": "1rem",
                }}
              />
            </div>

            <div style={{ display: "grid", "grid-template-columns": "1fr 1fr 1fr", gap: "1rem", "margin-bottom": "1rem" }}>
              <div>
                <label
                  for="defaultHourlyRate"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  Default Hourly Rate ($)
                </label>
                  <input
                  id="defaultHourlyRate"
                  name="defaultHourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={editingService()?.defaultHourlyRate || ""}
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
                  for="pricingType"
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  Pricing Type *
                </label>
                <select
                  id="pricingType"
                  name="pricingType"
                  required
                  value={editingService()?.pricingType || "FLAT"}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e0",
                    "border-radius": "4px",
                    "font-size": "1rem",
                  }}
                >
                  <option value="FLAT">Flat Rate</option>
                  <option value="PER_CHILD">Per Child</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    "margin-bottom": "0.5rem",
                    "font-weight": "600",
                    color: "#2d3748",
                  }}
                >
                  Options
                </label>
                <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem", "padding-top": "0.75rem" }}>
                  <label
                    style={{
                      display: "flex",
                      "align-items": "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="requiresChildren"
                      value="true"
                      checked={editingService()?.requiresChildren || false}
                      style={{
                        width: "1.25rem",
                        height: "1.25rem",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ "font-size": "0.875rem", color: "#4a5568" }}>Requires Children</span>
                  </label>
                  <Show when={editingServiceId()}>
                    <label
                      style={{
                        display: "flex",
                        "align-items": "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="isActive"
                        value="true"
                        checked={editingService()?.isActive !== false}
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          cursor: "pointer",
                        }}
                      />
                      <span style={{ "font-size": "0.875rem", color: "#4a5568" }}>Active</span>
                    </label>
                  </Show>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="submit"
                disabled={createSubmission.pending || updateSubmission.pending}
                style={{
                  padding: "0.75rem 1.5rem",
                  "background-color": "#48bb78",
                  color: "white",
                  border: "none",
                  "border-radius": "4px",
                  cursor: createSubmission.pending || updateSubmission.pending ? "not-allowed" : "pointer",
                  "font-weight": "600",
                }}
              >
                {createSubmission.pending || updateSubmission.pending
                  ? "Saving..."
                  : editingServiceId()
                    ? "Update Service"
                    : "Create Service"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingServiceId(null);
                }}
                style={{
                  padding: "0.75rem 1.5rem",
                  "background-color": "#edf2f7",
                  color: "#2d3748",
                  border: "1px solid #cbd5e0",
                  "border-radius": "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Show>

      {/* Services List */}
      <Show
        when={allServices()}
        fallback={
          <div style={{ "text-align": "center", padding: "3rem", color: "#718096" }}>
            Loading services...
          </div>
        }
      >
        <Show
          when={allServices()?.length}
          fallback={
            <div
              style={{
                "background-color": "#fff",
                padding: "3rem",
                "border-radius": "8px",
                border: "1px solid #e2e8f0",
                "text-align": "center",
              }}
            >
              <p style={{ color: "#718096", "margin-bottom": "1rem" }}>No services yet.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                style={{
                  padding: "0.75rem 1.5rem",
                  "background-color": "#48bb78",
                  color: "white",
                  border: "none",
                  "border-radius": "6px",
                  "font-weight": "600",
                  cursor: "pointer",
                }}
              >
                Create Your First Service
              </button>
            </div>
          }
        >
          <div
            style={{
              "background-color": "#fff",
              padding: "1.5rem",
              "border-radius": "8px",
              border: "1px solid #e2e8f0",
              "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "grid", gap: "1rem" }}>
              <For each={allServices()}>
                {(service) => (
                  <div
                    style={{
                      padding: "1.5rem",
                      border: "1px solid #e2e8f0",
                      "border-radius": "6px",
                      "background-color": "#f7fafc",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        "justify-content": "space-between",
                        "align-items": "flex-start",
                        "margin-bottom": "0.75rem",
                      }}
                    >
                      <div style={{ flex: "1" }}>
                        <div style={{ display: "flex", "align-items": "center", gap: "0.75rem", "margin-bottom": "0.5rem" }}>
                          <h3 style={{ color: "#2d3748", margin: 0, "font-size": "1.125rem" }}>
                            {service.name}
                          </h3>
                          <span
                            style={{
                              padding: "0.25rem 0.5rem",
                              "border-radius": "4px",
                              "background-color": "#e6fffa",
                              color: "#234e52",
                              "font-size": "0.75rem",
                              "font-weight": "600",
                            }}
                          >
                            {service.code}
                          </span>
                          {service.pricingType === "PER_CHILD" && (
                            <span
                              style={{
                                padding: "0.25rem 0.5rem",
                                "border-radius": "4px",
                                "background-color": "#feebc8",
                                color: "#7c2d12",
                                "font-size": "0.75rem",
                                "font-weight": "600",
                              }}
                            >
                              Per Child
                            </span>
                          )}
                        </div>
                        {service.description && (
                          <p style={{ color: "#4a5568", "margin-bottom": "0.5rem", "font-size": "0.875rem" }}>
                            {service.description}
                          </p>
                        )}
                        <div style={{ display: "flex", gap: "1.5rem", "font-size": "0.875rem", color: "#718096" }}>
                          {service.defaultHourlyRate && (
                            <span>
                              <strong style={{ color: "#2d3748" }}>Rate:</strong> ${service.defaultHourlyRate.toFixed(2)}/hr
                              {service.pricingType === "PER_CHILD" && " per child"}
                            </span>
                          )}
                          {service.requiresChildren && (
                            <span>
                              <strong style={{ color: "#2d3748" }}>Requires:</strong> Children
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingServiceId(service.id);
                          setShowCreateForm(false);
                        }}
                        style={{
                          padding: "0.5rem 1rem",
                          "background-color": "#edf2f7",
                          color: "#2d3748",
                          border: "1px solid #cbd5e0",
                          "border-radius": "4px",
                          cursor: "pointer",
                          "font-size": "0.875rem",
                          "font-weight": "600",
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>
      </Show>
    </main>
  );
}

