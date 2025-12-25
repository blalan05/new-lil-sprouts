// Load .env file FIRST before anything else (PM2 doesn't load it automatically)
import { config } from "dotenv";
import { resolve } from "path";
if (process.env.NODE_ENV === "production") {
  const envPath = resolve(process.cwd(), ".env");
  const result = config({ path: envPath });
  if (result.error) {
    console.warn(`[DB] Warning: Could not load .env file: ${result.error.message}`);
  } else {
    console.log(`[DB] Loaded .env from: ${envPath}`);
  }
}

import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

// Resolve SSL certificate path before Prisma Client reads DATABASE_URL
function resolveDatabaseUrl() {
  const dbUrl = process.env.DATABASE_URL;
  
  // Log initial state for debugging
  console.log(`[DB] Initial DATABASE_URL check - contains slcert: ${dbUrl?.includes("slcert=")}`);
  
  if (!dbUrl?.includes("slcert=")) {
    return dbUrl;
  }

  const certPathMatch = dbUrl.match(/slcert=([^&]+)/);
  if (!certPathMatch) {
    console.error(`[DB] ❌ Could not extract certificate path from DATABASE_URL`);
    return dbUrl;
  }

  // URL decode the certificate path (in case it's encoded)
  let certPath = decodeURIComponent(certPathMatch[1]);
  const originalCertPath = certPath;
  const cwd = process.cwd();
  
  console.log(`[DB] Original certificate path from env: ${originalCertPath}`);
  console.log(`[DB] Current working directory: ${cwd}`);
  
  // Build list of paths to try - prioritize current working directory (where app runs)
  const pathsToTry: string[] = [];
  
  if (certPath.startsWith("/")) {
    // Absolute path - try as-is
    pathsToTry.push(certPath);
  } else {
    // Relative path - resolve from current working directory (where PM2 runs the app)
    if (certPath.startsWith("../")) {
      // Handle paths like ../../lnpg-cert.crt
      pathsToTry.push(resolve(cwd, certPath));
    } else {
      // Relative to cwd
      pathsToTry.push(resolve(cwd, certPath));
    }
    
    // Also try common locations
    pathsToTry.push(
      resolve(cwd, "lnpg-cert.crt"),              // In project root (cwd)
      resolve(cwd, "certs", "lnpg-cert.crt"),    // In certs folder
      resolve(cwd, "..", "lnpg-cert.crt"),      // One level up
      resolve(cwd, "..", "..", "lnpg-cert.crt"), // Two levels up
      "/etc/ssl/certs/lnpg-cert.crt",            // System location
      "/root/lnpg-cert.crt",                     // Root home directory
    );
  }
  
  console.log(`[DB] Trying certificate paths:`, pathsToTry);
  
  // Try each path
  for (const testPath of pathsToTry) {
    if (existsSync(testPath)) {
      console.log(`[DB] ✅ SSL certificate found at: ${testPath}`);
      // Use forward slashes for URLs
      const urlPath = testPath.replace(/\\/g, "/");
      const updatedUrl = dbUrl.replace(/slcert=[^&]+/, `slcert=${encodeURIComponent(urlPath)}`);
      console.log(`[DB] ✅ Updated DATABASE_URL with resolved certificate path`);
      return updatedUrl;
    }
  }
  
  // Certificate not found anywhere
  console.error(`[DB] ❌ SSL certificate not found!`);
  console.error(`[DB] ❌ Original path: ${originalCertPath}`);
  console.error(`[DB] ❌ Current working directory: ${cwd}`);
  console.error(`[DB] ❌ Tried ${pathsToTry.length} locations:`, pathsToTry);
  console.error(`[DB] ❌ Please ensure lnpg-cert.crt is deployed to your production server.`);
  console.error(`[DB] ❌ Recommended: Place certificate at ${resolve(cwd, "lnpg-cert.crt")}`);
  
  // Return original URL - connection will fail but we've logged the issue
  return dbUrl;
}

// Resolve the database URL before creating Prisma Client
console.log(`[DB] ===== Database Connection Initialization =====`);
console.log(`[DB] NODE_ENV: ${process.env.NODE_ENV || "not set"}`);
console.log(`[DB] DATABASE_URL is set: ${!!process.env.DATABASE_URL}`);

const resolvedDatabaseUrl = resolveDatabaseUrl();
if (resolvedDatabaseUrl && resolvedDatabaseUrl !== process.env.DATABASE_URL) {
  process.env.DATABASE_URL = resolvedDatabaseUrl;
  console.log(`[DB] ✅ DATABASE_URL updated with resolved certificate path`);
} else {
  console.log(`[DB] DATABASE_URL unchanged (no certificate path resolution needed or failed)`);
}

const prismaClientSingleton = () => {
  // Log the final DATABASE_URL (without password) for debugging
  const dbUrl = process.env.DATABASE_URL || "";
  if (!dbUrl) {
    console.error(`[DB] ❌ FATAL: DATABASE_URL is not set!`);
    throw new Error("DATABASE_URL environment variable is not set");
  }
  
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ":****@"); // Mask password
  console.log(`[DB] Connecting to database: ${maskedUrl.split("?")[0]}...`);
  
  return new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error", "warn"] : ["query", "error", "warn"],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
