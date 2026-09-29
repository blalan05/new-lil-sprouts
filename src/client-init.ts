/**
 * Client-only bootstrap: PWA service worker registration.
 * Web Awesome is registered synchronously from entry-client before hydration.
 */
import { registerSW } from "virtual:pwa-register";
if (typeof window !== "undefined" && import.meta.env.PROD) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const reg of registrations) {
          const url = reg.active?.scriptURL || reg.installing?.scriptURL || reg.waiting?.scriptURL;
          if (!url) continue;
          try {
            const pathname = new URL(url).pathname;
            if (pathname === "/service-worker.js") {
              console.log("[PWA] Unregistering legacy service worker:", url);
              reg.unregister();
            }
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // ignore
      });
  }

  registerSW({
    immediate: true,
    onRegistered(registration) {
      if (registration) {
        console.log("[PWA] Service Worker registered:", registration.scope);
      }
    },
    onRegisterError(error) {
      console.error("[PWA] Service Worker registration failed:", error);
    },
  });
}
