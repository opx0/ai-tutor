-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('CURATED', 'CUSTOM');

-- AlterTable: User - add role
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';

-- AlterTable: Course - add type, slug, icon, color, estimatedHours
ALTER TABLE "Course" ADD COLUMN "type" "CourseType" NOT NULL DEFAULT 'CUSTOM',
ADD COLUMN "slug" TEXT,
ADD COLUMN "icon" TEXT,
ADD COLUMN "color" TEXT,
ADD COLUMN "estimatedHours" INTEGER;

-- AlterTable: Lesson - add estimatedMinutes
ALTER TABLE "Lesson" ADD COLUMN "estimatedMinutes" INTEGER;

-- CreateTable: RoadmapNode
CREATE TABLE "RoadmapNode" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "group" TEXT,

    CONSTRAINT "RoadmapNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable: SpacedReview
CREATE TABLE "SpacedReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "nextReviewAt" TIMESTAMPTZ(6) NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "SpacedReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable: _CoursePrerequisites (implicit many-to-many)
CREATE TABLE "_CoursePrerequisites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CoursePrerequisites_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex: RoadmapNode
CREATE UNIQUE INDEX "RoadmapNode_courseId_key" ON "RoadmapNode"("courseId");

-- CreateIndex: SpacedReview
CREATE INDEX "SpacedReview_userId_nextReviewAt_idx" ON "SpacedReview"("userId", "nextReviewAt");
CREATE INDEX "SpacedReview_lessonId_idx" ON "SpacedReview"("lessonId");
CREATE UNIQUE INDEX "SpacedReview_userId_lessonId_key" ON "SpacedReview"("userId", "lessonId");

-- CreateIndex: _CoursePrerequisites
CREATE INDEX "_CoursePrerequisites_B_index" ON "_CoursePrerequisites"("B");

-- CreateIndex: Course
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
CREATE INDEX "Course_type_idx" ON "Course"("type");

-- AddForeignKey: RoadmapNode
ALTER TABLE "RoadmapNode" ADD CONSTRAINT "RoadmapNode_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: SpacedReview
ALTER TABLE "SpacedReview" ADD CONSTRAINT "SpacedReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SpacedReview" ADD CONSTRAINT "SpacedReview_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: _CoursePrerequisites
ALTER TABLE "_CoursePrerequisites" ADD CONSTRAINT "_CoursePrerequisites_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CoursePrerequisites" ADD CONSTRAINT "_CoursePrerequisites_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
