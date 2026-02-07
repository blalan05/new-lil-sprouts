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
  server: {
    // Trust proxy headers when behind reverse proxy
    preset: "node-server",
  },
  nitro: {
    // Ensure Nitro trusts proxy headers
    experimental: {
      wasm: false,
    },
  },
  vite: {
    ssr: {
      // Most comprehensive external function - catches everything Prisma-related
      external: (id) => {
        // Normalize path separators
        const normalizedId = id.replace(/\\/g, "/");
        
        // Log for debugging
        if (normalizedId.includes("prisma") || normalizedId.includes("query_compiler")) {
          console.log(`[SSR External] Checking: ${normalizedId}`);
        }
        
        // Catch ALL @prisma/client imports (most important!)
        if (normalizedId.startsWith("@prisma/client")) {
          console.log(`[SSR External] ✅ Externalizing: ${normalizedId}`);
          return true;
        }
        
        // Catch Prisma adapter
        if (normalizedId.startsWith("@prisma/adapter-pg")) {
          return true;
        }
        
        // Catch PostgreSQL driver
        if (normalizedId === "pg" || normalizedId.startsWith("pg/")) {
          return true;
        }
        
        // Catch generated Prisma client
        if (
          normalizedId.startsWith("~/generated/prisma-client") ||
          normalizedId.includes("/generated/prisma-client/") ||
          normalizedId.includes("generated/prisma-client")
        ) {
          return true;
        }
        
        // Catch query compiler and runtime modules (any path)
        if (
          normalizedId.includes("query_compiler") ||
          normalizedId.includes("prisma-client/runtime") ||
          normalizedId.includes("prisma-client/internal")
        ) {
          console.log(`[SSR External] ✅ Externalizing runtime: ${normalizedId}`);
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
    build: {
      rollupOptions: {
        external: (id, importer) => {
          // Most comprehensive externalization for Rollup
          const normalizedId = id.replace(/\\/g, "/");
          
          // Log for debugging
          if (normalizedId.includes("prisma") || normalizedId.includes("query_compiler")) {
            console.log(`[Rollup External] Checking: ${normalizedId} (from ${importer})`);
          }
          
          // Catch ALL @prisma/client imports FIRST (most important!)
          if (normalizedId.startsWith("@prisma/client")) {
            console.log(`[Rollup External] ✅ Externalizing: ${normalizedId}`);
            return true;
          }
          
          // Handle dynamic imports from generated Prisma client
          if (importer && (importer.includes("generated/prisma-client") || importer.includes("prisma-client"))) {
            if (normalizedId.startsWith("@prisma/client") || normalizedId.includes("prisma") || normalizedId.includes("query_compiler")) {
              console.log(`[Rollup External] ✅ Externalizing from Prisma client: ${normalizedId}`);
              return true;
            }
          }
          
          // Catch Prisma adapter and pg
          if (
            normalizedId.startsWith("@prisma/adapter-pg") ||
            normalizedId === "pg" ||
            normalizedId.startsWith("pg/")
          ) {
            return true;
          }
          
          // Catch query compiler and runtime modules (any path)
          if (
            normalizedId.includes("query_compiler") ||
            normalizedId.includes("prisma-client/runtime") ||
            normalizedId.includes("prisma-client/internal")
          ) {
            console.log(`[Rollup External] ✅ Externalizing runtime: ${normalizedId}`);
            return true;
          }
          
          return false;
        },
      },
    },
  },
});
