import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

// Resolve SSL certificate path before Prisma Client reads DATABASE_URL
if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL?.includes("slcert=")) {
  const certPathMatch = process.env.DATABASE_URL.match(/slcert=([^&]+)/);
  if (certPathMatch) {
    const certPath = certPathMatch[1];
    
    // If it's a relative path, resolve it relative to project root
    if (certPath.startsWith("../") || certPath.startsWith("./")) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      // Go up from src/lib to project root
      const projectRoot = join(__dirname, "../..");
      const resolvedCertPath = join(projectRoot, certPath);
      
      // Update the environment variable with the resolved path
      if (existsSync(resolvedCertPath)) {
        // Use forward slashes for URLs (works on both Windows and Unix)
        const urlPath = resolvedCertPath.replace(/\\/g, "/");
        process.env.DATABASE_URL = process.env.DATABASE_URL.replace(
          /slcert=[^&]+/,
          `slcert=${urlPath}`
        );
      } else {
        console.warn(`⚠️  SSL certificate not found at: ${resolvedCertPath}`);
        console.warn(`⚠️  Database connection may fail. Please ensure the certificate file is deployed.`);
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
