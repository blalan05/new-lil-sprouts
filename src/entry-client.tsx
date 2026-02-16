// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { registerSW } from "virtual:pwa-register";

if (typeof window !== "undefined") {
  // Only register in production builds (avoids noisy 404s in dev)
  if (import.meta.env.PROD) {
    // Migration: unregister any legacy root service worker (e.g. `/service-worker.js`)
    // so it can't interfere with the new Workbox-based SW.
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
}

mount(() => <StartClient />, document.getElementById("app")!);
