import { n as PageHeader, t as PageContent } from "./PageContent--mFNirc1.js";
import { escape, ssr, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
//#region src/routes/[...404].tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = [
	"<div",
	" class=\"wa-stack wa-gap-l\" style=\"",
	"\"><!--$-->",
	"<!--/--><div class=\"wa-cluster wa-gap-s\" style=\"",
	"\"><wa-button href=\"/\" variant=\"brand\" appearance=\"filled\">Back to Dashboard</wa-button><wa-button type=\"button\" appearance=\"outlined\">Go Back</wa-button></div></div>"
];
function NotFound() {
	var _v$, _v$2;
	return PageContent({
		narrow: true,
		get children() {
			return _v$ = ssrHydrationKey(), _v$2 = escape(PageHeader({
				title: "Page Not Found",
				description: "That page doesn't exist or may have moved."
			})), ssr(_tmpl$, _v$, ssrStyleProperty("text-align:", "center") + ssrStyleProperty(";margin-top:", "var(--wa-space-2xl)"), _v$2, ssrStyleProperty("justify-content:", "center") + ssrStyleProperty(";flex-wrap:", "wrap"));
		}
	});
}
//#endregion
export { NotFound as default };
