import { C as getServices, J as getWeeklyStats, K as getDashboardStats, Q as getFamily, Tt as useSubmission, Z as getFamilies, a as createCareSchedule, bt as Dialog, ct as getUpcomingSessions, mt as isSameDay, ot as getSessionsForDay, pt as formatTimeLocal, q as getStatsForPeriod, tt as getRecentReports, ut as ensureDate, xt as getUser } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { n as SessionStatusBadge } from "./StatusBadge-Zr2kRO1T.js";
import { n as hoursDisplay, r as moneyDisplay, t as formatMoneyDisplay } from "./money-display-DvMwur0H.js";
import { escape, memo, scope, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createEffect, createSignal } from "solid-js";
//#region src/routes/index.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<wa-callout",
	" variant=\"brand\">View your family&apos;s schedule, sessions, and updates on the <a href=\"",
	"\">family page</a>.</wa-callout>"
];
var _tmpl$2 = [
	"<wa-card",
	" style=\"",
	"\"><div class=\"wa-flank wa-gap-s\" style=\"",
	"\"><wa-button appearance=\"outlined\" size=\"small\">←</wa-button><h3 class=\"wa-heading-s\" style=\"",
	"\">",
	"</h3><wa-button appearance=\"outlined\" size=\"small\">→</wa-button></div><div class=\"calendar-grid\"><div class=\"calendar-grid-inner\" style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div></div></wa-card>"
];
var _tmpl$3 = [
	"<div",
	" style=\"",
	"\">",
	"</div>"
];
var _tmpl$4 = [
	"<div",
	" class=\"wa-grid wa-gap-m grid-responsive\" style=\"",
	"\"><wa-card><div class=\"wa-flank wa-gap-s\" style=\"",
	"\"><h2 class=\"wa-heading-m\">Yesterday</h2><wa-badge variant=\"neutral\" appearance=\"filled-outlined\" pill>",
	"</wa-badge></div><!--$-->",
	"<!--/--></wa-card><wa-card style=\"",
	"\"><div class=\"wa-flank wa-gap-s\" style=\"",
	"\"><h2 class=\"wa-heading-m\">Today</h2><wa-badge variant=\"brand\" appearance=\"filled-outlined\" pill>",
	"</wa-badge></div><!--$-->",
	"<!--/--></wa-card><wa-card><div class=\"wa-flank wa-gap-s\" style=\"",
	"\"><h2 class=\"wa-heading-m\">Tomorrow</h2><wa-badge variant=\"neutral\" appearance=\"filled-outlined\" pill>",
	"</wa-badge></div><!--$-->",
	"<!--/--></wa-card></div>"
];
var _tmpl$5 = [
	"<div",
	" class=\"wa-heading-xl\">",
	"</div>"
];
var _tmpl$6 = [
	"<div",
	" class=\"wa-heading-xl\" style=\"",
	"\">",
	"</div>"
];
var _tmpl$7 = [
	"<div",
	" class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-card><div class=\"wa-flank wa-gap-s\" style=\"",
	"\"><div class=\"wa-heading-m\">Hours</div><div class=\"wa-cluster wa-gap-xs\"><wa-button size=\"small\"",
	"",
	">Last Week</wa-button><wa-button size=\"small\"",
	"",
	">Week</wa-button><wa-button size=\"small\"",
	"",
	">Month</wa-button><wa-button size=\"small\"",
	"",
	">YTD</wa-button></div></div><!--$-->",
	"<!--/--></wa-card><wa-card><div class=\"wa-flank wa-gap-s\" style=\"",
	"\"><div class=\"wa-heading-m\">Money</div><div class=\"wa-cluster wa-gap-xs\"><wa-button size=\"small\"",
	"",
	">Last Week</wa-button><wa-button size=\"small\"",
	"",
	">Week</wa-button><wa-button size=\"small\"",
	"",
	">Month</wa-button><wa-button size=\"small\"",
	"",
	">YTD</wa-button></div></div><!--$-->",
	"<!--/--></wa-card></div>"
];
var _tmpl$8 = [
	"<wa-card",
	"><div class=\"wa-body-s wa-color-text-quiet\">Hours This Month</div><div class=\"wa-heading-xl\">",
	"</div><div class=\"wa-body-s wa-color-text-quiet\"><!--$-->",
	"<!--/--> earned</div></wa-card>"
];
var _tmpl$9 = [
	"<wa-card",
	"><div class=\"wa-body-s wa-color-text-quiet\">Care Hours This Month</div><div class=\"wa-heading-xl\">",
	"</div></wa-card>"
];
var _tmpl$10 = [
	"<wa-card",
	"><div class=\"wa-body-s wa-color-text-quiet\">Unpaid Sessions</div><div class=\"wa-heading-xl\" style=\"",
	"\">",
	"</div><div class=\"wa-body-s wa-color-text-quiet\">Awaiting payment</div></wa-card>"
];
var _tmpl$11 = [
	"<wa-card",
	"><div class=\"wa-body-s wa-color-text-quiet\">Active Families</div><div class=\"wa-heading-xl\">",
	"</div><div class=\"wa-body-s wa-color-text-quiet\">This month</div></wa-card>"
];
var _tmpl$12 = [
	"<wa-card",
	"><div class=\"wa-body-s wa-color-text-quiet\">Avg Hourly Rate</div><div class=\"wa-heading-xl\">",
	"</div><div class=\"wa-body-s wa-color-text-quiet\">This month</div></wa-card>"
];
var _tmpl$13 = [
	"<div",
	" class=\"wa-grid wa-gap-m\" style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><wa-card><div class=\"wa-body-s wa-color-text-quiet\">Upcoming Sessions</div><div class=\"wa-heading-xl\" style=\"",
	"\">",
	"</div><div class=\"wa-body-s wa-color-text-quiet\">Next 7 days</div></wa-card><!--$-->",
	"<!--/--></div>"
];
var _tmpl$14 = [
	"<div",
	" class=\"wa-grid wa-gap-m grid-responsive\" style=\"",
	"\"><wa-card><div class=\"wa-flank wa-gap-s\" style=\"",
	"\"><h2 class=\"wa-heading-m\">Upcoming Sessions</h2><a href=\"/schedule\">View All →</a></div><!--$-->",
	"<!--/--></wa-card><wa-card><div class=\"wa-flank wa-gap-s\" style=\"",
	"\"><h2 class=\"wa-heading-m\">Recent Incidents & Reports</h2><a href=\"/reports\">View All →</a></div><!--$-->",
	"<!--/--></wa-card></div>"
];
var _tmpl$15 = [
	"<wa-select",
	" label=\"Service *\" name=\"serviceId\" required",
	">",
	"</wa-select>"
];
var _tmpl$16 = [
	"<p",
	" class=\"wa-body-s wa-color-text-quiet\">No services assigned to this family. <a href=\"",
	"\">Assign services</a> to default this selection.</p>"
];
var _tmpl$17 = [
	"<wa-callout",
	" variant=\"danger\">",
	"</wa-callout>"
];
var _tmpl$18 = [
	"<form",
	"",
	" method=\"post\" class=\"wa-stack wa-gap-m\"><input type=\"hidden\" name=\"recurrence\" value=\"ONCE\"><input type=\"hidden\" name=\"timezoneOffset\"",
	"><!--$-->",
	"<!--/--><wa-select label=\"Family *\" name=\"familyId\" required",
	"><wa-option value>Select a family...</wa-option><!--$-->",
	"<!--/--></wa-select><!--$-->",
	"<!--/--><wa-input label=\"Date *\" name=\"startDate\" type=\"date\" required",
	"></wa-input><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><wa-input label=\"Start Time *\" name=\"startTime\" type=\"time\" required",
	"></wa-input><wa-input label=\"End Time *\" name=\"endTime\" type=\"time\" required></wa-input></div><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button type=\"button\" appearance=\"outlined\">Cancel</wa-button><wa-button type=\"submit\" variant=\"success\" appearance=\"filled\"",
	">",
	"</wa-button></div></form>"
];
var _tmpl$19 = ["<wa-button", " variant=\"success\" appearance=\"filled\">+ Add Care Session</wa-button>"];
var _tmpl$20 = [
	"<button",
	" style=\"",
	"\">",
	"</button>"
];
var _tmpl$21 = [
	"<p",
	" style=\"",
	"\">No sessions</p>"
];
var _tmpl$22 = [
	"<a",
	" href=\"",
	"\" style=\"",
	"\"><div style=\"",
	"\">",
	"</div><div style=\"",
	"\"><!--$-->",
	"<!--/--> - <!--$-->",
	"<!--/--></div><div style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div></a>"
];
var _tmpl$23 = [
	"<div",
	" style=\"",
	"\">Loading...</div>"
];
var _tmpl$24 = [
	"<div",
	" style=\"",
	"\">No upcoming sessions scheduled</div>"
];
var _tmpl$25 = [
	"<a",
	" href=\"",
	"\" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><h3 class=\"wa-heading-s\">",
	"</h3><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div><div style=\"",
	"\">",
	"</div></div><div style=\"",
	"\"><div style=\"",
	"\">",
	"</div><div style=\"",
	"\">",
	"</div></div></div></a>"
];
var _tmpl$26 = ["<wa-badge", " variant=\"success\" appearance=\"filled-outlined\" pill>✓ Confirmed</wa-badge>"];
var _tmpl$27 = [
	"<div",
	" style=\"",
	"\">No recent incidents or reports</div>"
];
var _tmpl$28 = [
	"<a",
	" href=\"",
	"\" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><span style=\"",
	"\">",
	"</span><h3 style=\"",
	"\">",
	"</h3><span style=\"",
	"\">",
	"</span><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--> • <!--$-->",
	"<!--/--></div><div style=\"",
	"\">",
	"</div></div><div style=\"",
	"\"><div style=\"",
	"\">",
	"</div><div style=\"",
	"\">",
	"</div></div></div></a>"
];
var _tmpl$29 = [
	"<span",
	" style=\"",
	"\">Follow-up Needed</span>"
];
var _tmpl$30 = ["<div", " class=\"wa-color-text-quiet\">Loading services...</div>"];
var _tmpl$31 = ["<wa-option", " value>Select a service...</wa-option>"];
var _tmpl$32 = [
	"<wa-option",
	"",
	"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></wa-option>"
];
var _tmpl$33 = [
	"<wa-option",
	"",
	">",
	"</wa-option>"
];
var _tmpl$34 = [
	"<div",
	" style=\"",
	"\"><label style=\"",
	"\">",
	"</label><div style=\"",
	"\">",
	"</div></div>"
];
var _tmpl$35 = [
	"<label",
	" style=\"",
	"\"><input type=\"checkbox\" name=\"childIds\"",
	" style=\"",
	"\"><span><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></span></label>"
];
function Home() {
	var _v$, _v$2, _v$3, _v$4, _v$5, _v$6, _v$9, _v$10, _v$13, _v$14, _v$17, _v$18, _v$7, _v$8, _v$11, _v$12, _v$15, _v$16, _v$19, _v$29, _v$30, _v$40, _v$41, _v$20, _g$2, _v$31, _g$, _v$42, _v$44, _v$45, _v$46, _v$48, _v$49, _v$52, _v$53, _v$54, _v$55, _v$56, _v$57, _v$43, _v$47, _v$50, _v$51, _v$58, _v$60, _v$61, _v$63, _v$64, _v$59, _v$62, _v$65, _v$68, _v$69, _v$70, _v$71, _v$72, _v$79, _v$80, _v$66, _v$73, _v$74, _v$75, _v$76, _v$77, _v$78, _v$81, _v$82, _v$83, _v$67;
	const user = createMemo(() => getUser());
	const isOwner = () => user()?.isOwner ?? false;
	const upcomingSessions = createMemo(() => getUpcomingSessions(10));
	const recentIncidents = createMemo(() => getRecentReports(10));
	const families = createMemo(() => getFamilies());
	const services = createMemo(() => getServices());
	createMemo(() => getWeeklyStats());
	const dashboardStats = createMemo(() => getDashboardStats());
	const [hoursPeriod, setHoursPeriod] = createSignal("thisWeek");
	const [moneyPeriod, setMoneyPeriod] = createSignal("thisWeek");
	const hoursStats = createMemo(() => getStatsForPeriod(hoursPeriod()));
	const moneyStats = createMemo(() => getStatsForPeriod(moneyPeriod()));
	const [showQuickAddModal, setShowQuickAddModal] = createSignal(false);
	const [selectedFamilyId, setSelectedFamilyId] = createSignal("");
	const [selectedDate, setSelectedDate] = createSignal("");
	const [calendarMonth, setCalendarMonth] = createSignal(/* @__PURE__ */ new Date());
	const today = /* @__PURE__ */ new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);
	const yesterdaySessions = createMemo(() => getSessionsForDay(yesterday));
	const todaySessions = createMemo(() => getSessionsForDay(today));
	const tomorrowSessions = createMemo(() => getSessionsForDay(tomorrow));
	const selectedFamily = createMemo(() => {
		const id = selectedFamilyId();
		return id ? getFamily(id) : null;
	});
	const defaultServiceId = () => {
		const family = selectedFamily();
		if (family?.services && family.services.length > 0) return family.services[0].service.id;
		const allServices = services();
		if (allServices && allServices.length > 0) return allServices[0].id;
		return "";
	};
	const [serviceId, setServiceId] = createSignal("");
	createEffect(() => {
		const family = selectedFamily();
		const allServices = services();
		const currentServiceId = serviceId();
		if (allServices && allServices.length > 0) {
			const defaultId = defaultServiceId();
			if (!currentServiceId || currentServiceId === "" || family && defaultId && defaultId !== currentServiceId) {
				if (defaultId) setServiceId(defaultId);
				else if (allServices.length > 0) setServiceId(allServices[0].id);
			}
		}
	});
	const submission = useSubmission(createCareSchedule);
	const getCurrentDate = () => {
		return selectedDate() || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	};
	const getCurrentTime = () => {
		const now = /* @__PURE__ */ new Date();
		return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
	};
	const handleCloseModal = () => {
		setShowQuickAddModal(false);
		setSelectedFamilyId("");
		setSelectedDate("");
	};
	const getCalendarDays = () => {
		const month = calendarMonth();
		const year = month.getFullYear();
		const monthIndex = month.getMonth();
		const firstDay = new Date(year, monthIndex, 1);
		new Date(year, monthIndex + 1, 0);
		const startDate = new Date(firstDay);
		startDate.setDate(startDate.getDate() - startDate.getDay());
		const days = [];
		const current = new Date(startDate);
		for (let i = 0; i < 42; i++) {
			days.push(new Date(current));
			current.setDate(current.getDate() + 1);
		}
		return days;
	};
	const isToday = (date) => {
		const today = /* @__PURE__ */ new Date();
		return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
	};
	const isCurrentMonth = (date) => {
		const month = calendarMonth();
		return date.getMonth() === month.getMonth();
	};
	createEffect(() => {
		if (submission.result && !(submission.result instanceof Error)) {
			handleCloseModal();
			window.location.reload();
		}
	});
	return PageContent({ get children() {
		return [
			PageHeader({
				title: "Dashboard",
				get description() {
					return memo(() => {
						return !!user();
					})() ? `Welcome back, ${user()?.firstName || user()?.username}` : void 0;
				},
				get actions() {
					var _v$84;
					return Show({
						get when() {
							return isOwner();
						},
						get children() {
							return _v$84 = ssrHydrationKey(), ssr(_tmpl$19, _v$84);
						}
					});
				}
			}),
			Show({
				get when() {
					return memo(() => {
						return !!(user() && !isOwner());
					})() ? user().familyId : user() && !isOwner();
				},
				get children() {
					return _v$ = ssrHydrationKey(), _v$2 = () => {
						return `/families/${escape(user().familyId, true)}`;
					}, ssr(_tmpl$, _v$, _v$2);
				}
			}),
			(_v$3 = ssrHydrationKey(), _v$4 = scope(() => {
				return escape(calendarMonth().toLocaleDateString("en-US", {
					month: "long",
					year: "numeric"
				}));
			}), _v$5 = escape(For({
				each: [
					"Sun",
					"Mon",
					"Tue",
					"Wed",
					"Thu",
					"Fri",
					"Sat"
				],
				children: (day) => {
					var _v$85, _v$86;
					return _v$85 = ssrHydrationKey(), _v$86 = escape(day), ssr(_tmpl$3, _v$85, ssrStyleProperty("padding:", "0.25rem") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$86);
				}
			})), _v$6 = escape(For({
				get each() {
					return getCalendarDays();
				},
				children: (day) => {
					const isCurrentMonthDay = isCurrentMonth(day);
					const isTodayDay = isToday(day);
					var _v$87 = ssrHydrationKey(), _v$88 = () => {
						return ssrStyleProperty("padding:", "0.5rem") + ssrStyleProperty(";background-color:", isTodayDay ? "var(--wa-color-brand-fill-normal)" : isCurrentMonthDay ? "var(--color-surface)" : "var(--color-surface-muted)") + ssrStyleProperty(";color:", isCurrentMonthDay ? "var(--color-text)" : "var(--color-text-subtle)") + ssrStyleProperty(";border:", isTodayDay ? "2px solid #4299e1" : "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", isOwner() ? "pointer" : "default") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", isTodayDay ? "700" : "400") + ssrStyleProperty(";transition:", "all 0.2s") + ssrStyleProperty(";min-height:", "32px") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";justify-content:", "center");
					}, _v$89 = scope(() => {
						return escape(day.getDate());
					});
					return ssr(_tmpl$20, _v$87, _v$88, _v$89);
				}
			})), ssr(_tmpl$2, _v$3, ssrStyleProperty("max-width:", "350px"), ssrStyleProperty("margin-bottom:", "var(--wa-space-s)"), ssrStyleProperty("margin:", 0) + ssrStyleProperty(";flex:", 1) + ssrStyleProperty(";text-align:", "center"), _v$4, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(7, 1fr)") + ssrStyleProperty(";gap:", "0.25rem"), _v$5, _v$6)),
			(_v$7 = ssrHydrationKey(), _v$8 = () => {
				return escape(yesterdaySessions()?.length || 0);
			}, _v$11 = escape(Show({
				get when() {
					return memo(() => {
						return !!yesterdaySessions();
					})() ? yesterdaySessions().length > 0 : yesterdaySessions();
				},
				get fallback() {
					var _v$90 = ssrHydrationKey();
					return ssr(_tmpl$21, _v$90, ssrStyleProperty("color:", "var(--color-text-subtle)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";padding:", "0.75rem"));
				},
				get children() {
					return _v$9 = ssrHydrationKey(), _v$10 = escape(For({
						get each() {
							return yesterdaySessions();
						},
						children: (session) => {
							var _v$91, _v$92, _v$93, _v$94, _v$95, _v$96, _v$97;
							return _v$91 = ssrHydrationKey(), _v$92 = () => {
								return `/families/${escape(session.family.id, true)}/sessions/${escape(session.id, true)}`;
							}, _v$93 = () => {
								return escape(session.family.familyName);
							}, _v$94 = scope(() => {
								return escape(formatTimeLocal(session.scheduledStart));
							}), _v$95 = scope(() => {
								return escape(formatTimeLocal(session.scheduledEnd));
							}), _v$96 = () => {
								return escape(session.service.name);
							}, _v$97 = (() => {
								var _c$ = memo(() => {
									return session.children.length > 0;
								});
								return () => {
									return _c$() && ` • ${escape(session.children.length)} child${session.children.length > 1 ? "ren" : ""}`;
								};
							})(), ssr(_tmpl$22, _v$91, _v$92, ssrStyleProperty("padding:", "0.5rem 0.75rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";color:", "inherit") + ssrStyleProperty(";transition:", "all 0.2s"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin-bottom:", "0.125rem") + ssrStyleProperty(";font-size:", "0.875rem"), _v$93, ssrStyleProperty("font-size:", "0.8125rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$94, _v$95, ssrStyleProperty("font-size:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text-subtle)") + ssrStyleProperty(";margin-top:", "0.125rem"), _v$96, _v$97);
						}
					})), ssr(_tmpl$3, _v$9, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.375rem"), _v$10);
				}
			})), _v$12 = () => {
				return escape(todaySessions()?.length || 0);
			}, _v$15 = escape(Show({
				get when() {
					return memo(() => {
						return !!todaySessions();
					})() ? todaySessions().length > 0 : todaySessions();
				},
				get fallback() {
					var _v$98 = ssrHydrationKey();
					return ssr(_tmpl$21, _v$98, ssrStyleProperty("color:", "var(--color-text-subtle)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";padding:", "0.75rem"));
				},
				get children() {
					return _v$13 = ssrHydrationKey(), _v$14 = escape(For({
						get each() {
							return todaySessions();
						},
						children: (session) => {
							var _v$99, _v$100, _v$101, _v$102, _v$103, _v$104, _v$105;
							return _v$99 = ssrHydrationKey(), _v$100 = () => {
								return `/families/${escape(session.family.id, true)}/sessions/${escape(session.id, true)}`;
							}, _v$101 = () => {
								return escape(session.family.familyName);
							}, _v$102 = scope(() => {
								return escape(formatTimeLocal(session.scheduledStart));
							}), _v$103 = scope(() => {
								return escape(formatTimeLocal(session.scheduledEnd));
							}), _v$104 = () => {
								return escape(session.service.name);
							}, _v$105 = (() => {
								var _c$2 = memo(() => {
									return session.children.length > 0;
								});
								return () => {
									return _c$2() && ` • ${escape(session.children.length)} child${session.children.length > 1 ? "ren" : ""}`;
								};
							})(), ssr(_tmpl$22, _v$99, _v$100, ssrStyleProperty("padding:", "0.5rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";color:", "inherit") + ssrStyleProperty(";transition:", "all 0.2s"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin-bottom:", "0.125rem") + ssrStyleProperty(";font-size:", "0.875rem"), _v$101, ssrStyleProperty("font-size:", "0.8125rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$102, _v$103, ssrStyleProperty("font-size:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text-subtle)") + ssrStyleProperty(";margin-top:", "0.125rem"), _v$104, _v$105);
						}
					})), ssr(_tmpl$3, _v$13, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.5rem"), _v$14);
				}
			})), _v$16 = () => {
				return escape(tomorrowSessions()?.length || 0);
			}, _v$19 = escape(Show({
				get when() {
					return memo(() => {
						return !!tomorrowSessions();
					})() ? tomorrowSessions().length > 0 : tomorrowSessions();
				},
				get fallback() {
					var _v$106 = ssrHydrationKey();
					return ssr(_tmpl$21, _v$106, ssrStyleProperty("color:", "var(--color-text-subtle)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";padding:", "0.75rem"));
				},
				get children() {
					return _v$17 = ssrHydrationKey(), _v$18 = escape(For({
						get each() {
							return tomorrowSessions();
						},
						children: (session) => {
							var _v$107, _v$108, _v$109, _v$110, _v$111, _v$112, _v$113;
							return _v$107 = ssrHydrationKey(), _v$108 = () => {
								return `/families/${escape(session.family.id, true)}/sessions/${escape(session.id, true)}`;
							}, _v$109 = () => {
								return escape(session.family.familyName);
							}, _v$110 = scope(() => {
								return escape(formatTimeLocal(session.scheduledStart));
							}), _v$111 = scope(() => {
								return escape(formatTimeLocal(session.scheduledEnd));
							}), _v$112 = () => {
								return escape(session.service.name);
							}, _v$113 = (() => {
								var _c$3 = memo(() => {
									return session.children.length > 0;
								});
								return () => {
									return _c$3() && ` • ${escape(session.children.length)} child${session.children.length > 1 ? "ren" : ""}`;
								};
							})(), ssr(_tmpl$22, _v$107, _v$108, ssrStyleProperty("padding:", "0.5rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";color:", "inherit") + ssrStyleProperty(";transition:", "all 0.2s"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin-bottom:", "0.125rem") + ssrStyleProperty(";font-size:", "0.875rem"), _v$109, ssrStyleProperty("font-size:", "0.8125rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$110, _v$111, ssrStyleProperty("font-size:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text-subtle)") + ssrStyleProperty(";margin-top:", "0.125rem"), _v$112, _v$113);
						}
					})), ssr(_tmpl$3, _v$17, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.5rem"), _v$18);
				}
			})), ssr(_tmpl$4, _v$7, ssrStyleProperty("--min-column-size:", "280px"), ssrStyleProperty("margin-bottom:", "var(--wa-space-m)"), _v$8, _v$11, ssrStyleProperty("border:", "2px solid var(--wa-color-brand-50)"), ssrStyleProperty("margin-bottom:", "var(--wa-space-m)"), _v$12, _v$15, ssrStyleProperty("margin-bottom:", "var(--wa-space-m)"), _v$16, _v$19)),
			Show({
				get when() {
					return isOwner();
				},
				get children() {
					return _v$20 = ssrHydrationKey(), _g$2 = ssrGroup(() => {
						return [
							ssrAttribute("appearance", hoursPeriod() === "lastWeek" ? "filled" : "outlined"),
							ssrAttribute("variant", hoursPeriod() === "lastWeek" ? "brand" : "neutral"),
							ssrAttribute("appearance", hoursPeriod() === "thisWeek" ? "filled" : "outlined"),
							ssrAttribute("variant", hoursPeriod() === "thisWeek" ? "brand" : "neutral"),
							ssrAttribute("appearance", hoursPeriod() === "month" ? "filled" : "outlined"),
							ssrAttribute("variant", hoursPeriod() === "month" ? "brand" : "neutral"),
							ssrAttribute("appearance", hoursPeriod() === "ytd" ? "filled" : "outlined"),
							ssrAttribute("variant", hoursPeriod() === "ytd" ? "brand" : "neutral")
						];
					}, 8), _v$31 = escape(Show({
						get when() {
							return hoursStats();
						},
						get children() {
							return _v$29 = ssrHydrationKey(), _v$30 = scope(() => {
								return escape(hoursDisplay(hoursStats()?.hours));
							}), ssr(_tmpl$5, _v$29, _v$30);
						}
					})), _g$ = ssrGroup(() => {
						return [
							ssrAttribute("appearance", moneyPeriod() === "lastWeek" ? "filled" : "outlined"),
							ssrAttribute("variant", moneyPeriod() === "lastWeek" ? "brand" : "neutral"),
							ssrAttribute("appearance", moneyPeriod() === "thisWeek" ? "filled" : "outlined"),
							ssrAttribute("variant", moneyPeriod() === "thisWeek" ? "brand" : "neutral"),
							ssrAttribute("appearance", moneyPeriod() === "month" ? "filled" : "outlined"),
							ssrAttribute("variant", moneyPeriod() === "month" ? "brand" : "neutral"),
							ssrAttribute("appearance", moneyPeriod() === "ytd" ? "filled" : "outlined"),
							ssrAttribute("variant", moneyPeriod() === "ytd" ? "brand" : "neutral")
						];
					}, 8), _v$42 = escape(Show({
						get when() {
							return moneyStats();
						},
						get children() {
							return _v$40 = ssrHydrationKey(), _v$41 = scope(() => {
								return escape(formatMoneyDisplay(moneyStats()?.money));
							}), ssr(_tmpl$6, _v$40, ssrStyleProperty("color:", "var(--wa-color-success-40)"), _v$41);
						}
					})), ssr(_tmpl$7, _v$20, ssrStyleProperty("--min-column-size:", "280px"), ssrStyleProperty("margin-bottom:", "var(--wa-space-s)"), _g$2, _g$2, _g$2, _g$2, _g$2, _g$2, _g$2, _g$2, _v$31, ssrStyleProperty("margin-bottom:", "var(--wa-space-s)"), _g$, _g$, _g$, _g$, _g$, _g$, _g$, _g$, _v$42);
				}
			}),
			Show({
				get when() {
					return dashboardStats();
				},
				get children() {
					return _v$43 = ssrHydrationKey(), _v$47 = escape(Show({
						get when() {
							return isOwner();
						},
						get children() {
							return _v$44 = ssrHydrationKey(), _v$45 = scope(() => {
								return escape(hoursDisplay(dashboardStats()?.thisMonthHours));
							}), _v$46 = scope(() => {
								return escape(formatMoneyDisplay(dashboardStats()?.thisMonthMoney));
							}), ssr(_tmpl$8, _v$44, _v$45, _v$46);
						}
					})), _v$50 = escape(Show({
						get when() {
							return !isOwner();
						},
						get children() {
							return _v$48 = ssrHydrationKey(), _v$49 = scope(() => {
								return escape(hoursDisplay(dashboardStats()?.thisMonthHours));
							}), ssr(_tmpl$9, _v$48, _v$49);
						}
					})), _v$51 = () => {
						return escape(dashboardStats()?.upcomingSessions || 0);
					}, _v$58 = escape(Show({
						get when() {
							return isOwner();
						},
						get children() {
							return [
								(_v$52 = ssrHydrationKey(), _v$53 = () => {
									return escape(dashboardStats()?.unpaidSessions || 0);
								}, ssr(_tmpl$10, _v$52, ssrStyleProperty("color:", "var(--wa-color-warning-40)"), _v$53)),
								(_v$54 = ssrHydrationKey(), _v$55 = () => {
									return escape(dashboardStats()?.activeFamilies || 0);
								}, ssr(_tmpl$11, _v$54, _v$55)),
								Show({
									get when() {
										return Number(moneyDisplay(dashboardStats()?.averageHourlyRate)) > 0;
									},
									get children() {
										return _v$56 = ssrHydrationKey(), _v$57 = scope(() => {
											return escape(formatMoneyDisplay(dashboardStats()?.averageHourlyRate));
										}), ssr(_tmpl$12, _v$56, _v$57);
									}
								})
							];
						}
					})), ssr(_tmpl$13, _v$43, ssrStyleProperty("--min-column-size:", "180px"), _v$47, _v$50, ssrStyleProperty("color:", "var(--wa-color-brand-50)"), _v$51, _v$58);
				}
			}),
			(_v$59 = ssrHydrationKey(), _v$62 = escape(Show({
				get when() {
					return memo(() => {
						return !upcomingSessions.loading;
					})() && upcomingSessions();
				},
				get fallback() {
					var _v$114 = ssrHydrationKey();
					return ssr(_tmpl$23, _v$114, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
				},
				get children() {
					return Show({
						get when() {
							return upcomingSessions()?.length;
						},
						get fallback() {
							var _v$115 = ssrHydrationKey();
							return ssr(_tmpl$24, _v$115, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
						},
						get children() {
							return _v$60 = ssrHydrationKey(), _v$61 = escape(For({
								get each() {
									return upcomingSessions();
								},
								children: (session) => {
									const sessionDate = ensureDate(session.scheduledStart);
									const today = /* @__PURE__ */ new Date();
									const tomorrow = new Date(today);
									tomorrow.setDate(tomorrow.getDate() + 1);
									const isToday = isSameDay(sessionDate, today);
									const isTomorrow = isSameDay(sessionDate, tomorrow);
									var _v$116 = ssrHydrationKey(), _v$117 = () => {
										return `/families/${escape(session.familyId, true)}/sessions/${escape(session.id, true)}`;
									}, _v$118 = () => {
										return escape(session.family.familyName);
									}, _v$119 = escape(SessionStatusBadge({ get status() {
										return session.status;
									} })), _v$120 = scope((() => {
										var _c$4 = memo(() => {
											return !!session.isConfirmed;
										});
										return () => {
											var _v$124;
											return _c$4() ? (_v$124 = ssrHydrationKey(), ssr(_tmpl$26, _v$124)) : escape(session.isConfirmed);
										};
									})()), _v$121 = scope(() => {
										return escape(session.children.map((c) => c.firstName).join(", "));
									}), _v$122 = scope(() => {
										return isToday ? "Today" : isTomorrow ? "Tomorrow" : escape(sessionDate.toLocaleDateString("en-US", {
											weekday: "short",
											month: "short",
											day: "numeric"
										}));
									}), _v$123 = scope(() => {
										return escape(formatTimeLocal(sessionDate));
									});
									return ssr(_tmpl$25, _v$116, _v$117, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "6px") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";color:", "inherit") + ssrStyleProperty(";display:", "block") + ssrStyleProperty(";transition:", "all 0.2s"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "start") + ssrStyleProperty(";margin-bottom:", "0.375rem"), ssrStyleProperty("flex:", 1), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";margin-bottom:", "0.25rem"), _v$118, _v$119, _v$120, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text)"), _v$121, ssrStyleProperty("text-align:", "right"), ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", isToday ? "#e53e3e" : isTomorrow ? "#ed8936" : "var(--color-text)"), _v$122, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$123);
								}
							})), ssr(_tmpl$3, _v$60, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.5rem"), _v$61);
						}
					});
				}
			})), _v$65 = escape(Show({
				get when() {
					return memo(() => {
						return !recentIncidents.loading;
					})() && recentIncidents();
				},
				get fallback() {
					var _v$125 = ssrHydrationKey();
					return ssr(_tmpl$23, _v$125, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
				},
				get children() {
					return Show({
						get when() {
							return recentIncidents()?.length;
						},
						get fallback() {
							var _v$126 = ssrHydrationKey();
							return ssr(_tmpl$27, _v$126, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "1.5rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
						},
						get children() {
							return _v$63 = ssrHydrationKey(), _v$64 = escape(For({
								get each() {
									return recentIncidents();
								},
								children: (report) => {
									const severityColors = {
										INFO: {
											bg: "#e6fffa",
											color: "#234e52",
											icon: "ℹ️"
										},
										MINOR: {
											bg: "#feebc8",
											color: "#7c2d12",
											icon: "⚠️"
										},
										MODERATE: {
											bg: "#fed7aa",
											color: "#7c2d12",
											icon: "⚡"
										},
										SEVERE: {
											bg: "var(--wa-color-danger-fill-normal)",
											color: "#c53030",
											icon: "🚨"
										}
									}[report.severity] || {
										bg: "var(--color-border)",
										color: "var(--color-text)",
										icon: "📝"
									};
									const typeLabels = {
										INCIDENT: "Incident",
										ACCIDENT: "Accident",
										BEHAVIOR: "Behavior",
										MEAL: "Meal",
										NAP: "Nap",
										ACTIVITY: "Activity",
										MEDICATION: "Medication",
										MILESTONE: "Milestone",
										GENERAL: "General"
									};
									const reportDate = new Date(report.timestamp);
									const isToday = reportDate.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
									var _v$127 = ssrHydrationKey(), _v$128 = () => {
										return `/families/${escape(report.careSession.family.id, true)}/sessions/${escape(report.careSessionId, true)}`;
									}, _v$129 = () => {
										return escape(severityColors.icon);
									}, _v$130 = () => {
										return escape(report.title);
									}, _v$131 = () => {
										return ssrStyleProperty("padding:", "0.125rem 0.5rem") + ssrStyleProperty(";border-radius:", "9999px") + ssrStyleProperty(";background-color:", escape(severityColors.bg, true)) + ssrStyleProperty(";color:", escape(severityColors.color, true)) + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", "600");
									}, _v$132 = () => {
										return escape(typeLabels[report.type] || report.type);
									}, _v$133 = scope((() => {
										var _c$5 = memo(() => {
											return !!report.followUpNeeded;
										});
										return () => {
											var _v$140;
											return _c$5() ? (_v$140 = ssrHydrationKey(), ssr(_tmpl$29, _v$140, ssrStyleProperty("padding:", "0.125rem 0.5rem") + ssrStyleProperty(";border-radius:", "9999px") + ssrStyleProperty(";background-color:", "var(--wa-color-danger-fill-normal)") + ssrStyleProperty(";color:", "#c53030") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", "600"))) : escape(report.followUpNeeded);
										};
									})()), _v$134 = () => {
										return escape(report.child.firstName);
									}, _v$135 = () => {
										return escape(report.child.lastName);
									}, _v$136 = () => {
										return escape(report.careSession.family.familyName);
									}, _v$137 = (() => {
										var _c$6 = memo(() => {
											return report.description.length > 100;
										});
										return () => {
											return _c$6() ? `${escape(report.description.substring(0, 100))}...` : escape(report.description);
										};
									})(), _v$138 = scope(() => {
										return isToday ? "Today" : escape(reportDate.toLocaleDateString("en-US", {
											month: "short",
											day: "numeric"
										}));
									}), _v$139 = scope(() => {
										return escape(formatTimeLocal(reportDate));
									});
									return ssr(_tmpl$28, _v$127, _v$128, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "6px") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";color:", "inherit") + ssrStyleProperty(";display:", "block") + ssrStyleProperty(";transition:", "all 0.2s"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "start") + ssrStyleProperty(";margin-bottom:", "0.375rem"), ssrStyleProperty("flex:", 1), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";margin-bottom:", "0.25rem"), ssrStyleProperty("font-size:", "1.25rem"), _v$129, ssrStyleProperty("font-size:", "1rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin:", 0) + ssrStyleProperty(";font-weight:", "600"), _v$130, _v$131, _v$132, _v$133, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text)"), _v$134, _v$135, _v$136, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";margin-top:", "0.25rem"), _v$137, ssrStyleProperty("text-align:", "right"), ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", isToday ? "#e53e3e" : "var(--color-text-muted)") + ssrStyleProperty(";font-weight:", isToday ? "600" : "400"), _v$138, ssrStyleProperty("font-size:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text-subtle)"), _v$139);
								}
							})), ssr(_tmpl$3, _v$63, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.5rem"), _v$64);
						}
					});
				}
			})), ssr(_tmpl$14, _v$59, ssrStyleProperty("--min-column-size:", "280px"), ssrStyleProperty("margin-bottom:", "var(--wa-space-s)"), _v$62, ssrStyleProperty("margin-bottom:", "var(--wa-space-s)"), _v$65)),
			Show({
				get when() {
					return isOwner();
				},
				get children() {
					return Dialog({
						get open() {
							return showQuickAddModal();
						},
						title: "Quick Add Session",
						onClose: handleCloseModal,
						get children() {
							return _v$66 = ssrHydrationKey(), _v$73 = escape(Show({
								get when() {
									return services();
								},
								get fallback() {
									var _v$141 = ssrHydrationKey();
									return ssr(_tmpl$30, _v$141);
								},
								get children() {
									return [(_v$68 = ssrHydrationKey(), _v$69 = () => {
										return ssrAttribute("value", escape(serviceId(), true));
									}, _v$70 = escape(Show({
										get when() {
											return memo(() => {
												return !!selectedFamily()?.services;
											})() ? selectedFamily().services.length > 0 : selectedFamily()?.services;
										},
										get fallback() {
											var _v$142;
											return [(_v$142 = ssrHydrationKey(), ssr(_tmpl$31, _v$142)), For({
												get each() {
													return services();
												},
												children: (service) => {
													var _v$143, _v$144, _v$145, _v$146;
													return _v$143 = ssrHydrationKey(), _v$144 = () => {
														return ssrAttribute("value", escape(service.id, true));
													}, _v$145 = () => {
														return escape(service.name);
													}, _v$146 = (() => {
														var _c$7 = memo(() => {
															return !!service.defaultHourlyRate;
														});
														return () => {
															return _c$7() ? ` ($${escape(service.defaultHourlyRate)}/hr${service.pricingType === "PER_CHILD" ? " per child" : ""})` : escape(service.defaultHourlyRate);
														};
													})(), ssr(_tmpl$32, _v$143, _v$144, _v$145, _v$146);
												}
											})];
										},
										get children() {
											return For({
												get each() {
													return selectedFamily()?.services || [];
												},
												children: (fs) => {
													var _v$147, _v$148, _v$149, _v$150;
													return _v$147 = ssrHydrationKey(), _v$148 = () => {
														return ssrAttribute("value", escape(fs.service.id, true));
													}, _v$149 = () => {
														return escape(fs.service.name);
													}, _v$150 = (() => {
														var _c$8 = memo(() => {
															return !!fs.service.defaultHourlyRate;
														});
														return () => {
															return _c$8() ? ` ($${escape(fs.service.defaultHourlyRate)}/hr${fs.service.pricingType === "PER_CHILD" ? " per child" : ""})` : escape(fs.service.defaultHourlyRate);
														};
													})(), ssr(_tmpl$32, _v$147, _v$148, _v$149, _v$150);
												}
											});
										}
									})), ssr(_tmpl$15, _v$68, _v$69, _v$70)), Show({
										get when() {
											return memo(() => {
												return !!selectedFamilyId();
											})() ? !selectedFamily()?.services || selectedFamily().services.length === 0 : selectedFamilyId();
										},
										get children() {
											return _v$71 = ssrHydrationKey(), _v$72 = () => {
												return `/families/${escape(selectedFamilyId(), true)}/edit`;
											}, ssr(_tmpl$16, _v$71, _v$72);
										}
									})];
								}
							})), _v$74 = () => {
								return ssrAttribute("value", escape(selectedFamilyId(), true));
							}, _v$75 = escape(For({
								get each() {
									return families();
								},
								children: (family) => {
									var _v$151, _v$152, _v$153;
									return _v$151 = ssrHydrationKey(), _v$152 = () => {
										return ssrAttribute("value", escape(family.id, true));
									}, _v$153 = () => {
										return escape(family.familyName);
									}, ssr(_tmpl$33, _v$151, _v$152, _v$153);
								}
							})), _v$76 = escape(Show({
								get when() {
									return memo(() => {
										return !!selectedFamilyId();
									})() ? selectedFamily() : selectedFamilyId();
								},
								children: (family) => {
									var _v$154, _v$155, _v$156;
									return Show({
										get when() {
											return !(services()?.find((s) => s.id === serviceId()))?.requiresChildren || family().children.length > 0;
										},
										get children() {
											return _v$154 = ssrHydrationKey(), _v$155 = scope(() => {
												return (() => {
													return (services()?.find((s) => s.id === serviceId()))?.requiresChildren ? "Children *" : "Student (optional)";
												})();
											}), _v$156 = escape(For({
												get each() {
													return family().children;
												},
												children: (child) => {
													var _v$157, _v$159, _v$160, _v$161, _v$158;
													return _v$157 = ssrHydrationKey(), _v$159 = () => {
														return escape(child.firstName);
													}, _v$160 = () => {
														return escape(child.lastName);
													}, _v$161 = () => {
														return child.allergies && " ⚠️";
													}, _v$158 = () => {
														return ssrAttribute("value", escape(child.id, true));
													}, ssr(_tmpl$35, _v$157, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";transition:", "background-color 0.2s"), _v$158, ssrStyleProperty("width:", "1.25rem") + ssrStyleProperty(";height:", "1.25rem") + ssrStyleProperty(";cursor:", "pointer"), _v$159, _v$160, _v$161);
												}
											})), ssr(_tmpl$34, _v$154, ssrStyleProperty("margin-bottom:", "1.5rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$155, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.5rem"), _v$156);
										}
									});
								}
							})), _v$77 = () => {
								return ssrAttribute("value", escape(getCurrentDate(), true));
							}, _v$78 = () => {
								return ssrAttribute("value", escape(getCurrentTime(), true));
							}, _v$81 = escape(Show({
								get when() {
									return submission.result instanceof Error;
								},
								get children() {
									return _v$79 = ssrHydrationKey(), _v$80 = () => {
										return escape(submission.result.message);
									}, ssr(_tmpl$17, _v$79, _v$80);
								}
							})), _v$82 = () => {
								return ssrAttribute("disabled", escape(submission.pending || void 0, true));
							}, _v$83 = () => {
								return submission.pending ? "Creating..." : "Create Session";
							}, _v$67 = () => {
								return ssrAttribute("value", escape((/* @__PURE__ */ new Date()).getTimezoneOffset(), true) * -1);
							}, ssr(_tmpl$18, _v$66, ssrAttribute("action", escape(createCareSchedule, true)), _v$67, _v$73, _v$74, _v$75, _v$76, _v$77, ssrStyleProperty("--min-column-size:", "140px"), _v$78, _v$81, ssrStyleProperty("justify-content:", "flex-end"), _v$82, _v$83);
						}
					});
				}
			})
		];
	} });
}
//#endregion
export { Home as default };
