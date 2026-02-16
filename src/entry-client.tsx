// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { registerSW } from "virtual:pwa-register";

if (typeof window !== "undefined") {
  // Only register in production builds (avoids noisy 404s in dev)
  if (import.meta.env.PROD) {
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
