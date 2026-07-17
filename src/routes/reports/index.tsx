import { type RouteDefinition, A, createAsync } from "@solidjs/router";
import { Show, For, createSignal, createEffect } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { getUser } from "~/lib";
import { getAllServices, getService, createService, updateService } from "~/lib/services";
import { useSubmission } from "@solidjs/router";
import { formatMoneyDisplay } from "~/lib/money-display";

export const route = {
  preload() {
    getUser();
    getAllServices();
  },
} satisfies RouteDefinition;

export default function Reports() {
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
    if (
      (createSubmission.result && !(createSubmission.result instanceof Error)) ||
      (updateSubmission.result && !(updateSubmission.result instanceof Error))
    ) {
      setShowCreateForm(false);
      setEditingServiceId(null);
      // Reload services
      window.location.reload();
    }
  });

  return (
    <PageContent>
      <PageHeader
        title="Reports"
        description="Manage services and generate reports for your business."
      />

      <wa-tab-group>
        <wa-tab slot="nav" panel="reports" active>
          Reports
        </wa-tab>
        <wa-tab slot="nav" panel="services">
          Services
        </wa-tab>

        <wa-tab-panel name="reports">
          <div class="wa-grid wa-gap-l" style={{ "--min-column-size": "18rem" }}>
            <wa-card>
              <div class="wa-stack wa-gap-m">
                <div style={{ "font-size": "2rem" }}>📄</div>
                <h2 class="wa-heading-m">Year-End Receipt Report</h2>
                <p class="wa-body-s wa-color-text-quiet">
                  Generate detailed year-end reports for families including dates, children, hours
                  worked, and money paid. Exportable to PDF.
                </p>
                <A href="/reports/year-end">
                  <wa-button variant="brand">View Report</wa-button>
                </A>
              </div>
            </wa-card>

            <wa-card>
              <div class="wa-stack wa-gap-m">
                <div style={{ "font-size": "2rem" }}>📅</div>
                <h2 class="wa-heading-m">Calendar View Report</h2>
                <p class="wa-body-s wa-color-text-quiet">
                  View all care sessions in a calendar format for any month. Perfect for printing
                  to show how busy you were.
                </p>
                <A href="/reports/calendar">
                  <wa-button variant="brand">View Report</wa-button>
                </A>
              </div>
            </wa-card>

            <wa-card>
              <div class="wa-stack wa-gap-m">
                <div style={{ "font-size": "2rem" }}>💰</div>
                <h2 class="wa-heading-m">Income Report (Gross & Net)</h2>
                <p class="wa-body-s wa-color-text-quiet">
                  View gross income, expenses, and net income for your business. Breakdown by family
                  and month. Exportable to PDF and CSV.
                </p>
                <A href="/reports/income">
                  <wa-button variant="brand">View Report</wa-button>
                </A>
              </div>
            </wa-card>
          </div>
        </wa-tab-panel>

        <wa-tab-panel name="services">
          <div class="wa-stack wa-gap-l">
            <header class="wa-flank wa-gap-m">
              <div class="wa-stack wa-gap-xs">
                <h2 class="wa-heading-l">Services</h2>
                <p class="wa-body-m wa-color-text-quiet">Manage your service types and pricing</p>
              </div>
              <Show when={!showCreateForm() && editingServiceId() === null}>
                <wa-button variant="brand" onClick={() => setShowCreateForm(true)}>
                  + Add Service
                </wa-button>
              </Show>
            </header>

            <Show when={showCreateForm() || editingServiceId() !== null}>
              <wa-card>
                <div class="wa-stack wa-gap-l">
                  <h2 class="wa-heading-m">
                    {editingServiceId() ? "Edit Service" : "Create New Service"}
                  </h2>

                  <form
                    action={editingServiceId() ? updateService : createService}
                    method="post"
                    class="wa-stack wa-gap-m"
                  >
                    <Show when={editingServiceId()}>
                      <input type="hidden" name="id" value={editingServiceId()!} />
                    </Show>

                    <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "16rem" }}>
                      <wa-input
                        label="Service Name *"
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="e.g., Childcare, Piano Lesson"
                        value={editingService()?.name || ""}
                      />

                      <div class="wa-stack wa-gap-xs">
                        <wa-input
                          label={
                            editingServiceId()
                              ? "Code *"
                              : "Code * (e.g., CHILDCARE)"
                          }
                          id="code"
                          name="code"
                          type="text"
                          required
                          disabled={!!editingServiceId() || undefined}
                          placeholder="CHILDCARE"
                          value={editingService()?.code || ""}
                        />
                        <Show when={editingServiceId()}>
                          <wa-callout variant="neutral">
                            Code cannot be changed after creation
                          </wa-callout>
                        </Show>
                      </div>
                    </div>

                    <wa-textarea
                      label="Description"
                      id="description"
                      name="description"
                      rows={2}
                      placeholder="Brief description of the service..."
                      value={editingService()?.description || ""}
                    />

                    <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "14rem" }}>
                      <wa-input
                        label="Default Hourly Rate ($)"
                        id="defaultHourlyRate"
                        name="defaultHourlyRate"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={editingService()?.defaultHourlyRate?.toString() || ""}
                      />

                      <wa-select
                        label="Pricing Type *"
                        id="pricingType"
                        name="pricingType"
                        required
                        value={editingService()?.pricingType || "FLAT"}
                      >
                        <wa-option value="FLAT">Flat Rate</wa-option>
                        <wa-option value="PER_CHILD">Per Child</wa-option>
                      </wa-select>

                      <div class="wa-stack wa-gap-s">
                        <span class="wa-body-s wa-color-text-normal" style={{ "font-weight": "600" }}>
                          Options
                        </span>
                        <wa-checkbox
                          name="requiresChildren"
                          value="true"
                          checked={editingService()?.requiresChildren || undefined}
                        >
                          Requires Children
                        </wa-checkbox>
                        <Show when={editingServiceId()}>
                          <wa-checkbox
                            name="isActive"
                            value="true"
                            checked={editingService()?.isActive !== false || undefined}
                          >
                            Active
                          </wa-checkbox>
                        </Show>
                      </div>
                    </div>

                    <div class="wa-cluster wa-gap-s">
                      <wa-button
                        type="submit"
                        variant="brand"
                        disabled={createSubmission.pending || updateSubmission.pending || undefined}
                      >
                        {createSubmission.pending || updateSubmission.pending
                          ? "Saving..."
                          : editingServiceId()
                            ? "Update Service"
                            : "Create Service"}
                      </wa-button>
                      <wa-button
                        type="button"
                        appearance="outlined"
                        onClick={() => {
                          setShowCreateForm(false);
                          setEditingServiceId(null);
                        }}
                      >
                        Cancel
                      </wa-button>
                    </div>
                  </form>
                </div>
              </wa-card>
            </Show>

            <Show
              when={allServices()}
              fallback={
                <p class="wa-body-m wa-color-text-quiet" style={{ "text-align": "center", padding: "3rem" }}>
                  Loading services...
                </p>
              }
            >
              <Show
                when={allServices()?.length}
                fallback={
                  <wa-card>
                    <div class="wa-stack wa-gap-m" style={{ "text-align": "center" }}>
                      <p class="wa-body-m wa-color-text-quiet">No services yet.</p>
                      <wa-button variant="brand" onClick={() => setShowCreateForm(true)}>
                        Create Your First Service
                      </wa-button>
                    </div>
                  </wa-card>
                }
              >
                <wa-card>
                  <div class="wa-stack wa-gap-m">
                    <For each={allServices()}>
                      {(service) => (
                        <wa-card>
                          <div class="wa-flank wa-gap-m">
                            <div class="wa-stack wa-gap-s" style={{ flex: "1" }}>
                              <div class="wa-cluster wa-gap-s">
                                <h3 class="wa-heading-s">{service.name}</h3>
                                <wa-tag variant="brand" appearance="filled-outlined">
                                  {service.code}
                                </wa-tag>
                                <Show when={service.pricingType === "PER_CHILD"}>
                                  <wa-tag variant="warning" appearance="filled-outlined">
                                    Per Child
                                  </wa-tag>
                                </Show>
                              </div>
                              <Show when={service.description}>
                                <p class="wa-body-s wa-color-text-quiet">{service.description}</p>
                              </Show>
                              <div class="wa-cluster wa-gap-l">
                                <Show when={service.defaultHourlyRate}>
                                  <span class="wa-body-s wa-color-text-quiet">
                                    <strong class="wa-color-text-normal">Rate:</strong>{" "}
                                    {formatMoneyDisplay(service.defaultHourlyRate)}/hr
                                    {service.pricingType === "PER_CHILD" && " per child"}
                                  </span>
                                </Show>
                                <Show when={service.requiresChildren}>
                                  <span class="wa-body-s wa-color-text-quiet">
                                    <strong class="wa-color-text-normal">Requires:</strong> Children
                                  </span>
                                </Show>
                              </div>
                            </div>
                            <wa-button
                              appearance="outlined"
                              onClick={() => {
                                setEditingServiceId(service.id);
                                setShowCreateForm(false);
                              }}
                            >
                              Edit
                            </wa-button>
                          </div>
                        </wa-card>
                      )}
                    </For>
                  </div>
                </wa-card>
              </Show>
            </Show>
          </div>
        </wa-tab-panel>
      </wa-tab-group>
    </PageContent>
  );
}
