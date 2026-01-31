/**
 * Script to fix timezone offset issues in care sessions using raw SQL
 * 
 * This script adjusts scheduledStart and scheduledEnd times by adding the timezone offset
 * to convert from incorrectly stored UTC times to correct UTC times.
 * 
 * Usage: node scripts/fix-timezone-offset-sql.js [timezone-offset-hours]
 * Example: node scripts/fix-timezone-offset-sql.js -6  (for UTC-6, Central Time)
 * 
 * IMPORTANT: This assumes all times were stored incorrectly by the server's timezone.
 * If your server is in UTC and you're in UTC-6, times were stored 6 hours early.
 * So we need to ADD 6 hours to fix them.
 * 
 * This version uses raw SQL to avoid Prisma client import issues.
 */

import { Pool } from "pg";
import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, "..", ".env") });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

// Configure SSL - PostgreSQL production databases typically require SSL
// Enable SSL if DATABASE_URL has SSL parameters, or if in production environment
const hasSSLParams = dbUrl.includes('sslcert=') || dbUrl.includes('sslrootcert=') || dbUrl.includes('sslmode=');
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({ 
  connectionString: dbUrl,
  // Enable SSL if URL has SSL params OR if we're in production (most production DBs require SSL)
  ssl: hasSSLParams || isProduction ? {
    rejectUnauthorized: false, // Accept self-signed certificates
  } : false
});

async function fixTimezoneOffset(offsetHours) {
  console.log(`\n🔧 Fixing timezone offset: ${offsetHours} hours`);
  console.log(`   This will ADD ${offsetHours} hours to all scheduledStart and scheduledEnd times\n`);

  const client = await pool.connect();
  
  try {
    // Get count of sessions
    const countResult = await client.query('SELECT COUNT(*) as count FROM "CareSession"');
    const sessionCount = parseInt(countResult.rows[0].count);
    console.log(`Found ${sessionCount} care sessions to process\n`);

    // Update all sessions using SQL
    // PostgreSQL INTERVAL type makes this easy
    const intervalHours = Math.abs(offsetHours);
    const intervalDirection = offsetHours >= 0 ? '+' : '-';
    
    const updateQuery = `
      UPDATE "CareSession"
      SET 
        "scheduledStart" = "scheduledStart" ${intervalDirection} INTERVAL '${intervalHours} hours',
        "scheduledEnd" = "scheduledEnd" ${intervalDirection} INTERVAL '${intervalHours} hours'
    `;

    console.log(`Executing update query...`);
    const result = await client.query(updateQuery);
    
    console.log(`\n✅ Done!`);
    console.log(`   Updated: ${result.rowCount} sessions`);
    console.log(`   Added ${offsetHours} hours to all scheduledStart and scheduledEnd times`);
  } catch (error) {
    console.error("❌ Error updating sessions:", error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Get timezone offset from command line argument
const offsetHours = process.argv[2] ? parseInt(process.argv[2]) : null;

if (offsetHours === null || isNaN(offsetHours)) {
  console.error("❌ Please provide timezone offset in hours");
  console.error("   Example: node scripts/fix-timezone-offset-sql.js -6  (for UTC-6)");
  console.error("   Example: node scripts/fix-timezone-offset-sql.js -8  (for UTC-8)");
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
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error:", error);
    await pool.end();
    process.exit(1);
  }
}, 5000);
