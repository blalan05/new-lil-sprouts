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
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Store original DATABASE_URL from environment (if set)
const originalEnvDbUrl = process.env.DATABASE_URL;

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
let envFileDbUrl = null;

// First, try to load .env file WITHOUT overriding (to see what's in it)
for (const envPath of envPaths) {
  // Temporarily clear DATABASE_URL to read from file
  const tempDbUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  
  const result = config({ path: envPath, override: true });
  if (!result.error && result.parsed && process.env.DATABASE_URL) {
    envFileDbUrl = process.env.DATABASE_URL;
    envLoaded = true;
    loadedEnvPath = envPath;
    break;
  }
  
  // Restore original if file didn't have it
  if (!process.env.DATABASE_URL && tempDbUrl) {
    process.env.DATABASE_URL = tempDbUrl;
  }
}

// Now force override with .env file values if we found one
if (envLoaded && envFileDbUrl) {
  // Force override - use .env file values
  process.env.DATABASE_URL = envFileDbUrl;
  console.log(`✅ Loaded .env from: ${loadedEnvPath}`);
  console.log(`   File exists and was parsed successfully`);
  
  if (originalEnvDbUrl && originalEnvDbUrl !== envFileDbUrl) {
    console.log(`⚠️  DATABASE_URL was set in environment but OVERRIDDEN with .env file value`);
    try {
      const origUrl = new URL(originalEnvDbUrl);
      const newUrl = new URL(envFileDbUrl);
      console.log(`   Environment had: ${origUrl.pathname.replace(/^\//, '')}`);
      console.log(`   .env file has: ${newUrl.pathname.replace(/^\//, '')}`);
      console.log(`   Using .env file value\n`);
    } catch (e) {
      // Ignore parse errors
    }
  } else {
    console.log(`   Using DATABASE_URL from .env file\n`);
  }
} else {
  if (originalEnvDbUrl) {
    console.log(`⚠️  Could not load .env file, using DATABASE_URL from environment`);
    console.log(`   Tried paths: ${envPaths.join(", ")}`);
    console.log(`   Current working directory: ${process.cwd()}`);
    console.log(`   Script directory: ${__dirname}\n`);
  } else {
    console.warn(`⚠️  Could not load .env file from any of these paths: ${envPaths.join(", ")}`);
    console.warn(`   Current working directory: ${process.cwd()}`);
    console.warn(`   Script directory: ${__dirname}`);
    console.warn(`   DATABASE_URL not found in environment or .env file\n`);
  }
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

// Show the actual DATABASE_URL being used (safely)
console.log("📋 DATABASE_URL being used:");
try {
  const url = new URL(process.env.DATABASE_URL);
  console.log(`   Host: ${url.hostname}`);
  console.log(`   Port: ${url.port || '5432'}`);
  console.log(`   Username: ${url.username}`);
  console.log(`   Database: ${url.pathname.replace(/^\//, '')}`);
  if (loadedEnvPath) {
    console.log(`   Source: .env file (${loadedEnvPath})`);
  } else {
    console.log(`   Source: environment variable`);
  }
} catch (e) {
  console.log(`   Could not parse DATABASE_URL`);
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

// Handle SSL certificate path from DATABASE_URL (like db.ts does)
let resolvedDbUrl = dbUrl;
let sslCertPath = null;

if (dbUrl.includes('sslcert=')) {
  const certPathMatch = dbUrl.match(/sslcert=([^&]+)/);
  if (certPathMatch) {
    let certPath = decodeURIComponent(certPathMatch[1]);
    const originalCertPath = certPath;
    const cwd = process.cwd();
    
    console.log(`🔒 SSL certificate path from DATABASE_URL: ${originalCertPath}`);
    
    // Build list of paths to try
    const pathsToTry = [];
    if (certPath.startsWith("/")) {
      // Absolute path - try as-is
      pathsToTry.push(certPath);
    } else {
      // Relative path - resolve from current working directory
      pathsToTry.push(resolve(cwd, certPath));
      pathsToTry.push(resolve(__dirname, "..", certPath)); // From project root
    }
    
    // Try each path
    for (const testPath of pathsToTry) {
      if (existsSync(testPath)) {
        console.log(`✅ SSL certificate found at: ${testPath}`);
        sslCertPath = testPath;
        const urlPath = testPath.replace(/\\/g, "/");
        resolvedDbUrl = dbUrl.replace(/sslcert=[^&]+/, `sslcert=${encodeURIComponent(urlPath)}`);
        break;
      }
    }
    
    if (!sslCertPath) {
      console.warn(`⚠️  SSL certificate not found at: ${originalCertPath}`);
      console.warn(`   Tried: ${pathsToTry.join(", ")}`);
      console.warn(`   Will attempt connection without certificate file (using rejectUnauthorized: false)`);
    }
  }
}

// Remove ALL SSL-related parameters from connection string
// The pg library reads these from the URL and they can override our config object
// We'll handle SSL purely through the Pool config object
const sslParamsToRemove = ['sslmode', 'sslcert', 'sslrootcert', 'sslkey', 'ssl'];
let cleanedDbUrl = resolvedDbUrl;
let hadSslParams = false;

for (const param of sslParamsToRemove) {
  if (cleanedDbUrl.includes(`${param}=`)) {
    cleanedDbUrl = cleanedDbUrl.replace(new RegExp(`[?&]${param}=[^&]*`, 'gi'), '');
    hadSslParams = true;
  }
}

// Clean up any double ? or trailing &
cleanedDbUrl = cleanedDbUrl.replace(/\?&/g, '?').replace(/[?&]$/, '');

if (hadSslParams) {
  console.log("⚠️  Removed SSL parameters from DATABASE_URL (will use SSL config object instead)");
}

// Configure SSL - always enable SSL for production databases
// Use rejectUnauthorized: false to accept self-signed certificates
// This MUST be set in the Pool config, not the connection string
const sslConfig = {
  rejectUnauthorized: false, // Accept self-signed certificates (don't validate cert chain)
};

console.log("🔒 SSL configuration:");
console.log("   SSL enabled (accepting self-signed certificates)");
if (sslCertPath) {
  console.log(`   Certificate file found: ${sslCertPath} (not needed with rejectUnauthorized: false)`);
}

const pool = new Pool({ 
  connectionString: cleanedDbUrl,  // Use cleaned URL without SSL params
  ssl: sslConfig  // Always enable SSL, accept self-signed certs via config object
});

async function fixTimezoneOffset(offsetHours) {
  console.log(`\n🔧 Fixing timezone offset: ${offsetHours} hours`);
  if (offsetHours < 0) {
    console.log(`   This will SUBTRACT ${Math.abs(offsetHours)} hours from all scheduledStart and scheduledEnd times`);
  } else {
    console.log(`   This will ADD ${offsetHours} hours to all scheduledStart and scheduledEnd times`);
  }
  console.log();

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
