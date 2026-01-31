/**
 * Script to fix timezone offset issues in care sessions
 * 
 * This script adjusts scheduledStart and scheduledEnd times by adding the timezone offset
 * to convert from incorrectly stored UTC times to correct UTC times.
 * 
 * Usage: node scripts/fix-timezone-offset.js [timezone-offset-hours]
 * Example: node scripts/fix-timezone-offset.js -6  (for UTC-6, Central Time)
 * 
 * IMPORTANT: This assumes all times were stored incorrectly by the server's timezone.
 * If your server is in UTC and you're in UTC-6, times were stored 6 hours early.
 * So we need to ADD 6 hours to fix them.
 */

import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, "..", ".env") });

// Import Prisma Client - try multiple strategies
let PrismaClient;
let lastError = null;

// Strategy 1: Try @prisma/client (standard, should work if Prisma is installed)
try {
  const module = await import("@prisma/client");
  PrismaClient = module.PrismaClient;
  console.log("✅ Using Prisma Client from @prisma/client");
} catch (error) {
  lastError = error;
  // Strategy 2: Try custom generated path with .js extension
  try {
    const module = await import("../src/generated/prisma-client/client.js");
    PrismaClient = module.PrismaClient;
    console.log("✅ Using Prisma Client from generated path (.js)");
  } catch (error2) {
    lastError = error2;
    // Strategy 3: Try custom generated path with .ts extension
    try {
      const module = await import("../src/generated/prisma-client/client.ts");
      PrismaClient = module.PrismaClient;
      console.log("✅ Using Prisma Client from generated path (.ts)");
    } catch (error3) {
      lastError = error3;
      console.error("❌ Could not import Prisma Client");
      console.error("   Tried @prisma/client, .js, and .ts paths");
      console.error("   Last error:", lastError?.message);
      console.error("\n   Ensure Prisma client is generated:");
      console.error("   Run: pnpm prisma:generate");
      console.error("   Or: prisma generate");
      console.error("\n   In production, ensure Prisma client is generated during build.");
      process.exit(1);
    }
  }
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

const pool = new Pool({ 
  connectionString: dbUrl,
  ssl: dbUrl.includes('sslcert=') || dbUrl.includes('sslrootcert=') ? {
    rejectUnauthorized: false,
  } : false
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ 
  adapter,
  log: ["error", "warn"],
});

async function fixTimezoneOffset(offsetHours) {
  console.log(`\n🔧 Fixing timezone offset: ${offsetHours} hours`);
  console.log(`   This will ADD ${offsetHours} hours to all scheduledStart and scheduledEnd times\n`);

  // Get all care sessions
  const sessions = await prisma.careSession.findMany({
    select: {
      id: true,
      scheduledStart: true,
      scheduledEnd: true,
    },
  });

  console.log(`Found ${sessions.length} care sessions to process\n`);

  let updated = 0;
  let errors = 0;

  for (const session of sessions) {
    try {
      // Add the offset hours (convert to milliseconds)
      const offsetMs = offsetHours * 60 * 60 * 1000;
      
      const newStart = new Date(session.scheduledStart.getTime() + offsetMs);
      const newEnd = new Date(session.scheduledEnd.getTime() + offsetMs);

      await prisma.careSession.update({
        where: { id: session.id },
        data: {
          scheduledStart: newStart,
          scheduledEnd: newEnd,
        },
      });

      updated++;
      
      if (updated % 10 === 0) {
        console.log(`   Updated ${updated}/${sessions.length} sessions...`);
      }
    } catch (error) {
      console.error(`   ❌ Error updating session ${session.id}:`, error.message);
      errors++;
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   Updated: ${updated} sessions`);
  if (errors > 0) {
    console.log(`   Errors: ${errors} sessions`);
  }
}

// Get timezone offset from command line argument
const offsetHours = process.argv[2] ? parseInt(process.argv[2]) : null;

if (offsetHours === null || isNaN(offsetHours)) {
  console.error("❌ Please provide timezone offset in hours");
  console.error("   Example: node scripts/fix-timezone-offset.js -6  (for UTC-6)");
  console.error("   Example: node scripts/fix-timezone-offset.js -8  (for UTC-8)");
  process.exit(1);
}

// Confirm before proceeding
console.log("\n⚠️  WARNING: This will modify all care session times in the database!");
console.log(`   Timezone offset: ${offsetHours} hours`);
console.log(`   This will ADD ${offsetHours} hours to all scheduledStart and scheduledEnd times`);
console.log("\n   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n");

setTimeout(async () => {
  try {
    await fixTimezoneOffset(offsetHours);
    await prisma.$disconnect();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error:", error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  }
}, 5000);
