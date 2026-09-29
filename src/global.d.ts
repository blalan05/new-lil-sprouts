/// <reference types="@solidjs/vite-plugin/types" />
/// <reference types="vite/client" />

declare module "virtual:pwa-register" {
  export function registerSW(options?: {
    immediate?: boolean;
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (error: unknown) => void;
  }): (reloadPage?: boolean) => Promise<void>;
}

declare module "virtual:file-routes" {
  import type { FileRouteEntry } from "filesystem-routing/vite";
  const routes: readonly FileRouteEntry[];
  export default routes;
}

declare module "virtual:env/server" {
  export const env: {
    SESSION_SECRET: string;
    DATABASE_URL: string;
    PUBLIC_ORIGIN?: string;
  };
}

declare module "virtual:env/client" {
  export const env: Record<string, never>;
}
