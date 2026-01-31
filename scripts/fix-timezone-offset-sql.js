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

// Check if DATABASE_URL is already set in environment (takes precedence)
if (process.env.DATABASE_URL && !process.argv.includes('--ignore-env')) {
  console.log("⚠️  DATABASE_URL is already set in environment:");
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log(`   Database: ${url.pathname.replace(/^\//, '')}`);
    console.log(`   Host: ${url.hostname}`);
    console.log(`   This will override any .env file values!`);
    console.log(`   (Use --ignore-env flag to ignore environment variables)\n`);
  } catch (e) {
    // Ignore parse errors
  }
}

// Allow specifying custom .env file path as 4th argument
// Usage: node scripts/fix-timezone-offset-sql.js -6 overallvoyage /path/to/.env
const customEnvPath = process.argv[4] || process.env.ENV_FILE_PATH;

// Load environment variables from project root
// Try multiple paths to be robust
const envPaths = customEnvPath 
  ? [resolve(customEnvPath)]  // Use custom path if provided
  : [
      resolve(__dirname, "..", ".env"),  // From scripts/ folder, go up to root
      resolve(process.cwd(), ".env"),     // From current working directory
      ".env"                              // Relative to current directory
    ];

let envLoaded = false;
let loadedEnvPath = null;

for (const envPath of envPaths) {
  const result = config({ path: envPath, override: false }); // Don't override existing env vars
  if (!result.error && result.parsed) {
    console.log(`✅ Loaded .env from: ${envPath}`);
    console.log(`   File exists and was parsed successfully`);
    envLoaded = true;
    loadedEnvPath = envPath;
    break;
  }
}

if (!envLoaded) {
  console.warn(`⚠️  Could not load .env file from any of these paths: ${envPaths.join(", ")}`);
  console.warn(`   Current working directory: ${process.cwd()}`);
  console.warn(`   Script directory: ${__dirname}`);
  console.warn(`   Using environment variables only (if set)\n`);
} else {
  console.log(`   Loaded .env file: ${loadedEnvPath}\n`);
}

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("❌ DATABASE_URL environment variable is not set");
  console.error("   Checked:");
  console.error(`   - Environment variables`);
  if (loadedEnvPath) {
    console.error(`   - .env file at: ${loadedEnvPath}`);
  }
  console.error("\n   Make sure DATABASE_URL is set in your .env file or environment.");
  process.exit(1);
}

// Show where DATABASE_URL came from
console.log("📋 DATABASE_URL source:");
if (process.env.DATABASE_URL && !loadedEnvPath) {
  console.log("   → From environment variable (not from .env file)");
} else if (loadedEnvPath) {
  console.log(`   → From .env file: ${loadedEnvPath}`);
} else {
  console.log("   → From environment variable");
}
console.log();

