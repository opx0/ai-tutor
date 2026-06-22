import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
      description: lesson.description || `Learn about ${lesson.title} in this lesson.`,
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
  const currentModuleIndex = modules.findIndex((m) => m.id === lesson.moduleId);
  const currentModule = modules[currentModuleIndex];
  const currentLessonIndex = currentModule.lessons.findIndex((l) => l.id === lesson.id);

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

  // Fetch user completion state (writes are handled in an API route from the client)
  let completedLessonIds: string[] = [];

  if (session?.user?.id) {
    const completions = await prisma.lessonCompletion.findMany({
      where: {
        userId: session.user.id,
        Lesson: { module: { courseId: course.id } },
      },
      select: { lessonId: true },
    });
    completedLessonIds = completions.map((c) => c.lessonId);
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
      modules={modules}
      completedLessonIds={completedLessonIds}
      isCurated={course.type === "CURATED"}
      autoCompleteEnabled={Boolean(session?.user?.id)}
    />
  );
}
