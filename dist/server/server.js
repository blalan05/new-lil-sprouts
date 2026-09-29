import { A as mockBase, C as useOptionalContext, D as comparablePath, E as setupNativeEvents, O as extractSearchParams, _ as resolveLazySubtree, a as query, b as unresolvedLazyMatches, c as RouterContextObj, d as createRouterContext, f as getIntent, g as registerFlightRouter, h as peekLazySubtrees, i as useSubmissions, j as normalizePath, k as mergeSearchString, l as createBranches, m as mergeParams, o as revalidate, p as getRouteMatches, s as RouteContextObj, t as action$1, u as createRouteContext, v as setInPreloadFn, x as useLocation, y as trackLazySubtrees } from "./assets/action-6MWjotYm.js";
import { A as serverRedirect, C as serializeClearRoleCookie, D as roleCookieValue, E as readRoleCookie, M as dbIncludingDeleted, O as hashPassword, S as readSessionData, T as setRoleCookie, _ as validateEmail, a as getCurrentFamilyId, b as destroySessionCookie, c as requireFamilyAccess, d as requireParent, f as requireSessionFamilyAccess, g as register, h as logout$1, i as assertScheduleInFamily, j as db, k as verifyPassword, l as requireFamilyMemberAccess, m as login, n as assertFamilyExists, o as requireCareScheduleAccess, p as requireUser, r as assertFamilyMemberInFamily, s as requireChildAccess, t as assertChildInFamily, u as requireOwner, v as validatePassword, w as serializeRoleCookie, x as getSession, y as validateUsername } from "./assets/auth-CglT72yL.js";
import { a as isPositiveMoney, c as parseMoney, d as subtractMoney, f as sumMoney, i as compareMoney, l as roundMoney, n as calculateHours, o as moneyToString, p as toDecimal, r as calculateSessionCost, s as multiplyMoney, t as addMoney, u as serializeMoneyDeep } from "./assets/money-BEIKlwwK.js";
import { HydrationScript, commitEventResponse, composeMiddleware, createRequestEvent, createSSRResponse, escape, getRequestEvent, isServer, memo, registerElementClaim, reload, renderToStream, scope, ssr, ssrAttribute, ssrClassName, ssrGroup, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { provideRequestEvent } from "@solidjs/web/storage";
import { DEV, Errored, For, Loading, Show, createContext, createEffect, createMemo, createRenderEffect, createRoot, createSignal, getOwner, lazy, onCleanup, onSettled, runWithOwner, sharedConfig, untrack, useContext } from "solid-js";
import { configureServerFunctionsServer, createServerReference, handleServerFunctionRequest, registerServerReference } from "@solidjs/web/server-functions";
import { configureServerFunctionsServer as configureServerFunctionsServer$1 } from "@solidjs/web/server-functions/server";
import { createAPIHandler } from "filesystem-routing/api";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region \0virtual:solid-manifest
var _virtual_solid_manifest_default = {
	"_ConfirmProvider-zFwTcgJm.js": {
		"file": "assets/ConfirmProvider-zFwTcgJm.js",
		"name": "ConfirmProvider",
		"imports": ["_web-CMLhSh0a.js", "_Dialog-DrnXjeXV.js"]
	},
	"_Dialog-DrnXjeXV.js": {
		"file": "assets/Dialog-DrnXjeXV.js",
		"name": "Dialog",
		"imports": ["_web-CMLhSh0a.js"]
	},
	"_PageContent-C-m9Y8ww.js": {
		"file": "assets/PageContent-C-m9Y8ww.js",
		"name": "PageContent",
		"imports": ["_web-CMLhSh0a.js"]
	},
	"_StatusBadge-eNkUiP_k.js": {
		"file": "assets/StatusBadge-eNkUiP_k.js",
		"name": "StatusBadge",
		"imports": ["_web-CMLhSh0a.js", "_display-CG6VlPyO.js"]
	},
	"_action-eWyNAy9N.js": {
		"file": "assets/action-eWyNAy9N.js",
		"name": "action",
		"imports": ["_web-CMLhSh0a.js", "_query-BvfhWW-6.js"],
		"dynamicImports": ["node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/data/serverForms.js", "node_modules/.pnpm/@solidjs+web@2.0.0-rc.0_solid-js@2.0.0-rc.1/node_modules/@solidjs/web/serialization/dist/decode.js"]
	},
	"_care-schedules-DY_OnFI3.js": {
		"file": "assets/care-schedules-DY_OnFI3.js",
		"name": "care-schedules",
		"imports": ["_query-BvfhWW-6.js", "_action-eWyNAy9N.js"]
	},
	"_children-4Ru_GZvV.js": {
		"file": "assets/children-4Ru_GZvV.js",
		"name": "children",
		"imports": ["_query-BvfhWW-6.js", "_action-eWyNAy9N.js"]
	},
	"_datetime-BmoZ_SHX.js": {
		"file": "assets/datetime-BmoZ_SHX.js",
		"name": "datetime"
	},
	"_display-CG6VlPyO.js": {
		"file": "assets/display-CG6VlPyO.js",
		"name": "display"
	},
	"_expenses-B8oH1s2g.js": {
		"file": "assets/expenses-B8oH1s2g.js",
		"name": "expenses",
		"imports": ["_query-BvfhWW-6.js", "_action-eWyNAy9N.js"]
	},
	"_families-CHTVi49i.js": {
		"file": "assets/families-CHTVi49i.js",
		"name": "families",
		"imports": ["_query-BvfhWW-6.js", "_action-eWyNAy9N.js"]
	},
	"_family-members-DkRs0eFI.js": {
		"file": "assets/family-members-DkRs0eFI.js",
		"name": "family-members",
		"imports": ["_query-BvfhWW-6.js", "_action-eWyNAy9N.js"]
	},
	"_lib-uFBzvv0q.js": {
		"file": "assets/lib-uFBzvv0q.js",
		"name": "lib",
		"imports": ["_query-BvfhWW-6.js", "_action-eWyNAy9N.js"]
	},
	"_money-display-BdSv_jQN.js": {
		"file": "assets/money-display-BdSv_jQN.js",
		"name": "money-display"
	},
	"_payments-i7ZRkNmf.js": {
		"file": "assets/payments-i7ZRkNmf.js",
		"name": "payments",
		"imports": ["_query-BvfhWW-6.js", "_action-eWyNAy9N.js"]
	},
	"_portal-DHKXolF_.js": {
		"file": "assets/portal-DHKXolF_.js",
		"name": "portal",
		"imports": ["_query-BvfhWW-6.js", "_action-eWyNAy9N.js"]
	},
	"_query-BvfhWW-6.js": {
		"file": "assets/query-BvfhWW-6.js",
		"name": "query",
		"imports": ["_web-CMLhSh0a.js"],
		"dynamicImports": ["node_modules/.pnpm/@solidjs+web@2.0.0-rc.0_solid-js@2.0.0-rc.1/node_modules/@solidjs/web/serialization/dist/decode.js"]
	},
	"_reports-Dd8FUBOO.js": {
		"file": "assets/reports-Dd8FUBOO.js",
		"name": "reports",
		"imports": ["_query-BvfhWW-6.js"]
	},
	"_schedule-Dhyei76O.js": {
		"file": "assets/schedule-Dhyei76O.js",
		"name": "schedule",
		"imports": ["_query-BvfhWW-6.js", "_action-eWyNAy9N.js"]
	},
	"_services-BSnCMKXf.js": {
		"file": "assets/services-BSnCMKXf.js",
		"name": "services",
		"imports": ["_query-BvfhWW-6.js", "_action-eWyNAy9N.js"]
	},
	"_session-reports-Bxhk6SX5.js": {
		"file": "assets/session-reports-Bxhk6SX5.js",
		"name": "session-reports",
		"imports": ["_query-BvfhWW-6.js", "_action-eWyNAy9N.js"]
	},
	"_settings-paraeZBC.js": {
		"file": "assets/settings-paraeZBC.js",
		"name": "settings",
		"imports": ["_query-BvfhWW-6.js", "_action-eWyNAy9N.js"]
	},
	"_stats-CmPZ3Nvx.js": {
		"file": "assets/stats-CmPZ3Nvx.js",
		"name": "stats",
		"imports": ["_query-BvfhWW-6.js"]
	},
	"_unavailability-CHyq6y8Y.js": {
		"file": "assets/unavailability-CHyq6y8Y.js",
		"name": "unavailability",
		"imports": ["_query-BvfhWW-6.js", "_action-eWyNAy9N.js"]
	},
	"_use-submission-RPgA_r8c.js": {
		"file": "assets/use-submission-RPgA_r8c.js",
		"name": "use-submission",
		"imports": ["_web-CMLhSh0a.js", "_action-eWyNAy9N.js"]
	},
	"_web-CMLhSh0a.js": {
		"file": "assets/web-CMLhSh0a.js",
		"name": "web"
	},
	"node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/data/serverForms.js": {
		"file": "assets/serverForms-D524XtaS.js",
		"name": "serverForms",
		"src": "node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/data/serverForms.js",
		"isDynamicEntry": true,
		"imports": ["_action-eWyNAy9N.js"]
	},
	"node_modules/.pnpm/@solidjs+web@2.0.0-rc.0_solid-js@2.0.0-rc.1/node_modules/@solidjs/web/serialization/dist/decode.js": {
		"file": "assets/decode-3X5v8ClT.js",
		"name": "decode",
		"src": "node_modules/.pnpm/@solidjs+web@2.0.0-rc.0_solid-js@2.0.0-rc.1/node_modules/@solidjs/web/serialization/dist/decode.js",
		"isDynamicEntry": true
	},
	"node_modules/.pnpm/workbox-window@7.4.1/node_modules/workbox-window/build/workbox-window.prod.es5.mjs": {
		"file": "assets/workbox-window.prod.es5-Bd17z0YL.js",
		"name": "workbox-window.prod.es5",
		"src": "node_modules/.pnpm/workbox-window@7.4.1/node_modules/workbox-window/build/workbox-window.prod.es5.mjs",
		"isDynamicEntry": true
	},
	"src/entry-client.tsx": {
		"file": "assets/entry-client-FnGrxwiN.js",
		"name": "entry-client",
		"src": "src/entry-client.tsx",
		"isEntry": true,
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_action-eWyNAy9N.js",
			"_use-submission-RPgA_r8c.js",
			"_lib-uFBzvv0q.js",
			"_ConfirmProvider-zFwTcgJm.js",
			"_settings-paraeZBC.js",
			"_schedule-Dhyei76O.js",
			"_session-reports-Bxhk6SX5.js",
			"_families-CHTVi49i.js",
			"_stats-CmPZ3Nvx.js",
			"_expenses-B8oH1s2g.js",
			"_children-4Ru_GZvV.js",
			"_payments-i7ZRkNmf.js",
			"_portal-DHKXolF_.js",
			"_services-BSnCMKXf.js",
			"_reports-Dd8FUBOO.js",
			"_family-members-DkRs0eFI.js",
			"_care-schedules-DY_OnFI3.js",
			"_unavailability-CHyq6y8Y.js"
		],
		"dynamicImports": [
			"node_modules/.pnpm/workbox-window@7.4.1/node_modules/workbox-window/build/workbox-window.prod.es5.mjs",
			"src/routes/account.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/login.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/[...404].tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/children/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/expenses/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/families/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/families/new.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/payments/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/portal/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/portal/today.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/reports/calendar.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/reports/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/reports/tax-summary.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/reports/year-end.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/schedule/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/services/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/unavailability/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/unavailability/new.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/children/[id]/edit.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/children/[id]/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/families/[id]/edit.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/families/[id]/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/unavailability/[id]/edit.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/families/[id]/children/new.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/families/[id]/members/new.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/families/[id]/schedules/new.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/families/[id]/children/[childId]/edit.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/families/[id]/children/[childId]/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/families/[id]/members/[memberId]/edit.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/families/[id]/sessions/[sessionId]/edit.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/families/[id]/sessions/[sessionId]/index.tsx?pick=default&pick=$css&lang.tsx",
			"src/routes/families/[id]/sessions/[sessionId]/reports/new.tsx?pick=default&pick=$css&lang.tsx"
		],
		"css": ["assets/entry-client-Dwp0WZM4.css"]
	},
	"src/lib/schedule.ts": {
		"file": "assets/schedule-CfrHci8Q.js",
		"name": "schedule",
		"src": "src/lib/schedule.ts",
		"imports": ["_schedule-Dhyei76O.js"]
	},
	"src/routes/[...404].tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/_...404_-BW8Ye71p.js",
		"name": "_...404_",
		"src": "src/routes/[...404].tsx?pick=default&pick=$css&lang.tsx",
		"imports": ["_web-CMLhSh0a.js", "_PageContent-C-m9Y8ww.js"]
	},
	"src/routes/account.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/account-DGb5CX1q.js",
		"name": "account",
		"src": "src/routes/account.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_use-submission-RPgA_r8c.js",
			"_lib-uFBzvv0q.js",
			"_settings-paraeZBC.js",
			"_PageContent-C-m9Y8ww.js"
		]
	},
	"src/routes/children/[id]/edit.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/edit-KQpjWcgW.js",
		"name": "edit",
		"src": "src/routes/children/[id]/edit.tsx?pick=default&pick=$css&lang.tsx"
	},
	"src/routes/children/[id]/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-KQpjWcgW.js",
		"name": "index",
		"src": "src/routes/children/[id]/index.tsx?pick=default&pick=$css&lang.tsx"
	},
	"src/routes/children/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-BLGiGTkn.js",
		"name": "index",
		"src": "src/routes/children/index.tsx?pick=default&pick=$css&lang.tsx"
	},
	"src/routes/expenses/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-Dz4dksaK.js",
		"name": "index",
		"src": "src/routes/expenses/index.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_use-submission-RPgA_r8c.js",
			"_ConfirmProvider-zFwTcgJm.js",
			"_families-CHTVi49i.js",
			"_expenses-B8oH1s2g.js",
			"_PageContent-C-m9Y8ww.js",
			"_datetime-BmoZ_SHX.js"
		]
	},
	"src/routes/families/[id]/children/[childId]/edit.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/edit-CE2Zwrqr.js",
		"name": "edit",
		"src": "src/routes/families/[id]/children/[childId]/edit.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_use-submission-RPgA_r8c.js",
			"_children-4Ru_GZvV.js",
			"_PageContent-C-m9Y8ww.js"
		]
	},
	"src/routes/families/[id]/children/[childId]/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-n4L2ebQJ.js",
		"name": "index",
		"src": "src/routes/families/[id]/children/[childId]/index.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_children-4Ru_GZvV.js",
			"_PageContent-C-m9Y8ww.js",
			"_StatusBadge-eNkUiP_k.js"
		]
	},
	"src/routes/families/[id]/children/new.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/new-CoEIqG5T.js",
		"name": "new",
		"src": "src/routes/families/[id]/children/new.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_use-submission-RPgA_r8c.js",
			"_children-4Ru_GZvV.js",
			"_PageContent-C-m9Y8ww.js"
		]
	},
	"src/routes/families/[id]/edit.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/edit-D6gqVMev.js",
		"name": "edit",
		"src": "src/routes/families/[id]/edit.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_use-submission-RPgA_r8c.js",
			"_families-CHTVi49i.js",
			"_services-BSnCMKXf.js",
			"_PageContent-C-m9Y8ww.js"
		]
	},
	"src/routes/families/[id]/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-wJ88ZxcR.js",
		"name": "index",
		"src": "src/routes/families/[id]/index.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_use-submission-RPgA_r8c.js",
			"_lib-uFBzvv0q.js",
			"_Dialog-DrnXjeXV.js",
			"_ConfirmProvider-zFwTcgJm.js",
			"_families-CHTVi49i.js",
			"_children-4Ru_GZvV.js",
			"_services-BSnCMKXf.js",
			"_family-members-DkRs0eFI.js",
			"_care-schedules-DY_OnFI3.js",
			"_PageContent-C-m9Y8ww.js",
			"_datetime-BmoZ_SHX.js",
			"_display-CG6VlPyO.js",
			"_StatusBadge-eNkUiP_k.js",
			"_money-display-BdSv_jQN.js"
		],
		"dynamicImports": ["src/lib/schedule.ts"]
	},
	"src/routes/families/[id]/members/[memberId]/edit.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/edit-DTB7y6UL.js",
		"name": "edit",
		"src": "src/routes/families/[id]/members/[memberId]/edit.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_use-submission-RPgA_r8c.js",
			"_family-members-DkRs0eFI.js",
			"_PageContent-C-m9Y8ww.js"
		]
	},
	"src/routes/families/[id]/members/new.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/new-StP_ABG2.js",
		"name": "new",
		"src": "src/routes/families/[id]/members/new.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_use-submission-RPgA_r8c.js",
			"_family-members-DkRs0eFI.js",
			"_PageContent-C-m9Y8ww.js"
		]
	},
	"src/routes/families/[id]/schedules/new.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/new-6qXHcO2I.js",
		"name": "new",
		"src": "src/routes/families/[id]/schedules/new.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_use-submission-RPgA_r8c.js",
			"_families-CHTVi49i.js",
			"_services-BSnCMKXf.js",
			"_care-schedules-DY_OnFI3.js",
			"_PageContent-C-m9Y8ww.js"
		]
	},
	"src/routes/families/[id]/sessions/[sessionId]/edit.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/edit-Bf7Zdz52.js",
		"name": "edit",
		"src": "src/routes/families/[id]/sessions/[sessionId]/edit.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_use-submission-RPgA_r8c.js",
			"_schedule-Dhyei76O.js",
			"_children-4Ru_GZvV.js",
			"_PageContent-C-m9Y8ww.js",
			"_datetime-BmoZ_SHX.js"
		]
	},
	"src/routes/families/[id]/sessions/[sessionId]/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-CEsYG6Qx.js",
		"name": "index",
		"src": "src/routes/families/[id]/sessions/[sessionId]/index.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_use-submission-RPgA_r8c.js",
			"_ConfirmProvider-zFwTcgJm.js",
			"_schedule-Dhyei76O.js",
			"_session-reports-Bxhk6SX5.js",
			"_expenses-B8oH1s2g.js",
			"_family-members-DkRs0eFI.js",
			"_care-schedules-DY_OnFI3.js",
			"_PageContent-C-m9Y8ww.js",
			"_datetime-BmoZ_SHX.js",
			"_StatusBadge-eNkUiP_k.js",
			"_money-display-BdSv_jQN.js"
		],
		"dynamicImports": ["src/lib/schedule.ts"]
	},
	"src/routes/families/[id]/sessions/[sessionId]/reports/new.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/new-BsYW-lhk.js",
		"name": "new",
		"src": "src/routes/families/[id]/sessions/[sessionId]/reports/new.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_use-submission-RPgA_r8c.js",
			"_session-reports-Bxhk6SX5.js",
			"_families-CHTVi49i.js",
			"_PageContent-C-m9Y8ww.js"
		]
	},
	"src/routes/families/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-CYjqSrBd.js",
		"name": "index",
		"src": "src/routes/families/index.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_ConfirmProvider-zFwTcgJm.js",
			"_families-CHTVi49i.js",
			"_children-4Ru_GZvV.js",
			"_PageContent-C-m9Y8ww.js",
			"_display-CG6VlPyO.js",
			"_money-display-BdSv_jQN.js"
		]
	},
	"src/routes/families/new.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/new-DlLyIfb3.js",
		"name": "new",
		"src": "src/routes/families/new.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_use-submission-RPgA_r8c.js",
			"_families-CHTVi49i.js",
			"_services-BSnCMKXf.js",
			"_PageContent-C-m9Y8ww.js"
		]
	},
	"src/routes/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-DlaH55kM.js",
		"name": "index",
		"src": "src/routes/index.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_use-submission-RPgA_r8c.js",
			"_lib-uFBzvv0q.js",
			"_Dialog-DrnXjeXV.js",
			"_schedule-Dhyei76O.js",
			"_session-reports-Bxhk6SX5.js",
			"_families-CHTVi49i.js",
			"_stats-CmPZ3Nvx.js",
			"_services-BSnCMKXf.js",
			"_care-schedules-DY_OnFI3.js",
			"_PageContent-C-m9Y8ww.js",
			"_datetime-BmoZ_SHX.js",
			"_StatusBadge-eNkUiP_k.js",
			"_money-display-BdSv_jQN.js"
		]
	},
	"src/routes/login.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/login-DdCRHEy2.js",
		"name": "login",
		"src": "src/routes/login.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_use-submission-RPgA_r8c.js",
			"_lib-uFBzvv0q.js"
		]
	},
	"src/routes/payments/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-DE4aiRHb.js",
		"name": "index",
		"src": "src/routes/payments/index.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_use-submission-RPgA_r8c.js",
			"_Dialog-DrnXjeXV.js",
			"_families-CHTVi49i.js",
			"_payments-i7ZRkNmf.js",
			"_PageContent-C-m9Y8ww.js",
			"_datetime-BmoZ_SHX.js",
			"_StatusBadge-eNkUiP_k.js",
			"_money-display-BdSv_jQN.js"
		]
	},
	"src/routes/portal/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-BBpCpnnZ.js",
		"name": "index",
		"src": "src/routes/portal/index.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_action-eWyNAy9N.js",
			"_lib-uFBzvv0q.js",
			"_portal-DHKXolF_.js",
			"_datetime-BmoZ_SHX.js"
		]
	},
	"src/routes/portal/today.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/today-Bu_0AaNm.js",
		"name": "today",
		"src": "src/routes/portal/today.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_lib-uFBzvv0q.js",
			"_portal-DHKXolF_.js",
			"_datetime-BmoZ_SHX.js",
			"_money-display-BdSv_jQN.js"
		]
	},
	"src/routes/reports/calendar.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/calendar-Y55kSCmP.js",
		"name": "calendar",
		"src": "src/routes/reports/calendar.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_schedule-Dhyei76O.js",
			"_PageContent-C-m9Y8ww.js",
			"_datetime-BmoZ_SHX.js"
		]
	},
	"src/routes/reports/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-CTzrk5vY.js",
		"name": "index",
		"src": "src/routes/reports/index.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_use-submission-RPgA_r8c.js",
			"_services-BSnCMKXf.js",
			"_PageContent-C-m9Y8ww.js",
			"_money-display-BdSv_jQN.js"
		]
	},
	"src/routes/reports/tax-summary.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/tax-summary-C01ZZuBV.js",
		"name": "tax-summary",
		"src": "src/routes/reports/tax-summary.tsx?pick=default&pick=$css&lang.tsx",
		"imports": ["_web-CMLhSh0a.js", "_reports-Dd8FUBOO.js"]
	},
	"src/routes/reports/year-end.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/year-end-BlUxZsr9.js",
		"name": "year-end",
		"src": "src/routes/reports/year-end.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_families-CHTVi49i.js",
			"_reports-Dd8FUBOO.js",
			"_PageContent-C-m9Y8ww.js",
			"_datetime-BmoZ_SHX.js",
			"_money-display-BdSv_jQN.js"
		]
	},
	"src/routes/schedule/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-B5_Qw3oS.js",
		"name": "index",
		"src": "src/routes/schedule/index.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_use-submission-RPgA_r8c.js",
			"_Dialog-DrnXjeXV.js",
			"_ConfirmProvider-zFwTcgJm.js",
			"_schedule-Dhyei76O.js",
			"_families-CHTVi49i.js",
			"_services-BSnCMKXf.js",
			"_care-schedules-DY_OnFI3.js",
			"_unavailability-CHyq6y8Y.js",
			"_PageContent-C-m9Y8ww.js",
			"_datetime-BmoZ_SHX.js",
			"_StatusBadge-eNkUiP_k.js"
		]
	},
	"src/routes/services/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-CZ3MHgbK.js",
		"name": "index",
		"src": "src/routes/services/index.tsx?pick=default&pick=$css&lang.tsx"
	},
	"src/routes/unavailability/[id]/edit.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/edit-DuNWq1AV.js",
		"name": "edit",
		"src": "src/routes/unavailability/[id]/edit.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_query-BvfhWW-6.js",
			"_use-submission-RPgA_r8c.js",
			"_unavailability-CHyq6y8Y.js",
			"_PageContent-C-m9Y8ww.js"
		]
	},
	"src/routes/unavailability/index.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/index-D7iQ9j9D.js",
		"name": "index",
		"src": "src/routes/unavailability/index.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_ConfirmProvider-zFwTcgJm.js",
			"_unavailability-CHyq6y8Y.js",
			"_PageContent-C-m9Y8ww.js"
		]
	},
	"src/routes/unavailability/new.tsx?pick=default&pick=$css&lang.tsx": {
		"file": "assets/new-FJWn5ebn.js",
		"name": "new",
		"src": "src/routes/unavailability/new.tsx?pick=default&pick=$css&lang.tsx",
		"imports": [
			"_web-CMLhSh0a.js",
			"_use-submission-RPgA_r8c.js",
			"_unavailability-CHyq6y8Y.js",
			"_PageContent-C-m9Y8ww.js"
		]
	},
	"_base": "/"
};
//#endregion
//#region src/lib/theme.ts
var STORAGE_KEY$1 = "lilsprouts-theme";
function getStoredTheme() {
	if (typeof localStorage === "undefined") return "system";
	const stored = localStorage.getItem(STORAGE_KEY$1);
	if (stored === "light" || stored === "dark" || stored === "system") return stored;
	return "system";
}
function resolveTheme(theme) {
	if (theme === "light" || theme === "dark") return theme;
	if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
	return "light";
}
function applyTheme(theme) {
	if (typeof document === "undefined") return;
	const resolved = resolveTheme(theme);
	const root = document.documentElement;
	root.setAttribute("data-theme", resolved);
	root.classList.toggle("wa-dark", resolved === "dark");
	root.classList.toggle("wa-light", resolved === "light");
}
function initTheme() {
	applyTheme(getStoredTheme());
}
/** Inline script to prevent flash of wrong theme — inject in document head */
var themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY$1}")||"system";var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.setAttribute("data-theme",d?"dark":"light");r.classList.toggle("wa-dark",d);r.classList.toggle("wa-light",!d);}catch(e){}})();`;
//#endregion
//#region src/Document.tsx
var _tmpl$$5 = [
	"<html",
	" lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><meta name=\"theme-color\" content=\"var(--color-text)\"><meta name=\"description\" content=\"Childcare management system for families and caregivers\"><meta name=\"mobile-web-app-capable\" content=\"yes\"><meta name=\"apple-mobile-web-app-capable\" content=\"yes\"><meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\"><meta name=\"apple-mobile-web-app-title\" content=\"Lil Sprouts\"><link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/icons/icon-96x96.png\"><link rel=\"icon\" type=\"image/png\" sizes=\"192x192\" href=\"/icons/icon-192x192.png\"><link rel=\"icon\" type=\"image/png\" sizes=\"512x512\" href=\"/icons/icon-512x512.png\"><link rel=\"apple-touch-icon\" href=\"/icons/icon-192x192.png\"><link rel=\"shortcut icon\" href=\"/favicon.ico\"><link rel=\"icon\" href=\"/favicon.ico\"><link rel=\"manifest\" href=\"/manifest.json\"><script type=\"module\" async src=\"/src/entry-client.tsx\"><\/script></head><body>",
	"</body></html>"
];
var themeBootScript = ssr(`<script>${themeInitScript}<\/script>`);
function Document(props) {
	var _v$ = ssrHydrationKey(), _v$2 = escape(themeBootScript), _v$3 = escape(HydrationScript({})), _v$4 = scope(() => {
		return escape(props.children);
	});
	return ssr(_tmpl$$5, _v$, _v$2, _v$3, _v$4);
}
//#endregion
//#region node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/claims.js
/**
* The compiler claims every `a[href]` (and `form[action]`, which this handler
* ignores) at creation, and the runtime re-claims on `href` writes. This
* consumer gives each router-managed anchor the link-state vocabulary without
* a wrapper component:
*
* - `aria-current="page"` — the location matches the link exactly
* - `data-active` — exact or prefix match
* - `data-pending` — the link is the target of an in-flight navigation
*
* Elements are claimed at creation, so late mounts (`<Show>`, `<For>`,
* portals) are correct immediately. One render effect (owned by the router)
* subscribes to the location and sweeps a registry of claimed anchors —
* anchors themselves carry no reactive machinery, just a registry entry
* removed by their creating owner's cleanup. State is applied once at claim
* so it is correct before the next navigation; re-claims (an `href` write)
* are the same one-shot untracked refresh, reading the element's current
* `href` from the DOM.
*/
function setupLinkClaims(router, explicitLinks) {
	const basePath = router.base.path();
	const claimed = /* @__PURE__ */ new WeakMap();
	const registry = /* @__PURE__ */ new Set();
	function isSvg(el) {
		return el.namespaceURI === "http://www.w3.org/2000/svg";
	}
	/** The comparable pathname when the router manages this anchor, else `undefined`. */
	function managedPath(a) {
		if (explicitLinks && !a.hasAttribute("link")) return;
		const svg = isSvg(a);
		const href = svg ? a.href.baseVal : a.getAttribute("href");
		if ((svg ? a.target.baseVal : a.target) || !href) return;
		const rel = (a.getAttribute("rel") || "").split(/\s+/);
		if (a.hasAttribute("download") || rel.includes("external")) return;
		let url;
		try {
			url = new URL(href, document.baseURI);
		} catch {
			return;
		}
		if (url.origin !== window.location.origin || basePath && url.pathname && !url.pathname.toLowerCase().startsWith(basePath.toLowerCase())) return;
		return comparablePath(url.pathname);
	}
	function linkState(a) {
		const loc = decodeURI(comparablePath(router.location.pathname));
		const routing = router.isRouting();
		const path = managedPath(a);
		const matches = (target) => path !== void 0 && (target === path || path !== "" && target.startsWith(path + "/"));
		const pending = routing && !!router.pendingTarget && matches(decodeURI(comparablePath(router.pendingTarget.value)));
		return {
			active: matches(loc),
			pending,
			exact: path !== void 0 && loc === path
		};
	}
	function apply(a, rec, { active, pending, exact }) {
		active ? a.setAttribute("data-active", "") : a.removeAttribute("data-active");
		pending ? a.setAttribute("data-pending", "") : a.removeAttribute("data-pending");
		if (exact !== rec.current) {
			exact ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
			rec.current = exact;
		}
	}
	const refresh = (a, rec) => untrack(() => apply(a, rec, linkState(a)));
	createRenderEffect(() => (router.location.pathname, router.isRouting()), () => registry.forEach((a) => refresh(a, claimed.get(a))), { transparent: true });
	onCleanup(registerElementClaim((node) => {
		if (node.nodeName.toUpperCase() !== "A") return;
		const a = node;
		const existing = claimed.get(a);
		if (existing) return refresh(a, existing);
		const rec = { current: false };
		claimed.set(a, rec);
		if (getOwner()) {
			registry.add(a);
			onCleanup(() => registry.delete(a));
		}
		refresh(a, rec);
	}));
}
//#endregion
//#region node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/paths.js
var encodeParam = (value) => String(value).split("/").map(encodeURIComponent).join("/");
/**
* Creates the runtime path proxy. It is instance-scoped: `renderPath` comes
* from the router's history adapter (eg. hash routing prefixes `#`), and
* `base` is baked into every produced path.
*/
function createPathsProxy(renderPath = (p) => p, base = "") {
	const toHref = (pathname, suffix = "") => renderPath(pathname || "/") + suffix;
	function node(pathname) {
		const build = (...args) => {
			let path = pathname;
			for (let i = 0; i < args.length; i++) {
				const arg = args[i];
				if (typeof arg === "object" && arg !== null) {
					const hash = typeof args[i + 1] === "string" ? `#${args[i + 1]}` : "";
					return toHref(path, mergeSearchString("", arg) + hash);
				}
				path += `/${encodeParam(arg)}`;
			}
			return args.length ? node(path) : toHref(path);
		};
		return new Proxy(build, { get(_, prop) {
			if (prop === "toString") return () => toHref(pathname);
			if (typeof prop === "symbol") return prop === Symbol.toPrimitive ? () => toHref(pathname) : void 0;
			return node(`${pathname}/${prop}`);
		} });
	}
	return node(normalizePath(base));
}
//#endregion
//#region node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/routers/components.jsx
function Root(props) {
	const location = props.routerState.location;
	const params = props.routerState.params;
	const data = createMemo(() => props.preload && untrack(() => {
		setInPreloadFn(true);
		try {
			return props.preload({
				params,
				location,
				intent: getIntent() || "initial"
			});
		} finally {
			setInPreloadFn(false);
		}
	}));
	const RootComp = props.root;
	if (RootComp) return RootComp({
		params,
		location,
		get data() {
			return data();
		},
		get children() {
			return props.children;
		}
	});
	return props.children;
}
function Routes(props) {
	if (isServer) {
		const e = getRequestEvent();
		if (e && e.router && e.router.dataOnly) {
			dataOnly(e, props.routerState, props.branches());
			return;
		}
		if (e && !(e.router && e.router.matches)) Object.defineProperty(e.router || (e.router = {}), "matches", {
			configurable: true,
			enumerable: true,
			get: () => props.routerState.matches().map(({ route, path, params }) => ({
				path: route.originalPath,
				pattern: route.pattern,
				match: path,
				params,
				info: route.info
			}))
		});
	}
	const disposers = [];
	let root;
	let prevMatches;
	onCleanup(() => disposers.forEach((dispose) => dispose()));
	const owner = getOwner();
	const routeStates = createMemo((prev) => {
		const nextMatches = props.routerState.matches();
		const previousMatches = prevMatches;
		let equal = previousMatches && nextMatches.length === previousMatches.length;
		const next = [];
		for (let i = 0, len = nextMatches.length; i < len; i++) {
			const prevMatch = previousMatches && previousMatches[i];
			const nextMatch = nextMatches[i];
			if (prev && prevMatch && nextMatch.route.key === prevMatch.route.key) next[i] = prev[i];
			else {
				equal = false;
				if (disposers[i]) disposers[i]();
				runWithOwner(owner, () => createRoot((dispose) => {
					disposers[i] = dispose;
					const routeKey = nextMatch.route.key;
					const matchesAtLevel = createMemo((prev) => {
						const routeMatches = props.routerState.matches();
						const m = routeMatches[i];
						return m && m.route.key === routeKey ? routeMatches : prev || nextMatches;
					});
					next[i] = createRouteContext(props.routerState, next[i - 1] || props.routerState.base, createOutlet(() => routeStates()?.[i + 1]), () => matchesAtLevel()[i], matchesAtLevel);
				}));
			}
		}
		disposers.splice(nextMatches.length).forEach((dispose) => dispose());
		if (prev && equal) {
			prevMatches = nextMatches;
			return prev;
		}
		root = next[0];
		prevMatches = nextMatches;
		return next;
	});
	const outlet = createOutlet(() => routeStates() && root);
	return memo(() => {
		return escape(outlet());
	});
}
var createOutlet = (child) => {
	return () => {
		const c = child();
		if (c) return RouteContextObj({
			value: c,
			get children() {
				return c.outlet();
			}
		});
	};
};
function dataOnly(event, routerState, branches) {
	const url = new URL(event.request.url);
	const prevMatches = getRouteMatches(branches, new URL(event.router.previousUrl || event.request.url).pathname);
	const matches = getRouteMatches(branches, url.pathname);
	unresolvedLazyMatches([...prevMatches, ...matches]).forEach(resolveLazySubtree);
	for (let match = 0; match < matches.length; match++) {
		if (!prevMatches[match] || matches[match].route !== prevMatches[match].route) event.router.dataOnly = true;
		const { route, params } = matches[match];
		route.preload && route.preload({
			params,
			location: routerState.location,
			intent: "preload"
		});
	}
}
//#endregion
//#region node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/routers/history.js
function bindEvent(target, type, handler) {
	target.addEventListener(type, handler);
	return () => target.removeEventListener(type, handler);
}
var depth;
function saveCurrentDepth() {
	if (!window.history.state || window.history.state._depth == null) window.history.replaceState({
		...window.history.state,
		_depth: window.history.length - 1
	}, "");
	depth = window.history.state._depth;
}
function keepDepth(state) {
	return {
		...state,
		_depth: window.history.state && window.history.state._depth
	};
}
function notifyIfNotBlocked(notify, block) {
	let ignore = false;
	return () => {
		const prevDepth = depth;
		saveCurrentDepth();
		const delta = prevDepth == null ? null : depth - prevDepth;
		if (ignore) {
			ignore = false;
			return;
		}
		if (delta && block(delta)) {
			ignore = true;
			window.history.go(-delta);
		} else notify();
	};
}
function scrollToHash(hash, fallbackTop) {
	const el = hash && document.getElementById(hash);
	if (el) el.scrollIntoView();
	else if (fallbackTop) window.scrollTo(0, 0);
}
function browserHistory() {
	const getSource = () => {
		const url = window.location.pathname + window.location.search;
		const state = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
		return {
			value: url + window.location.hash,
			state
		};
	};
	const beforeLeave = {};
	if (!isServer) saveCurrentDepth();
	return {
		get: getSource,
		set({ value, replace, scroll, state }) {
			if (replace) window.history.replaceState(keepDepth(state), "", value);
			else window.history.pushState(state, "", value);
			scrollToHash(decodeURIComponent(window.location.hash.slice(1)), scroll);
			saveCurrentDepth();
		},
		init: (notify) => bindEvent(window, "popstate", notifyIfNotBlocked(notify, (delta) => {
			const guard = beforeLeave.current;
			if (!guard) return false;
			if (delta) return !guard.confirm(delta);
			else {
				const s = getSource();
				return !guard.confirm(s.value, { state: s.state });
			}
		})),
		utils: {
			go: (delta) => window.history.go(delta),
			beforeLeave
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/routers/scrollRestoration.js
var STORAGE_KEY = "solid-router:scroll";
/**
* Explicit scroll restoration for back/forward navigation. The browser's
* native same-document heuristic is unreliable for suspense-driven rendering:
* if the destination route forces a layout while the document is still short,
* the saved offset for the previous entry is clamped and lost (#577).
*
* Positions are captured continuously from the scroll event, keyed by the
* `_depth` the router already stamps on every history entry — capturing at
* scroll time (rather than at exit) stays correct through `useBeforeLeave`
* blocked/reverted traversals. The map persists to sessionStorage on pagehide
* so restoration survives reloads, which `scrollRestoration = "manual"`
* otherwise disables.
*
* Restoration is a single scroll once routing settles — the same strategy
* SvelteKit, TanStack Router and React Router use. Settling after the
* transition commits is what makes the offset reachable; chasing a still-
* growing document afterwards (a ResizeObserver re-asserting the offset as
* content arrives) was tried and removed: no peer router does it, an
* unbounded observer re-clamps the viewport to the bottom when the target is
* never reachable (a list that is genuinely shorter now), and scroll-induced
* layout changes can feed it back into itself. Content that commits after the
* transition settles — an image without reserved space, a boundary below the
* fold — keeps whatever offset the document can hold.
*/
function createScrollRestoration() {
	window.history.scrollRestoration = "manual";
	saveCurrentDepth();
	let positions = {};
	try {
		positions = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
	} catch {}
	const depth = () => window.history.state && window.history.state._depth;
	let programmatic = false;
	let pending;
	const unbind = [bindEvent(window, "scroll", () => {
		const d = depth();
		if (d != null) positions[d] = window.scrollY;
		if (!programmatic) pending = void 0;
	}), bindEvent(window, "pagehide", () => {
		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
		} catch {}
	})];
	const restore = () => {
		if (pending == null) return;
		const y = positions[pending];
		pending = void 0;
		if (y == null) return;
		programmatic = true;
		window.scrollTo(0, y);
		programmatic = false;
	};
	return {
		/** When the adapter notifies a traversal: mark the target for restoration. */
		onPop() {
			pending = depth();
		},
		/** After a push: forward entries died, and this depth may be reused. */
		onPush() {
			const d = depth();
			if (d != null) for (const k in positions) +k >= d && delete positions[k];
		},
		create(router) {
			createEffect(() => ({
				url: router.location.pathname + router.location.search + router.location.hash,
				routing: router.isRouting()
			}), (current) => {
				if (!current.routing) restore();
			}, { transparent: true });
			onCleanup(() => unbind.forEach((u) => u()));
			const [nav] = performance.getEntriesByType && performance.getEntriesByType("navigation");
			if (nav && nav.type !== "navigate") pending = depth();
		}
	};
}
/**
* Threads restoration through a history adapter: pushes prune dead forward
* entries, and adapter notifications (unblocked pops) mark the traversal
* target. Notification runs after the adapter's depth bookkeeping, so the
* marked depth is the entry being restored to.
*/
function withScrollRestoration(history, restoration) {
	return {
		...history,
		set(next) {
			history.set(next);
			next.replace || restoration.onPush();
		},
		init: history.init && ((notify) => history.init((value) => {
			restoration.onPop();
			notify(value);
		}))
	};
}
//#endregion
//#region node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/routers/factory.jsx
/** Wraps a history adapter in the integration signal the router core consumes. Must run under a reactive owner. */
function createIntegration(history) {
	let ignore = false;
	const wrap = (value) => typeof value === "string" ? { value } : value;
	const [read, write] = createSignal(wrap(history.get()), {
		equals: (a, b) => a.value === b.value && a.state === b.state,
		ownedWrite: true
	});
	const signal = [read, (next) => {
		!ignore && history.set(next);
		if (sharedConfig.registry && !sharedConfig.done) sharedConfig.done = true;
		write(next);
	}];
	history.init && onCleanup(history.init((value = history.get()) => {
		ignore = true;
		signal[1](wrap(value));
		ignore = false;
	}));
	return {
		signal,
		utils: history.utils
	};
}
/**
* Server default: a static view of the request URL — no signal machinery, a
* server render never navigates. The request event (when the harness scopes
* one) wins; the provider's `url` prop is the fallback for renders outside a
* request scope (SSG scripts, server-side tests, runtimes without
* `node:async_hooks`). History adapters are a client navigation concern and
* play no part in locating a server render.
*/
function staticIntegration(url, utils) {
	const e = getRequestEvent();
	const source = e ? e.request.url : url;
	let value = "";
	if (source) {
		const u = new URL(source, mockBase);
		value = u.pathname + u.search;
	}
	const obj = { value };
	return {
		signal: [() => obj, (next) => Object.assign(obj, next)],
		utils
	};
}
function createRouter(config) {
	const basePath = config.base || "";
	let compiled;
	let compiledVersion = -1;
	const branches = () => {
		const version = trackLazySubtrees();
		if (!compiled || compiledVersion !== version) {
			compiled = createBranches(config.routes, basePath);
			compiledVersion = version;
		}
		return compiled;
	};
	const renderPath = config.history && config.history.utils && config.history.utils.renderPath || void 0;
	function RouterComponent(props) {
		if (DEV && useOptionalContext(RouterContextObj)) console.warn("Mounting a router inside another router is not supported. Compose route trees in one createRouter config instead.");
		const root = untrack(() => props.children);
		let restoration;
		let history = config.history;
		if (!isServer && (config.scrollRestoration ?? !history)) {
			restoration = createScrollRestoration();
			history = withScrollRestoration(history || browserHistory(), restoration);
		}
		const integration = isServer ? staticIntegration(props.url, config.history && config.history.utils) : createIntegration(history || browserHistory());
		let context;
		const routerState = createRouterContext(integration, branches, () => context, {
			base: basePath,
			singleFlight: config.singleFlight,
			transformUrl: config.transformUrl
		});
		if (!isServer) {
			setupNativeEvents({
				preload: config.preloadLinks,
				explicitLinks: config.explicitLinks,
				actionBase: config.actionBase,
				transformUrl: config.transformUrl
			})(routerState);
			setupLinkClaims(routerState, config.explicitLinks);
			if (routerState.singleFlight) onCleanup(registerFlightRouter(routerState));
			restoration && restoration.create(routerState);
		}
		return RouterContextObj({
			value: routerState,
			get children() {
				return Root({
					routerState,
					root,
					get preload() {
						return config.preload;
					},
					get children() {
						return [memo(() => {
							return escape((context = getOwner()) && null);
						}), Routes({
							routerState,
							branches
						})];
					}
				});
			}
		});
	}
	const instance = Object.assign(RouterComponent, {
		routes: config.routes,
		config,
		match(url) {
			const u = new URL(url, mockBase);
			const pathname = config.transformUrl ? config.transformUrl(u.pathname) : u.pathname;
			return getRouteMatches(branches(), pathname).map(({ route, path, params }) => ({
				path: route.originalPath,
				pattern: route.pattern,
				match: path,
				params,
				info: route.info
			}));
		}
	});
	let paths;
	Object.defineProperty(instance, "paths", { get: () => paths || (paths = createPathsProxy(renderPath, basePath)) });
	return instance;
}
//#endregion
//#region src/lib/use-submission.ts
/** Router 2 compatibility shim for the removed useSubmission hook. */
function useSubmission(fn) {
	const submissions = useSubmissions(fn);
	const state = createMemo(() => {
		const latest = submissions.at(-1);
		return {
			pending: !!latest && latest.result === void 0 && latest.error === void 0,
			error: latest?.error,
			result: latest?.result
		};
	});
	return {
		get pending() {
			return state().pending;
		},
		get error() {
			return state().error;
		},
		get result() {
			return state().result;
		}
	};
}
//#endregion
//#region src/lib/route-access.ts
/** Owner-only URL prefixes (dashboard is exactly `/`). */
var OWNER_ROUTE_PREFIXES = [
	"/families",
	"/schedule",
	"/payments",
	"/expenses",
	"/reports",
	"/services",
	"/children",
	"/unavailability"
];
/** Paths reachable without a session. */
var PUBLIC_PATHS = /* @__PURE__ */ new Set(["/login"]);
/** Paths any authenticated user may visit. */
var AUTH_PATHS = /* @__PURE__ */ new Set(["/account", "/portal"]);
var SKIP_PREFIXES = [
	"/_server",
	"/_build",
	"/api",
	"/icons"
];
var STATIC_FILE = /\.[a-z0-9]+$/i;
function shouldSkipRouteGuard(pathname, method) {
	if (method !== "GET" && method !== "HEAD") return true;
	if (pathname === "/service-worker.js" || pathname === "/favicon.ico") return true;
	if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
	if (STATIC_FILE.test(pathname)) return true;
	return false;
}
function isPublicRoute(pathname) {
	return PUBLIC_PATHS.has(pathname);
}
function isAuthRoute(pathname) {
	return AUTH_PATHS.has(pathname) || pathname.startsWith("/portal/");
}
function isOwnerRoute(pathname) {
	if (pathname === "/") return true;
	return OWNER_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
function authenticatedHomePath(isOwner, familyId) {
	if (isOwner) return "/";
	return familyId ? "/portal" : "/account";
}
//#endregion
//#region src/lib/index.ts
var serverFunction_1$16 = registerServerReference("734af9b4-0", async () => {
	const userId = (await getSession()).data?.userId;
	if (userId === void 0) return null;
	const user = await db.user.findUnique({
		where: { id: userId },
		include: { familyMember: { select: { familyId: true } } }
	});
	if (!user) return null;
	return {
		id: user.id,
		username: user.username,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		phone: user.phone,
		isOwner: user.isOwner,
		role: user.isOwner ? "owner" : "parent",
		familyId: user.familyMember?.familyId ?? null
	};
});
var getUser = query(createServerReference(serverFunction_1$16), "user");
var serverFunction_2$16 = registerServerReference("734af9b4-1", async (formData) => {
	const userId = (await requireUser()).id;
	try {
		const firstName = String(formData.get("firstName") || "");
		const lastName = String(formData.get("lastName") || "");
		const email = String(formData.get("email") || "");
		const phone = String(formData.get("phone") || "");
		if (!email) return /* @__PURE__ */ new Error("Email is required");
		const existingUser = await db.user.findUnique({ where: { email } });
		if (existingUser && existingUser.id !== userId) return /* @__PURE__ */ new Error("Email is already in use");
		await db.user.update({
			where: { id: userId },
			data: {
				firstName: firstName || null,
				lastName: lastName || null,
				email,
				phone: phone || null
			}
		});
		return serverRedirect("/account");
	} catch (err) {
		console.error("Error updating user:", err);
		return new Error(err instanceof Error ? err.message : "Failed to update user");
	}
});
var updateUser = action$1(createServerReference(serverFunction_2$16), "update-user");
var serverFunction_3$16 = registerServerReference("734af9b4-2", async (formData) => {
	const userId = (await requireUser()).id;
	try {
		const currentPassword = String(formData.get("currentPassword"));
		const newPassword = String(formData.get("newPassword"));
		const confirmPassword = String(formData.get("confirmPassword"));
		if (!currentPassword || !newPassword || !confirmPassword) return /* @__PURE__ */ new Error("All password fields are required");
		if (newPassword !== confirmPassword) return /* @__PURE__ */ new Error("New passwords do not match");
		const passwordError = validatePassword(newPassword);
		if (passwordError) return new Error(passwordError);
		const user = await db.user.findUnique({ where: { id: userId } });
		if (!user || !verifyPassword(currentPassword, user.password)) return /* @__PURE__ */ new Error("Current password is incorrect");
		await db.user.update({
			where: { id: userId },
			data: { password: hashPassword(newPassword) }
		});
		return serverRedirect("/account");
	} catch (err) {
		console.error("Error updating password:", err);
		return new Error(err instanceof Error ? err.message : "Failed to update password");
	}
});
var updatePassword = action$1(createServerReference(serverFunction_3$16), "update-password");
var serverFunction_4$13 = registerServerReference("734af9b4-3", async (formData) => {
	const username = String(formData.get("username")).trim();
	const email = String(formData.get("email") || "").trim();
	const password = String(formData.get("password"));
	const loginType = String(formData.get("loginType"));
	let error = validateUsername(username) || validatePassword(password);
	if (error) return new Error(error);
	if (loginType !== "login") {
		const emailError = validateEmail(email);
		if (emailError) return new Error(emailError);
		if (await db.user.count() > 0) return /* @__PURE__ */ new Error("Registration is closed. Ask the owner for a parent account.");
	}
	try {
		const user = await (loginType !== "login" ? register(username, email, password) : login(username, password));
		await (await getSession()).update((d) => {
			d.userId = user.id;
		});
		await setRoleCookie(roleCookieValue(user.isOwner));
		revalidate(getUser.key);
		if (!user.isOwner) {
			const member = await db.familyMember.findUnique({
				where: { userId: user.id },
				select: { familyId: true }
			});
			return serverRedirect(authenticatedHomePath(false, member?.familyId ?? null));
		}
	} catch (err) {
		return err;
	}
	return serverRedirect("/");
});
var loginOrRegister = action$1(createServerReference(serverFunction_4$13), "login-or-register");
var serverFunction_5$12 = registerServerReference("734af9b4-4", async () => {
	await logout$1();
	revalidate(getUser.key);
	return serverRedirect("/login");
});
var logout = action$1(createServerReference(serverFunction_5$12), "logout");
//#endregion
//#region src/lib/notifications.ts
var currentUserId = async function currentUserId() {
	return (await getSession()).data?.userId ?? null;
};
var serverFunction_1$15 = registerServerReference("ce7c325e-0", async (limit = 20) => {
	const userId = await currentUserId();
	if (!userId) return [];
	return db.notification.findMany({
		where: { userId },
		orderBy: { createdAt: "desc" },
		take: limit
	});
});
var getMyNotifications = query(createServerReference(serverFunction_1$15), "my-notifications");
var serverFunction_2$15 = registerServerReference("ce7c325e-1", async () => {
	const userId = await currentUserId();
	if (!userId) return 0;
	return db.notification.count({ where: {
		userId,
		read: false
	} });
});
var getUnreadCount = query(createServerReference(serverFunction_2$15), "unread-notification-count");
var serverFunction_3$15 = registerServerReference("ce7c325e-2", async (id) => {
	const user = await requireUser();
	await db.notification.updateMany({
		where: {
			id,
			userId: user.id
		},
		data: { read: true }
	});
	return reload();
});
action$1(createServerReference(serverFunction_3$15));
var serverFunction_4$12 = registerServerReference("ce7c325e-3", async () => {
	const user = await requireUser();
	await db.notification.updateMany({
		where: {
			userId: user.id,
			read: false
		},
		data: { read: true }
	});
	return reload();
});
action$1(createServerReference(serverFunction_4$12));
//#endregion
//#region src/components/AppShell.tsx
var _tmpl$$4 = [
	"<a",
	"",
	"><wa-button appearance=\"plain\" class=\"nav-link\">",
	"</wa-button></a>"
];
var _tmpl$2$2 = [
	"<a",
	"",
	" class=\"brand-link wa-cluster wa-gap-s wa-align-items-center\"><img src=\"/icons/icon-96x96.png\" alt=\"Lil Sprouts\" width=\"32\" height=\"32\"><span class=\"wa-heading-m\">Lil Sprouts</span></a>"
];
var _tmpl$3 = [
	"<nav",
	" class=\"desktop-nav wa-cluster wa-gap-xs\">",
	"</nav>"
];
var _tmpl$4 = [
	"<wa-badge",
	" variant=\"danger\" pill style=\"",
	"\">",
	"</wa-badge>"
];
var _tmpl$5 = [
	"<div",
	" class=\"notif-dropdown wa-stack wa-gap-xs\">",
	"</div>"
];
var _tmpl$6 = [
	"<a",
	" href=\"/account\"><wa-button appearance=\"plain\">",
	"</wa-button></a>"
];
var _tmpl$7 = [
	"<wa-page",
	" class=\"app-shell no-print\"><header slot=\"header\" class=\"app-header wa-split wa-align-items-center\"><div class=\"wa-cluster wa-gap-m wa-align-items-center\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></div><div class=\"desktop-nav wa-cluster wa-gap-s wa-align-items-center\"><wa-button appearance=\"plain\"",
	"",
	"><wa-icon",
	"></wa-icon></wa-button><div class=\"notif-menu\" style=\"",
	"\"><wa-button appearance=\"plain\" aria-label=\"Notifications\"><wa-icon name=\"bell\"></wa-icon><!--$-->",
	"<!--/--></wa-button><!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--><form",
	" method=\"post\"><wa-button type=\"submit\" variant=\"danger\" appearance=\"filled\"",
	">",
	"</wa-button></form></div></header><nav slot=\"navigation\" class=\"mobile-nav wa-stack wa-gap-xs\"><!--$-->",
	"<!--/--><wa-button appearance=\"outlined\">",
	"</wa-button><!--$-->",
	"<!--/--><form",
	" method=\"post\"><wa-button type=\"submit\" variant=\"danger\" appearance=\"filled\"",
	" style=\"",
	"\">",
	"</wa-button></form></nav><!--$-->",
	"<!--/--></wa-page>"
];
var _tmpl$8 = ["<span", " class=\"brand-link wa-cluster wa-gap-s wa-align-items-center\"><img src=\"/icons/icon-96x96.png\" alt=\"Lil Sprouts\" width=\"32\" height=\"32\"><span class=\"wa-heading-m\">Lil Sprouts</span></span>"];
var _tmpl$9 = ["<p", " class=\"wa-caption\">No notifications</p>"];
var _tmpl$10 = [
	"<button",
	" type=\"button\" class=\"",
	"\"><strong>",
	"</strong><span>",
	"</span></button>"
];
var OWNER_NAV_LINKS = [
	{
		href: "/",
		label: "Home"
	},
	{
		href: "/families",
		label: "Families"
	},
	{
		href: "/schedule",
		label: "Schedule"
	},
	{
		href: "/payments",
		label: "Payments"
	},
	{
		href: "/expenses",
		label: "Expenses"
	},
	{
		href: "/reports",
		label: "Reports"
	}
];
var PARENT_NAV_LINKS = [{
	href: "/portal",
	label: "Portal"
}, {
	href: "/portal/today",
	label: "Today"
}];
function NavLink(props) {
	var _v$ = ssrHydrationKey(), _v$2 = () => {
		return ssrAttribute("href", escape(props.href, true));
	}, _v$3 = scope(() => {
		return escape(props.children);
	});
	return ssr(_tmpl$$4, _v$, _v$2, _v$3);
}
function AppShell(props) {
	var _v$5, _v$6, _v$8, _v$9, _v$14, _v$15, _v$17, _v$18, _v$20, _v$21;
	const user = createMemo(() => getUser());
	const logoutSubmission = useSubmission(logout);
	const notifications = createMemo(async () => {
		if (!await getUser()) return [];
		return getMyNotifications(10);
	});
	const unreadCount = createMemo(async () => {
		if (!await getUser()) return 0;
		return getUnreadCount();
	});
	const [navReady, setNavReady] = createSignal(false);
	const [notifOpen, setNotifOpen] = createSignal(false);
	const [theme, setThemeState] = createSignal("system");
	onSettled(() => {
		initTheme();
		setThemeState(getStoredTheme());
		setNavReady(true);
	});
	const isOwner = () => {
		const u = user();
		if (u?.isOwner) return true;
		if (u && !u.isOwner) return false;
		return readRoleCookie() === "owner";
	};
	const navLinks = () => isOwner() ? OWNER_NAV_LINKS : PARENT_NAV_LINKS;
	const homeHref = () => authenticatedHomePath(isOwner(), user()?.familyId);
	const themeLabel = () => {
		const t = theme();
		if (t === "system") return `Theme: system (${resolveTheme("system")})`;
		return `Theme: ${t}`;
	};
	createEffect(() => notifOpen(), (open) => {
		if (!open) return;
		const onDocClick = (e) => {
			if (e.target?.closest?.(".notif-menu")) return;
			setNotifOpen(false);
		};
		document.addEventListener("click", onDocClick);
		return () => document.removeEventListener("click", onDocClick);
	});
	var _v$4 = ssrHydrationKey(), _v$7 = escape(Show({
		get when() {
			return navReady();
		},
		get fallback() {
			var _v$31 = ssrHydrationKey();
			return ssr(_tmpl$8, _v$31);
		},
		get children() {
			return _v$5 = ssrHydrationKey(), _v$6 = () => {
				return ssrAttribute("href", escape(homeHref(), true));
			}, ssr(_tmpl$2$2, _v$5, _v$6);
		}
	})), _v$10 = escape(Show({
		get when() {
			return navReady();
		},
		get children() {
			return _v$8 = ssrHydrationKey(), _v$9 = escape(For({
				get each() {
					return navLinks();
				},
				children: (link) => NavLink({
					get href() {
						return link.href;
					},
					get children() {
						return link.label;
					}
				})
			})), ssr(_tmpl$3, _v$8, _v$9);
		}
	})), _g$ = ssrGroup(() => {
		return [
			ssrAttribute("title", escape(themeLabel(), true)),
			ssrAttribute("aria-label", escape(themeLabel(), true)),
			ssrAttribute("name", resolveTheme(theme()) === "dark" ? "moon" : "sun")
		];
	}, 3), _v$16 = escape(Show({
		get when() {
			return (unreadCount() ?? 0) > 0;
		},
		get children() {
			return _v$14 = ssrHydrationKey(), _v$15 = scope(() => {
				return escape(unreadCount());
			}), ssr(_tmpl$4, _v$14, ssrStyleProperty("margin-left:", "0.25rem"), _v$15);
		}
	})), _v$19 = escape(Show({
		get when() {
			return notifOpen();
		},
		get children() {
			return _v$17 = ssrHydrationKey(), _v$18 = escape(Show({
				get when() {
					return (notifications() ?? []).length > 0;
				},
				get fallback() {
					var _v$32 = ssrHydrationKey();
					return ssr(_tmpl$9, _v$32);
				},
				get children() {
					return For({
						get each() {
							return notifications() ?? [];
						},
						children: (n) => {
							var _v$33, _v$34, _v$35, _v$36;
							return _v$33 = ssrHydrationKey(), _v$34 = () => {
								return ssrClassName(["notif-item", { unread: !n.read }]);
							}, _v$35 = () => {
								return escape(n.title);
							}, _v$36 = () => {
								return escape(n.body);
							}, ssr(_tmpl$10, _v$33, _v$34, _v$35, _v$36);
						}
					});
				}
			})), ssr(_tmpl$5, _v$17, _v$18);
		}
	})), _v$22 = escape(Show({
		get when() {
			return user();
		},
		get children() {
			return _v$20 = ssrHydrationKey(), _v$21 = () => {
				return escape(user()?.firstName || user()?.username);
			}, ssr(_tmpl$6, _v$20, _v$21);
		}
	})), _v$23 = () => {
		return ssrAttribute("disabled", escape(logoutSubmission.pending || void 0, true));
	}, _v$24 = () => {
		return logoutSubmission.pending ? "Logging out..." : "Logout";
	}, _v$25 = escape(Show({
		get when() {
			return navReady();
		},
		get children() {
			return For({
				get each() {
					return navLinks();
				},
				children: (link) => NavLink({
					get href() {
						return link.href;
					},
					get children() {
						return link.label;
					}
				})
			});
		}
	})), _v$26 = scope(() => {
		return escape(themeLabel());
	}), _v$27 = escape(Show({
		get when() {
			return user();
		},
		get children() {
			return NavLink({
				href: "/account",
				get children() {
					return user()?.firstName || user()?.username;
				}
			});
		}
	})), _v$28 = () => {
		return ssrAttribute("disabled", escape(logoutSubmission.pending || void 0, true));
	}, _v$29 = () => {
		return logoutSubmission.pending ? "Logging out..." : "Logout";
	}, _v$30 = scope(() => {
		return escape(props.children);
	});
	return ssr(_tmpl$7, _v$4, _v$7, _v$10, _g$, _g$, _g$, ssrStyleProperty("position:", "relative"), _v$16, _v$19, _v$22, ssrAttribute("action", escape(logout, true)), _v$23, _v$24, _v$25, _v$26, _v$27, ssrAttribute("action", escape(logout, true)), _v$28, ssrStyleProperty("width:", "100%"), _v$29, _v$30);
}
//#endregion
//#region src/components/ErrorBoundary.tsx
var _tmpl$$3 = [
	"<div",
	" class=\"error-boundary\"><h1>Something went wrong</h1><p>",
	"</p><a href=\"/\">Return home</a></div>"
];
function AppErrorBoundary(props) {
	return Errored({
		fallback: (error) => {
			var _v$, _v$2;
			return _v$ = ssrHydrationKey(), _v$2 = () => {
				return escape(error()?.message ?? "An unexpected error occurred.");
			}, ssr(_tmpl$$3, _v$, _v$2);
		},
		get children() {
			return props.children;
		}
	});
}
//#endregion
//#region src/components/wa/Dialog.tsx
var _tmpl$$2 = [
	"<div",
	" slot=\"footer\">",
	"</div>"
];
var _tmpl$2$1 = [
	"<wa-dialog",
	" open",
	" light-dismiss style=\"",
	"\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></wa-dialog>"
];
function Dialog(props) {
	var _v$5, _v$6, _v$, _g$, _v$4, _v$7;
	createEffect(() => props.open, (open) => {});
	createEffect(() => props.open, (open) => {
		if (open) {
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = "";
			};
		}
		document.body.style.overflow = "";
	});
	return Show({
		get when() {
			return props.open;
		},
		get children() {
			return _v$ = ssrHydrationKey(), _g$ = ssrGroup(() => {
				return [ssrAttribute("label", escape(props.title, true)), ssrStyleProperty("--width:", escape(props.maxWidth ?? "500px", true))];
			}, 2), _v$4 = scope(() => {
				return escape(props.children);
			}), _v$7 = escape(Show({
				get when() {
					return props.footer;
				},
				get children() {
					return _v$5 = ssrHydrationKey(), _v$6 = () => {
						return escape(props.footer);
					}, ssr(_tmpl$$2, _v$5, _v$6);
				}
			})), ssr(_tmpl$2$1, _v$, _g$, _g$, _v$4, _v$7);
		}
	});
}
//#endregion
//#region src/components/wa/ConfirmDialog.tsx
var _tmpl$$1 = [
	"<p",
	">",
	"</p>"
];
var _tmpl$2 = [
	"<div",
	" class=\"wa-cluster wa-gap-s\"><wa-button appearance=\"outlined\">",
	"</wa-button><wa-button",
	">",
	"</wa-button></div>"
];
function ConfirmDialog(props) {
	var _v$, _v$2;
	return Dialog({
		get open() {
			return props.open;
		},
		get title() {
			return props.title;
		},
		maxWidth: "420px",
		get onClose() {
			return props.onCancel;
		},
		get footer() {
			var _v$3 = ssrHydrationKey(), _v$4 = () => {
				return escape(props.cancelLabel ?? "Cancel");
			}, _v$5 = () => {
				return ssrAttribute("variant", escape(props.variant ?? "danger", true));
			}, _v$6 = () => {
				return escape(props.confirmLabel ?? "Confirm");
			};
			return ssr(_tmpl$2, _v$3, _v$4, _v$5, _v$6);
		},
		get children() {
			return _v$ = ssrHydrationKey(), _v$2 = () => {
				return escape(props.message);
			}, ssr(_tmpl$$1, _v$, _v$2);
		}
	});
}
//#endregion
//#region src/components/wa/ConfirmProvider.tsx
var ConfirmContext = createContext();
function useConfirm() {
	const ctx = useContext(ConfirmContext);
	if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
	return ctx;
}
function ConfirmProvider(props) {
	const [open, setOpen] = createSignal(false);
	const [options, setOptions] = createSignal({ message: "" });
	let resolvePromise = null;
	const confirm = (opts) => {
		setOptions(opts);
		setOpen(true);
		return new Promise((resolve) => {
			resolvePromise = resolve;
		});
	};
	const close = (result) => {
		setOpen(false);
		resolvePromise?.(result);
		resolvePromise = null;
	};
	return ConfirmContext({
		value: { confirm },
		get children() {
			return [memo(() => {
				return escape(props.children);
			}), ConfirmDialog({
				get open() {
					return open();
				},
				get title() {
					return options().title ?? "Confirm";
				},
				get message() {
					return options().message;
				},
				get confirmLabel() {
					return options().confirmLabel;
				},
				get cancelLabel() {
					return options().cancelLabel;
				},
				get variant() {
					return options().variant;
				},
				onConfirm: () => close(true),
				onCancel: () => close(false)
			})];
		}
	});
}
//#endregion
//#region src/lib/settings.ts
var upsertNumberSetting = async function upsertNumberSetting(key, rawValue) {
	const value = rawValue.trim();
	if (!value) throw new Error(`${key} is required`);
	const parsed = Number(value);
	if (Number.isNaN(parsed) || parsed < 0) throw new Error(`${key} must be a valid non-negative number`);
	await db.setting.upsert({
		where: { key },
		update: {
			value,
			type: "number"
		},
		create: {
			key,
			value,
			type: "number"
		}
	});
};
var serverFunction_1$14 = registerServerReference("af6506e8-0", async (key) => {
	await requireOwner();
	return await db.setting.findUnique({ where: { key } });
});
query(createServerReference(serverFunction_1$14), "setting");
var serverFunction_2$14 = registerServerReference("af6506e8-1", async () => {
	await requireOwner();
	return await db.setting.findMany({ orderBy: { key: "asc" } });
});
query(createServerReference(serverFunction_2$14), "settings");
var serverFunction_3$14 = registerServerReference("af6506e8-2", async (key, defaultValue) => {
	await requireOwner();
	const setting = await db.setting.findUnique({ where: { key } });
	if (!setting) return defaultValue;
	switch (setting.type) {
		case "number": return parseFloat(setting.value) || defaultValue;
		case "boolean": return setting.value === "true";
		case "json": try {
			return JSON.parse(setting.value);
		} catch {
			return defaultValue;
		}
		default: return setting.value || defaultValue;
	}
});
var getSettingValue = createServerReference(serverFunction_3$14);
var serverFunction_4$11 = registerServerReference("af6506e8-3", async (formData) => {
	await requireOwner();
	try {
		const key = String(formData.get("key"));
		const value = String(formData.get("value") ?? "").trim();
		const type = String(formData.get("type") || "string");
		if (!key) return /* @__PURE__ */ new Error("Setting key is required");
		if (type === "number") await upsertNumberSetting(key, value);
		else await db.setting.upsert({
			where: { key },
			update: {
				value,
				type
			},
			create: {
				key,
				value,
				type
			}
		});
		revalidate(getDefaultHourlyRate.key);
		revalidate(getDefaultPianoLessonRate.key);
		return serverRedirect("/account");
	} catch (err) {
		console.error("Error setting setting:", err);
		return new Error(err instanceof Error ? err.message : "Failed to set setting");
	}
});
var setSetting = action$1(createServerReference(serverFunction_4$11));
var serverFunction_5$11 = registerServerReference("af6506e8-4", async (formData) => {
	await requireOwner();
	try {
		const hourlyRate = String(formData.get("defaultHourlyRate") ?? "").trim();
		const pianoRate = String(formData.get("defaultPianoLessonRate") ?? "").trim();
		await upsertNumberSetting("defaultHourlyRate", hourlyRate);
		await upsertNumberSetting("defaultPianoLessonRate", pianoRate);
		revalidate(getDefaultHourlyRate.key);
		revalidate(getDefaultPianoLessonRate.key);
		return serverRedirect("/account");
	} catch (err) {
		console.error("Error saving business settings:", err);
		return new Error(err instanceof Error ? err.message : "Failed to save business settings");
	}
});
action$1(createServerReference(serverFunction_5$11));
var serverFunction_6$10 = registerServerReference("af6506e8-5", async () => {
	await requireOwner();
	return getSettingValue("defaultHourlyRate", null);
});
var getDefaultHourlyRate = query(createServerReference(serverFunction_6$10), "defaultHourlyRate");
var serverFunction_7$8 = registerServerReference("af6506e8-6", async () => {
	await requireOwner();
	return getSettingValue("defaultPianoLessonRate", null);
});
var getDefaultPianoLessonRate = query(createServerReference(serverFunction_7$8), "defaultPianoLessonRate");
//#endregion
//#region src/routes/account.tsx?pick=route&lang.tsx
var route$23 = { preload() {
	getUser();
	getDefaultHourlyRate();
	getDefaultPianoLessonRate();
} };
//#endregion
//#region src/lib/datetime.ts
var datetime_exports = /* @__PURE__ */ __exportAll({
	datetimeLocalToUTC: () => datetimeLocalToUTC,
	endOfDayUTC: () => endOfDayUTC,
	ensureDate: () => ensureDate,
	formatDateLocal: () => formatDateLocal,
	formatDateTimeLocal: () => formatDateTimeLocal,
	formatTimeLocal: () => formatTimeLocal,
	isSameDay: () => isSameDay,
	parseFormDate: () => parseFormDate$1,
	startOfDayUTC: () => startOfDayUTC,
	utcToDatetimeLocal: () => utcToDatetimeLocal
});
/**
* Utility functions for handling dates and times with proper timezone support
*
* IMPORTANT: PostgreSQL columns are TIMESTAMPTZ (with timezone)
* - When saving: We convert user's local datetime to UTC Date object
* - When reading: PostgreSQL returns UTC, we convert to local for display
*
* SSR Note: Time formatting functions use browser APIs that depend on client timezone.
* Always use ClientOnly wrapper or check for browser environment when rendering times.
*/
/**
* Safely converts a Date or string to a Date object
* Handles data from both fresh server responses and cached router data
*
* @param date - Can be a Date object or ISO string from database
* @returns Date object
*/
function ensureDate(date) {
	if (!date) throw new Error("date is required");
	if (date instanceof Date) return date;
	return new Date(date);
}
/**
* Converts a datetime-local string (from HTML input) to a UTC Date object
* datetime-local inputs return strings like "2024-01-15T14:30" (no timezone)
* We interpret this as the user's LOCAL time and return a Date in UTC
*
* IMPORTANT: This function runs on the SERVER, so it uses the SERVER's timezone.
* To properly convert user's local time, we need the user's timezone offset.
*
* @param datetimeLocal - String in format "YYYY-MM-DDTHH:mm"
* @param userTimezoneOffset - Optional timezone offset in minutes (e.g., -360 for UTC-6)
*                            If not provided, uses server's timezone (may be incorrect!)
* @returns Date object in UTC
*
* Example: User enters "2024-01-15T14:30" in PST (UTC-8, offset -480 minutes)
*   -> Returns Date object representing "2024-01-15T22:30:00.000Z"
*/
function datetimeLocalToUTC(datetimeLocal, userTimezoneOffset) {
	if (!datetimeLocal) throw new Error("datetimeLocal string is required");
	const [datePart, timePart] = datetimeLocal.split("T");
	const [year, month, day] = datePart.split("-").map(Number);
	const [hours, minutes] = timePart.split(":").map(Number);
	if (userTimezoneOffset !== void 0) {
		const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
		return /* @__PURE__ */ new Date(utcDate.getTime() - userTimezoneOffset * 60 * 60 * 1e3);
	}
	return new Date(year, month - 1, day, hours, minutes, 0, 0);
}
/**
* Converts a UTC Date from the database to a datetime-local string for HTML inputs
* PostgreSQL TIMESTAMPTZ returns dates in UTC, we convert to local for display
*
* Example: Database has "2024-01-15T22:30:00.000Z"
*   -> User in PST sees "2024-01-15T14:30" in the input field
*/
function utcToDatetimeLocal(utcDate) {
	if (!utcDate) return "";
	const date = typeof utcDate === "string" ? new Date(utcDate) : utcDate;
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
/**
* Formats a date for display in the user's local timezone
*/
function formatDateLocal(date) {
	if (!date) return "";
	return ensureDate(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
/**
* Formats a datetime for display in the user's local timezone
*/
function formatDateTimeLocal(date) {
	if (!date) return "";
	return ensureDate(date).toLocaleString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	});
}
/**
* Formats a time for display in the user's local timezone
* Note: This uses browser's timezone. On SSR, it will use server's timezone initially,
* then hydrate to client's timezone. This may cause a visual flash.
* For critical time displays, consider using ClientOnly component wrapper.
*/
function formatTimeLocal(date) {
	if (!date) return "";
	return ensureDate(date).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	});
}
/**
* Converts a date string (from form) to UTC Date
* Handles both date-only and datetime-local formats
*/
function parseFormDate$1(dateString) {
	if (!dateString) throw new Error("dateString is required");
	if (dateString.includes("T")) return datetimeLocalToUTC(dateString);
	const [year, month, day] = dateString.split("-").map(Number);
	return new Date(year, month - 1, day, 0, 0, 0, 0);
}
/**
* Gets the start of day in UTC for a given local date
* Useful for date range queries
*/
function startOfDayUTC(date) {
	const d = new Date(ensureDate(date));
	d.setHours(0, 0, 0, 0);
	return d;
}
/**
* Gets the end of day in UTC for a given local date
* Useful for date range queries
*/
function endOfDayUTC(date) {
	const d = new Date(ensureDate(date));
	d.setHours(23, 59, 59, 999);
	return d;
}
/**
* Compares two dates to see if they're on the same calendar day
* Uses local date components to avoid timezone issues
* 
* @param date1 - First date to compare
* @param date2 - Second date to compare
* @returns true if both dates are on the same calendar day in local timezone
*/
function isSameDay(date1, date2) {
	const d1 = ensureDate(date1);
	const d2 = ensureDate(date2);
	return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}
//#endregion
//#region src/lib/schedule.ts
var serverFunction_1$13 = registerServerReference("a4324201-0", async (startDate, endDate) => {
	await requireOwner();
	const sessions = await db.careSession.findMany({
		where: { scheduledStart: {
			gte: startDate,
			lte: endDate
		} },
		include: {
			family: { select: {
				id: true,
				familyName: true
			} },
			service: { select: {
				id: true,
				name: true,
				code: true
			} },
			children: { select: {
				id: true,
				firstName: true,
				lastName: true
			} }
		},
		orderBy: { scheduledStart: "asc" }
	});
	return serializeMoneyDeep(sessions.map((session) => ({
		...session,
		scheduledStart: session.scheduledStart instanceof Date ? session.scheduledStart.toISOString() : session.scheduledStart,
		scheduledEnd: session.scheduledEnd instanceof Date ? session.scheduledEnd.toISOString() : session.scheduledEnd,
		actualStart: session.actualStart instanceof Date ? session.actualStart.toISOString() : session.actualStart || null,
		actualEnd: session.actualEnd instanceof Date ? session.actualEnd.toISOString() : session.actualEnd || null,
		dropOffTime: session.dropOffTime instanceof Date ? session.dropOffTime.toISOString() : session.dropOffTime || null,
		pickUpTime: session.pickUpTime instanceof Date ? session.pickUpTime.toISOString() : session.pickUpTime || null,
		createdAt: session.createdAt instanceof Date ? session.createdAt.toISOString() : session.createdAt,
		updatedAt: session.updatedAt instanceof Date ? session.updatedAt.toISOString() : session.updatedAt
	})));
});
var getCareSessionsForRange = query(createServerReference(serverFunction_1$13), "care-sessions-range");
var serverFunction_2$13 = registerServerReference("a4324201-1", async (date) => {
	await requireOwner();
	const startOfDay = startOfDayUTC(date);
	const endOfDay = endOfDayUTC(date);
	const sessions = await db.careSession.findMany({
		where: {
			scheduledStart: {
				gte: startOfDay,
				lte: endOfDay
			},
			status: { not: "CANCELLED" }
		},
		include: {
			family: { select: {
				id: true,
				familyName: true
			} },
			service: { select: {
				id: true,
				name: true,
				code: true
			} },
			children: { select: {
				id: true,
				firstName: true,
				lastName: true
			} }
		},
		orderBy: { scheduledStart: "asc" }
	});
	return serializeMoneyDeep(sessions);
});
var getSessionsForDay = query(createServerReference(serverFunction_2$13), "sessions-for-day");
var serverFunction_3$13 = registerServerReference("a4324201-2", async (limit = 10) => {
	await requireOwner();
	const now = /* @__PURE__ */ new Date();
	const futureDate = /* @__PURE__ */ new Date();
	futureDate.setDate(futureDate.getDate() + 7);
	const sessions = await db.careSession.findMany({
		where: {
			scheduledStart: {
				gte: now,
				lte: futureDate
			},
			status: { not: "CANCELLED" }
		},
		include: {
			family: { select: {
				id: true,
				familyName: true
			} },
			service: { select: {
				id: true,
				name: true,
				code: true
			} },
			children: { select: {
				id: true,
				firstName: true,
				lastName: true
			} }
		},
		orderBy: { scheduledStart: "asc" },
		take: limit
	});
	return serializeMoneyDeep(sessions);
});
var getUpcomingSessions = query(createServerReference(serverFunction_3$13), "upcoming-sessions");
var serverFunction_4$10 = registerServerReference("a4324201-3", async (id) => {
	await requireOwner();
	await requireSessionFamilyAccess(id);
	const session = await db.careSession.findUnique({
		where: { id },
		include: {
			family: { select: {
				id: true,
				familyName: true,
				parentFirstName: true,
				parentLastName: true
			} },
			service: { select: {
				id: true,
				name: true,
				code: true
			} },
			children: { select: {
				id: true,
				firstName: true,
				lastName: true
			} },
			schedule: { select: {
				id: true,
				name: true,
				recurrence: true
			} }
		}
	});
	if (!session) throw new Error("Care session not found");
	return serializeMoneyDeep(session);
});
var getCareSession = query(createServerReference(serverFunction_4$10), "care-session");
var serverFunction_5$10 = registerServerReference("a4324201-4", async (startDate, endDate) => {
	await requireOwner();
	return await db.unavailability.findMany({
		where: { OR: [
			{ startDate: {
				gte: startDate,
				lte: endDate
			} },
			{ endDate: {
				gte: startDate,
				lte: endDate
			} },
			{ AND: [{ startDate: { lte: startDate } }, { endDate: { gte: endDate } }] }
		] },
		orderBy: { startDate: "asc" }
	});
});
var getUnavailabilitiesForRange = query(createServerReference(serverFunction_5$10), "unavailabilities-range");
var serverFunction_6$9 = registerServerReference("a4324201-5", async (formData) => {
	await requireOwner();
	try {
		const sessionId = String(formData.get("sessionId"));
		const breakfastCount = parseInt(String(formData.get("breakfastCount") || "0"));
		const morningSnackCount = parseInt(String(formData.get("morningSnackCount") || "0"));
		const lunchCount = parseInt(String(formData.get("lunchCount") || "0"));
		const afternoonSnackCount = parseInt(String(formData.get("afternoonSnackCount") || "0"));
		const dinnerCount = parseInt(String(formData.get("dinnerCount") || "0"));
		const notes = String(formData.get("notes") || "");
		if (!sessionId) return /* @__PURE__ */ new Error("Session ID is required");
		await requireSessionFamilyAccess(sessionId);
		const updatedSession = await db.careSession.update({
			where: { id: sessionId },
			data: {
				breakfastCount,
				morningSnackCount,
				lunchCount,
				afternoonSnackCount,
				dinnerCount,
				notes: notes || null
			},
			select: { familyId: true }
		});
		return serverRedirect(`/families/${updatedSession.familyId}/sessions/${sessionId}`);
	} catch (err) {
		console.error("Error updating care session:", err);
		return new Error(err instanceof Error ? err.message : "Failed to update care session");
	}
});
var updateCareSession = action$1(createServerReference(serverFunction_6$9));
var serverFunction_7$7 = registerServerReference("a4324201-6", async (formData) => {
	await requireOwner();
	try {
		const sessionId = String(formData.get("sessionId"));
		const scheduledStart = String(formData.get("scheduledStart"));
		const scheduledEnd = String(formData.get("scheduledEnd"));
		const hourlyRate = formData.get("hourlyRate") ? parseMoney(String(formData.get("hourlyRate"))) : null;
		const notes = String(formData.get("notes") || "");
		const isConfirmed = formData.get("isConfirmed") === "true";
		const status = String(formData.get("status"));
		const childIds = [];
		formData.forEach((value, key) => {
			if (key.startsWith("child_")) childIds.push(String(value));
		});
		if (!sessionId || !scheduledStart || !scheduledEnd) return /* @__PURE__ */ new Error("Session ID, start time, and end time are required");
		await requireSessionFamilyAccess(sessionId);
		const { datetimeLocalToUTC } = await Promise.resolve().then(() => datetime_exports);
		const timezoneOffsetMinutes = formData.get("timezoneOffset") ? parseInt(String(formData.get("timezoneOffset"))) : void 0;
		const timezoneOffsetHours = timezoneOffsetMinutes !== void 0 ? timezoneOffsetMinutes / 60 : void 0;
		const updatedSession = await db.careSession.update({
			where: { id: sessionId },
			data: {
				scheduledStart: datetimeLocalToUTC(scheduledStart, timezoneOffsetHours),
				scheduledEnd: datetimeLocalToUTC(scheduledEnd, timezoneOffsetHours),
				hourlyRate,
				notes: notes || null,
				isConfirmed,
				status,
				children: { set: childIds.map((id) => ({ id })) }
			},
			select: { familyId: true }
		});
		return serverRedirect(`/families/${updatedSession.familyId}/sessions/${sessionId}`);
	} catch (err) {
		console.error("Error editing care session:", err);
		return new Error(err instanceof Error ? err.message : "Failed to edit care session");
	}
});
var editCareSessionFull = action$1(createServerReference(serverFunction_7$7));
var serverFunction_8$3 = registerServerReference("a4324201-7", async (formData) => {
	await requireOwner();
	try {
		const id = String(formData.get("id"));
		if (!id) return /* @__PURE__ */ new Error("Session ID is required");
		await requireSessionFamilyAccess(id);
		await db.careSession.delete({ where: { id } });
		return reload();
	} catch (err) {
		console.error("Error deleting care session:", err);
		return new Error(err instanceof Error ? err.message : "Failed to delete care session");
	}
});
action$1(createServerReference(serverFunction_8$3));
//#endregion
//#region src/lib/notification-helpers.ts
async function createNotification(input) {
	return db.notification.create({ data: {
		userId: input.userId,
		type: input.type,
		title: input.title,
		body: input.body,
		familyId: input.familyId ?? null,
		careSessionId: input.careSessionId ?? null
	} });
}
async function notifyIncidentReport(params) {
	const recipientIds = /* @__PURE__ */ new Set();
	(await db.user.findMany({
		where: { isOwner: true },
		select: { id: true }
	})).forEach((owner) => recipientIds.add(owner.id));
	(await db.familyMember.findMany({
		where: {
			familyId: params.familyId,
			userId: { not: null }
		},
		select: { userId: true }
	})).forEach((member) => {
		if (member.userId) recipientIds.add(member.userId);
	});
	const type = params.severity === "SEVERE" ? "INCIDENT_SEVERE" : "INCIDENT_FOLLOWUP";
	await Promise.all(Array.from(recipientIds).map((userId) => createNotification({
		userId,
		type,
		title: params.title,
		body: params.body,
		familyId: params.familyId,
		careSessionId: params.careSessionId
	})));
}
/** Extension point for future email/cron daily digest. */
async function sendDailySummary(_familyId, _date) {}
//#endregion
//#region src/lib/session-reports.ts
var serverFunction_1$12 = registerServerReference("e3ee11d2-0", async (careSessionId) => {
	await requireOwner();
	await requireSessionFamilyAccess(careSessionId);
	return await db.sessionReport.findMany({
		where: { careSessionId },
		include: {
			child: { select: {
				id: true,
				firstName: true,
				lastName: true
			} },
			reportedBy: { select: {
				id: true,
				firstName: true,
				lastName: true
			} }
		},
		orderBy: { timestamp: "desc" }
	});
});
var getSessionReports = query(createServerReference(serverFunction_1$12), "session-reports");
var serverFunction_2$12 = registerServerReference("e3ee11d2-1", async (childId, limit) => {
	await requireOwner();
	await requireChildAccess(childId);
	return await db.sessionReport.findMany({
		where: { childId },
		include: {
			careSession: { select: {
				id: true,
				scheduledStart: true,
				scheduledEnd: true
			} },
			reportedBy: { select: {
				id: true,
				firstName: true,
				lastName: true
			} }
		},
		orderBy: { timestamp: "desc" },
		take: limit || void 0
	});
});
query(createServerReference(serverFunction_2$12), "child-reports");
var serverFunction_3$12 = registerServerReference("e3ee11d2-2", async (familyId, limit) => {
	await requireOwner();
	await assertFamilyExists(familyId);
	return await db.sessionReport.findMany({
		where: { careSession: { familyId } },
		include: {
			child: { select: {
				id: true,
				firstName: true,
				lastName: true
			} },
			careSession: { select: {
				id: true,
				scheduledStart: true,
				scheduledEnd: true
			} },
			reportedBy: { select: {
				id: true,
				firstName: true,
				lastName: true
			} }
		},
		orderBy: { timestamp: "desc" },
		take: limit || void 0
	});
});
query(createServerReference(serverFunction_3$12), "family-reports");
var serverFunction_4$9 = registerServerReference("e3ee11d2-3", async (id) => {
	await requireOwner();
	const report = await db.sessionReport.findUnique({
		where: { id },
		include: {
			child: true,
			careSession: { include: { family: true } },
			reportedBy: { select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true
			} }
		}
	});
	if (!report) throw new Error("Report not found");
	return report;
});
query(createServerReference(serverFunction_4$9), "session-report");
var serverFunction_5$9 = registerServerReference("e3ee11d2-4", async (formData) => {
	await requireOwner();
	try {
		const careSessionId = String(formData.get("careSessionId"));
		const childId = String(formData.get("childId"));
		const type = String(formData.get("type"));
		const severity = String(formData.get("severity"));
		const title = String(formData.get("title"));
		const description = String(formData.get("description"));
		const timestamp = String(formData.get("timestamp"));
		const actionTaken = String(formData.get("actionTaken") || "");
		const followUpNeeded = formData.get("followUpNeeded") === "true";
		const reportedById = String(formData.get("reportedById") || "");
		if (!title) return /* @__PURE__ */ new Error("Title is required");
		if (!description) return /* @__PURE__ */ new Error("Description is required");
		if (!careSessionId) return /* @__PURE__ */ new Error("Care session is required");
		if (!childId) return /* @__PURE__ */ new Error("Child is required");
		await requireSessionFamilyAccess(careSessionId);
		await requireChildAccess(childId);
		await db.sessionReport.create({ data: {
			careSessionId,
			childId,
			type,
			severity,
			title,
			description,
			timestamp: timestamp ? new Date(timestamp) : /* @__PURE__ */ new Date(),
			actionTaken: actionTaken || null,
			followUpNeeded,
			reportedById: reportedById || null
		} });
		const session = await db.careSession.findUnique({
			where: { id: careSessionId },
			select: { familyId: true }
		});
		if (session && (severity === "SEVERE" || followUpNeeded)) await notifyIncidentReport({
			familyId: session.familyId,
			careSessionId,
			title,
			body: description,
			severity,
			followUpNeeded
		});
		return serverRedirect(`/families/${session?.familyId}/sessions/${careSessionId}`);
	} catch (err) {
		console.error("Error creating session report:", err);
		return new Error(err instanceof Error ? err.message : "Failed to create report");
	}
});
var createSessionReport = action$1(createServerReference(serverFunction_5$9));
var serverFunction_6$8 = registerServerReference("e3ee11d2-5", async (formData) => {
	await requireOwner();
	try {
		const id = String(formData.get("id"));
		const type = String(formData.get("type"));
		const severity = String(formData.get("severity"));
		const title = String(formData.get("title"));
		const description = String(formData.get("description"));
		const timestamp = String(formData.get("timestamp"));
		const actionTaken = String(formData.get("actionTaken") || "");
		const followUpNeeded = formData.get("followUpNeeded") === "true";
		if (!title) return /* @__PURE__ */ new Error("Title is required");
		if (!description) return /* @__PURE__ */ new Error("Description is required");
		await db.sessionReport.update({
			where: { id },
			data: {
				type,
				severity,
				title,
				description,
				timestamp: timestamp ? new Date(timestamp) : /* @__PURE__ */ new Date(),
				actionTaken: actionTaken || null,
				followUpNeeded
			}
		});
		return reload();
	} catch (err) {
		console.error("Error updating session report:", err);
		return new Error(err instanceof Error ? err.message : "Failed to update report");
	}
});
action$1(createServerReference(serverFunction_6$8));
var serverFunction_7$6 = registerServerReference("e3ee11d2-6", async (id) => {
	await requireOwner();
	try {
		await db.sessionReport.delete({ where: { id } });
		return reload();
	} catch (err) {
		console.error("Error deleting session report:", err);
		return new Error(err instanceof Error ? err.message : "Failed to delete report");
	}
});
action$1(createServerReference(serverFunction_7$6));
var serverFunction_8$2 = registerServerReference("e3ee11d2-7", async () => {
	await requireOwner();
	return await db.sessionReport.findMany({
		where: { followUpNeeded: true },
		include: {
			child: { select: {
				id: true,
				firstName: true,
				lastName: true
			} },
			careSession: { include: { family: { select: {
				id: true,
				familyName: true
			} } } },
			reportedBy: { select: {
				id: true,
				firstName: true,
				lastName: true
			} }
		},
		orderBy: { timestamp: "desc" }
	});
});
query(createServerReference(serverFunction_8$2), "follow-up-reports");
var serverFunction_9$1 = registerServerReference("e3ee11d2-8", async (limit = 10) => {
	await requireOwner();
	return await db.sessionReport.findMany({
		include: {
			child: { select: {
				id: true,
				firstName: true,
				lastName: true
			} },
			careSession: { include: { family: { select: {
				id: true,
				familyName: true
			} } } },
			reportedBy: { select: {
				id: true,
				firstName: true,
				lastName: true
			} }
		},
		orderBy: { timestamp: "desc" },
		take: limit
	});
});
var getRecentReports = query(createServerReference(serverFunction_9$1), "recent-reports");
//#endregion
//#region src/lib/soft-delete.ts
/** Soft-delete a family and all related records (preserves payment history). */
async function cascadeSoftDeleteFamily(familyId) {
	const now = /* @__PURE__ */ new Date();
	await dbIncludingDeleted.$transaction(async (tx) => {
		const sessionIds = (await tx.careSession.findMany({
			where: { familyId },
			select: { id: true }
		})).map((session) => session.id);
		if (sessionIds.length > 0) {
			await tx.sessionExpense.updateMany({
				where: { sessionId: { in: sessionIds } },
				data: { deletedAt: now }
			});
			await tx.sessionReport.updateMany({
				where: { careSessionId: { in: sessionIds } },
				data: { deletedAt: now }
			});
			await tx.payment.updateMany({
				where: { careSessionId: { in: sessionIds } },
				data: { deletedAt: now }
			});
		}
		await tx.careSession.updateMany({
			where: { familyId },
			data: { deletedAt: now }
		});
		await tx.careSchedule.updateMany({
			where: { familyId },
			data: { deletedAt: now }
		});
		await tx.child.updateMany({
			where: { familyId },
			data: { deletedAt: now }
		});
		await tx.familyMember.updateMany({
			where: { familyId },
			data: { deletedAt: now }
		});
		await tx.document.updateMany({
			where: { familyId },
			data: { deletedAt: now }
		});
		await tx.expense.updateMany({
			where: { familyId },
			data: { deletedAt: now }
		});
		await tx.familyService.updateMany({
			where: { familyId },
			data: { deletedAt: now }
		});
		await tx.payment.updateMany({
			where: { familyId },
			data: { deletedAt: now }
		});
		await tx.family.update({
			where: { id: familyId },
			data: { deletedAt: now }
		});
	});
}
//#endregion
//#region src/lib/families.ts
var formatParentNames = function formatParentNames(parentFirstName, parentLastName, familyMembers) {
	const spouse = familyMembers?.find((member) => member.relationship === "PARENT");
	if (spouse && spouse.lastName === parentLastName) return `${parentFirstName} & ${spouse.firstName} ${parentLastName}`;
	else if (spouse) return `${parentFirstName} ${parentLastName} & ${spouse.firstName} ${spouse.lastName}`;
	return `${parentFirstName} ${parentLastName}`;
};
var serverFunction_1$11 = registerServerReference("943a915d-0", async () => {
	await requireOwner();
	const families = await db.family.findMany({
		include: {
			children: { orderBy: { firstName: "asc" } },
			familyMembers: {
				where: { relationship: "PARENT" },
				select: {
					firstName: true,
					lastName: true,
					relationship: true
				}
			},
			_count: { select: { children: true } }
		},
		orderBy: { familyName: "asc" }
	});
	const unpaidSessions = await db.careSession.findMany({
		where: {
			isConfirmed: true,
			status: { in: ["SCHEDULED", "COMPLETED"] },
			payments: { none: { status: "PAID" } }
		},
		select: {
			familyId: true,
			scheduledStart: true,
			scheduledEnd: true,
			hourlyRate: true
		}
	});
	const owedByFamily = /* @__PURE__ */ new Map();
	for (const session of unpaidSessions) {
		const hours = calculateHours(new Date(session.scheduledStart), new Date(session.scheduledEnd));
		const sessionCost = calculateSessionCost(hours, session.hourlyRate);
		const existing = owedByFamily.get(session.familyId) ?? {
			total: sumMoney([]),
			count: 0
		};
		owedByFamily.set(session.familyId, {
			total: existing.total.plus(sessionCost),
			count: existing.count + 1
		});
	}
	const familiesWithAmountOwed = families.map((family) => ({
		...family,
		amountOwed: roundMoney(owedByFamily.get(family.id)?.total ?? 0),
		unpaidSessionCount: owedByFamily.get(family.id)?.count ?? 0
	}));
	return serializeMoneyDeep(familiesWithAmountOwed);
});
var getFamilies = query(createServerReference(serverFunction_1$11), "families");
var serverFunction_2$11 = registerServerReference("943a915d-1", async (id) => {
	await requireFamilyAccess(id);
	const family = await db.family.findUnique({
		where: { id },
		include: {
			children: { orderBy: { firstName: "asc" } },
			familyMembers: {
				where: { relationship: "PARENT" },
				select: {
					firstName: true,
					lastName: true,
					relationship: true
				}
			},
			careSchedules: {
				include: {
					children: { select: {
						id: true,
						firstName: true,
						lastName: true
					} },
					service: { select: {
						id: true,
						name: true,
						code: true
					} },
					_count: { select: { careSessions: true } }
				},
				orderBy: { startDate: "desc" }
			},
			careSessions: {
				include: { children: true },
				orderBy: { scheduledStart: "desc" },
				take: 10
			},
			payments: {
				orderBy: { createdAt: "desc" },
				take: 10
			},
			services: { include: { service: { select: {
				id: true,
				name: true,
				code: true,
				defaultHourlyRate: true,
				pricingType: true,
				requiresChildren: true
			} } } }
		}
	});
	if (!family) throw new Error("Family not found");
	return serializeMoneyDeep(family);
});
var getFamily = query(createServerReference(serverFunction_2$11), "family");
var serverFunction_3$11 = registerServerReference("943a915d-2", async (formData) => {
	await requireOwner();
	try {
		const familyName = String(formData.get("familyName"));
		const parentFirstName = String(formData.get("parentFirstName"));
		const parentLastName = String(formData.get("parentLastName"));
		const email = String(formData.get("email"));
		const phone = String(formData.get("phone") || "");
		const address = String(formData.get("address") || "");
		const city = String(formData.get("city") || "");
		const state = String(formData.get("state") || "");
		const zipCode = String(formData.get("zipCode") || "");
		const emergencyContact = String(formData.get("emergencyContact") || "");
		const emergencyPhone = String(formData.get("emergencyPhone") || "");
		const notes = String(formData.get("notes") || "");
		const spouseFirstName = String(formData.get("spouseFirstName") || "");
		const spouseLastName = String(formData.get("spouseLastName") || "");
		const spouseEmail = String(formData.get("spouseEmail") || "");
		const spousePhone = String(formData.get("spousePhone") || "");
		const children = [];
		let childIndex = 0;
		while (true) {
			const firstName = String(formData.get(`childFirstName_${childIndex}`) || "");
			const lastName = String(formData.get(`childLastName_${childIndex}`) || "");
			const dateOfBirth = String(formData.get(`childDateOfBirth_${childIndex}`) || "");
			const gender = String(formData.get(`childGender_${childIndex}`) || "");
			if (!firstName && !lastName && !dateOfBirth) break;
			if (firstName && lastName && dateOfBirth) children.push({
				firstName,
				lastName,
				dateOfBirth,
				gender
			});
			childIndex++;
		}
		const selectedServiceIds = formData.getAll("serviceIds");
		if (!familyName) return /* @__PURE__ */ new Error("Family name is required");
		if (!parentFirstName || !parentLastName) return /* @__PURE__ */ new Error("Parent first and last name are required");
		if (!email) return /* @__PURE__ */ new Error("Email is required");
		const family = await db.family.create({ data: {
			familyName,
			parentFirstName,
			parentLastName,
			email,
			phone: phone || null,
			address: address || null,
			city: city || null,
			state: state || null,
			zipCode: zipCode || null,
			emergencyContact: emergencyContact || null,
			emergencyPhone: emergencyPhone || null,
			notes: notes || null,
			services: { create: selectedServiceIds.map((serviceId) => ({ serviceId })) }
		} });
		if (spouseFirstName && spouseLastName) await db.familyMember.create({ data: {
			familyId: family.id,
			firstName: spouseFirstName,
			lastName: spouseLastName,
			relationship: "PARENT",
			email: spouseEmail || null,
			phone: spousePhone || null,
			canPickup: true
		} });
		for (const child of children) await db.child.create({ data: {
			familyId: family.id,
			firstName: child.firstName,
			lastName: child.lastName,
			dateOfBirth: new Date(child.dateOfBirth),
			gender: child.gender || null
		} });
		return serverRedirect(`/families/${family.id}`);
	} catch (err) {
		console.error("Error creating family:", err);
		return new Error(err instanceof Error ? err.message : "Failed to create family");
	}
});
var createFamily = action$1(createServerReference(serverFunction_3$11));
var serverFunction_4$8 = registerServerReference("943a915d-3", async (formData) => {
	await requireOwner();
	try {
		const id = String(formData.get("id"));
		const familyName = String(formData.get("familyName"));
		const parentFirstName = String(formData.get("parentFirstName"));
		const parentLastName = String(formData.get("parentLastName"));
		const email = String(formData.get("email"));
		const phone = String(formData.get("phone") || "");
		const address = String(formData.get("address") || "");
		const city = String(formData.get("city") || "");
		const state = String(formData.get("state") || "");
		const zipCode = String(formData.get("zipCode") || "");
		const emergencyContact = String(formData.get("emergencyContact") || "");
		const emergencyPhone = String(formData.get("emergencyPhone") || "");
		const notes = String(formData.get("notes") || "");
		const selectedServiceIds = formData.getAll("serviceIds");
		if (!familyName) return /* @__PURE__ */ new Error("Family name is required");
		if (!parentFirstName || !parentLastName) return /* @__PURE__ */ new Error("Parent first and last name are required");
		if (!email) return /* @__PURE__ */ new Error("Email is required");
		await db.family.update({
			where: { id },
			data: {
				familyName,
				parentFirstName,
				parentLastName,
				email,
				phone: phone || null,
				address: address || null,
				city: city || null,
				state: state || null,
				zipCode: zipCode || null,
				emergencyContact: emergencyContact || null,
				emergencyPhone: emergencyPhone || null,
				notes: notes || null,
				services: {
					deleteMany: {},
					create: selectedServiceIds.map((serviceId) => ({ serviceId }))
				}
			}
		});
		return serverRedirect(`/families/${id}`);
	} catch (err) {
		console.error("Error updating family:", err);
		return new Error(err instanceof Error ? err.message : "Failed to update family");
	}
});
var updateFamily = action$1(createServerReference(serverFunction_4$8));
var serverFunction_5$8 = registerServerReference("943a915d-4", async (id) => {
	await requireOwner();
	try {
		await cascadeSoftDeleteFamily(id);
		return reload();
	} catch (err) {
		console.error("Error deleting family:", err);
		return new Error(err instanceof Error ? err.message : "Failed to delete family");
	}
});
action$1(createServerReference(serverFunction_5$8));
//#endregion
//#region src/lib/stats.ts
var serverFunction_1$10 = registerServerReference("8847209d-0", async (period) => {
	await requireOwner();
	const now = /* @__PURE__ */ new Date();
	let startDate;
	let endDate = new Date(now);
	endDate.setHours(23, 59, 59, 999);
	switch (period) {
		case "lastWeek": {
			const lastWeekStart = new Date(now);
			lastWeekStart.setDate(now.getDate() - now.getDay() - 6);
			lastWeekStart.setHours(0, 0, 0, 0);
			startDate = lastWeekStart;
			const lastWeekEnd = new Date(lastWeekStart);
			lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
			endDate = lastWeekEnd;
			endDate.setHours(23, 59, 59, 999);
			break;
		}
		case "thisWeek": {
			const thisWeekStart = new Date(now);
			thisWeekStart.setDate(now.getDate() - now.getDay() + 1);
			thisWeekStart.setHours(0, 0, 0, 0);
			startDate = thisWeekStart;
			const thisWeekEnd = new Date(thisWeekStart);
			thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
			endDate = thisWeekEnd;
			endDate.setHours(23, 59, 59, 999);
			break;
		}
		case "month":
			startDate = new Date(now.getFullYear(), now.getMonth(), 1);
			startDate.setHours(0, 0, 0, 0);
			endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
			break;
		case "ytd":
			startDate = new Date(now.getFullYear(), 0, 1);
			startDate.setHours(0, 0, 0, 0);
	}
	const sessions = await db.careSession.findMany({
		where: {
			scheduledStart: {
				gte: startDate,
				lte: endDate
			},
			status: { in: ["COMPLETED", "IN_PROGRESS"] }
		},
		include: { expenses: { select: { amount: true } } }
	});
	const hours = sessions.reduce((total, session) => {
		return total + calculateHours(new Date(session.scheduledStart), new Date(session.scheduledEnd));
	}, 0);
	const moneyAmounts = [];
	for (const session of sessions) {
		const sessionHours = calculateHours(new Date(session.scheduledStart), new Date(session.scheduledEnd));
		const rate = session.hourlyRate || 0;
		const sessionAmount = calculateSessionCost(sessionHours, rate);
		moneyAmounts.push(sessionAmount);
		const expenses = session.expenses || [];
		const expenseTotal = sumMoney(expenses.map((exp) => exp.amount));
		if (isPositiveMoney(expenseTotal)) moneyAmounts.push(expenseTotal);
	}
	return {
		hours,
		money: roundMoney(sumMoney(moneyAmounts)),
		period
	};
});
var getStatsForPeriod = query(createServerReference(serverFunction_1$10), "stats-for-period");
var serverFunction_2$10 = registerServerReference("8847209d-1", async () => {
	await requireOwner();
	const now = /* @__PURE__ */ new Date();
	const thisWeekStart = new Date(now);
	thisWeekStart.setDate(now.getDate() - now.getDay() + 1);
	thisWeekStart.setHours(0, 0, 0, 0);
	const thisWeekEnd = new Date(thisWeekStart);
	thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
	thisWeekEnd.setHours(23, 59, 59, 999);
	const lastWeekStart = new Date(thisWeekStart);
	lastWeekStart.setDate(thisWeekStart.getDate() - 7);
	const lastWeekEnd = new Date(thisWeekEnd);
	lastWeekEnd.setDate(thisWeekEnd.getDate() - 7);
	const thisWeekSessions = await db.careSession.findMany({
		where: {
			scheduledStart: {
				gte: thisWeekStart,
				lte: thisWeekEnd
			},
			status: { in: ["COMPLETED", "IN_PROGRESS"] }
		},
		include: { expenses: { select: { amount: true } } }
	});
	const lastWeekSessions = await db.careSession.findMany({
		where: {
			scheduledStart: {
				gte: lastWeekStart,
				lte: lastWeekEnd
			},
			status: { in: ["COMPLETED", "IN_PROGRESS"] }
		},
		include: { expenses: { select: { amount: true } } }
	});
	const calculateHours$1 = (sessions) => {
		return sessions.reduce((total, session) => {
			return total + calculateHours(new Date(session.scheduledStart), new Date(session.scheduledEnd));
		}, 0);
	};
	const calculateMoney = (sessions) => {
		const moneyAmounts = [];
		for (const session of sessions) {
			const hours = calculateHours(new Date(session.scheduledStart), new Date(session.scheduledEnd));
			const rate = session.hourlyRate || 0;
			const sessionAmount = calculateSessionCost(hours, rate);
			moneyAmounts.push(sessionAmount);
			const expenses = session.expenses || [];
			const expenseTotal = sumMoney(expenses.map((exp) => exp.amount));
			if (isPositiveMoney(expenseTotal)) moneyAmounts.push(expenseTotal);
		}
		return roundMoney(sumMoney(moneyAmounts));
	};
	const thisWeekHours = calculateHours$1(thisWeekSessions);
	const lastWeekHours = calculateHours$1(lastWeekSessions);
	const thisWeekMoney = calculateMoney(thisWeekSessions);
	const lastWeekMoney = calculateMoney(lastWeekSessions);
	return {
		thisWeek: {
			hours: thisWeekHours,
			money: thisWeekMoney
		},
		lastWeek: {
			hours: lastWeekHours,
			money: lastWeekMoney
		}
	};
});
var getWeeklyStats = query(createServerReference(serverFunction_2$10), "weekly-stats");
var serverFunction_3$10 = registerServerReference("8847209d-2", async () => {
	await requireOwner();
	const now = /* @__PURE__ */ new Date();
	const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
	const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
	const activeFamiliesCount = await db.family.count({ where: { careSessions: { some: { scheduledStart: { gte: thisMonthStart } } } } });
	const upcomingDate = /* @__PURE__ */ new Date();
	upcomingDate.setDate(upcomingDate.getDate() + 7);
	const upcomingSessionsCount = await db.careSession.count({ where: {
		scheduledStart: {
			gte: now,
			lte: upcomingDate
		},
		status: { not: "CANCELLED" }
	} });
	const unpaidSessionsCount = await db.careSession.count({ where: {
		isConfirmed: true,
		status: { in: ["SCHEDULED", "COMPLETED"] },
		payments: { none: { status: "PAID" } }
	} });
	const thisMonthSessions = await db.careSession.findMany({ where: {
		scheduledStart: {
			gte: thisMonthStart,
			lte: thisMonthEnd
		},
		status: { in: ["COMPLETED", "IN_PROGRESS"] }
	} });
	const thisMonthHours = thisMonthSessions.reduce((total, session) => {
		return total + calculateHours(new Date(session.scheduledStart), new Date(session.scheduledEnd));
	}, 0);
	const thisMonthSessionsWithExpenses = await db.careSession.findMany({
		where: {
			scheduledStart: {
				gte: thisMonthStart,
				lte: thisMonthEnd
			},
			status: { in: ["COMPLETED", "IN_PROGRESS"] }
		},
		include: { expenses: { select: { amount: true } } }
	});
	const thisMonthMoneyAmounts = [];
	for (const session of thisMonthSessionsWithExpenses) {
		const hours = calculateHours(new Date(session.scheduledStart), new Date(session.scheduledEnd));
		const rate = session.hourlyRate || 0;
		const sessionAmount = calculateSessionCost(hours, rate);
		thisMonthMoneyAmounts.push(sessionAmount);
		const expenses = session.expenses || [];
		const expenseTotal = sumMoney(expenses.map((exp) => exp.amount));
		if (isPositiveMoney(expenseTotal)) thisMonthMoneyAmounts.push(expenseTotal);
	}
	const thisMonthMoney = roundMoney(sumMoney(thisMonthMoneyAmounts));
	const sessionsWithRates = thisMonthSessions.filter((s) => isPositiveMoney(s.hourlyRate));
	return {
		activeFamilies: activeFamiliesCount,
		upcomingSessions: upcomingSessionsCount,
		unpaidSessions: unpaidSessionsCount,
		thisMonthHours,
		thisMonthMoney,
		averageHourlyRate: sessionsWithRates.length > 0 ? toDecimal(sumMoney(sessionsWithRates.map((s) => s.hourlyRate)).dividedBy(sessionsWithRates.length)).toNumber() : 0
	};
});
var getDashboardStats = query(createServerReference(serverFunction_3$10), "dashboard-stats");
//#endregion
//#region src/routes/index.tsx?pick=route&lang.tsx
var route$22 = {
	preload() {
		getUser();
		getUpcomingSessions(10);
		getRecentReports(10);
		getFamilies();
		getWeeklyStats();
		getDashboardStats();
		getStatsForPeriod("thisWeek");
		getStatsForPeriod("lastWeek");
		const today = /* @__PURE__ */ new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		getSessionsForDay(yesterday);
		getSessionsForDay(today);
		getSessionsForDay(tomorrow);
	},
	info: { ssr: false }
};
//#endregion
//#region src/routes/children/index.tsx?pick=route&lang.tsx
var route$21 = { preload() {
	throw serverRedirect("/families");
} };
//#endregion
//#region src/lib/expenses.ts
var serverFunction_1$9 = registerServerReference("7a48fd69-0", async (sessionId) => {
	await requireOwner();
	await requireSessionFamilyAccess(sessionId);
	const expenses = await db.sessionExpense.findMany({
		where: { sessionId },
		orderBy: { createdAt: "desc" }
	});
	return serializeMoneyDeep(expenses);
});
var getSessionExpenses = query(createServerReference(serverFunction_1$9), "session-expenses");
var serverFunction_2$9 = registerServerReference("7a48fd69-1", async (formData) => {
	await requireOwner();
	try {
		const sessionId = String(formData.get("sessionId"));
		const description = String(formData.get("description"));
		const amount = String(formData.get("amount"));
		const category = String(formData.get("category") || "");
		const notes = String(formData.get("notes") || "");
		if (!sessionId || !description || !amount) return /* @__PURE__ */ new Error("Session ID, description, and amount are required");
		await requireSessionFamilyAccess(sessionId);
		return {
			success: true,
			expense: await db.sessionExpense.create({ data: {
				sessionId,
				description,
				amount: parseMoney(amount),
				category: category || null,
				notes: notes || null
			} })
		};
	} catch (err) {
		console.error("Error creating expense:", err);
		return new Error(err instanceof Error ? err.message : "Failed to create expense");
	}
});
var createExpense = action$1(createServerReference(serverFunction_2$9));
var serverFunction_3$9 = registerServerReference("7a48fd69-2", async (formData) => {
	await requireOwner();
	try {
		const id = String(formData.get("id"));
		const description = String(formData.get("description"));
		const amount = String(formData.get("amount"));
		const category = String(formData.get("category") || "");
		const notes = String(formData.get("notes") || "");
		if (!description || !amount) return /* @__PURE__ */ new Error("Description and amount are required");
		const existing = await db.sessionExpense.findUnique({
			where: { id },
			select: { sessionId: true }
		});
		if (!existing) return /* @__PURE__ */ new Error("Expense not found");
		await requireSessionFamilyAccess(existing.sessionId);
		await db.sessionExpense.update({
			where: { id },
			data: {
				description,
				amount: parseMoney(amount),
				category: category || null,
				notes: notes || null
			}
		});
		return { success: true };
	} catch (err) {
		console.error("Error updating expense:", err);
		return new Error(err instanceof Error ? err.message : "Failed to update expense");
	}
});
var updateExpense = action$1(createServerReference(serverFunction_3$9));
var serverFunction_4$7 = registerServerReference("7a48fd69-3", async (formData) => {
	await requireOwner();
	try {
		const id = String(formData.get("id"));
		const existing = await db.sessionExpense.findUnique({
			where: { id },
			select: { sessionId: true }
		});
		if (!existing) return /* @__PURE__ */ new Error("Expense not found");
		await requireSessionFamilyAccess(existing.sessionId);
		await db.sessionExpense.delete({ where: { id } });
		return { success: true };
	} catch (err) {
		console.error("Error deleting expense:", err);
		return new Error(err instanceof Error ? err.message : "Failed to delete expense");
	}
});
var deleteExpense = action$1(createServerReference(serverFunction_4$7));
var serverFunction_5$7 = registerServerReference("7a48fd69-4", async (sessionId) => {
	await requireOwner();
	await requireSessionFamilyAccess(sessionId);
	const expenses = await db.sessionExpense.findMany({
		where: { sessionId },
		select: { amount: true }
	});
	return roundMoney(sumMoney(expenses.map((expense) => expense.amount)));
});
var getSessionExpenseTotal = query(createServerReference(serverFunction_5$7), "session-expense-total");
var serverFunction_6$7 = registerServerReference("7a48fd69-5", async (familyId) => {
	await requireOwner();
	if (familyId) await assertFamilyExists(familyId);
	const expenses = await db.expense.findMany({
		where: familyId ? { familyId } : {},
		include: { family: { select: {
			id: true,
			familyName: true
		} } },
		orderBy: { expenseDate: "desc" }
	});
	return serializeMoneyDeep(expenses);
});
var getExpenses = query(createServerReference(serverFunction_6$7), "expenses");
var serverFunction_7$5 = registerServerReference("7a48fd69-6", async (startDate, endDate, familyId) => {
	await requireOwner();
	if (familyId) await assertFamilyExists(familyId);
	const expenses = await db.expense.findMany({
		where: {
			expenseDate: {
				gte: startDate,
				lte: endDate
			},
			...familyId ? { familyId } : {}
		},
		include: { family: { select: {
			id: true,
			familyName: true
		} } },
		orderBy: { expenseDate: "desc" }
	});
	return serializeMoneyDeep(expenses);
});
query(createServerReference(serverFunction_7$5), "expenses-by-date-range");
var serverFunction_8$1 = registerServerReference("7a48fd69-7", async (formData) => {
	await requireOwner();
	try {
		const description = String(formData.get("description"));
		const amount = String(formData.get("amount"));
		const category = String(formData.get("category") || "");
		const expenseDate = String(formData.get("expenseDate") || "");
		const familyId = String(formData.get("familyId") || "");
		const notes = String(formData.get("notes") || "");
		if (!description || !amount) return /* @__PURE__ */ new Error("Description and amount are required");
		if (familyId) await assertFamilyExists(familyId);
		await db.expense.create({ data: {
			description,
			amount: parseMoney(amount),
			category: category || null,
			expenseDate: expenseDate ? parseFormDate(expenseDate) : /* @__PURE__ */ new Date(),
			familyId: familyId || null,
			notes: notes || null
		} });
		return reload();
	} catch (err) {
		console.error("Error creating expense:", err);
		return new Error(err instanceof Error ? err.message : "Failed to create expense");
	}
});
var createStandaloneExpense = action$1(createServerReference(serverFunction_8$1));
var serverFunction_9 = registerServerReference("7a48fd69-8", async (formData) => {
	await requireOwner();
	try {
		const id = String(formData.get("id"));
		const description = String(formData.get("description"));
		const amount = String(formData.get("amount"));
		const category = String(formData.get("category") || "");
		const expenseDate = String(formData.get("expenseDate") || "");
		const familyId = String(formData.get("familyId") || "");
		const notes = String(formData.get("notes") || "");
		if (!id || !description || !amount) return /* @__PURE__ */ new Error("ID, description, and amount are required");
		await db.expense.update({
			where: { id },
			data: {
				description,
				amount: parseMoney(amount),
				category: category || null,
				expenseDate: expenseDate ? parseFormDate(expenseDate) : /* @__PURE__ */ new Date(),
				familyId: familyId || null,
				notes: notes || null
			}
		});
		return reload();
	} catch (err) {
		console.error("Error updating expense:", err);
		return new Error(err instanceof Error ? err.message : "Failed to update expense");
	}
});
var updateStandaloneExpense = action$1(createServerReference(serverFunction_9));
var serverFunction_10 = registerServerReference("7a48fd69-9", async (formData) => {
	await requireOwner();
	try {
		const id = String(formData.get("id"));
		if (!id) return /* @__PURE__ */ new Error("Expense ID is required");
		await db.expense.delete({ where: { id } });
		return reload();
	} catch (err) {
		console.error("Error deleting expense:", err);
		return new Error(err instanceof Error ? err.message : "Failed to delete expense");
	}
});
action$1(createServerReference(serverFunction_10));
//#endregion
//#region src/routes/expenses/index.tsx?pick=route&lang.tsx
var route$20 = { preload() {
	getFamilies();
	getExpenses();
} };
//#endregion
//#region src/lib/children.ts
var serverFunction_1$8 = registerServerReference("b12af1cb-0", async (familyId) => {
	await requireOwner();
	await assertFamilyExists(familyId);
	return await db.child.findMany({
		where: { familyId },
		orderBy: { firstName: "asc" }
	});
});
var getChildren = query(createServerReference(serverFunction_1$8), "children");
var serverFunction_2$8 = registerServerReference("b12af1cb-1", async (id) => {
	await requireOwner();
	await requireChildAccess(id);
	const child = await db.child.findUnique({
		where: { id },
		include: {
			family: true,
			careSessions: {
				orderBy: { scheduledStart: "desc" },
				take: 10
			}
		}
	});
	if (!child) throw new Error("Child not found");
	return child;
});
var getChild = query(createServerReference(serverFunction_2$8), "child");
var serverFunction_3$8 = registerServerReference("b12af1cb-2", async () => {
	await requireOwner();
	return await db.child.findMany({
		include: { family: { select: {
			id: true,
			familyName: true
		} } },
		orderBy: { firstName: "asc" }
	});
});
var getAllChildren = query(createServerReference(serverFunction_3$8), "all-children");
var serverFunction_4$6 = registerServerReference("b12af1cb-3", async (formData) => {
	await requireOwner();
	try {
		const familyId = String(formData.get("familyId"));
		const firstName = String(formData.get("firstName"));
		const lastName = String(formData.get("lastName"));
		const dateOfBirth = String(formData.get("dateOfBirth"));
		const gender = String(formData.get("gender") || "");
		const allergies = String(formData.get("allergies") || "");
		const medications = String(formData.get("medications") || "");
		const specialNeeds = String(formData.get("specialNeeds") || "");
		const schoolName = String(formData.get("schoolName") || "");
		const schoolGrade = String(formData.get("schoolGrade") || "");
		const schoolTeacher = String(formData.get("schoolTeacher") || "");
		const notes = String(formData.get("notes") || "");
		if (!firstName || !lastName) return /* @__PURE__ */ new Error("First and last name are required");
		if (!dateOfBirth) return /* @__PURE__ */ new Error("Date of birth is required");
		await assertFamilyExists(familyId);
		await db.child.create({ data: {
			familyId,
			firstName,
			lastName,
			dateOfBirth: new Date(dateOfBirth),
			gender: gender || null,
			allergies: allergies || null,
			medications: medications || null,
			specialNeeds: specialNeeds || null,
			schoolName: schoolName || null,
			schoolGrade: schoolGrade || null,
			schoolTeacher: schoolTeacher || null,
			notes: notes || null
		} });
		return serverRedirect(`/families/${familyId}`);
	} catch (err) {
		console.error("Error creating child:", err);
		return new Error(err instanceof Error ? err.message : "Failed to create child");
	}
});
var createChild = action$1(createServerReference(serverFunction_4$6));
var serverFunction_5$6 = registerServerReference("b12af1cb-4", async (formData) => {
	await requireOwner();
	try {
		const id = String(formData.get("id"));
		const familyId = String(formData.get("familyId"));
		const firstName = String(formData.get("firstName"));
		const lastName = String(formData.get("lastName"));
		const dateOfBirth = String(formData.get("dateOfBirth"));
		const gender = String(formData.get("gender") || "");
		const allergies = String(formData.get("allergies") || "");
		const medications = String(formData.get("medications") || "");
		const specialNeeds = String(formData.get("specialNeeds") || "");
		const schoolName = String(formData.get("schoolName") || "");
		const schoolGrade = String(formData.get("schoolGrade") || "");
		const schoolTeacher = String(formData.get("schoolTeacher") || "");
		const notes = String(formData.get("notes") || "");
		if (!firstName || !lastName) return /* @__PURE__ */ new Error("First and last name are required");
		if (!dateOfBirth) return /* @__PURE__ */ new Error("Date of birth is required");
		await assertChildInFamily(id, familyId);
		await db.child.update({
			where: { id },
			data: {
				firstName,
				lastName,
				dateOfBirth: new Date(dateOfBirth),
				gender: gender || null,
				allergies: allergies || null,
				medications: medications || null,
				specialNeeds: specialNeeds || null,
				schoolName: schoolName || null,
				schoolGrade: schoolGrade || null,
				schoolTeacher: schoolTeacher || null,
				notes: notes || null
			}
		});
		return serverRedirect(`/families/${familyId}`);
	} catch (err) {
		console.error("Error updating child:", err);
		return new Error(err instanceof Error ? err.message : "Failed to update child");
	}
});
var updateChild = action$1(createServerReference(serverFunction_5$6));
var serverFunction_6$6 = registerServerReference("b12af1cb-5", async (id) => {
	await requireOwner();
	try {
		await requireChildAccess(id);
		await db.child.delete({ where: { id } });
		return reload();
	} catch (err) {
		console.error("Error deleting child:", err);
		return new Error(err instanceof Error ? err.message : "Failed to delete child");
	}
});
action$1(createServerReference(serverFunction_6$6));
//#endregion
//#region src/routes/families/index.tsx?pick=route&lang.tsx
var route$19 = { preload() {
	getFamilies();
	getAllChildren();
} };
//#endregion
//#region src/lib/payments.ts
var serverFunction_1$7 = registerServerReference("1d0bf669-0", async (familyId) => {
	await requireOwner();
	await assertFamilyExists(familyId);
	console.log("[getUnpaidSessions] ========== START ==========");
	console.log("[getUnpaidSessions] familyId:", familyId);
	const allSessions = await db.careSession.findMany({
		where: {
			familyId,
			isConfirmed: true,
			status: { in: [
				"SCHEDULED",
				"IN_PROGRESS",
				"COMPLETED"
			] }
		},
		include: {
			service: { select: {
				id: true,
				name: true,
				code: true
			} },
			children: true,
			expenses: { select: { amount: true } },
			payments: { where: { status: "PAID" } }
		},
		orderBy: { scheduledStart: "asc" }
	});
	console.log("[getUnpaidSessions] allSessions count:", allSessions.length);
	allSessions.forEach((s, i) => {
		console.log(`[getUnpaidSessions] Session ${i}:`, {
			id: s.id,
			status: s.status,
			isConfirmed: s.isConfirmed,
			scheduledStart: s.scheduledStart,
			paymentsCount: s.payments.length
		});
	});
	const unpaidSessions = allSessions.filter((session) => session.payments.length === 0);
	console.log("[getUnpaidSessions] unpaidSessions count:", unpaidSessions.length);
	console.log("[getUnpaidSessions] ========== END ==========");
	return serializeMoneyDeep(unpaidSessions);
});
var getUnpaidSessions = query(createServerReference(serverFunction_1$7), "unpaidSessions");
var serverFunction_2$7 = registerServerReference("1d0bf669-1", async (formData) => {
	await requireOwner();
	try {
		const familyId = String(formData.get("familyId"));
		const sessionIds = formData.getAll("sessionIds");
		const tips = String(formData.get("tips") || "0");
		const method = String(formData.get("method") || "");
		const notes = String(formData.get("notes") || "");
		const paidDate = String(formData.get("paidDate") || (/* @__PURE__ */ new Date()).toISOString());
		if (!familyId) return /* @__PURE__ */ new Error("Family is required");
		await assertFamilyExists(familyId);
		if (sessionIds.length === 0) return /* @__PURE__ */ new Error("Please select at least one session");
		const sessions = await db.careSession.findMany({
			where: {
				id: { in: sessionIds },
				familyId
			},
			include: { children: true }
		});
		if (sessions.length === 0) return /* @__PURE__ */ new Error("No sessions found");
		const sessionAmounts = [];
		for (const session of sessions) {
			const hours = calculateHours(new Date(session.scheduledStart), new Date(session.scheduledEnd));
			const sessionCost = calculateSessionCost(hours, session.hourlyRate);
			sessionAmounts.push(sessionCost);
			const expenses = await db.sessionExpense.findMany({
				where: { sessionId: session.id },
				select: { amount: true }
			});
			sessionAmounts.push(sumMoney(expenses.map((exp) => exp.amount)));
		}
		const tipsAmount = parseMoney(tips);
		if (isPositiveMoney(tipsAmount)) sessionAmounts.push(tipsAmount);
		const totalAmount = sumMoney(sessionAmounts);
		if (!isPositiveMoney(totalAmount)) return /* @__PURE__ */ new Error("Total amount must be greater than 0");
		const today = /* @__PURE__ */ new Date();
		const baseInvoiceNumber = `INV-${today.toISOString().split("T")[0].replace(/-/g, "")}-${Math.floor(Math.random() * 1e3).toString().padStart(3, "0")}`;
		let sessionIndex = 0;
		for (const sessionId of sessionIds) {
			const session = sessions.find((s) => s.id === sessionId);
			if (session) {
				const hours = calculateHours(new Date(session.scheduledStart), new Date(session.scheduledEnd));
				const sessionAmount = calculateSessionCost(hours, session.hourlyRate);
				const expenses = await db.sessionExpense.findMany({
					where: { sessionId },
					select: { amount: true }
				});
				const totalSessionAmount = addMoney(sessionAmount, sumMoney(expenses.map((exp) => exp.amount)));
				await db.payment.create({ data: {
					familyId,
					careSessionId: sessionId,
					amount: totalSessionAmount,
					status: "PAID",
					paidDate: new Date(paidDate),
					method: method || null,
					notes: notes || null,
					invoiceNumber: `${baseInvoiceNumber}-${(sessionIndex + 1).toString().padStart(2, "0")}`,
					taxYear: today.getFullYear()
				} });
				sessionIndex++;
			}
		}
		if (isPositiveMoney(tipsAmount)) await db.payment.create({ data: {
			familyId,
			amount: tipsAmount,
			status: "PAID",
			paidDate: new Date(paidDate),
			method: method || null,
			notes: `Tips/Bonus${notes ? ` - ${notes}` : ""}`,
			invoiceNumber: `${baseInvoiceNumber}-TIPS`,
			taxYear: today.getFullYear()
		} });
		return serverRedirect(`/payments?success=true`);
	} catch (err) {
		console.error("Error creating payment:", err);
		return new Error(err instanceof Error ? err.message : "Failed to create payment");
	}
});
var createPayment = action$1(createServerReference(serverFunction_2$7));
var serverFunction_3$7 = registerServerReference("1d0bf669-2", async (year) => {
	await requireOwner();
	const where = {};
	if (year) {
		const startOfYear = new Date(year, 0, 1);
		const endOfYear = new Date(year, 11, 31, 23, 59, 59);
		where.OR = [{ paidDate: {
			gte: startOfYear,
			lte: endOfYear
		} }, {
			paidDate: null,
			createdAt: {
				gte: startOfYear,
				lte: endOfYear
			}
		}];
	}
	const payments = await db.payment.findMany({
		where,
		include: {
			family: { select: {
				id: true,
				familyName: true
			} },
			careSession: { select: {
				id: true,
				scheduledStart: true,
				scheduledEnd: true
			} }
		},
		orderBy: { createdAt: "desc" }
	});
	return serializeMoneyDeep(payments);
});
var getPayments = query(createServerReference(serverFunction_3$7), "payments");
//#endregion
//#region src/routes/payments/index.tsx?pick=route&lang.tsx
var route$18 = { preload() {
	getFamilies();
	getPayments((/* @__PURE__ */ new Date()).getFullYear());
} };
//#endregion
//#region src/lib/route-guards.ts
var serverFunction_1$6 = registerServerReference("6896560-0", async () => {
	await requireOwner();
});
/** Route preload guard: owner only. Redirects parents to /portal. */
var ensureOwner = query(createServerReference(serverFunction_1$6), "ensure-owner");
var serverFunction_2$6 = registerServerReference("6896560-1", async () => {
	await requireUser();
});
query(createServerReference(serverFunction_2$6), "ensure-auth");
var serverFunction_3$6 = registerServerReference("6896560-2", async () => {
	await requireParent();
});
/** Route preload guard: parent portal users only. Redirects owners to /. */
var ensureParent = query(createServerReference(serverFunction_3$6), "ensure-parent");
//#endregion
//#region src/lib/portal.ts
var serverFunction_1$5 = registerServerReference("83d26547-0", async () => {
	const user = await requireParent();
	const family = await db.family.findUnique({
		where: { id: user.familyId },
		include: { children: { orderBy: { firstName: "asc" } } }
	});
	if (!family) throw new Error("Family not found");
	return family;
});
var getMyFamily = query(createServerReference(serverFunction_1$5), "portal-family");
var serverFunction_2$5 = registerServerReference("83d26547-1", async () => {
	const user = await requireParent();
	const now = /* @__PURE__ */ new Date();
	const sessions = await db.careSession.findMany({
		where: {
			familyId: user.familyId,
			scheduledStart: { gte: now },
			status: { not: "CANCELLED" }
		},
		include: {
			service: { select: { name: true } },
			children: { select: {
				id: true,
				firstName: true,
				lastName: true
			} }
		},
		orderBy: { scheduledStart: "asc" },
		take: 10
	});
	return serializeMoneyDeep(sessions);
});
var getMyUpcomingSessions = query(createServerReference(serverFunction_2$5), "portal-upcoming-sessions");
var serverFunction_3$5 = registerServerReference("83d26547-2", async () => {
	const user = await requireParent();
	return db.child.findMany({
		where: { familyId: user.familyId },
		orderBy: { firstName: "asc" }
	});
});
query(createServerReference(serverFunction_3$5), "portal-children");
var serverFunction_4$5 = registerServerReference("83d26547-3", async (limit = 20) => {
	const user = await requireParent();
	const childIds = (await db.child.findMany({
		where: { familyId: user.familyId },
		select: { id: true }
	})).map((child) => child.id);
	if (childIds.length === 0) return [];
	return db.sessionReport.findMany({
		where: { childId: { in: childIds } },
		include: {
			child: { select: {
				id: true,
				firstName: true,
				lastName: true
			} },
			careSession: { select: {
				id: true,
				scheduledStart: true,
				breakfastCount: true,
				morningSnackCount: true,
				lunchCount: true,
				afternoonSnackCount: true,
				dinnerCount: true
			} }
		},
		orderBy: { timestamp: "desc" },
		take: limit
	});
});
var getMyChildReports = query(createServerReference(serverFunction_4$5), "portal-child-reports");
var serverFunction_5$5 = registerServerReference("83d26547-4", async (date) => {
	const user = await requireParent();
	const day = date ?? /* @__PURE__ */ new Date();
	const start = new Date(day);
	start.setHours(0, 0, 0, 0);
	const end = new Date(day);
	end.setHours(23, 59, 59, 999);
	await sendDailySummary(user.familyId, start);
	return (await db.careSession.findMany({
		where: {
			familyId: user.familyId,
			scheduledStart: {
				gte: start,
				lte: end
			},
			status: { not: "CANCELLED" }
		},
		include: {
			children: { select: {
				firstName: true,
				lastName: true
			} },
			reports: { include: { child: { select: {
				firstName: true,
				lastName: true
			} } } }
		},
		orderBy: { scheduledStart: "asc" }
	})).map((session) => ({
		id: session.id,
		scheduledStart: session.scheduledStart,
		scheduledEnd: session.scheduledEnd,
		hours: calculateHours(session.scheduledStart, session.scheduledEnd),
		children: session.children,
		mealCounts: {
			breakfast: session.breakfastCount,
			morningSnack: session.morningSnackCount,
			lunch: session.lunchCount,
			afternoonSnack: session.afternoonSnackCount,
			dinner: session.dinnerCount
		},
		reports: session.reports
	}));
});
var getMyDailyDigest = query(createServerReference(serverFunction_5$5), "portal-daily-digest");
var serverFunction_6$5 = registerServerReference("83d26547-5", async (sessionId) => {
	const user = await requireParent();
	if (!await db.careSession.findFirst({ where: {
		id: sessionId,
		familyId: user.familyId
	} })) return /* @__PURE__ */ new Error("Session not found");
	await db.careSession.update({
		where: { id: sessionId },
		data: { isConfirmed: true }
	});
	return reload();
});
var confirmMySession = action$1(createServerReference(serverFunction_6$5));
var serverFunction_7$4 = registerServerReference("83d26547-6", async () => {
	return { familyId: await getCurrentFamilyId() };
});
query(createServerReference(serverFunction_7$4), "portal-context");
//#endregion
//#region src/routes/portal/index.tsx?pick=route&lang.tsx
var route$17 = { preload() {
	ensureParent();
	getUser();
	getMyFamily();
	getMyUpcomingSessions();
	getMyChildReports();
} };
//#endregion
//#region src/routes/portal/today.tsx?pick=route&lang.tsx
var route$16 = { preload() {
	ensureParent();
	getUser();
	getMyDailyDigest();
} };
//#endregion
//#region src/routes/reports/calendar.tsx?pick=route&lang.tsx
var route$15 = { preload() {
	const today = /* @__PURE__ */ new Date();
	getCareSessionsForRange(new Date(today.getFullYear(), today.getMonth() - 1, 1), new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59));
} };
//#endregion
//#region src/lib/services.ts
var serverFunction_1$4 = registerServerReference("b7fcc162-0", async () => {
	await requireOwner();
	const services = await db.service.findMany({
		where: { isActive: true },
		orderBy: { name: "asc" }
	});
	return serializeMoneyDeep(services);
});
var getServices = query(createServerReference(serverFunction_1$4), "services");
var serverFunction_2$4 = registerServerReference("b7fcc162-1", async () => {
	await requireOwner();
	const services = await db.service.findMany({ orderBy: { name: "asc" } });
	return serializeMoneyDeep(services);
});
var getAllServices = query(createServerReference(serverFunction_2$4), "all-services");
var serverFunction_3$4 = registerServerReference("b7fcc162-2", async (id) => {
	await requireOwner();
	const service = await db.service.findUnique({ where: { id } });
	if (!service) throw new Error("Service not found");
	return serializeMoneyDeep(service);
});
var getService = query(createServerReference(serverFunction_3$4), "service");
var serverFunction_4$4 = registerServerReference("b7fcc162-3", async (code) => {
	await requireOwner();
	const service = await db.service.findUnique({ where: { code } });
	return service ? serializeMoneyDeep(service) : null;
});
query(createServerReference(serverFunction_4$4), "service-by-code");
var serverFunction_5$4 = registerServerReference("b7fcc162-4", async (formData) => {
	await requireOwner();
	try {
		const name = String(formData.get("name"));
		const code = String(formData.get("code"));
		const description = String(formData.get("description") || "");
		const defaultHourlyRate = String(formData.get("defaultHourlyRate") || "");
		const pricingType = String(formData.get("pricingType") || "FLAT");
		const requiresChildren = formData.get("requiresChildren") === "true";
		if (!name || !code) return /* @__PURE__ */ new Error("Name and code are required");
		if (await db.service.findUnique({ where: { code } })) return /* @__PURE__ */ new Error("Service with this code already exists");
		return {
			success: true,
			service: await db.service.create({ data: {
				name,
				code: code.toUpperCase(),
				description: description || null,
				defaultHourlyRate: defaultHourlyRate ? parseMoney(defaultHourlyRate) : null,
				pricingType,
				requiresChildren
			} })
		};
	} catch (err) {
		console.error("Error creating service:", err);
		return new Error(err instanceof Error ? err.message : "Failed to create service");
	}
});
var createService = action$1(createServerReference(serverFunction_5$4));
var serverFunction_6$4 = registerServerReference("b7fcc162-5", async (formData) => {
	await requireOwner();
	try {
		const id = String(formData.get("id"));
		const name = String(formData.get("name"));
		const description = String(formData.get("description") || "");
		const defaultHourlyRate = String(formData.get("defaultHourlyRate") || "");
		const pricingType = String(formData.get("pricingType") || "FLAT");
		const requiresChildren = formData.get("requiresChildren") === "true";
		const isActive = formData.get("isActive") === "true";
		if (!name) return /* @__PURE__ */ new Error("Name is required");
		await db.service.update({
			where: { id },
			data: {
				name,
				description: description || null,
				defaultHourlyRate: defaultHourlyRate ? parseMoney(defaultHourlyRate) : null,
				pricingType,
				requiresChildren,
				isActive
			}
		});
		return { success: true };
	} catch (err) {
		console.error("Error updating service:", err);
		return new Error(err instanceof Error ? err.message : "Failed to update service");
	}
});
var updateService = action$1(createServerReference(serverFunction_6$4));
var serverFunction_7$3 = registerServerReference("b7fcc162-6", async (serviceId, childCount = 0) => {
	await requireOwner();
	const service = await db.service.findUnique({ where: { id: serviceId } });
	if (!service || !service.defaultHourlyRate) return null;
	if (service.pricingType === "PER_CHILD") return multiplyMoney(service.defaultHourlyRate, childCount);
	return service.defaultHourlyRate;
});
var calculateServiceRate = createServerReference(serverFunction_7$3);
//#endregion
//#region src/routes/reports/index.tsx?pick=route&lang.tsx
var route$14 = { preload() {
	getUser();
	getAllServices();
} };
//#endregion
//#region src/lib/reports.ts
var buildYearEndCsv = function buildYearEndCsv(report, taxSummary) {
	const rows = [];
	rows.push(`Year-End Report ${taxSummary.year},${csvEscape(report.familyName)}`);
	rows.push(`Parent,${csvEscape(report.parentName)}`);
	rows.push(`Email,${csvEscape(report.email)}`);
	rows.push("");
	rows.push("Annual Summary (cash basis - payments received)");
	rows.push(`Gross Income,${csvEscape(taxSummary.grossIncome)}`);
	rows.push(`Total Expenses,${csvEscape(taxSummary.totalExpenses)}`);
	rows.push(`Net Income,${csvEscape(taxSummary.netIncome)}`);
	rows.push("");
	rows.push("Expenses by Category");
	rows.push("Category,Amount,Count");
	taxSummary.byCategory.forEach((row) => {
		rows.push(`${csvEscape(row.category)},${csvEscape(row.amount)},${row.count}`);
	});
	rows.push("");
	rows.push("Sessions");
	rows.push("Date,Service,Hours,Rate,Session Amount,Expenses,Total,Status");
	report.sessions.forEach((session) => {
		rows.push([
			csvEscape(new Date(session.date).toLocaleDateString()),
			csvEscape(session.serviceName),
			session.hours.toFixed(2),
			csvEscape(session.hourlyRate ?? ""),
			csvEscape(session.sessionAmount),
			csvEscape(session.expenses),
			csvEscape(session.totalAmount),
			csvEscape(session.status)
		].join(","));
	});
	rows.push("");
	rows.push(`Total Hours,${report.totalHours.toFixed(2)}`);
	rows.push(`Total Sessions,${report.totalSessions}`);
	rows.push(`Total Amount,${csvEscape(report.totalAmount)}`);
	rows.push(`Total Paid,${csvEscape(report.totalPaid)}`);
	rows.push(`Outstanding,${csvEscape(report.totalOutstanding)}`);
	return rows.join("\n");
};
var csvEscape = function csvEscape(value) {
	const str = value == null ? "" : String(value);
	if (str.includes(",") || str.includes("\"") || str.includes("\n")) return `"${str.replace(/"/g, "\"\"")}"`;
	return str;
};
var getExpenseCategoriesForYear = async function getExpenseCategoriesForYear(year, familyId) {
	const startDate = new Date(year, 0, 1);
	const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
	const standalone = await dbIncludingDeleted.expense.findMany({
		where: {
			expenseDate: {
				gte: startDate,
				lte: endDate
			},
			...familyId ? { familyId } : {}
		},
		select: {
			amount: true,
			category: true
		}
	});
	const sessions = await dbIncludingDeleted.careSession.findMany({
		where: {
			scheduledStart: {
				gte: startDate,
				lte: endDate
			},
			...familyId ? { familyId } : {}
		},
		select: { id: true }
	});
	const sessionExpenses = await dbIncludingDeleted.sessionExpense.findMany({
		where: { sessionId: { in: sessions.map((s) => s.id) } },
		select: {
			amount: true,
			category: true
		}
	});
	const categoryMap = /* @__PURE__ */ new Map();
	for (const expense of [...standalone, ...sessionExpenses]) {
		const category = expense.category || "UNCATEGORIZED";
		const existing = categoryMap.get(category) ?? {
			total: sumMoney([]),
			count: 0
		};
		categoryMap.set(category, {
			total: addMoney(existing.total, expense.amount),
			count: existing.count + 1
		});
	}
	return Array.from(categoryMap.entries()).map(([category, data]) => ({
		category,
		amount: moneyToString(data.total),
		count: data.count
	})).sort((a, b) => compareMoney(b.amount, a.amount));
};
var generateYearEndReport = async function generateYearEndReport(familyId, year) {
	const startDate = new Date(year, 0, 1);
	const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
	const family = await dbIncludingDeleted.family.findUnique({
		where: { id: familyId },
		include: {
			children: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					dateOfBirth: true
				},
				orderBy: { firstName: "asc" }
			},
			familyMembers: {
				where: { relationship: "PARENT" },
				select: {
					firstName: true,
					lastName: true,
					relationship: true
				}
			}
		}
	});
	if (!family) throw new Error("Family not found");
	const sessions = await dbIncludingDeleted.careSession.findMany({
		where: {
			familyId,
			scheduledStart: {
				gte: startDate,
				lte: endDate
			},
			status: { in: [
				"COMPLETED",
				"IN_PROGRESS",
				"SCHEDULED"
			] }
		},
		include: {
			service: { select: {
				id: true,
				name: true
			} },
			children: { select: {
				id: true,
				firstName: true,
				lastName: true
			} },
			expenses: { select: { amount: true } },
			payments: {
				where: { status: "PAID" },
				select: {
					amount: true,
					paidDate: true
				}
			}
		},
		orderBy: { scheduledStart: "asc" }
	});
	let totalHours = 0;
	let totalAmount = sumMoney([]);
	let totalPaid = sumMoney([]);
	const sessionReports = sessions.map((session) => {
		const hours = calculateHours(session.scheduledStart, session.scheduledEnd);
		const sessionAmount = calculateSessionCost(hours, session.hourlyRate);
		const expenses = sumMoney(session.expenses.map((exp) => exp.amount));
		const sessionTotal = addMoney(sessionAmount, expenses);
		totalHours += hours;
		totalAmount = addMoney(totalAmount, sessionTotal);
		const sessionPaid = sumMoney(session.payments.map((pay) => pay.amount));
		totalPaid = addMoney(totalPaid, sessionPaid);
		return {
			id: session.id,
			date: session.scheduledStart,
			startTime: session.scheduledStart,
			endTime: session.scheduledEnd,
			serviceName: session.service.name,
			children: session.children,
			hours,
			hourlyRate: session.hourlyRate != null ? moneyToString(session.hourlyRate) : null,
			sessionAmount: moneyToString(sessionAmount),
			expenses: moneyToString(expenses),
			totalAmount: moneyToString(sessionTotal),
			status: session.status
		};
	});
	const allPayments = await dbIncludingDeleted.payment.findMany({
		where: {
			familyId,
			paidDate: {
				gte: startDate,
				lte: endDate
			},
			status: "PAID"
		},
		select: { amount: true }
	});
	const totalPaidFromPayments = sumMoney(allPayments.map((pay) => pay.amount));
	if (compareMoney(totalPaidFromPayments, totalPaid) > 0) totalPaid = totalPaidFromPayments;
	const standaloneExpenses = await dbIncludingDeleted.expense.findMany({
		where: {
			familyId: family.id,
			expenseDate: {
				gte: startDate,
				lte: endDate
			}
		},
		select: {
			amount: true,
			description: true,
			category: true,
			expenseDate: true
		}
	});
	const totalStandaloneExpenses = sumMoney(standaloneExpenses.map((exp) => exp.amount));
	const totalOutstanding = subtractMoney(totalAmount, totalPaid);
	return serializeMoneyDeep({
		familyId: family.id,
		familyName: family.familyName,
		parentName: formatParentNames(family.parentFirstName, family.parentLastName, family.familyMembers),
		email: family.email,
		phone: family.phone,
		address: family.address,
		city: family.city,
		state: family.state,
		zipCode: family.zipCode,
		children: family.children,
		sessions: sessionReports,
		standaloneExpenses,
		totalHours,
		totalSessions: sessions.length,
		totalAmount: moneyToString(totalAmount),
		totalPaid: moneyToString(totalPaid),
		totalOutstanding: moneyToString(totalOutstanding),
		totalStandaloneExpenses: moneyToString(totalStandaloneExpenses)
	});
};
var serverFunction_1$3 = registerServerReference("ea5a4f78-0", async (familyId, year) => {
	await requireOwner();
	return generateYearEndReport(familyId, year);
});
var getYearEndFamilyReport = query(createServerReference(serverFunction_1$3));
var serverFunction_2$3 = registerServerReference("ea5a4f78-1", async () => {
	await requireOwner();
	return await dbIncludingDeleted.family.findMany({
		select: {
			id: true,
			familyName: true,
			parentFirstName: true,
			parentLastName: true,
			familyMembers: {
				where: { relationship: "PARENT" },
				select: {
					firstName: true,
					lastName: true,
					relationship: true
				}
			}
		},
		orderBy: { familyName: "asc" }
	});
});
var getAllFamiliesForReports = query(createServerReference(serverFunction_2$3));
var serverFunction_3$3 = registerServerReference("ea5a4f78-2", async (year) => {
	await requireOwner();
	const families = await dbIncludingDeleted.family.findMany({
		select: { id: true },
		orderBy: { familyName: "asc" }
	});
	return await Promise.all(families.map((family) => generateYearEndReport(family.id, year)));
});
var getAllYearEndReports = query(createServerReference(serverFunction_3$3));
var serverFunction_4$3 = registerServerReference("ea5a4f78-3", async (year, month) => {
	await requireOwner();
	let startDate;
	let endDate;
	let period;
	if (month !== void 0 && month !== null) {
		startDate = new Date(year, month - 1, 1);
		endDate = new Date(year, month, 0, 23, 59, 59, 999);
		period = `${year}-${String(month).padStart(2, "0")}`;
	} else {
		startDate = new Date(year, 0, 1);
		endDate = new Date(year, 11, 31, 23, 59, 59, 999);
		period = String(year);
	}
	const payments = await dbIncludingDeleted.payment.findMany({
		where: {
			status: "PAID",
			paidDate: {
				gte: startDate,
				lte: endDate
			}
		},
		include: { family: { select: {
			id: true,
			familyName: true
		} } }
	});
	const grossIncome = sumMoney(payments.map((payment) => payment.amount));
	const sessions = await dbIncludingDeleted.careSession.findMany({
		where: { scheduledStart: {
			gte: startDate,
			lte: endDate
		} },
		select: {
			id: true,
			scheduledStart: true
		}
	});
	const sessionIds = sessions.map((s) => s.id);
	const expenses = await dbIncludingDeleted.sessionExpense.findMany({ where: { sessionId: { in: sessionIds } } });
	const totalExpenses = sumMoney(expenses.map((exp) => exp.amount));
	const netIncome = subtractMoney(grossIncome, totalExpenses);
	const familyMap = /* @__PURE__ */ new Map();
	payments.forEach((payment) => {
		if (payment.familyId && payment.family) {
			const existing = familyMap.get(payment.familyId) || {
				familyName: payment.family.familyName,
				amount: sumMoney([]),
				paymentCount: 0
			};
			existing.amount = addMoney(existing.amount, payment.amount);
			existing.paymentCount += 1;
			familyMap.set(payment.familyId, existing);
		}
	});
	const byFamily = Array.from(familyMap.entries()).map(([familyId, data]) => ({
		familyId,
		familyName: data.familyName,
		amount: moneyToString(data.amount),
		paymentCount: data.paymentCount
	}));
	const monthMap = /* @__PURE__ */ new Map();
	if (month !== void 0 && month !== null) monthMap.set(period, {
		grossIncome: sumMoney([]),
		expenses: sumMoney([])
	});
	else for (let m = 1; m <= 12; m++) monthMap.set(`${year}-${String(m).padStart(2, "0")}`, {
		grossIncome: sumMoney([]),
		expenses: sumMoney([])
	});
	payments.forEach((payment) => {
		if (payment.paidDate) {
			const paymentDate = new Date(payment.paidDate);
			const monthKey = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, "0")}`;
			const existing = monthMap.get(monthKey);
			if (existing) {
				existing.grossIncome = addMoney(existing.grossIncome, payment.amount);
				monthMap.set(monthKey, existing);
			}
		}
	});
	expenses.forEach((expense) => {
		const session = sessions.find((s) => s.id === expense.sessionId);
		if (session && session.scheduledStart) {
			const sessionDate = new Date(session.scheduledStart);
			const monthKey = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, "0")}`;
			const existing = monthMap.get(monthKey);
			if (existing) {
				existing.expenses = addMoney(existing.expenses, expense.amount);
				monthMap.set(monthKey, existing);
			}
		}
	});
	const byMonth = Array.from(monthMap.entries()).map(([month, data]) => ({
		month,
		grossIncome: moneyToString(data.grossIncome),
		expenses: moneyToString(data.expenses),
		netIncome: moneyToString(subtractMoney(data.grossIncome, data.expenses))
	})).sort((a, b) => a.month.localeCompare(b.month));
	return {
		period,
		startDate,
		endDate,
		grossIncome: moneyToString(grossIncome),
		totalExpenses: moneyToString(totalExpenses),
		netIncome: moneyToString(netIncome),
		paymentCount: payments.length,
		expenseCount: expenses.length,
		byFamily: byFamily.sort((a, b) => compareMoney(b.amount, a.amount)),
		byMonth
	};
});
query(createServerReference(serverFunction_4$3));
var serverFunction_5$3 = registerServerReference("ea5a4f78-4", async (year, familyId) => {
	await requireOwner();
	if (familyId) await assertFamilyExists(familyId);
	const startDate = new Date(year, 0, 1);
	const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
	const payments = await dbIncludingDeleted.payment.findMany({
		where: {
			status: "PAID",
			OR: [{ taxYear: year }, { paidDate: {
				gte: startDate,
				lte: endDate
			} }],
			...familyId ? { familyId } : {}
		},
		select: { amount: true }
	});
	const grossIncome = sumMoney(payments.map((p) => p.amount));
	const byCategory = await getExpenseCategoriesForYear(year, familyId);
	const totalExpenses = sumMoney(byCategory.map((c) => c.amount));
	return {
		year,
		grossIncome: moneyToString(grossIncome),
		totalExpenses: moneyToString(totalExpenses),
		netIncome: moneyToString(subtractMoney(grossIncome, totalExpenses)),
		paymentCount: payments.length,
		byCategory
	};
});
var getAnnualTaxSummary = query(createServerReference(serverFunction_5$3), "annual-tax-summary");
var serverFunction_6$3 = registerServerReference("ea5a4f78-5", async (year, familyId) => {
	await requireOwner();
	if (familyId) {
		const report = await generateYearEndReport(familyId, year);
		const taxSummary = await getExpenseCategoriesForYear(year, familyId).then(async (byCategory) => {
			const payments = await dbIncludingDeleted.payment.findMany({
				where: {
					status: "PAID",
					familyId,
					OR: [{ taxYear: year }, { paidDate: {
						gte: new Date(year, 0, 1),
						lte: new Date(year, 11, 31, 23, 59, 59, 999)
					} }]
				},
				select: { amount: true }
			});
			const grossIncome = sumMoney(payments.map((p) => p.amount));
			const totalExpenses = sumMoney(byCategory.map((c) => c.amount));
			return {
				year,
				grossIncome: moneyToString(grossIncome),
				totalExpenses: moneyToString(totalExpenses),
				netIncome: moneyToString(subtractMoney(grossIncome, totalExpenses)),
				paymentCount: payments.length,
				byCategory
			};
		});
		return {
			filename: `year-end-${year}-${report.familyName.replace(/\s+/g, "-").toLowerCase()}.csv`,
			content: buildYearEndCsv(report, taxSummary)
		};
	}
	const families = await dbIncludingDeleted.family.findMany({ select: { id: true } });
	const sections = [];
	for (const family of families) {
		const report = await generateYearEndReport(family.id, year);
		const taxSummary = {
			year,
			grossIncome: report.totalPaid,
			totalExpenses: moneyToString(addMoney(report.totalStandaloneExpenses, sumMoney(report.sessions.map((s) => s.expenses)))),
			netIncome: moneyToString(subtractMoney(report.totalPaid, report.totalAmount)),
			paymentCount: 0,
			byCategory: await getExpenseCategoriesForYear(year, family.id)
		};
		sections.push(buildYearEndCsv(report, taxSummary));
		sections.push("");
	}
	return {
		filename: `year-end-${year}-all-families.csv`,
		content: sections.join("\n")
	};
});
query(createServerReference(serverFunction_6$3), "export-year-end-csv");
//#endregion
//#region src/routes/reports/tax-summary.tsx?pick=route&lang.tsx
var route$13 = { preload() {
	ensureOwner();
	getUser();
	getAllFamiliesForReports();
} };
//#endregion
//#region src/routes/reports/year-end.tsx?pick=route&lang.tsx
var route$12 = { preload() {
	getUser();
	getAllFamiliesForReports();
} };
//#endregion
//#region src/routes/schedule/index.tsx?pick=route&lang.tsx
var route$11 = { info: { ssr: false } };
//#endregion
//#region src/routes/services/index.tsx?pick=route&lang.tsx
var route$10 = { preload() {
	throw serverRedirect("/reports");
} };
//#endregion
//#region src/routes/children/[id]/edit.tsx?pick=route&lang.tsx
var route$9 = { preload({ params }) {
	return getChild(params.id).then((child) => {
		throw serverRedirect(`/families/${child.familyId}/children/${params.id}/edit`);
	});
} };
//#endregion
//#region src/routes/children/[id]/index.tsx?pick=route&lang.tsx
var route$8 = { preload({ params }) {
	return getChild(params.id).then((child) => {
		throw serverRedirect(`/families/${child.familyId}/children/${params.id}`);
	});
} };
//#endregion
//#region src/routes/families/[id]/edit.tsx?pick=route&lang.tsx
var route$7 = { preload({ params }) {
	if (params.id) getFamily(params.id);
} };
//#endregion
//#region src/lib/family-members.ts
var serverFunction_1$2 = registerServerReference("d2bd027d-0", async (familyId) => {
	await requireOwner();
	await assertFamilyExists(familyId);
	return await db.familyMember.findMany({
		where: { familyId },
		include: { user: { select: {
			id: true,
			email: true,
			username: true
		} } },
		orderBy: { lastName: "asc" }
	});
});
var getFamilyMembers = query(createServerReference(serverFunction_1$2), "family-members");
var serverFunction_2$2 = registerServerReference("d2bd027d-1", async (id) => {
	await requireOwner();
	await requireFamilyMemberAccess(id);
	const member = await db.familyMember.findUnique({
		where: { id },
		include: {
			family: true,
			user: { select: {
				id: true,
				email: true,
				username: true
			} }
		}
	});
	if (!member) throw new Error("Family member not found");
	return member;
});
var getFamilyMember = query(createServerReference(serverFunction_2$2), "family-member");
var serverFunction_3$2 = registerServerReference("d2bd027d-2", async (formData) => {
	await requireOwner();
	try {
		const familyId = String(formData.get("familyId"));
		const firstName = String(formData.get("firstName"));
		const lastName = String(formData.get("lastName"));
		const relationship = String(formData.get("relationship"));
		const email = String(formData.get("email") || "");
		const phone = String(formData.get("phone") || "");
		const canPickup = formData.get("canPickup") === "true";
		const allergies = String(formData.get("allergies") || "");
		const notes = String(formData.get("notes") || "");
		if (!firstName || !lastName) return /* @__PURE__ */ new Error("First and last name are required");
		if (!relationship) return /* @__PURE__ */ new Error("Relationship is required");
		await assertFamilyExists(familyId);
		await db.familyMember.create({ data: {
			familyId,
			firstName,
			lastName,
			relationship,
			email: email || null,
			phone: phone || null,
			canPickup,
			allergies: allergies || null,
			notes: notes || null
		} });
		return serverRedirect(`/families/${familyId}`);
	} catch (err) {
		console.error("Error creating family member:", err);
		return new Error(err instanceof Error ? err.message : "Failed to create family member");
	}
});
var createFamilyMember = action$1(createServerReference(serverFunction_3$2));
var serverFunction_4$2 = registerServerReference("d2bd027d-3", async (formData) => {
	await requireOwner();
	try {
		const id = String(formData.get("id"));
		const familyId = String(formData.get("familyId"));
		const firstName = String(formData.get("firstName"));
		const lastName = String(formData.get("lastName"));
		const relationship = String(formData.get("relationship"));
		const email = String(formData.get("email") || "");
		const phone = String(formData.get("phone") || "");
		const canPickup = formData.get("canPickup") === "true";
		const allergies = String(formData.get("allergies") || "");
		const notes = String(formData.get("notes") || "");
		if (!firstName || !lastName) return /* @__PURE__ */ new Error("First and last name are required");
		if (!relationship) return /* @__PURE__ */ new Error("Relationship is required");
		await assertFamilyMemberInFamily(id, familyId);
		await db.familyMember.update({
			where: { id },
			data: {
				firstName,
				lastName,
				relationship,
				email: email || null,
				phone: phone || null,
				canPickup,
				allergies: allergies || null,
				notes: notes || null
			}
		});
		return serverRedirect(`/families/${familyId}`);
	} catch (err) {
		console.error("Error updating family member:", err);
		return new Error(err instanceof Error ? err.message : "Failed to update family member");
	}
});
var updateFamilyMember = action$1(createServerReference(serverFunction_4$2));
var serverFunction_5$2 = registerServerReference("d2bd027d-4", async (id) => {
	await requireOwner();
	try {
		await requireFamilyMemberAccess(id);
		await db.familyMember.delete({ where: { id } });
		return reload();
	} catch (err) {
		console.error("Error deleting family member:", err);
		return new Error(err instanceof Error ? err.message : "Failed to delete family member");
	}
});
action$1(createServerReference(serverFunction_5$2));
var serverFunction_6$2 = registerServerReference("d2bd027d-5", async (formData) => {
	await requireOwner();
	try {
		const memberId = String(formData.get("memberId"));
		const username = String(formData.get("username"));
		const password = String(formData.get("password"));
		const member = await db.familyMember.findUnique({ where: { id: memberId } });
		if (!member) return /* @__PURE__ */ new Error("Family member not found");
		if (!member.email) return /* @__PURE__ */ new Error("Family member must have an email address to receive an invite");
		if (member.userId) return /* @__PURE__ */ new Error("This family member already has app access");
		if (await db.user.findUnique({ where: { username } })) return /* @__PURE__ */ new Error("Username already exists");
		if (await db.user.findUnique({ where: { email: member.email } })) return /* @__PURE__ */ new Error("Email already registered");
		const user = await db.user.create({ data: {
			email: member.email,
			username,
			password: hashPassword(password),
			firstName: member.firstName,
			lastName: member.lastName,
			phone: member.phone,
			isOwner: false
		} });
		await db.familyMember.update({
			where: { id: memberId },
			data: { userId: user.id }
		});
		return {
			success: true,
			message: "Family member invited successfully"
		};
	} catch (err) {
		console.error("Error inviting family member:", err);
		return new Error(err instanceof Error ? err.message : "Failed to invite family member");
	}
});
action$1(createServerReference(serverFunction_6$2));
var serverFunction_7$2 = registerServerReference("d2bd027d-6", async (memberId) => {
	await requireOwner();
	try {
		const member = await db.familyMember.findUnique({
			where: { id: memberId },
			include: { user: true }
		});
		if (!member || !member.userId) return /* @__PURE__ */ new Error("Family member does not have app access");
		await db.familyMember.update({
			where: { id: memberId },
			data: { userId: null }
		});
		if (member.user && !member.user.isOwner) await db.user.delete({ where: { id: member.userId } });
		return reload();
	} catch (err) {
		console.error("Error revoking access:", err);
		return new Error(err instanceof Error ? err.message : "Failed to revoke access");
	}
});
action$1(createServerReference(serverFunction_7$2));
//#endregion
//#region src/lib/care-schedules.ts
var serverFunction_1$1 = registerServerReference("f6ec08ad-0", async (familyId) => {
	await requireOwner();
	await assertFamilyExists(familyId);
	return await db.careSchedule.findMany({
		where: { familyId },
		include: {
			children: { select: {
				id: true,
				firstName: true,
				lastName: true
			} },
			service: { select: {
				id: true,
				name: true,
				code: true
			} },
			_count: { select: { careSessions: true } }
		},
		orderBy: { startDate: "desc" }
	});
});
var getCareSchedules = query(createServerReference(serverFunction_1$1), "care-schedules");
var serverFunction_2$1 = registerServerReference("f6ec08ad-1", async (id) => {
	await requireOwner();
	await requireCareScheduleAccess(id);
	const schedule = await db.careSchedule.findUnique({
		where: { id },
		include: {
			family: true,
			children: true,
			careSessions: {
				orderBy: { scheduledStart: "desc" },
				take: 20
			}
		}
	});
	if (!schedule) throw new Error("Care schedule not found");
	return schedule;
});
query(createServerReference(serverFunction_2$1), "care-schedule");
var serverFunction_3$1 = registerServerReference("f6ec08ad-2", async (formData) => {
	await requireOwner();
	try {
		const familyId = String(formData.get("familyId"));
		const name = String(formData.get("name"));
		const serviceId = String(formData.get("serviceId"));
		const recurrence = String(formData.get("recurrence"));
		const startTime = String(formData.get("startTime"));
		const endTime = String(formData.get("endTime"));
		const hourlyRate = String(formData.get("hourlyRate") || "");
		const startDate = String(formData.get("startDate"));
		const endDate = String(formData.get("endDate") || "");
		const notes = String(formData.get("notes") || "");
		const daysOfWeek = [];
		for (const day of [
			"SUNDAY",
			"MONDAY",
			"TUESDAY",
			"WEDNESDAY",
			"THURSDAY",
			"FRIDAY",
			"SATURDAY"
		]) if (formData.get(`day_${day}`) === "true") daysOfWeek.push(day);
		const childIds = [];
		const childIdData = formData.getAll("childIds");
		for (const id of childIdData) if (id) childIds.push(String(id));
		const scheduleName = name || (recurrence === "ONCE" ? `Session on ${new Date(startDate).toLocaleDateString()}` : "");
		if (!scheduleName && recurrence !== "ONCE") return /* @__PURE__ */ new Error("Schedule name is required");
		await assertFamilyExists(familyId);
		if (!startTime || !endTime) return /* @__PURE__ */ new Error("Start and end times are required");
		if (!startDate) return /* @__PURE__ */ new Error("Start date is required");
		if (recurrence !== "ONCE" && daysOfWeek.length === 0) return /* @__PURE__ */ new Error("Please select at least one day of the week");
		if (!serviceId || serviceId === "") return /* @__PURE__ */ new Error("Please select a service");
		const service = await db.service.findUnique({ where: { id: serviceId } });
		if (!service) return /* @__PURE__ */ new Error("Service not found");
		if (service.requiresChildren && childIds.length === 0) return /* @__PURE__ */ new Error(`Please select at least one child for ${service.name}`);
		let finalHourlyRate = null;
		if (hourlyRate) finalHourlyRate = parseMoney(hourlyRate);
		else finalHourlyRate = await calculateServiceRate(serviceId, childIds.length);
		const finalDaysOfWeek = recurrence === "ONCE" ? [] : daysOfWeek;
		const schedule = await db.careSchedule.create({ data: {
			familyId,
			name: scheduleName,
			serviceId,
			recurrence,
			daysOfWeek: finalDaysOfWeek,
			startTime,
			endTime,
			hourlyRate: finalHourlyRate,
			startDate: parseFormDate$1(startDate),
			endDate: endDate ? parseFormDate$1(endDate) : null,
			notes: notes || null,
			children: { connect: childIds.map((id) => ({ id })) }
		} });
		const timezoneOffsetMinutes = formData.get("timezoneOffset") ? parseInt(String(formData.get("timezoneOffset"))) : void 0;
		const timezoneOffsetHours = timezoneOffsetMinutes !== void 0 ? timezoneOffsetMinutes / 60 : void 0;
		if (recurrence === "ONCE") {
			const sessionStart = datetimeLocalToUTC(`${startDate}T${startTime}`, timezoneOffsetHours);
			const sessionEnd = datetimeLocalToUTC(`${startDate}T${endTime}`, timezoneOffsetHours);
			await db.careSession.create({ data: {
				familyId,
				scheduleId: schedule.id,
				serviceId,
				scheduledStart: sessionStart,
				scheduledEnd: sessionEnd,
				hourlyRate: finalHourlyRate,
				status: "SCHEDULED",
				isConfirmed: true,
				notes: notes || null,
				children: { connect: childIds.map((id) => ({ id })) }
			} });
			return serverRedirect(`/families/${familyId}`);
		}
		return serverRedirect(`/families/${familyId}/schedules/${schedule.id}`);
	} catch (err) {
		console.error("Error creating care schedule:", err);
		return new Error(err instanceof Error ? err.message : "Failed to create care schedule");
	}
});
var createCareSchedule = action$1(createServerReference(serverFunction_3$1));
var serverFunction_4$1 = registerServerReference("f6ec08ad-3", async (formData) => {
	await requireOwner();
	try {
		const id = String(formData.get("id"));
		const familyId = String(formData.get("familyId"));
		const name = String(formData.get("name"));
		const serviceId = String(formData.get("serviceId"));
		const recurrence = String(formData.get("recurrence"));
		const startTime = String(formData.get("startTime"));
		const endTime = String(formData.get("endTime"));
		const hourlyRate = String(formData.get("hourlyRate") || "");
		const startDate = String(formData.get("startDate"));
		const endDate = String(formData.get("endDate") || "");
		const notes = String(formData.get("notes") || "");
		const isActive = formData.get("isActive") === "true";
		const daysOfWeek = [];
		for (const day of [
			"SUNDAY",
			"MONDAY",
			"TUESDAY",
			"WEDNESDAY",
			"THURSDAY",
			"FRIDAY",
			"SATURDAY"
		]) if (formData.get(`day_${day}`) === "true") daysOfWeek.push(day);
		const childIds = [];
		const childIdData = formData.getAll("childIds");
		for (const id of childIdData) if (id) childIds.push(String(id));
		if (!name) return /* @__PURE__ */ new Error("Schedule name is required");
		await assertScheduleInFamily(id, familyId);
		if (!startTime || !endTime) return /* @__PURE__ */ new Error("Start and end times are required");
		if (!startDate) return /* @__PURE__ */ new Error("Start date is required");
		if (recurrence === "WEEKLY" && daysOfWeek.length === 0) return /* @__PURE__ */ new Error("Please select at least one day of the week");
		const service = await db.service.findUnique({ where: { id: serviceId } });
		if (!service) return /* @__PURE__ */ new Error("Service not found");
		if (service.requiresChildren && childIds.length === 0) return /* @__PURE__ */ new Error(`Please select at least one child for ${service.name}`);
		await db.careSchedule.update({
			where: { id },
			data: {
				name,
				serviceId,
				recurrence,
				daysOfWeek,
				startTime,
				endTime,
				hourlyRate: hourlyRate ? parseMoney(hourlyRate) : null,
				startDate: parseFormDate$1(startDate),
				endDate: endDate ? parseFormDate$1(endDate) : null,
				notes: notes || null,
				isActive,
				children: { set: childIds.map((id) => ({ id })) }
			}
		});
		return serverRedirect(`/families/${familyId}/schedules/${id}`);
	} catch (err) {
		console.error("Error updating care schedule:", err);
		return new Error(err instanceof Error ? err.message : "Failed to update care schedule");
	}
});
var updateCareSchedule = action$1(createServerReference(serverFunction_4$1));
var serverFunction_5$1 = registerServerReference("f6ec08ad-4", async (formData) => {
	await requireOwner();
	try {
		const id = String(formData.get("id"));
		if (!id) return /* @__PURE__ */ new Error("Schedule ID is required");
		await requireCareScheduleAccess(id);
		await db.careSchedule.delete({ where: { id } });
		return reload();
	} catch (err) {
		console.error("Error deleting care schedule:", err);
		return new Error(err instanceof Error ? err.message : "Failed to delete care schedule");
	}
});
var deleteCareSchedule = action$1(createServerReference(serverFunction_5$1));
var serverFunction_6$1 = registerServerReference("f6ec08ad-5", async (formData) => {
	await requireOwner();
	try {
		const scheduleId = String(formData.get("scheduleId"));
		const startDate = parseFormDate$1(String(formData.get("startDate")));
		const endDate = parseFormDate$1(String(formData.get("endDate")));
		await requireCareScheduleAccess(scheduleId);
		const schedule = await db.careSchedule.findUnique({
			where: { id: scheduleId },
			include: {
				children: true,
				service: true
			}
		});
		if (!schedule) return /* @__PURE__ */ new Error("Schedule not found");
		if (!schedule.isActive) return /* @__PURE__ */ new Error("Cannot generate sessions from inactive schedule");
		const sessions = [];
		const currentDate = new Date(startDate);
		while (currentDate <= endDate) {
			const dayOfWeek = [
				"SUNDAY",
				"MONDAY",
				"TUESDAY",
				"WEDNESDAY",
				"THURSDAY",
				"FRIDAY",
				"SATURDAY"
			][currentDate.getDay()];
			if (schedule.daysOfWeek.includes(dayOfWeek)) {
				const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
				const timezoneOffsetMinutes = formData.get("timezoneOffset") ? parseInt(String(formData.get("timezoneOffset"))) : void 0;
				const timezoneOffsetHours = timezoneOffsetMinutes !== void 0 ? timezoneOffsetMinutes / 60 : void 0;
				const scheduledStart = datetimeLocalToUTC(`${dateString}T${schedule.startTime}`, timezoneOffsetHours);
				const scheduledEnd = datetimeLocalToUTC(`${dateString}T${schedule.endTime}`, timezoneOffsetHours);
				if (!await db.careSession.findFirst({ where: {
					scheduleId,
					scheduledStart
				} })) {
					let sessionHourlyRate = schedule.hourlyRate;
					if (!sessionHourlyRate && schedule.service) sessionHourlyRate = await calculateServiceRate(schedule.service.id, schedule.children.length);
					sessions.push({
						familyId: schedule.familyId,
						scheduleId: schedule.id,
						serviceId: schedule.serviceId,
						scheduledStart,
						scheduledEnd,
						hourlyRate: sessionHourlyRate,
						status: "SCHEDULED",
						isConfirmed: false,
						children: { connect: schedule.children.map((child) => ({ id: child.id })) }
					});
				}
			}
			currentDate.setDate(currentDate.getDate() + 1);
		}
		for (const sessionData of sessions) await db.careSession.create({ data: sessionData });
		return {
			success: true,
			count: sessions.length,
			message: `Generated ${sessions.length} care session(s)`
		};
	} catch (err) {
		console.error("Error generating sessions:", err);
		return new Error(err instanceof Error ? err.message : "Failed to generate sessions");
	}
});
var generateSessionsFromSchedule = action$1(createServerReference(serverFunction_6$1));
var serverFunction_7$1 = registerServerReference("f6ec08ad-6", async (formData) => {
	await requireOwner();
	try {
		const sessionId = String(formData.get("sessionId"));
		const dropOffBy = String(formData.get("dropOffBy"));
		const dropOffById = String(formData.get("dropOffById") || "");
		const dropOffTime = String(formData.get("dropOffTime") || "");
		if (!sessionId) return /* @__PURE__ */ new Error("Session ID is required");
		if (!dropOffBy) return /* @__PURE__ */ new Error("Drop-off person is required");
		await requireSessionFamilyAccess(sessionId);
		await db.careSession.update({
			where: { id: sessionId },
			data: {
				dropOffBy,
				dropOffById: dropOffById || null,
				dropOffTime: dropOffTime ? datetimeLocalToUTC(dropOffTime) : /* @__PURE__ */ new Date(),
				status: "IN_PROGRESS",
				isConfirmed: true
			}
		});
		return reload();
	} catch (err) {
		console.error("Error recording drop-off:", err);
		return new Error(err instanceof Error ? err.message : "Failed to record drop-off");
	}
});
var recordDropOff = action$1(createServerReference(serverFunction_7$1));
var serverFunction_8 = registerServerReference("f6ec08ad-7", async (formData) => {
	await requireOwner();
	try {
		const sessionId = String(formData.get("sessionId"));
		const pickUpBy = String(formData.get("pickUpBy"));
		const pickUpById = String(formData.get("pickUpById") || "");
		const pickUpTime = String(formData.get("pickUpTime") || "");
		if (!sessionId) return /* @__PURE__ */ new Error("Session ID is required");
		if (!pickUpBy) return /* @__PURE__ */ new Error("Pick-up person is required");
		await requireSessionFamilyAccess(sessionId);
		await db.careSession.update({
			where: { id: sessionId },
			data: {
				pickUpBy,
				pickUpById: pickUpById || null,
				pickUpTime: pickUpTime ? datetimeLocalToUTC(pickUpTime) : /* @__PURE__ */ new Date(),
				status: "COMPLETED",
				isConfirmed: true
			}
		});
		return reload();
	} catch (err) {
		console.error("Error recording pick-up:", err);
		return new Error(err instanceof Error ? err.message : "Failed to record pick-up");
	}
});
var recordPickUp = action$1(createServerReference(serverFunction_8));
//#endregion
//#region src/routes/families/[id]/index.tsx?pick=route&lang.tsx
var route$6 = {
	preload({ params }) {
		if (params.id) {
			getFamily(params.id);
			getFamilyMembers(params.id);
			getCareSchedules(params.id);
			getChildren(params.id);
			getServices();
		}
	},
	info: { ssr: false }
};
//#endregion
//#region src/lib/unavailability.ts
var serverFunction_1 = registerServerReference("a104bfbe-0", async (userId) => {
	await requireOwner();
	return await db.unavailability.findMany({
		where: userId ? { userId } : {},
		orderBy: { startDate: "desc" }
	});
});
query(createServerReference(serverFunction_1), "unavailabilities");
var serverFunction_2 = registerServerReference("a104bfbe-1", async (id) => {
	await requireOwner();
	const unavailability = await db.unavailability.findUnique({
		where: { id },
		include: { user: { select: {
			id: true,
			firstName: true,
			lastName: true,
			email: true
		} } }
	});
	if (!unavailability) throw new Error("Unavailability not found");
	return unavailability;
});
var getUnavailability = query(createServerReference(serverFunction_2), "unavailability");
var serverFunction_3 = registerServerReference("a104bfbe-2", async (formData) => {
	await requireOwner();
	try {
		const userId = String(formData.get("userId") || "");
		const startDate = String(formData.get("startDate"));
		const endDate = String(formData.get("endDate"));
		const allDay = formData.get("allDay") === "true";
		const startTime = String(formData.get("startTime") || "");
		const endTime = String(formData.get("endTime") || "");
		const reason = String(formData.get("reason") || "");
		const notes = String(formData.get("notes") || "");
		if (!startDate) return /* @__PURE__ */ new Error("Start date is required");
		if (!endDate) return /* @__PURE__ */ new Error("End date is required");
		if (!allDay && (!startTime || !endTime)) return /* @__PURE__ */ new Error("Start and end times are required for specific time blocks");
		const start = parseFormDate$1(startDate);
		const end = parseFormDate$1(endDate);
		if (end < start) return /* @__PURE__ */ new Error("End date must be after start date");
		await db.unavailability.create({ data: {
			userId: userId || null,
			startDate: start,
			endDate: end,
			allDay,
			startTime: !allDay && startTime ? startTime : null,
			endTime: !allDay && endTime ? endTime : null,
			reason: reason || null,
			notes: notes || null
		} });
		return serverRedirect("/schedule");
	} catch (err) {
		console.error("Error creating unavailability:", err);
		return new Error(err instanceof Error ? err.message : "Failed to create unavailability");
	}
});
var createUnavailability = action$1(createServerReference(serverFunction_3));
var serverFunction_4 = registerServerReference("a104bfbe-3", async (formData) => {
	await requireOwner();
	try {
		const id = String(formData.get("id"));
		const userId = String(formData.get("userId") || "");
		const startDate = String(formData.get("startDate"));
		const endDate = String(formData.get("endDate"));
		const allDay = formData.get("allDay") === "true";
		const startTime = String(formData.get("startTime") || "");
		const endTime = String(formData.get("endTime") || "");
		const reason = String(formData.get("reason") || "");
		const notes = String(formData.get("notes") || "");
		if (!startDate) return /* @__PURE__ */ new Error("Start date is required");
		if (!endDate) return /* @__PURE__ */ new Error("End date is required");
		if (!allDay && (!startTime || !endTime)) return /* @__PURE__ */ new Error("Start and end times are required for specific time blocks");
		const start = parseFormDate$1(startDate);
		const end = parseFormDate$1(endDate);
		if (end < start) return /* @__PURE__ */ new Error("End date must be after start date");
		await db.unavailability.update({
			where: { id },
			data: {
				userId: userId || null,
				startDate: start,
				endDate: end,
				allDay,
				startTime: !allDay && startTime ? startTime : null,
				endTime: !allDay && endTime ? endTime : null,
				reason: reason || null,
				notes: notes || null
			}
		});
		return serverRedirect("/schedule");
	} catch (err) {
		console.error("Error updating unavailability:", err);
		return new Error(err instanceof Error ? err.message : "Failed to update unavailability");
	}
});
var updateUnavailability = action$1(createServerReference(serverFunction_4));
var serverFunction_5 = registerServerReference("a104bfbe-4", async (id) => {
	await requireOwner();
	try {
		await db.unavailability.delete({ where: { id } });
		return reload();
	} catch (err) {
		console.error("Error deleting unavailability:", err);
		return new Error(err instanceof Error ? err.message : "Failed to delete unavailability");
	}
});
action$1(createServerReference(serverFunction_5));
var serverFunction_6 = registerServerReference("a104bfbe-5", async (date, startTime, endTime) => {
	await requireOwner();
	const conflicts = await db.unavailability.findMany({ where: { AND: [{ startDate: { lte: date } }, { endDate: { gte: date } }] } });
	if (startTime && endTime && conflicts.length > 0) return conflicts.filter((c) => {
		if (c.allDay) return true;
		if (c.startTime && c.endTime) return !(endTime <= c.startTime || startTime >= c.endTime);
		return false;
	});
	return conflicts;
});
query(createServerReference(serverFunction_6), "check-availability");
var serverFunction_7 = registerServerReference("a104bfbe-6", async (userId) => {
	await requireOwner();
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	return await db.unavailability.findMany({
		where: {
			userId: userId || void 0,
			endDate: { gte: today }
		},
		orderBy: { startDate: "asc" }
	});
});
var getUpcomingUnavailabilities = query(createServerReference(serverFunction_7), "upcoming-unavailabilities");
//#endregion
//#region src/routes/unavailability/[id]/edit.tsx?pick=route&lang.tsx
var route$5 = { preload({ params }) {
	return getUnavailability(params.id);
} };
//#endregion
//#region src/routes/families/[id]/children/[childId]/edit.tsx?pick=route&lang.tsx
var route$4 = { preload({ params }) {
	if (params.childId) getChild(params.childId);
} };
//#endregion
//#region src/routes/families/[id]/children/[childId]/index.tsx?pick=route&lang.tsx
var route$3 = { preload({ params }) {
	if (params.childId) getChild(params.childId);
} };
//#endregion
//#region src/routes/families/[id]/members/[memberId]/edit.tsx?pick=route&lang.tsx
var route$2 = { preload({ params }) {
	return getFamilyMember(params.memberId);
} };
//#endregion
//#region src/routes/families/[id]/sessions/[sessionId]/edit.tsx?pick=route&lang.tsx
var route$1 = { preload({ params }) {
	if (params.id && params.sessionId) {
		getCareSession(params.sessionId);
		getChildren(params.id);
	}
} };
//#endregion
//#region src/routes/families/[id]/sessions/[sessionId]/index.tsx?pick=route&lang.tsx
var route = {
	preload({ params }) {
		if (params.sessionId) {
			getCareSession(params.sessionId);
			getSessionReports(params.sessionId);
			getSessionExpenses(params.sessionId);
			getSessionExpenseTotal(params.sessionId);
			if (params.id) getFamilyMembers(params.id);
		}
	},
	info: { ssr: false }
};
//#endregion
//#region virtual:file-routes
var route0 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\account.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/account-CTeS-E0Y.js"),
		"import": () => import("./assets/account-CTeS-E0Y.js")
	},
	"$$route": { "require": () => ({ "route": route$23 }) },
	"path": "/account"
};
var route1 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-1dK5ssDp.js"),
		"import": () => import("./assets/index-1dK5ssDp.js")
	},
	"$$route": { "require": () => ({ "route": route$22 }) },
	"path": "/"
};
var route2 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\login.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/login-BNrR0GfE.js"),
		"import": () => import("./assets/login-BNrR0GfE.js")
	},
	"path": "/login"
};
var route3 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\[...404].tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/_...404_-ChYy6FXX.js"),
		"import": () => import("./assets/_...404_-ChYy6FXX.js")
	},
	"path": "/*404"
};
var route4 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\children\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-uXTpvTTx.js"),
		"import": () => import("./assets/index-uXTpvTTx.js")
	},
	"$$route": { "require": () => ({ "route": route$21 }) },
	"path": "/children/"
};
var route5 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\expenses\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-CtumVXmR.js"),
		"import": () => import("./assets/index-CtumVXmR.js")
	},
	"$$route": { "require": () => ({ "route": route$20 }) },
	"path": "/expenses/"
};
var route6 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\families\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-BV8q2Vp4.js"),
		"import": () => import("./assets/index-BV8q2Vp4.js")
	},
	"$$route": { "require": () => ({ "route": route$19 }) },
	"path": "/families/"
};
var route7 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\families\\new.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/new-D6eAS0GU.js"),
		"import": () => import("./assets/new-D6eAS0GU.js")
	},
	"path": "/families/new"
};
var route8 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\payments\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-BpRYzeuB.js"),
		"import": () => import("./assets/index-BpRYzeuB.js")
	},
	"$$route": { "require": () => ({ "route": route$18 }) },
	"path": "/payments/"
};
var route9 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\portal\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-BWvVHL-r.js"),
		"import": () => import("./assets/index-BWvVHL-r.js")
	},
	"$$route": { "require": () => ({ "route": route$17 }) },
	"path": "/portal/"
};
var route10 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\portal\\today.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/today-DpEk8VAn.js"),
		"import": () => import("./assets/today-DpEk8VAn.js")
	},
	"$$route": { "require": () => ({ "route": route$16 }) },
	"path": "/portal/today"
};
var route11 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\reports\\calendar.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/calendar-DEi6C8R8.js"),
		"import": () => import("./assets/calendar-DEi6C8R8.js")
	},
	"$$route": { "require": () => ({ "route": route$15 }) },
	"path": "/reports/calendar"
};
var route12 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\reports\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-Bk04nycj.js"),
		"import": () => import("./assets/index-Bk04nycj.js")
	},
	"$$route": { "require": () => ({ "route": route$14 }) },
	"path": "/reports/"
};
var route13 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\reports\\tax-summary.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/tax-summary-BETXaqFr.js"),
		"import": () => import("./assets/tax-summary-BETXaqFr.js")
	},
	"$$route": { "require": () => ({ "route": route$13 }) },
	"path": "/reports/tax-summary"
};
var route14 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\reports\\year-end.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/year-end-C_yW1B33.js"),
		"import": () => import("./assets/year-end-C_yW1B33.js")
	},
	"$$route": { "require": () => ({ "route": route$12 }) },
	"path": "/reports/year-end"
};
var route15 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\schedule\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-Do8I7zCK.js"),
		"import": () => import("./assets/index-Do8I7zCK.js")
	},
	"$$route": { "require": () => ({ "route": route$11 }) },
	"path": "/schedule/"
};
var route16 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\services\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-tchxf5fe.js"),
		"import": () => import("./assets/index-tchxf5fe.js")
	},
	"$$route": { "require": () => ({ "route": route$10 }) },
	"path": "/services/"
};
var route17 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\unavailability\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-D0aagq8t.js"),
		"import": () => import("./assets/index-D0aagq8t.js")
	},
	"path": "/unavailability/"
};
var route18 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\unavailability\\new.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/new-CIcp4vnK.js"),
		"import": () => import("./assets/new-CIcp4vnK.js")
	},
	"path": "/unavailability/new"
};
var route19 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\children\\[id]\\edit.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/edit-D43wAp-F.js"),
		"import": () => import("./assets/edit-D43wAp-F.js")
	},
	"$$route": { "require": () => ({ "route": route$9 }) },
	"path": "/children/:id/edit"
};
var route20 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\children\\[id]\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-BSAeRIG6.js"),
		"import": () => import("./assets/index-BSAeRIG6.js")
	},
	"$$route": { "require": () => ({ "route": route$8 }) },
	"path": "/children/:id/"
};
var route21 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\families\\[id]\\edit.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/edit-Bs0Xf6ws.js"),
		"import": () => import("./assets/edit-Bs0Xf6ws.js")
	},
	"$$route": { "require": () => ({ "route": route$7 }) },
	"path": "/families/:id/edit"
};
var route22 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\families\\[id]\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-Bn-QKSMk.js"),
		"import": () => import("./assets/index-Bn-QKSMk.js")
	},
	"$$route": { "require": () => ({ "route": route$6 }) },
	"path": "/families/:id/"
};
var route23 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\unavailability\\[id]\\edit.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/edit-BoWi0K_6.js"),
		"import": () => import("./assets/edit-BoWi0K_6.js")
	},
	"$$route": { "require": () => ({ "route": route$5 }) },
	"path": "/unavailability/:id/edit"
};
var route24 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\families\\[id]\\children\\new.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/new-D6g8vDEl.js"),
		"import": () => import("./assets/new-D6g8vDEl.js")
	},
	"path": "/families/:id/children/new"
};
var route25 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\families\\[id]\\members\\new.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/new-BBBkUTHs.js"),
		"import": () => import("./assets/new-BBBkUTHs.js")
	},
	"path": "/families/:id/members/new"
};
var route26 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\families\\[id]\\schedules\\new.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/new-Bte_K_qu.js"),
		"import": () => import("./assets/new-Bte_K_qu.js")
	},
	"path": "/families/:id/schedules/new"
};
var route27 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\families\\[id]\\children\\[childId]\\edit.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/edit-CjdBIuV-.js"),
		"import": () => import("./assets/edit-CjdBIuV-.js")
	},
	"$$route": { "require": () => ({ "route": route$4 }) },
	"path": "/families/:id/children/:childId/edit"
};
var route28 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\families\\[id]\\children\\[childId]\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-C4DXjzym.js"),
		"import": () => import("./assets/index-C4DXjzym.js")
	},
	"$$route": { "require": () => ({ "route": route$3 }) },
	"path": "/families/:id/children/:childId/"
};
var route29 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\families\\[id]\\members\\[memberId]\\edit.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/edit-CXva6EyF.js"),
		"import": () => import("./assets/edit-CXva6EyF.js")
	},
	"$$route": { "require": () => ({ "route": route$2 }) },
	"path": "/families/:id/members/:memberId/edit"
};
var route30 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\families\\[id]\\sessions\\[sessionId]\\edit.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/edit-rvAgrYzT.js"),
		"import": () => import("./assets/edit-rvAgrYzT.js")
	},
	"$$route": { "require": () => ({ "route": route$1 }) },
	"path": "/families/:id/sessions/:sessionId/edit"
};
var route31 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\families\\[id]\\sessions\\[sessionId]\\index.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/index-DCxxpPPs.js"),
		"import": () => import("./assets/index-DCxxpPPs.js")
	},
	"$$route": { "require": () => ({ "route": route }) },
	"path": "/families/:id/sessions/:sessionId/"
};
var route32 = {
	"page": true,
	"$component": {
		"src": "src\\routes\\families\\[id]\\sessions\\[sessionId]\\reports\\new.tsx?pick=default&pick=$css&lang.tsx",
		"build": () => import("./assets/new-BznnmXws.js"),
		"import": () => import("./assets/new-BznnmXws.js")
	},
	"path": "/families/:id/sessions/:sessionId/reports/new"
};
var routes = [
	route0,
	route1,
	route2,
	route3,
	route4,
	route5,
	route6,
	route7,
	route8,
	route9,
	route10,
	route11,
	route12,
	route13,
	route14,
	route15,
	route16,
	route17,
	route18,
	route19,
	route20,
	route21,
	route22,
	route23,
	route24,
	route25,
	route26,
	route27,
	route28,
	route29,
	route30,
	route31,
	route32
];
var pageRoutes = [
	{
		...route1,
		id: "/",
		path: "/"
	},
	{
		...route3,
		id: "/*404",
		path: "/*404"
	},
	{
		...route2,
		id: "/login",
		path: "/login"
	},
	{
		...route0,
		id: "/account",
		path: "/account"
	},
	{
		...route9,
		id: "/portal/",
		path: "/portal/"
	},
	{
		...route12,
		id: "/reports/",
		path: "/reports/"
	},
	{
		...route4,
		id: "/children/",
		path: "/children/"
	},
	{
		...route5,
		id: "/expenses/",
		path: "/expenses/"
	},
	{
		...route6,
		id: "/families/",
		path: "/families/"
	},
	{
		...route8,
		id: "/payments/",
		path: "/payments/"
	},
	{
		...route15,
		id: "/schedule/",
		path: "/schedule/"
	},
	{
		...route16,
		id: "/services/",
		path: "/services/"
	},
	{
		...route7,
		id: "/families/new",
		path: "/families/new"
	},
	{
		...route10,
		id: "/portal/today",
		path: "/portal/today"
	},
	{
		...route20,
		id: "/children/:id/",
		path: "/children/:id/"
	},
	{
		...route22,
		id: "/families/:id/",
		path: "/families/:id/"
	},
	{
		...route17,
		id: "/unavailability/",
		path: "/unavailability/"
	},
	{
		...route11,
		id: "/reports/calendar",
		path: "/reports/calendar"
	},
	{
		...route14,
		id: "/reports/year-end",
		path: "/reports/year-end"
	},
	{
		...route19,
		id: "/children/:id/edit",
		path: "/children/:id/edit"
	},
	{
		...route21,
		id: "/families/:id/edit",
		path: "/families/:id/edit"
	},
	{
		...route18,
		id: "/unavailability/new",
		path: "/unavailability/new"
	},
	{
		...route13,
		id: "/reports/tax-summary",
		path: "/reports/tax-summary"
	},
	{
		...route23,
		id: "/unavailability/:id/edit",
		path: "/unavailability/:id/edit"
	},
	{
		...route25,
		id: "/families/:id/members/new",
		path: "/families/:id/members/new"
	},
	{
		...route24,
		id: "/families/:id/children/new",
		path: "/families/:id/children/new"
	},
	{
		...route26,
		id: "/families/:id/schedules/new",
		path: "/families/:id/schedules/new"
	},
	{
		...route28,
		id: "/families/:id/children/:childId/",
		path: "/families/:id/children/:childId/"
	},
	{
		...route31,
		id: "/families/:id/sessions/:sessionId/",
		path: "/families/:id/sessions/:sessionId/"
	},
	{
		...route27,
		id: "/families/:id/children/:childId/edit",
		path: "/families/:id/children/:childId/edit"
	},
	{
		...route29,
		id: "/families/:id/members/:memberId/edit",
		path: "/families/:id/members/:memberId/edit"
	},
	{
		...route30,
		id: "/families/:id/sessions/:sessionId/edit",
		path: "/families/:id/sessions/:sessionId/edit"
	},
	{
		...route32,
		id: "/families/:id/sessions/:sessionId/reports/new",
		path: "/families/:id/sessions/:sessionId/reports/new"
	}
];
//#endregion
//#region node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/fs.js
/**
* Converts the nested page entries of a file-system route manifest into
* route definitions: code-split `$component` refs become `lazy` components
* (their `src` doubles as the `moduleUrl` core resolves assets and islands
* against), eager refs — a manifest delivered with `codeSplitting: false` —
* pass their component through as-is (no `lazy` wrapper; the module is
* already statically imported), and each entry's `route` config export is
* spread into its definition. Pass the result to `createRouter({ routes })`.
*/
function fileRoutes(entries) {
	const components = /* @__PURE__ */ new Map();
	const componentOf = (ref) => {
		if ("require" in ref) return ref.require().default;
		let component = components.get(ref.src);
		if (!component) {
			component = lazy(ref.import, void 0, ref.src);
			components.set(ref.src, component);
		}
		return component;
	};
	const toRoute = (entry) => {
		const config = entry.$$route?.require().route ?? {};
		return {
			...config,
			path: entry.path,
			component: entry.$component ? componentOf(entry.$component) : void 0,
			info: {
				...config.info,
				filesystem: true
			},
			children: entry.children ? entry.children.map(toRoute) : void 0
		};
	};
	return entries.map(toRoute);
}
//#endregion
//#region src/router.tsx
var Router = createRouter({ routes: fileRoutes(pageRoutes) });
var { paths } = Router;
//#endregion
//#region src/App.tsx
var _tmpl$ = ["<div", " class=\"page-loading\">Loading...</div>"];
if (typeof document !== "undefined") initTheme();
function isLoginPath(pathname) {
	return pathname === "/login" || pathname.startsWith("/login?");
}
function AppRoot(props) {
	const location = useLocation();
	const onLogin = () => {
		if (isServer) try {
			const url = getRequestEvent()?.request?.url;
			if (url) return isLoginPath(new URL(url).pathname);
		} catch {}
		return isLoginPath(location.pathname);
	};
	return Show({
		get when() {
			return !onLogin();
		},
		get fallback() {
			return AppErrorBoundary({ get children() {
				return Loading({ get children() {
					return props.children;
				} });
			} });
		},
		get children() {
			return ConfirmProvider({ get children() {
				return AppShell({ get children() {
					return AppErrorBoundary({ get children() {
						return Loading({
							get fallback() {
								var _v$ = ssrHydrationKey();
								return ssr(_tmpl$, _v$);
							},
							get children() {
								return props.children;
							}
						});
					} });
				} });
			} });
		}
	});
}
function App() {
	return Router({ children: (props) => AppRoot({ get children() {
		return props.children;
	} }) });
}
//#endregion
//#region src/entry-server.tsx
function render(request, context) {
	return renderToStream(() => Document({ get children() {
		return App({});
	} }), { manifest: _virtual_solid_manifest_default });
}
//#endregion
//#region src/middleware/index.ts
async function resolveSessionProfile(userId) {
	const user = await db.user.findUnique({
		where: { id: userId },
		select: {
			isOwner: true,
			familyMember: { select: { familyId: true } }
		}
	});
	if (!user) return null;
	return {
		isOwner: user.isOwner,
		familyId: user.familyMember?.familyId ?? null
	};
}
function redirectResponse(location, request, cookieHeaders = []) {
	const headers = new Headers();
	for (const cookie of cookieHeaders) headers.append("Set-Cookie", cookie);
	return Response.redirect(new URL(location, request.url), 302);
}
async function authMiddleware(request, next) {
	const pathname = new URL(request.url).pathname;
	if (shouldSkipRouteGuard(pathname, request.method)) return next(request);
	const userId = (await readSessionData(request)).userId;
	if (isPublicRoute(pathname)) {
		if (!userId) return next(request);
		const profile = await resolveSessionProfile(userId);
		if (profile === null) return redirectResponse("/login", request, [await destroySessionCookie(), await serializeClearRoleCookie()]);
		return redirectResponse(authenticatedHomePath(profile.isOwner, profile.familyId), request, [await serializeRoleCookie(roleCookieValue(profile.isOwner))]);
	}
	if (!userId) return redirectResponse("/login", request);
	const profile = await resolveSessionProfile(userId);
	if (profile === null) return redirectResponse("/login", request, [await destroySessionCookie(), await serializeClearRoleCookie()]);
	const parentHome = authenticatedHomePath(false, profile.familyId);
	if (isOwnerRoute(pathname) && !profile.isOwner) return redirectResponse(parentHome, request);
	if (pathname === "/portal" && profile.isOwner) return redirectResponse("/", request);
	if (isAuthRoute(pathname)) return next(request);
	if (!isOwnerRoute(pathname) && !isAuthRoute(pathname) && pathname !== "/login") {
		if (!profile.isOwner) return redirectResponse(parentHome, request);
	}
	return next(request);
}
var middleware_default = [createAPIHandler(routes), authMiddleware];
//#endregion
//#region node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/server.js
function isRouterInstance(options) {
	return typeof options === "function";
}
/**
* Produces the `collectFlightData` implementation for
* `configureServerFunctionsServer` (or `handleServerFunctionRequest`
* options). Accepts a `createRouter` instance directly — its routes, base,
* and `preload` are the single source of truth — or an options object for
* trees not created through the factory.
*
* Strategy: rerun the route data for the URL the client will show after
* the mutation (the outcome's pre-digested `targetUrl`), collecting each
* `query` result under its cache key, scoped to the outcome's
* `revalidateKeys` when present (routes newly entered via redirect always
* collect fully). The returned payload seeds the client router's cache
* through its registered flight-data consumer.
*/
function createFlightDataCollector(options) {
	const { routes, rootPreload, base = "" } = isRouterInstance(options) ? {
		routes: options.routes,
		rootPreload: options.config.preload,
		base: options.config.base
	} : options;
	if (!routes) throw new Error("createFlightDataCollector requires `routes`");
	let branches;
	let compiledVersion = -1;
	const resolveBranches = () => {
		const version = peekLazySubtrees();
		if (!branches || compiledVersion !== version) {
			branches = createBranches(typeof routes === "function" ? routes() : routes, base);
			compiledVersion = version;
		}
		return branches;
	};
	return async (sourceEvent, outcome) => {
		const { targetUrl, revalidateKeys } = outcome;
		if (!targetUrl) return void 0;
		const previousUrl = outcome.request.headers.get("referer");
		const event = { ...sourceEvent };
		event.request = new Request(targetUrl, { headers: outcome.foldedHeaders });
		event.router = {
			dataOnly: revalidateKeys || true,
			previousUrl,
			data: {}
		};
		return provideRequestEvent(event, async () => {
			try {
				await resolveLazyMatches(resolveBranches, targetUrl, previousUrl);
				runPreloads(event, resolveBranches(), targetUrl, previousUrl, rootPreload);
			} catch (error) {
				console.error(error);
			}
			const data = event.router.data;
			if (!data) return void 0;
			let containsKey = false;
			for (const key in data) if (data[key] === void 0) delete data[key];
			else containsKey = true;
			return containsKey ? data : void 0;
		});
	};
}
async function resolveLazyMatches(resolveBranches, url, previousUrl) {
	for (;;) {
		const branches = resolveBranches();
		const target = new URL(url);
		const pending = [...getRouteMatches(branches, target.pathname), ...getRouteMatches(branches, new URL(previousUrl, target).pathname)].filter((m) => m.route.lazy && !m.route.lazy.resolved);
		if (!pending.length) return;
		await Promise.all(pending.map((m) => resolveLazySubtree(m.route.lazy)));
	}
}
function runPreloads(event, branches, url, previousUrl, rootPreload) {
	const target = new URL(url);
	const prevMatches = getRouteMatches(branches, new URL(previousUrl, target).pathname);
	const matches = getRouteMatches(branches, target.pathname);
	const location = {
		pathname: target.pathname,
		search: target.search,
		hash: target.hash,
		query: extractSearchParams(target),
		state: null,
		key: ""
	};
	rootPreload && rootPreload({
		params: mergeParams(matches),
		location,
		intent: "initial"
	});
	for (let match = 0; match < matches.length; match++) {
		if (!prevMatches[match] || matches[match].route !== prevMatches[match].route) event.router.dataOnly = true;
		const { route, params } = matches[match];
		route.preload && route.preload({
			params,
			location,
			intent: "preload"
		});
	}
}
//#endregion
//#region src/server-config.ts
configureServerFunctionsServer$1({ collectFlightData: createFlightDataCollector(Router) });
//#endregion
//#region virtual:solid-server-function-handler
configureServerFunctionsServer({
	provideEvent: provideRequestEvent,
	endpoint: "/_server"
});
function handleServerFunctionRequest$1(request, options) {
	const { event: eventInit, ...rest } = options || {};
	return handleServerFunctionRequest(request, {
		provideEvent: provideRequestEvent,
		...eventInit ? { createEvent: (req) => ({
			request: req,
			locals: {},
			...eventInit
		}) } : {},
		...rest
	});
}
//#endregion
//#region virtual:solid-ssr-handler
function joinAssetPath(base, file) {
	if (typeof base !== "string" || !base) base = "/";
	if (base[base.length - 1] !== "/") base += "/";
	return base + (file[0] === "/" ? file.slice(1) : file);
}
var clientEntryUrl;
function resolveClientEntry() {
	if (clientEntryUrl !== void 0) return clientEntryUrl;
	clientEntryUrl = null;
	for (const key in _virtual_solid_manifest_default) {
		const chunk = _virtual_solid_manifest_default[key];
		if (chunk && chunk.isEntry && chunk.file) {
			clientEntryUrl = joinAssetPath(_virtual_solid_manifest_default._base, chunk.file);
			break;
		}
	}
	return clientEntryUrl;
}
var middlewares = Array.isArray(middleware_default) ? middleware_default : [middleware_default];
for (const mw of middlewares) if (typeof mw !== "function") throw new Error("[@solidjs/vite-plugin] start.middleware must default-export a function or an array of functions: C:\\Websites\\new-lil-sprouts\\src\\middleware\\index.ts");
var runMiddleware = composeMiddleware(middlewares);
function escapeAttribute(value) {
	return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
function createHtmlChunkTransform(clientEntry, extraHead, nonce) {
	nonce && "" + escapeAttribute(nonce);
	let first = true;
	let injected = false;
	return (chunk) => {
		if (clientEntry && chunk.includes("/src/entry-client.tsx")) chunk = chunk.split("/src/entry-client.tsx").join(clientEntry);
		if (!injected && chunk.includes("</head>")) injected = true;
		if (first) {
			first = false;
			chunk = "<!DOCTYPE html>" + chunk;
		}
		return chunk;
	};
}
async function dispatchRequest(request, event, options) {
	if (new URL(request.url).pathname === "/_server") return handleServerFunctionRequest$1(request, {
		createEvent: () => event,
		...options.serverFunctions
	});
	const clientEntry = options.clientEntry || resolveClientEntry();
	let result = render(request, {
		clientEntry,
		...options.context
	});
	if (result && typeof result.pipe !== "function" && typeof result.then === "function") result = await result;
	if (result instanceof Response) return result;
	return createSSRResponse(result, event, {
		responseInit: options.responseInit,
		nonce: options.nonce,
		transformChunk: createHtmlChunkTransform(clientEntry, options.devHead, options.nonce)
	});
}
async function handleRequest(request, options = {}) {
	const event = createRequestEvent(request, options.event);
	const response = await provideRequestEvent(event, () => runMiddleware(request, (req) => dispatchRequest(req || request, event, options)));
	return commitEventResponse(response, event);
}
var virtual_solid_ssr_handler_default = { fetch(request) {
	return handleRequest(request);
} };
//#endregion
export { updateFamily as $, createPayment as A, deleteExpense as B, getServices as C, updatePassword as Ct, getMyDailyDigest as D, getMyChildReports as E, getChild as F, updateStandaloneExpense as G, getSessionExpenseTotal as H, getChildren as I, getWeeklyStats as J, getDashboardStats as K, updateChild as L, getUnpaidSessions as M, createChild as N, getMyFamily as O, getAllChildren as P, getFamily as Q, createExpense as R, getService as S, loginOrRegister as St, confirmMySession as T, useSubmission as Tt, getSessionExpenses as U, getExpenses as V, updateExpense as W, formatParentNames as X, createFamily as Y, getFamilies as Z, getAllYearEndReports as _, getDefaultPianoLessonRate as _t, createCareSchedule as a, getCareSessionsForRange as at, createService as b, Dialog as bt, getCareSchedules as c, getUpcomingSessions as ct, updateCareSchedule as d, virtual_solid_ssr_handler_default as default, formatDateLocal as dt, createSessionReport as et, createFamilyMember as f, formatDateTimeLocal as ft, getAllFamiliesForReports as g, getDefaultHourlyRate as gt, updateFamilyMember as h, handleRequest, utcToDatetimeLocal as ht, updateUnavailability as i, getCareSession as it, getPayments as j, getMyUpcomingSessions as k, recordDropOff as l, updateCareSession as lt, getFamilyMembers as m, isSameDay as mt, getUnavailability as n, getSessionReports as nt, deleteCareSchedule as o, getSessionsForDay as ot, getFamilyMember as p, formatTimeLocal as pt, getStatsForPeriod as q, getUpcomingUnavailabilities as r, editCareSessionFull as rt, generateSessionsFromSchedule as s, getUnavailabilitiesForRange as st, createUnavailability as t, getRecentReports as tt, recordPickUp as u, ensureDate as ut, getAnnualTaxSummary as v, setSetting as vt, updateService as w, updateUser as wt, getAllServices as x, getUser as xt, getYearEndFamilyReport as y, useConfirm as yt, createStandaloneExpense as z };
