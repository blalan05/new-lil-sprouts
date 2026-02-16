import { createMiddleware } from "@solidjs/start/middleware";

// Nitro/Vinxi sometimes provides a relative native URL (e.g. "/"),
// but Nitro's getRequestURL expects an absolute URL string/object.
// Ensure `event.nativeEvent.url` is set to a full URL early.
export default createMiddleware({
  onRequest: (event) => {
    const nativeEvent: any = (event as any).nativeEvent;
    if (!nativeEvent) return;

    const absolute = new URL(event.request.url);

    // Ensure nativeEvent.url is a usable absolute URL (Nitro calls `new URL(event.url || event.req.url)`).
    // Some adapters provide a relative path (e.g. "/login") which crashes Node's URL constructor.
    const current = nativeEvent.url;
    try {
      if (!current) {
        nativeEvent.url = absolute;
        return;
      }

      if (typeof current === "string") {
        // If it is already absolute, keep it. Otherwise, resolve against the real request URL.
        nativeEvent.url = new URL(current, absolute);
        return;
      }

      if (current instanceof URL) {
        // If it looks wrong (no host), replace.
        if (!current.host) nativeEvent.url = absolute;
      } else {
        // Unknown shape: just set the safe absolute URL.
        nativeEvent.url = absolute;
      }
    } catch {
      nativeEvent.url = absolute;
    }
  },
});

