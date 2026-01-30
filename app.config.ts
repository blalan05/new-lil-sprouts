import { defineConfig } from "@solidjs/start/config";

// Function to check if a module should be externalized
function isPrismaModule(id: string): boolean {
  // Normalize the ID to handle different path formats
  const normalizedId = id.replace(/\\/g, "/");
  
  // Log for debugging (remove in production if too verbose)
  if (normalizedId.includes("prisma") || normalizedId.includes("query_compiler")) {
    console.log(`[External Check] ${normalizedId}`);
  }
  
  // Check for Prisma packages (exact matches and prefixes)
  if (
    normalizedId === "@prisma/client" ||
    normalizedId.startsWith("@prisma/client/") ||
    normalizedId.startsWith("@prisma/adapter-pg") ||
    normalizedId === "pg" ||
    normalizedId.startsWith("pg/")
  ) {
    return true;
  }
  
  // Check for generated Prisma client (relative paths with ~ alias)
  if (
    normalizedId.startsWith("~/generated/prisma-client") ||
    normalizedId.startsWith("../generated/prisma-client") ||
    normalizedId.startsWith("./generated/prisma-client") ||
    normalizedId.startsWith("/generated/prisma-client") ||
    normalizedId.includes("/generated/prisma-client/")
  ) {
    return true;
  }
  
  // Check for Prisma runtime/internal modules (any path - most important!)
  // This catches: @prisma/client/runtime/query_compiler_bg.postgresql.mjs
  if (
    normalizedId.includes("prisma-client/runtime") ||
    normalizedId.includes("prisma-client/internal") ||
    normalizedId.includes("query_compiler") ||
    normalizedId.includes("query_engine") ||
    normalizedId.includes("libquery_engine") ||
    normalizedId.includes("@prisma/client/runtime")
  ) {
    return true;
  }
  
  // Check for absolute paths containing generated Prisma client
  if (
    normalizedId.includes("/generated/prisma-client/") ||
    normalizedId.includes("generated/prisma-client")
  ) {
    return true;
  }
  
  return false;
}

export default defineConfig({
  vite: {
    ssr: {
      // Use function to externalize Prisma modules (handles dynamic imports better)
      external: (id) => {
        // Explicitly handle the exact failing import first
        if (id === "@prisma/client/runtime/query_compiler_bg.postgresql.mjs" ||
            id === "@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.mjs") {
          return true;
        }
        return isPrismaModule(id);
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
    build: {
      rollupOptions: {
        external: (id, importer) => {
          // Handle dynamic imports from generated Prisma client
          if (importer && importer.includes("generated/prisma-client")) {
            if (id.startsWith("@prisma/client") || id.includes("prisma-client/runtime")) {
              return true;
            }
          }
          // Explicitly handle the exact failing import
          if (id === "@prisma/client/runtime/query_compiler_bg.postgresql.mjs" ||
              id === "@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.mjs") {
            return true;
          }
          return isPrismaModule(id);
        },
      },
    },
  },
});
