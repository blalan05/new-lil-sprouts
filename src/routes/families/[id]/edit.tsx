import { createAsync, type RouteDefinition, useParams, useSubmission } from "@solidjs/router";
import { Show, For } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
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
    <PageContent>
      <wa-button href={`/families/${params.id}`} appearance="plain" size="small">
        ← Back to Family Details
      </wa-button>
      <PageHeader title="Edit Family" />

      <Show when={family()}>
        {(familyData) => (
          <wa-card>
          <form action={updateFamily} method="post" class="wa-stack wa-gap-l">
            <input type="hidden" name="id" value={familyData().id} />

            <wa-input label="Family Name *" id="familyName" name="familyName" required value={familyData().familyName} placeholder="Smith Family" />

            <fieldset class="wa-stack wa-gap-m" style={{ border: "1px solid var(--wa-color-neutral-90)", "border-radius": "var(--wa-border-radius-m)", padding: "var(--wa-space-m)", margin: 0 }}>
              <legend class="wa-heading-s">Parent/Guardian Information</legend>

              <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
                <wa-input label="First Name *" id="parentFirstName" name="parentFirstName" required value={familyData().parentFirstName} placeholder="John" />
                <wa-input label="Last Name *" id="parentLastName" name="parentLastName" required value={familyData().parentLastName} placeholder="Smith" />
              </div>

              <wa-input label="Email *" id="email" name="email" type="email" required value={familyData().email} placeholder="john.smith@example.com" />
              <wa-input label="Phone" id="phone" name="phone" type="tel" value={familyData().phone || ""} placeholder="(555) 123-4567" />
            </fieldset>

            <fieldset class="wa-stack wa-gap-m" style={{ border: "1px solid var(--wa-color-neutral-90)", "border-radius": "var(--wa-border-radius-m)", padding: "var(--wa-space-m)", margin: 0 }}>
              <legend class="wa-heading-s">Address Information</legend>
              <wa-input label="Street Address" id="address" name="address" value={familyData().address || ""} placeholder="123 Main St" />
              <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "140px" }}>
                <wa-input label="City" id="city" name="city" value={familyData().city || ""} placeholder="City" />
                <wa-input label="State" id="state" name="state" value={familyData().state || ""} placeholder="State" />
                <wa-input label="ZIP Code" id="zipCode" name="zipCode" value={familyData().zipCode || ""} placeholder="12345" />
              </div>
            </fieldset>

            <fieldset class="wa-stack wa-gap-m" style={{ border: "1px solid var(--wa-color-neutral-90)", "border-radius": "var(--wa-border-radius-m)", padding: "var(--wa-space-m)", margin: 0 }}>
              <legend class="wa-heading-s">Emergency Contact</legend>
              <wa-input label="Emergency Contact Name" id="emergencyContact" name="emergencyContact" value={familyData().emergencyContact || ""} placeholder="Jane Doe" />
              <wa-input label="Emergency Phone" id="emergencyPhone" name="emergencyPhone" type="tel" value={familyData().emergencyPhone || ""} placeholder="(555) 123-4567" />
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

            <wa-textarea label="Notes" id="notes" name="notes" rows={4} value={familyData().notes || ""} placeholder="Any additional information about the family..." />

            <Show when={submission.result}>
              <wa-callout variant="danger">{submission.result!.message}</wa-callout>
            </Show>

            <div class="wa-cluster wa-gap-s" style={{ "justify-content": "flex-end" }}>
              <wa-button href={`/families/${params.id}`} appearance="outlined">
                Cancel
              </wa-button>
              <wa-button type="submit" variant="brand" appearance="filled" disabled={submission.pending || undefined}>
                {submission.pending ? "Saving..." : "Save Changes"}
              </wa-button>
            </div>
          </form>
          </wa-card>
        )}
      </Show>
    </PageContent>
  );
}
