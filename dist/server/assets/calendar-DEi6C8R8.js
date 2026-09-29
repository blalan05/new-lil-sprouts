import { at as getCareSessionsForRange, mt as isSameDay, pt as formatTimeLocal, ut as ensureDate } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, memo, scope, ssr, ssrAttribute, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createMemo, createSignal } from "solid-js";
//#region src/routes/reports/calendar.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<div",
	" class=\"no-print wa-stack wa-gap-m\"><wa-button href=\"/reports\" appearance=\"plain\" size=\"small\">← Back to Reports</wa-button><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-m\" style=\"",
	"\"><div><label style=\"",
	"\">Month</label><select",
	" style=\"",
	"\">",
	"</select></div><div><label style=\"",
	"\">Year</label><select",
	" style=\"",
	"\">",
	"</select></div></div></div>"
];
var _tmpl$2 = [
	"<div",
	" style=\"",
	"\" class=\"print-header\"><h1 style=\"",
	"\" class=\"print-title no-print\">Care Sessions Calendar</h1><div style=\"",
	"\" class=\"print-month\">",
	"</div><div style=\"",
	"\" class=\"print-summary\">Total Sessions: <!--$-->",
	"<!--/--> | Total Hours: <!--$-->",
	"<!--/-->h</div></div>"
];
var _tmpl$3 = [
	"<div",
	" style=\"",
	"\" class=\"calendar-grid\">",
	"</div>"
];
var _tmpl$4 = [
	"<div",
	" style=\"",
	"\" class=\"calendar-container\"><div style=\"",
	"\" class=\"calendar-day-headers\">",
	"</div><!--$-->",
	"<!--/--></div>"
];
var _tmpl$5 = ["<style", ">\n          @media print {\n            .no-print {\n              display: none !important;\n            }\n\n            /* Optimize for landscape orientation - single page */\n            @page {\n              size: landscape;\n              margin: 0.05in 0.2in;\n            }\n\n            * {\n              box-sizing: border-box;\n            }\n\n            html, body {\n              margin: 0 !important;\n              padding: 0 !important;\n              height: 100% !important;\n            }\n\n            /* Container optimization */\n            div[style*=\"max-width\"] {\n              max-width: 100% !important;\n              padding: 0 !important;\n              margin: 0 !important;\n              height: 100% !important;\n            }\n\n            /* Ultra-compact header for single page - override all inline styles */\n            .print-header {\n              page-break-after: avoid;\n              margin-bottom: 0.05rem !important;\n              padding: 0 !important;\n              line-height: 1 !important;\n              height: auto !important;\n              text-align: center !important;\n            }\n\n            /* Hide title in print */\n            .print-header h1.print-title,\n            .print-title {\n              display: none !important;\n            }\n\n            /* Month name - bigger for print */\n            .print-header .print-month,\n            .print-month {\n              font-size: 0.85rem !important;\n              margin: 0 0 0.02rem 0 !important;\n              padding: 0 !important;\n              line-height: 1 !important;\n              display: block !important;\n              font-weight: 600 !important;\n            }\n\n            /* Summary - show in print with appropriate size */\n            .print-header .print-summary,\n            .print-summary {\n              font-size: 0.65rem !important;\n              margin: 0 !important;\n              padding: 0 !important;\n              line-height: 1 !important;\n              display: block !important;\n            }\n\n            /* Calendar container - maximize space */\n            .calendar-container {\n              page-break-inside: avoid;\n              border-radius: 0 !important;\n              border: 1px solid #2d3748 !important;\n              margin-top: 0.02rem !important;\n              height: calc(100% - 0.2in) !important;\n              display: flex !important;\n              flex-direction: column !important;\n            }\n\n            /* Day headers - ultra compact */\n            .calendar-day-headers {\n              padding: 0.08rem 0.06rem !important;\n              border-bottom: 1px solid #2d3748 !important;\n              flex-shrink: 0 !important;\n            }\n\n            .calendar-day-header {\n              padding: 0.08rem 0.06rem !important;\n              font-size: 0.6rem !important;\n              font-weight: 700 !important;\n              line-height: 1 !important;\n            }\n\n            /* Calendar grid - ensure proper layout */\n            .calendar-grid {\n              display: grid !important;\n              grid-template-columns: repeat(7, 1fr) !important;\n              flex: 1 !important;\n              min-height: 0 !important;\n            }\n\n            /* Calendar day cells - fit on single page with header */\n            /* Landscape: 11in - 0.1in margins = 10.9in usable */\n            /* Header ~0.12in + Day headers ~0.12in = 0.24in */\n            /* Remaining ~10.66in / 6 rows = ~1.78in per row, use 1.15in to be safe */\n            .calendar-day-cell {\n              min-height: 0 !important;\n              height: 1.15in !important;\n              max-height: 1.15in !important;\n              padding: 0.08rem 0.08rem !important;\n              border: 1px solid #cbd5e0 !important;\n              overflow: hidden !important;\n              display: flex !important;\n              flex-direction: column !important;\n            }\n\n            /* Date numbers - compact */\n            .calendar-day-number {\n              font-size: 0.7rem !important;\n              margin-bottom: 0.08rem !important;\n              line-height: 1 !important;\n              flex-shrink: 0 !important;\n            }\n\n            /* Sessions container */\n            .calendar-sessions {\n              gap: 0.08rem !important;\n              flex: 1 !important;\n              overflow: hidden !important;\n              min-height: 0 !important;\n            }\n\n            /* Hide \"No sessions\" text in print */\n            .no-sessions-text {\n              display: none !important;\n            }\n\n            /* Session blocks - ultra compact for print */\n            .session-block {\n              padding: 0.1rem 0.15rem !important;\n              margin-bottom: 0.06rem !important;\n              font-size: 0.55rem !important;\n              line-height: 1.1 !important;\n              border-left-width: 1.5px !important;\n            }\n\n            .session-family {\n              font-size: 0.6rem !important;\n              font-weight: 700 !important;\n              margin-bottom: 0.03rem !important;\n              line-height: 1.1 !important;\n            }\n\n            .session-children {\n              font-size: 0.5rem !important;\n              margin-bottom: 0.03rem !important;\n              line-height: 1.1 !important;\n            }\n\n            .session-time {\n              font-size: 0.5rem !important;\n              line-height: 1.1 !important;\n            }\n          }\n        </style>"];
var _tmpl$6 = ["<wa-button", " variant=\"brand\" appearance=\"filled\">Print Calendar</wa-button>"];
var _tmpl$7 = [
	"<option",
	"",
	">",
	"</option>"
];
var _tmpl$8 = [
	"<div",
	" style=\"",
	"\" class=\"calendar-day-header\">",
	"</div>"
];
var _tmpl$9 = [
	"<div",
	" style=\"",
	"\">Loading sessions...</div>"
];
var _tmpl$10 = [
	"<div",
	" style=\"",
	"\" class=\"calendar-day-cell\"><div style=\"",
	"\" class=\"calendar-day-number\">",
	"</div><div style=\"",
	"\" class=\"calendar-sessions\">",
	"</div></div>"
];
var _tmpl$11 = [
	"<div",
	" style=\"",
	"\" class=\"no-sessions-text\">No sessions</div>"
];
var _tmpl$12 = [
	"<div",
	" style=\"",
	"\" class=\"session-children\">",
	"</div>"
];
var _tmpl$13 = [
	"<div",
	" style=\"",
	"\" class=\"session-block\"><div style=\"",
	"\" class=\"session-family\">",
	"</div><!--$-->",
	"<!--/--><div style=\"",
	"\" class=\"session-time\"><!--$-->",
	"<!--/--> - <!--$-->",
	"<!--/--> (<!--$-->",
	"<!--/-->)</div></div>"
];
function CalendarReport() {
	var _v$, _v$2, _v$4, _v$6, _v$3, _v$5, _v$7, _v$8, _v$9, _v$10, _v$13, _v$14, _v$11, _v$12, _v$15, _v$16;
	const today = /* @__PURE__ */ new Date();
	const previousMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
	const previousYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
	const [selectedYear, setSelectedYear] = createSignal(previousYear);
	const [selectedMonth, setSelectedMonth] = createSignal(previousMonth);
	const dateRange = createMemo(() => {
		const year = selectedYear();
		const month = selectedMonth();
		return {
			start: new Date(year, month, 1),
			end: new Date(year, month + 1, 0, 23, 59, 59)
		};
	});
	const sessions = createMemo(() => {
		const range = dateRange();
		return getCareSessionsForRange(range.start, range.end);
	});
	const formatTime = (date) => {
		const d = date instanceof Date ? date : new Date(date);
		if (isNaN(d.getTime())) {
			console.error("Invalid date:", date);
			return "Invalid";
		}
		return formatTimeLocal(d);
	};
	const formatDuration = (start, end) => {
		return `${((end.getTime() - start.getTime()) / 36e5).toFixed(1)}h`;
	};
	const calendarDays = createMemo(() => {
		const year = selectedYear();
		const month = selectedMonth();
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
		return days;
	});
	const isCurrentMonth = (date) => {
		return date.getMonth() === selectedMonth() && date.getFullYear() === selectedYear();
	};
	const getSessionsForDay = (date) => {
		const allSessions = sessions();
		if (!allSessions || allSessions.length === 0) return [];
		const targetYear = date.getFullYear();
		const targetMonth = date.getMonth();
		const targetDay = date.getDate();
		return allSessions.filter((session) => {
			const sessionDate = ensureDate(session.scheduledStart);
			if (isNaN(sessionDate.getTime())) return false;
			return isSameDay(sessionDate, new Date(targetYear, targetMonth, targetDay));
		}).sort((a, b) => {
			return ensureDate(a.scheduledStart).getTime() - ensureDate(b.scheduledStart).getTime();
		});
	};
	const monthName = createMemo(() => {
		return new Date(selectedYear(), selectedMonth(), 1).toLocaleDateString("en-US", {
			month: "long",
			year: "numeric"
		});
	});
	const totalHours = createMemo(() => {
		const allSessions = sessions() || [];
		let total = 0;
		for (const session of allSessions) {
			const start = ensureDate(session.scheduledStart).getTime();
			const end = ensureDate(session.scheduledEnd).getTime();
			total += (end - start) / 36e5;
		}
		return total.toFixed(1);
	});
	const totalSessions = createMemo(() => {
		return sessions()?.length || 0;
	});
	return PageContent({ get children() {
		return [
			(_v$ = ssrHydrationKey(), _v$2 = escape(PageHeader({
				title: "Care Sessions Calendar",
				get description() {
					return monthName();
				},
				get actions() {
					var _v$17 = ssrHydrationKey();
					return ssr(_tmpl$6, _v$17);
				}
			})), _v$4 = scope(() => {
				return escape(Array.from({ length: 12 }, (_, i) => {
					var _v$18, _v$19;
					return _v$18 = ssrHydrationKey(), _v$19 = scope(() => {
						return escape(new Date(selectedYear(), i, 1).toLocaleDateString("en-US", { month: "long" }));
					}), ssr(_tmpl$7, _v$18, ssrAttribute("value", escape(i, true)), _v$19);
				}));
			}), _v$6 = scope(() => {
				return escape(Array.from({ length: 5 }, (_, i) => {
					const year = today.getFullYear() - i;
					var _v$20 = ssrHydrationKey(), _v$21 = escape(year);
					return ssr(_tmpl$7, _v$20, ssrAttribute("value", escape(year, true)), _v$21);
				}));
			}), _v$3 = () => {
				return ssrAttribute("value", escape(selectedMonth(), true));
			}, _v$5 = () => {
				return ssrAttribute("value", escape(selectedYear(), true));
			}, ssr(_tmpl$, _v$, _v$2, ssrStyleProperty("flex-wrap:", "wrap"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.25rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-weight:", "500"), _v$3, ssrStyleProperty("padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "0.875rem"), _v$4, ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.25rem") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-weight:", "500"), _v$5, ssrStyleProperty("padding:", "0.5rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "0.875rem"), _v$6)),
			(_v$7 = ssrHydrationKey(), _v$8 = scope(() => {
				return escape(monthName());
			}), _v$9 = scope(() => {
				return escape(totalSessions());
			}), _v$10 = scope(() => {
				return escape(totalHours());
			}), ssr(_tmpl$2, _v$7, ssrStyleProperty("margin-bottom:", "1rem") + ssrStyleProperty(";text-align:", "center"), ssrStyleProperty("font-size:", "1.75rem") + ssrStyleProperty(";font-weight:", "700") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin:", "0 0 0.5rem 0"), ssrStyleProperty("font-size:", "1.125rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin-bottom:", "0.5rem"), _v$8, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";color:", "var(--color-text-muted)"), _v$9, _v$10)),
			(_v$11 = ssrHydrationKey(), _v$12 = escape(For({
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
					var _v$22, _v$23;
					return _v$22 = ssrHydrationKey(), _v$23 = escape(day), ssr(_tmpl$8, _v$22, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$23);
				}
			})), _v$15 = escape(Show({
				get when() {
					return sessions() !== void 0;
				},
				get fallback() {
					var _v$24 = ssrHydrationKey();
					return ssr(_tmpl$9, _v$24, ssrStyleProperty("padding:", "2rem") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";color:", "var(--color-text-muted)"));
				},
				get children() {
					return _v$13 = ssrHydrationKey(), _v$14 = escape(For({
						get each() {
							return calendarDays();
						},
						children: (day) => {
							const daySessions = createMemo(() => {
								if (!sessions()) return [];
								return getSessionsForDay(day);
							});
							const isCurrentMonthDay = isCurrentMonth(day);
							const isToday = day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear();
							var _v$25 = ssrHydrationKey(), _v$26 = scope(() => {
								return escape(day.getDate());
							}), _v$27 = escape(Show({
								get when() {
									return daySessions().length > 0;
								},
								get fallback() {
									var _v$28 = ssrHydrationKey();
									return ssr(_tmpl$11, _v$28, ssrStyleProperty("font-size:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text-subtle)") + ssrStyleProperty(";font-style:", "italic"));
								},
								get children() {
									return For({
										get each() {
											return getSessionsForDay(day);
										},
										children: (session) => {
											var _v$31, _v$32;
											const startTime = ensureDate(session.scheduledStart);
											const endTime = ensureDate(session.scheduledEnd);
											const duration = formatDuration(startTime, endTime);
											var _v$29 = ssrHydrationKey(), _v$30 = () => {
												return escape(session.family.familyName);
											}, _v$33 = escape(Show({
												get when() {
													return memo(() => {
														return !!session.children;
													})() ? session.children.length > 0 : session.children;
												},
												get children() {
													return _v$31 = ssrHydrationKey(), _v$32 = scope(() => {
														return escape(session.children.map((c) => `${c.firstName} ${c.lastName}`).join(", "));
													}), ssr(_tmpl$12, _v$31, ssrStyleProperty("font-size:", "0.65rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";margin-bottom:", "0.125rem"), _v$32);
												}
											})), _v$34 = scope(() => {
												return escape(formatTime(startTime));
											}), _v$35 = scope(() => {
												return escape(formatTime(endTime));
											}), _v$36 = escape(duration);
											return ssr(_tmpl$13, _v$29, ssrStyleProperty("padding:", "0.25rem 0.375rem") + ssrStyleProperty(";background-color:", "var(--wa-color-brand-fill-normal)") + ssrStyleProperty(";color:", "#2c5282") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "0.7rem") + ssrStyleProperty(";line-height:", "1.3") + ssrStyleProperty(";border-left:", "2px solid #2c5282") + ssrStyleProperty(";margin-bottom:", "0.2rem"), ssrStyleProperty("font-weight:", "600") + ssrStyleProperty(";font-size:", "0.7rem") + ssrStyleProperty(";margin-bottom:", "0.125rem"), _v$30, _v$33, ssrStyleProperty("font-size:", "0.65rem") + ssrStyleProperty(";color:", "#1a365d") + ssrStyleProperty(";font-weight:", "500"), _v$34, _v$35, _v$36);
										}
									});
								}
							}));
							return ssr(_tmpl$10, _v$25, ssrStyleProperty("minHeight:", "120px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";padding:", "0.5rem") + ssrStyleProperty(";background-color:", isCurrentMonthDay ? "var(--color-surface)" : "var(--color-surface-muted)") + ssrStyleProperty(";position:", "relative"), ssrStyleProperty("font-weight:", isToday ? "700" : "400") + ssrStyleProperty(";color:", isCurrentMonthDay ? "var(--color-text)" : "var(--color-text-subtle)") + ssrStyleProperty(";margin-bottom:", "0.25rem") + ssrStyleProperty(";font-size:", isToday ? "1rem" : "0.875rem"), _v$26, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-direction:", "column") + ssrStyleProperty(";gap:", "0.25rem"), _v$27);
						}
					})), ssr(_tmpl$3, _v$13, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(7, 1fr)"), _v$14);
				}
			})), ssr(_tmpl$4, _v$11, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";overflow:", "hidden"), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(7, 1fr)") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";borderBottom:", "2px solid var(--color-border)"), _v$12, _v$15)),
			(_v$16 = ssrHydrationKey(), ssr(_tmpl$5, _v$16))
		];
	} });
}
//#endregion
export { CalendarReport as default };
