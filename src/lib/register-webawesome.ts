/**
 * Eagerly register Web Awesome components used in the app.
 * Imported from entry-client only (custom elements require the browser).
 */
import "@web.awesome.me/webawesome-pro/dist/components/badge/badge.js";
import "@web.awesome.me/webawesome-pro/dist/components/button/button.js";
import "@web.awesome.me/webawesome-pro/dist/components/callout/callout.js";
import "@web.awesome.me/webawesome-pro/dist/components/card/card.js";
import "@web.awesome.me/webawesome-pro/dist/components/checkbox/checkbox.js";
import "@web.awesome.me/webawesome-pro/dist/components/dialog/dialog.js";
import "@web.awesome.me/webawesome-pro/dist/components/drawer/drawer.js";
import "@web.awesome.me/webawesome-pro/dist/components/icon/icon.js";
import "@web.awesome.me/webawesome-pro/dist/components/input/input.js";
import "@web.awesome.me/webawesome-pro/dist/components/option/option.js";
import "@web.awesome.me/webawesome-pro/dist/components/page/page.js";
import "@web.awesome.me/webawesome-pro/dist/components/select/select.js";
import "@web.awesome.me/webawesome-pro/dist/components/spinner/spinner.js";
import "@web.awesome.me/webawesome-pro/dist/components/switch/switch.js";
import "@web.awesome.me/webawesome-pro/dist/components/tab/tab.js";
import "@web.awesome.me/webawesome-pro/dist/components/tab-group/tab-group.js";
import "@web.awesome.me/webawesome-pro/dist/components/tab-panel/tab-panel.js";
import "@web.awesome.me/webawesome-pro/dist/components/tag/tag.js";
import "@web.awesome.me/webawesome-pro/dist/components/textarea/textarea.js";
import "@web.awesome.me/webawesome-pro/dist/components/toast/toast.js";
import "@web.awesome.me/webawesome-pro/dist/components/toast-item/toast-item.js";

import { setBasePath } from "@web.awesome.me/webawesome-pro/dist/webawesome.js";

if (import.meta.env.DEV) {
  setBasePath("/node_modules/@web.awesome.me/webawesome-pro/dist/");
}
