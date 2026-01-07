# Prisma v5 to v7 Migration Guide

## Overview
This document outlines the changes made to upgrade from Prisma v5.22.0 to Prisma v7.2.0 in the new-lil-sprouts SolidJS application.

**Migration Date:** [Current Date]
**Previous Version:** Prisma v5.22.0
**New Version:** Prisma v7.2.0

## Summary of Changes

Prisma v7 introduces several breaking changes, primarily:
1. **ESM-only architecture** - No longer supports CommonJS
2. **Required output path** - Generator must specify where to output the client
3. **Database adapter pattern** - PostgreSQL connections now use adapters
4. **Removed `url` from datasource** - Connection strings now passed via PrismaClient constructor
5. **Updated provider name** - Changed from `prisma-client-js` to `prisma-client`

## Changes Made

### 1. Package Dependencies (`package.json`)

**Added:**
- `@prisma/adapter-pg@^7.0.0` - PostgreSQL adapter for Prisma v7
- `pg@^8.13.1` - PostgreSQL driver
- `@types/pg@^8.11.10` - TypeScript types for pg

**Updated:**
- `prisma`: `^5.22.0` → `^7.0.0`
- `@prisma/client`: `^5.22.0` → `^7.0.0`

### 2. Prisma Schema (`prisma/schema.prisma`)

**Before:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**After:**
```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma-client"
}

datasource db {
  provider = "postgresql"
}
```

**Changes:**
- Updated `provider` from `"prisma-client-js"` to `"prisma-client"`
- Added required `output` field to specify client generation location
- Removed `url` field from datasource (now handled in runtime config)

### 3. Database Client (`src/lib/db.ts`)

**Key Changes:**
- Import from generated client location: `"../generated/prisma-client/client.js"`
- Added PostgreSQL connection pool using `pg` package
- Created Prisma adapter using `@prisma/adapter-pg`
- Pass adapter to PrismaClient constructor

**Before:**
```typescript
import { PrismaClient } from "@prisma/client";

return new PrismaClient({
  log: process.env.NODE_ENV === "production" ? ["error", "warn"] : ["query", "error", "warn"],
});
```

**After:**
```typescript
import { PrismaClient } from "../generated/prisma-client/client.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Create PostgreSQL connection pool
const pool = new Pool({ connectionString: dbUrl });

// Create Prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// Create Prisma Client with adapter (Prisma v7 requirement)
return new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "production" ? ["error", "warn"] : ["query", "error", "warn"],
});
```

### 4. Type Imports (Multiple Files)

Updated all Prisma type imports to use the new generated client location:

**Files Updated:**
- `src/lib/care-schedules.ts`
- `src/lib/family-members.ts`
- `src/lib/session-reports.ts`

**Before:**
```typescript
import type { DayOfWeek, RecurrencePattern } from "@prisma/client";
```

**After:**
```typescript
import type { DayOfWeek, RecurrencePattern } from "../generated/prisma-client/client.js";
```

### 5. Vite Configuration (`app.config.ts`)

Updated SSR and optimization configs to exclude the new adapter packages:

**Before:**
```typescript
ssr: {
  external: ["@prisma/client", ".prisma/client"],
  noExternal: [],
},
optimizeDeps: {
  exclude: ["@prisma/client", ".prisma/client"],
},
```

**After:**
```typescript
ssr: {
  external: ["@prisma/client", "@prisma/adapter-pg", "pg", "~/generated/prisma-client"],
  noExternal: [],
},
optimizeDeps: {
  exclude: ["@prisma/client", "@prisma/adapter-pg", "pg", "~/generated/prisma-client"],
},
```

### 6. Bug Fix (`src/lib/care-schedules.ts`)

Added missing `service` relation include in `generateSessionsFromSchedule`:

```typescript
const schedule = await db.careSchedule.findUnique({
  where: { id: scheduleId },
  include: {
    children: true,
    service: true, // Added to fix service rate calculation
  },
});
```

## Migration Steps Performed

1. ✅ Updated package.json dependencies
2. ✅ Ran `pnpm install` to install new packages
3. ✅ Updated Prisma schema with new generator config and removed datasource URL
4. ✅ Updated database client to use adapter pattern
5. ✅ Updated all type imports across the codebase
6. ✅ Updated Vite configuration for new packages
7. ✅ Ran `pnpm prisma:generate` to generate new client
8. ✅ Fixed missing service relation in care-schedules
9. ✅ Verified TypeScript compilation (no errors)
10. ✅ Ran production build successfully

## Generated Files

The Prisma Client is now generated to:
```
src/generated/prisma-client/
├── browser.ts
├── client.ts
├── commonInputTypes.ts
├── enums.ts
├── models.ts
├── internal/
└── models/
```

**Note:** The `src/generated/` directory should be added to `.gitignore` if not already present.

## Environment Variables

No changes to environment variables required. The application continues to use:
- `DATABASE_URL` - PostgreSQL connection string (including SSL certificate path resolution)

## Testing Checklist

- ✅ TypeScript compilation passes
- ✅ Production build succeeds
- [ ] Database migrations run successfully
- [ ] Application starts without errors
- [ ] Database queries work correctly
- [ ] All CRUD operations function properly
- [ ] SSL certificate path resolution works in production

## Rollback Instructions

If you need to rollback to Prisma v5:

1. Revert `package.json` changes
2. Run `pnpm install`
3. Revert `prisma/schema.prisma` to add `url` field back and use `prisma-client-js`
4. Revert `src/lib/db.ts` to remove adapter pattern
5. Revert all type imports to use `@prisma/client`
6. Revert `app.config.ts` changes
7. Run `pnpm prisma:generate`
8. Delete `src/generated/` directory

## Additional Notes

- **Node.js Requirement:** Prisma v7 requires Node.js >= 20.19.0 (we use Node.js >= 22)
- **TypeScript Requirement:** Prisma v7 requires TypeScript >= 5.4.0
- **Performance:** Prisma v7 is built in TypeScript (Rust-free), resulting in faster queries and smaller bundle sizes
- **Compatibility:** Fully compatible with SolidStart and SSR applications
- **MongoDB:** Prisma v7 does not yet support MongoDB (we use PostgreSQL, so no issue)

## Resources

- [Prisma v7 Migration Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Prisma with SolidStart Guide](https://www.prisma.io/docs/guides/solid-start)
- [Database Adapters Documentation](https://www.prisma.io/docs/orm/overview/databases/database-drivers)

## Status

✅ **Migration Complete**

The application has been successfully upgraded to Prisma v7 with all builds passing and no TypeScript errors.