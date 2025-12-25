/*
  Warnings:

  - You are about to drop the column `nannyId` on the `CareSession` table. All the data in the column will be lost.
  - You are about to drop the column `nannyProfileId` on the `CareSession` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedById` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `primaryContactId` on the `Family` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NannyProfile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `Family` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentFirstName` to the `Family` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentLastName` to the `Family` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MemberRelationship" AS ENUM ('PARENT', 'GRANDPARENT', 'AUNT_UNCLE', 'SIBLING', 'BABYSITTER', 'NANNY', 'OTHER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "RecurrencePattern" AS ENUM ('ONCE', 'WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('INCIDENT', 'ACCIDENT', 'BEHAVIOR', 'MEAL', 'NAP', 'ACTIVITY', 'MEDICATION', 'MILESTONE', 'GENERAL');

-- CreateEnum
CREATE TYPE "ReportSeverity" AS ENUM ('INFO', 'MINOR', 'MODERATE', 'SEVERE');

-- DropForeignKey
ALTER TABLE "CareSession" DROP CONSTRAINT "CareSession_nannyId_fkey";

-- DropForeignKey
ALTER TABLE "CareSession" DROP CONSTRAINT "CareSession_nannyProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "Family" DROP CONSTRAINT "Family_primaryContactId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_familyId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "NannyProfile" DROP CONSTRAINT "NannyProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_createdById_fkey";

-- DropIndex
DROP INDEX "CareSession_nannyId_idx";

-- DropIndex
DROP INDEX "Family_primaryContactId_key";

-- DropIndex
DROP INDEX "Payment_type_idx";

-- DropIndex
DROP INDEX "User_role_idx";

-- AlterTable
ALTER TABLE "CareSession" DROP COLUMN "nannyId",
DROP COLUMN "nannyProfileId",
ADD COLUMN     "dropOffBy" TEXT,
ADD COLUMN     "dropOffById" TEXT,
ADD COLUMN     "dropOffTime" TIMESTAMP(3),
ADD COLUMN     "hourlyRate" DOUBLE PRECISION,
ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pickUpBy" TEXT,
ADD COLUMN     "pickUpById" TEXT,
ADD COLUMN     "pickUpTime" TIMESTAMP(3),
ADD COLUMN     "scheduleId" TEXT;

-- AlterTable
ALTER TABLE "Child" ADD COLUMN     "gender" "Gender",
ADD COLUMN     "schoolGrade" TEXT,
ADD COLUMN     "schoolName" TEXT,
ADD COLUMN     "schoolTeacher" TEXT;

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "uploadedById";

-- AlterTable
ALTER TABLE "Family" DROP COLUMN "primaryContactId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "parentFirstName" TEXT NOT NULL,
ADD COLUMN     "parentLastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "createdById",
DROP COLUMN "type",
ADD COLUMN     "method" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "isOwner" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "NannyProfile";

-- DropEnum
DROP TYPE "PaymentType";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "relationship" "MemberRelationship" NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "canPickup" BOOLEAN NOT NULL DEFAULT false,
    "allergies" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "familyId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareSchedule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "recurrence" "RecurrencePattern" NOT NULL DEFAULT 'WEEKLY',
    "daysOfWeek" "DayOfWeek"[],
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "hourlyRate" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "familyId" TEXT NOT NULL,

    CONSTRAINT "CareSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unavailability" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "allDay" BOOLEAN NOT NULL DEFAULT true,
    "startTime" TEXT,
    "endTime" TEXT,
    "reason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Unavailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionReport" (
    "id" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "severity" "ReportSeverity" NOT NULL DEFAULT 'INFO',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionTaken" TEXT,
    "followUpNeeded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "careSessionId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "reportedById" TEXT,

    CONSTRAINT "SessionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CareScheduleChildren" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_userId_key" ON "FamilyMember"("userId");

-- CreateIndex
CREATE INDEX "FamilyMember_familyId_idx" ON "FamilyMember"("familyId");

-- CreateIndex
CREATE INDEX "FamilyMember_canPickup_idx" ON "FamilyMember"("canPickup");

-- CreateIndex
CREATE INDEX "CareSchedule_familyId_idx" ON "CareSchedule"("familyId");

-- CreateIndex
CREATE INDEX "CareSchedule_isActive_idx" ON "CareSchedule"("isActive");

-- CreateIndex
CREATE INDEX "Unavailability_startDate_idx" ON "Unavailability"("startDate");

-- CreateIndex
CREATE INDEX "Unavailability_endDate_idx" ON "Unavailability"("endDate");

-- CreateIndex
CREATE INDEX "Unavailability_userId_idx" ON "Unavailability"("userId");

-- CreateIndex
CREATE INDEX "SessionReport_careSessionId_idx" ON "SessionReport"("careSessionId");

-- CreateIndex
CREATE INDEX "SessionReport_childId_idx" ON "SessionReport"("childId");

-- CreateIndex
CREATE INDEX "SessionReport_type_idx" ON "SessionReport"("type");

-- CreateIndex
CREATE INDEX "SessionReport_severity_idx" ON "SessionReport"("severity");

-- CreateIndex
CREATE INDEX "SessionReport_timestamp_idx" ON "SessionReport"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- CreateIndex
CREATE INDEX "Setting_key_idx" ON "Setting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_CareScheduleChildren_AB_unique" ON "_CareScheduleChildren"("A", "B");

-- CreateIndex
CREATE INDEX "_CareScheduleChildren_B_index" ON "_CareScheduleChildren"("B");

-- CreateIndex
CREATE INDEX "CareSession_scheduleId_idx" ON "CareSession"("scheduleId");

-- CreateIndex
CREATE INDEX "CareSession_isConfirmed_idx" ON "CareSession"("isConfirmed");

-- CreateIndex
CREATE INDEX "Family_email_idx" ON "Family"("email");

-- CreateIndex
CREATE INDEX "Payment_paidDate_idx" ON "Payment"("paidDate");

-- CreateIndex
CREATE INDEX "User_isOwner_idx" ON "User"("isOwner");

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareSchedule" ADD CONSTRAINT "CareSchedule_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unavailability" ADD CONSTRAINT "Unavailability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareSession" ADD CONSTRAINT "CareSession_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "CareSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionReport" ADD CONSTRAINT "SessionReport_careSessionId_fkey" FOREIGN KEY ("careSessionId") REFERENCES "CareSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionReport" ADD CONSTRAINT "SessionReport_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionReport" ADD CONSTRAINT "SessionReport_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CareScheduleChildren" ADD CONSTRAINT "_CareScheduleChildren_A_fkey" FOREIGN KEY ("A") REFERENCES "CareSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CareScheduleChildren" ADD CONSTRAINT "_CareScheduleChildren_B_fkey" FOREIGN KEY ("B") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
