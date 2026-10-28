/**
 * Client bootstrap: register Web Awesome before hydration so wa-* elements upgrade.
 */
import "~/dev-unregister-sw";
import "~/lib/register-webawesome";
import "~/client-init";

import { hydrate } from "@solidjs/web";
import Document from "~/Document";
import App from "~/app";

hydrate(
  () => (
    <Document>
      <App />
    </Document>
  ),
  document,
);
