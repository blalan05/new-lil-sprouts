import { w as useParams } from "./action-6MWjotYm.js";
import { F as getChild } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { n as SessionStatusBadge } from "./StatusBadge-Zr2kRO1T.js";
import { escape, memo, scope, ssr, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show } from "solid-js";
//#region src/routes/families/[id]/children/[childId]/index.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<wa-button",
	" href=\"",
	"\" appearance=\"plain\" size=\"small\">← Back to Family</wa-button>"
];
var _tmpl$2 = [
	"<div",
	"><strong class=\"wa-color-text-quiet\">Gender:</strong><p>",
	"</p></div>"
];
var _tmpl$3 = [
	"<wa-card",
	"><div class=\"wa-stack wa-gap-m\"><h2 class=\"wa-heading-l\">Basic Information</h2><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><div><strong class=\"wa-color-text-quiet\">Date of Birth:</strong><p>",
	"</p></div><div><strong class=\"wa-color-text-quiet\">Age:</strong><p><!--$-->",
	"<!--/--> years old</p></div><!--$-->",
	"<!--/--></div></div></wa-card>"
];
var _tmpl$4 = [
	"<div",
	"><strong class=\"wa-color-text-quiet\">School:</strong><p>",
	"</p></div>"
];
var _tmpl$5 = [
	"<div",
	"><strong class=\"wa-color-text-quiet\">Grade:</strong><p>",
	"</p></div>"
];
var _tmpl$6 = [
	"<div",
	"><strong class=\"wa-color-text-quiet\">Teacher:</strong><p>",
	"</p></div>"
];
var _tmpl$7 = [
	"<wa-card",
	"><div class=\"wa-stack wa-gap-m\"><h2 class=\"wa-heading-l\">School Information</h2><div class=\"wa-grid wa-gap-m\" style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div></div></wa-card>"
];
var _tmpl$8 = [
	"<div",
	"><strong>Allergies:</strong> <!--$-->",
	"<!--/--></div>"
];
var _tmpl$9 = [
	"<div",
	"><strong>Medications:</strong> <!--$-->",
	"<!--/--></div>"
];
var _tmpl$10 = [
	"<div",
	"><strong>Special Needs:</strong> <!--$-->",
	"<!--/--></div>"
];
var _tmpl$11 = [
	"<wa-callout",
	" variant=\"danger\"><div class=\"wa-stack wa-gap-s\"><h2 class=\"wa-heading-m\">Medical Information</h2><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div></wa-callout>"
];
var _tmpl$12 = [
	"<wa-card",
	"><div class=\"wa-stack wa-gap-s\"><h2 class=\"wa-heading-l\">Additional Notes</h2><p>",
	"</p></div></wa-card>"
];
var _tmpl$13 = [
	"<div",
	" style=\"",
	"\"><table style=\"",
	"\"><thead><tr style=\"",
	"\"><th style=\"",
	"\">Date/Time</th><th style=\"",
	"\">Duration</th><th style=\"",
	"\">Status</th></tr></thead><tbody>",
	"</tbody></table></div>"
];
var _tmpl$14 = [
	"<wa-card",
	"><div class=\"wa-stack wa-gap-m\"><h2 class=\"wa-heading-l\">Recent Care Sessions (<!--$-->",
	"<!--/-->)</h2><!--$-->",
	"<!--/--></div></wa-card>"
];
var _tmpl$15 = [
	"<div",
	" style=\"",
	"\" class=\"wa-color-text-quiet\">Loading child details...</div>"
];
var _tmpl$16 = [
	"<wa-button",
	" href=\"",
	"\" variant=\"brand\" appearance=\"filled\">Edit Child</wa-button>"
];
var _tmpl$17 = [
	"<p",
	" class=\"wa-color-text-quiet\" style=\"",
	"\">No care sessions recorded yet.</p>"
];
var _tmpl$18 = [
	"<tr",
	" style=\"",
	"\"><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td></tr>"
];
function ChildDetailPage() {
	var _v$, _v$2, _v$6, _v$7, _v$3, _v$4, _v$5, _v$8, _v$10, _v$11, _v$13, _v$14, _v$16, _v$17, _v$9, _v$12, _v$15, _v$18, _v$20, _v$21, _v$23, _v$24, _v$26, _v$27, _v$19, _v$22, _v$25, _v$28, _v$29, _v$30, _v$33, _v$34, _v$31, _v$32, _v$35;
	const params = useParams();
	const child = createMemo(() => getChild(params.childId));
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
	const calculateAge = (dateOfBirth) => {
		const today = /* @__PURE__ */ new Date();
		const birthDate = new Date(dateOfBirth);
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) age--;
		return age;
	};
	return PageContent({ get children() {
		return Show({
			get when() {
				return child();
			},
			get fallback() {
				var _v$36 = ssrHydrationKey();
				return ssr(_tmpl$15, _v$36, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "var(--wa-space-2xl)"));
			},
			get children() {
				return [
					(_v$ = ssrHydrationKey(), _v$2 = () => {
						return `/families/${escape(params.id, true)}`;
					}, ssr(_tmpl$, _v$, _v$2)),
					PageHeader({
						get title() {
							return `${child()?.firstName} ${child()?.lastName}`;
						},
						get actions() {
							var _v$37 = ssrHydrationKey(), _v$38 = () => {
								return `/families/${escape(params.id, true)}/children/${escape(params.childId, true)}/edit`;
							};
							return ssr(_tmpl$16, _v$37, _v$38);
						}
					}),
					(_v$3 = ssrHydrationKey(), _v$4 = scope((() => {
						var _c$ = memo(() => {
							return !!child()?.dateOfBirth;
						});
						return () => {
							return _c$() ? escape(formatDate(child().dateOfBirth)) : escape(child()?.dateOfBirth);
						};
					})()), _v$5 = scope((() => {
						var _c$2 = memo(() => {
							return !!child()?.dateOfBirth;
						});
						return () => {
							return _c$2() ? escape(calculateAge(child().dateOfBirth)) : escape(child()?.dateOfBirth);
						};
					})()), _v$8 = escape(Show({
						get when() {
							return child()?.gender;
						},
						get children() {
							return _v$6 = ssrHydrationKey(), _v$7 = () => {
								return escape(child()?.gender?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()));
							}, ssr(_tmpl$2, _v$6, _v$7);
						}
					})), ssr(_tmpl$3, _v$3, ssrStyleProperty("--min-column-size:", "200px"), _v$4, _v$5, _v$8)),
					Show({
						get when() {
							return child()?.schoolName || child()?.schoolGrade || child()?.schoolTeacher;
						},
						get children() {
							return _v$9 = ssrHydrationKey(), _v$12 = escape(Show({
								get when() {
									return child()?.schoolName;
								},
								get children() {
									return _v$10 = ssrHydrationKey(), _v$11 = () => {
										return escape(child()?.schoolName);
									}, ssr(_tmpl$4, _v$10, _v$11);
								}
							})), _v$15 = escape(Show({
								get when() {
									return child()?.schoolGrade;
								},
								get children() {
									return _v$13 = ssrHydrationKey(), _v$14 = () => {
										return escape(child()?.schoolGrade);
									}, ssr(_tmpl$5, _v$13, _v$14);
								}
							})), _v$18 = escape(Show({
								get when() {
									return child()?.schoolTeacher;
								},
								get children() {
									return _v$16 = ssrHydrationKey(), _v$17 = () => {
										return escape(child()?.schoolTeacher);
									}, ssr(_tmpl$6, _v$16, _v$17);
								}
							})), ssr(_tmpl$7, _v$9, ssrStyleProperty("--min-column-size:", "200px"), _v$12, _v$15, _v$18);
						}
					}),
					Show({
						get when() {
							return child()?.allergies || child()?.medications || child()?.specialNeeds;
						},
						get children() {
							return _v$19 = ssrHydrationKey(), _v$22 = escape(Show({
								get when() {
									return child()?.allergies;
								},
								get children() {
									return _v$20 = ssrHydrationKey(), _v$21 = () => {
										return escape(child()?.allergies);
									}, ssr(_tmpl$8, _v$20, _v$21);
								}
							})), _v$25 = escape(Show({
								get when() {
									return child()?.medications;
								},
								get children() {
									return _v$23 = ssrHydrationKey(), _v$24 = () => {
										return escape(child()?.medications);
									}, ssr(_tmpl$9, _v$23, _v$24);
								}
							})), _v$28 = escape(Show({
								get when() {
									return child()?.specialNeeds;
								},
								get children() {
									return _v$26 = ssrHydrationKey(), _v$27 = () => {
										return escape(child()?.specialNeeds);
									}, ssr(_tmpl$10, _v$26, _v$27);
								}
							})), ssr(_tmpl$11, _v$19, _v$22, _v$25, _v$28);
						}
					}),
					Show({
						get when() {
							return child()?.notes;
						},
						get children() {
							return _v$29 = ssrHydrationKey(), _v$30 = () => {
								return escape(child()?.notes);
							}, ssr(_tmpl$12, _v$29, _v$30);
						}
					}),
					(_v$31 = ssrHydrationKey(), _v$32 = () => {
						return escape(child()?.careSessions?.length || 0);
					}, _v$35 = escape(Show({
						get when() {
							return child()?.careSessions?.length;
						},
						get fallback() {
							var _v$39 = ssrHydrationKey();
							return ssr(_tmpl$17, _v$39, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "var(--wa-space-xl)"));
						},
						get children() {
							return _v$33 = ssrHydrationKey(), _v$34 = escape(For({
								get each() {
									return child()?.careSessions;
								},
								children: (session) => {
									var _v$40, _v$41, _v$42, _v$43;
									return _v$40 = ssrHydrationKey(), _v$41 = scope(() => {
										return escape(formatDateTime(session.scheduledStart));
									}), _v$42 = (() => {
										var _c$3 = memo(() => {
											return !!session.scheduledEnd;
										});
										return () => {
											return _c$3() ? `${escape(Math.round((new Date(session.scheduledEnd).getTime() - new Date(session.scheduledStart).getTime()) / 36e5))} hours` : "N/A";
										};
									})(), _v$43 = escape(SessionStatusBadge({ get status() {
										return session.status;
									} })), ssr(_tmpl$18, _v$40, ssrStyleProperty("border-bottom:", "1px solid var(--wa-color-neutral-90)"), ssrStyleProperty("padding:", "var(--wa-space-s)"), _v$41, ssrStyleProperty("padding:", "var(--wa-space-s)"), _v$42, ssrStyleProperty("padding:", "var(--wa-space-s)"), _v$43);
								}
							})), ssr(_tmpl$13, _v$33, ssrStyleProperty("overflow-x:", "auto"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";border-collapse:", "collapse"), ssrStyleProperty("border-bottom:", "1px solid var(--wa-color-neutral-90)"), ssrStyleProperty("padding:", "var(--wa-space-s)") + ssrStyleProperty(";text-align:", "left"), ssrStyleProperty("padding:", "var(--wa-space-s)") + ssrStyleProperty(";text-align:", "left"), ssrStyleProperty("padding:", "var(--wa-space-s)") + ssrStyleProperty(";text-align:", "left"), _v$34);
						}
					})), ssr(_tmpl$14, _v$31, _v$32, _v$35))
				];
			}
		});
	} });
}
//#endregion
export { ChildDetailPage as default };
