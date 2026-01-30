import 'dotenv/config'
import { defineConfig } from "prisma/config";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory of this config file (project root)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get DATABASE_URL from environment
let databaseUrl = process.env.DATABASE_URL || '';

// If DATABASE_URL contains relative SSL cert paths, convert them to absolute
if (databaseUrl && (databaseUrl.includes('sslcert=.') || databaseUrl.includes('sslrootcert=.') || databaseUrl.includes('sslkey=.'))) {
  // Replace relative paths with absolute paths
  databaseUrl = databaseUrl
    .replace(/sslcert=\.\/([^&]+)/g, (match, path) => `sslcert=${resolve(__dirname, path)}`)
    .replace(/sslcert=([^\/][^&]+)/g, (match, path) => path.startsWith('sslcert=/') ? match : `sslcert=${resolve(__dirname, path)}`)
    .replace(/sslrootcert=\.\/([^&]+)/g, (match, path) => `sslrootcert=${resolve(__dirname, path)}`)
    .replace(/sslrootcert=([^\/][^&]+)/g, (match, path) => path.startsWith('sslrootcert=/') ? match : `sslrootcert=${resolve(__dirname, path)}`)
    .replace(/sslkey=\.\/([^&]+)/g, (match, path) => `sslkey=${resolve(__dirname, path)}`)
    .replace(/sslkey=([^\/][^&]+)/g, (match, path) => path.startsWith('sslkey=/') ? match : `sslkey=${resolve(__dirname, path)}`);
}

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    path: './prisma/migrations'
  }
});