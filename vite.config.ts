import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { fileRoutes } from "filesystem-routing/vite";
import { defineConfig } from "vite";
import solid from "@solidjs/vite-plugin";
import { VitePWA } from "vite-plugin-pwa";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "~": resolve(root, "src"),
    },
  },
  plugins: [
    solid({
      start: {
        middleware: "./src/middleware/index.ts",
        devtools: false,
      },
      ssr: true,
      serverFunctions: {
        configure: "./src/server-config.ts",
      },
      extensions: [".jsx", ".tsx"],
    }),
    fileRoutes({ httpMethods: true, dir: "src/routes" }),
    VitePWA({
      injectRegister: null,
      registerType: "autoUpdate",
      filename: "service-worker.js",
      manifest: false,
      includeAssets: ["favicon.ico", "icons/*.png"],
      workbox: {
        navigateFallback: "/",
        navigateFallbackDenylist: [
          /^\/_server\b/,
          /^\/api\b/,
          /^\/_build\b/,
          /^\/login$/,
        ],
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  server: {
    port: 3000,
    fs: {
      allow: [".."],
    },
  },
  ssr: {
    external: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  },
  optimizeDeps: {
    exclude: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  },
  build: {
    target: "esnext",
  },
});
