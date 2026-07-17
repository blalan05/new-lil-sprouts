-- Decimal columns for currency fields (safe to re-run if types are already DECIMAL)
ALTER TABLE "Service" ALTER COLUMN "defaultHourlyRate" TYPE DECIMAL(10,2) USING "defaultHourlyRate"::numeric(10,2);
ALTER TABLE "CareSchedule" ALTER COLUMN "hourlyRate" TYPE DECIMAL(10,2) USING "hourlyRate"::numeric(10,2);
ALTER TABLE "CareSession" ALTER COLUMN "hourlyRate" TYPE DECIMAL(10,2) USING "hourlyRate"::numeric(10,2);
ALTER TABLE "SessionExpense" ALTER COLUMN "amount" TYPE DECIMAL(10,2) USING "amount"::numeric(10,2);
ALTER TABLE "Expense" ALTER COLUMN "amount" TYPE DECIMAL(10,2) USING "amount"::numeric(10,2);
ALTER TABLE "Payment" ALTER COLUMN "amount" TYPE DECIMAL(10,2) USING "amount"::numeric(10,2);

-- Soft-delete columns
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "Family" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "FamilyService" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "FamilyMember" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "CareSchedule" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "Unavailability" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "Child" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "CareSession" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "SessionExpense" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "Expense" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "SessionReport" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(3);

CREATE INDEX IF NOT EXISTS "Service_deletedAt_idx" ON "Service"("deletedAt");
CREATE INDEX IF NOT EXISTS "Family_deletedAt_idx" ON "Family"("deletedAt");
CREATE INDEX IF NOT EXISTS "FamilyService_deletedAt_idx" ON "FamilyService"("deletedAt");
CREATE INDEX IF NOT EXISTS "FamilyMember_deletedAt_idx" ON "FamilyMember"("deletedAt");
CREATE INDEX IF NOT EXISTS "CareSchedule_deletedAt_idx" ON "CareSchedule"("deletedAt");
CREATE INDEX IF NOT EXISTS "Unavailability_deletedAt_idx" ON "Unavailability"("deletedAt");
CREATE INDEX IF NOT EXISTS "Child_deletedAt_idx" ON "Child"("deletedAt");
CREATE INDEX IF NOT EXISTS "CareSession_deletedAt_idx" ON "CareSession"("deletedAt");
CREATE INDEX IF NOT EXISTS "SessionExpense_deletedAt_idx" ON "SessionExpense"("deletedAt");
CREATE INDEX IF NOT EXISTS "Expense_deletedAt_idx" ON "Expense"("deletedAt");
CREATE INDEX IF NOT EXISTS "SessionReport_deletedAt_idx" ON "SessionReport"("deletedAt");
CREATE INDEX IF NOT EXISTS "Payment_deletedAt_idx" ON "Payment"("deletedAt");
CREATE INDEX IF NOT EXISTS "Document_deletedAt_idx" ON "Document"("deletedAt");

-- Payment.familyId: SetNull -> Restrict (preserve tax history when family archived)
ALTER TABLE "Payment" DROP CONSTRAINT IF EXISTS "Payment_familyId_fkey";
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
