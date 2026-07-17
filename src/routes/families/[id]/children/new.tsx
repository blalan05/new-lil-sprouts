import { useSubmission, useParams } from "@solidjs/router";
import { Show } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { createChild } from "~/lib/children";

export default function NewChild() {
  const params = useParams();
  const submission = useSubmission(createChild);

  return (
    <PageContent>
      <wa-button href={`/families/${params.id}`} appearance="plain" size="small">
        ← Back to Family
      </wa-button>
      <PageHeader title="Add Child" />

      <wa-card>
        <form action={createChild} method="post" class="wa-stack wa-gap-l">
          <input type="hidden" name="familyId" value={params.id} />

          <fieldset class="wa-stack wa-gap-m" style={{ border: "1px solid var(--wa-color-neutral-90)", "border-radius": "var(--wa-border-radius-m)", padding: "var(--wa-space-m)", margin: 0 }}>
            <legend class="wa-heading-s">Basic Information</legend>
            <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
              <wa-input label="First Name *" name="firstName" required placeholder="Emma" />
              <wa-input label="Last Name *" name="lastName" required placeholder="Smith" />
            </div>
            <wa-input label="Date of Birth *" name="dateOfBirth" type="date" required />
            <wa-select label="Gender" name="gender">
              <wa-option value="">Select gender...</wa-option>
              <wa-option value="MALE">Male</wa-option>
              <wa-option value="FEMALE">Female</wa-option>
              <wa-option value="OTHER">Other</wa-option>
              <wa-option value="PREFER_NOT_TO_SAY">Prefer not to say</wa-option>
            </wa-select>
          </fieldset>

          <fieldset class="wa-stack wa-gap-m" style={{ border: "1px solid var(--wa-color-neutral-90)", "border-radius": "var(--wa-border-radius-m)", padding: "var(--wa-space-m)", margin: 0 }}>
            <legend class="wa-heading-s">School Information</legend>
            <wa-input label="School Name" name="schoolName" placeholder="Lincoln Elementary School" />
            <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
              <wa-input label="Grade" name="schoolGrade" placeholder="3rd Grade" />
              <wa-input label="Teacher Name" name="schoolTeacher" placeholder="Ms. Johnson" />
            </div>
          </fieldset>

          <fieldset class="wa-stack wa-gap-m" style={{ border: "1px solid var(--wa-color-neutral-90)", "border-radius": "var(--wa-border-radius-m)", padding: "var(--wa-space-m)", margin: 0 }}>
            <legend class="wa-heading-s">Medical Information</legend>
            <wa-textarea
              label="Allergies"
              name="allergies"
              rows={2}
              placeholder="Peanuts, tree nuts, dairy, etc."
              hint="List any known allergies"
            />
            <wa-textarea
              label="Medications"
              name="medications"
              rows={2}
              placeholder="List any regular medications..."
            />
            <wa-textarea
              label="Special Needs"
              name="specialNeeds"
              rows={2}
              placeholder="Any special needs or accommodations..."
            />
          </fieldset>

          <wa-textarea
            label="Additional Notes"
            name="notes"
            rows={4}
            placeholder="Any additional information about the child..."
          />

          <Show when={submission.result}>
            <wa-callout variant="danger">{submission.result!.message}</wa-callout>
          </Show>

          <div class="wa-cluster wa-gap-s" style={{ "justify-content": "flex-end" }}>
            <wa-button href={`/families/${params.id}`} appearance="outlined">
              Cancel
            </wa-button>
            <wa-button
              type="submit"
              variant="success"
              appearance="filled"
              disabled={submission.pending || undefined}
            >
              {submission.pending ? "Adding..." : "Add Child"}
            </wa-button>
          </div>
        </form>
      </wa-card>
    </PageContent>
  );
}
