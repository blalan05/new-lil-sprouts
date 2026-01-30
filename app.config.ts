import { defineConfig } from "@solidjs/start/config";

// Function to check if a module should be externalized
function isPrismaModule(id: string): boolean {
  // Log for debugging (remove in production if too verbose)
  if (id.includes("prisma") || id.includes("query_compiler")) {
    console.log(`[External Check] ${id}`);
  }
  
  // Check for Prisma packages (exact matches and prefixes)
  if (
    id === "@prisma/client" ||
    id.startsWith("@prisma/client/") ||
    id.startsWith("@prisma/adapter-pg") ||
    id === "pg" ||
    id.startsWith("pg/")
  ) {
    return true;
  }
  
  // Check for generated Prisma client (relative paths with ~ alias)
  if (
    id.startsWith("~/generated/prisma-client") ||
    id.startsWith("../generated/prisma-client") ||
    id.startsWith("./generated/prisma-client") ||
    id.startsWith("/generated/prisma-client")
  ) {
    return true;
  }
  
  // Check for Prisma runtime/internal modules (any path - most important!)
  if (
    id.includes("prisma-client/runtime") ||
    id.includes("prisma-client/internal") ||
    id.includes("query_compiler") ||
    id.includes("query_engine") ||
    id.includes("libquery_engine")
  ) {
    return true;
  }
  
  // Check for absolute paths containing generated Prisma client
  if (
    id.includes("/generated/prisma-client/") ||
    id.includes("\\generated\\prisma-client\\")
  ) {
    return true;
  }
  
  return false;
}

export default defineConfig({
  vite: {
    ssr: {
      // Use both array patterns and function for maximum coverage
      external: [
        "@prisma/client",
        /^@prisma\/client\/.*/,
        "@prisma/adapter-pg",
        "pg",
        "~/generated/prisma-client",
        /.*prisma-client\/runtime.*/,
        /.*query_compiler.*/,
        (id) => isPrismaModule(id),
      ],
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
    build: {
      rollupOptions: {
        external: (id) => {
          return isPrismaModule(id);
        },
      },
    },
  },
});
