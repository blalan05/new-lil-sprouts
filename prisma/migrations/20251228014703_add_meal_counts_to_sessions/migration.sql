-- AlterTable
ALTER TABLE "CareSession" ADD COLUMN     "afternoonSnackCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "breakfastCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dinnerCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lunchCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "morningSnackCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT,
    "expenseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "familyId" TEXT,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Expense_familyId_idx" ON "Expense"("familyId");

-- CreateIndex
CREATE INDEX "Expense_category_idx" ON "Expense"("category");

-- CreateIndex
CREATE INDEX "Expense_expenseDate_idx" ON "Expense"("expenseDate");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;
