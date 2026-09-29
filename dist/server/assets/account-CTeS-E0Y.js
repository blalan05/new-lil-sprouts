import { Ct as updatePassword, Tt as useSubmission, _t as getDefaultPianoLessonRate, gt as getDefaultHourlyRate, vt as setSetting, wt as updateUser, xt as getUser } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, memo, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { Show, createEffect, createSignal } from "solid-js";
//#region src/routes/account.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<div",
	" style=\"",
	"\" class=\"wa-color-text-quiet\">Loading account information...</div>"
];
var _tmpl$2 = [
	"<wa-callout",
	"",
	">",
	"</wa-callout>"
];
var _tmpl$3 = [
	"<wa-card",
	"><div class=\"wa-stack wa-gap-m\"><h2 class=\"wa-heading-l\">Business Settings</h2><form",
	" method=\"post\" class=\"wa-stack wa-gap-m\"><input type=\"hidden\" name=\"key\" value=\"defaultHourlyRate\"><input type=\"hidden\" name=\"type\" value=\"number\"><wa-input label=\"Default Hourly Rate (per child)\" name=\"value\" type=\"number\" step=\"0.01\" min=\"0\"",
	" placeholder=\"0.00\" hint=\"This default rate will be used when creating sessions if no specific rate is provided. The rate is per child per hour.\"></wa-input><wa-button type=\"submit\" variant=\"brand\" appearance=\"filled\">Save Settings</wa-button></form><form",
	" method=\"post\" class=\"wa-stack wa-gap-m\"><input type=\"hidden\" name=\"key\" value=\"defaultPianoLessonRate\"><input type=\"hidden\" name=\"type\" value=\"number\"><input type=\"hidden\" name=\"value\"",
	"><wa-input label=\"Default Piano Lesson Rate\" type=\"number\" step=\"0.01\" min=\"0\"",
	" placeholder=\"0.00\"></wa-input><wa-button type=\"submit\" variant=\"brand\" appearance=\"filled\">Save Piano Lesson Rate</wa-button></form><!--$-->",
	"<!--/--></div></wa-card>"
];
var _tmpl$4 = [
	"<div",
	" class=\"wa-stack wa-gap-l\"><wa-card><div class=\"wa-stack wa-gap-m\"><h2 class=\"wa-heading-l\">Profile Information</h2><form",
	" method=\"post\" class=\"wa-stack wa-gap-m\"><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"First Name\" name=\"firstName\"",
	" placeholder=\"John\"></wa-input><wa-input label=\"Last Name\" name=\"lastName\"",
	" placeholder=\"Doe\"></wa-input></div><wa-input label=\"Email *\" name=\"email\" type=\"email\" required",
	" placeholder=\"john@example.com\"></wa-input><wa-input label=\"Phone\" name=\"phone\" type=\"tel\"",
	" placeholder=\"(555) 123-4567\"></wa-input><!--$-->",
	"<!--/--><wa-input label=\"Username\"",
	" disabled hint=\"Username cannot be changed\"></wa-input><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button type=\"submit\" variant=\"brand\" appearance=\"filled\"",
	">",
	"</wa-button></div></form></div></wa-card><wa-card><div class=\"wa-stack wa-gap-m\"><h2 class=\"wa-heading-l\">Change Password</h2><form",
	" method=\"post\" class=\"wa-stack wa-gap-m\"><wa-input label=\"Current Password *\" name=\"currentPassword\" type=\"password\" required placeholder=\"Enter current password\" password-toggle></wa-input><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"New Password *\" name=\"newPassword\" type=\"password\" required placeholder=\"Enter new password\" password-toggle hint=\"Must be at least 6 characters\"></wa-input><wa-input label=\"Confirm New Password *\" name=\"confirmPassword\" type=\"password\" required placeholder=\"Confirm new password\" password-toggle></wa-input></div><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button type=\"submit\" variant=\"success\" appearance=\"filled\"",
	">",
	"</wa-button></div></form></div></wa-card></div>"
];
function AccountPage() {
	const user = createMemo(() => getUser());
	const updateSubmission = useSubmission(updateUser);
	const passwordSubmission = useSubmission(updatePassword);
	const settingSubmission = useSubmission(setSetting);
	const defaultHourlyRate = createMemo(() => getDefaultHourlyRate());
	const defaultPianoLessonRate = createMemo(() => getDefaultPianoLessonRate());
	const [hourlyRateValue, setHourlyRateValue] = createSignal("");
	const [pianoLessonRateValue, setPianoLessonRateValue] = createSignal("");
	createEffect(() => {
		const rate = defaultHourlyRate();
		if (rate !== null && rate !== void 0) setHourlyRateValue(rate.toString());
	});
	createEffect(() => {
		const rate = defaultPianoLessonRate();
		if (rate !== null && rate !== void 0) setPianoLessonRateValue(rate.toString());
	});
	return PageContent({ get children() {
		return [PageHeader({
			title: "Account Settings",
			description: "Manage your account information and password"
		}), Show({
			get when() {
				return user();
			},
			get fallback() {
				var _v$ = ssrHydrationKey();
				return ssr(_tmpl$, _v$, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "var(--wa-space-2xl)"));
			},
			children: (userData) => {
				var _v$11, _v$12, _v$13, _v$7, _v$8, _v$10, _v$14, _v$9, _v$17, _v$18, _v$19, _v$23, _v$24, _v$25, _v$2, _g$, _v$15, _v$16, _v$20, _v$21, _v$22, _v$26, _v$27, _v$28;
				return _v$2 = ssrHydrationKey(), _g$ = ssrGroup(() => {
					return [
						ssrAttribute("value", escape(userData().firstName || "", true)),
						ssrAttribute("value", escape(userData().lastName || "", true)),
						ssrAttribute("value", escape(userData().email, true)),
						ssrAttribute("value", escape(userData().phone || "", true))
					];
				}, 4), _v$15 = escape(Show({
					get when() {
						return userData().isOwner;
					},
					get children() {
						return _v$7 = ssrHydrationKey(), _v$8 = () => {
							return ssrAttribute("value", escape(hourlyRateValue(), true));
						}, _v$10 = () => {
							return ssrAttribute("value", escape(pianoLessonRateValue(), true));
						}, _v$14 = escape(Show({
							get when() {
								return settingSubmission.result;
							},
							get children() {
								return _v$11 = ssrHydrationKey(), _v$12 = () => {
									return ssrAttribute("variant", settingSubmission.result instanceof Error ? "danger" : "success");
								}, _v$13 = (() => {
									var _c$ = memo(() => {
										return settingSubmission.result instanceof Error;
									});
									return () => {
										return _c$() ? escape(settingSubmission.result.message) : "Settings saved successfully";
									};
								})(), ssr(_tmpl$2, _v$11, _v$12, _v$13);
							}
						})), _v$9 = () => {
							return ssrAttribute("value", escape(pianoLessonRateValue(), true));
						}, ssr(_tmpl$3, _v$7, ssrAttribute("action", escape(setSetting, true)), _v$8, ssrAttribute("action", escape(setSetting, true)), _v$9, _v$10, _v$14);
					}
				})), _v$16 = () => {
					return ssrAttribute("value", escape(userData().username, true));
				}, _v$20 = escape(Show({
					get when() {
						return updateSubmission.result;
					},
					get children() {
						return _v$17 = ssrHydrationKey(), _v$18 = () => {
							return ssrAttribute("variant", updateSubmission.result instanceof Error ? "danger" : "success");
						}, _v$19 = (() => {
							var _c$2 = memo(() => {
								return updateSubmission.result instanceof Error;
							});
							return () => {
								return _c$2() ? escape(updateSubmission.result.message) : "Profile updated successfully!";
							};
						})(), ssr(_tmpl$2, _v$17, _v$18, _v$19);
					}
				})), _v$21 = () => {
					return ssrAttribute("disabled", escape(updateSubmission.pending || void 0, true));
				}, _v$22 = () => {
					return updateSubmission.pending ? "Saving..." : "Save Changes";
				}, _v$26 = escape(Show({
					get when() {
						return passwordSubmission.result;
					},
					get children() {
						return _v$23 = ssrHydrationKey(), _v$24 = () => {
							return ssrAttribute("variant", passwordSubmission.result instanceof Error ? "danger" : "success");
						}, _v$25 = (() => {
							var _c$3 = memo(() => {
								return passwordSubmission.result instanceof Error;
							});
							return () => {
								return _c$3() ? escape(passwordSubmission.result.message) : "Password updated successfully!";
							};
						})(), ssr(_tmpl$2, _v$23, _v$24, _v$25);
					}
				})), _v$27 = () => {
					return ssrAttribute("disabled", escape(passwordSubmission.pending || void 0, true));
				}, _v$28 = () => {
					return passwordSubmission.pending ? "Updating..." : "Update Password";
				}, ssr(_tmpl$4, _v$2, ssrAttribute("action", escape(updateUser, true)), ssrStyleProperty("--min-column-size:", "200px"), _g$, _g$, _g$, _g$, _v$15, _v$16, _v$20, ssrStyleProperty("justify-content:", "flex-end"), _v$21, _v$22, ssrAttribute("action", escape(updatePassword, true)), ssrStyleProperty("--min-column-size:", "200px"), _v$26, ssrStyleProperty("justify-content:", "flex-end"), _v$27, _v$28);
			}
		})];
	} });
}
//#endregion
export { AccountPage as default };
