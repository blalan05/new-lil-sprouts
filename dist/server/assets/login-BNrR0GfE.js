import { St as loginOrRegister, Tt as useSubmission } from "../server.js";
import { escape, ssr, ssrAttribute, ssrHydrationKey, ssrStyleProperty } from "@solidjs/web";
import { Show } from "solid-js";
//#region src/routes/login.tsx?pick=default&pick=$css&lang.tsx
var _tmpl$ = ["<wa-callout", " variant=\"danger\">Invalid username or password. Please try again.</wa-callout>"];
var _tmpl$2 = [
	"<div",
	" class=\"login-page\"><wa-card class=\"login-card\"><div class=\"wa-stack wa-gap-l\"><div class=\"wa-stack wa-gap-s\" style=\"",
	"\"><img src=\"/icons/icon-192x192.png\" alt=\"Lil Sprouts\" width=\"96\" height=\"96\"><h1 class=\"wa-heading-xl\">Lil Sprouts</h1><p class=\"wa-body-m wa-color-text-quiet\">Sign in to your account</p></div><!--$-->",
	"<!--/--><form",
	" method=\"post\" class=\"wa-stack wa-gap-m\"><input type=\"hidden\" name=\"loginType\" value=\"login\"><input type=\"hidden\" name=\"redirectTo\"",
	"><wa-input label=\"Username\" name=\"username\" placeholder=\"username\" required autocomplete=\"username\"></wa-input><wa-input label=\"Password\" name=\"password\" type=\"password\" placeholder=\"password\" required autocomplete=\"current-password\" password-toggle></wa-input><wa-button type=\"submit\" variant=\"brand\" appearance=\"filled\"",
	" style=\"",
	"\">",
	"</wa-button></form></div></wa-card></div>"
];
function Login(props) {
	var _v$2;
	const loggingIn = useSubmission(loginOrRegister);
	var _v$ = ssrHydrationKey(), _v$3 = escape(Show({
		get when() {
			return loggingIn.error;
		},
		get children() {
			return _v$2 = ssrHydrationKey(), ssr(_tmpl$, _v$2);
		}
	})), _v$5 = () => {
		return ssrAttribute("disabled", escape(loggingIn.pending || void 0, true));
	}, _v$6 = () => {
		return loggingIn.pending ? "Signing in..." : "Sign In";
	}, _v$4 = () => {
		return ssrAttribute("value", escape(props.params.redirectTo ?? "/", true));
	};
	return ssr(_tmpl$2, _v$, ssrStyleProperty("text-align:", "center"), _v$3, ssrAttribute("action", escape(loginOrRegister, true)), _v$4, _v$5, ssrStyleProperty("width:", "100%"), _v$6);
}
//#endregion
export { Login as default };
