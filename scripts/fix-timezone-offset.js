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

import { PrismaClient } from "../src/generated/prisma-client/client.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

// Load environment variables
config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

const pool = new Pool({ 
  connectionString: dbUrl,
  ssl: dbUrl.includes('sslcert=') ? {
    rejectUnauthorized: false,
  } : false
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
