import { createAsync, useSubmission, useParams, type RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { getFamilyMember, updateFamilyMember } from "~/lib/family-members";

export const route = {
  preload({ params }) {
    return getFamilyMember(params.memberId);
  },
} satisfies RouteDefinition;

export default function EditFamilyMember() {
  const params = useParams();
  const member = createAsync(() => getFamilyMember(params.memberId));
  const submission = useSubmission(updateFamilyMember);

  return (
    <PageContent>
      <wa-button href={`/families/${params.id}`} appearance="plain" size="small">
        ← Back to Family
      </wa-button>
      <PageHeader title="Edit Family Member" />

      <Show when={member()} fallback={<p class="wa-color-text-quiet">Loading...</p>}>
        {(m) => (
          <wa-card>
            <form action={updateFamilyMember} method="post" class="wa-stack wa-gap-m">
              <input type="hidden" name="id" value={m().id} />
              <input type="hidden" name="familyId" value={params.id} />

              <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
                <wa-input label="First Name *" name="firstName" required value={m().firstName} />
                <wa-input label="Last Name *" name="lastName" required value={m().lastName} />
              </div>

              <wa-select label="Relationship *" name="relationship" required value={m().relationship}>
                <wa-option value="PARENT">Parent</wa-option>
                <wa-option value="GRANDPARENT">Grandparent</wa-option>
                <wa-option value="AUNT_UNCLE">Aunt/Uncle</wa-option>
                <wa-option value="SIBLING">Sibling</wa-option>
                <wa-option value="BABYSITTER">Babysitter</wa-option>
                <wa-option value="NANNY">Nanny</wa-option>
                <wa-option value="OTHER">Other</wa-option>
              </wa-select>

              <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
                <wa-input label="Email" name="email" type="email" value={m().email || ""} />
                <wa-input label="Phone" name="phone" type="tel" value={m().phone || ""} />
              </div>

              <wa-textarea label="Allergies" name="allergies" rows={2} value={m().allergies || ""} />

              <wa-checkbox name="canPickup" value="true" checked={m().canPickup || undefined}>
                Authorized to pick up children
              </wa-checkbox>

              <wa-textarea label="Notes" name="notes" rows={4} value={m().notes || ""} />

              <Show when={submission.result instanceof Error}>
                <wa-callout variant="danger">{(submission.result as Error).message}</wa-callout>
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
