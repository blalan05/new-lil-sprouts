import { renderToStream } from "@solidjs/web";
import manifest from "virtual:solid-manifest";
import Document from "~/Document";
import App from "~/App";

export function render(request: Request, context?: unknown) {
  return renderToStream(
    () => (
      <Document>
        <App />
      </Document>
    ),
    { manifest },
  );
}
