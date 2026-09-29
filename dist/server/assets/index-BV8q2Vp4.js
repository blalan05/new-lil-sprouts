import { S as useNavigate } from "./action-6MWjotYm.js";
import { P as getAllChildren, X as formatParentNames, Z as getFamilies, yt as useConfirm } from "../server.js";
import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { t as allergyLabel } from "./display-CkIy29Ue.js";
import { r as moneyDisplay, t as formatMoneyDisplay } from "./money-display-DvMwur0H.js";
import { escape, memo, scope, ssr, ssrAttribute, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { For, Show, createEffect, createSignal } from "solid-js";
//#region src/routes/families/index.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<div",
	" class=\"wa-stack wa-gap-m\"><a href=\"/\" class=\"wa-body-s wa-color-text-quiet\">← Back to Dashboard</a><!--$-->",
	"<!--/--></div>"
];
var _tmpl$2 = [
	"<div",
	" class=\"wa-cluster wa-gap-xs\" style=\"",
	"\"><button style=\"",
	"\">Families</button><button style=\"",
	"\">All Children</button></div>"
];
var _tmpl$3 = [
	"<div",
	" style=\"",
	"\">",
	"</div>"
];
var _tmpl$4 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><table style=\"",
	"\"><thead><tr style=\"",
	"\"><th style=\"",
	"\">Last</th><th style=\"",
	"\">Parents</th><th style=\"",
	"\">Children Names</th><th style=\"",
	"\">Amount Owed</th><th style=\"",
	"\">Watched Since</th><th style=\"",
	"\">Actions</th></tr></thead><tbody>",
	"</tbody></table></div></div>"
];
var _tmpl$5 = [
	"<div",
	" style=\"",
	"\"><div style=\"",
	"\"><table style=\"",
	"\"><thead><tr style=\"",
	"\"><th style=\"",
	"\">Last</th><th style=\"",
	"\">First</th><th style=\"",
	"\">Age/Birthday</th><th style=\"",
	"\">Gender</th><th style=\"",
	"\">Watched Since</th><th style=\"",
	"\">Actions</th></tr></thead><tbody>",
	"</tbody></table></div></div>"
];
var _tmpl$6 = ["<a", " href=\"/families/new\"><wa-button variant=\"brand\" appearance=\"filled\">+ Add New Family</wa-button></a>"];
var _tmpl$7 = ["<a", " href=\"/families\"><wa-button variant=\"brand\" appearance=\"filled\">+ Add Child (via Families)</wa-button></a>"];
var _tmpl$8 = [
	"<input",
	" type=\"text\" placeholder=\"Search families by name or email...\"",
	" style=\"",
	"\">"
];
var _tmpl$9 = [
	"<div",
	" style=\"",
	"\"><input type=\"text\" placeholder=\"Search children by name, family, allergies, or school...\"",
	" style=\"",
	"\"><select",
	" style=\"",
	"\"><option value>All Families</option><!--$-->",
	"<!--/--></select></div>"
];
var _tmpl$10 = [
	"<option",
	"",
	">",
	"</option>"
];
var _tmpl$11 = [
	"<div",
	" style=\"",
	"\">Loading families...</div>"
];
var _tmpl$12 = [
	"<div",
	" style=\"",
	"\"><p style=\"",
	"\">No families found. Click \"Add New Family\" to get started.</p></div>"
];
var _tmpl$13 = [
	"<span",
	" style=\"",
	"\">",
	"</span>"
];
var _tmpl$14 = [
	"<tr",
	" style=\"",
	"\" tabindex=\"0\" role=\"link\"><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\"><div style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div></td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\"><div style=\"",
	"\" data-dropdown-container><button data-dropdown-button style=\"",
	"\">Actions<span style=\"",
	"\">▼</span></button><!--$-->",
	"<!--/--></div></td></tr>"
];
var _tmpl$15 = [
	"<a",
	" href=\"",
	"\" style=\"",
	"\"><!--$-->",
	"<!--/--> <!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></a>"
];
var _tmpl$16 = [
	"<span",
	"",
	"",
	"> (allergy)</span>"
];
var _tmpl$17 = [
	"<span",
	" style=\"",
	"\">None</span>"
];
var _tmpl$18 = [
	"<span",
	" style=\"",
	"\">$0.00</span>"
];
var _tmpl$19 = [
	"<div",
	" style=\"",
	"\">(<!--$-->",
	"<!--/--> unpaid)</div>"
];
var _tmpl$20 = [
	"<div",
	" data-dropdown-menu style=\"",
	"\"><a href=\"",
	"\" style=\"",
	"\"><span>👁️</span><span>View</span></a><a href=\"",
	"\" style=\"",
	"\"><span>✏️</span><span>Edit</span></a><wa-button variant=\"danger\" appearance=\"plain\" style=\"",
	"\">🗑️ Delete</wa-button></div>"
];
var _tmpl$21 = [
	"<div",
	" style=\"",
	"\">Loading children...</div>"
];
var _tmpl$22 = [
	"<div",
	" style=\"",
	"\"><p style=\"",
	"\">No children found. Add children through the Families page.</p></div>"
];
var _tmpl$23 = [
	"<span",
	" style=\"",
	"\" title=\"Has allergies\">⚠️</span>"
];
var _tmpl$24 = [
	"<span",
	" style=\"",
	"\" title=\"Has medications\">💊</span>"
];
var _tmpl$25 = [
	"<span",
	" style=\"",
	"\" title=\"Has special needs\">♿</span>"
];
var _tmpl$26 = [
	"<tr",
	" style=\"",
	"\"><td style=\"",
	"\">",
	"</td><td style=\"",
	"\"><div style=\"",
	"\"><span>",
	"</span><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div></td><td style=\"",
	"\"><!--$-->",
	"<!--/--> (<!--$-->",
	"<!--/-->)</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\">",
	"</td><td style=\"",
	"\"><div style=\"",
	"\" data-dropdown-container><button data-dropdown-button style=\"",
	"\">Actions<span style=\"",
	"\">▼</span></button><!--$-->",
	"<!--/--></div></td></tr>"
];
function FamiliesPage() {
	var _v$, _v$2, _v$3, _g$, _v$6, _v$7, _v$8, _v$9, _v$10, _v$11;
	useNavigate();
	const { confirm } = useConfirm();
	const [view, setView] = createSignal("families");
	const families = createMemo(() => getFamilies());
	const children = createMemo(() => getAllChildren());
	const [searchTerm, setSearchTerm] = createSignal("");
	const [filterFamily, setFilterFamily] = createSignal("");
	const [openDropdown, setOpenDropdown] = createSignal(null);
	const [dropdownPosition, setDropdownPosition] = createSignal(null);
	const filteredFamilies = () => {
		const term = searchTerm().toLowerCase();
		if (!term) return families();
		return families()?.filter((f) => f.familyName.toLowerCase().includes(term) || f.email.toLowerCase().includes(term) || f.parentFirstName.toLowerCase().includes(term) || f.parentLastName.toLowerCase().includes(term));
	};
	const filteredChildren = () => {
		const term = searchTerm().toLowerCase();
		const familyId = filterFamily();
		let filtered = children();
		if (familyId) filtered = filtered?.filter((c) => c.familyId === familyId);
		if (!term) return filtered;
		return filtered?.filter((c) => c.firstName.toLowerCase().includes(term) || c.lastName.toLowerCase().includes(term) || c.family?.familyName.toLowerCase().includes(term) || c.allergies && c.allergies.toLowerCase().includes(term) || c.schoolName && c.schoolName.toLowerCase().includes(term));
	};
	const calculateAge = (dateOfBirth) => {
		const today = /* @__PURE__ */ new Date();
		const birthDate = new Date(dateOfBirth);
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) age--;
		return age;
	};
	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
	};
	createEffect(() => {
		if (openDropdown() !== null) {
			const handleClickOutside = (e) => {
				const target = e.target;
				const container = target.closest("[data-dropdown-container]");
				const isButton = target.closest("button[data-dropdown-button]");
				const isDropdown = target.closest("[data-dropdown-menu]");
				if (!container && !isButton && !isDropdown) {
					setOpenDropdown(null);
					setDropdownPosition(null);
				}
			};
			const timeoutId = setTimeout(() => {
				window.addEventListener("click", handleClickOutside, true);
			}, 10);
			return () => {
				clearTimeout(timeoutId);
				window.removeEventListener("click", handleClickOutside, true);
			};
		} else setDropdownPosition(null);
	});
	return PageContent({ get children() {
		return [
			(_v$ = ssrHydrationKey(), _v$2 = escape(PageHeader({
				get title() {
					return view() === "families" ? "Manage Families" : "All Children";
				},
				get actions() {
					var _v$12;
					return Show({
						get when() {
							return view() === "families";
						},
						get fallback() {
							var _v$13 = ssrHydrationKey();
							return ssr(_tmpl$7, _v$13);
						},
						get children() {
							return _v$12 = ssrHydrationKey(), ssr(_tmpl$6, _v$12);
						}
					});
				}
			})), ssr(_tmpl$, _v$, _v$2)),
			(_v$3 = ssrHydrationKey(), _g$ = ssrGroup(() => {
				return [ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", view() === "families" ? "#4299e1" : "transparent") + ssrStyleProperty(";color:", view() === "families" ? "white" : "var(--color-text)") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-weight:", view() === "families" ? "600" : "400"), ssrStyleProperty("padding:", "0.5rem 1rem") + ssrStyleProperty(";background-color:", view() === "children" ? "#4299e1" : "transparent") + ssrStyleProperty(";color:", view() === "children" ? "white" : "var(--color-text)") + ssrStyleProperty(";border:", "none") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-weight:", view() === "children" ? "600" : "400")];
			}, 2), ssr(_tmpl$2, _v$3, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "0.375rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";width:", "fit-content"), _g$, _g$)),
			(_v$6 = ssrHydrationKey(), _v$7 = scope((() => {
				var _c$ = memo(() => {
					return view() === "families";
				});
				return () => {
					var _v$14, _v$15, _v$16, _v$19, _v$17, _v$18;
					return _c$() ? (_v$14 = ssrHydrationKey(), _v$15 = () => {
						return ssrAttribute("value", escape(searchTerm(), true));
					}, ssr(_tmpl$8, _v$14, _v$15, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.5rem 0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "0.875rem"))) : (_v$16 = ssrHydrationKey(), _v$19 = escape(For({
						get each() {
							return families();
						},
						children: (family) => {
							var _v$20, _v$22, _v$21;
							return _v$20 = ssrHydrationKey(), _v$22 = () => {
								return escape(family.familyName);
							}, _v$21 = () => {
								return ssrAttribute("value", escape(family.id, true));
							}, ssr(_tmpl$10, _v$20, _v$21, _v$22);
						}
					})), _v$17 = () => {
						return ssrAttribute("value", escape(searchTerm(), true));
					}, _v$18 = () => {
						return ssrAttribute("value", escape(filterFamily(), true));
					}, ssr(_tmpl$9, _v$16, ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "2fr 1fr") + ssrStyleProperty(";gap:", "1rem"), _v$17, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), _v$18, ssrStyleProperty("width:", "100%") + ssrStyleProperty(";padding:", "0.75rem") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";font-size:", "1rem"), _v$19));
				};
			})()), ssr(_tmpl$3, _v$6, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";padding:", "1rem") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";margin-bottom:", "1rem"), _v$7)),
			Show({
				get when() {
					return view() === "families";
				},
				get children() {
					return Show({
						get when() {
							return memo(() => {
								return !families.loading;
							})() && families();
						},
						get fallback() {
							var _v$23 = ssrHydrationKey();
							return ssr(_tmpl$11, _v$23, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "2rem"));
						},
						get children() {
							return Show({
								get when() {
									return filteredFamilies()?.length;
								},
								get fallback() {
									var _v$24 = ssrHydrationKey();
									return ssr(_tmpl$12, _v$24, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "2rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "8px"), ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem"));
								},
								get children() {
									return _v$8 = ssrHydrationKey(), _v$9 = escape(For({
										get each() {
											return filteredFamilies();
										},
										children: (family, index) => {
											var _v$31, _v$32, _v$33, _v$25, _v$26, _v$27, _v$28, _v$29, _v$30, _v$34, _v$35, _v$36;
											return _v$25 = ssrHydrationKey(), _v$26 = () => {
												return ssrStyleProperty("borderBottom:", "1px solid var(--color-border)") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";transition:", "background-color 0.2s") + ssrStyleProperty(";background-color:", index() % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-muted)");
											}, _v$27 = () => {
												return escape(family.familyName);
											}, _v$28 = scope(() => {
												return escape(formatParentNames(family.parentFirstName, family.parentLastName, family.familyMembers));
											}), _v$29 = escape(For({
												get each() {
													return family.children;
												},
												children: (child) => {
													var _v$37, _v$38, _v$39, _v$40, _v$41;
													return _v$37 = ssrHydrationKey(), _v$38 = () => {
														return `/families/${escape(family.id, true)}/children/${escape(child.id, true)}`;
													}, _v$39 = () => {
														return escape(child.firstName);
													}, _v$40 = () => {
														return escape(child.lastName);
													}, _v$41 = scope((() => {
														var _c$3 = memo(() => {
															return !!child.allergies;
														});
														return () => {
															var _v$42, _g$2;
															return _c$3() ? (_v$42 = ssrHydrationKey(), _g$2 = ssrGroup(() => {
																return [ssrAttribute("aria-label", escape(allergyLabel(child.allergies), true)), ssrAttribute("title", escape(allergyLabel(child.allergies), true))];
															}, 2), ssr(_tmpl$16, _v$42, _g$2, _g$2)) : escape(child.allergies);
														};
													})()), ssr(_tmpl$15, _v$37, _v$38, ssrStyleProperty("color:", "#4299e1") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.8125rem"), _v$39, _v$40, _v$41);
												}
											})), _v$30 = scope((() => {
												var _c$2 = memo(() => {
													return !!(!family.children || family.children.length === 0);
												});
												return () => {
													var _v$45;
													return _c$2() ? (_v$45 = ssrHydrationKey(), ssr(_tmpl$17, _v$45, ssrStyleProperty("color:", "var(--color-text-subtle)") + ssrStyleProperty(";font-size:", "0.8125rem"))) : escape(!family.children || family.children.length === 0);
												};
											})()), _v$34 = escape(Show({
												get when() {
													return family.amountOwed !== void 0;
												},
												get fallback() {
													var _v$46 = ssrHydrationKey();
													return ssr(_tmpl$18, _v$46, ssrStyleProperty("color:", "var(--color-text-subtle)"));
												},
												get children() {
													return [(_v$31 = ssrHydrationKey(), _v$32 = () => {
														return ssrStyleProperty("font-weight:", "700") + ssrStyleProperty(";color:", Number(moneyDisplay(family.amountOwed)) > 0 ? "#c53030" : "#276749");
													}, _v$33 = scope(() => {
														return escape(formatMoneyDisplay(family.amountOwed));
													}), ssr(_tmpl$13, _v$31, _v$32, _v$33)), memo(() => {
														var _v$47, _v$48;
														return escape(memo(() => {
															return family.unpaidSessionCount > 0;
														})() && (_v$47 = ssrHydrationKey(), _v$48 = () => {
															return escape(family.unpaidSessionCount);
														}, ssr(_tmpl$19, _v$47, ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";margin-top:", "0.125rem"), _v$48)));
													})];
												}
											})), _v$35 = scope(() => {
												return escape(formatDate(family.createdAt));
											}), _v$36 = escape(Show({
												get when() {
													return memo(() => {
														return openDropdown() === family.id;
													})() && dropdownPosition();
												},
												children: (pos) => {
													var _v$49, _g$3, _v$52;
													return _v$49 = ssrHydrationKey(), _g$3 = ssrGroup(() => {
														return [ssrStyleProperty("position:", "fixed") + ssrStyleProperty(";top:", `${escape(pos().top, true)}px`) + ssrStyleProperty(";right:", `${escape(pos().right, true)}px`) + ssrStyleProperty(";background-color:", "var(--color-surface)") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";box-shadow:", "0 4px 6px rgba(0, 0, 0, 0.1)") + ssrStyleProperty(";z-index:", 1e3) + ssrStyleProperty(";min-width:", "120px"), `/families/${escape(family.id, true)}`];
													}, 2), _v$52 = () => {
														return `/families/${escape(family.id, true)}/edit`;
													}, ssr(_tmpl$20, _v$49, _g$3, _g$3, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";padding:", "0.5rem 0.75rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";transition:", "background-color 0.2s"), _v$52, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";padding:", "0.5rem 0.75rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";transition:", "background-color 0.2s"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";justify-content:", "flex-start"));
												}
											})), ssr(_tmpl$14, _v$25, _v$26, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$27, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$28, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";flex-wrap:", "wrap") + ssrStyleProperty(";gap:", "0.25rem"), _v$29, _v$30, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";font-size:", "0.875rem"), _v$34, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$35, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "center"), ssrStyleProperty("position:", "relative") + ssrStyleProperty(";display:", "inline-block"), ssrStyleProperty("padding:", "0.25rem 0.5rem") + ssrStyleProperty(";background-color:", "var(--color-hover)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.25rem"), ssrStyleProperty("font-size:", "0.625rem"), _v$36);
										}
									})), ssr(_tmpl$4, _v$8, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";overflow:", "hidden"), ssrStyleProperty("overflow:", "auto"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";border-collapse:", "collapse"), ssrStyleProperty("background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";borderBottom:", "2px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "right") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$9);
								}
							});
						}
					});
				}
			}),
			Show({
				get when() {
					return view() === "children";
				},
				get children() {
					return Show({
						get when() {
							return memo(() => {
								return !children.loading;
							})() && children();
						},
						get fallback() {
							var _v$53 = ssrHydrationKey();
							return ssr(_tmpl$21, _v$53, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "2rem"));
						},
						get children() {
							return Show({
								get when() {
									return filteredChildren()?.length;
								},
								get fallback() {
									var _v$54 = ssrHydrationKey();
									return ssr(_tmpl$22, _v$54, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";padding:", "2rem") + ssrStyleProperty(";background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";border-radius:", "8px"), ssrStyleProperty("color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem"));
								},
								get children() {
									return _v$10 = ssrHydrationKey(), _v$11 = escape(For({
										get each() {
											return filteredChildren();
										},
										children: (child, index) => {
											var _v$59, _v$61, _v$63, _v$55, _v$56, _v$57, _v$58, _v$60, _v$62, _v$64, _v$65, _v$66, _v$67, _v$68, _v$69;
											return _v$55 = ssrHydrationKey(), _v$56 = () => {
												return ssrStyleProperty("borderBottom:", "1px solid var(--color-border)") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";transition:", "background-color 0.2s") + ssrStyleProperty(";background-color:", index() % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-muted)");
											}, _v$57 = () => {
												return escape(child.lastName);
											}, _v$58 = () => {
												return escape(child.firstName);
											}, _v$60 = escape(Show({
												get when() {
													return child.allergies;
												},
												get children() {
													return _v$59 = ssrHydrationKey(), ssr(_tmpl$23, _v$59, ssrStyleProperty("color:", "#c53030"));
												}
											})), _v$62 = escape(Show({
												get when() {
													return child.medications;
												},
												get children() {
													return _v$61 = ssrHydrationKey(), ssr(_tmpl$24, _v$61, ssrStyleProperty("color:", "#7c2d12"));
												}
											})), _v$64 = escape(Show({
												get when() {
													return child.specialNeeds;
												},
												get children() {
													return _v$63 = ssrHydrationKey(), ssr(_tmpl$25, _v$63, ssrStyleProperty("color:", "#2c5282"));
												}
											})), _v$65 = scope(() => {
												return escape(calculateAge(child.dateOfBirth));
											}), _v$66 = scope(() => {
												return escape(formatDate(child.dateOfBirth));
											}), _v$67 = () => {
												return escape(child.gender?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) || "-");
											}, _v$68 = scope(() => {
												return escape(formatDate(child.createdAt));
											}), _v$69 = escape(Show({
												get when() {
													return memo(() => {
														return openDropdown() === child.id;
													})() && dropdownPosition();
												},
												children: (pos) => {
													var _v$70, _g$4, _v$73;
													return _v$70 = ssrHydrationKey(), _g$4 = ssrGroup(() => {
														return [ssrStyleProperty("position:", "fixed") + ssrStyleProperty(";top:", `${escape(pos().top, true)}px`) + ssrStyleProperty(";right:", `${escape(pos().right, true)}px`) + ssrStyleProperty(";background-color:", "var(--color-surface)") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";box-shadow:", "0 4px 6px rgba(0, 0, 0, 0.1)") + ssrStyleProperty(";z-index:", 1e3) + ssrStyleProperty(";min-width:", "120px"), `/families/${escape(child.familyId, true)}/children/${escape(child.id, true)}`];
													}, 2), _v$73 = () => {
														return `/families/${escape(child.familyId, true)}/children/${escape(child.id, true)}/edit`;
													}, ssr(_tmpl$20, _v$70, _g$4, _g$4, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";padding:", "0.5rem 0.75rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";transition:", "background-color 0.2s"), _v$73, ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.5rem") + ssrStyleProperty(";padding:", "0.5rem 0.75rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";transition:", "background-color 0.2s"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";justify-content:", "flex-start"));
												}
											})), ssr(_tmpl$26, _v$55, _v$56, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$57, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.25rem"), _v$58, _v$60, _v$62, _v$64, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$65, _v$66, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$67, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";color:", "var(--color-text-muted)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$68, ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "center"), ssrStyleProperty("position:", "relative") + ssrStyleProperty(";display:", "inline-block"), ssrStyleProperty("padding:", "0.25rem 0.5rem") + ssrStyleProperty(";background-color:", "var(--color-hover)") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";border:", "1px solid var(--color-border-strong)") + ssrStyleProperty(";border-radius:", "4px") + ssrStyleProperty(";cursor:", "pointer") + ssrStyleProperty(";font-size:", "0.75rem") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", "0.25rem"), ssrStyleProperty("font-size:", "0.625rem"), _v$69);
										}
									})), ssr(_tmpl$5, _v$10, ssrStyleProperty("background-color:", "var(--color-surface)") + ssrStyleProperty(";border-radius:", "8px") + ssrStyleProperty(";border:", "1px solid var(--color-border)") + ssrStyleProperty(";overflow:", "hidden"), ssrStyleProperty("overflow:", "auto"), ssrStyleProperty("width:", "100%") + ssrStyleProperty(";border-collapse:", "collapse"), ssrStyleProperty("background-color:", "var(--color-surface-muted)") + ssrStyleProperty(";borderBottom:", "2px solid var(--color-border)"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "left") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), ssrStyleProperty("padding:", "0.75rem") + ssrStyleProperty(";text-align:", "center") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";color:", "var(--color-text)") + ssrStyleProperty(";font-size:", "0.875rem"), _v$11);
								}
							});
						}
					});
				}
			})
		];
	} });
}
//#endregion
export { FamiliesPage as default };
