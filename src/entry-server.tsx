import { renderToStream } from "@solidjs/web";
import manifest from "virtual:solid-manifest";
import Document from "~/Document";
import App from "~/app";

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
