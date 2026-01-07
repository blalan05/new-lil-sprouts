#!/usr/bin/env node

import { config } from 'dotenv';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root
config({ path: join(__dirname, '..', '.env') });

// Verify DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please check your .env file.');
  process.exit(1);
}

console.log('✓ DATABASE_URL is set');
console.log('Running Prisma migration...\n');

// Get command from arguments (default to 'status')
const command = process.argv[2] || 'status';
const additionalArgs = process.argv.slice(3);

// Build the prisma command with explicit schema path
const args = [
  'migrate',
  command,
  '--schema=./prisma/schema.prisma',
  ...additionalArgs
];

// Run prisma command with DATABASE_URL in environment
const prisma = spawn('npx', ['prisma', ...args], {
  stdio: 'inherit',
  env: {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL
  },
  shell: true,
  cwd: join(__dirname, '..')
});

prisma.on('close', (code) => {
  process.exit(code || 0);
});

prisma.on('error', (err) => {
  console.error('Failed to start Prisma process:', err);
  process.exit(1);
});