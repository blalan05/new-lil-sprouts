-- CreateTable
CREATE TABLE "SessionExpense" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "SessionExpense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SessionExpense_sessionId_idx" ON "SessionExpense"("sessionId");

-- CreateIndex
CREATE INDEX "SessionExpense_category_idx" ON "SessionExpense"("category");

-- AddForeignKey
ALTER TABLE "SessionExpense" ADD CONSTRAINT "SessionExpense_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CareSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
