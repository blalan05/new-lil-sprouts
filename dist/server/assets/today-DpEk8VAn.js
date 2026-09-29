import { S as useNavigate } from "./action-6MWjotYm.js";
import { D as getMyDailyDigest, pt as formatTimeLocal, xt as getUser } from "../server.js";
import { n as hoursDisplay } from "./money-display-DvMwur0H.js";
import { escape, scope, ssr, ssrAttribute, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createEffect, createSignal } from "solid-js";
//#region src/routes/portal/today.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<main",
	" class=\"page\"><header style=\"",
	"\"><p style=\"",
	"\"><a href=\"/portal\">← Back to portal</a></p><h1 style=\"",
	"\">",
	"</h1><p class=\"text-muted\" style=\"",
	"\">Meals, sessions, and reports for the selected day.</p></header><div class=\"card\" style=\"",
	"\"><label for=\"digest-date\" class=\"text-muted\" style=\"",
	"\">Date</label><input id=\"digest-date\" type=\"date\" class=\"input-field\"",
	"></div><section class=\"card\" style=\"",
	"\">",
	"</section></main>"
];
var _tmpl$2 = ["<p", " class=\"empty-state\">Nothing scheduled for this day.</p>"];
var _tmpl$3 = [
	"<div",
	" class=\"text-muted\" style=\"",
	"\">",
	"</div>"
];
var _tmpl$4 = [
	"<ul",
	" style=\"",
	"\">",
	"</ul>"
];
var _tmpl$5 = [
	"<article",
	" style=\"",
	"\"><div style=\"",
	"\"><!--$-->",
	"<!--/--> – <!--$-->",
	"<!--/--><span class=\"text-muted\" style=\"",
	"\">(<!--$-->",
	"<!--/--> hrs)</span></div><!--$-->",
	"<!--/--><div class=\"text-muted\" style=\"",
	"\">Meals: B<!--$-->",
	"<!--/--> · AM<!--$-->",
	"<!--/--> · L<!--$-->",
	"<!--/--> · PM<!--$-->",
	"<!--/--> · D<!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--></article>"
];
var _tmpl$6 = [
	"<li",
	"><!--$-->",
	"<!--/--> (<!--$-->",
	"<!--/-->)</li>"
];
function PortalToday() {
	const navigate = useNavigate();
	const user = createMemo(() => getUser());
	const today = /* @__PURE__ */ new Date();
	const [selectedDate, setSelectedDate] = createSignal(today.toISOString().slice(0, 10));
	createEffect(() => {
		if (user()?.isOwner) navigate("/", { replace: true });
	});
	const digest = createMemo(() => {
		const [y, m, d] = selectedDate().split("-").map(Number);
		return getMyDailyDigest(new Date(y, m - 1, d));
	});
	const isToday = () => selectedDate() === today.toISOString().slice(0, 10);
	var _v$ = ssrHydrationKey(), _v$2 = () => {
		return isToday() ? "Today" : "Daily summary";
	}, _v$4 = escape(Show({
		get when() {
			return digest()?.length;
		},
		get fallback() {
			var _v$5 = ssrHydrationKey();
			return ssr(_tmpl$2, _v$5);
		},
		get children() {
			return For({
				get each() {
					return digest();
				},
				children: (session) => {
					var _v$10, _v$11, _v$18, _v$19, _v$6, _v$7, _v$8, _v$9, _v$12, _v$13, _v$14, _v$15, _v$16, _v$17, _v$20;
					return _v$6 = ssrHydrationKey(), _v$7 = scope(() => {
						return escape(formatTimeLocal(session.scheduledStart));
					}), _v$8 = scope(() => {
						return escape(formatTimeLocal(session.scheduledEnd));
					}), _v$9 = scope(() => {
						return escape(hoursDisplay(session.hours));
					}), _v$12 = escape(Show({
						get when() {
							return session.children.length > 0;
						},
						get children() {
							return _v$10 = ssrHydrationKey(), _v$11 = scope(() => {
								return escape(session.children.map((c) => `${c.firstName} ${c.lastName}`).join(", "));
							}), ssr(_tmpl$3, _v$10, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";margin-top:", "0.25rem"), _v$11);
						}
					})), _v$13 = () => {
						return escape(session.mealCounts.breakfast);
					}, _v$14 = () => {
						return escape(session.mealCounts.morningSnack);
					}, _v$15 = () => {
						return escape(session.mealCounts.lunch);
					}, _v$16 = () => {
						return escape(session.mealCounts.afternoonSnack);
					}, _v$17 = () => {
						return escape(session.mealCounts.dinner);
					}, _v$20 = escape(Show({
						get when() {
							return session.reports.length > 0;
						},
						get children() {
							return _v$18 = ssrHydrationKey(), _v$19 = escape(For({
								get each() {
									return session.reports;
								},
								children: (report) => {
									var _v$21, _v$22, _v$23;
									return _v$21 = ssrHydrationKey(), _v$22 = () => {
										return escape(report.title);
									}, _v$23 = () => {
										return escape(report.child.firstName);
									}, ssr(_tmpl$6, _v$21, _v$22, _v$23);
								}
							})), ssr(_tmpl$4, _v$18, ssrStyleProperty("margin-top:", "0.5rem") + ssrStyleProperty(";padding-left:", "1.25rem"), _v$19);
						}
					})), ssr(_tmpl$5, _v$6, ssrStyleProperty("margin-bottom:", "1rem") + ssrStyleProperty(";padding-bottom:", "1rem") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("font-weight:", "600"), _v$7, _v$8, ssrStyleProperty("font-weight:", "400") + ssrStyleProperty(";margin-left:", "0.5rem"), _v$9, _v$12, ssrStyleProperty("font-size:", "0.875rem") + ssrStyleProperty(";margin-top:", "0.25rem"), _v$13, _v$14, _v$15, _v$16, _v$17, _v$20);
				}
			});
		}
	})), _v$3 = () => {
		return ssrAttribute("value", escape(selectedDate(), true));
	};
	return ssr(_tmpl$, _v$, ssrStyleProperty("margin-bottom:", "1.5rem"), ssrStyleProperty("margin:", 0), ssrStyleProperty("margin:", "0.5rem 0 0"), _v$2, ssrStyleProperty("margin:", "0.5rem 0 0"), ssrStyleProperty("padding:", "1rem") + ssrStyleProperty(";margin-bottom:", "1.5rem"), ssrStyleProperty("display:", "block") + ssrStyleProperty(";margin-bottom:", "0.5rem"), _v$3, ssrStyleProperty("padding:", "1.25rem"), _v$4);
}
//#endregion
export { PortalToday as default };
