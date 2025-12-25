import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  vite: {
    ssr: {
      external: ["@prisma/client", ".prisma/client"],
      noExternal: [],
    },
    optimizeDeps: {
      exclude: ["@prisma/client", ".prisma/client"],
    },
  },
});
