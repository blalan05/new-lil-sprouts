import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  vite: {
    ssr: {
      external: (id) => {
        // Externalize Prisma client and all its runtime modules
        if (
          id === "@prisma/client" ||
          id.startsWith("@prisma/client/runtime") ||
          id.startsWith("@prisma/adapter-pg") ||
          id === "pg" ||
          id.startsWith("~/generated/prisma-client") ||
          id.includes("prisma-client/runtime")
        ) {
          return true;
        }
        return false;
      },
      noExternal: [],
    },
    optimizeDeps: {
      exclude: [
        "@prisma/client",
        "@prisma/adapter-pg",
        "pg",
        "~/generated/prisma-client",
      ],
    },
  },
});
