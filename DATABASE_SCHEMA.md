# Lil Sprouts - Database Schema Documentation

## Overview
This database schema is designed for a nanny business management system. It supports tracking families, children, schedules, payments, communication, and documentation for tax and accounting purposes.

## Core Entities

### User
The central authentication and user management table. Supports multiple roles.

**Fields:**
- `id` (UUID) - Primary key
- `email` (String, Unique) - User's email address
- `username` (String, Unique) - Login username
- `password` (String) - Hashed password
- `role` (Enum: ADMIN, NANNY, PARENT) - User role
- `firstName` (String, Optional)
- `lastName` (String, Optional)
- `phone` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relationships:**
- One-to-one with `Family` (as primary contact)
- One-to-one with `NannyProfile`
- One-to-many with `CareSession` (as nanny)
- One-to-many with `Message` (as sender and recipient)
- One-to-many with `Payment` (creator)
- One-to-many with `Document` (uploader)

---

### Family
Represents a family unit that uses the nanny services.

**Fields:**
- `id` (UUID) - Primary key
- `familyName` (String) - Family surname or identifier
- `address` (String, Optional)
- `city` (String, Optional)
- `state` (String, Optional)
- `zipCode` (String, Optional)
- `emergencyContact` (String, Optional) - Emergency contact name
- `emergencyPhone` (String, Optional) - Emergency contact phone
- `notes` (String, Optional) - General notes about the family
- `primaryContactId` (UUID, Unique) - Foreign key to User
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relationships:**
- One-to-one with `User` (primary contact)
- One-to-many with `Child`
- One-to-many with `CareSession`
- One-to-many with `Payment`
- One-to-many with `Document`
- One-to-many with `Message`

---

### Child
Individual children being cared for.

**Fields:**
- `id` (UUID) - Primary key
- `firstName` (String)
- `lastName` (String)
- `dateOfBirth` (DateTime)
- `allergies` (String, Optional) - Known allergies
- `medications` (String, Optional) - Current medications
- `specialNeeds` (String, Optional) - Special needs or requirements
- `notes` (String, Optional) - Additional notes
- `familyId` (UUID) - Foreign key to Family
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relationships:**
- Many-to-one with `Family`
- Many-to-many with `CareSession`

---

### NannyProfile
Extended profile information for nannies.

**Fields:**
- `id` (UUID) - Primary key
- `hourlyRate` (Float) - Hourly rate for services
- `availability` (String, Optional) - JSON or text describing availability
- `certifications` (String, Optional) - CPR, First Aid, etc.
- `yearsExperience` (Int, Optional)
- `bio` (String, Optional) - Professional biography
- `isActive` (Boolean) - Whether the nanny is currently active
- `userId` (UUID, Unique) - Foreign key to User
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relationships:**
- One-to-one with `User`
- One-to-many with `CareSession`

---

### CareSession
Represents a scheduled or completed care session.