// Parse and display connection details (safely, without password)
try {
  const url = new URL(dbUrl);
  const username = url.username || 'not specified';
  const host = url.hostname || 'not specified';
  const port = url.port || '5432';
  const currentDb = url.pathname ? url.pathname.replace(/^\//, '') : 'not specified';
  
  console.log("🔗 Database Connection Details:");
  console.log(`   Host: ${host}`);
  console.log(`   Port: ${port}`);
  console.log(`   Username: ${username}`);
  console.log(`   Database: ${currentDb}`);
  console.log(`   Password: [hidden]`);
} catch (e) {
  console.log("⚠️  Could not parse DATABASE_URL format");
}

// Allow overriding database name via command line argument or environment variable
const targetDbName = process.argv[3] || process.env.TARGET_DB_NAME || null;
if (targetDbName) {
  // Replace database name in connection string
  // Format: postgresql://user:pass@host:port/dbname?params
  dbUrl = dbUrl.replace(/\/[^\/\?]+(\?|$)/, `/${targetDbName}$1`);
  console.log(`\n📝 Overriding database name to: ${targetDbName}`);
  
  // Show updated database name
  try {
    const url = new URL(dbUrl);
    const updatedDb = url.pathname ? url.pathname.replace(/^\//, '') : 'not specified';
    console.log(`   Updated Database: ${updatedDb}`);
  } catch (e) {
    // Ignore parse errors
  }
} else {
  // Extract current database name for verification
  const dbMatch = dbUrl.match(/\/([^\/\?]+)(\?|$)/);
  const currentDb = dbMatch ? dbMatch[1] : 'unknown';
  console.log(`\n📝 Using database from DATABASE_URL: ${currentDb}`);
  console.log(`   (To override, use: node scripts/fix-timezone-offset-sql.js -6 overallvoyage)`);
}

// Remove sslmode from connection string - we'll control SSL via the config object
// This prevents connection string SSL settings from overriding our config
if (dbUrl.includes('sslmode=')) {
  dbUrl = dbUrl.replace(/[?&]sslmode=[^&]*/gi, '');
  // Clean up any double ? or trailing &
  dbUrl = dbUrl.replace(/\?&/g, '?').replace(/[?&]$/, '');
  console.log("⚠️  Removed sslmode from DATABASE_URL (will use SSL config object instead)");
}

// Configure SSL - always enable SSL for production databases
// Use rejectUnauthorized: false to accept self-signed certificates
const sslConfig = {
  rejectUnauthorized: false, // Accept self-signed certificates
};

console.log("🔒 SSL enabled for database connection (accepting self-signed certificates)");

const pool = new Pool({ 
  connectionString: dbUrl,
  ssl: sslConfig  // Always enable SSL, accept self-signed certs
});

async function fixTimezoneOffset(offsetHours) {
  console.log(`\n🔧 Fixing timezone offset: ${offsetHours} hours`);
  console.log(`   This will ADD ${offsetHours} hours to all scheduledStart and scheduledEnd times\n`);

  const client = await pool.connect();
  
  try {
    // First, verify which database we're connected to
    const dbNameResult = await client.query('SELECT current_database() as db_name, current_schema() as schema_name');
    const connectedDb = dbNameResult.rows[0].db_name;
    const currentSchema = dbNameResult.rows[0].schema_name;
    console.log(`📊 Connected to database: ${connectedDb}`);
    console.log(`📊 Current schema: ${currentSchema}`);
    console.log();

    // List all databases (to help identify if we're in the right one)
    console.log("📋 Checking available databases on this server...");
    try {
      // Connect to postgres database to list all databases
      const dbListResult = await client.query(`
        SELECT datname 
        FROM pg_database 
        WHERE datistemplate = false 
        ORDER BY datname
      `);
      console.log(`   Found ${dbListResult.rows.length} databases:`);
      dbListResult.rows.forEach(row => {
        const marker = row.datname === connectedDb ? ' ← (connected)' : '';
        console.log(`   - ${row.datname}${marker}`);
      });
      console.log();
    } catch (e) {
      console.log(`   ⚠️  Could not list databases: ${e.message}`);
    }

    // Check what schemas exist
    const schemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
      ORDER BY schema_name
    `);
    console.log(`📋 Available schemas: ${schemasResult.rows.map(r => r.schema_name).join(', ')}`);
    console.log();

    // Check what tables exist in public schema (for debugging)
    console.log("📋 Checking tables in 'public' schema...");
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    console.log(`   Found ${tablesResult.rows.length} tables in 'public' schema:`);
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log("   ⚠️  No tables found in 'public' schema!");
      // Check other schemas
      for (const schemaRow of schemasResult.rows) {
        const schemaName = schemaRow.schema_name;
        const schemaTablesResult = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = $1 
          AND table_type = 'BASE TABLE'
          ORDER BY table_name
        `, [schemaName]);
        if (schemaTablesResult.rows.length > 0) {
          console.log(`   📋 Found ${schemaTablesResult.rows.length} tables in '${schemaName}' schema:`);
          schemaTablesResult.rows.forEach(row => {
            console.log(`      - ${row.table_name}`);
          });
        }
      }
    }
    console.log();

    // Check if CareSession table exists (case-sensitive)
    const tableExists = tablesResult.rows.some(row => row.table_name === 'CareSession');
    if (!tableExists) {
      // Try lowercase version
      const lowerExists = tablesResult.rows.some(row => row.table_name === 'caresession');
      if (lowerExists) {
        console.log("⚠️  Found 'caresession' (lowercase) instead of 'CareSession'");
        console.log("   Using lowercase table name...\n");
        // Use lowercase for queries
        const countResult = await client.query('SELECT COUNT(*) as count FROM caresession');
        const sessionCount = parseInt(countResult.rows[0].count);
        console.log(`Found ${sessionCount} care sessions to process\n`);

        const intervalHours = Math.abs(offsetHours);
        const intervalDirection = offsetHours >= 0 ? '+' : '-';
        
        const updateQuery = `
          UPDATE caresession
          SET 
            "scheduledStart" = "scheduledStart" ${intervalDirection} INTERVAL '${intervalHours} hours',
            "scheduledEnd" = "scheduledEnd" ${intervalDirection} INTERVAL '${intervalHours} hours'
        `;

        console.log(`Executing update query...`);
        const result = await client.query(updateQuery);
        
        console.log(`\n✅ Done!`);
        console.log(`   Updated: ${result.rowCount} sessions`);
        console.log(`   Added ${offsetHours} hours to all scheduledStart and scheduledEnd times`);
        return;
      } else {
        throw new Error(`Table "CareSession" not found. Available tables: ${tablesResult.rows.map(r => r.table_name).join(', ')}`);
      }
    }

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
  console.error("   Example: node scripts/fix-timezone-offset-sql.js -6 overallvoyage  (specify database name)");
  console.error("   Example: node scripts/fix-timezone-offset-sql.js -6 overallvoyage /path/to/.env  (specify .env file)");
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
