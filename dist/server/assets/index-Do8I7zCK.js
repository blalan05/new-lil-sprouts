import { C as getServices, Q as getFamily, Tt as useSubmission, Z as getFamilies, a as createCareSchedule, at as getCareSessionsForRange, bt as Dialog, mt as isSameDay, pt as formatTimeLocal, r as getUpcomingUnavailabilities, st as getUnavailabilitiesForRange, ut as ensureDate, yt as useConfirm } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { n as SessionStatusBadge } from "./StatusBadge-Zr2kRO1T.js";
import { escape, memo, scope, ssr, ssrAttribute, ssrClassName, ssrGroup, ssrHydrationKey, ssrStyle, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createEffect, createMemo, createSignal, onSettled } from "solid-js";
//#region src/components/ClientTime.tsx
var _tmpl$$1 = [
	"<span",
	" class=\"",
	"\" style=\"",
	"\">",
	"</span>"
];
var _tmpl$2$1 = [
	"<span",
	" class=\"",
	"\" style=\"",
	"\">\xA0</span>"
];
function ClientTime(props) {
	var _v$, _g$, _v$4;
	const [formattedTime, setFormattedTime] = createSignal("");
	const [mounted, setMounted] = createSignal(false);
	onSettled(() => {
		setMounted(true);
		if (props.date) {
			const date = typeof props.date === "string" ? new Date(props.date) : ensureDate(props.date);
			if (isNaN(date.getTime())) {
				console.error("[ClientTime] Invalid date:", props.date);
				setFormattedTime("");
				return;
			}
			setFormattedTime(formatTimeLocal(date));
		}
	});
	createEffect(() => [mounted(), props.date], ([isMounted, dateValue]) => {
		if (!isMounted || !dateValue) return;
		const date = typeof dateValue === "string" ? new Date(dateValue) : ensureDate(dateValue);
		if (!isNaN(date.getTime())) setFormattedTime(formatTimeLocal(date));
	});
	return Show({
		get when() {
			return mounted();
		},
		get fallback() {
			var _v$5 = ssrHydrationKey(), _g$2 = ssrGroup(() => {
				return [ssrClassName(props.class), ssrStyle(props.style)];
			}, 2);
			return ssr(_tmpl$2$1, _v$5, _g$2, _g$2);
		},
		get children() {
			return _v$ = ssrHydrationKey(), _g$ = ssrGroup(() => {
				return [ssrClassName(props.class), ssrStyle(props.style)];
			}, 2), _v$4 = scope(() => {
				return escape(formattedTime());
			}), ssr(_tmpl$$1, _v$, _g$, _g$, _v$4);
		}
	});
}
//#endregion
//#region src/routes/schedule/index.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<div",
	" class=\"wa-cluster wa-gap-s\"><wa-button appearance=\"outlined\">←</wa-button><wa-button variant=\"brand\" appearance=\"filled\">Today</wa-button><wa-button appearance=\"outlined\">→</wa-button><span class=\"wa-body-m\">",
	"</span></div>"
];
var _tmpl$2 = [
	"<div",
	" class=\"wa-flank wa-gap-m calendar-controls flex-row-mobile\" style=\"",
	"\"><div class=\"wa-cluster wa-gap-s calendar-view-buttons\"><wa-button",
	"",
	">Month</wa-button><wa-button",
	"",
	">Week</wa-button><wa-button",
	"",
	">Day</wa-button><wa-button",
	"",
	">List</wa-button></div><!--$-->",
	"<!--/--></div>"
];
var _tmpl$3 = [
	"<div",
	" style=\"",
	"\">",
	"</div>"
];
var _tmpl$4 = [
	"<wa-card",
	"><div class=\"wa-flank wa-gap-m\" style=\"",
	"\"><h2 class=\"wa-heading-l\">Upcoming Unavailable Times</h2><wa-button href=\"/unavailability/new\" variant=\"danger\" appearance=\"filled\" size=\"small\">+ Add New</wa-button></div><!--$-->",
	"<!--/--></wa-card>"
];
var _tmpl$5 = [
	"<wa-select",
	" label=\"Service *\" name=\"serviceId\" required",
	">",
	"</wa-select>"
];
var _tmpl$6 = [
	"<p",
	" class=\"wa-body-s wa-color-text-quiet\">No services assigned to this family. <a href=\"",
	"\">Assign services</a> to default this selection.</p>"
];
var _tmpl$7 = [
	"<wa-callout",
	" variant=\"danger\">",
	"</wa-callout>"
];
var _tmpl$8 = [
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
var _tmpl$9 = [
	"<div",
	" class=\"wa-cluster wa-gap-s calendar-view-buttons\"><wa-button",
	"",
	"><!--$-->",
	"<!--/--> Unavailability</wa-button><wa-button variant=\"success\" appearance=\"filled\">+ Add Care Session</wa-button><wa-button href=\"/unavailability/new\" variant=\"danger\" appearance=\"filled\">+ Block Time</wa-button></div>"
];
var _tmpl$10 = [
	"<p",
	" style=\"",
	"\">No upcoming unavailable times. Click \"+ Add New\" to block out time.</p>"
];
var _tmpl$11 = [
	"<p",
	" style=\"",
	"\">",
	"</p>"
];
var _tmpl$12 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><h3 style=\"",
	"\">",
	"</h3><span style=\"",
	"\">",
	"</span></div><div style=\"",
	"\"><div><span style=\"",
	"\">From: </span><span style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></span></div><div><span style=\"",
	"\">To: </span><span style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></span></div></div><!--$-->",
	"<!--/--></div><div class=\"wa-cluster wa-gap-s\"><wa-button href=\"",
	"\" appearance=\"outlined\" size=\"small\">Edit</wa-button><wa-button variant=\"danger\" appearance=\"outlined\" size=\"small\">Delete</wa-button></div></div>"
];
var _tmpl$13 = [
	"<div",
	" style=\"",
	"\">Loading schedule...</div>"
];
var _tmpl$14 = [
	"<div",
	" style=\"",
	"\" class=\"wa-color-text-quiet\">Loading services...</div>"
];
var _tmpl$15 = ["<wa-option", " value>Select a service...</wa-option>"];
var _tmpl$16 = [
	"<wa-option",
	"",
	"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></wa-option>"
];
var _tmpl$17 = [
	"<wa-option",
	"",
	">",
	"</wa-option>"
];
var _tmpl$18 = [
	"<div",
	" style=\"",
	"\"><label style=\"",
	"\">",
	"</label><div style=\"",
	"\">",
	"</div></div>"
];
var _tmpl$19 = [
	"<label",
	" style=\"",
	"\"><input type=\"checkbox\" name=\"childIds\"",
	" style=\"",
	"\"><span><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></span></label>"
];
var _tmpl$20 = [
	"<wa-card",
	" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><wa-input type=\"search\" placeholder=\"Search by family, child, status, or date...\"",
	"></wa-input></div><div class=\"wa-cluster wa-gap-s\"><wa-button",
	"",
	" size=\"small\">Date <!--$-->",
	"<!--/--></wa-button><wa-button",
	"",
	" size=\"small\">Family <!--$-->",
	"<!--/--></wa-button><wa-button",
	"",
	" size=\"small\">Status <!--$-->",
	"<!--/--></wa-button></div></div><div style=\"",
	"\">Showing <!--$-->",
	"<!--/--> session<!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div></div><div style=\"",
	"\">",
	"</div></wa-card>"
];
var _tmpl$21 = [
	"<div",
	" style=\"",
	"\">No sessions found.</div>"
];
var _tmpl$22 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\">Rate</div><div style=\"",
	"\">$<!--$-->",
	"<!--/-->/hr</div></div>"
];
var _tmpl$23 = [
	"<a",
	" href=\"",
	"\" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\"><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div><div style=\"",
	"\">",
	"</div><div style=\"",
	"\">",
	"</div></div><div style=\"",
	"\"><div style=\"",
	"\">",
	"</div><div style=\"",
	"\"><!--$-->",
	"<!--/--> - <!--$-->",
	"<!--/--></div><div style=\"",
	"\">",
	"</div></div><!--$-->",
	"<!--/--></div></a>"
];
var _tmpl$24 = ["<wa-badge", " variant=\"success\" appearance=\"filled-outlined\" pill>✓ Confirmed</wa-badge>"];
var _tmpl$25 = [
	"<div",
	" class=\"calendar-grid\" style=\"",
	"\"><div class=\"calendar-grid-inner\"><div style=\"",
	"\">",
	"</div><div style=\"",
	"\">",
	"</div></div></div>"
];
var _tmpl$26 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\">",
	"</div><div style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div></div>"
];
var _tmpl$27 = [
	"<div",
	" style=\"",
	"\"",
	">",
	"</div>"
];
var _tmpl$28 = [
	"<a",
	" href=\"",
	"\" style=\"",
	"\" title=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--> - <!--$-->",
	"<!--/--></a>"
];
var _tmpl$29 = [
	"<div",
	" style=\"",
	"\">+<!--$-->",
	"<!--/--> more</div>"
];
var _tmpl$30 = [
	"<div",
	" class=\"calendar-grid\" style=\"",
	"\"><div class=\"calendar-grid-inner calendar-week-grid\" style=\"",
	"\"><div style=\"",
	"\">Time</div><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div></div>"
];
var _tmpl$31 = [
	"<div",
	" style=\"",
	"\"><div>",
	"</div><div style=\"",
	"\">",
	"</div></div>"
];
var _tmpl$32 = [
	"<div",
	" style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div>"
];
var _tmpl$33 = [
	"<div",
	" style=\"",
	"\"></div>"
];
var _tmpl$34 = [
	"<a",
	" href=\"",
	"\" style=\"",
	"\" title=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></a>"
];
var _tmpl$35 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><div style=\"",
	"\">Time</div><div style=\"",
	"\">",
	"</div><!--$-->",
	"<!--/--></div></div>"
];
var _tmpl$36 = [
	"<div",
	" style=\"",
	"\"",
	"></div>"
];
var _tmpl$37 = [
	"<a",
	" href=\"",
	"\" style=\"",
	"\" title=\"",
	"\"><div style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div><div style=\"",
	"\"><!--$-->",
	"<!--/--> - <!--$-->",
	"<!--/--></div><div style=\"",
	"\">",
	"</div></a>"
];
function SchedulePage() {
	var _v$10, _v$11, _v$, _g$, _v$12, _v$14, _v$15, _v$13, _v$16, _v$19, _v$20, _v$21, _v$22, _v$23, _v$30, _v$31, _v$17, _v$24, _v$25, _v$26, _v$27, _v$28, _v$29, _v$32, _v$33, _v$34, _v$18;
	const { confirm } = useConfirm();
	const [view, setView] = createSignal("month");
	const [currentDate, setCurrentDate] = createSignal(/* @__PURE__ */ new Date());
	const [searchTerm, setSearchTerm] = createSignal("");
	const services = createMemo(() => getServices());
	const [serviceFilter, setServiceFilter] = createSignal("ALL");
	const [sortField, setSortField] = createSignal("date");
	const [sortDirection, setSortDirection] = createSignal("asc");
	const getDateRange = () => {
		const date = currentDate();
		const year = date.getFullYear();
		const month = date.getMonth();
		const day = date.getDate();
		if (view() === "month") return {
			start: new Date(year, month, 1),
			end: new Date(year, month + 1, 0, 23, 59, 59)
		};
		else if (view() === "week") {
			const dayOfWeek = date.getDay();
			const start = new Date(year, month, day - dayOfWeek);
			start.setHours(0, 0, 0, 0);
			const end = new Date(start);
			end.setDate(start.getDate() + 6);
			end.setHours(23, 59, 59, 999);
			return {
				start,
				end
			};
		} else if (view() === "day") {
			const start = new Date(year, month, day);
			start.setHours(0, 0, 0, 0);
			const end = new Date(year, month, day);
			end.setHours(23, 59, 59, 999);
			return {
				start,
				end
			};
		} else {
			const start = /* @__PURE__ */ new Date();
			start.setDate(start.getDate() - 30);
			start.setHours(0, 0, 0, 0);
			const end = /* @__PURE__ */ new Date();
			end.setDate(end.getDate() + 90);
			end.setHours(23, 59, 59, 999);
			return {
				start,
				end
			};
		}
	};
	const dateRangeSource = createMemo(() => {
		const date = currentDate();
		const currentView = view();
		const range = getDateRange();
		return {
			start: range.start,
			end: range.end,
			key: `${date.getTime()}-${currentView}`
		};
	});
	const sessions = createMemo(() => {
		const source = dateRangeSource();
		return getCareSessionsForRange(source.start, source.end);
	});
	const unavailabilities = createMemo(() => {
		const source = dateRangeSource();
		return getUnavailabilitiesForRange(source.start, source.end);
	});
	const upcomingUnavailabilities = createMemo(() => getUpcomingUnavailabilities());
	const [showUnavailabilityPanel, setShowUnavailabilityPanel] = createSignal(false);
	const [showAddSessionModal, setShowAddSessionModal] = createSignal(false);
	const [selectedDate, setSelectedDate] = createSignal("");
	const [selectedFamilyId, setSelectedFamilyId] = createSignal("");
	const families = createMemo(() => getFamilies());
	const submission = useSubmission(createCareSchedule);
	const selectedFamily = createMemo(() => {
		const id = selectedFamilyId();
		return id ? getFamily(id) : null;
	});
	const [serviceId, setServiceId] = createSignal("");
	const defaultServiceId = () => {
		const family = selectedFamily();
		if (family?.services && family.services.length > 0) return family.services[0].service.id;
		const allServices = services();
		if (allServices && allServices.length > 0) return allServices[0].id;
		return "";
	};
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
	const getCurrentDate = () => {
		return selectedDate() || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	};
	const getCurrentTime = () => {
		const now = /* @__PURE__ */ new Date();
		return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
	};
	const handleCloseModal = () => {
		setShowAddSessionModal(false);
		setSelectedFamilyId("");
		setSelectedDate("");
	};
	const handleDateClick = (date) => {
		const dateStr = date.toISOString().split("T")[0];
		setSelectedDate(dateStr);
		setShowAddSessionModal(true);
	};
	createEffect(() => {
		if (submission.result && !(submission.result instanceof Error)) {
			handleCloseModal();
			window.location.reload();
		}
	});
	const formatDateHeader = () => {
		const date = currentDate();
		if (view() === "month") return date.toLocaleDateString("en-US", {
			month: "long",
			year: "numeric"
		});
		else if (view() === "week") {
			const range = getDateRange();
			return `${range.start.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric"
			})} - ${range.end.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric"
			})}`;
		} else return date.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric"
		});
	};
	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
	};
	const formatTime = (time) => {
		const [hours, minutes] = time.split(":");
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? "PM" : "AM";
		return `${hour % 12 || 12}:${minutes} ${ampm}`;
	};
	return PageContent({ get children() {
		return [
			PageHeader({
				title: "Schedule",
				get actions() {
					var _v$35 = ssrHydrationKey(), _g$2 = ssrGroup(() => {
						return [ssrAttribute("appearance", showUnavailabilityPanel() ? "filled" : "outlined"), ssrAttribute("variant", showUnavailabilityPanel() ? "brand" : "neutral")];
					}, 2), _v$38 = () => {
						return showUnavailabilityPanel() ? "Hide" : "Show";
					};
					return ssr(_tmpl$9, _v$35, _g$2, _g$2, _v$38);
				}
			}),
			(_v$ = ssrHydrationKey(), _g$ = ssrGroup(() => {
				return [
					ssrAttribute("appearance", view() === "month" ? "filled" : "outlined"),
					ssrAttribute("variant", view() === "month" ? "brand" : "neutral"),
					ssrAttribute("appearance", view() === "week" ? "filled" : "outlined"),
					ssrAttribute("variant", view() === "week" ? "brand" : "neutral"),
					ssrAttribute("appearance", view() === "day" ? "filled" : "outlined"),
					ssrAttribute("variant", view() === "day" ? "brand" : "neutral"),
					ssrAttribute("appearance", view() === "list" ? "filled" : "outlined"),
					ssrAttribute("variant", view() === "list" ? "brand" : "neutral")
				];
			}, 8), _v$12 = escape(Show({
				get when() {
					return view() !== "list";
				},
				get children() {
					return _v$10 = ssrHydrationKey(), _v$11 = scope(() => {
						return escape(formatDateHeader());
					}), ssr(_tmpl$, _v$10, _v$11);
				}
			})), ssr(_tmpl$2, _v$, ssrStyleProperty("margin-top:", "var(--wa-space-m)") + ssrStyleProperty(";flex-wrap:", "wrap"), _g$, _g$, _g$, _g$, _g$, _g$, _g$, _g$, _v$12)),
			Show({
				get when() {
					return showUnavailabilityPanel();
				},
				get children() {
					return _v$13 = ssrHydrationKey(), _v$16 = escape(Show({
						get when() {
							return upcomingUnavailabilities()?.length;
						},
						get fallback() {
							var _v$39 = ssrHydrationKey();
							return ssr(_tmpl$10, _v$39, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";padding:", "2rem"));
						},
						get children() {
							return _v$14 = ssrHydrationKey(), _v$15 = escape(For({
								get each() {
									return upcomingUnavailabilities();
								},
								children: (unavailability) => {
									var _v$47, _v$48, _v$40, _v$41, _v$42, _v$43, _v$44, _v$45, _v$46, _v$49, _v$50;
									return _v$40 = ssrHydrationKey(), _v$41 = () => {
										return escape(unavailability.reason || "Time Off");
									}, _v$42 = () => {
										return unavailability.allDay ? "All Day" : "Specific Hours";
									}, _v$43 = scope(() => {
										return escape(formatDate(unavailability.startDate));
									}), _v$44 = (() => {
										var _c$ = memo(() => {
											return !!(!unavailability.allDay && unavailability.startTime);
										});
										return () => {
											return _c$() ? ` at ${escape(formatTime(unavailability.startTime))}` : !unavailability.allDay && escape(unavailability.startTime);
										};
									})(), _v$45 = scope(() => {
										return escape(formatDate(unavailability.endDate));
									}), _v$46 = (() => {
										var _c$2 = memo(() => {
											return !!(!unavailability.allDay && unavailability.endTime);
										});
										return () => {
											return _c$2() ? ` at ${escape(formatTime(unavailability.endTime))}` : !unavailability.allDay && escape(unavailability.endTime);
										};
									})(), _v$49 = escape(Show({
										get when() {
											return unavailability.notes;
										},
										get children() {
											return _v$47 = ssrHydrationKey(), _v$48 = () => {
												return escape(unavailability.notes);
											}, ssr(_tmpl$11, _v$47, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";margin:", "0.5rem 0 0 0"), _v$48);
										}
									})), _v$50 = () => {
										return `/unavailability/${escape(unavailability.id, true)}/edit`;
									}, ssr(_tmpl$12, _v$40, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";background-color:", "var(--wa-color-danger-fill-quiet)") + ssrStyleProperty(";border:", "1px solid #feb2b2") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "start"), ssrStyleProperty("flex:", "1"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.75rem") + ssrStyleProperty(";margin-bottom:", "0.5rem"), ssrStyleProperty("color:", "var(--color-text)") + ssrStyleProperty(";margin:", 0) + ssrStyleProperty(";font-size:", "1rem"), _v$41, ssrStyleProperty("padding:", "0.25rem 0.5rem") + ssrStyleProperty(";border-radius:", "9999px") + ssrStyleProperty(";background-color:", "var(--wa-color-danger-fill-normal)") + ssrStyleProperty(";color:", "#c53030") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", "600"), _v$42, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "2rem") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("color:", "var(--color-text-muted)"), ssrStyleProperty("color:", "var(--color-text)") + ssrStyleProperty(";font-weight:", "500"), _v$43, _v$44, ssrStyleProperty("color:", "var(--color-text-muted)"), ssrStyleProperty("color:", "var(--color-text)") + ssrStyleProperty(";font-weight:", "500"), _v$45, _v$46, _v$49, _v$50);
								}
							})), ssr(_tmpl$3, _v$14, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";gap:", "0.5rem"), _v$15);
						}
					})), ssr(_tmpl$4, _v$13, ssrStyleProperty("margin-bottom:", "var(--wa-space-m)"), _v$16);
				}
			}),
			Show({
				get when() {
					return memo(() => {
						return !sessions.loading;
					})() && !unavailabilities.loading;
				},
				get fallback() {
					var _v$51 = ssrHydrationKey();
					return ssr(_tmpl$13, _v$51, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "3rem"));
				},
				get children() {
					return [
						memo(() => {
							return escape(memo(() => {
								return view() === "month";
							})() && MonthView({
								get currentDate() {
									return currentDate();
								},
								get sessions() {
									return sessions() || [];
								},
								get unavailabilities() {
									return unavailabilities() || [];
								},
								onDateClick: handleDateClick
							}));
						}),
						memo(() => {
							return escape(memo(() => {
								return view() === "week";
							})() && WeekView({
								get currentDate() {
									return currentDate();
								},
								get sessions() {
									return sessions() || [];
								},
								get unavailabilities() {
									return unavailabilities() || [];
								}
							}));
						}),
						memo(() => {
							return escape(memo(() => {
								return view() === "day";
							})() && DayView({
								get currentDate() {
									return currentDate();
								},
								get sessions() {
									return sessions() || [];
								},
								get unavailabilities() {
									return unavailabilities() || [];
								}
							}));
						}),
						memo(() => {
							return escape(memo(() => {
								return view() === "list";
							})() && ListView({
								get sessions() {
									return sessions() || [];
								},
								get searchTerm() {
									return searchTerm();
								},
								onSearchChange: setSearchTerm,
								get serviceFilter() {
									return serviceFilter();
								},
								onServiceFilterChange: setServiceFilter,
								get services() {
									return services();
								},
								get sortField() {
									return sortField();
								},
								onSortFieldChange: setSortField,
								get sortDirection() {
									return sortDirection();
								},
								onSortDirectionChange: setSortDirection
							}));
						})
					];
				}
			}),
			Dialog({
				get open() {
					return showAddSessionModal();
				},
				title: "Add Care Session",
				onClose: handleCloseModal,
				get children() {
					return _v$17 = ssrHydrationKey(), _v$24 = escape(Show({
						get when() {
							return services();
						},
						get fallback() {
							var _v$52 = ssrHydrationKey();
							return ssr(_tmpl$14, _v$52, ssrStyleProperty("padding:", "0.75rem"));
						},
						get children() {
							return [(_v$19 = ssrHydrationKey(), _v$20 = () => {
								return ssrAttribute("value", escape(serviceId(), true));
							}, _v$21 = escape(Show({
								get when() {
									return memo(() => {
										return !!selectedFamily()?.services;
									})() ? selectedFamily().services.length > 0 : selectedFamily()?.services;
								},
								get fallback() {
									var _v$53;
									return [(_v$53 = ssrHydrationKey(), ssr(_tmpl$15, _v$53)), For({
										get each() {
											return services();
										},
										children: (service) => {
											var _v$54, _v$55, _v$56, _v$57;
											return _v$54 = ssrHydrationKey(), _v$55 = () => {
												return ssrAttribute("value", escape(service.id, true));
											}, _v$56 = () => {
												return escape(service.name);
											}, _v$57 = (() => {
												var _c$3 = memo(() => {
													return !!service.defaultHourlyRate;
												});
												return () => {
													return _c$3() ? ` ($${escape(service.defaultHourlyRate)}/hr${service.pricingType === "PER_CHILD" ? " per child" : ""})` : escape(service.defaultHourlyRate);
												};
											})(), ssr(_tmpl$16, _v$54, _v$55, _v$56, _v$57);
										}
									})];
								},
								get children() {
									return For({
										get each() {
											return selectedFamily()?.services || [];
										},
										children: (fs) => {
											var _v$58, _v$59, _v$60, _v$61;
											return _v$58 = ssrHydrationKey(), _v$59 = () => {
												return ssrAttribute("value", escape(fs.service.id, true));
											}, _v$60 = () => {
												return escape(fs.service.name);
											}, _v$61 = (() => {
												var _c$4 = memo(() => {
													return !!fs.service.defaultHourlyRate;
												});
												return () => {
													return _c$4() ? ` ($${escape(fs.service.defaultHourlyRate)}/hr${fs.service.pricingType === "PER_CHILD" ? " per child" : ""})` : escape(fs.service.defaultHourlyRate);
												};
											})(), ssr(_tmpl$16, _v$58, _v$59, _v$60, _v$61);
										}
									});
								}
							})), ssr(_tmpl$5, _v$19, _v$20, _v$21)), Show({
								get when() {
									return memo(() => {
										return !!selectedFamilyId();
									})() ? !selectedFamily()?.services || selectedFamily().services.length === 0 : selectedFamilyId();
								},
								get children() {
									return _v$22 = ssrHydrationKey(), _v$23 = () => {
										return `/families/${escape(selectedFamilyId(), true)}/edit`;
									}, ssr(_tmpl$6, _v$22, _v$23);
								}
							})];
						}
					})), _v$25 = () => {
						return ssrAttribute("value", escape(selectedFamilyId(), true));
					}, _v$26 = escape(For({
						get each() {
							return families();
						},
						children: (family) => {
							var _v$62, _v$63, _v$64;
							return _v$62 = ssrHydrationKey(), _v$63 = () => {
								return ssrAttribute("value", escape(family.id, true));
							}, _v$64 = () => {
								return escape(family.familyName);
							}, ssr(_tmpl$17, _v$62, _v$63, _v$64);
						}
					})), _v$27 = escape(Show({
						get when() {
							return memo(() => {
								return !!selectedFamilyId();
							})() ? selectedFamily() : selectedFamilyId();
						},
						children: (family) => {
							var _v$65, _v$66, _v$67;
							return Show({
								get when() {
									return !(services()?.find((s) => s.id === serviceId()))?.requiresChildren || family().children.length > 0;
								},
								get children() {
									return _v$65 = ssrHydrationKey(), _v$66 = scope(() => {
										return (() => {
											return (services()?.find((s) => s.id === serviceId()))?.requiresChildren ? "Children *" : "Student (optional)";
										})();
									}), _v$67 = escape(For({
										get each() {
											return family().children;
										},
										children: (child) => {
											var _v$68, _v$70, _v$71, _v$72, _v$69;
											return _v$68 = ssrHydrationKey(), _v$70 = () => {
												return escape(child.firstName);
											}, _v$71 = () => {
												return escape(child.lastName);
											}, _v$72 = () => {
												return child.allergies && " ⚠️";
											}, _v$69 = () => {
												return ssrAttribute("value", escape(child.id, true));
											}, ssr(_tmpl$19, _v$68, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";transition:", "background-color 0.2s"), _v$69, ssrStyleProperty("width:", "1.25rem") + ssrStyleProperty(";height:", "1.25rem") + ssrStyleProperty(";cursor:", "pointer"), _v$70, _v$71, _v$72);
										}
									})), ssr(_tmpl$18, _v$65, ssrStyleProperty("margin-bottom:", "1.5rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$66, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.5rem"), _v$67);
								}
							});
						}
					})), _v$28 = () => {
						return ssrAttribute("value", escape(getCurrentDate(), true));
					}, _v$29 = () => {
						return ssrAttribute("value", escape(getCurrentTime(), true));
					}, _v$32 = escape(Show({
						get when() {
							return submission.result instanceof Error;
						},
						get children() {
							return _v$30 = ssrHydrationKey(), _v$31 = () => {
								return escape(submission.result.message);
							}, ssr(_tmpl$7, _v$30, _v$31);
						}
					})), _v$33 = () => {
						return ssrAttribute("disabled", escape(submission.pending || void 0, true));
					}, _v$34 = () => {
						return submission.pending ? "Creating..." : "Create Session";
					}, _v$18 = () => {
						return ssrAttribute("value", escape((/* @__PURE__ */ new Date()).getTimezoneOffset(), true) * -1);
					}, ssr(_tmpl$8, _v$17, ssrAttribute("action", escape(createCareSchedule, true)), _v$18, _v$24, _v$25, _v$26, _v$27, _v$28, ssrStyleProperty("--min-column-size:", "140px"), _v$29, _v$32, ssrStyleProperty("justify-content:", "flex-end"), _v$33, _v$34);
				}
			})
		];
	} });
}
function ListView(props) {
	var _v$87, _v$88;
	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
	};
	const formatDuration = (start, end) => {
		return `${((end.getTime() - start.getTime()) / 36e5).toFixed(1)}h`;
	};
	const filteredSessions = () => {
		let filtered = props.sessions;
		if (props.serviceFilter && props.serviceFilter !== "ALL") filtered = filtered.filter((session) => session.service?.id === props.serviceFilter);
		const search = props.searchTerm.toLowerCase();
		if (!search) return filtered;
		return filtered.filter((session) => session.family?.familyName?.toLowerCase().includes(search) || session.children?.some((c) => `${c.firstName} ${c.lastName}`.toLowerCase().includes(search)) || session.status?.toLowerCase().includes(search) || formatDate(session.scheduledStart).toLowerCase().includes(search) || session.service?.name?.toLowerCase().includes(search) || session.service?.code?.toLowerCase().includes(search));
	};
	const sortedSessions = () => {
		return [...filteredSessions()].sort((a, b) => {
			let aVal;
			let bVal;
			switch (props.sortField) {
				case "date":
					aVal = new Date(a.scheduledStart).getTime();
					bVal = new Date(b.scheduledStart).getTime();
					break;
				case "family":
					aVal = a.family?.familyName || "";
					bVal = b.family?.familyName || "";
					break;
				case "status":
					aVal = a.status || "";
					bVal = b.status || "";
					break;
				default: return 0;
			}
			if (aVal < bVal) return props.sortDirection === "asc" ? -1 : 1;
			if (aVal > bVal) return props.sortDirection === "asc" ? 1 : -1;
			return 0;
		});
	};
	const getSortIcon = (field) => {
		if (props.sortField !== field) return "↕️";
		return props.sortDirection === "asc" ? "↑" : "↓";
	};
	var _v$73 = ssrHydrationKey(), _g$5 = ssrGroup(() => {
		return [
			ssrAttribute("value", escape(props.searchTerm, true)),
			ssrAttribute("appearance", props.sortField === "date" ? "filled" : "outlined"),
			ssrAttribute("variant", props.sortField === "date" ? "brand" : "neutral")
		];
	}, 3), _v$77 = scope(() => {
		return escape(getSortIcon("date"));
	}), _g$4 = ssrGroup(() => {
		return [ssrAttribute("appearance", props.sortField === "family" ? "filled" : "outlined"), ssrAttribute("variant", props.sortField === "family" ? "brand" : "neutral")];
	}, 2), _v$80 = scope(() => {
		return escape(getSortIcon("family"));
	}), _g$3 = ssrGroup(() => {
		return [ssrAttribute("appearance", props.sortField === "status" ? "filled" : "outlined"), ssrAttribute("variant", props.sortField === "status" ? "brand" : "neutral")];
	}, 2), _v$83 = scope(() => {
		return escape(getSortIcon("status"));
	}), _v$84 = () => {
		return escape(sortedSessions().length);
	}, _v$85 = () => {
		return sortedSessions().length !== 1 ? "s" : "";
	}, _v$86 = (() => {
		var _c$5 = memo(() => {
			return !!props.searchTerm;
		});
		return () => {
			return _c$5() ? ` matching "${escape(props.searchTerm)}"` : escape(props.searchTerm);
		};
	})(), _v$89 = escape(Show({
		get when() {
			return sortedSessions().length > 0;
		},
		get fallback() {
			var _v$90 = ssrHydrationKey();
			return ssr(_tmpl$21, _v$90, ssrStyleProperty("padding:", "3rem") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
		},
		get children() {
			return _v$87 = ssrHydrationKey(), _v$88 = escape(For({
				get each() {
					return sortedSessions();
				},
				children: (session) => {
					var _v$101, _v$102;
					const startTime = new Date(session.scheduledStart);
					const endTime = new Date(session.scheduledEnd);
					const isPast = endTime < /* @__PURE__ */ new Date();
					var _v$91 = ssrHydrationKey(), _v$92 = () => {
						return `/families/${escape(session.familyId, true)}/sessions/${escape(session.id, true)}`;
					}, _v$93 = escape(SessionStatusBadge({ get status() {
						return session.status;
					} })), _v$94 = scope((() => {
						var _c$6 = memo(() => {
							return !!session.isConfirmed;
						});
						return () => {
							var _v$104;
							return _c$6() ? (_v$104 = ssrHydrationKey(), ssr(_tmpl$24, _v$104)) : escape(session.isConfirmed);
						};
					})()), _v$95 = () => {
						return escape(session.family?.familyName || "Unknown Family");
					}, _v$96 = () => {
						return escape(session.children?.map((c) => `${c.firstName} ${c.lastName}`).join(", ") || "No children");
					}, _v$97 = scope(() => {
						return escape(formatDate(session.scheduledStart));
					}), _v$98 = escape(ClientTime({ get date() {
						return session.scheduledStart;
					} })), _v$99 = escape(ClientTime({ get date() {
						return session.scheduledEnd;
					} })), _v$100 = scope(() => {
						return escape(formatDuration(startTime, endTime));
					}), _v$103 = escape(Show({
						get when() {
							return session.hourlyRate;
						},
						get children() {
							return _v$101 = ssrHydrationKey(), _v$102 = () => {
								return escape(session.hourlyRate);
							}, ssr(_tmpl$22, _v$101, ssrStyleProperty("min-width:", "100px") + ssrStyleProperty(";text-align:", "right"), ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$102);
						}
					}));
					return ssr(_tmpl$23, _v$91, _v$92, ssrStyleProperty("display:", "block") + ssrStyleProperty(";padding:", "1rem 1.5rem") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";color:", "inherit") + ssrStyleProperty(";transition:", "background-color 0.2s") + ssrStyleProperty(";opacity:", isPast ? .7 : 1), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";align-items:", "flex-start") + ssrStyleProperty(";flex-wrap:", "wrap"), ssrStyleProperty("flex:", "1") + ssrStyleProperty(";min-width:", "200px"), ssrStyleProperty("margin-bottom:", "0.25rem"), _v$93, _v$94, ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "1.125rem"), _v$95, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";margin-top:", "0.25rem"), _v$96, ssrStyleProperty("min-width:", "150px"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$97, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";margin-top:", "0.25rem"), _v$98, _v$99, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$100, _v$103);
				}
			})), ssr(_tmpl$3, _v$87, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column"), _v$88);
		}
	}));
	return ssr(_tmpl$20, _v$73, ssrStyleProperty("overflow:", "hidden") + ssrStyleProperty(";padding:", 0), ssrStyleProperty("padding:", "1.5rem") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";flex-wrap:", "wrap") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";margin-bottom:", "1rem"), ssrStyleProperty("flex:", "1") + ssrStyleProperty(";min-width:", "200px"), _g$5, _g$5, _g$5, _v$77, _g$4, _g$4, _v$80, _g$3, _g$3, _v$83, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$84, _v$85, _v$86, ssrStyleProperty("max-height:", "70vh") + ssrStyleProperty(";overflow:", "auto"), _v$89);
}
function MonthView(props) {
	const year = props.currentDate.getFullYear();
	const month = props.currentDate.getMonth();
	const firstDay = new Date(year, month, 1);
	new Date(year, month + 1, 0);
	const startDate = new Date(firstDay);
	startDate.setDate(startDate.getDate() - startDate.getDay());
	const days = [];
	const current = new Date(startDate);
	for (let i = 0; i < 42; i++) {
		days.push(new Date(current));
		current.setDate(current.getDate() + 1);
	}
	const isToday = (date) => {
		const today = /* @__PURE__ */ new Date();
		return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
	};
	const isCurrentMonth = (date) => {
		return date.getMonth() === month;
	};
	const getSessionsForDay = (date) => {
		return props.sessions.filter((session) => {
			return isSameDay(session.scheduledStart, date);
		});
	};
	const getUnavailabilitiesForDay = (date) => {
		return props.unavailabilities.filter((unav) => {
			const unavStart = ensureDate(unav.startDate);
			const unavEnd = ensureDate(unav.endDate);
			const checkDate = new Date(date);
			checkDate.setHours(12, 0, 0, 0);
			return checkDate >= unavStart && checkDate <= unavEnd;
		});
	};
	var _v$105 = ssrHydrationKey(), _v$106 = escape(For({
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
			var _v$108, _v$109;
			return _v$108 = ssrHydrationKey(), _v$109 = escape(day), ssr(_tmpl$3, _v$108, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$109);
		}
	})), _v$107 = escape(For({
		each: days,
		children: (day) => {
			const daySessions = getSessionsForDay(day);
			const dayUnavailabilities = getUnavailabilitiesForDay(day);
			const isCurrentMonthDay = isCurrentMonth(day);
			const isTodayDay = isToday(day);
			var _v$110 = ssrHydrationKey(), _v$111 = () => {
				return ssrStyleProperty("minHeight:", "120px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";background-color:", isCurrentMonthDay ? "var(--color-surface)" : "var(--color-surface-muted)") + ssrStyleProperty(";position:", "relative") + ssrStyleProperty(";cursor:", props.onDateClick ? "pointer" : "default") + ssrStyleProperty(";transition:", "background-color 0.2s");
			}, _v$112 = scope(() => {
				return escape(day.getDate());
			}), _v$113 = escape(For({
				each: dayUnavailabilities,
				children: (unav) => {
					var _v$116, _v$117, _v$118;
					return _v$116 = ssrHydrationKey(), _v$117 = () => {
						return ssrAttribute("title", escape(unav.reason || "Unavailable", true));
					}, _v$118 = () => {
						return unav.allDay ? "🚫 Unavailable" : "🚫 Busy";
					}, ssr(_tmpl$27, _v$116, ssrStyleProperty("padding:", "0.25rem 0.5rem") + ssrStyleProperty(";background-color:", "var(--wa-color-danger-fill-normal)") + ssrStyleProperty(";color:", "#c53030") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";font-weight:", "600"), _v$117, _v$118);
				}
			})), _v$114 = escape(For({
				get each() {
					return daySessions.slice(0, 3);
				},
				children: (session) => {
					const statusColors = {
						SCHEDULED: {
							bg: "var(--wa-color-brand-fill-normal)",
							color: "#2c5282"
						},
						IN_PROGRESS: {
							bg: "#feebc8",
							color: "#7c2d12"
						},
						COMPLETED: {
							bg: "#c6f6d5",
							color: "#276749"
						},
						CANCELLED: {
							bg: "var(--wa-color-danger-fill-normal)",
							color: "#c53030"
						}
					}[session.status] || {
						bg: "var(--color-border)",
						color: "var(--color-text)"
					};
					const isConfirmed = session.isConfirmed;
					const isRecurring = !!session.scheduleId;
					var _v$119 = ssrHydrationKey(), _g$6 = ssrGroup(() => {
						return [
							`/families/${escape(session.familyId, true)}/sessions/${escape(session.id, true)}`,
							ssrStyleProperty("padding:", "0.25rem 0.5rem") + ssrStyleProperty(";background-color:", isConfirmed ? escape(statusColors.bg, true) : "transparent") + ssrStyleProperty(";color:", escape(statusColors.color, true)) + ssrStyleProperty(";border:", isConfirmed ? `2px solid ${escape(statusColors.color, true)}` : `2px dashed ${escape(statusColors.color, true)}`) + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";display:", "block") + ssrStyleProperty(";opacity:", isConfirmed ? 1 : .7) + ssrStyleProperty(";font-weight:", isConfirmed ? "600" : "400"),
							`${escape(session.family.familyName, true)}${isConfirmed ? " ✓ Confirmed" : isRecurring ? " (Planned)" : ""}`
						];
					}, 3), _v$123 = isConfirmed && "✓ ", _v$124 = escape(ClientTime({ get date() {
						return session.scheduledStart;
					} })), _v$125 = () => {
						return escape(session.family.familyName);
					};
					return ssr(_tmpl$28, _v$119, _g$6, _g$6, _g$6, _v$123, _v$124, _v$125);
				}
			})), _v$115 = scope((() => {
				var _c$7 = memo(() => {
					return daySessions.length > 3;
				});
				return () => {
					var _v$126, _v$127;
					return _c$7() && (_v$126 = ssrHydrationKey(), _v$127 = () => {
						return escape(daySessions.length) - 3;
					}, ssr(_tmpl$29, _v$126, ssrStyleProperty("font-size:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";padding:", "0.25rem"), _v$127));
				};
			})());
			return ssr(_tmpl$26, _v$110, _v$111, ssrStyleProperty("font-weight:", isTodayDay ? "700" : "400") + ssrStyleProperty(";color:", isCurrentMonthDay ? "var(--color-text)" : "var(--color-text-subtle)") + ssrStyleProperty(";margin-bottom:", "0.25rem") + ssrStyleProperty(";font-size:", isTodayDay ? "1rem" : "0.875rem"), _v$112, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.25rem"), _v$113, _v$114, _v$115);
		}
	}));
	return ssr(_tmpl$25, _v$105, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";overflow:", "hidden"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(7, 1fr)") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";borderBottom:", "2px solid var(--color-border)"), _v$106, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(7, 1fr)"), _v$107);
}
function WeekView(props) {
	const date = props.currentDate;
	const dayOfWeek = date.getDay();
	const startDate = new Date(date);
	startDate.setDate(date.getDate() - dayOfWeek);
	const days = [];
	for (let i = 0; i < 7; i++) {
		const day = new Date(startDate);
		day.setDate(startDate.getDate() + i);
		days.push(day);
	}
	const hours = Array.from({ length: 24 }, (_, i) => i);
	const getSessionsForDayAndHour = (day, hour) => {
		return props.sessions.filter((session) => {
			if (!isSameDay(session.scheduledStart, day)) return false;
			return ensureDate(session.scheduledStart).getHours() === hour;
		});
	};
	const getUnavailabilitiesForDay = (day) => {
		return props.unavailabilities.filter((unav) => {
			const unavStart = ensureDate(unav.startDate);
			const unavEnd = ensureDate(unav.endDate);
			const checkDate = new Date(day);
			checkDate.setHours(12, 0, 0, 0);
			return checkDate >= unavStart && checkDate <= unavEnd;
		});
	};
	const formatTime = (hour) => {
		const ampm = hour >= 12 ? "PM" : "AM";
		return `${hour % 12 || 12}:00 ${ampm}`;
	};
	var _v$128 = ssrHydrationKey(), _v$129 = escape(For({
		each: days,
		children: (day) => {
			var _v$131, _v$132, _v$133;
			return _v$131 = ssrHydrationKey(), _v$132 = scope(() => {
				return escape(day.toLocaleDateString("en-US", { weekday: "short" }));
			}), _v$133 = scope(() => {
				return escape(day.getDate());
			}), ssr(_tmpl$31, _v$131, ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";borderLeft:", "1px solid var(--color-border)"), _v$132, ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";margin-top:", "0.25rem"), _v$133);
		}
	})), _v$130 = escape(For({
		each: hours,
		children: (hour) => {
			var _v$134, _v$135;
			return [(_v$134 = ssrHydrationKey(), _v$135 = scope(() => {
				return escape(formatTime(hour));
			}), ssr(_tmpl$3, _v$134, ssrStyleProperty("padding:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";borderTop:", "1px solid var(--color-border)"), _v$135)), For({
				each: days,
				children: (day) => {
					const daySessions = getSessionsForDayAndHour(day, hour);
					const dayUnavailabilities = getUnavailabilitiesForDay(day);
					var _v$136 = ssrHydrationKey(), _v$137 = escape(For({
						each: dayUnavailabilities,
						children: (unav) => {
							if (unav.allDay || unav.startTime && hour >= parseInt(unav.startTime.split(":")[0])) {
								var _v$139 = ssrHydrationKey();
								return ssr(_tmpl$33, _v$139, ssrStyleProperty("position:", "absolute") + ssrStyleProperty(";top:", 0) + ssrStyleProperty(";left:", 0) + ssrStyleProperty(";right:", 0) + ssrStyleProperty(";bottom:", 0) + ssrStyleProperty(";background-color:", "var(--wa-color-danger-fill-normal)") + ssrStyleProperty(";opacity:", .3) + ssrStyleProperty(";z-index:", 1));
							}
						}
					})), _v$138 = escape(For({
						each: daySessions,
						children: (session) => {
							const statusColors = {
								SCHEDULED: {
									bg: "var(--wa-color-brand-fill-normal)",
									color: "#2c5282"
								},
								IN_PROGRESS: {
									bg: "#feebc8",
									color: "#7c2d12"
								},
								COMPLETED: {
									bg: "#c6f6d5",
									color: "#276749"
								},
								CANCELLED: {
									bg: "var(--wa-color-danger-fill-normal)",
									color: "#c53030"
								}
							}[session.status] || {
								bg: "var(--color-border)",
								color: "var(--color-text)"
							};
							const isConfirmed = session.isConfirmed;
							const isRecurring = !!session.scheduleId;
							var _v$140 = ssrHydrationKey(), _g$7 = ssrGroup(() => {
								return [
									`/families/${escape(session.familyId, true)}/sessions/${escape(session.id, true)}`,
									ssrStyleProperty("display:", "block") + ssrStyleProperty(";padding:", "0.25rem 0.5rem") + ssrStyleProperty(";background-color:", isConfirmed ? escape(statusColors.bg, true) : "transparent") + ssrStyleProperty(";color:", escape(statusColors.color, true)) + ssrStyleProperty(";border:", isConfirmed ? `2px solid ${escape(statusColors.color, true)}` : `2px dashed ${escape(statusColors.color, true)}`) + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";margin-bottom:", "0.25rem") + ssrStyleProperty(";z-index:", 2) + ssrStyleProperty(";position:", "relative") + ssrStyleProperty(";opacity:", isConfirmed ? 1 : .7) + ssrStyleProperty(";font-weight:", isConfirmed ? "600" : "400"),
									`${escape(session.family.familyName, true)}${isConfirmed ? " ✓ Confirmed" : isRecurring ? " (Planned)" : ""}`
								];
							}, 3), _v$144 = isConfirmed && "✓ ", _v$145 = () => {
								return escape(session.family.familyName);
							};
							return ssr(_tmpl$34, _v$140, _g$7, _g$7, _g$7, _v$144, _v$145);
						}
					}));
					return ssr(_tmpl$32, _v$136, ssrStyleProperty("minHeight:", "60px") + ssrStyleProperty(";borderTop:", "1px solid var(--color-border)") + ssrStyleProperty(";borderLeft:", "1px solid var(--color-border)") + ssrStyleProperty(";padding:", "0.25rem") + ssrStyleProperty(";position:", "relative"), _v$137, _v$138);
				}
			})];
		}
	}));
	return ssr(_tmpl$30, _v$128, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";overflow:", "auto"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "80px repeat(7, 1fr)"), ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)"), _v$129, _v$130);
}
function DayView(props) {
	const date = props.currentDate;
	const intervals = Array.from({ length: 48 }, (_, i) => i * 30);
	const getSessionsForInterval = (minutes) => {
		const hour = Math.floor(minutes / 60);
		const minute = minutes % 60;
		const intervalStart = new Date(date);
		intervalStart.setHours(hour, minute, 0, 0);
		const intervalEnd = new Date(intervalStart);
		intervalEnd.setMinutes(intervalEnd.getMinutes() + 30);
		return props.sessions.filter((session) => {
			const sessionStart = ensureDate(session.scheduledStart);
			if (!isSameDay(sessionStart, date)) return false;
			return sessionStart >= intervalStart && sessionStart < intervalEnd;
		});
	};
	const getUnavailabilitiesForInterval = (minutes) => {
		const hour = Math.floor(minutes / 60);
		return props.unavailabilities.filter((unav) => {
			if (unav.allDay) return true;
			if (!unav.startTime || !unav.endTime) return false;
			const startHour = parseInt(unav.startTime.split(":")[0]);
			const endHour = parseInt(unav.endTime.split(":")[0]);
			return hour >= startHour && hour < endHour;
		});
	};
	const formatTime = (minutes) => {
		const hour = Math.floor(minutes / 60);
		const minute = minutes % 60;
		const ampm = hour >= 12 ? "PM" : "AM";
		return `${hour % 12 || 12}:${minute.toString().padStart(2, "0")} ${ampm}`;
	};
	var _v$146 = ssrHydrationKey(), _v$147 = scope(() => {
		return escape(date.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric"
		}));
	}), _v$148 = escape(For({
		each: intervals,
		children: (intervalMinutes) => {
			var _v$149, _v$150, _v$151, _v$152, _v$153;
			const intervalSessions = getSessionsForInterval(intervalMinutes);
			const intervalUnavailabilities = getUnavailabilitiesForInterval(intervalMinutes);
			return [(_v$149 = ssrHydrationKey(), _v$150 = scope(() => {
				return escape(formatTime(intervalMinutes));
			}), ssr(_tmpl$3, _v$149, ssrStyleProperty("padding:", "0.5rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";borderTop:", "1px solid var(--color-border)") + ssrStyleProperty(";min-height:", "60px"), _v$150)), (_v$151 = ssrHydrationKey(), _v$152 = escape(For({
				each: intervalUnavailabilities,
				children: (unav) => {
					var _v$154, _v$155;
					return _v$154 = ssrHydrationKey(), _v$155 = () => {
						return ssrAttribute("title", escape(unav.reason || "Unavailable", true));
					}, ssr(_tmpl$36, _v$154, ssrStyleProperty("position:", "absolute") + ssrStyleProperty(";top:", 0) + ssrStyleProperty(";left:", 0) + ssrStyleProperty(";right:", 0) + ssrStyleProperty(";bottom:", 0) + ssrStyleProperty(";background-color:", "var(--wa-color-danger-fill-normal)") + ssrStyleProperty(";opacity:", .3) + ssrStyleProperty(";z-index:", 1), _v$155);
				}
			})), _v$153 = escape(For({
				each: intervalSessions,
				children: (session) => {
					const statusColors = {
						SCHEDULED: {
							bg: "var(--wa-color-brand-fill-normal)",
							color: "#2c5282"
						},
						IN_PROGRESS: {
							bg: "#feebc8",
							color: "#7c2d12"
						},
						COMPLETED: {
							bg: "#c6f6d5",
							color: "#276749"
						},
						CANCELLED: {
							bg: "var(--wa-color-danger-fill-normal)",
							color: "#c53030"
						}
					}[session.status] || {
						bg: "var(--color-border)",
						color: "var(--color-text)"
					};
					const isConfirmed = session.isConfirmed;
					const isRecurring = !!session.scheduleId;
					const startTime = ensureDate(session.scheduledStart);
					const duration = (ensureDate(session.scheduledEnd).getTime() - startTime.getTime()) / 6e4;
					const height = Math.max(60, duration / 30 * 60);
					var _v$156 = ssrHydrationKey(), _g$8 = ssrGroup(() => {
						return [
							`/families/${escape(session.familyId, true)}/sessions/${escape(session.id, true)}`,
							ssrStyleProperty("display:", "block") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";background-color:", isConfirmed ? escape(statusColors.bg, true) : "transparent") + ssrStyleProperty(";color:", escape(statusColors.color, true)) + ssrStyleProperty(";border:", isConfirmed ? `2px solid ${escape(statusColors.color, true)}` : `2px dashed ${escape(statusColors.color, true)}`) + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";margin-bottom:", "0.25rem") + ssrStyleProperty(";z-index:", 2) + ssrStyleProperty(";position:", "relative") + ssrStyleProperty(";min-height:", `${escape(height, true)}px`) + ssrStyleProperty(";opacity:", isConfirmed ? 1 : .7),
							`${escape(session.family.familyName, true)}${isConfirmed ? " ✓ Confirmed" : isRecurring ? " (Planned Recurring)" : ""}`
						];
					}, 3), _v$160 = isConfirmed && "✓ ", _v$161 = () => {
						return escape(session.family.familyName);
					}, _v$162 = !isConfirmed && isRecurring && " (Planned)", _v$163 = escape(ClientTime({ get date() {
						return session.scheduledStart;
					} })), _v$164 = escape(ClientTime({ get date() {
						return session.scheduledEnd;
					} })), _v$165 = scope(() => {
						return escape(session.children.map((c) => c.firstName).join(", "));
					});
					return ssr(_tmpl$37, _v$156, _g$8, _g$8, _g$8, ssrStyleProperty("font-weight:", isConfirmed ? "700" : "500"), _v$160, _v$161, _v$162, ssrStyleProperty("font-size:", "0.75rem") + ssrStyleProperty(";margin-top:", "0.25rem"), _v$163, _v$164, ssrStyleProperty("font-size:", "0.75rem") + ssrStyleProperty(";margin-top:", "0.25rem"), _v$165);
				}
			})), ssr(_tmpl$32, _v$151, ssrStyleProperty("padding:", "0.5rem") + ssrStyleProperty(";borderTop:", "1px solid var(--color-border)") + ssrStyleProperty(";min-height:", "60px") + ssrStyleProperty(";position:", "relative"), _v$152, _v$153))];
		}
	}));
	return ssr(_tmpl$35, _v$146, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";overflow:", "auto"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "120px 1fr"), ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";borderBottom:", "2px solid var(--color-border)"), ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";borderBottom:", "2px solid var(--color-border)") + ssrStyleProperty(";text-align:", "center"), _v$147, _v$148);
}
//#endregion
export { SchedulePage as default };
