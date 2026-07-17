-- Production migration history repair
--
-- Use when migrate deploy fails or status shows migrations "not found locally"
-- because migration folders were reordered/renamed.
--
-- Step 1 — inspect history:
--   SELECT migration_name, finished_at, rolled_back_at, logs
--   FROM "_prisma_migrations"
--   ORDER BY finished_at NULLS LAST, migration_name;
--
-- Step 2 — if a migration FAILED and deploy is blocked (P3018), on the server run:
--   node node_modules/prisma/build/index.js migrate resolve --rolled-back "MIGRATION_NAME"
--
-- Step 3 — rename old rows to match current repo folder names (skip rows that already exist):

UPDATE "_prisma_migrations"
SET migration_name = '20251228014705_decimal_and_soft_delete'
WHERE migration_name = '20250609000000_decimal_and_soft_delete'
  AND NOT EXISTS (
    SELECT 1 FROM "_prisma_migrations"
    WHERE migration_name = '20251228014705_decimal_and_soft_delete'
  );

UPDATE "_prisma_migrations"
SET migration_name = '20251228014706_add_notifications'
WHERE migration_name = '20250609100000_add_notifications'
  AND NOT EXISTS (
    SELECT 1 FROM "_prisma_migrations"
    WHERE migration_name = '20251228014706_add_notifications'
  );

-- If timestamptz was applied under the old combined migration name but 20251228014704 is pending,
-- mark the late timestamptz pass as applied only after verifying columns are already TIMESTAMPTZ:
--   SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name = 'Service' AND column_name IN ('createdAt', 'updatedAt');
