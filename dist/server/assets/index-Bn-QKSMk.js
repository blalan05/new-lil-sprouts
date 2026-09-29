import { w as useParams } from "./action-6MWjotYm.js";
import { C as getServices, I as getChildren, Q as getFamily, Tt as useSubmission, X as formatParentNames, a as createCareSchedule, bt as Dialog, c as getCareSchedules, d as updateCareSchedule, dt as formatDateLocal, m as getFamilyMembers, o as deleteCareSchedule, s as generateSessionsFromSchedule, xt as getUser, yt as useConfirm } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { n as formatCaregiverName } from "./display-CkIy29Ue.js";
import { n as SessionStatusBadge, t as PaymentStatusBadge } from "./StatusBadge-Zr2kRO1T.js";
import { t as formatMoneyDisplay } from "./money-display-DvMwur0H.js";
import { escape, memo, scope, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createSignal } from "solid-js";
//#region src/routes/families/[id]/index.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<div",
	"><strong style=\"",
	"\">Phone:</strong><p style=\"",
	"\">",
	"</p></div>"
];
var _tmpl$2 = [
	"<div",
	" style=\"",
	"\"><strong style=\"",
	"\">Address:</strong><p style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></p></div>"
];
var _tmpl$3 = [
	"<div",
	" style=\"",
	"\"><strong style=\"",
	"\">Emergency Contact:</strong><p style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></p></div>"
];
var _tmpl$4 = [
	"<div",
	" style=\"",
	"\"><strong style=\"",
	"\">Notes:</strong><p style=\"",
	"\">",
	"</p></div>"
];
var _tmpl$5 = [
	"<div",
	" style=\"",
	"\">",
	"</div>"
];
var _tmpl$6 = [
	"<div",
	" style=\"",
	"\"><table style=\"",
	"\"><thead style=\"",
	"\"><tr><th style=\"",
	"\">Date/Time</th><th style=\"",
	"\">Children</th><th style=\"",
	"\">Status</th><th style=\"",
	"\">Confirmed</th><th style=\"",
	"\">Actions</th></tr></thead><tbody>",
	"</tbody></table></div>"
];
var _tmpl$7 = [
	"<div",
	" style=\"",
	"\"><table style=\"",
	"\"><thead><tr style=\"",
	"\"><th style=\"",
	"\">Date & Time</th><th style=\"",
	"\">Caregiver</th><th style=\"",
	"\">Children</th><th style=\"",
	"\">Status</th></tr></thead><tbody>",
	"</tbody></table></div>"
];
var _tmpl$8 = [
	"<div",
	" style=\"",
	"\"><table style=\"",
	"\"><thead><tr style=\"",
	"\"><th style=\"",
	"\">Date</th><th style=\"",
	"\">Amount</th><th style=\"",
	"\">Type</th><th style=\"",
	"\">Status</th><th style=\"",
	"\">Invoice #</th></tr></thead><tbody>",
	"</tbody></table></div>"
];
var _tmpl$9 = [
	"<div",
	" class=\"wa-stack wa-gap-l\"><a href=\"/families\" class=\"wa-body-s wa-color-text-quiet\">← Back to Families</a><!--$-->",
	"<!--/--><div style=\"",
	"\"><h2 style=\"",
	"\">Family Information</h2><div style=\"",
	"\"><div><strong style=\"",
	"\">Parents:</strong><p style=\"",
	"\">",
	"</p></div><div><strong style=\"",
	"\">Email:</strong><p style=\"",
	"\">",
	"</p></div><!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><div style=\"",
	"\"><h2 style=\"",
	"\">Children (<!--$-->",
	"<!--/-->)</h2><a href=\"",
	"\" style=\"",
	"\">+ Add Child</a></div><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><div style=\"",
	"\"><h2 style=\"",
	"\">Upcoming Sessions (<!--$-->",
	"<!--/-->)</h2><button style=\"",
	"\">+ New Schedule</button></div><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><div style=\"",
	"\"><h2 style=\"",
	"\">Recurring Schedules (<!--$-->",
	"<!--/-->)</h2><button style=\"",
	"\">+ New Schedule</button></div><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><div style=\"",
	"\"><h2 style=\"",
	"\">Family Members & Contacts (<!--$-->",
	"<!--/-->)</h2><a href=\"",
	"\" style=\"",
	"\">+ Add Member</a></div><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><div style=\"",
	"\"><h2 style=\"",
	"\">Children (<!--$-->",
	"<!--/-->)</h2><a href=\"",
	"\" style=\"",
	"\">+ Add Child</a></div><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><div style=\"",
	"\"><h2 style=\"",
	"\">Recent Care Sessions</h2><a href=\"",
	"\" style=\"",
	"\">+ Schedule Session</a></div><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><div style=\"",
	"\"><h2 style=\"",
	"\">Recent Payments</h2><a href=\"",
	"\" style=\"",
	"\">+ Add Payment</a></div><!--$-->",
	"<!--/--></div></div>"
];
var _tmpl$10 = [
	"<p",
	" style=\"",
	"\">Create login credentials for this family member. No email is sent — you will need to share the username and password with them directly.</p>"
];
var _tmpl$11 = [
	"<form",
	"><input type=\"hidden\" name=\"memberId\"",
	"><div style=\"",
	"\"><label for=\"username\" style=\"",
	"\">Username *</label><input id=\"username\" name=\"username\" type=\"text\" required placeholder=\"username\" style=\"",
	"\"></div><div style=\"",
	"\"><label for=\"password\" style=\"",
	"\">Temporary Password *</label><input id=\"password\" name=\"password\" type=\"text\" required placeholder=\"Create a temporary password\" style=\"",
	"\"><p style=\"",
	"\">Share this password with the family member in person, by text, or email. They should change it after first login.</p></div><div style=\"",
	"\"><button type=\"button\" style=\"",
	"\">Cancel</button><button type=\"submit\" style=\"",
	"\">Create Access</button></div></form>"
];
var _tmpl$12 = [
	"<div",
	"><strong style=\"",
	"\">End Date:</strong><p style=\"",
	"\">",
	"</p></div>"
];
var _tmpl$13 = [
	"<div",
	"><strong style=\"",
	"\">Notes:</strong><p style=\"",
	"\">",
	"</p></div>"
];
var _tmpl$14 = [
	"<div",
	"><div style=\"",
	"\"><div><strong style=\"",
	"\">Service:</strong><p style=\"",
	"\">",
	"</p></div><div><strong style=\"",
	"\">Pattern:</strong><p style=\"",
	"\">",
	"</p></div><div><strong style=\"",
	"\">Days of Week:</strong><p style=\"",
	"\">",
	"</p></div><div><strong style=\"",
	"\">Time:</strong><p style=\"",
	"\"><!--$-->",
	"<!--/--> - <!--$-->",
	"<!--/--></p></div><div><strong style=\"",
	"\">Hourly Rate:</strong><p style=\"",
	"\">",
	"</p></div><div><strong style=\"",
	"\">Children:</strong><p style=\"",
	"\">",
	"</p></div><div><strong style=\"",
	"\">Start Date:</strong><p style=\"",
	"\">",
	"</p></div><!--$-->",
	"<!--/--><div><strong style=\"",
	"\">Status:</strong><p style=\"",
	"\">",
	"</p></div><div><strong style=\"",
	"\">Sessions Generated:</strong><p style=\"",
	"\">",
	"</p></div><!--$-->",
	"<!--/--></div><div class=\"wa-split wa-gap-m wa-align-items-center\"><wa-button variant=\"danger\" appearance=\"filled\">Delete Schedule</wa-button><div class=\"wa-cluster wa-gap-m\"><button style=\"",
	"\">Edit Schedule</button><button style=\"",
	"\">Close</button></div></div></div>"
];
var _tmpl$15 = [
	"<input",
	" type=\"hidden\" name=\"id\"",
	">"
];
var _tmpl$16 = [
	"<div",
	"><form",
	" method=\"post\"><input type=\"hidden\" name=\"familyId\"",
	"><input type=\"hidden\" name=\"timezoneOffset\"",
	"><!--$-->",
	"<!--/--><div style=\"",
	"\"><div><label style=\"",
	"\">Schedule Name *</label><input type=\"text\" name=\"name\"",
	" required placeholder=\"e.g., Regular Mon/Wed Care\" style=\"",
	"\"></div><div><label style=\"",
	"\">Service *</label><select name=\"serviceId\"",
	" required style=\"",
	"\"><option value>Select a service</option><!--$-->",
	"<!--/--></select></div><div><label style=\"",
	"\">Recurrence Pattern *</label><select name=\"recurrence\"",
	" required style=\"",
	"\"><option value=\"ONCE\">One-time</option><option value=\"WEEKLY\">Weekly</option><option value=\"BIWEEKLY\">Bi-weekly</option><option value=\"MONTHLY\">Monthly</option></select></div><div><label style=\"",
	"\">Days of Week *</label><div style=\"",
	"\">",
	"</div></div><div style=\"",
	"\"><div><label style=\"",
	"\">Start Time *</label><input type=\"time\" name=\"startTime\"",
	" required style=\"",
	"\"></div><div><label style=\"",
	"\">End Time *</label><input type=\"time\" name=\"endTime\"",
	" required style=\"",
	"\"></div></div><div><label style=\"",
	"\">Hourly Rate (optional)</label><input type=\"number\" name=\"hourlyRate\"",
	" step=\"0.01\" min=\"0\" placeholder=\"Leave empty for service default\" style=\"",
	"\"></div><div><label style=\"",
	"\">Children</label><div style=\"",
	"\">",
	"</div></div><div style=\"",
	"\"><div><label style=\"",
	"\">Start Date *</label><input type=\"date\" name=\"startDate\"",
	" required style=\"",
	"\"></div><div><label style=\"",
	"\">End Date (optional)</label><input type=\"date\" name=\"endDate\"",
	" style=\"",
	"\"></div></div><div><label style=\"",
	"\"><input type=\"checkbox\" name=\"isActive\" value=\"true\"",
	"><span style=\"",
	"\">Active</span></label></div><div><label style=\"",
	"\">Notes</label><textarea name=\"notes\" rows=\"3\" placeholder=\"Any additional notes...\" style=\"",
	"\">",
	"</textarea></div></div><div style=\"",
	"\"><button type=\"button\" style=\"",
	"\">Cancel</button><button type=\"submit\"",
	" style=\"",
	"\">",
	"</button></div></form></div>"
];
var _tmpl$17 = [
	"<p",
	" style=\"",
	"\">Generate care sessions from this schedule for a specific date range.</p>"
];
var _tmpl$18 = [
	"<form",
	"",
	" method=\"post\"><input type=\"hidden\" name=\"scheduleId\"",
	"><div style=\"",
	"\"><div><label style=\"",
	"\">Start Date *</label><input type=\"date\" name=\"startDate\" required style=\"",
	"\"></div><div><label style=\"",
	"\">End Date *</label><input type=\"date\" name=\"endDate\" required style=\"",
	"\"></div></div><div style=\"",
	"\"><button type=\"button\" style=\"",
	"\">Cancel</button><button type=\"submit\"",
	" style=\"",
	"\">",
	"</button></div></form>"
];
var _tmpl$19 = [
	"<div",
	" style=\"",
	"\">Loading family details...</div>"
];
var _tmpl$20 = [
	"<a",
	" href=\"",
	"\"><wa-button variant=\"brand\" appearance=\"filled\">Edit Family</wa-button></a>"
];
var _tmpl$21 = [
	"<p",
	" style=\"",
	"\">No children added yet. Add children to track their care sessions and information.</p>"
];
var _tmpl$22 = [
	"<span",
	" style=\"",
	"\">⚠️ Allergies</span>"
];
var _tmpl$23 = [
	"<div",
	"><strong style=\"",
	"\">Gender:</strong><span style=\"",
	"\"> <!--$-->",
	"<!--/--></span></div>"
];
var _tmpl$24 = [
	"<div",
	"><strong style=\"",
	"\">School:</strong><span style=\"",
	"\"> <!--$-->",
	"<!--/--></span></div>"
];
var _tmpl$25 = [
	"<div",
	"><strong style=\"",
	"\">Grade:</strong><span style=\"",
	"\"> <!--$-->",
	"<!--/--></span></div>"
];
var _tmpl$26 = [
	"<div",
	" style=\"",
	"\"><strong style=\"",
	"\">Allergies:</strong><span style=\"",
	"\"> <!--$-->",
	"<!--/--></span></div>"
];
var _tmpl$27 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><h3 style=\"",
	"\"><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--></h3><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><div><strong style=\"",
	"\">Age:</strong><span style=\"",
	"\"> <!--$-->",
	"<!--/--> years</span></div><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><a href=\"",
	"\" style=\"",
	"\">View Details</a><a href=\"",
	"\" style=\"",
	"\">Edit</a></div></div></div>"
];
var _tmpl$28 = [
	"<div",
	" style=\"",
	"\"><p style=\"",
	"\">No care sessions scheduled yet. Create one-time or recurring sessions.</p><button style=\"",
	"\">Create First Schedule</button></div>"
];
var _tmpl$29 = [
	"<tr",
	" style=\"",
	"\"><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\"><div style=\"",
	"\"><a href=\"",
	"\" style=\"",
	"\">View</a><a href=\"",
	"\" style=\"",
	"\">Edit</a><wa-button variant=\"danger\" appearance=\"filled\" size=\"small\">Delete</wa-button></div></td></tr>"
];
var _tmpl$30 = [
	"<span",
	" style=\"",
	"\">✓ Confirmed</span>"
];
var _tmpl$31 = [
	"<span",
	" style=\"",
	"\">⚠️ Not Confirmed</span>"
];
var _tmpl$32 = [
	"<p",
	" style=\"",
	"\">No recurring schedules created yet. Create schedules to automatically generate sessions.</p>"
];
var _tmpl$33 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><h3 style=\"",
	"\">",
	"</h3><span style=\"",
	"\">",
	"</span></div><div style=\"",
	"\"><div><strong>Service:</strong> <!--$-->",
	"<!--/--></div><div><strong>Pattern:</strong> <!--$-->",
	"<!--/--></div><div><strong>Days:</strong> <!--$-->",
	"<!--/--></div><div><strong>Time:</strong> <!--$-->",
	"<!--/--> - <!--$-->",
	"<!--/--></div><div><strong>Children:</strong> <!--$-->",
	"<!--/--></div><div><strong>Sessions Generated:</strong> <!--$-->",
	"<!--/--></div></div></div><div style=\"",
	"\"><div style=\"",
	"\"><button style=\"",
	"\">View</button><button style=\"",
	"\">Edit</button></div><button style=\"",
	"\">Generate Sessions</button><form method=\"post\" style=\"",
	"\"><input type=\"hidden\" name=\"id\"",
	"><wa-button type=\"submit\" variant=\"danger\" appearance=\"filled\" size=\"small\">Delete</wa-button></form></div></div></div>"
];
var _tmpl$34 = [
	"<p",
	" style=\"",
	"\">No additional family members added yet. Add grandparents, babysitters, or other authorized contacts.</p>"
];
var _tmpl$35 = [
	"<span",
	" style=\"",
	"\">✓ Pickup Authorized</span>"
];
var _tmpl$36 = [
	"<span",
	" style=\"",
	"\">📱 App Access</span>"
];
var _tmpl$37 = [
	"<div",
	"><strong style=\"",
	"\">Email:</strong> <!--$-->",
	"<!--/--></div>"
];
var _tmpl$38 = [
	"<div",
	"><strong style=\"",
	"\">Phone:</strong> <!--$-->",
	"<!--/--></div>"
];
var _tmpl$39 = [
	"<p",
	" style=\"",
	"\">",
	"</p>"
];
var _tmpl$40 = [
	"<button",
	" style=\"",
	"\">Invite to App</button>"
];
var _tmpl$41 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><h3 style=\"",
	"\"><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--></h3><span style=\"",
	"\">",
	"</span><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><a href=\"",
	"\" style=\"",
	"\">Edit</a><!--$-->",
	"<!--/--><wa-button variant=\"danger\" appearance=\"outlined\">Remove</wa-button></div></div></div>"
];
var _tmpl$42 = [
	"<button",
	" style=\"",
	"\">Revoke Access</button>"
];
var _tmpl$43 = [
	"<p",
	" style=\"",
	"\">No children added yet. Click \"Add Child\" to get started.</p>"
];
var _tmpl$44 = [
	"<p",
	" style=\"",
	"\"><strong style=\"",
	"\">Allergies:</strong> <!--$-->",
	"<!--/--></p>"
];
var _tmpl$45 = [
	"<p",
	" style=\"",
	"\"><strong style=\"",
	"\">Medications:</strong> <!--$-->",
	"<!--/--></p>"
];
var _tmpl$46 = [
	"<p",
	" style=\"",
	"\"><strong style=\"",
	"\">Special Needs:</strong> <!--$-->",
	"<!--/--></p>"
];
var _tmpl$47 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><div><h3 style=\"",
	"\"><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--></h3><p style=\"",
	"\">Born: <!--$-->",
	"<!--/--></p><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div><a href=\"",
	"\" style=\"",
	"\">Edit</a></div></div>"
];
var _tmpl$48 = [
	"<p",
	" style=\"",
	"\">No care sessions scheduled yet.</p>"
];
var _tmpl$49 = [
	"<tr",
	" style=\"",
	"\"><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\"><!--$-->",
	"<!--/--> child(ren)</td><td style=\"",
	"\">",
	"</td></tr>"
];
var _tmpl$50 = [
	"<p",
	" style=\"",
	"\">No payment records yet.</p>"
];
var _tmpl$51 = [
	"<tr",
	" style=\"",
	"\"><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td></tr>"
];
var _tmpl$52 = [
	"<option",
	"",
	">",
	"</option>"
];
var _tmpl$53 = [
	"<label",
	" style=\"",
	"\"><input type=\"checkbox\" name=\"daysOfWeek\"",
	"",
	"><span style=\"",
	"\">",
	"</span></label>"
];
var _tmpl$54 = [
	"<label",
	" style=\"",
	"\"><input type=\"checkbox\" name=\"childIds\"",
	"",
	"><span><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--></span></label>"
];
function FamilyDetailPage() {
	var _v$5, _v$6, _v$8, _v$9, _v$10, _v$11, _v$12, _v$14, _v$15, _v$16, _v$18, _v$19, _v$23, _v$24, _v$27, _v$28, _v$31, _v$32, _v$36, _v$37, _v$41, _v$42, _v$45, _v$46, _v$49, _v$50, _v$, _v$2, _v$3, _v$4, _v$7, _v$13, _v$17, _v$20, _v$21, _v$22, _v$25, _v$26, _v$29, _v$30, _v$33, _v$34, _v$35, _v$38, _v$39, _v$40, _v$43, _v$44, _v$47, _v$48, _v$51, _v$52, _v$53, _v$54, _v$64, _v$65, _v$69, _v$70, _v$55, _v$56, _v$57, _v$58, _v$59, _v$60, _v$61, _v$62, _v$63, _v$66, _v$67, _v$68, _v$71, _v$76, _v$77, _v$72, _v$73, _v$78, _v$81, _v$83, _v$87, _v$91, _g$, _v$94, _v$74, _v$75, _v$79, _v$80, _v$82, _v$84, _v$85, _v$86, _v$88, _v$89, _v$90, _v$95, _v$96, _g$2, _v$100, _v$97;
	const params = useParams();
	const { confirm } = useConfirm();
	const family = createMemo(() => getFamily(params.id));
	const familyMembers = createMemo(() => getFamilyMembers(params.id));
	const schedules = createMemo(() => getCareSchedules(params.id));
	const children = createMemo(() => getChildren(params.id));
	const services = createMemo(() => getServices());
	const caregiver = createMemo(() => getUser());
	const [showInviteModal, setShowInviteModal] = createSignal(null);
	const [showScheduleDialog, setShowScheduleDialog] = createSignal(null);
	const [selectedScheduleId, setSelectedScheduleId] = createSignal(null);
	const [showGenerateDialog, setShowGenerateDialog] = createSignal(false);
	const [generateScheduleId, setGenerateScheduleId] = createSignal(null);
	const createScheduleSubmission = useSubmission(createCareSchedule);
	const updateScheduleSubmission = useSubmission(updateCareSchedule);
	useSubmission(deleteCareSchedule);
	const generateSessionsSubmission = useSubmission(generateSessionsFromSchedule);
	const selectedSchedule = () => {
		if (!selectedScheduleId()) return null;
		return schedules()?.find((s) => s.id === selectedScheduleId());
	};
	const closeScheduleDialog = () => {
		setShowScheduleDialog(null);
		setSelectedScheduleId(null);
	};
	const closeGenerateDialog = () => {
		setShowGenerateDialog(false);
		setGenerateScheduleId(null);
	};
	const scheduleDialogTitle = () => {
		const mode = showScheduleDialog();
		if (mode === "view") return selectedSchedule()?.name ?? "Schedule Details";
		if (mode === "create") return "Create New Schedule";
		if (mode === "edit") return "Edit Schedule";
		return "Schedule";
	};
	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
	};
	const formatDateTime = (date) => {
		return new Date(date).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit"
		});
	};
	const getRelationshipLabel = (rel) => {
		return rel.replace(/_/g, " ").split(" ").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
	};
	return PageContent({ get children() {
		return [
			Show({
				get when() {
					return family();
				},
				get fallback() {
					var _v$101 = ssrHydrationKey();
					return ssr(_tmpl$19, _v$101, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "3rem"));
				},
				get children() {
					return _v$ = ssrHydrationKey(), _v$2 = escape(PageHeader({
						get title() {
							return family().familyName;
						},
						get actions() {
							var _v$102 = ssrHydrationKey(), _v$103 = () => {
								return `/families/${escape(params.id, true)}/edit`;
							};
							return ssr(_tmpl$20, _v$102, _v$103);
						}
					})), _v$3 = scope((() => {
						var _c$ = memo(() => {
							return !!family();
						});
						return () => {
							return _c$() ? escape(formatParentNames(family().parentFirstName, family().parentLastName, family().familyMembers)) : escape(family());
						};
					})()), _v$4 = () => {
						return escape(family()?.email);
					}, _v$7 = escape(Show({
						get when() {
							return family()?.phone;
						},
						get children() {
							return _v$5 = ssrHydrationKey(), _v$6 = () => {
								return escape(family()?.phone);
							}, ssr(_tmpl$, _v$5, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$6);
						}
					})), _v$13 = escape(Show({
						get when() {
							return family()?.address;
						},
						get children() {
							return _v$8 = ssrHydrationKey(), _v$9 = () => {
								return escape(family()?.address);
							}, _v$10 = (() => {
								var _c$2 = memo(() => {
									return !!family()?.city;
								});
								return () => {
									return _c$2() ? `, ${escape(family()?.city)}` : escape(family()?.city);
								};
							})(), _v$11 = (() => {
								var _c$3 = memo(() => {
									return !!family()?.state;
								});
								return () => {
									return _c$3() ? `, ${escape(family()?.state)}` : escape(family()?.state);
								};
							})(), _v$12 = (() => {
								var _c$4 = memo(() => {
									return !!family()?.zipCode;
								});
								return () => {
									return _c$4() ? ` ${escape(family()?.zipCode)}` : escape(family()?.zipCode);
								};
							})(), ssr(_tmpl$2, _v$8, ssrStyleProperty("margin-top:", "1rem"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$9, _v$10, _v$11, _v$12);
						}
					})), _v$17 = escape(Show({
						get when() {
							return family()?.emergencyContact || family()?.emergencyPhone;
						},
						get children() {
							return _v$14 = ssrHydrationKey(), _v$15 = () => {
								return escape(family()?.emergencyContact);
							}, _v$16 = (() => {
								var _c$5 = memo(() => {
									return !!family()?.emergencyPhone;
								});
								return () => {
									return _c$5() ? ` - ${escape(family()?.emergencyPhone)}` : escape(family()?.emergencyPhone);
								};
							})(), ssr(_tmpl$3, _v$14, ssrStyleProperty("margin-top:", "1rem"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$15, _v$16);
						}
					})), _v$20 = escape(Show({
						get when() {
							return family()?.notes;
						},
						get children() {
							return _v$18 = ssrHydrationKey(), _v$19 = () => {
								return escape(family()?.notes);
							}, ssr(_tmpl$4, _v$18, ssrStyleProperty("margin-top:", "1rem"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$19);
						}
					})), _v$21 = () => {
						return escape(family()?.children?.length || 0);
					}, _v$22 = () => {
						return `/families/${escape(params.id, true)}/children/new`;
					}, _v$25 = escape(Show({
						get when() {
							return family()?.children?.length;
						},
						get fallback() {
							var _v$104 = ssrHydrationKey();
							return ssr(_tmpl$21, _v$104, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";padding:", "2rem"));
						},
						get children() {
							return _v$23 = ssrHydrationKey(), _v$24 = escape(For({
								get each() {
									return family()?.children;
								},
								children: (child) => {
									var _v$108, _v$111, _v$112, _v$114, _v$115, _v$117, _v$118, _v$120, _v$121, _v$105, _v$106, _v$107, _v$109, _v$110, _v$113, _v$116, _v$119, _v$122, _v$123, _v$124;
									return _v$105 = ssrHydrationKey(), _v$106 = () => {
										return escape(child.firstName);
									}, _v$107 = () => {
										return escape(child.lastName);
									}, _v$109 = escape(Show({
										get when() {
											return child.allergies;
										},
										get children() {
											return _v$108 = ssrHydrationKey(), ssr(_tmpl$22, _v$108, ssrStyleProperty("padding:", "0.25rem 0.5rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "var(--wa-color-danger-fill-normal)") + ssrStyleProperty(";color:", "#c53030") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", "600"));
										}
									})), _v$110 = () => {
										return escape((/* @__PURE__ */ new Date()).getFullYear()) - escape(new Date(child.dateOfBirth).getFullYear());
									}, _v$113 = escape(Show({
										get when() {
											return child.gender;
										},
										get children() {
											return _v$111 = ssrHydrationKey(), _v$112 = () => {
												return escape(child.gender?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()));
											}, ssr(_tmpl$23, _v$111, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("color:", "var(--color-text-muted)"), _v$112);
										}
									})), _v$116 = escape(Show({
										get when() {
											return child.schoolName;
										},
										get children() {
											return _v$114 = ssrHydrationKey(), _v$115 = () => {
												return escape(child.schoolName);
											}, ssr(_tmpl$24, _v$114, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("color:", "var(--color-text-muted)"), _v$115);
										}
									})), _v$119 = escape(Show({
										get when() {
											return child.schoolGrade;
										},
										get children() {
											return _v$117 = ssrHydrationKey(), _v$118 = () => {
												return escape(child.schoolGrade);
											}, ssr(_tmpl$25, _v$117, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("color:", "var(--color-text-muted)"), _v$118);
										}
									})), _v$122 = escape(Show({
										get when() {
											return child.allergies;
										},
										get children() {
											return _v$120 = ssrHydrationKey(), _v$121 = () => {
												return escape(child.allergies);
											}, ssr(_tmpl$26, _v$120, ssrStyleProperty("margin-top:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("color:", "#c53030"), ssrStyleProperty("color:", "#c53030"), _v$121);
										}
									})), _v$123 = () => {
										return `/families/${escape(params.id, true)}/children/${escape(child.id, true)}`;
									}, _v$124 = () => {
										return `/families/${escape(params.id, true)}/children/${escape(child.id, true)}/edit`;
									}, ssr(_tmpl$27, _v$105, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between"), ssrStyleProperty("flex:", "1"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";margin-bottom:", "0.5rem"), ssrStyleProperty("color:", "var(--color-text)") + ssrStyleProperty(";margin:", "0"), _v$106, _v$107, _v$109, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(200px, 1fr))") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("color:", "var(--color-text-muted)"), _v$110, _v$113, _v$116, _v$119, _v$122, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";margin-left:", "1rem"), _v$123, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#4299e1") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";text-align:", "center"), _v$124, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "var(--color-hover)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";text-align:", "center"));
								}
							})), ssr(_tmpl$5, _v$23, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";gap:", "1rem"), _v$24);
						}
					})), _v$26 = () => {
						return escape(family()?.careSessions?.length || 0);
					}, _v$29 = escape(Show({
						get when() {
							return family()?.careSessions?.length;
						},
						get fallback() {
							var _v$125 = ssrHydrationKey();
							return ssr(_tmpl$28, _v$125, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "2rem"), ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("padding:", "0.75rem 1.5rem") + ssrStyleProperty(";background-color:", "#805ad5") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";display:", "inline-block"));
						},
						get children() {
							return _v$27 = ssrHydrationKey(), _v$28 = escape(For({
								get each() {
									return family()?.careSessions;
								},
								children: (session) => {
									var _v$126, _v$127, _v$128, _v$129, _v$130, _v$131, _v$132;
									return _v$126 = ssrHydrationKey(), _v$127 = scope(() => {
										return escape(formatDateTime(session.scheduledStart));
									}), _v$128 = () => {
										return escape(session.children?.map((c) => c.firstName).join(", ") || "N/A");
									}, _v$129 = escape(SessionStatusBadge({ get status() {
										return session.status;
									} })), _v$130 = scope((() => {
										var _c$10 = memo(() => {
											return !!session.isConfirmed;
										});
										return () => {
											var _v$133, _v$134;
											return _c$10() ? (_v$133 = ssrHydrationKey(), ssr(_tmpl$30, _v$133, ssrStyleProperty("color:", "#48bb78"))) : (_v$134 = ssrHydrationKey(), ssr(_tmpl$31, _v$134, ssrStyleProperty("color:", "#ed8936")));
										};
									})()), _v$131 = () => {
										return `/families/${escape(params.id, true)}/sessions/${escape(session.id, true)}`;
									}, _v$132 = () => {
										return `/families/${escape(params.id, true)}/sessions/${escape(session.id, true)}/edit`;
									}, ssr(_tmpl$29, _v$126, ssrStyleProperty("border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem"), _v$127, ssrStyleProperty("padding:", "0.75rem"), _v$128, ssrStyleProperty("padding:", "0.75rem"), _v$129, ssrStyleProperty("padding:", "0.75rem"), _v$130, ssrStyleProperty("padding:", "0.75rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "0.5rem"), _v$131, ssrStyleProperty("padding:", "0.25rem 0.75rem") + ssrStyleProperty(";background-color:", "#4299e1") + ssrStyleProperty(";color:", "#fff") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem"), _v$132, ssrStyleProperty("padding:", "0.25rem 0.75rem") + ssrStyleProperty(";background-color:", "#805ad5") + ssrStyleProperty(";color:", "#fff") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem"));
								}
							})), ssr(_tmpl$6, _v$27, ssrStyleProperty("overflow-x:", "auto"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";border-collapse:", "collapse"), ssrStyleProperty("background-color:", "var(--color-surface-muted)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)"), _v$28);
						}
					})), _v$30 = () => {
						return escape(schedules()?.length || 0);
					}, _v$33 = escape(Show({
						get when() {
							return schedules()?.length;
						},
						get fallback() {
							var _v$135 = ssrHydrationKey();
							return ssr(_tmpl$32, _v$135, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";padding:", "2rem"));
						},
						get children() {
							return _v$31 = ssrHydrationKey(), _v$32 = escape(For({
								get each() {
									return schedules();
								},
								children: (schedule) => {
									var _v$136, _v$137, _v$138, _v$139, _v$140, _v$141, _v$142, _v$143, _v$144, _v$145, _v$146, _v$147;
									return _v$136 = ssrHydrationKey(), _v$137 = () => {
										return escape(schedule.name);
									}, _v$138 = () => {
										return ssrStyleProperty("padding:", "0.25rem 0.5rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", schedule.isActive ? "#c6f6d5" : "var(--wa-color-danger-fill-normal)") + ssrStyleProperty(";color:", schedule.isActive ? "#276749" : "#c53030") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", "600");
									}, _v$139 = () => {
										return schedule.isActive ? "Active" : "Inactive";
									}, _v$140 = () => {
										return escape(schedule.service.name);
									}, _v$141 = () => {
										return escape(schedule.recurrence);
									}, _v$142 = scope(() => {
										return escape(schedule.daysOfWeek.join(", "));
									}), _v$143 = () => {
										return escape(schedule.startTime);
									}, _v$144 = () => {
										return escape(schedule.endTime);
									}, _v$145 = () => {
										return escape(schedule.children.map((c) => c.firstName).join(", ") || "None");
									}, _v$146 = () => {
										return escape(schedule._count.careSessions);
									}, _v$147 = () => {
										return ssrAttribute("value", escape(schedule.id, true));
									}, ssr(_tmpl$33, _v$136, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "start"), ssrStyleProperty("flex:", 1), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";margin-bottom:", "0.5rem"), ssrStyleProperty("color:", "var(--color-text)") + ssrStyleProperty(";margin:", 0), _v$137, _v$138, _v$139, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$140, _v$141, _v$142, _v$143, _v$144, _v$145, _v$146, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.5rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "0.5rem"), ssrStyleProperty("padding:", "0.25rem 0.75rem") + ssrStyleProperty(";background-color:", "#4299e1") + ssrStyleProperty(";color:", "#fff") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("padding:", "0.25rem 0.75rem") + ssrStyleProperty(";background-color:", "#805ad5") + ssrStyleProperty(";color:", "#fff") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("padding:", "0.25rem 0.75rem") + ssrStyleProperty(";background-color:", "#48bb78") + ssrStyleProperty(";color:", "#fff") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";font-weight:", "600"), ssrStyleProperty("display:", "inline"), _v$147);
								}
							})), ssr(_tmpl$5, _v$31, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";gap:", "1rem"), _v$32);
						}
					})), _v$34 = () => {
						return escape(familyMembers()?.length || 0);
					}, _v$35 = () => {
						return `/families/${escape(params.id, true)}/members/new`;
					}, _v$38 = escape(Show({
						get when() {
							return familyMembers()?.length;
						},
						get fallback() {
							var _v$148 = ssrHydrationKey();
							return ssr(_tmpl$34, _v$148, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";padding:", "2rem"));
						},
						get children() {
							return _v$36 = ssrHydrationKey(), _v$37 = escape(For({
								get each() {
									return familyMembers();
								},
								children: (member) => {
									var _v$153, _v$155, _v$157, _v$158, _v$160, _v$161, _v$163, _v$164, _v$167, _v$149, _v$150, _v$151, _v$152, _v$154, _v$156, _v$159, _v$162, _v$165, _v$166, _v$168;
									return _v$149 = ssrHydrationKey(), _v$150 = () => {
										return escape(member.firstName);
									}, _v$151 = () => {
										return escape(member.lastName);
									}, _v$152 = scope(() => {
										return escape(getRelationshipLabel(member.relationship));
									}), _v$154 = escape(Show({
										get when() {
											return member.canPickup;
										},
										get children() {
											return _v$153 = ssrHydrationKey(), ssr(_tmpl$35, _v$153, ssrStyleProperty("padding:", "0.25rem 0.5rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "#c6f6d5") + ssrStyleProperty(";color:", "#276749") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", "600"));
										}
									})), _v$156 = escape(Show({
										get when() {
											return member.user;
										},
										get children() {
											return _v$155 = ssrHydrationKey(), ssr(_tmpl$36, _v$155, ssrStyleProperty("padding:", "0.25rem 0.5rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "var(--wa-color-brand-fill-normal)") + ssrStyleProperty(";color:", "#2c5282") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", "600"));
										}
									})), _v$159 = escape(Show({
										get when() {
											return member.email;
										},
										get children() {
											return _v$157 = ssrHydrationKey(), _v$158 = () => {
												return escape(member.email);
											}, ssr(_tmpl$37, _v$157, ssrStyleProperty("color:", "var(--color-text)"), _v$158);
										}
									})), _v$162 = escape(Show({
										get when() {
											return member.phone;
										},
										get children() {
											return _v$160 = ssrHydrationKey(), _v$161 = () => {
												return escape(member.phone);
											}, ssr(_tmpl$38, _v$160, ssrStyleProperty("color:", "var(--color-text)"), _v$161);
										}
									})), _v$165 = escape(Show({
										get when() {
											return member.notes;
										},
										get children() {
											return _v$163 = ssrHydrationKey(), _v$164 = () => {
												return escape(member.notes);
											}, ssr(_tmpl$39, _v$163, ssrStyleProperty("margin-top:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$164);
										}
									})), _v$166 = () => {
										return `/families/${escape(params.id, true)}/members/${escape(member.id, true)}/edit`;
									}, _v$168 = escape(Show({
										get when() {
											return memo(() => {
												return !member.user;
											})() && member.email;
										},
										get fallback() {
											var _v$169;
											return Show({
												get when() {
													return member.user;
												},
												get children() {
													return _v$169 = ssrHydrationKey(), ssr(_tmpl$42, _v$169, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#feebc8") + ssrStyleProperty(";color:", "#7c2d12") + ssrStyleProperty(";border:", "1px solid #f6ad55") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-size:", "0.875rem"));
												}
											});
										},
										get children() {
											return _v$167 = ssrHydrationKey(), ssr(_tmpl$40, _v$167, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#c6f6d5") + ssrStyleProperty(";color:", "#276749") + ssrStyleProperty(";border:", "1px solid #9ae6b4") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-size:", "0.875rem"));
										}
									})), ssr(_tmpl$41, _v$149, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "start"), ssrStyleProperty("flex:", 1), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";margin-bottom:", "0.5rem"), ssrStyleProperty("color:", "var(--color-text)") + ssrStyleProperty(";margin:", 0), _v$150, _v$151, ssrStyleProperty("padding:", "0.25rem 0.5rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "#e6fffa") + ssrStyleProperty(";color:", "#234e52") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", "600"), _v$152, _v$154, _v$156, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(200px, 1fr))") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem"), _v$159, _v$162, _v$165, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";margin-left:", "1rem"), _v$166, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "var(--color-hover)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";text-align:", "center"), _v$168);
								}
							})), ssr(_tmpl$5, _v$36, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";gap:", "1rem"), _v$37);
						}
					})), _v$39 = () => {
						return escape(family()?.children?.length || 0);
					}, _v$40 = () => {
						return `/families/${escape(params.id, true)}/children/new`;
					}, _v$43 = escape(Show({
						get when() {
							return family()?.children?.length;
						},
						get fallback() {
							var _v$170 = ssrHydrationKey();
							return ssr(_tmpl$43, _v$170, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";padding:", "2rem"));
						},
						get children() {
							return _v$41 = ssrHydrationKey(), _v$42 = escape(For({
								get each() {
									return family()?.children;
								},
								children: (child) => {
									var _v$175, _v$176, _v$178, _v$179, _v$181, _v$182, _v$171, _v$172, _v$173, _v$174, _v$177, _v$180, _v$183, _v$184;
									return _v$171 = ssrHydrationKey(), _v$172 = () => {
										return escape(child.firstName);
									}, _v$173 = () => {
										return escape(child.lastName);
									}, _v$174 = scope(() => {
										return escape(formatDate(child.dateOfBirth));
									}), _v$177 = escape(Show({
										get when() {
											return child.allergies;
										},
										get children() {
											return _v$175 = ssrHydrationKey(), _v$176 = () => {
												return escape(child.allergies);
											}, ssr(_tmpl$44, _v$175, ssrStyleProperty("margin-top:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("color:", "#c53030"), _v$176);
										}
									})), _v$180 = escape(Show({
										get when() {
											return child.medications;
										},
										get children() {
											return _v$178 = ssrHydrationKey(), _v$179 = () => {
												return escape(child.medications);
											}, ssr(_tmpl$45, _v$178, ssrStyleProperty("margin-top:", "0.25rem") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("color:", "var(--color-text)"), _v$179);
										}
									})), _v$183 = escape(Show({
										get when() {
											return child.specialNeeds;
										},
										get children() {
											return _v$181 = ssrHydrationKey(), _v$182 = () => {
												return escape(child.specialNeeds);
											}, ssr(_tmpl$46, _v$181, ssrStyleProperty("margin-top:", "0.25rem") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("color:", "var(--color-text)"), _v$182);
										}
									})), _v$184 = () => {
										return `/families/${escape(params.id, true)}/children/${escape(child.id, true)}/edit`;
									}, ssr(_tmpl$47, _v$171, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between"), ssrStyleProperty("margin-bottom:", "0.5rem") + ssrStyleProperty(";color:", "var(--color-text)"), _v$172, _v$173, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$174, _v$177, _v$180, _v$183, _v$184, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "var(--color-hover)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";height:", "fit-content"));
								}
							})), ssr(_tmpl$5, _v$41, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";gap:", "1rem"), _v$42);
						}
					})), _v$44 = () => {
						return `/families/${escape(params.id, true)}/schedules/new`;
					}, _v$47 = escape(Show({
						get when() {
							return family()?.careSessions?.length;
						},
						get fallback() {
							var _v$185 = ssrHydrationKey();
							return ssr(_tmpl$48, _v$185, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";padding:", "2rem"));
						},
						get children() {
							return _v$45 = ssrHydrationKey(), _v$46 = escape(For({
								get each() {
									return family()?.careSessions;
								},
								children: (session) => {
									var _v$186, _v$187, _v$188, _v$189, _v$190;
									return _v$186 = ssrHydrationKey(), _v$187 = scope(() => {
										return escape(formatDateTime(session.scheduledStart));
									}), _v$188 = scope((() => {
										var _c$11 = memo(() => {
											return !!caregiver();
										});
										return () => {
											return _c$11() ? escape(formatCaregiverName(caregiver())) : "—";
										};
									})()), _v$189 = () => {
										return escape(session.children.length);
									}, _v$190 = escape(SessionStatusBadge({ get status() {
										return session.status;
									} })), ssr(_tmpl$49, _v$186, ssrStyleProperty("border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem"), _v$187, ssrStyleProperty("padding:", "0.75rem"), _v$188, ssrStyleProperty("padding:", "0.75rem"), _v$189, ssrStyleProperty("padding:", "0.75rem"), _v$190);
								}
							})), ssr(_tmpl$7, _v$45, ssrStyleProperty("overflow-x:", "auto"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";border-collapse:", "collapse"), ssrStyleProperty("background-color:", "var(--color-surface-muted)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)"), _v$46);
						}
					})), _v$48 = () => {
						return `/payments?familyId=${escape(params.id, true)}&amp;record=1`;
					}, _v$51 = escape(Show({
						get when() {
							return family()?.payments?.length;
						},
						get fallback() {
							var _v$191 = ssrHydrationKey();
							return ssr(_tmpl$50, _v$191, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";padding:", "2rem"));
						},
						get children() {
							return _v$49 = ssrHydrationKey(), _v$50 = escape(For({
								get each() {
									return family()?.payments;
								},
								children: (payment) => {
									var _v$192, _v$193, _v$194, _v$195, _v$196, _v$197;
									return _v$192 = ssrHydrationKey(), _v$193 = scope(() => {
										return escape(formatDate(payment.createdAt));
									}), _v$194 = scope(() => {
										return escape(formatMoneyDisplay(payment.amount));
									}), _v$195 = () => {
										return escape(payment.method || "N/A");
									}, _v$196 = escape(PaymentStatusBadge({ get status() {
										return payment.status;
									} })), _v$197 = () => {
										return escape(payment.invoiceNumber || "-");
									}, ssr(_tmpl$51, _v$192, ssrStyleProperty("border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem"), _v$193, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";font-weight:", "600"), _v$194, ssrStyleProperty("padding:", "0.75rem"), _v$195, ssrStyleProperty("padding:", "0.75rem"), _v$196, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";font-size:", "0.875rem"), _v$197);
								}
							})), ssr(_tmpl$8, _v$49, ssrStyleProperty("overflow-x:", "auto"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";border-collapse:", "collapse"), ssrStyleProperty("background-color:", "var(--color-surface-muted)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";border-bottom:", "2px solid var(--color-border)"), _v$50);
						}
					})), ssr(_tmpl$9, _v$, _v$2, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";margin-bottom:", "1rem") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(250px, 1fr))") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$3, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$4, _v$7, _v$13, _v$17, _v$20, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";color:", "var(--color-text)"), _v$21, _v$22, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#48bb78") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem"), _v$25, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";color:", "var(--color-text)"), _v$26, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#805ad5") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";font-weight:", "600"), _v$29, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";color:", "var(--color-text)"), _v$30, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#805ad5") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";font-weight:", "600"), _v$33, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";color:", "var(--color-text)"), _v$34, _v$35, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#4299e1") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem"), _v$38, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";color:", "var(--color-text)"), _v$39, _v$40, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#48bb78") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem"), _v$43, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";color:", "var(--color-text)"), _v$44, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#4299e1") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem"), _v$47, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";color:", "var(--color-text)"), _v$48, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#48bb78") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem"), _v$51);
				}
			}),
			Dialog({
				get open() {
					return !!showInviteModal();
				},
				title: "Create App Access",
				onClose: () => setShowInviteModal(null),
				get children() {
					return [(_v$52 = ssrHydrationKey(), ssr(_tmpl$10, _v$52, ssrStyleProperty("margin-bottom:", "1.5rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem"))), (_v$53 = ssrHydrationKey(), _v$54 = () => {
						return ssrAttribute("value", escape(showInviteModal(), true));
					}, ssr(_tmpl$11, _v$53, _v$54, ssrStyleProperty("margin-bottom:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), ssrStyleProperty("margin-bottom:", "1.5rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), ssrStyleProperty("margin-top:", "0.5rem") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";justify-content:", "flex-end"), ssrStyleProperty("padding:", "0.75rem 1.5rem") + ssrStyleProperty(";background-color:", "var(--color-hover)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-weight:", "600"), ssrStyleProperty("padding:", "0.75rem 1.5rem") + ssrStyleProperty(";background-color:", "#48bb78") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-weight:", "600")))];
				}
			}),
			Dialog({
				get open() {
					return !!showScheduleDialog();
				},
				get title() {
					return scheduleDialogTitle();
				},
				maxWidth: "800px",
				onClose: closeScheduleDialog,
				get children() {
					return [Show({
						get when() {
							return memo(() => {
								return showScheduleDialog() === "view";
							})() && selectedSchedule();
						},
						get children() {
							return _v$55 = ssrHydrationKey(), _v$56 = () => {
								return escape(selectedSchedule()?.service.name);
							}, _v$57 = () => {
								return escape(selectedSchedule()?.recurrence);
							}, _v$58 = () => {
								return escape(selectedSchedule()?.daysOfWeek.join(", "));
							}, _v$59 = () => {
								return escape(selectedSchedule()?.startTime);
							}, _v$60 = () => {
								return escape(selectedSchedule()?.endTime);
							}, _v$61 = (() => {
								var _c$6 = memo(() => {
									return !!selectedSchedule()?.hourlyRate;
								});
								return () => {
									return _c$6() ? `$${escape(selectedSchedule()?.hourlyRate)}` : "Service default";
								};
							})(), _v$62 = () => {
								return escape(selectedSchedule()?.children.map((c) => `${c.firstName} ${c.lastName}`).join(", ") || "None");
							}, _v$63 = scope((() => {
								var _c$7 = memo(() => {
									return !!selectedSchedule()?.startDate;
								});
								return () => {
									return _c$7() ? escape(formatDateLocal(selectedSchedule().startDate)) : escape(selectedSchedule()?.startDate);
								};
							})()), _v$66 = escape(Show({
								get when() {
									return selectedSchedule()?.endDate;
								},
								get children() {
									return _v$64 = ssrHydrationKey(), _v$65 = scope((() => {
										var _c$8 = memo(() => {
											return !!selectedSchedule()?.endDate;
										});
										return () => {
											return _c$8() ? escape(formatDateLocal(selectedSchedule().endDate)) : escape(selectedSchedule()?.endDate);
										};
									})()), ssr(_tmpl$12, _v$64, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$65);
								}
							})), _v$67 = () => {
								return selectedSchedule()?.isActive ? "Active" : "Inactive";
							}, _v$68 = () => {
								return escape(selectedSchedule()?._count.careSessions);
							}, _v$71 = escape(Show({
								get when() {
									return selectedSchedule()?.notes;
								},
								get children() {
									return _v$69 = ssrHydrationKey(), _v$70 = () => {
										return escape(selectedSchedule()?.notes);
									}, ssr(_tmpl$13, _v$69, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$70);
								}
							})), ssr(_tmpl$14, _v$55, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";margin-bottom:", "1.5rem"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$56, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$57, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$58, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$59, _v$60, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$61, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$62, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$63, _v$66, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$67, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$68, _v$71, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#805ad5") + ssrStyleProperty(";color:", "#fff") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-weight:", "600"), ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "var(--color-border)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer"));
						}
					}), Show({
						get when() {
							return showScheduleDialog() === "create" || showScheduleDialog() === "edit";
						},
						get children() {
							return _v$72 = ssrHydrationKey(), _v$73 = () => {
								return ssrAttribute("action", showScheduleDialog() === "create" ? escape(createCareSchedule, true) : escape(updateCareSchedule, true));
							}, _v$78 = escape(Show({
								get when() {
									return showScheduleDialog() === "edit";
								},
								get children() {
									return _v$76 = ssrHydrationKey(), _v$77 = () => {
										return ssrAttribute("value", escape(selectedScheduleId(), true));
									}, ssr(_tmpl$15, _v$76, _v$77);
								}
							})), _v$81 = escape(For({
								get each() {
									return services();
								},
								children: (service) => {
									var _v$198, _v$200, _v$199;
									return _v$198 = ssrHydrationKey(), _v$200 = () => {
										return escape(service.name);
									}, _v$199 = () => {
										return ssrAttribute("value", escape(service.id, true));
									}, ssr(_tmpl$52, _v$198, _v$199, _v$200);
								}
							})), _v$83 = escape(For({
								each: [
									"MONDAY",
									"TUESDAY",
									"WEDNESDAY",
									"THURSDAY",
									"FRIDAY",
									"SATURDAY",
									"SUNDAY"
								],
								children: (day) => {
									var _v$201, _v$203, _v$202;
									return _v$201 = ssrHydrationKey(), _v$203 = scope(() => {
										return escape(day.slice(0, 3));
									}), _v$202 = () => {
										return ssrAttribute("checked", escape(selectedSchedule()?.daysOfWeek.includes(day), true));
									}, ssr(_tmpl$53, _v$201, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.25rem"), ssrAttribute("value", escape(day, true)), _v$202, ssrStyleProperty("font-size:", "0.875rem"), _v$203);
								}
							})), _v$87 = escape(For({
								get each() {
									return children();
								},
								children: (child) => {
									var _v$204, _v$207, _v$208, _v$205, _v$206;
									return _v$204 = ssrHydrationKey(), _v$207 = () => {
										return escape(child.firstName);
									}, _v$208 = () => {
										return escape(child.lastName);
									}, _v$205 = () => {
										return ssrAttribute("value", escape(child.id, true));
									}, _v$206 = () => {
										return ssrAttribute("checked", escape(selectedSchedule()?.children.some((c) => c.id === child.id), true));
									}, ssr(_tmpl$54, _v$204, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem"), _v$205, _v$206, _v$207, _v$208);
								}
							})), _v$91 = () => {
								return escape(selectedSchedule()?.notes || "");
							}, _g$ = ssrGroup(() => {
								return [ssrAttribute("disabled", escape(createScheduleSubmission.pending || updateScheduleSubmission.pending, true)), ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#805ad5") + ssrStyleProperty(";color:", "#fff") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", createScheduleSubmission.pending || updateScheduleSubmission.pending ? "not-allowed" : "pointer") + ssrStyleProperty(";opacity:", createScheduleSubmission.pending || updateScheduleSubmission.pending ? "0.6" : "1") + ssrStyleProperty(";font-weight:", "600")];
							}, 2), _v$94 = (() => {
								var _c$9 = memo(() => {
									return !!(createScheduleSubmission.pending || updateScheduleSubmission.pending);
								});
								return () => {
									return _c$9() ? "Saving..." : showScheduleDialog() === "create" ? "Create Schedule" : "Save Changes";
								};
							})(), _v$74 = () => {
								return ssrAttribute("value", escape(params.id, true));
							}, _v$75 = () => {
								return ssrAttribute("value", escape((/* @__PURE__ */ new Date()).getTimezoneOffset(), true) * -1);
							}, _v$79 = () => {
								return ssrAttribute("value", escape(selectedSchedule()?.name || "", true));
							}, _v$80 = () => {
								return ssrAttribute("value", escape(selectedSchedule()?.serviceId || "", true));
							}, _v$82 = () => {
								return ssrAttribute("value", escape(selectedSchedule()?.recurrence || "WEEKLY", true));
							}, _v$84 = () => {
								return ssrAttribute("value", escape(selectedSchedule()?.startTime || "09:00", true));
							}, _v$85 = () => {
								return ssrAttribute("value", escape(selectedSchedule()?.endTime || "17:00", true));
							}, _v$86 = () => {
								return ssrAttribute("value", escape(selectedSchedule()?.hourlyRate || "", true));
							}, _v$88 = () => {
								return ssrAttribute("value", selectedSchedule()?.startDate ? escape(selectedSchedule().startDate.toString().split("T")[0], true) : "");
							}, _v$89 = () => {
								return ssrAttribute("value", selectedSchedule()?.endDate ? escape(selectedSchedule().endDate.toString().split("T")[0], true) : "");
							}, _v$90 = () => {
								return ssrAttribute("checked", escape(selectedSchedule()?.isActive ?? true, true));
							}, ssr(_tmpl$16, _v$72, _v$73, _v$74, _v$75, _v$78, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _v$79, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _v$80, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), _v$81, ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _v$82, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(4, 1fr)") + ssrStyleProperty(";gap:", "0.5rem"), _v$83, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "1fr 1fr") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _v$84, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _v$85, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _v$86, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.5rem"), _v$87, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "1fr 1fr") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _v$88, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), _v$89, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem"), _v$90, ssrStyleProperty("font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-family:", "inherit"), _v$91, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";justify-content:", "flex-end") + ssrStyleProperty(";margin-top:", "1.5rem"), ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "var(--color-border)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer"), _g$, _g$, _v$94);
						}
					})];
				}
			}),
			Dialog({
				get open() {
					return showGenerateDialog();
				},
				title: "Generate Sessions",
				onClose: closeGenerateDialog,
				get children() {
					return [(_v$95 = ssrHydrationKey(), ssr(_tmpl$17, _v$95, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-bottom:", "1.5rem"))), (_v$96 = ssrHydrationKey(), _g$2 = ssrGroup(() => {
						return [ssrAttribute("disabled", escape(generateSessionsSubmission.pending, true)), ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#48bb78") + ssrStyleProperty(";color:", "#fff") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", generateSessionsSubmission.pending ? "not-allowed" : "pointer") + ssrStyleProperty(";opacity:", generateSessionsSubmission.pending ? "0.6" : "1") + ssrStyleProperty(";font-weight:", "600")];
					}, 2), _v$100 = () => {
						return generateSessionsSubmission.pending ? "Generating..." : "Generate Sessions";
					}, _v$97 = () => {
						return ssrAttribute("value", escape(generateScheduleId(), true));
					}, ssr(_tmpl$18, _v$96, ssrAttribute("action", escape(generateSessionsFromSchedule, true)), _v$97, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "500") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";justify-content:", "flex-end") + ssrStyleProperty(";margin-top:", "1.5rem"), ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "var(--color-border)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer"), _g$2, _g$2, _v$100))];
				}
			})
		];
	} });
}
//#endregion
export { FamilyDetailPage as default };
