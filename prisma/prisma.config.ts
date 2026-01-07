import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma v7 configuration for migrations
// The datasource.url is required for `prisma migrate` commands
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});