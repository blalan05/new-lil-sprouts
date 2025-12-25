-- Seed script to create initial services and migrate existing data
-- Run this AFTER running the Prisma migration

-- Insert default services
INSERT INTO "Service" (id, name, code, description, "defaultHourlyRate", "pricingType", "requiresChildren", "isActive", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Childcare', 'CHILDCARE', 'General childcare services', NULL, 'PER_CHILD', true, true, NOW(), NOW()),
  (gen_random_uuid(), 'Piano Lesson', 'PIANO_LESSON', 'Piano lesson services', NULL, 'FLAT', false, true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Note: After running this seed, you'll need to:
-- 1. Update existing CareSchedule records to reference Service IDs
-- 2. Update existing CareSession records to reference Service IDs
-- 3. Migrate FamilyServiceType to FamilyService with Service IDs

