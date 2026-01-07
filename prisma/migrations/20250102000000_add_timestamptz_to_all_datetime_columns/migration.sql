-- Migration to convert all TIMESTAMP columns to TIMESTAMPTZ for proper timezone handling
-- This fixes timezone issues when saving and retrieving dates

-- Service table
ALTER TABLE "Service" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Service" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);

-- User table
ALTER TABLE "User" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "User" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);

-- Family table
ALTER TABLE "Family" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Family" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);

-- FamilyService table
ALTER TABLE "FamilyService" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);

-- FamilyMember table
ALTER TABLE "FamilyMember" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "FamilyMember" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);

-- CareSchedule table
ALTER TABLE "CareSchedule" ALTER COLUMN "startDate" TYPE TIMESTAMPTZ(3);
ALTER TABLE "CareSchedule" ALTER COLUMN "endDate" TYPE TIMESTAMPTZ(3);
ALTER TABLE "CareSchedule" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "CareSchedule" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);

-- Unavailability table
ALTER TABLE "Unavailability" ALTER COLUMN "startDate" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Unavailability" ALTER COLUMN "endDate" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Unavailability" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Unavailability" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);

-- Child table
ALTER TABLE "Child" ALTER COLUMN "dateOfBirth" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Child" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Child" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);

-- CareSession table (the most critical for timezone issues)
ALTER TABLE "CareSession" ALTER COLUMN "scheduledStart" TYPE TIMESTAMPTZ(3);
ALTER TABLE "CareSession" ALTER COLUMN "scheduledEnd" TYPE TIMESTAMPTZ(3);
ALTER TABLE "CareSession" ALTER COLUMN "actualStart" TYPE TIMESTAMPTZ(3);
ALTER TABLE "CareSession" ALTER COLUMN "actualEnd" TYPE TIMESTAMPTZ(3);
ALTER TABLE "CareSession" ALTER COLUMN "dropOffTime" TYPE TIMESTAMPTZ(3);
ALTER TABLE "CareSession" ALTER COLUMN "pickUpTime" TYPE TIMESTAMPTZ(3);
ALTER TABLE "CareSession" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "CareSession" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);

-- SessionExpense table
ALTER TABLE "SessionExpense" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "SessionExpense" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);

-- Expense table
ALTER TABLE "Expense" ALTER COLUMN "expenseDate" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Expense" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Expense" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);

-- SessionReport table
ALTER TABLE "SessionReport" ALTER COLUMN "timestamp" TYPE TIMESTAMPTZ(3);
ALTER TABLE "SessionReport" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "SessionReport" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);

-- Payment table
ALTER TABLE "Payment" ALTER COLUMN "dueDate" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Payment" ALTER COLUMN "paidDate" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Payment" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Payment" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);

-- Setting table
ALTER TABLE "Setting" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Setting" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);

-- Document table
ALTER TABLE "Document" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3);
ALTER TABLE "Document" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3);