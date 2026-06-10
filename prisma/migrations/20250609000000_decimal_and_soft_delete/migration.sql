-- Decimal columns for currency fields
ALTER TABLE "Service" ALTER COLUMN "defaultHourlyRate" TYPE DECIMAL(10,2) USING "defaultHourlyRate"::numeric(10,2);
ALTER TABLE "CareSchedule" ALTER COLUMN "hourlyRate" TYPE DECIMAL(10,2) USING "hourlyRate"::numeric(10,2);
ALTER TABLE "CareSession" ALTER COLUMN "hourlyRate" TYPE DECIMAL(10,2) USING "hourlyRate"::numeric(10,2);
ALTER TABLE "SessionExpense" ALTER COLUMN "amount" TYPE DECIMAL(10,2) USING "amount"::numeric(10,2);
ALTER TABLE "Expense" ALTER COLUMN "amount" TYPE DECIMAL(10,2) USING "amount"::numeric(10,2);
ALTER TABLE "Payment" ALTER COLUMN "amount" TYPE DECIMAL(10,2) USING "amount"::numeric(10,2);

-- Soft-delete columns
ALTER TABLE "Service" ADD COLUMN "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "Family" ADD COLUMN "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "FamilyService" ADD COLUMN "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "FamilyMember" ADD COLUMN "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "CareSchedule" ADD COLUMN "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "Unavailability" ADD COLUMN "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "Child" ADD COLUMN "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "CareSession" ADD COLUMN "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "SessionExpense" ADD COLUMN "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "Expense" ADD COLUMN "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "SessionReport" ADD COLUMN "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "Payment" ADD COLUMN "deletedAt" TIMESTAMPTZ(3);
ALTER TABLE "Document" ADD COLUMN "deletedAt" TIMESTAMPTZ(3);

CREATE INDEX "Service_deletedAt_idx" ON "Service"("deletedAt");
CREATE INDEX "Family_deletedAt_idx" ON "Family"("deletedAt");
CREATE INDEX "FamilyService_deletedAt_idx" ON "FamilyService"("deletedAt");
CREATE INDEX "FamilyMember_deletedAt_idx" ON "FamilyMember"("deletedAt");
CREATE INDEX "CareSchedule_deletedAt_idx" ON "CareSchedule"("deletedAt");
CREATE INDEX "Unavailability_deletedAt_idx" ON "Unavailability"("deletedAt");
CREATE INDEX "Child_deletedAt_idx" ON "Child"("deletedAt");
CREATE INDEX "CareSession_deletedAt_idx" ON "CareSession"("deletedAt");
CREATE INDEX "SessionExpense_deletedAt_idx" ON "SessionExpense"("deletedAt");
CREATE INDEX "Expense_deletedAt_idx" ON "Expense"("deletedAt");
CREATE INDEX "SessionReport_deletedAt_idx" ON "SessionReport"("deletedAt");
CREATE INDEX "Payment_deletedAt_idx" ON "Payment"("deletedAt");
CREATE INDEX "Document_deletedAt_idx" ON "Document"("deletedAt");

-- Payment.familyId: SetNull -> Restrict (preserve tax history when family archived)
ALTER TABLE "Payment" DROP CONSTRAINT IF EXISTS "Payment_familyId_fkey";
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
