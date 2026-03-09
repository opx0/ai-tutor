import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import LessonPageContent from "./LessonPageContent";

export const dynamic = 'force-dynamic';

// Define the params type
type PageParams = {
  id: string;
  lessonId: string;
};

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  try {
    // Extract params safely
    const { id: courseId, lessonId } = await params;

    if (!lessonId) {
      return {
        title: "Lesson Not Found",
      };
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      return {
        title: "Lesson Not Found",
      };
    }

    return {
      title: `${lesson.title} | ${lesson.module.course.title}`,
      description:
        lesson.description || `Learn about ${lesson.title} in this lesson.`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Lesson",
      description: "View lesson details",
    };
  }
}

interface PageProps {
  params: Promise<PageParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LessonPage({
  params,
  searchParams,
}: PageProps) {
  try {
    // Extract params safely
    const { id: courseId, lessonId } = await params;

    if (!courseId || !lessonId) {
      notFound();
    }

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      redirect(
        `/auth/signin?callbackUrl=/courses/${courseId}/${lessonId}`
      );
    }

    // Get user from database to ensure we have the ID
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!user) {
      redirect("/auth/signin");
    }

    const userId = user.id;

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      include: {
        module: {
          include: {
            course: true,
            lessons: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      notFound();
    }

    // Check if user has access to this course
    if (
      lesson.module.course.userId !== userId &&
      !lesson.module.course.isPublic
    ) {
      // If the course doesn't belong to the user and isn't public, redirect to dashboard
      redirect("/dashboard");
    }

    const course = lesson.module.course;
    const moduleId = lesson.moduleId;

    // Get all modules for the course
    const modules = await prisma.module.findMany({
      where: {
        courseId: course.id,
      },
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    // Find current lesson index and get next/previous lessons
    const currentModuleIndex = modules.findIndex((m) => m.id === moduleId);
    const currentModule = modules[currentModuleIndex];
    const currentLessonIndex = currentModule.lessons.findIndex(
      (l) => l.id === lesson.id
    );

    let nextLesson = null;
    let previousLesson = null;

    // If not the last lesson in the module
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      nextLesson = currentModule.lessons[currentLessonIndex + 1];
    } else if (currentModuleIndex < modules.length - 1) {
      // If there's a next module
      nextLesson = modules[currentModuleIndex + 1].lessons[0];
    }

    // If not the first lesson in the module
    if (currentLessonIndex > 0) {
      previousLesson = currentModule.lessons[currentLessonIndex - 1];
    } else if (currentModuleIndex > 0) {
      // If there's a previous module
      const prevModule = modules[currentModuleIndex - 1];
      previousLesson = prevModule.lessons[prevModule.lessons.length - 1];
    }

    // Mark lesson as completed for this user and update progress
    if (userId) {
      // Upsert a LessonCompletion record for this user+lesson pair
      await prisma.lessonCompletion.upsert({
        where: {
          lessonId_userId: {
            lessonId: lesson.id,
            userId,
          },
        },
        update: {}, // already completed — nothing to change
        create: {
          id: `${lesson.id}_${userId}`,
          lessonId: lesson.id,
          userId,
        },
      });

      // Count how many lessons in this course the current user has completed
      const totalLessons = modules.reduce(
        (acc, module) => acc + module.lessons.length,
        0
      );

      const completedLessons = await prisma.lessonCompletion.count({
        where: {
          userId,
          Lesson: {
            module: {
              courseId: course.id,
            },
          },
        },
      });

      const progress = Math.round((completedLessons / totalLessons) * 100);

      // Upsert UserProgress using the correct compound unique key
      await prisma.userProgress.upsert({
        where: {
          courseId_userId: {
            courseId: course.id,
            userId,
          },
        },
        update: {
          progress,
          lastLessonId: lesson.id,
        },
        create: {
          courseId: course.id,
          userId,
          progress,
          lastLessonId: lesson.id,
        },
      });
    }

    return (
      <LessonPageContent
        lesson={lesson}
        course={course}
        currentModule={currentModule}
        currentLessonIndex={currentLessonIndex}
        nextLesson={nextLesson}
        previousLesson={previousLesson}
      />
    );
  } catch (error) {
    console.error("Error rendering lesson page:", error);
    notFound();
  }
}
