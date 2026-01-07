-- Fix existing sessions that have drop-off recorded but aren't marked as confirmed
-- This updates sessions where dropOffTime exists but isConfirmed is false

-- Update sessions with drop-off to be confirmed and IN_PROGRESS
UPDATE "CareSession"
SET 
  "isConfirmed" = true,
  "status" = 'IN_PROGRESS'
WHERE 
  "dropOffTime" IS NOT NULL 
  AND "isConfirmed" = false;

-- Update sessions with pick-up to be COMPLETED (in case they have pick-up but wrong status)
UPDATE "CareSession"
SET 
  "isConfirmed" = true,
  "status" = 'COMPLETED'
WHERE 
  "pickUpTime" IS NOT NULL 
  AND "status" != 'COMPLETED';

-- Show the results
SELECT 
  id,
  "scheduledStart",
  status,
  "isConfirmed",
  "dropOffTime",
  "pickUpTime"
FROM "CareSession"
WHERE "dropOffTime" IS NOT NULL OR "pickUpTime" IS NOT NULL
ORDER BY "scheduledStart" DESC
LIMIT 10;