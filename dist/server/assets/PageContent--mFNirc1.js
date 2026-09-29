import { escape, memo, scope, ssr, ssrClassName, ssrHydrationKey } from "@solidjs/web";
//#region src/components/wa/PageContent.tsx
var _tmpl$ = [
	"<main",
	" class=\"",
	"\">",
	"</main>"
];
var _tmpl$2 = [
	"<header",
	" class=\"wa-flank wa-gap-m\"><div class=\"wa-stack wa-gap-xs\"><h1 class=\"wa-heading-xl\">",
	"</h1><!--$-->",
	"<!--/--></div><!--$-->",
	"<!--/--></header>"
];
var _tmpl$3 = [
	"<p",
	" class=\"wa-body-m wa-color-text-quiet\">",
	"</p>"
];
var _tmpl$4 = [
	"<div",
	" class=\"wa-cluster wa-gap-s\">",
	"</div>"
];
function PageContent(props) {
	var _v$ = ssrHydrationKey(), _v$2 = () => {
		return ssrClassName(["page-content wa-stack wa-gap-l", { "page-content--narrow": !!props.narrow }]);
	}, _v$3 = scope(() => {
		return escape(props.children);
	});
	return ssr(_tmpl$, _v$, _v$2, _v$3);
}
function PageHeader(props) {
	var _v$4 = ssrHydrationKey(), _v$5 = () => {
		return escape(props.title);
	}, _v$6 = scope((() => {
		var _c$ = memo(() => {
			return !!props.description;
		});
		return () => {
			var _v$8, _v$9;
			return _c$() ? (_v$8 = ssrHydrationKey(), _v$9 = () => {
				return escape(props.description);
			}, ssr(_tmpl$3, _v$8, _v$9)) : escape(props.description);
		};
	})()), _v$7 = scope((() => {
		var _c$2 = memo(() => {
			return !!props.actions;
		});
		return () => {
			var _v$10, _v$11;
			return _c$2() ? (_v$10 = ssrHydrationKey(), _v$11 = () => {
				return escape(props.actions);
			}, ssr(_tmpl$4, _v$10, _v$11)) : escape(props.actions);
		};
	})());
	return ssr(_tmpl$2, _v$4, _v$5, _v$6, _v$7);
}
//#endregion
export { PageHeader as n, PageContent as t };
