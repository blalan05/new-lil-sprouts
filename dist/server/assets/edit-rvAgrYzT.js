import { w as useParams } from "./action-6MWjotYm.js";
import { I as getChildren, Tt as useSubmission, ht as utcToDatetimeLocal, it as getCareSession, rt as editCareSessionFull } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, memo, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show } from "solid-js";
//#region src/routes/families/[id]/sessions/[sessionId]/edit.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<wa-button",
	" href=\"",
	"\" appearance=\"plain\" size=\"small\">← Back to Session</wa-button>"
];
var _tmpl$2 = [
	"<div",
	" class=\"wa-stack wa-gap-s\"><label class=\"wa-heading-s\">Children (select all that apply)</label><div class=\"wa-stack wa-gap-s\" style=\"",
	"\">",
	"</div></div>"
];
var _tmpl$3 = [
	"<wa-callout",
	" variant=\"danger\">Error: <!--$-->",
	"<!--/--></wa-callout>"
];
var _tmpl$4 = [
	"<wa-card",
	"><form",
	" method=\"post\" class=\"wa-stack wa-gap-m\"><input type=\"hidden\" name=\"sessionId\"",
	"><input type=\"hidden\" name=\"timezoneOffset\"",
	"><wa-input label=\"Scheduled Start Time *\" name=\"scheduledStart\" type=\"datetime-local\" required",
	"></wa-input><wa-input label=\"Scheduled End Time *\" name=\"scheduledEnd\" type=\"datetime-local\" required",
	"></wa-input><wa-select label=\"Status *\" name=\"status\" required",
	"><wa-option value=\"SCHEDULED\">Scheduled</wa-option><wa-option value=\"IN_PROGRESS\">In Progress</wa-option><wa-option value=\"COMPLETED\">Completed</wa-option><wa-option value=\"CANCELLED\">Cancelled</wa-option></wa-select><wa-input label=\"Hourly Rate (optional)\" name=\"hourlyRate\" type=\"number\" step=\"0.01\" min=\"0\"",
	" placeholder=\"Leave empty to use service default\"></wa-input><wa-checkbox name=\"isConfirmed\" value=\"true\"",
	">Session Confirmed</wa-checkbox><!--$-->",
	"<!--/--><wa-textarea label=\"Notes\" name=\"notes\" rows=\"4\"",
	" placeholder=\"Add any notes about this session...\"></wa-textarea><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button href=\"",
	"\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"brand\" appearance=\"filled\"",
	">",
	"</wa-button></div></form></wa-card>"
];
var _tmpl$5 = [
	"<div",
	" style=\"",
	"\" class=\"wa-color-text-quiet\">Loading...</div>"
];
var _tmpl$6 = [
	"<wa-checkbox",
	" name=\"",
	"\"",
	"",
	"><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--></wa-checkbox>"
];
function EditCareSession() {
	var _v$, _v$2, _v$11, _v$12, _v$15, _v$16, _v$3, _g$2, _v$13, _v$14, _v$17, _g$, _v$20, _v$4, _v$5;
	const params = useParams();
	const session = createMemo(() => getCareSession(params.sessionId));
	const children = createMemo(() => getChildren(params.id));
	const editSubmission = useSubmission(editCareSessionFull);
	const isChildSelected = (childId) => {
		return session()?.children?.some((c) => c.id === childId) || false;
	};
	return PageContent({ get children() {
		return Show({
			get when() {
				return memo(() => {
					return !!session();
				})() ? children() : session();
			},
			get fallback() {
				var _v$21 = ssrHydrationKey();
				return ssr(_tmpl$5, _v$21, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "var(--wa-space-2xl)"));
			},
			get children() {
				return [
					(_v$ = ssrHydrationKey(), _v$2 = () => {
						return `/families/${escape(params.id, true)}/sessions/${escape(params.sessionId, true)}`;
					}, ssr(_tmpl$, _v$, _v$2)),
					PageHeader({
						title: "Edit Care Session",
						description: "Update session details, times, and assigned children"
					}),
					(_v$3 = ssrHydrationKey(), _g$2 = ssrGroup(() => {
						return [
							ssrAttribute("value", session()?.scheduledStart ? escape(utcToDatetimeLocal(session().scheduledStart), true) : ""),
							ssrAttribute("value", session()?.scheduledEnd ? escape(utcToDatetimeLocal(session().scheduledEnd), true) : ""),
							ssrAttribute("value", escape(session()?.status || "SCHEDULED", true)),
							ssrAttribute("value", escape(session()?.hourlyRate?.toString() || "", true)),
							ssrAttribute("checked", escape(session()?.isConfirmed || void 0, true))
						];
					}, 5), _v$13 = escape(Show({
						get when() {
							return memo(() => {
								return !!children();
							})() ? children().length > 0 : children();
						},
						get children() {
							return _v$11 = ssrHydrationKey(), _v$12 = escape(For({
								get each() {
									return children();
								},
								children: (child) => {
									var _v$22, _g$3, _v$26, _v$27;
									return _v$22 = ssrHydrationKey(), _g$3 = ssrGroup(() => {
										return [
											`child_${escape(child.id, true)}`,
											ssrAttribute("value", escape(child.id, true)),
											ssrAttribute("checked", escape(isChildSelected(child.id) || void 0, true))
										];
									}, 3), _v$26 = () => {
										return escape(child.firstName);
									}, _v$27 = () => {
										return escape(child.lastName);
									}, ssr(_tmpl$6, _v$22, _g$3, _g$3, _g$3, _v$26, _v$27);
								}
							})), ssr(_tmpl$2, _v$11, ssrStyleProperty("padding:", "var(--wa-space-m)") + ssrStyleProperty(";background-color:", "var(--wa-color-neutral-95)") + ssrStyleProperty(";border-radius:", "var(--wa-border-radius-m)"), _v$12);
						}
					})), _v$14 = () => {
						return ssrAttribute("value", escape(session()?.notes || "", true));
					}, _v$17 = escape(Show({
						get when() {
							return editSubmission.result instanceof Error;
						},
						get children() {
							return _v$15 = ssrHydrationKey(), _v$16 = () => {
								return escape(editSubmission.result.message);
							}, ssr(_tmpl$3, _v$15, _v$16);
						}
					})), _g$ = ssrGroup(() => {
						return [`/families/${escape(params.id, true)}/sessions/${escape(params.sessionId, true)}`, ssrAttribute("disabled", escape(editSubmission.pending || void 0, true))];
					}, 2), _v$20 = () => {
						return editSubmission.pending ? "Saving..." : "Save Changes";
					}, _v$4 = () => {
						return ssrAttribute("value", escape(params.sessionId, true));
					}, _v$5 = () => {
						return ssrAttribute("value", escape((/* @__PURE__ */ new Date()).getTimezoneOffset(), true) * -1);
					}, ssr(_tmpl$4, _v$3, ssrAttribute("action", escape(editCareSessionFull, true)), _v$4, _v$5, _g$2, _g$2, _g$2, _g$2, _g$2, _v$13, _v$14, _v$17, ssrStyleProperty("justify-content:", "flex-end"), _g$, _g$, _v$20))
				];
			}
		});
	} });
}
//#endregion
export { EditCareSession as default };
