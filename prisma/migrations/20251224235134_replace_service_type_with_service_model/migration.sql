/*
  Warnings:

  - Added the required column `serviceId` to the `CareSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `CareSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CareSchedule" ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CareSession" ADD COLUMN     "serviceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "defaultHourlyRate" DOUBLE PRECISION,
    "pricingType" TEXT NOT NULL DEFAULT 'FLAT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiresChildren" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyService" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_code_key" ON "Service"("code");

-- CreateIndex
CREATE INDEX "Service_code_idx" ON "Service"("code");

-- CreateIndex
CREATE INDEX "Service_isActive_idx" ON "Service"("isActive");

-- CreateIndex
CREATE INDEX "FamilyService_familyId_idx" ON "FamilyService"("familyId");

-- CreateIndex
CREATE INDEX "FamilyService_serviceId_idx" ON "FamilyService"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyService_familyId_serviceId_key" ON "FamilyService"("familyId", "serviceId");

-- CreateIndex
CREATE INDEX "CareSchedule_serviceId_idx" ON "CareSchedule"("serviceId");

-- CreateIndex
CREATE INDEX "CareSession_serviceId_idx" ON "CareSession"("serviceId");

-- AddForeignKey
ALTER TABLE "FamilyService" ADD CONSTRAINT "FamilyService_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyService" ADD CONSTRAINT "FamilyService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareSchedule" ADD CONSTRAINT "CareSchedule_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareSession" ADD CONSTRAINT "CareSession_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
