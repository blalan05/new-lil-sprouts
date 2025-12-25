import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

// Resolve SSL certificate path before Prisma Client reads DATABASE_URL
if (process.env.DATABASE_URL?.includes("slcert=")) {
  const certPathMatch = process.env.DATABASE_URL.match(/slcert=([^&]+)/);
  if (certPathMatch) {
    const certPath = certPathMatch[1];
    
    // If it's a relative path, resolve it relative to project root
    if (certPath.startsWith("../") || certPath.startsWith("./") || !certPath.startsWith("/")) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      // Go up from src/lib to project root
      const projectRoot = join(__dirname, "../..");
      const resolvedCertPath = join(projectRoot, certPath);
      
      console.log(`[DB] Resolving SSL certificate path: ${certPath} -> ${resolvedCertPath}`);
      
      // Update the environment variable with the resolved path
      if (existsSync(resolvedCertPath)) {
        // Use forward slashes for URLs (works on both Windows and Unix)
        const urlPath = resolvedCertPath.replace(/\\/g, "/");
        process.env.DATABASE_URL = process.env.DATABASE_URL.replace(
          /slcert=[^&]+/,
          `slcert=${urlPath}`
        );
        console.log(`[DB] SSL certificate found and path updated`);
      } else {
        console.error(`❌ SSL certificate not found at: ${resolvedCertPath}`);
        console.error(`❌ Database connection will fail. Please ensure the certificate file is deployed.`);
        console.error(`❌ Expected certificate at: ${resolvedCertPath}`);
        console.error(`❌ Project root: ${projectRoot}`);
        console.error(`❌ Current working directory: ${process.cwd()}`);
      }
    } else {
      // Absolute path - check if it exists
      if (!existsSync(certPath)) {
        console.error(`❌ SSL certificate not found at absolute path: ${certPath}`);
      } else {
        console.log(`[DB] Using absolute SSL certificate path: ${certPath}`);
      }
    }
  }
}

const prismaClientSingleton = () => {
  return new PrismaClient({});
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
