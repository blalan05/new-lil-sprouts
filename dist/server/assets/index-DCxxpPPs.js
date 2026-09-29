import { w as useParams } from "./action-6MWjotYm.js";
import { B as deleteExpense, H as getSessionExpenseTotal, R as createExpense, Tt as useSubmission, U as getSessionExpenses, W as updateExpense, ft as formatDateTimeLocal, ht as utcToDatetimeLocal, it as getCareSession, l as recordDropOff, lt as updateCareSession, m as getFamilyMembers, nt as getSessionReports, pt as formatTimeLocal, u as recordPickUp, yt as useConfirm } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { n as SessionStatusBadge } from "./StatusBadge-Zr2kRO1T.js";
import { r as moneyDisplay, t as formatMoneyDisplay } from "./money-display-DvMwur0H.js";
import { escape, memo, scope, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createEffect, createMemo, createSignal } from "solid-js";
//#region src/routes/families/[id]/sessions/[sessionId]/index.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<wa-button",
	" href=\"",
	"\" appearance=\"plain\" size=\"small\">← Back to Family</wa-button>"
];
var _tmpl$2 = [
	"<div",
	"><strong style=\"",
	"\">Rate:</strong><p style=\"",
	"\">$<!--$-->",
	"<!--/-->/hour</p></div>"
];
var _tmpl$3 = [
	"<div",
	" style=\"",
	"\"><strong style=\"",
	"\">Children:</strong><p style=\"",
	"\">",
	"</p></div>"
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
	"\"><h2 style=\"",
	"\">Session Information</h2><div style=\"",
	"\"><div><strong style=\"",
	"\">Scheduled Time:</strong><p style=\"",
	"\"><!--$-->",
	"<!--/--> - <!--$-->",
	"<!--/--></p></div><!--$-->",
	"<!--/--><div><strong style=\"",
	"\">Status:</strong><p style=\"",
	"\">",
	"</p></div></div><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div>"
];
var _tmpl$6 = [
	"<button",
	" style=\"",
	"\">Record Drop-off</button>"
];
var _tmpl$7 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><strong style=\"",
	"\">Time:</strong> <span style=\"",
	"\">",
	"</span></div><div><strong style=\"",
	"\">Dropped off by:</strong> <span style=\"",
	"\">",
	"</span></div></div>"
];
var _tmpl$8 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><h2 style=\"",
	"\">Drop-off</h2><!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--></div>"
];
var _tmpl$9 = [
	"<button",
	" style=\"",
	"\">Record Pick-up</button>"
];
var _tmpl$10 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><strong style=\"",
	"\">Time:</strong> <span style=\"",
	"\">",
	"</span></div><div><strong style=\"",
	"\">Picked up by:</strong> <span style=\"",
	"\">",
	"</span></div></div>"
];
var _tmpl$11 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><h2 style=\"",
	"\">Pick-up</h2><!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--></div>"
];
var _tmpl$12 = [
	"<button",
	" style=\"",
	"\">Edit Meal Counts</button>"
];
var _tmpl$13 = [
	"<form",
	"",
	" method=\"post\" style=\"",
	"\"><input type=\"hidden\" name=\"sessionId\"",
	"><input type=\"hidden\" name=\"notes\"",
	"><div style=\"",
	"\"><div><label style=\"",
	"\">Breakfast</label><input type=\"number\" name=\"breakfastCount\" min=\"0\"",
	" style=\"",
	"\"></div><div><label style=\"",
	"\">Morning Snack</label><input type=\"number\" name=\"morningSnackCount\" min=\"0\"",
	" style=\"",
	"\"></div><div><label style=\"",
	"\">Lunch</label><input type=\"number\" name=\"lunchCount\" min=\"0\"",
	" style=\"",
	"\"></div><div><label style=\"",
	"\">Afternoon Snack</label><input type=\"number\" name=\"afternoonSnackCount\" min=\"0\"",
	" style=\"",
	"\"></div><div><label style=\"",
	"\">Dinner</label><input type=\"number\" name=\"dinnerCount\" min=\"0\"",
	" style=\"",
	"\"></div></div><div style=\"",
	"\"><button type=\"submit\"",
	" style=\"",
	"\">",
	"</button><button type=\"button\" style=\"",
	"\">Cancel</button></div></form>"
];
var _tmpl$14 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><h2 style=\"",
	"\">Meal Counts</h2><!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--></div>"
];
var _tmpl$15 = [
	"<div",
	" style=\"",
	"\">",
	"</div>"
];
var _tmpl$16 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><h2 style=\"",
	"\">Reports & Notes (<!--$-->",
	"<!--/-->)</h2><wa-button href=\"",
	"\" variant=\"brand\" appearance=\"filled\" size=\"small\">+ Add Report</wa-button></div><!--$-->",
	"<!--/--></div>"
];
var _tmpl$17 = [
	"<p",
	" style=\"",
	"\">Total: <strong style=\"",
	"\">",
	"</strong></p>"
];
var _tmpl$18 = [
	"<button",
	" style=\"",
	"\">+ Add Expense</button>"
];
var _tmpl$19 = [
	"<input",
	" type=\"hidden\" name=\"id\"",
	">"
];
var _tmpl$20 = [
	"<form",
	"",
	" method=\"post\" style=\"",
	"\"><input type=\"hidden\" name=\"sessionId\"",
	"><!--$-->",
	"<!--/--><div style=\"",
	"\"><div><label for=\"description\" style=\"",
	"\">Description *</label><input id=\"description\" name=\"description\" type=\"text\" required placeholder=\"e.g., Lunch at McDonald's\" style=\"",
	"\"></div><div><label for=\"amount\" style=\"",
	"\">Amount ($) *</label><input id=\"amount\" name=\"amount\" type=\"number\" step=\"0.01\" min=\"0\" required placeholder=\"0.00\" style=\"",
	"\"></div><div><label for=\"category\" style=\"",
	"\">Category</label><select id=\"category\" name=\"category\" style=\"",
	"\"><option value>Select...</option><option value=\"FOOD\">Food</option><option value=\"ACTIVITY\">Activity</option><option value=\"SUPPLIES\">Supplies</option><option value=\"TRANSPORTATION\">Transportation</option><option value=\"OTHER\">Other</option></select></div></div><div style=\"",
	"\"><label for=\"notes\" style=\"",
	"\">Notes (optional)</label><textarea id=\"notes\" name=\"notes\" rows=\"2\" placeholder=\"Additional details...\" style=\"",
	"\"></textarea></div><div style=\"",
	"\"><button type=\"submit\"",
	" style=\"",
	"\">",
	"</button><button type=\"button\" style=\"",
	"\">Cancel</button></div></form>"
];
var _tmpl$21 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><div><h2 style=\"",
	"\">Expenses (<!--$-->",
	"<!--/-->)</h2><!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div>"
];
var _tmpl$22 = [
	"<div",
	" style=\"",
	"\" class=\"wa-color-text-quiet\">Loading session details...</div>"
];
var _tmpl$23 = [
	"<wa-button",
	" href=\"",
	"\" variant=\"brand\" appearance=\"filled\">Edit Session</wa-button>"
];
var _tmpl$24 = ["<wa-button", " variant=\"danger\" appearance=\"filled\">Delete Session</wa-button>"];
var _tmpl$25 = [
	"<form",
	"",
	" method=\"post\" style=\"",
	"\"><input type=\"hidden\" name=\"sessionId\"",
	"><div style=\"",
	"\"><label for=\"dropOffBy\" style=\"",
	"\">Dropped off by: *</label><select id=\"dropOffBy\" name=\"dropOffBy\" required style=\"",
	"\"><option value>Select person...</option><!--$-->",
	"<!--/--><option value=\"Other\">Other</option></select></div><div style=\"",
	"\"><label for=\"dropOffTime\" style=\"",
	"\">Time:</label><input id=\"dropOffTime\" name=\"dropOffTime\" type=\"datetime-local\"",
	" style=\"",
	"\"></div><div style=\"",
	"\"><button type=\"submit\"",
	" style=\"",
	"\">",
	"</button><button type=\"button\" style=\"",
	"\">Cancel</button></div></form>"
];
var _tmpl$26 = [
	"<p",
	" style=\"",
	"\">Not yet recorded</p>"
];
var _tmpl$27 = [
	"<option",
	" value=\"",
	"\"><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--> (<!--$-->",
	"<!--/-->)</option>"
];
var _tmpl$28 = [
	"<form",
	"",
	" method=\"post\" style=\"",
	"\"><input type=\"hidden\" name=\"sessionId\"",
	"><div style=\"",
	"\"><label for=\"pickUpBy\" style=\"",
	"\">Picked up by: *</label><select id=\"pickUpBy\" name=\"pickUpBy\" required style=\"",
	"\"><option value>Select person...</option><!--$-->",
	"<!--/--><option value=\"Other\">Other</option></select></div><div style=\"",
	"\"><label for=\"pickUpTime\" style=\"",
	"\">Time:</label><input id=\"pickUpTime\" name=\"pickUpTime\" type=\"datetime-local\"",
	" style=\"",
	"\"></div><div style=\"",
	"\"><button type=\"submit\"",
	" style=\"",
	"\">",
	"</button><button type=\"button\" style=\"",
	"\">Cancel</button></div></form>"
];
var _tmpl$29 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\">Breakfast</div><div style=\"",
	"\">",
	"</div></div><div style=\"",
	"\"><div style=\"",
	"\">Morning Snack</div><div style=\"",
	"\">",
	"</div></div><div style=\"",
	"\"><div style=\"",
	"\">Lunch</div><div style=\"",
	"\">",
	"</div></div><div style=\"",
	"\"><div style=\"",
	"\">Afternoon Snack</div><div style=\"",
	"\">",
	"</div></div><div style=\"",
	"\"><div style=\"",
	"\">Dinner</div><div style=\"",
	"\">",
	"</div></div></div>"
];
var _tmpl$30 = [
	"<p",
	" style=\"",
	"\">No reports yet. Add incidents, meals, naps, or activities.</p>"
];
var _tmpl$31 = [
	"<span",
	" style=\"",
	"\">Follow-up Needed</span>"
];
var _tmpl$32 = [
	"<div",
	" style=\"",
	"\"><strong style=\"",
	"\">Action Taken:</strong><p style=\"",
	"\">",
	"</p></div>"
];
var _tmpl$33 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><h3 style=\"",
	"\">",
	"</h3><span style=\"",
	"\">",
	"</span><!--$-->",
	"<!--/--></div><span style=\"",
	"\">",
	"</span></div><p style=\"",
	"\">",
	"</p><div style=\"",
	"\">Child: <!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--></div>"
];
var _tmpl$34 = [
	"<p",
	" style=\"",
	"\">No expenses recorded yet. Add lunch, trips, supplies, or other expenses.</p>"
];
var _tmpl$35 = [
	"<p",
	" style=\"",
	"\">",
	"</p>"
];
var _tmpl$36 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><strong style=\"",
	"\">",
	"</strong><!--$-->",
	"<!--/--></div><div style=\"",
	"\">",
	"</div><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\">",
	"</div></div><div style=\"",
	"\"><button style=\"",
	"\">Edit</button><form",
	" method=\"post\" style=\"",
	"\"><input type=\"hidden\" name=\"id\"",
	"><wa-button type=\"submit\" variant=\"danger\" appearance=\"outlined\" size=\"small\"",
	">Delete</wa-button></form></div></div></div>"
];
var _tmpl$37 = [
	"<span",
	" style=\"",
	"\">",
	"</span>"
];
function CareSessionDetail() {
	var _v$, _v$2, _v$6, _v$7, _v$10, _v$11, _v$13, _v$14, _v$3, _v$4, _v$5, _v$8, _v$9, _v$12, _v$15, _v$17, _v$19, _v$20, _v$21, _v$16, _v$18, _v$22, _v$24, _v$26, _v$27, _v$28, _v$23, _v$25, _v$29, _v$31, _v$33, _g$, _v$43, _v$34, _v$35, _v$36, _v$37, _v$38, _v$39, _v$40, _v$30, _v$32, _v$44, _v$48, _v$49, _v$45, _v$46, _v$47, _v$50, _v$53, _v$54, _v$56, _v$61, _v$62, _v$58, _v$59, _v$63, _g$2, _v$66, _v$60, _v$68, _v$69, _v$51, _v$52, _v$55, _v$57, _v$67, _v$70;
	const params = useParams();
	const { confirm } = useConfirm();
	const session = createMemo(() => getCareSession(params.sessionId));
	const reports = createMemo(() => getSessionReports(params.sessionId));
	const expenses = createMemo(() => getSessionExpenses(params.sessionId));
	const expenseTotal = createMemo(() => getSessionExpenseTotal(params.sessionId));
	const familyMembers = createMemo(() => getFamilyMembers(params.id));
	const allPeople = createMemo(() => {
		const people = [];
		if (session()?.family?.parentFirstName && session()?.family?.parentLastName) people.push({
			id: "primary-parent",
			firstName: session().family.parentFirstName,
			lastName: session().family.parentLastName,
			relationship: "PARENT"
		});
		if (familyMembers()) people.push(...familyMembers());
		return people;
	});
	const dropOffSubmission = useSubmission(recordDropOff);
	const pickUpSubmission = useSubmission(recordPickUp);
	const expenseSubmission = useSubmission(createExpense);
	const updateExpenseSubmission = useSubmission(updateExpense);
	const deleteExpenseSubmission = useSubmission(deleteExpense);
	const updateSessionSubmission = useSubmission(updateCareSession);
	const [showDropOffForm, setShowDropOffForm] = createSignal(false);
	const [showPickUpForm, setShowPickUpForm] = createSignal(false);
	const [showExpenseForm, setShowExpenseForm] = createSignal(false);
	const [editingExpenseId, setEditingExpenseId] = createSignal(null);
	const [editingMeals, setEditingMeals] = createSignal(false);
	const [breakfastCount, setBreakfastCount] = createSignal(0);
	const [morningSnackCount, setMorningSnackCount] = createSignal(0);
	const [lunchCount, setLunchCount] = createSignal(0);
	const [afternoonSnackCount, setAfternoonSnackCount] = createSignal(0);
	const [dinnerCount, setDinnerCount] = createSignal(0);
	createEffect(() => {
		const currentSession = session();
		if (currentSession) {
			setBreakfastCount(currentSession.breakfastCount || 0);
			setMorningSnackCount(currentSession.morningSnackCount || 0);
			setLunchCount(currentSession.lunchCount || 0);
			setAfternoonSnackCount(currentSession.afternoonSnackCount || 0);
			setDinnerCount(currentSession.dinnerCount || 0);
		}
	});
	const formatDateTime = formatDateTimeLocal;
	const formatTime = formatTimeLocal;
	const getSeverityColor = (severity) => {
		switch (severity) {
			case "INFO": return {
				bg: "var(--wa-color-brand-fill-normal)",
				color: "#2c5282"
			};
			case "MINOR": return {
				bg: "#c6f6d5",
				color: "#276749"
			};
			case "MODERATE": return {
				bg: "#feebc8",
				color: "#7c2d12"
			};
			case "SEVERE": return {
				bg: "var(--wa-color-danger-fill-normal)",
				color: "#c53030"
			};
			default: return {
				bg: "var(--color-border)",
				color: "var(--color-text)"
			};
		}
	};
	return PageContent({ get children() {
		return Show({
			get when() {
				return session();
			},
			get fallback() {
				var _v$71 = ssrHydrationKey();
				return ssr(_tmpl$22, _v$71, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "var(--wa-space-2xl)"));
			},
			get children() {
				return [
					(_v$ = ssrHydrationKey(), _v$2 = () => {
						return `/families/${escape(params.id, true)}`;
					}, ssr(_tmpl$, _v$, _v$2)),
					PageHeader({
						title: "Care Session",
						get description() {
							return memo(() => {
								return !!session()?.scheduledStart;
							})() ? formatDateTime(session().scheduledStart) : session()?.scheduledStart;
						},
						get actions() {
							var _v$72, _v$73, _v$74;
							return [
								(_v$72 = ssrHydrationKey(), _v$73 = () => {
									return `/families/${escape(params.id, true)}/sessions/${escape(params.sessionId, true)}/edit`;
								}, ssr(_tmpl$23, _v$72, _v$73)),
								(_v$74 = ssrHydrationKey(), ssr(_tmpl$24, _v$74)),
								SessionStatusBadge({ get status() {
									return session()?.status || "";
								} })
							];
						}
					}),
					(_v$3 = ssrHydrationKey(), _v$4 = scope((() => {
						var _c$ = memo(() => {
							return !!session()?.scheduledStart;
						});
						return () => {
							return _c$() ? escape(formatTime(session().scheduledStart)) : escape(session()?.scheduledStart);
						};
					})()), _v$5 = scope((() => {
						var _c$2 = memo(() => {
							return !!session()?.scheduledEnd;
						});
						return () => {
							return _c$2() ? escape(formatTime(session().scheduledEnd)) : escape(session()?.scheduledEnd);
						};
					})()), _v$8 = escape(Show({
						get when() {
							return session()?.hourlyRate;
						},
						get children() {
							return _v$6 = ssrHydrationKey(), _v$7 = () => {
								return escape(session()?.hourlyRate);
							}, ssr(_tmpl$2, _v$6, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$7);
						}
					})), _v$9 = () => {
						return session()?.isConfirmed ? "✓ Confirmed" : "⚠️ Not Confirmed";
					}, _v$12 = escape(Show({
						get when() {
							return session()?.children?.length;
						},
						get children() {
							return _v$10 = ssrHydrationKey(), _v$11 = () => {
								return escape(session()?.children?.map((c) => `${c.firstName} ${c.lastName}`).join(", "));
							}, ssr(_tmpl$3, _v$10, ssrStyleProperty("margin-top:", "1rem"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$11);
						}
					})), _v$15 = escape(Show({
						get when() {
							return session()?.notes;
						},
						get children() {
							return _v$13 = ssrHydrationKey(), _v$14 = () => {
								return escape(session()?.notes);
							}, ssr(_tmpl$4, _v$13, ssrStyleProperty("margin-top:", "1rem"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$14);
						}
					})), ssr(_tmpl$5, _v$3, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";margin-bottom:", "1rem") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(250px, 1fr))") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$4, _v$5, _v$8, ssrStyleProperty("color:", "var(--color-text)"), ssrStyleProperty("margin:", "0.25rem 0 0 0"), _v$9, _v$12, _v$15)),
					(_v$16 = ssrHydrationKey(), _v$18 = escape(Show({
						get when() {
							return memo(() => {
								return !session()?.dropOffTime;
							})() && !showDropOffForm();
						},
						get children() {
							return _v$17 = ssrHydrationKey(), ssr(_tmpl$6, _v$17, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#48bb78") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";font-size:", "0.875rem"));
						}
					})), _v$22 = escape(Show({
						get when() {
							return session()?.dropOffTime;
						},
						get fallback() {
							var _v$75, _v$77, _g$3, _v$81, _v$76, _v$78;
							return Show({
								get when() {
									return showDropOffForm();
								},
								get fallback() {
									var _v$82 = ssrHydrationKey();
									return ssr(_tmpl$26, _v$82, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";margin:", 0));
								},
								get children() {
									return _v$75 = ssrHydrationKey(), _v$77 = escape(For({
										get each() {
											return allPeople();
										},
										children: (member) => {
											var _v$83, _v$84, _v$85, _v$86, _v$87;
											return _v$83 = ssrHydrationKey(), _v$84 = () => {
												return `${escape(member.firstName, true)} ${escape(member.lastName, true)}`;
											}, _v$85 = () => {
												return escape(member.firstName);
											}, _v$86 = () => {
												return escape(member.lastName);
											}, _v$87 = () => {
												return escape(member.relationship);
											}, ssr(_tmpl$27, _v$83, _v$84, _v$85, _v$86, _v$87);
										}
									})), _g$3 = ssrGroup(() => {
										return [ssrAttribute("disabled", escape(dropOffSubmission.pending, true)), ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#48bb78") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", dropOffSubmission.pending ? "not-allowed" : "pointer") + ssrStyleProperty(";font-weight:", "600")];
									}, 2), _v$81 = () => {
										return dropOffSubmission.pending ? "Saving..." : "Save";
									}, _v$76 = () => {
										return ssrAttribute("value", escape(params.sessionId, true));
									}, _v$78 = () => {
										return ssrAttribute("value", escape(utcToDatetimeLocal(/* @__PURE__ */ new Date()), true));
									}, ssr(_tmpl$25, _v$75, ssrAttribute("action", escape(recordDropOff, true)), ssrStyleProperty("background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";padding:", "1rem") + ssrStyleProperty(";border-radius:", "4px"), _v$76, ssrStyleProperty("margin-bottom:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), _v$77, ssrStyleProperty("margin-bottom:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$78, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "0.5rem"), _g$3, _g$3, _v$81, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "var(--color-hover)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer"));
								}
							});
						},
						get children() {
							return _v$19 = ssrHydrationKey(), _v$20 = scope((() => {
								var _c$3 = memo(() => {
									return !!session()?.dropOffTime;
								});
								return () => {
									return _c$3() ? escape(formatDateTime(session().dropOffTime)) : "N/A";
								};
							})()), _v$21 = () => {
								return escape(session()?.dropOffBy);
							}, ssr(_tmpl$7, _v$19, ssrStyleProperty("background-color:", "#f0fff4") + ssrStyleProperty(";padding:", "1rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";border:", "1px solid #c6f6d5"), ssrStyleProperty("margin-bottom:", "0.5rem"), ssrStyleProperty("color:", "#276749"), ssrStyleProperty("color:", "var(--color-text)"), _v$20, ssrStyleProperty("color:", "#276749"), ssrStyleProperty("color:", "var(--color-text)"), _v$21);
						}
					})), ssr(_tmpl$8, _v$16, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin:", 0), _v$18, _v$22)),
					(_v$23 = ssrHydrationKey(), _v$25 = escape(Show({
						get when() {
							return memo(() => {
								return !session()?.pickUpTime;
							})() && !showPickUpForm();
						},
						get children() {
							return _v$24 = ssrHydrationKey(), ssr(_tmpl$9, _v$24, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#4299e1") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";font-size:", "0.875rem"));
						}
					})), _v$29 = escape(Show({
						get when() {
							return session()?.pickUpTime;
						},
						get fallback() {
							var _v$88, _v$90, _g$4, _v$94, _v$89, _v$91;
							return Show({
								get when() {
									return showPickUpForm();
								},
								get fallback() {
									var _v$95 = ssrHydrationKey();
									return ssr(_tmpl$26, _v$95, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";margin:", 0));
								},
								get children() {
									return _v$88 = ssrHydrationKey(), _v$90 = escape(For({
										get each() {
											return allPeople();
										},
										children: (member) => {
											var _v$96, _v$97, _v$98, _v$99, _v$100;
											return _v$96 = ssrHydrationKey(), _v$97 = () => {
												return `${escape(member.firstName, true)} ${escape(member.lastName, true)}`;
											}, _v$98 = () => {
												return escape(member.firstName);
											}, _v$99 = () => {
												return escape(member.lastName);
											}, _v$100 = () => {
												return escape(member.relationship);
											}, ssr(_tmpl$27, _v$96, _v$97, _v$98, _v$99, _v$100);
										}
									})), _g$4 = ssrGroup(() => {
										return [ssrAttribute("disabled", escape(pickUpSubmission.pending, true)), ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#4299e1") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", pickUpSubmission.pending ? "not-allowed" : "pointer") + ssrStyleProperty(";font-weight:", "600")];
									}, 2), _v$94 = () => {
										return pickUpSubmission.pending ? "Saving..." : "Save";
									}, _v$89 = () => {
										return ssrAttribute("value", escape(params.sessionId, true));
									}, _v$91 = () => {
										return ssrAttribute("value", escape(utcToDatetimeLocal(/* @__PURE__ */ new Date()), true));
									}, ssr(_tmpl$28, _v$88, ssrAttribute("action", escape(recordPickUp, true)), ssrStyleProperty("background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";padding:", "1rem") + ssrStyleProperty(";border-radius:", "4px"), _v$89, ssrStyleProperty("margin-bottom:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), _v$90, ssrStyleProperty("margin-bottom:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$91, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "0.5rem"), _g$4, _g$4, _v$94, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "var(--color-hover)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer"));
								}
							});
						},
						get children() {
							return _v$26 = ssrHydrationKey(), _v$27 = scope((() => {
								var _c$4 = memo(() => {
									return !!session()?.pickUpTime;
								});
								return () => {
									return _c$4() ? escape(formatDateTime(session().pickUpTime)) : "N/A";
								};
							})()), _v$28 = () => {
								return escape(session()?.pickUpBy);
							}, ssr(_tmpl$10, _v$26, ssrStyleProperty("background-color:", "#ebf8ff") + ssrStyleProperty(";padding:", "1rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";border:", "1px solid var(--wa-color-brand-fill-normal)"), ssrStyleProperty("margin-bottom:", "0.5rem"), ssrStyleProperty("color:", "#2c5282"), ssrStyleProperty("color:", "var(--color-text)"), _v$27, ssrStyleProperty("color:", "#2c5282"), ssrStyleProperty("color:", "var(--color-text)"), _v$28);
						}
					})), ssr(_tmpl$11, _v$23, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin:", 0), _v$25, _v$29)),
					(_v$30 = ssrHydrationKey(), _v$32 = escape(Show({
						get when() {
							return !editingMeals();
						},
						get children() {
							return _v$31 = ssrHydrationKey(), ssr(_tmpl$12, _v$31, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#48bb78") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";font-size:", "0.875rem"));
						}
					})), _v$44 = escape(Show({
						get when() {
							return editingMeals();
						},
						get fallback() {
							var _v$101 = ssrHydrationKey(), _v$102 = () => {
								return escape(session()?.breakfastCount || 0);
							}, _v$103 = () => {
								return escape(session()?.morningSnackCount || 0);
							}, _v$104 = () => {
								return escape(session()?.lunchCount || 0);
							}, _v$105 = () => {
								return escape(session()?.afternoonSnackCount || 0);
							}, _v$106 = () => {
								return escape(session()?.dinnerCount || 0);
							};
							return ssr(_tmpl$29, _v$101, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(150px, 1fr))") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-size:", "1.5rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "var(--color-text)"), _v$102, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-size:", "1.5rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "var(--color-text)"), _v$103, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-size:", "1.5rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "var(--color-text)"), _v$104, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-size:", "1.5rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "var(--color-text)"), _v$105, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";border:", "1px solid var(--color-border)"), ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-size:", "1.5rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "var(--color-text)"), _v$106);
						},
						get children() {
							return _v$33 = ssrHydrationKey(), _g$ = ssrGroup(() => {
								return [ssrAttribute("disabled", escape(updateSessionSubmission.pending, true)), ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#48bb78") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", updateSessionSubmission.pending ? "not-allowed" : "pointer") + ssrStyleProperty(";font-weight:", "600")];
							}, 2), _v$43 = () => {
								return updateSessionSubmission.pending ? "Saving..." : "Save Meal Counts";
							}, _v$34 = () => {
								return ssrAttribute("value", escape(params.sessionId, true));
							}, _v$35 = () => {
								return ssrAttribute("value", escape(session()?.notes || "", true));
							}, _v$36 = () => {
								return ssrAttribute("value", escape(breakfastCount(), true));
							}, _v$37 = () => {
								return ssrAttribute("value", escape(morningSnackCount(), true));
							}, _v$38 = () => {
								return ssrAttribute("value", escape(lunchCount(), true));
							}, _v$39 = () => {
								return ssrAttribute("value", escape(afternoonSnackCount(), true));
							}, _v$40 = () => {
								return ssrAttribute("value", escape(dinnerCount(), true));
							}, ssr(_tmpl$13, _v$33, ssrAttribute("action", escape(updateCareSession, true)), ssrStyleProperty("background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";padding:", "1rem") + ssrStyleProperty(";border-radius:", "4px"), _v$34, _v$35, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(150px, 1fr))") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$36, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$37, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$38, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$39, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$40, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";justify-content:", "flex-end"), _g$, _g$, _v$43, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "var(--color-hover)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer"));
						}
					})), ssr(_tmpl$14, _v$30, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin:", 0), _v$32, _v$44)),
					(_v$45 = ssrHydrationKey(), _v$46 = () => {
						return escape(reports()?.length || 0);
					}, _v$47 = () => {
						return `/families/${escape(params.id, true)}/sessions/${escape(params.sessionId, true)}/reports/new`;
					}, _v$50 = escape(Show({
						get when() {
							return reports()?.length;
						},
						get fallback() {
							var _v$107 = ssrHydrationKey();
							return ssr(_tmpl$30, _v$107, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";padding:", "2rem"));
						},
						get children() {
							return _v$48 = ssrHydrationKey(), _v$49 = escape(For({
								get each() {
									return reports();
								},
								children: (report) => {
									var _v$112, _v$118, _v$119;
									const severityColors = getSeverityColor(report.severity);
									var _v$108 = ssrHydrationKey(), _v$109 = () => {
										return escape(report.title);
									}, _v$110 = () => {
										return ssrStyleProperty("padding:", "0.25rem 0.5rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", escape(severityColors.bg, true)) + ssrStyleProperty(";color:", escape(severityColors.color, true)) + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", "600");
									}, _v$111 = () => {
										return escape(report.type);
									}, _v$113 = escape(Show({
										get when() {
											return report.followUpNeeded;
										},
										get children() {
											return _v$112 = ssrHydrationKey(), ssr(_tmpl$31, _v$112, ssrStyleProperty("padding:", "0.25rem 0.5rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "#fef3c7") + ssrStyleProperty(";color:", "#92400e") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", "600"));
										}
									})), _v$114 = scope(() => {
										return escape(formatTime(report.timestamp));
									}), _v$115 = () => {
										return escape(report.description);
									}, _v$116 = () => {
										return escape(report.child.firstName);
									}, _v$117 = () => {
										return escape(report.child.lastName);
									}, _v$120 = escape(Show({
										get when() {
											return report.actionTaken;
										},
										get children() {
											return _v$118 = ssrHydrationKey(), _v$119 = () => {
												return escape(report.actionTaken);
											}, ssr(_tmpl$32, _v$118, ssrStyleProperty("margin-top:", "0.5rem") + ssrStyleProperty(";padding-top:", "0.5rem") + ssrStyleProperty(";border-top:", "1px solid var(--color-border)"), ssrStyleProperty("color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";margin:", "0.25rem 0 0 0"), _v$119);
										}
									}));
									return ssr(_tmpl$33, _v$108, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";margin-bottom:", "0.5rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem"), ssrStyleProperty("color:", "var(--color-text)") + ssrStyleProperty(";margin:", 0), _v$109, _v$110, _v$111, _v$113, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$114, ssrStyleProperty("color:", "var(--color-text)") + ssrStyleProperty(";margin-bottom:", "0.5rem"), _v$115, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$116, _v$117, _v$120);
								}
							})), ssr(_tmpl$15, _v$48, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";gap:", "1rem"), _v$49);
						}
					})), ssr(_tmpl$16, _v$45, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin:", 0), _v$46, _v$47, _v$50)),
					(_v$51 = ssrHydrationKey(), _v$52 = () => {
						return escape(expenses()?.length || 0);
					}, _v$55 = escape(Show({
						get when() {
							return Number(moneyDisplay(expenseTotal())) > 0;
						},
						get children() {
							return _v$53 = ssrHydrationKey(), _v$54 = scope(() => {
								return escape(formatMoneyDisplay(expenseTotal()));
							}), ssr(_tmpl$17, _v$53, ssrStyleProperty("margin:", "0.25rem 0 0 0") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("color:", "var(--color-text)"), _v$54);
						}
					})), _v$57 = escape(Show({
						get when() {
							return memo(() => {
								return !showExpenseForm();
							})() && editingExpenseId() === null;
						},
						get children() {
							return _v$56 = ssrHydrationKey(), ssr(_tmpl$18, _v$56, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#48bb78") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";font-size:", "0.875rem"));
						}
					})), _v$67 = escape(Show({
						get when() {
							return showExpenseForm() || editingExpenseId() !== null;
						},
						get children() {
							return _v$58 = ssrHydrationKey(), _v$59 = () => {
								return ssrAttribute("action", editingExpenseId() ? escape(updateExpense, true) : escape(createExpense, true));
							}, _v$63 = escape(Show({
								get when() {
									return editingExpenseId();
								},
								get children() {
									return _v$61 = ssrHydrationKey(), _v$62 = () => {
										return ssrAttribute("value", escape(editingExpenseId(), true));
									}, ssr(_tmpl$19, _v$61, _v$62);
								}
							})), _g$2 = ssrGroup(() => {
								return [ssrAttribute("disabled", escape(expenseSubmission.pending || updateExpenseSubmission.pending, true)), ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "#48bb78") + ssrStyleProperty(";color:", "white") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", expenseSubmission.pending || updateExpenseSubmission.pending ? "not-allowed" : "pointer") + ssrStyleProperty(";font-weight:", "600")];
							}, 2), _v$66 = (() => {
								var _c$5 = memo(() => {
									return !!(expenseSubmission.pending || updateExpenseSubmission.pending);
								});
								return () => {
									return _c$5() ? "Saving..." : editingExpenseId() ? "Update" : "Add";
								};
							})(), _v$60 = () => {
								return ssrAttribute("value", escape(params.sessionId, true));
							}, ssr(_tmpl$20, _v$58, _v$59, ssrStyleProperty("background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";padding:", "1rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";margin-bottom:", "1rem"), _v$60, _v$63, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "2fr 1fr 1fr") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px"), ssrStyleProperty("margin-bottom:", "1rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-family:", "inherit"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "0.5rem"), _g$2, _g$2, _v$66, ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", "var(--color-hover)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer"));
						}
					})), _v$70 = escape(Show({
						get when() {
							return expenses()?.length;
						},
						get fallback() {
							var _v$121 = ssrHydrationKey();
							return ssr(_tmpl$34, _v$121, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";padding:", "2rem"));
						},
						get children() {
							return _v$68 = ssrHydrationKey(), _v$69 = escape(For({
								get each() {
									return expenses();
								},
								children: (expense) => {
									var _v$126, _v$127;
									const categoryLabels = {
										FOOD: "Food",
										ACTIVITY: "Activity",
										SUPPLIES: "Supplies",
										TRANSPORTATION: "Transportation",
										OTHER: "Other"
									};
									var _v$122 = ssrHydrationKey(), _v$123 = () => {
										return escape(expense.description);
									}, _v$124 = scope((() => {
										var _c$6 = memo(() => {
											return !!expense.category;
										});
										return () => {
											var _v$132, _v$133;
											return _c$6() ? (_v$132 = ssrHydrationKey(), _v$133 = () => {
												return escape(categoryLabels[expense.category] || expense.category);
											}, ssr(_tmpl$37, _v$132, ssrStyleProperty("padding:", "0.125rem 0.5rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "#e6fffa") + ssrStyleProperty(";color:", "#234e52") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", "600"), _v$133)) : escape(expense.category);
										};
									})()), _v$125 = scope(() => {
										return escape(formatTime(expense.createdAt));
									}), _v$128 = escape(Show({
										get when() {
											return expense.notes;
										},
										get children() {
											return _v$126 = ssrHydrationKey(), _v$127 = () => {
												return escape(expense.notes);
											}, ssr(_tmpl$35, _v$126, ssrStyleProperty("margin-top:", "0.5rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$127);
										}
									})), _v$129 = scope(() => {
										return escape(formatMoneyDisplay(expense.amount));
									}), _v$131 = () => {
										return ssrAttribute("disabled", escape(deleteExpenseSubmission.pending || void 0, true));
									}, _v$130 = () => {
										return ssrAttribute("value", escape(expense.id, true));
									};
									return ssr(_tmpl$36, _v$122, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "flex-start") + ssrStyleProperty(";padding:", "1rem") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("flex:", "1"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("color:", "var(--color-text)"), _v$123, _v$124, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$125, _v$128, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("text-align:", "right"), ssrStyleProperty("font-size:", "1.125rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$129, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "0.5rem"), ssrStyleProperty("padding:", "0.25rem 0.5rem") + ssrStyleProperty(";background-color:", "var(--color-hover)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-size:", "0.75rem"), ssrAttribute("action", escape(deleteExpense, true)), ssrStyleProperty("display:", "inline"), _v$130, _v$131);
								}
							})), ssr(_tmpl$15, _v$68, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";gap:", "0.75rem"), _v$69);
						}
					})), ssr(_tmpl$21, _v$51, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "2rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin:", 0), _v$52, _v$55, _v$57, _v$67, _v$70))
				];
			}
		});
	} });
}
//#endregion
export { CareSessionDetail as default };