**Fields:**
- `id` (UUID) - Primary key
- `scheduledStart` (DateTime) - Scheduled start time
- `scheduledEnd` (DateTime) - Scheduled end time
- `actualStart` (DateTime, Optional) - Actual start time
- `actualEnd` (DateTime, Optional) - Actual end time
- `status` (Enum: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
- `notes` (String, Optional) - Session notes
- `familyId` (UUID) - Foreign key to Family
- `nannyId` (UUID) - Foreign key to User
- `nannyProfileId` (UUID, Optional) - Foreign key to NannyProfile
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relationships:**
- Many-to-one with `Family`
- Many-to-one with `User` (nanny)
- Many-to-one with `NannyProfile`
- Many-to-many with `Child`
- One-to-many with `Payment`

**Use Cases:**
- Schedule future care sessions
- Track actual hours worked for billing
- Link payments to specific sessions
- Record session notes and activities

---

### Payment
Tracks all financial transactions.

**Fields:**
- `id` (UUID) - Primary key
- `amount` (Float) - Payment amount
- `type` (Enum: FAMILY_PAYMENT, NANNY_PAYMENT)
  - `FAMILY_PAYMENT`: Payment from family to business
  - `NANNY_PAYMENT`: Payment from business to nanny
- `status` (Enum: PENDING, PAID, OVERDUE, CANCELLED)
- `dueDate` (DateTime, Optional) - When payment is due
- `paidDate` (DateTime, Optional) - When payment was made
- `invoiceNumber` (String, Optional, Unique) - Invoice reference
- `notes` (String, Optional)
- `taxYear` (Int, Optional) - For tax reporting (e.g., 2024)
- `familyId` (UUID, Optional) - Foreign key to Family
- `careSessionId` (UUID, Optional) - Foreign key to CareSession
- `createdById` (UUID) - Foreign key to User (who created the payment)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relationships:**
- Many-to-one with `Family`
- Many-to-one with `CareSession`
- Many-to-one with `User` (creator)

**Use Cases:**
- Generate invoices for families
- Track payments to nannies
- Generate tax reports by year
- Monitor overdue payments
- Link payments to specific care sessions

---

### Message
Internal messaging system for communication.

**Fields:**
- `id` (UUID) - Primary key
- `subject` (String, Optional) - Message subject
- `body` (String) - Message content
- `isRead` (Boolean) - Read status
- `senderId` (UUID) - Foreign key to User
- `recipientId` (UUID) - Foreign key to User
- `familyId` (UUID, Optional) - Foreign key to Family (for context)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relationships:**
- Many-to-one with `User` (sender)
- Many-to-one with `User` (recipient)
- Many-to-one with `Family` (optional context)

**Use Cases:**
- Communication between nannies and families
- Admin notifications
- Schedule change notifications
- General announcements

---

### Document
File storage and management.

**Fields:**
- `id` (UUID) - Primary key
- `fileName` (String) - Original file name
- `filePath` (String) - Path to stored file
- `fileSize` (Int, Optional) - File size in bytes
- `mimeType` (String, Optional) - File MIME type
- `description` (String, Optional) - File description
- `category` (String, Optional) - Document category
  - Examples: "contract", "medical", "emergency_contact", "tax_document"
- `familyId` (UUID, Optional) - Foreign key to Family
- `uploadedById` (UUID) - Foreign key to User
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relationships:**
- Many-to-one with `Family`
- Many-to-one with `User` (uploader)

**Use Cases:**
- Store contracts and agreements
- Medical information and consent forms
- Emergency contact forms
- Tax documents (1099s, receipts)
- Insurance information

---

## Indexes

Performance indexes have been added on frequently queried fields:

- `User`: email, role
- `Family`: familyName
- `Child`: familyId, lastName + firstName
- `CareSession`: familyId, nannyId, scheduledStart, status
- `Payment`: familyId, status, type, taxYear, dueDate
- `Message`: senderId, recipientId, familyId, createdAt
- `Document`: familyId, category

---

## Key Features Enabled

### 1. Family & Child Management
- Track multiple families with detailed contact information
- Associate children with families
- Store medical and emergency information

### 2. Schedule Management
- Create care sessions with scheduled times
- Track actual hours worked (different from scheduled)
- Link multiple children to a single session
- Support different session statuses (scheduled, in progress, completed, cancelled)

### 3. Financial Tracking
- Separate payment types for family payments and nanny payroll
- Link payments to specific care sessions
- Track payment status and due dates
- Generate invoices with unique invoice numbers
- Tag payments by tax year for reporting

### 4. Communication
- Internal messaging between users
- Associate messages with families for context
- Track read/unread status

### 5. Document Management
- Store important documents by family
- Categorize documents for easy retrieval
- Track who uploaded documents and when

### 6. Tax & Accounting
- Track all payments by tax year
- Link payments to care sessions for detailed reporting
- Store tax-related documents
- Generate reports on income and expenses

---

## Data Relationships Summary

```
User (PARENT) ←→ Family (primary contact)
Family ←→ Children (one-to-many)
User (NANNY) ←→ NannyProfile (one-to-one)
CareSession ←→ Family, Nanny, Children (many relationships)
Payment ←→ Family, CareSession (for invoicing)
Message ←→ Users (sender/recipient), Family (context)
Document ←→ Family, User (uploader)
```

---

## Next Steps

1. **Authentication System**: Update the existing auth to support roles
2. **Admin Dashboard**: Create views for managing all entities
3. **Family Portal**: Allow families to view schedules and payments
4. **Nanny Portal**: Allow nannies to clock in/out and view schedules
5. **Reporting**: Build tax and accounting reports
6. **File Upload**: Implement document upload functionality
7. **Notifications**: Email/SMS for schedule changes and payment reminders

---

## Migration

The initial migration has been created. To apply it:

```bash
pnpm exec prisma migrate dev
```

To generate the Prisma Client:

```bash
pnpm exec prisma generate
```

To reset the database (WARNING: deletes all data):

```bash
pnpm exec prisma migrate reset
```
