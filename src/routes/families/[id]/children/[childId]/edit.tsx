import { createAsync, type RouteDefinition, useParams, useSubmission } from "@solidjs/router";
import { Show } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { getChild, updateChild } from "~/lib/children";

export const route = {
  preload({ params }) {
    if (params.childId) {
      getChild(params.childId);
    }
  },
} satisfies RouteDefinition;

export default function EditChild() {
  const params = useParams();
  const child = createAsync(() => getChild(params.childId!));
  const submission = useSubmission(updateChild);

  const formatDateForInput = (date: Date | string) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    <PageContent>
      <wa-button href={`/families/${params.id}/children/${params.childId}`} appearance="plain" size="small">
        ← Back to Child Details
      </wa-button>
      <PageHeader title="Edit Child" />

      <Show when={child()}>
        {(childData) => (
          <wa-card>
            <form action={updateChild} method="post" class="wa-stack wa-gap-l">
              <input type="hidden" name="id" value={childData().id} />
              <input type="hidden" name="familyId" value={childData().familyId} />

              <fieldset class="wa-stack wa-gap-m" style={{ border: "1px solid var(--wa-color-neutral-90)", "border-radius": "var(--wa-border-radius-m)", padding: "var(--wa-space-m)", margin: 0 }}>
                <legend class="wa-heading-s">Basic Information</legend>
                <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
                  <wa-input label="First Name *" name="firstName" required value={childData().firstName} placeholder="Emma" />
                  <wa-input label="Last Name *" name="lastName" required value={childData().lastName} placeholder="Smith" />
                </div>
                <wa-input
                  label="Date of Birth *"
                  name="dateOfBirth"
                  type="date"
                  required
                  value={formatDateForInput(childData().dateOfBirth)}
                />
                <wa-select label="Gender" name="gender" value={childData().gender || ""}>
                  <wa-option value="">Select gender...</wa-option>
                  <wa-option value="MALE">Male</wa-option>
                  <wa-option value="FEMALE">Female</wa-option>
                  <wa-option value="OTHER">Other</wa-option>
                  <wa-option value="PREFER_NOT_TO_SAY">Prefer not to say</wa-option>
                </wa-select>
              </fieldset>

              <fieldset class="wa-stack wa-gap-m" style={{ border: "1px solid var(--wa-color-neutral-90)", "border-radius": "var(--wa-border-radius-m)", padding: "var(--wa-space-m)", margin: 0 }}>
                <legend class="wa-heading-s">School Information</legend>
                <wa-input label="School Name" name="schoolName" value={childData().schoolName || ""} placeholder="Lincoln Elementary School" />
                <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
                  <wa-input label="Grade" name="schoolGrade" value={childData().schoolGrade || ""} placeholder="3rd Grade" />
                  <wa-input label="Teacher Name" name="schoolTeacher" value={childData().schoolTeacher || ""} placeholder="Ms. Johnson" />
                </div>
              </fieldset>

              <fieldset class="wa-stack wa-gap-m" style={{ border: "1px solid var(--wa-color-neutral-90)", "border-radius": "var(--wa-border-radius-m)", padding: "var(--wa-space-m)", margin: 0 }}>
                <legend class="wa-heading-s">Medical Information</legend>
                <wa-textarea label="Allergies" name="allergies" rows={2} value={childData().allergies || ""} placeholder="Peanuts, tree nuts, dairy, etc." hint="List any known allergies" />
                <wa-textarea label="Medications" name="medications" rows={2} value={childData().medications || ""} placeholder="List any regular medications..." />
                <wa-textarea label="Special Needs" name="specialNeeds" rows={2} value={childData().specialNeeds || ""} placeholder="Any special needs or accommodations..." />
              </fieldset>

              <wa-textarea label="Additional Notes" name="notes" rows={4} value={childData().notes || ""} placeholder="Any additional information about the child..." />

              <Show when={submission.result}>
                <wa-callout variant="danger">{submission.result!.message}</wa-callout>
              </Show>

              <div class="wa-cluster wa-gap-s" style={{ "justify-content": "flex-end" }}>
                <wa-button href={`/families/${params.id}/children/${params.childId}`} appearance="outlined">
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
