import { useSubmission, useParams } from "@solidjs/router";
import { Show } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { createFamilyMember } from "~/lib/family-members";

export default function NewFamilyMember() {
  const params = useParams();
  const submission = useSubmission(createFamilyMember);

  return (
    <PageContent>
      <wa-button href={`/families/${params.id}`} appearance="plain" size="small">
        ← Back to Family
      </wa-button>
      <PageHeader title="Add Family Member" />

      <wa-card>
        <form action={createFamilyMember} method="post" class="wa-stack wa-gap-m">
          <input type="hidden" name="familyId" value={params.id} />

          <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
            <wa-input label="First Name *" name="firstName" required placeholder="Jane" />
            <wa-input label="Last Name *" name="lastName" required placeholder="Doe" />
          </div>

          <wa-select label="Relationship *" name="relationship" required>
            <wa-option value="">Select relationship...</wa-option>
            <wa-option value="PARENT">Parent</wa-option>
            <wa-option value="GRANDPARENT">Grandparent</wa-option>
            <wa-option value="AUNT_UNCLE">Aunt/Uncle</wa-option>
            <wa-option value="SIBLING">Sibling</wa-option>
            <wa-option value="BABYSITTER">Babysitter</wa-option>
            <wa-option value="NANNY">Nanny</wa-option>
            <wa-option value="OTHER">Other</wa-option>
          </wa-select>

          <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
            <wa-input
              label="Email"
              name="email"
              type="email"
              placeholder="jane.doe@example.com"
              hint="Required if you want to invite them to the app"
            />
            <wa-input label="Phone" name="phone" type="tel" placeholder="(555) 123-4567" />
          </div>

          <wa-textarea
            label="Allergies"
            name="allergies"
            rows={2}
            placeholder="Any known allergies..."
            hint="Important for caregivers to know about any allergies"
          />

          <wa-checkbox name="canPickup" value="true">
            Authorized to pick up children
          </wa-checkbox>
          <p class="wa-body-s wa-color-text-quiet">
            Check this box if this person is allowed to pick up children from care sessions
          </p>

          <wa-textarea
            label="Notes"
            name="notes"
            rows={4}
            placeholder="Any additional information about this family member..."
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
              variant="brand"
              appearance="filled"
              disabled={submission.pending || undefined}
            >
              {submission.pending ? "Adding..." : "Add Family Member"}
            </wa-button>
          </div>
        </form>
      </wa-card>
    </PageContent>
  );
}
