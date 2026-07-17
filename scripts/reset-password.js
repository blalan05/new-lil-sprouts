#!/usr/bin/env node
/**
 * Reset a user password directly in the database (no email flow).
 *
 * Usage:
 *   node scripts/reset-password.js --owner "new-password-here"
 *   node scripts/reset-password.js myusername "new-password-here"
 *   node scripts/reset-password.js --list
 */

import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { hashPassword } from "../src/lib/password.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

function usage() {
  console.log(`Reset a Lil Sprouts user password

Usage:
  node scripts/reset-password.js --owner <new-password>
  node scripts/reset-password.js <username> <new-password>
  node scripts/reset-password.js --list

Examples:
  node scripts/reset-password.js --owner "MyNewSecurePass123"
  node scripts/reset-password.js nanny "MyNewSecurePass123"
`);
}

function parseArgs(argv) {
  if (argv.length === 0 || argv.includes("-h") || argv.includes("--help")) {
    return { mode: "help" };
  }
  if (argv.includes("--list")) {
    return { mode: "list" };
  }
  if (argv[0] === "--owner") {
    if (argv.length < 2) {
      console.error("ERROR: --owner requires a new password argument.");
      process.exit(1);
    }
    return { mode: "owner", password: argv[1] };
  }
  if (argv.length < 2) {
    console.error("ERROR: provide <username> <new-password> or --owner <new-password>.");
    process.exit(1);
  }
  return { mode: "username", username: argv[0], password: argv[1] };
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.mode === "help") {
    usage();
    return;
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("ERROR: DATABASE_URL is not set. Check your .env file.");
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: dbUrl });

  try {
    if (parsed.mode === "list") {
      const { rows } = await pool.query(
        `SELECT username, email, "isOwner", "createdAt"
         FROM "User"
         ORDER BY "isOwner" DESC, "createdAt" ASC`,
      );
      if (rows.length === 0) {
        console.log("No users found.");
        return;
      }
      console.log("Users:");
      for (const row of rows) {
        const role = row.isOwner ? "owner" : "parent";
        console.log(`  - ${row.username} (${row.email}) [${role}]`);
      }
      return;
    }

    if (parsed.password.length < 6) {
      console.error("ERROR: Password must be at least 6 characters.");
      process.exit(1);
    }

    let username = parsed.username;
    if (parsed.mode === "owner") {
      const { rows } = await pool.query(
        `SELECT username FROM "User" WHERE "isOwner" = true ORDER BY "createdAt" ASC LIMIT 1`,
      );
      if (rows.length === 0) {
        console.error("ERROR: No owner user found. Use --list to see accounts.");
        process.exit(1);
      }
      username = rows[0].username;
      console.log(`Owner account: ${username}`);
    }

    const hashed = hashPassword(parsed.password);
    const { rowCount } = await pool.query(
      `UPDATE "User" SET password = $1, "updatedAt" = NOW() WHERE username = $2`,
      [hashed, username],
    );

    if (rowCount === 0) {
      console.error(`ERROR: No user with username "${username}". Run with --list to see accounts.`);
      process.exit(1);
    }

    console.log(`Password updated for "${username}". You can log in at /login now.`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
