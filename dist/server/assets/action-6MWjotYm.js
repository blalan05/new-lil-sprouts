import { REVALIDATE_HEADER, clearFlashCookie, delegateEvents, getRequestEvent, getServerFunctionMetadata, getServerFunctionRPC, hasFlashCookie, isResponseEnvelope, isServer, isServerFunction } from "@solidjs/web";
import { $TRACK, DEV, NotReadyError, action, createComponent, createContext, createMemo, createSignal, flush, getObserver, getOwner, isPending, onCleanup, runWithOwner, sharedConfig, untrack, useContext } from "solid-js";
import { createServerReference, decodeResponsePayload, subscribeFlightData } from "@solidjs/web/server-functions";
import { decodeFlashCookie } from "@solidjs/web/server-functions/server";
//#region node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/utils.js
var hasSchemeRegex = /^(?:[a-z0-9]+:)?\/\//i;
var trimPathRegex = /^\/+|(\/)\/+$/g;
var mockBase = "http://sr";
function normalizePath(path, omitSlash = false) {
	const s = path.replace(trimPathRegex, "$1");
	return s ? omitSlash || /^[?#]/.test(s) ? s : "/" + s : "";
}
/** Pathname stripped of search/hash and trailing slash, lowercased — the form link matching compares. */
var comparablePath = (path) => normalizePath(path.split(/[?#]/, 1)[0]).toLowerCase().replace(/\/$/, "");
function resolvePath(base, path, from) {
	if (hasSchemeRegex.test(path)) return;
	const basePath = normalizePath(base);
	const fromPath = from && normalizePath(from);
	let result = "";
	if (!fromPath || path.startsWith("/")) result = basePath;
	else if (fromPath.toLowerCase().indexOf(basePath.toLowerCase()) !== 0) result = basePath + fromPath;
	else result = fromPath;
	return (result || "/") + normalizePath(path, !result);
}
function invariant(value, message) {
	if (value == null) throw new Error(message);
	return value;
}
function joinPaths(from, to) {
	return normalizePath(from).replace(/\/*(\*.*)?$/g, "") + normalizePath(to);
}
function extractSearchParams(url) {
	const params = {};
	url.searchParams.forEach((value, key) => {
		if (key in params) {
			if (Array.isArray(params[key])) params[key].push(value);
			else params[key] = [params[key], value];
		} else params[key] = value;
	});
	return params;
}
function createMatcher(path, partial, matchFilters) {
	const [pattern, splat] = path.split("/*", 2);
	const segments = pattern.split("/").filter(Boolean);
	const len = segments.length;
	return (location) => {
		const locSegments = location.split("/");
		if (locSegments[0] === "") locSegments.shift();
		if (locSegments.length && locSegments[locSegments.length - 1] === "") locSegments.pop();
		if (locSegments.includes("")) return null;
		const lenDiff = locSegments.length - len;
		if (lenDiff < 0 || lenDiff > 0 && splat === void 0 && !partial) return null;
		const match = {
			path: len ? "" : "/",
			params: {}
		};
		const matchFilter = (s) => matchFilters === void 0 ? void 0 : matchFilters[s];
		for (let i = 0; i < len; i++) {
			const segment = segments[i];
			const dynamic = segment[0] === ":";
			const locSegment = dynamic ? locSegments[i] : locSegments[i].toLowerCase();
			const key = dynamic ? segment.slice(1) : segment.toLowerCase();
			if (dynamic && matchSegment(locSegment, matchFilter(key))) match.params[key] = locSegment;
			else if (dynamic || !matchSegment(locSegment, key)) return null;
			match.path += `/${locSegment}`;
		}
		if (splat) {
			const remainder = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
			if (matchSegment(remainder, matchFilter(splat))) match.params[splat] = remainder;
			else return null;
		}
		return match;
	};
}
function matchSegment(input, filter) {
	const isEqual = (s) => s === input;
	if (filter === void 0) return true;
	else if (typeof filter === "string") return isEqual(filter);
	else if (typeof filter === "function") return filter(input);
	else if (Array.isArray(filter)) return filter.some(isEqual);
	else if (filter instanceof RegExp) return filter.test(input);
	return false;
}
function scoreRoute(route) {
	const [pattern, splat] = route.pattern.split("/*", 2);
	const segments = pattern.split("/").filter(Boolean);
	return segments.reduce((score, segment) => score + (segment.startsWith(":") ? 2 : 3), segments.length - (splat === void 0 ? 0 : 1));
}
function createMemoObject(fn) {
	const map = /* @__PURE__ */ new Map();
	const owner = getOwner();
	return new Proxy({}, {
		get(_, property) {
			if (!map.has(property)) runWithOwner(owner, () => map.set(property, createMemo(() => fn()[property])));
			return map.get(property)();
		},
		getOwnPropertyDescriptor() {
			return {
				enumerable: true,
				configurable: true
			};
		},
		ownKeys() {
			return Reflect.ownKeys(fn());
		},
		has(_, property) {
			return property in fn();
		}
	});
}
function mergeSearchString(search, params) {
	const merged = new URLSearchParams(search);
	Object.entries(params).forEach(([key, value]) => {
		if (value == null || value === "" || value instanceof Array && !value.length) merged.delete(key);
		else if (value instanceof Array) {
			merged.delete(key);
			value.forEach((v) => {
				merged.append(key, String(v));
			});
		} else merged.set(key, String(value));
	});
	const s = merged.toString();
	return s ? `?${s}` : "";
}
function expandOptionals(pattern) {
	let match = /(\/?\:[^\/]+)\?/.exec(pattern);
	if (!match) return [pattern];
	let prefix = pattern.slice(0, match.index);
	let suffix = pattern.slice(match.index + match[0].length);
	const prefixes = [prefix, prefix += match[1]];
	while (match = /^(\/\:[^\/]+)\?/.exec(suffix)) {
		prefixes.push(prefix += match[1]);
		suffix = suffix.slice(match[0].length);
	}
	return expandOptionals(suffix).reduce((results, expansion) => [...results, ...prefixes.map((p) => p + expansion)], []);
}
function setFunctionName(obj, value) {
	Object.defineProperty(obj, "name", {
		value,
		writable: false,
		configurable: false
	});
	return obj;
}
//#endregion
//#region node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/data/events.js
var formHandler;
function setRouterFormHandler(handler) {
	formHandler = handler;
}
function setupNativeEvents({ preload = true, explicitLinks = false, actionBase = "/_server", transformUrl } = {}) {
	return (router) => {
		const basePath = router.base.path();
		const navigateFromRoute = router.navigatorFactory(router.base);
		let preloadTimeout;
		let lastElement;
		function isSvg(el) {
			return el.namespaceURI === "http://www.w3.org/2000/svg";
		}
		function handleAnchor(evt) {
			if (evt.defaultPrevented || evt.button !== 0 || evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey) return;
			const a = evt.composedPath().find((el) => el instanceof Node && el.nodeName.toUpperCase() === "A");
			if (!a || explicitLinks && !a.hasAttribute("link")) return;
			const svg = isSvg(a);
			const href = svg ? a.href.baseVal : a.href;
			if ((svg ? a.target.baseVal : a.target) || !href && !a.hasAttribute("state")) return;
			const rel = (a.getAttribute("rel") || "").split(/\s+/);
			if (a.hasAttribute("download") || rel && rel.includes("external")) return;
			const url = svg ? new URL(href, document.baseURI) : new URL(href);
			if (url.protocol !== "https:" && url.protocol !== "http:") return;
			if (url.origin !== window.location.origin || basePath && url.pathname && !url.pathname.toLowerCase().startsWith(basePath.toLowerCase())) return;
			return [a, url];
		}
		function handleAnchorClick(evt) {
			const res = handleAnchor(evt);
			if (!res) return;
			const [a, url] = res;
			const to = router.parsePath(url.pathname + url.search + url.hash);
			const state = a.getAttribute("state");
			evt.preventDefault();
			navigateFromRoute(to, {
				resolve: false,
				replace: a.hasAttribute("replace"),
				scroll: !a.hasAttribute("noscroll"),
				state: state ? JSON.parse(state) : void 0
			});
		}
		function handleAnchorPreload(evt) {
			const res = handleAnchor(evt);
			if (!res) return;
			const [a, url] = res;
			transformUrl && (url.pathname = transformUrl(url.pathname));
			router.preloadRoute(url, a.getAttribute("preload") !== "false");
		}
		function handleAnchorMove(evt) {
			clearTimeout(preloadTimeout);
			const res = handleAnchor(evt);
			if (!res) return lastElement = null;
			const [a, url] = res;
			if (lastElement === a) return;
			transformUrl && (url.pathname = transformUrl(url.pathname));
			preloadTimeout = setTimeout(() => {
				router.preloadRoute(url, a.getAttribute("preload") !== "false");
				lastElement = a;
			}, 20);
		}
		function handleFormSubmit(evt) {
			if (formHandler) return formHandler(evt, router, actionBase);
			if (evt.defaultPrevented) return;
			const form = evt.target;
			const ref = evt.submitter && evt.submitter.hasAttribute("formaction") ? evt.submitter.getAttribute("formaction") : form.getAttribute("action");
			if (!ref || ref.startsWith("https://action/")) return;
			const url = new URL(ref, document.baseURI);
			const path = router.parsePath(url.pathname + url.search);
			if (!path.startsWith(actionBase) || form.method.toUpperCase() !== "POST") return;
			evt.preventDefault();
			const data = new FormData(form, evt.submitter);
			import("./serverForms-Cjbaijz5.js").then((m) => m.submitServerForm(router, path, form, data));
		}
		delegateEvents(["click", "submit"]);
		document.addEventListener("click", handleAnchorClick);
		if (preload) {
			document.addEventListener("mousemove", handleAnchorMove, { passive: true });
			document.addEventListener("focusin", handleAnchorPreload, { passive: true });
			document.addEventListener("touchstart", handleAnchorPreload, { passive: true });
		}
		document.addEventListener("submit", handleFormSubmit);
		onCleanup(() => {
			document.removeEventListener("click", handleAnchorClick);
			if (preload) {
				document.removeEventListener("mousemove", handleAnchorMove);
				document.removeEventListener("focusin", handleAnchorPreload);
				document.removeEventListener("touchstart", handleAnchorPreload);
			}
			document.removeEventListener("submit", handleFormSubmit);
		});
	};
}
//#endregion
//#region node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/routing.js
var MAX_REDIRECTS = 100;
/** Consider this API opaque and internal. It is likely to change in the future. */
var RouterContextObj = createContext();
var RouteContextObj = createContext();
function useOptionalContext(context) {
	try {
		return useContext(context);
	} catch {
		return;
	}
}
var useRouter = () => invariant(useContext(RouterContextObj), "<A> and 'use' router primitives can be only used inside a Route.");
var useRoute = () => useOptionalContext(RouteContextObj) || useRouter().base;
/**
* Retrieves method to do navigation. The method accepts a path to navigate to and an optional object with the following options:
*
* - resolve (*boolean*, default `true`): resolve the path against the current route
* - replace (*boolean*, default `false`): replace the history entry
* - scroll (*boolean*, default `true`): scroll to top after navigation
* - state (*any*, default `undefined`): pass custom state to `location.state`
*
* **Note**: The state is serialized using the structured clone algorithm which does not support all object types.
*
* @example
* ```js
* const navigate = useNavigate();
*
* if (unauthorized) {
*   navigate("/login", { replace: true });
* }
* ```
*/
var useNavigate = () => useRouter().navigatorFactory();
/**
* Retrieves reactive `location` object useful for getting things like `pathname`.
*
* @example
* ```js
* const location = useLocation();
*
* const pathname = createMemo(() => parsePath(location.pathname));
* ```
*/
var useLocation = () => useRouter().location;
function useParams(_path) {
	return useRoute().params;
}
function useSearchParams(path) {
	const router = useRouter();
	const location = router.location;
	const navigate = useNavigate();
	const setSearchParams = (params, options) => {
		const to = untrack(() => {
			const pending = router.pendingTarget && new URL(router.pendingTarget.value, "http://sr");
			const pathname = pending ? pending.pathname : location.pathname;
			const search = pending ? pending.search : location.search;
			const hash = pending ? pending.hash : location.hash;
			return pathname + mergeSearchString(search, params) + hash;
		});
		navigate(to, {
			scroll: false,
			resolve: false,
			...options
		});
	};
	return [path ? createMemoObject(createMemo(() => {
		const raw = { ...location.query };
		let result;
		for (const match of router.matches()) {
			const schema = match.route.key.search;
			if (!schema) continue;
			const outcome = schema["~standard"].validate(raw);
			if (outcome instanceof Promise) throw new Error("Async Standard Schema validation is not supported for search params");
			if (!outcome.issues) result = Object.assign(result || { ...raw }, outcome.value);
		}
		return result || raw;
	})) : location.query, setSearchParams];
}
var encodeSegment = (s) => encodeURIComponent(s).replace(/%(2B|40|3A|24|26|2C|3B|3D)/g, (m) => decodeURIComponent(m));
var lazyBoundaries = /* @__PURE__ */ new WeakMap();
var [lazyTreeVersion, setLazyTreeVersion] = createSignal(0);
/** Reactive read of the lazy-subtree version — recompile compiled branches when it changes. */
function trackLazySubtrees() {
	return lazyTreeVersion();
}
/** Non-reactive read, for cache-busting outside the reactive graph (server collectors). */
function peekLazySubtrees() {
	return untrack(lazyTreeVersion);
}
function getLazyBoundary(thunk) {
	let record = lazyBoundaries.get(thunk);
	if (!record) lazyBoundaries.set(thunk, record = { thunk });
	return record;
}
/**
* Kicks (or joins) a boundary's resolution. Returns the resolved routes
* synchronously once available, the in-flight promise otherwise.
*
* Failure contract (same as solid's lazy(), 2.0.0-rc.1: the platform
* re-fetches a failed dynamic import): a client rejection is held through its
* settlement flush. The recomputes the settled promise triggers — the parked
* transition's and the mainline commit's — both consume it here as a
* synchronous throw, becoming cached error status that reaches the nearest
* error boundary like a failed lazy() component. The hold clears a microtask
* after the first delivery, so any later recompute — boundary reset(), a new
* navigation — finds a clean record and retries the import. Holding through
* the flush is what keeps the erroring computation from refiring the import
* in a tight loop while it fails. Server records are shared across requests
* and hold nothing — each request retries. Commit is always async — even for
* thunks returning arrays — so the version bump never writes a signal from
* inside a render computation.
*/
function resolveLazySubtree(record) {
	if (record.resolved) return record.resolved;
	if (record.error !== void 0) {
		if (!record.sweep) {
			record.sweep = true;
			queueMicrotask(() => record.error = record.sweep = void 0);
		}
		throw record.error;
	}
	return record.promise ||= Promise.resolve(record.thunk()).then((m) => {
		record.resolved = Array.isArray(m) ? m : m.default || m.routes || [];
		setLazyTreeVersion((v) => v + 1);
		return record.resolved;
	}, (e) => {
		if (!isServer) record.error = e ?? /* @__PURE__ */ new Error();
		record.promise = void 0;
		throw e;
	});
}
/**
* The unresolved boundaries in a match chain. Rendering gates on these (the
* route-states memo suspends until they land — see routers/components.tsx)
* and the server's flight collector awaits them before its preload pass.
*/
function unresolvedLazyMatches(matches) {
	const pending = [];
	for (const match of matches) if (match.route.lazy && !match.route.lazy.resolved) pending.push(match.route.lazy);
	return pending;
}
function createLazyPlaceholder(pattern, record) {
	const placeholderPattern = pattern + "/*";
	return {
		key: record,
		originalPath: "*",
		pattern: placeholderPattern,
		matcher: createMatcher(placeholderPattern),
		lazy: record
	};
}
function createRoutes(routeDef, base = "") {
	const { component, preload, children, info } = routeDef;
	const isLeaf = !children || Array.isArray(children) && !children.length;
	const shared = {
		key: routeDef,
		component,
		preload,
		info
	};
	return asArray(routeDef.path).reduce((acc, originalPath) => {
		for (const expandedPath of expandOptionals(originalPath)) {
			const path = joinPaths(base, expandedPath);
			let pattern = isLeaf ? path : path.split("/*", 1)[0];
			pattern = pattern.split("/").map((s) => {
				return s.startsWith(":") || s.startsWith("*") ? s : encodeSegment(s);
			}).join("/");
			acc.push({
				...shared,
				originalPath,
				pattern,
				matcher: createMatcher(pattern, !isLeaf, routeDef.matchFilters)
			});
		}
		return acc;
	}, []);
}
function createBranch(routes, index = 0) {
	return {
		routes,
		score: scoreRoute(routes[routes.length - 1]) * 1e4 - index,
		matcher(location) {
			const matches = [];
			for (let i = routes.length - 1; i >= 0; i--) {
				const route = routes[i];
				const match = route.matcher(location);
				if (!match) return null;
				matches.unshift({
					...match,
					route
				});
			}
			return matches;
		}
	};
}
function asArray(value) {
	return Array.isArray(value) ? value : [value];
}
function createBranches(routeDef, base = "", stack = [], branches = []) {
	const routeDefs = asArray(routeDef);
	for (let i = 0, len = routeDefs.length; i < len; i++) {
		const def = routeDefs[i];
		if (def && typeof def === "object") {
			if (!def.hasOwnProperty("path")) def.path = "";
			const routes = createRoutes(def, base);
			for (const route of routes) {
				stack.push(route);
				let children = def.children;
				if (typeof children === "function") {
					const record = getLazyBoundary(children);
					if (record.resolved) children = record.resolved;
					else {
						stack.push(createLazyPlaceholder(route.pattern, record));
						branches.push(createBranch([...stack], branches.length));
						stack.pop();
						stack.pop();
						continue;
					}
				}
				const isEmptyArray = Array.isArray(children) && children.length === 0;
				if (children && !isEmptyArray) createBranches(children, route.pattern, stack, branches);
				else {
					const branch = createBranch([...stack], branches.length);
					branches.push(branch);
				}
				stack.pop();
			}
		}
	}
	return stack.length ? branches : branches.sort((a, b) => b.score - a.score);
}
function getRouteMatches(branches, location) {
	for (let i = 0, len = branches.length; i < len; i++) {
		const match = branches[i].matcher(location);
		if (match) return match;
	}
	return [];
}
function mergeParams(matches) {
	const params = {};
	for (let i = 0; i < matches.length; i++) Object.assign(params, matches[i].params);
	return params;
}
function createLocation(path, state, queryWrapper) {
	const origin = new URL(mockBase);
	const url = createMemo((prev = origin) => {
		const path_ = path();
		try {
			return new URL(path_[0] === "/" ? mockBase + path_ : path_, origin);
		} catch (err) {
			DEV && console.error(`Invalid path ${path_}`);
			return prev;
		}
	}, { equals: (a, b) => a.href === b.href });
	const pathname = createMemo(() => url().pathname);
	const search = createMemo(() => url().search);
	const hash = createMemo(() => url().hash);
	const key = () => "";
	const queryFn = createMemo(() => extractSearchParams(url()));
	return {
		get pathname() {
			return pathname();
		},
		get search() {
			return search();
		},
		get hash() {
			return hash();
		},
		get state() {
			return state();
		},
		get key() {
			return key();
		},
		query: queryWrapper ? queryWrapper(queryFn) : createMemoObject(queryFn)
	};
}
/**
* Rendezvous between the router and the data layer's single-flight consumer.
* The Router registers itself at mount (unless `singleFlight={false}`); the
* action side provides the consumer factory when the first action is created
* (see data/action.ts). Whichever side arrives first waits for the other, so
* an action module loaded lazily (a code-split route) still attaches to the
* already-mounted router — and a router-only app, where no action ever
* loads, never subscribes to the transport, so the server is never asked to
* collect.
*/
var flightConsumerFactory;
var flightRouters = /* @__PURE__ */ new Map();
function registerFlightRouter(router) {
	flightRouters.set(router, flightConsumerFactory && flightConsumerFactory(router));
	return () => {
		const unsubscribe = flightRouters.get(router);
		flightRouters.delete(router);
		unsubscribe && unsubscribe();
	};
}
function provideFlightConsumer(factory) {
	if (flightConsumerFactory) return;
	flightConsumerFactory = factory;
	for (const [router, unsubscribe] of flightRouters) if (!unsubscribe) flightRouters.set(router, factory(router));
}
/**
* The flash-cookie codec, provided by the action side (data/action.ts) so
* the router core never carries it: the core consumes the cookie eagerly
* per request (detection + one-shot clear via the runtime's isomorphic half)
* but defers decoding to this slot, read when the submissions signal
* initializes. Actions are created at module scope, so on the server the
* decoder is always installed before useSubmission can read — and a
* router-only app, where it never installs, has no actions that could have
* produced a flash cookie in the first place.
*/
var flashDecoder;
function provideFlashDecoder(decoder) {
	flashDecoder || (flashDecoder = decoder);
}
var intent;
function getIntent() {
	return intent;
}
var inPreloadFn = false;
function getInPreloadFn() {
	return inPreloadFn;
}
function setInPreloadFn(value) {
	inPreloadFn = value;
}
function createRouterContext(integration, branches, getContext, options = {}) {
	const { signal: [source, setSource], utils = {} } = integration;
	const parsePath = utils.parsePath || ((p) => p);
	const renderPath = utils.renderPath || ((p) => p);
	const beforeLeave = utils.beforeLeave || {};
	const basePath = resolvePath("", options.base || "");
	const initialSource = untrack(source);
	if (basePath === void 0) throw new Error(`${basePath} is not a valid base path`);
	else if (basePath && !initialSource.value) setSource({
		value: basePath,
		replace: true,
		scroll: false
	});
	const [isNavigating, setIsRouting] = createSignal(false, { ownedWrite: true });
	const [navigateTarget, setNavigateTarget] = createSignal(void 0, { ownedWrite: true });
	let lastTransitionTarget;
	const effective = createMemo(() => navigateTarget() ?? source());
	const location = createLocation(() => effective().value, () => effective().state, utils.queryWrapper);
	const referrers = [];
	let flashCookieHeader;
	if (isServer) {
		const e = getRequestEvent();
		if (e && !(e.router && e.router.submission)) {
			const cookieHeader = e.request.headers.get("cookie");
			if (hasFlashCookie(cookieHeader)) {
				flashCookieHeader = cookieHeader;
				if (e.response && e.response.headers) e.response.headers.append("Set-Cookie", clearFlashCookie());
			}
		}
	}
	let submissions;
	const matches = createMemo(() => {
		const pathname = typeof options.transformUrl === "function" ? options.transformUrl(location.pathname) : location.pathname;
		const m = getRouteMatches(branches(), pathname);
		const pending = unresolvedLazyMatches(m);
		if (pending.length) {
			const all = Promise.all(pending.map(resolveLazySubtree));
			all.catch(() => {});
			throw new NotReadyError(all);
		}
		return m;
	});
	const isRouting = createMemo(() => isNavigating() || isPending(() => {
		try {
			matches();
		} catch (e) {
			if (e instanceof NotReadyError) throw e;
		}
		location.search;
		location.hash;
	}));
	const buildParams = () => mergeParams(matches());
	const wrapParams = utils.paramsWrapper ? (getParams) => utils.paramsWrapper(getParams, branches) : (getParams) => createMemoObject(getParams);
	const params = wrapParams(buildParams);
	const baseRoute = {
		pattern: basePath,
		params,
		path: () => basePath,
		outlet: () => null,
		resolvePath(to) {
			return resolvePath(basePath, to);
		}
	};
	return {
		base: baseRoute,
		location,
		params,
		wrapParams,
		isRouting,
		get pendingTarget() {
			return lastTransitionTarget;
		},
		renderPath,
		parsePath,
		navigatorFactory,
		matches,
		beforeLeave,
		preloadRoute,
		singleFlight: options.singleFlight === void 0 ? true : options.singleFlight,
		get submissions() {
			return submissions ||= createSignal(isServer ? initSubmissions() : [], { ownedWrite: true });
		}
	};
	function navigateFromRoute(route, to, options) {
		untrack(() => {
			if (typeof to === "number") {
				if (!to) {} else if (utils.go) utils.go(to);
				else DEV && console.warn("Router integration does not support relative routing");
				return;
			}
			if (typeof to !== "string") to = to.toString();
			const { replace, resolve, scroll, state: nextState } = {
				replace: false,
				resolve: true,
				scroll: true,
				...options
			};
			let resolvedTo;
			if (!resolve) resolvedTo = resolvePath((!to || to[0] === "?") && location.pathname || "", to);
			else if (to[0] === "/") resolvedTo = route.resolvePath(to);
			else {
				const url = new URL(to, mockBase + location.pathname + location.search + location.hash);
				resolvedTo = url.origin === "http://sr" ? url.pathname + url.search + url.hash : void 0;
			}
			if (resolvedTo === void 0) throw new Error(`Path '${to}' is not a routable path`);
			else if (referrers.length >= MAX_REDIRECTS) throw new Error("Too many redirects");
			const current = effective();
			if (resolvedTo !== current.value || nextState !== current.state) {
				if (isServer) {
					const e = getRequestEvent();
					e && (e.response = {
						status: 302,
						headers: new Headers({ Location: resolvedTo })
					});
					setSource({
						value: resolvedTo,
						replace,
						scroll,
						state: nextState
					});
				} else if (!beforeLeave.current || beforeLeave.current.confirm(resolvedTo, options)) {
					referrers.push({
						value: current.value,
						replace,
						scroll,
						state: current.state
					});
					const newTarget = {
						value: resolvedTo,
						state: nextState
					};
					const firstNavigation = lastTransitionTarget === void 0;
					intent = "navigate";
					lastTransitionTarget = newTarget;
					if (firstNavigation) {
						setIsRouting(true);
						flush();
					}
					if (lastTransitionTarget === newTarget) {
						setNavigateTarget({ ...lastTransitionTarget });
						queueMicrotask(() => {
							if (lastTransitionTarget !== newTarget) return;
							intent = void 0;
							navigateEnd(lastTransitionTarget);
							setNavigateTarget(void 0);
							setIsRouting(false);
							lastTransitionTarget = void 0;
						});
					}
				}
			}
		});
	}
	function navigatorFactory(route) {
		route = route || useOptionalContext(RouteContextObj) || baseRoute;
		return (to, options) => navigateFromRoute(route, to, options);
	}
	function navigateEnd(next) {
		const first = referrers[0];
		if (first) {
			setSource({
				...next,
				replace: first.replace,
				scroll: first.scroll
			});
			referrers.length = 0;
		}
	}
	function preloadRoute(url, preloadData) {
		const matches = getRouteMatches(branches(), url.pathname);
		const boundary = matches.find((m) => m.route.lazy && !m.route.lazy.resolved);
		if (boundary) try {
			resolveLazySubtree(boundary.route.lazy).then(() => preloadRoute(url, preloadData), () => {});
		} catch {}
		const prevIntent = intent;
		intent = "preload";
		for (let match in matches) {
			const { route, params } = matches[match];
			route.component && route.component.preload && route.component.preload();
			const { preload } = route;
			inPreloadFn = true;
			preloadData && preload && runWithOwner(getContext(), () => preload({
				params,
				location: {
					pathname: url.pathname,
					search: url.search,
					hash: url.hash,
					query: extractSearchParams(url),
					state: null,
					key: ""
				},
				intent: "preload"
			}));
			inPreloadFn = false;
		}
		intent = prevIntent;
	}
	function initSubmissions() {
		const e = getRequestEvent();
		const submission = e && e.router && e.router.submission || (flashDecoder && flashCookieHeader !== void 0 ? flashDecoder(flashCookieHeader) : void 0);
		if (!submission) return [];
		return [{
			...submission,
			clear() {},
			retry() {}
		}];
	}
}
function createRouteContext(router, parent, outlet, match, matches = () => [match()]) {
	const { base, location, wrapParams } = router;
	const { pattern, component, preload } = match().route;
	const path = createMemo(() => match().path);
	const params = wrapParams(() => mergeParams(matches()));
	component && component.preload && component.preload();
	inPreloadFn = true;
	const data = preload ? preload({
		params,
		location,
		intent: intent || "initial"
	}) : void 0;
	inPreloadFn = false;
	return {
		parent,
		pattern,
		params,
		path,
		outlet: () => component ? createComponent(component, {
			params,
			location,
			data,
			get children() {
				return outlet();
			}
		}) : outlet(),
		resolvePath(to) {
			return resolvePath(base.path(), to, path());
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/data/query.js
var LocationHeader = "Location";
var PRELOAD_TIMEOUT = 5e3;
var CACHE_TIMEOUT = 18e4;
var bootTime = Date.now();
var cacheMap = /* @__PURE__ */ new Map();
if (!isServer) setInterval(() => {
	const now = Date.now();
	for (let [k, v] of cacheMap.entries()) if (!v[4].count && now - v[0] > CACHE_TIMEOUT) cacheMap.delete(k);
}, 3e5);
function getCache() {
	if (!isServer) return cacheMap;
	const req = getRequestEvent();
	if (!req) throw new Error("Cannot find cache context");
	return (req.router || (req.router = {})).cache || (req.router.cache = /* @__PURE__ */ new Map());
}
/**
* Revalidates the given cache entry/entries.
*/
function revalidate(key, force = true) {
	const now = Date.now();
	cacheKeyOp(key, (entry) => {
		force && (entry[0] = 0);
		entry[4][1](now);
	});
}
function cacheKeyOp(key, fn) {
	key && !Array.isArray(key) && (key = [key]);
	for (let k of cacheMap.keys()) if (key === void 0 || matchKey(k, key)) fn(cacheMap.get(k));
}
function query(fn, name) {
	if (isServerFunction(fn) && !getServerFunctionMetadata(fn)?.method) {
		const rpc = getServerFunctionRPC();
		if (rpc) fn = rpc.GET(fn);
	}
	const cachedFn = ((...args) => {
		const cache = getCache();
		const intent = getIntent();
		const inPreloadFn = getInPreloadFn();
		const router = getOwner() ? useRouter() : void 0;
		const navigate = router && router.navigatorFactory();
		const now = Date.now();
		const key = name + hashKey(args);
		let cached = cache.get(key);
		let tracking;
		if (isServer) {
			const e = getRequestEvent();
			if (e) {
				const dataOnly = (e.router || (e.router = {})).dataOnly;
				if (dataOnly) {
					const data = e && (e.router.data || (e.router.data = {}));
					if (data && key in data) return data[key];
					if (Array.isArray(dataOnly) && !matchKey(key, dataOnly)) {
						data[key] = void 0;
						return Promise.resolve();
					}
				}
			}
		}
		if (getObserver() && !isServer) {
			tracking = true;
			onCleanup(() => cached[4].count--);
		}
		if (cached && cached[0] && (isServer || intent === "native" || cached[4].count || Date.now() - cached[0] < PRELOAD_TIMEOUT)) {
			if (tracking) {
				cached[4].count++;
				cached[4][0]();
			}
			if (cached[3] === "preload" && intent !== "preload") cached[0] = now;
			let res = cached[1];
			if (intent !== "preload") {
				res = "then" in cached[1] ? cached[1].then(handleResponse(false), handleResponse(true)) : handleResponse(false)(cached[1]);
				!isServer && intent === "navigate" && cached[4][1](cached[0]);
			}
			inPreloadFn && "then" in res && res.catch(() => {});
			return res;
		}
		let res;
		let adopted = false;
		if (!isServer && sharedConfig.has && sharedConfig.has(key)) {
			const payloadAge = now - bootTime;
			if (!intent || payloadAge < (intent === "native" ? CACHE_TIMEOUT : PRELOAD_TIMEOUT)) {
				adopted = true;
				res = sharedConfig.load(key);
				delete globalThis._$HY.r[key];
			}
		}
		if (!adopted) res = fn(...args);
		const stamp = adopted ? bootTime : now;
		if (cached) {
			cached[0] = stamp;
			cached[1] = res;
			cached[3] = intent;
			!isServer && intent === "navigate" && cached[4][1](cached[0]);
		} else {
			cache.set(key, cached = [
				stamp,
				res,
				,
				intent,
				createSignal(stamp, { ownedWrite: true })
			]);
			cached[4].count = 0;
		}
		if (tracking) {
			cached[4].count++;
			cached[4][0]();
		}
		if (isServer) {
			const e = getRequestEvent();
			if (e && e.router.dataOnly) return e.router.data[key] = res;
		}
		if (intent !== "preload") res = "then" in res ? res.then(handleResponse(false), handleResponse(true)) : handleResponse(false)(res);
		inPreloadFn && "then" in res && res.catch(() => {});
		if (isServer && sharedConfig.context && sharedConfig.context.async && !sharedConfig.context.noHydrate) {
			const e = getRequestEvent();
			(!e || !e.serverOnly) && sharedConfig.context.serialize(key, res);
		}
		return res;
		function handleResponse(error) {
			return async (v) => {
				let enveloped;
				let hasEnveloped = false;
				if (isResponseEnvelope(v)) {
					enveloped = v.value;
					hasEnveloped = true;
					v = v.response;
				}
				if (v instanceof Response) {
					const e = getRequestEvent();
					if (e) for (const [key, value] of v.headers) if (key == "set-cookie") e.response.headers.append("set-cookie", value);
					else e.response.headers.set(key, value);
					const url = v.headers.get(LocationHeader);
					if (url !== null) {
						const keys = !isServer && v.headers.get(REVALIDATE_HEADER)?.split(",");
						keys && cacheKeyOp(keys, (entry) => entry[0] = 0);
						if (navigate && url.startsWith("/")) navigate(url, { replace: true });
						else if (!isServer) window.location.href = url;
						else if (e) e.response.status = 302;
						keys && revalidate(keys, false);
						return isServer ? void 0 : new Promise(() => {});
					}
					if (hasEnveloped) v = enveloped;
					else if (v.body) {
						const rpc = getServerFunctionRPC();
						if (rpc) {
							const decoded = await rpc.decodeResponse(v);
							if (decoded !== void 0) v = decoded;
						}
					}
				}
				if (error) throw v;
				cached[2] = v;
				return v;
			};
		}
	});
	cachedFn.keyFor = (...args) => name + hashKey(args);
	cachedFn.key = name;
	return cachedFn;
}
query.get = (key) => {
	return getCache().get(key)[2];
};
query.set = (key, value) => {
	const cache = getCache();
	const now = Date.now();
	let cached = cache.get(key);
	if (cached) {
		cached[0] = now;
		cached[1] = Promise.resolve(value);
		cached[2] = value;
		cached[3] = "preload";
	} else {
		cache.set(key, cached = [
			now,
			Promise.resolve(value),
			value,
			"preload",
			createSignal(now, { ownedWrite: true })
		]);
		cached[4].count = 0;
	}
};
query.delete = (key) => getCache().delete(key);
query.clear = () => getCache().clear();
function matchKey(key, keys) {
	for (let k of keys) if (k && key.startsWith(k)) return true;
	return false;
}
function hashKey(args) {
	return JSON.stringify(args, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
		result[key] = val[key];
		return result;
	}, {}) : val);
}
function isPlainObject(obj) {
	let proto;
	return obj != null && typeof obj === "object" && (!(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype);
}
//#endregion
//#region node_modules/.pnpm/@solidjs+router@2.0.0-next._27046e0036d50d02ac1150ad5eda5559/node_modules/@solidjs/router/dist/data/action.js
var submitHooksSymbol = Symbol("routerActionSubmitHooks");
var settledHooksSymbol = Symbol("routerActionSettledHooks");
var invokeSymbol = Symbol("routerActionInvoke");
var busyForms = /* #__PURE__ */ new WeakMap();
function setFormBusy(form, delta) {
	const count = (busyForms.get(form) || 0) + delta;
	busyForms.set(form, count);
	count > 0 ? form.setAttribute("aria-busy", "true") : form.removeAttribute("aria-busy");
}
var actions = /* #__PURE__ */ new Map();
/**
* The document-delegation submit handler for router actions. Lives here —
* not in events.ts — so the router's event wiring holds no static reference
* to the action module; `installRouterIntegrations` slots it in when the
* first action is created on the client.
*/
function handleFormAction(evt, router, actionBase) {
	if (evt.defaultPrevented) return;
	let actionRef = evt.submitter && evt.submitter.hasAttribute("formaction") ? evt.submitter.getAttribute("formaction") : evt.target.getAttribute("action");
	if (!actionRef) return;
	const serverAction = !actionRef.startsWith("https://action/");
	if (serverAction) {
		const url = new URL(actionRef, mockBase);
		actionRef = router.parsePath(url.pathname + url.search);
		if (!actionRef.startsWith(actionBase)) return;
	}
	if (evt.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
	const handler = actions.get(actionRef) || serverAction && createServerFormAction(actionRef);
	if (handler) {
		evt.preventDefault();
		const data = new FormData(evt.target, evt.submitter);
		handler.call({
			r: router,
			f: evt.target
		}, evt.target.enctype === "multipart/form-data" ? data : new URLSearchParams(data));
	}
}
/**
* Synthesizes a router action for a server-rendered action url. The url
* carries everything an invocation needs — the function id and any bound
* `.with()` arguments (plain JSON in `?args`, which the server prepends for
* natural-encoding bodies exactly as it does for no-JS posts) — so the
* FormData is posted to it verbatim through the server-function transport:
* submissions, `aria-busy`, redirects, revalidation, and single-flight all
* flow through the normal action machinery. Registered under the url, so
* repeat submits reuse it (and a later real registration overrides it).
*/
function createServerFormAction(url) {
	const id = new URL(url, mockBase).searchParams.get("id");
	if (!id) return void 0;
	const stub = createServerReference(id, void 0, url);
	return actionImpl(Object.assign((form) => stub(form), { url }));
}
/**
* Entry point for delegation's lazy fallback (data/events.ts): when no form
* handler was ever installed — no action module in the client graph at all —
* the router intercepts posts to server-action urls synchronously and loads
* this module to run them. The FormData was captured at submit time; only
* the enctype conversion and the generic invocation happen here.
*/
function submitServerForm(router, url, form, data) {
	const handler = actions.get(url) || createServerFormAction(url);
	if (!handler) return form.submit();
	handler.call({
		r: router,
		f: form
	}, form.enctype === "multipart/form-data" ? data : new URLSearchParams(data));
}
var integrationsInstalled = false;
function installRouterIntegrations() {
	if (integrationsInstalled) return;
	integrationsInstalled = true;
	if (isServer) provideFlashDecoder(decodeFlashCookie);
	else {
		setRouterFormHandler(handleFormAction);
		provideFlightConsumer(setupFlightDataConsumer);
	}
}
function useSubmissions(fn, filter) {
	const router = useRouter();
	const subs = createMemo(() => router.submissions[0]().filter((s) => s.url === fn.base && (!filter || filter(s.input))));
	return new Proxy([], {
		get(_, property) {
			if (property === $TRACK) return subs();
			return subs()[property];
		},
		has(_, property) {
			return property in subs();
		}
	});
}
function useAction(action) {
	const r = useRouter();
	return (...args) => action.apply({ r }, args);
}
function actionImpl(fn, options = {}) {
	async function invoke(variables, current) {
		const router = this.r;
		const form = this.f;
		const submitHooks = current[submitHooksSymbol];
		const settledHooks = current[settledHooksSymbol];
		const runMutation = () => fn(...variables);
		const run = action(async function* (context) {
			context.optimistic?.();
			try {
				const value = await context.call();
				yield;
				return {
					error: false,
					value
				};
			} catch (error) {
				yield;
				return {
					error: true,
					value: error
				};
			}
		});
		form && setFormBusy(form, 1);
		let settled;
		let response;
		const flightApplicationsBefore = flightApplications;
		try {
			settled = await settleActionResult(run({
				call: runMutation,
				optimistic: submitHooks.size ? () => {
					for (const hook of submitHooks.values()) hook(...variables);
				} : void 0
			}));
			response = await handleResponse(settled.value, settled.error, router.navigatorFactory(), flightApplications !== flightApplicationsBefore);
		} finally {
			form && setFormBusy(form, -1);
		}
		let submission;
		submission = {
			input: variables,
			url,
			result: response && response.data,
			error: response && response.error,
			clear() {
				router.submissions[1]((entries) => entries.filter((entry) => entry !== submission));
			},
			retry() {
				submission.clear();
				return current[invokeSymbol].call({
					r: router,
					f: form
				}, variables, current);
			}
		};
		response && router.submissions[1]((entries) => [...entries, submission]);
		for (const hook of settledHooks.values()) hook(submission);
		if (response) {
			if (response.error && !form) throw response.error;
			return response.data;
		}
	}
	const name = (typeof options === "string" ? { name: options } : options).name || (!isServer ? String(hashString(fn.toString())) : void 0);
	const url = fn.url || name && `https://action/${name}` || "";
	const wrapped = toAction(invoke, url);
	if (name) setFunctionName(wrapped, name);
	return wrapped;
}
var action$1 = actionImpl;
function toAction(invoke, url, boundArgs = [], base = url, submitHooks = /* @__PURE__ */ new Map(), settledHooks = /* @__PURE__ */ new Map()) {
	const fn = function(...args) {
		return invoke.call(this, [...boundArgs, ...args], fn);
	};
	fn.toString = () => {
		if (!url) throw new Error("Client Actions need explicit names if server rendered");
		return url;
	};
	fn.with = function(...args) {
		const uri = new URL(url, mockBase);
		uri.searchParams.set("args", hashKey(args));
		return toAction(invoke, (uri.origin === "https://action" ? uri.origin : "") + uri.pathname + uri.search, [...boundArgs, ...args], base, submitHooks, settledHooks);
	};
	fn.onSubmit = function(hook) {
		const id = Symbol("actionOnSubmitHook");
		submitHooks.set(id, hook);
		getOwner() && onCleanup(() => submitHooks.delete(id));
		return this;
	};
	fn.onSettled = function(hook) {
		const id = Symbol("actionOnSettledHook");
		settledHooks.set(id, hook);
		getOwner() && onCleanup(() => settledHooks.delete(id));
		return this;
	};
	fn.url = url;
	fn.base = base;
	fn[submitHooksSymbol] = submitHooks;
	fn[settledHooksSymbol] = settledHooks;
	fn[invokeSymbol] = invoke;
	installRouterIntegrations();
	if (!isServer) {
		actions.set(url, fn);
		getOwner() && onCleanup(() => actions.get(url) === fn && actions.delete(url));
	}
	return fn;
}
var hashString = (s) => s.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0) | 0, 0);
async function settleActionResult(result) {
	const value = result;
	if (value && typeof value.then === "function") return result.then((value) => value);
	if (value && typeof value.next === "function") {
		const iterator = value;
		let next = await iterator.next();
		while (!next.done) next = await iterator.next();
		return next.value;
	}
	return result;
}
var flightApplications = 0;
/**
* Registers the router as the single-flight consumer of the server function
* transport. Subscribing is the opt-in: while registered, the transport
* sends the `X-Single-Flight` request header on mutations and delivers the
* folded payload here — fresh route data is seeded into the `query` cache
* and the envelope metadata (redirect `Location`, `X-Revalidate` keys) is
* applied, all before the action sees its plain return value. Called by the
* Router component on the client unless `singleFlight={false}`, which now
* simply means "never subscribe" — no consumer, no request header, no
* collection work on the server. Returns the unsubscribe function.
*/
function setupFlightDataConsumer(router) {
	return subscribeFlightData((data, { response }) => {
		flightApplications++;
		return applyResponseMetadata(response, router.navigatorFactory(), data);
	});
}
/**
* Applies a server function response's integration metadata: `X-Revalidate`
* keys invalidate, `Location` navigates (hard for absolute urls), flight
* data seeds the query cache, and matching entries revalidate. Shared by
* the flight-data consumer and the action response path (which still sees
* metadata-bearing responses when no flight data was collected).
*/
function applyResponseMetadata(metadata, navigate, flightData) {
	let keys;
	if (metadata) {
		if (metadata.headers.has(REVALIDATE_HEADER)) keys = metadata.headers.get(REVALIDATE_HEADER).split(",");
		if (metadata.headers.has("Location")) {
			const locationUrl = metadata.headers.get("Location") || "/";
			if (locationUrl.startsWith("http")) window.location.href = locationUrl;
			else navigate(locationUrl);
		}
	}
	cacheKeyOp(keys, (entry) => entry[0] = 0);
	flightData && Object.keys(flightData).forEach((k) => query.set(k, flightData[k]));
	revalidate(keys, false);
}
async function handleResponse(response, error, navigate, metadataHandled) {
	let data;
	let flightData;
	let metadata;
	if (isResponseEnvelope(response)) {
		data = response.value;
		metadata = response.response;
	} else if (response instanceof Response) {
		metadata = response;
		if (response.body) {
			const payload = await decodeResponsePayload(response);
			data = payload.value;
			flightData = payload.flightData;
		}
	} else if (error) return { error: response };
	else data = response;
	if (!metadataHandled || metadata || flightData) applyResponseMetadata(metadata, navigate, flightData);
	return data != null ? { data } : void 0;
}
//#endregion
export { mockBase as A, useOptionalContext as C, comparablePath as D, setupNativeEvents as E, extractSearchParams as O, useNavigate as S, useSearchParams as T, resolveLazySubtree as _, query as a, unresolvedLazyMatches as b, RouterContextObj as c, createRouterContext as d, getIntent as f, registerFlightRouter as g, peekLazySubtrees as h, useSubmissions as i, normalizePath as j, mergeSearchString as k, createBranches as l, mergeParams as m, submitServerForm as n, revalidate as o, getRouteMatches as p, useAction as r, RouteContextObj as s, action$1 as t, createRouteContext as u, setInPreloadFn as v, useParams as w, useLocation as x, trackLazySubtrees as y };
