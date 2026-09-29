import { S as useNavigate, r as useAction } from "./action-6MWjotYm.js";
import { E as getMyChildReports, O as getMyFamily, T as confirmMySession, k as getMyUpcomingSessions, pt as formatTimeLocal, xt as getUser } from "../server.js";
import { escape, scope, ssr, ssrAttribute, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createEffect, createSignal } from "solid-js";
//#region src/routes/portal/index.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<ul",
	" style=\"",
	"\">",
	"</ul>"
];
var _tmpl$2 = [
	"<main",
	" class=\"page\"><header style=\"",
	"\"><h1 style=\"",
	"\">Parent Portal</h1><!--$-->",
	"<!--/--></header><section class=\"card\" style=\"",
	"\"><h2 style=\"",
	"\">Upcoming sessions</h2><!--$-->",
	"<!--/--></section><section class=\"card\" style=\"",
	"\"><div style=\"",
	"\"><h2 style=\"",
	"\">Today's summary</h2><a href=\"/portal/today\" class=\"btn\" style=\"",
	"\">View full day →</a></div><p class=\"text-muted\" style=\"",
	"\">See meals, sessions, and reports for today on the daily digest page.</p></section><section class=\"card\"><h2 style=\"",
	"\">Recent reports</h2><!--$-->",
	"<!--/--></section><p style=\"",
	"\"><a href=\"/account\">Account settings</a></p></main>"
];
var _tmpl$3 = [
	"<p",
	" style=\"",
	"\">",
	"</p>"
];
var _tmpl$4 = ["<p", " class=\"empty-state\">No upcoming sessions.</p>"];
var _tmpl$5 = [
	"<button",
	" type=\"button\" class=\"btn btn-primary\"",
	">",
	"</button>"
];
var _tmpl$6 = [
	"<span",
	" style=\"",
	"\">Confirmed</span>"
];
var _tmpl$7 = [
	"<li",
	" style=\"",
	"\"><div><div style=\"",
	"\">",
	"</div><div style=\"",
	"\"><!--$-->",
	"<!--/--> · <!--$-->",
	"<!--/--> – <!--$-->",
	"<!--/--></div></div><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></li>"
];
var _tmpl$8 = ["<p", " class=\"empty-state\">No reports yet.</p>"];
var _tmpl$9 = [
	"<li",
	" style=\"",
	"\"><div style=\"",
	"\">",
	"</div><div style=\"",
	"\"><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--> · <!--$-->",
	"<!--/--></div><p style=\"",
	"\">",
	"</p></li>"
];
function ParentPortal() {
	var _v$3, _v$4, _v$6, _v$7;
	const navigate = useNavigate();
	const user = createMemo(() => getUser());
	const family = createMemo(() => getMyFamily());
	const sessions = createMemo(() => getMyUpcomingSessions());
	const reports = createMemo(() => getMyChildReports());
	useAction(confirmMySession);
	const [confirmingId, setConfirmingId] = createSignal(null);
	createEffect(() => {
		if (user()?.isOwner) navigate("/", { replace: true });
	});
	var _v$ = ssrHydrationKey(), _v$2 = escape(Show({
		get when() {
			return family();
		},
		children: (f) => {
			var _v$9, _v$10;
			return _v$9 = ssrHydrationKey(), _v$10 = () => {
				return escape(f().familyName);
			}, ssr(_tmpl$3, _v$9, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";margin:", "0.5rem 0 0"), _v$10);
		}
	})), _v$5 = escape(Show({
		get when() {
			return sessions()?.length;
		},
		get fallback() {
			var _v$11 = ssrHydrationKey();
			return ssr(_tmpl$4, _v$11);
		},
		get children() {
			return _v$3 = ssrHydrationKey(), _v$4 = escape(For({
				get each() {
					return sessions();
				},
				children: (session) => {
					var _v$17, _v$18, _v$19, _v$21, _v$12, _v$13, _v$14, _v$15, _v$16, _v$20, _v$22;
					return _v$12 = ssrHydrationKey(), _v$13 = () => {
						return escape(session.service.name);
					}, _v$14 = scope(() => {
						return escape(new Date(session.scheduledStart).toLocaleDateString());
					}), _v$15 = scope(() => {
						return escape(formatTimeLocal(session.scheduledStart));
					}), _v$16 = scope(() => {
						return escape(formatTimeLocal(session.scheduledEnd));
					}), _v$20 = escape(Show({
						get when() {
							return !session.isConfirmed;
						},
						get children() {
							return _v$17 = ssrHydrationKey(), _v$18 = () => {
								return ssrAttribute("disabled", escape(confirmingId(), true) === escape(session.id, true));
							}, _v$19 = () => {
								return confirmingId() === session.id ? "Confirming…" : "Confirm";
							}, ssr(_tmpl$5, _v$17, _v$18, _v$19);
						}
					})), _v$22 = escape(Show({
						get when() {
							return session.isConfirmed;
						},
						get children() {
							return _v$21 = ssrHydrationKey(), ssr(_tmpl$6, _v$21, ssrStyleProperty("color:", "var(--color-success)") + ssrStyleProperty(";font-size:", "0.875rem"));
						}
					})), ssr(_tmpl$7, _v$12, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "1rem") + ssrStyleProperty(";padding:", "0.75rem 0") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("font-weight:", "600"), _v$13, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$14, _v$15, _v$16, _v$20, _v$22);
				}
			})), ssr(_tmpl$, _v$3, ssrStyleProperty("list-style:", "none") + ssrStyleProperty(";padding:", 0) + ssrStyleProperty(";margin:", 0), _v$4);
		}
	})), _v$8 = escape(Show({
		get when() {
			return reports()?.length;
		},
		get fallback() {
			var _v$23 = ssrHydrationKey();
			return ssr(_tmpl$8, _v$23);
		},
		get children() {
			return _v$6 = ssrHydrationKey(), _v$7 = escape(For({
				get each() {
					return reports();
				},
				children: (report) => {
					var _v$24, _v$25, _v$26, _v$27, _v$28, _v$29;
					return _v$24 = ssrHydrationKey(), _v$25 = () => {
						return escape(report.title);
					}, _v$26 = () => {
						return escape(report.child.firstName);
					}, _v$27 = () => {
						return escape(report.child.lastName);
					}, _v$28 = scope(() => {
						return escape(new Date(report.timestamp).toLocaleString());
					}), _v$29 = () => {
						return escape(report.description);
					}, ssr(_tmpl$9, _v$24, ssrStyleProperty("padding:", "0.75rem 0") + ssrStyleProperty(";border-bottom:", "1px solid var(--color-border)"), ssrStyleProperty("font-weight:", "600"), _v$25, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$26, _v$27, _v$28, ssrStyleProperty("margin:", "0.5rem 0 0"), _v$29);
				}
			})), ssr(_tmpl$, _v$6, ssrStyleProperty("list-style:", "none") + ssrStyleProperty(";padding:", 0) + ssrStyleProperty(";margin:", 0), _v$7);
		}
	}));
	return ssr(_tmpl$2, _v$, ssrStyleProperty("margin-bottom:", "1.5rem"), ssrStyleProperty("margin:", 0), _v$2, ssrStyleProperty("margin-bottom:", "1.5rem"), ssrStyleProperty("margin-top:", 0), _v$5, ssrStyleProperty("margin-bottom:", "1.5rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "1rem"), ssrStyleProperty("margin:", 0), ssrStyleProperty("font-size:", "0.875rem"), ssrStyleProperty("margin:", "0.75rem 0 0") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("margin-top:", 0), _v$8, ssrStyleProperty("margin-top:", "1.5rem"));
}
//#endregion
export { ParentPortal as default };
