import { r as getUpcomingUnavailabilities, yt as useConfirm } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, memo, scope, ssr, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show } from "solid-js";
//#region src/routes/unavailability/index.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<div",
	" class=\"wa-stack wa-gap-s\">",
	"</div>"
];
var _tmpl$2 = [
	"<wa-card",
	">",
	"</wa-card>"
];
var _tmpl$3 = ["<wa-button", " href=\"/unavailability/new\" variant=\"danger\" appearance=\"filled\">+ Block Time</wa-button>"];
var _tmpl$4 = [
	"<div",
	" class=\"wa-stack wa-gap-m\" style=\"",
	"\"><p class=\"wa-body-l wa-color-text-quiet\">No unavailable times set</p><p class=\"wa-body-m wa-color-text-quiet\">Block out vacation days, holidays, or specific times when you&apos;re unavailable</p><wa-button href=\"/unavailability/new\" variant=\"danger\" appearance=\"filled\">Block Your First Time</wa-button></div>"
];
var _tmpl$5 = [
	"<p",
	" class=\"wa-body-s wa-color-text-quiet\">",
	"</p>"
];
var _tmpl$6 = [
	"<div",
	" class=\"wa-flank wa-gap-m\" style=\"",
	"\"><div class=\"wa-stack wa-gap-xs\" style=\"",
	"\"><div class=\"wa-cluster wa-gap-s\"><h3 class=\"wa-heading-m\">",
	"</h3><wa-badge variant=\"danger\" appearance=\"filled-outlined\" pill>",
	"</wa-badge></div><div class=\"wa-cluster wa-gap-l\"><div><span class=\"wa-body-s wa-color-text-quiet\">From: </span><span class=\"wa-body-s\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></span></div><div><span class=\"wa-body-s wa-color-text-quiet\">To: </span><span class=\"wa-body-s\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></span></div></div><!--$-->",
	"<!--/--></div><div class=\"wa-cluster wa-gap-s\"><wa-button href=\"",
	"\" appearance=\"outlined\" size=\"small\">Edit</wa-button><wa-button variant=\"danger\" appearance=\"outlined\" size=\"small\">Delete</wa-button></div></div>"
];
function UnavailabilityList() {
	var _v$2, _v$3, _v$, _v$4;
	const { confirm } = useConfirm();
	const unavailabilities = createMemo(() => getUpcomingUnavailabilities());
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
		return [PageHeader({
			title: "Unavailable Times",
			description: "Manage days and times when care is not available",
			get actions() {
				var _v$5 = ssrHydrationKey();
				return ssr(_tmpl$3, _v$5);
			}
		}), (_v$ = ssrHydrationKey(), _v$4 = escape(Show({
			get when() {
				return unavailabilities()?.length;
			},
			get fallback() {
				var _v$6 = ssrHydrationKey();
				return ssr(_tmpl$4, _v$6, ssrStyleProperty("padding:", "var(--wa-space-xl)") + ssrStyleProperty(";text-align:", "center"));
			},
			get children() {
				return _v$2 = ssrHydrationKey(), _v$3 = escape(For({
					get each() {
						return unavailabilities();
					},
					children: (unavailability) => {
						var _v$14, _v$15, _v$7, _v$8, _v$9, _v$10, _v$11, _v$12, _v$13, _v$16, _v$17;
						return _v$7 = ssrHydrationKey(), _v$8 = () => {
							return escape(unavailability.reason || "Time Off");
						}, _v$9 = () => {
							return unavailability.allDay ? "All Day" : "Specific Hours";
						}, _v$10 = scope(() => {
							return escape(formatDate(unavailability.startDate));
						}), _v$11 = (() => {
							var _c$ = memo(() => {
								return !!(!unavailability.allDay && unavailability.startTime);
							});
							return () => {
								return _c$() ? ` at ${escape(formatTime(unavailability.startTime))}` : !unavailability.allDay && escape(unavailability.startTime);
							};
						})(), _v$12 = scope(() => {
							return escape(formatDate(unavailability.endDate));
						}), _v$13 = (() => {
							var _c$2 = memo(() => {
								return !!(!unavailability.allDay && unavailability.endTime);
							});
							return () => {
								return _c$2() ? ` at ${escape(formatTime(unavailability.endTime))}` : !unavailability.allDay && escape(unavailability.endTime);
							};
						})(), _v$16 = escape(Show({
							get when() {
								return unavailability.notes;
							},
							get children() {
								return _v$14 = ssrHydrationKey(), _v$15 = () => {
									return escape(unavailability.notes);
								}, ssr(_tmpl$5, _v$14, _v$15);
							}
						})), _v$17 = () => {
							return `/unavailability/${escape(unavailability.id, true)}/edit`;
						}, ssr(_tmpl$6, _v$7, ssrStyleProperty("padding:", "var(--wa-space-m)") + ssrStyleProperty(";border-bottom:", "1px solid var(--wa-color-neutral-90)"), ssrStyleProperty("flex:", "1"), _v$8, _v$9, _v$10, _v$11, _v$12, _v$13, _v$16, _v$17);
					}
				})), ssr(_tmpl$, _v$2, _v$3);
			}
		})), ssr(_tmpl$2, _v$, _v$4))];
	} });
}
//#endregion
export { UnavailabilityList as default };
