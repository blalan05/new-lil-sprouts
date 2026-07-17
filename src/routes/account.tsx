import { createAsync, type RouteDefinition, useSubmission } from "@solidjs/router";
import { Show, createSignal, createEffect } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import { getUser, updateUser, updatePassword } from "~/lib";
import { getDefaultHourlyRate, getDefaultPianoLessonRate, setSetting } from "~/lib/settings";

export const route = {
  preload() {
    getUser();
    getDefaultHourlyRate();
    getDefaultPianoLessonRate();
  },
} satisfies RouteDefinition;

export default function AccountPage() {
  const user = createAsync(() => getUser());
  const updateSubmission = useSubmission(updateUser);
  const passwordSubmission = useSubmission(updatePassword);
  const settingSubmission = useSubmission(setSetting);

  const defaultHourlyRate = createAsync(() => getDefaultHourlyRate());
  const defaultPianoLessonRate = createAsync(() => getDefaultPianoLessonRate());
  const [hourlyRateValue, setHourlyRateValue] = createSignal<string>("");
  const [pianoLessonRateValue, setPianoLessonRateValue] = createSignal<string>("");

  createEffect(() => {
    const rate = defaultHourlyRate();
    if (rate !== null && rate !== undefined) {
      setHourlyRateValue(rate.toString());
    }
  });

  createEffect(() => {
    const rate = defaultPianoLessonRate();
    if (rate !== null && rate !== undefined) {
      setPianoLessonRateValue(rate.toString());
    }
  });

  return (
    <PageContent>
      <PageHeader
        title="Account Settings"
        description="Manage your account information and password"
      />

      <Show
        when={user()}
        fallback={
          <div style={{ "text-align": "center", padding: "var(--wa-space-2xl)" }} class="wa-color-text-quiet">
            Loading account information...
          </div>
        }
      >
        {(userData) => (
          <div class="wa-stack wa-gap-l">
            <wa-card>
              <div class="wa-stack wa-gap-m">
                <h2 class="wa-heading-l">Profile Information</h2>
                <form action={updateUser} method="post" class="wa-stack wa-gap-m">
                  <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
                    <wa-input label="First Name" name="firstName" value={userData().firstName || ""} placeholder="John" />
                    <wa-input label="Last Name" name="lastName" value={userData().lastName || ""} placeholder="Doe" />
                  </div>
                  <wa-input label="Email *" name="email" type="email" required value={userData().email} placeholder="john@example.com" />
                  <wa-input label="Phone" name="phone" type="tel" value={userData().phone || ""} placeholder="(555) 123-4567" />

                  <Show when={userData().isOwner}>
                    <wa-card>
                      <div class="wa-stack wa-gap-m">
                        <h2 class="wa-heading-l">Business Settings</h2>
                        <form action={setSetting} method="post" class="wa-stack wa-gap-m">
                          <input type="hidden" name="key" value="defaultHourlyRate" />
                          <input type="hidden" name="type" value="number" />
                          <wa-input
                            label="Default Hourly Rate (per child)"
                            name="value"
                            type="number"
                            step="0.01"
                            min="0"
                            value={hourlyRateValue()}
                            onInput={(e) => setHourlyRateValue((e.currentTarget as HTMLInputElement).value)}
                            placeholder="0.00"
                            hint="This default rate will be used when creating sessions if no specific rate is provided. The rate is per child per hour."
                          />
                          <wa-button type="submit" variant="brand" appearance="filled">
                            Save Settings
                          </wa-button>
                        </form>

                        <form action={setSetting} method="post" class="wa-stack wa-gap-m">
                          <input type="hidden" name="key" value="defaultPianoLessonRate" />
                          <input type="hidden" name="type" value="number" />
                          <input type="hidden" name="value" value={pianoLessonRateValue()} />
                          <wa-input
                            label="Default Piano Lesson Rate"
                            type="number"
                            step="0.01"
                            min="0"
                            value={pianoLessonRateValue()}
                            onInput={(e) => setPianoLessonRateValue((e.currentTarget as HTMLInputElement).value)}
                            placeholder="0.00"
                          />
                          <wa-button type="submit" variant="brand" appearance="filled">
                            Save Piano Lesson Rate
                          </wa-button>
                        </form>

                        <Show when={settingSubmission.result}>
                          <wa-callout variant={settingSubmission.result instanceof Error ? "danger" : "success"}>
                            {settingSubmission.result instanceof Error
                              ? settingSubmission.result.message
                              : "Settings saved successfully"}
                          </wa-callout>
                        </Show>
                      </div>
                    </wa-card>
                  </Show>

                  <wa-input
                    label="Username"
                    value={userData().username}
                    disabled
                    hint="Username cannot be changed"
                  />

                  <Show when={updateSubmission.result}>
                    <wa-callout variant={updateSubmission.result instanceof Error ? "danger" : "success"}>
                      {updateSubmission.result instanceof Error
                        ? updateSubmission.result.message
                        : "Profile updated successfully!"}
                    </wa-callout>
                  </Show>

                  <div class="wa-cluster wa-gap-s" style={{ "justify-content": "flex-end" }}>
                    <wa-button type="submit" variant="brand" appearance="filled" disabled={updateSubmission.pending || undefined}>
                      {updateSubmission.pending ? "Saving..." : "Save Changes"}
                    </wa-button>
                  </div>
                </form>
              </div>
            </wa-card>

            <wa-card>
              <div class="wa-stack wa-gap-m">
                <h2 class="wa-heading-l">Change Password</h2>
                <form action={updatePassword} method="post" class="wa-stack wa-gap-m">
                  <wa-input label="Current Password *" name="currentPassword" type="password" required placeholder="Enter current password" password-toggle />
                  <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "200px" }}>
                    <wa-input label="New Password *" name="newPassword" type="password" required placeholder="Enter new password" password-toggle hint="Must be at least 6 characters" />
                    <wa-input label="Confirm New Password *" name="confirmPassword" type="password" required placeholder="Confirm new password" password-toggle />
                  </div>

                  <Show when={passwordSubmission.result}>
                    <wa-callout variant={passwordSubmission.result instanceof Error ? "danger" : "success"}>
                      {passwordSubmission.result instanceof Error
                        ? passwordSubmission.result.message
                        : "Password updated successfully!"}
                    </wa-callout>
                  </Show>

                  <div class="wa-cluster wa-gap-s" style={{ "justify-content": "flex-end" }}>
                    <wa-button type="submit" variant="success" appearance="filled" disabled={passwordSubmission.pending || undefined}>
                      {passwordSubmission.pending ? "Updating..." : "Update Password"}
                    </wa-button>
                  </div>
                </form>
              </div>
            </wa-card>
          </div>
        )}
      </Show>
    </PageContent>
  );
}
