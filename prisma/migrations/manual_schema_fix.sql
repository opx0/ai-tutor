-- Migration: Fix schema to industry standards
-- This handles data transformation before Prisma applies the structural changes

-- 1. Fix nullable Course.userId — set orphan courses to the first user
UPDATE "Course" SET "userId" = (SELECT id FROM "User" LIMIT 1) WHERE "userId" IS NULL;

-- 2. Fix nullable UserProgress.userId — set orphan progress to the first user
UPDATE "UserProgress" SET "userId" = (SELECT id FROM "User" LIMIT 1) WHERE "userId" IS NULL;

-- 3. Rename lastLesson → lastLessonId for the FK relation
ALTER TABLE "UserProgress" RENAME COLUMN "lastLesson" TO "lastLessonId";

-- 4. Clean up lastLessonId values that reference non-existent lessons
UPDATE "UserProgress" SET "lastLessonId" = NULL
WHERE "lastLessonId" IS NOT NULL
AND "lastLessonId" NOT IN (SELECT id FROM "Lesson");

-- 5. Create enums
DO $$ BEGIN
  CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "SubscriptionStatus" AS ENUM ('FREE', 'PREMIUM', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "SubscriptionInterval" AS ENUM ('MONTHLY', 'YEARLY');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "TransactionStatus" AS ENUM ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 6. Convert difficulty strings to enum values
UPDATE "Course" SET "difficulty" = 'BEGINNER' WHERE LOWER("difficulty") = 'beginner';
UPDATE "Course" SET "difficulty" = 'INTERMEDIATE' WHERE LOWER("difficulty") = 'intermediate';
UPDATE "Course" SET "difficulty" = 'ADVANCED' WHERE LOWER("difficulty") = 'advanced';
-- Catch-all for any unexpected values
UPDATE "Course" SET "difficulty" = 'BEGINNER' WHERE "difficulty" NOT IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- 7. Convert subscriptionStatus strings to enum values
UPDATE "User" SET "subscriptionStatus" = 'FREE' WHERE LOWER("subscriptionStatus") = 'free';
UPDATE "User" SET "subscriptionStatus" = 'PREMIUM' WHERE LOWER("subscriptionStatus") = 'premium';
UPDATE "User" SET "subscriptionStatus" = 'CANCELLED' WHERE LOWER("subscriptionStatus") = 'cancelled';
UPDATE "User" SET "subscriptionStatus" = 'FREE' WHERE "subscriptionStatus" NOT IN ('FREE', 'PREMIUM', 'CANCELLED');

-- 8. Convert subscription interval
UPDATE "Subscription" SET "interval" = 'MONTHLY' WHERE LOWER("interval") = 'monthly';
UPDATE "Subscription" SET "interval" = 'YEARLY' WHERE LOWER("interval") = 'yearly';
UPDATE "Subscription" SET "interval" = 'MONTHLY' WHERE "interval" NOT IN ('MONTHLY', 'YEARLY');

-- 9. Convert transaction status
UPDATE "SubscriptionTransaction" SET "status" = 'CREATED' WHERE LOWER("status") = 'created';
UPDATE "SubscriptionTransaction" SET "status" = 'AUTHORIZED' WHERE LOWER("status") = 'authorized';
UPDATE "SubscriptionTransaction" SET "status" = 'CAPTURED' WHERE LOWER("status") = 'captured';
UPDATE "SubscriptionTransaction" SET "status" = 'FAILED' WHERE LOWER("status") = 'failed';
UPDATE "SubscriptionTransaction" SET "status" = 'CREATED' WHERE "status" NOT IN ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED');

-- 10. Now alter column types to use enums
ALTER TABLE "Course" ALTER COLUMN "difficulty" TYPE "Difficulty" USING "difficulty"::"Difficulty";
ALTER TABLE "User" ALTER COLUMN "subscriptionStatus" TYPE "SubscriptionStatus" USING "subscriptionStatus"::"SubscriptionStatus";
ALTER TABLE "User" ALTER COLUMN "subscriptionStatus" SET DEFAULT 'FREE'::"SubscriptionStatus";
ALTER TABLE "Subscription" ALTER COLUMN "interval" TYPE "SubscriptionInterval" USING "interval"::"SubscriptionInterval";
ALTER TABLE "SubscriptionTransaction" ALTER COLUMN "status" TYPE "TransactionStatus" USING "status"::"TransactionStatus";

-- 11. Make Course.userId non-nullable
ALTER TABLE "Course" ALTER COLUMN "userId" SET NOT NULL;

-- 12. Make UserProgress.userId non-nullable
ALTER TABLE "UserProgress" ALTER COLUMN "userId" SET NOT NULL;

-- 13. Drop old Lesson.completed column
ALTER TABLE "Lesson" DROP COLUMN IF EXISTS "completed";

-- 14. Create LessonCompletion table
CREATE TABLE IF NOT EXISTS "LessonCompletion" (
  "id" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "completedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LessonCompletion_pkey" PRIMARY KEY ("id")
);

-- 15. Add FK constraints for LessonCompletion
ALTER TABLE "LessonCompletion" ADD CONSTRAINT "LessonCompletion_lessonId_fkey"
  FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE;
ALTER TABLE "LessonCompletion" ADD CONSTRAINT "LessonCompletion_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

-- 16. Add unique constraint and indexes for LessonCompletion
CREATE UNIQUE INDEX IF NOT EXISTS "LessonCompletion_lessonId_userId_key" ON "LessonCompletion"("lessonId", "userId");
CREATE INDEX IF NOT EXISTS "LessonCompletion_userId_idx" ON "LessonCompletion"("userId");
CREATE INDEX IF NOT EXISTS "LessonCompletion_lessonId_idx" ON "LessonCompletion"("lessonId");

-- 17. Add lastLessonId FK constraint
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_lastLessonId_fkey"
  FOREIGN KEY ("lastLessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL;

-- 18. Add missing onDelete Cascade for Course → User
-- (Need to drop and recreate the FK)
ALTER TABLE "Course" DROP CONSTRAINT IF EXISTS "Course_userId_fkey";
ALTER TABLE "Course" ADD CONSTRAINT "Course_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

-- 19. Add missing onDelete Cascade for UserProgress → User
ALTER TABLE "UserProgress" DROP CONSTRAINT IF EXISTS "UserProgress_userId_fkey";
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

-- 20. Add composite indexes
CREATE INDEX IF NOT EXISTS "Module_courseId_order_idx" ON "Module"("courseId", "order");
CREATE INDEX IF NOT EXISTS "Lesson_moduleId_order_idx" ON "Lesson"("moduleId", "order");
CREATE INDEX IF NOT EXISTS "Course_isPublic_idx" ON "Course"("isPublic");
CREATE INDEX IF NOT EXISTS "UserActivity_userId_createdAt_idx" ON "UserActivity"("userId", "createdAt");

-- 21. Convert timestamps to timestamptz
ALTER TABLE "User" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ;
ALTER TABLE "User" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ;
ALTER TABLE "User" ALTER COLUMN "emailVerified" TYPE TIMESTAMPTZ;
ALTER TABLE "User" ALTER COLUMN "subscriptionExpiresAt" TYPE TIMESTAMPTZ;
ALTER TABLE "Course" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ;
ALTER TABLE "Course" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ;
ALTER TABLE "Session" ALTER COLUMN "expires" TYPE TIMESTAMPTZ;
ALTER TABLE "VerificationToken" ALTER COLUMN "expires" TYPE TIMESTAMPTZ;
ALTER TABLE "UserProgress" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ;
ALTER TABLE "UserProgress" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ;
ALTER TABLE "Note" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ;
ALTER TABLE "Note" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ;
ALTER TABLE "Bookmark" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ;
ALTER TABLE "Subscription" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ;
ALTER TABLE "Subscription" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ;
ALTER TABLE "SubscriptionTransaction" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ;
ALTER TABLE "SubscriptionTransaction" ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ;
ALTER TABLE "UserActivity" ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ;
