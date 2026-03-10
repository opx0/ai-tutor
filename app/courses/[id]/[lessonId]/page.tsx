import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import LessonPageContent from "./LessonPageContent";

export const dynamic = "force-dynamic";

type PageParams = {
  id: string;
  lessonId: string;
};

/**
 * Lookup course by slug first, then by ID (reused from course page)
 */
async function findCourseId(idOrSlug: string): Promise<string | null> {
  // Try slug first
  const bySlug = await prisma.course.findUnique({
    where: { slug: idOrSlug },
    select: { id: true },
  });
  if (bySlug) return bySlug.id;

  // Try ID
  const byId = await prisma.course.findUnique({
    where: { id: idOrSlug },
    select: { id: true },
  });
  return byId?.id ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  try {
    const { lessonId } = await params;
    if (!lessonId) return { title: "Lesson Not Found" };

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });

    if (!lesson) return { title: "Lesson Not Found" };

    return {
      title: `${lesson.title} | ${lesson.module.course.title}`,
      description:
        lesson.description || `Learn about ${lesson.title} in this lesson.`,
    };
  } catch {
    return { title: "Lesson", description: "View lesson details" };
  }
}

interface PageProps {
  params: Promise<PageParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LessonPage({ params }: PageProps) {
  const { id: idOrSlug, lessonId } = await params;
  if (!idOrSlug || !lessonId) notFound();

  const session = await getServerSession(authOptions);

  // Resolve the actual course ID
  const courseId = await findCourseId(idOrSlug);
  if (!courseId) notFound();

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: true,
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!lesson) notFound();

  const course = lesson.module.course;

  // Verify lesson belongs to the resolved course
  if (course.id !== courseId) notFound();

  // Access control
  if (!course.isPublic && course.type === "CUSTOM") {
    if (!session?.user) {
      redirect(`/auth/signin?callbackUrl=/courses/${idOrSlug}/${lessonId}`);
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });
    if (!user || course.userId !== user.id) {
      redirect("/dashboard");
    }
  }

  // Get all modules for navigation
  const modules = await prisma.module.findMany({
    where: { courseId: course.id },
    include: { lessons: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });

  // Compute prev/next navigation
  const currentModuleIndex = modules.findIndex(
    (m) => m.id === lesson.moduleId
  );
  const currentModule = modules[currentModuleIndex];
  const currentLessonIndex = currentModule.lessons.findIndex(
    (l) => l.id === lesson.id
  );

  let nextLesson = null;
  let previousLesson = null;

  if (currentLessonIndex < currentModule.lessons.length - 1) {
    nextLesson = currentModule.lessons[currentLessonIndex + 1];
  } else if (currentModuleIndex < modules.length - 1) {
    nextLesson = modules[currentModuleIndex + 1].lessons[0];
  }

  if (currentLessonIndex > 0) {
    previousLesson = currentModule.lessons[currentLessonIndex - 1];
  } else if (currentModuleIndex > 0) {
    const prevModule = modules[currentModuleIndex - 1];
    previousLesson = prevModule.lessons[prevModule.lessons.length - 1];
  }

  // Mark lesson as completed + update progress (requires auth)
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      const userId = user.id;

      await prisma.lessonCompletion.upsert({
        where: { lessonId_userId: { lessonId: lesson.id, userId } },
        update: {},
        create: {
          id: `${lesson.id}_${userId}`,
          lessonId: lesson.id,
          userId,
        },
      });

      const totalLessons = modules.reduce(
        (acc, mod) => acc + mod.lessons.length,
        0
      );
      const completedLessons = await prisma.lessonCompletion.count({
        where: {
          userId,
          Lesson: { module: { courseId: course.id } },
        },
      });

      const progress = Math.round((completedLessons / totalLessons) * 100);

      await prisma.userProgress.upsert({
        where: { courseId_userId: { courseId: course.id, userId } },
        update: { progress, lastLessonId: lesson.id },
        create: {
          courseId: course.id,
          userId,
          progress,
          lastLessonId: lesson.id,
        },
      });

      // Auto-enqueue for spaced review (if not already scheduled)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      await prisma.spacedReview.upsert({
        where: { userId_lessonId: { userId, lessonId: lesson.id } },
        update: {}, // Don't overwrite existing review schedule
        create: {
          userId,
          lessonId: lesson.id,
          nextReviewAt: tomorrow,
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
        },
      });
    }
  }

  // Use slug for curated course links
  const courseHref = course.slug || course.id;

  return (
    <LessonPageContent
      lesson={lesson}
      course={course}
      courseHref={courseHref}
      currentModule={currentModule}
      currentLessonIndex={currentLessonIndex}
      nextLesson={nextLesson}
      previousLesson={previousLesson}
    />
  );
}
