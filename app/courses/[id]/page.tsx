import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import CourseDetail from "@/components/course-detail";
import CuratedCourseDetail from "@/components/curated-course-detail";

export const dynamic = "force-dynamic";

type PageParams = {
  id: string;
};

/**
 * Lookup course by slug first, then by ID
 */
async function findCourse(idOrSlug: string) {
  // Try slug first (curated courses)
  let course = await prisma.course.findUnique({
    where: { slug: idOrSlug },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              order: true,
              estimatedMinutes: true,
              visualization: true,
              exercises: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  // Fall back to ID
  if (!course) {
    course = await prisma.course.findUnique({
      where: { id: idOrSlug },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                description: true,
                order: true,
                estimatedMinutes: true,
                visualization: true,
                exercises: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });
  }

  return course;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  try {
    const { id: idOrSlug } = await params;
    if (!idOrSlug) return { title: "Course Not Found" };

    const course = await findCourse(idOrSlug);
    if (!course) return { title: "Course Not Found" };

    return {
      title: `${course.title} | AI Tutor`,
      description: course.description || "View course details",
    };
  } catch {
    return { title: "Course", description: "View course details" };
  }
}

interface PageProps {
  params: Promise<PageParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CoursePage({ params }: PageProps) {
  const { id: idOrSlug } = await params;
  if (!idOrSlug) notFound();

  const session = await getServerSession(authOptions);

  const course = await findCourse(idOrSlug);
  if (!course) notFound();

  // For non-public custom courses, require auth + ownership
  if (!course.isPublic && course.type === "CUSTOM") {
    if (!session?.user) {
      redirect("/auth/signin?callbackUrl=/courses/" + idOrSlug);
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });
    if (!user || course.userId !== user.id) {
      redirect("/dashboard");
    }
  }

  // For public/curated courses, auth is optional but needed for progress
  let progress = 0;
  let lastLessonId: string | null = null;
  let completedLessonIds: string[] = [];

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) {
      const userProgress = await prisma.userProgress.findFirst({
        where: { courseId: course.id, userId: user.id },
      });
      progress = userProgress?.progress ?? 0;
      lastLessonId = userProgress?.lastLessonId ?? null;

      // Fetch completed lessons for this course
      const completions = await prisma.lessonCompletion.findMany({
        where: {
          userId: user.id,
          Lesson: { module: { courseId: course.id } },
        },
        select: { lessonId: true },
      });
      completedLessonIds = completions.map((c) => c.lessonId);
    }
  }

  const isCurated = course.type === "CURATED";

  // Use slug for curated course links, ID for custom
  const courseHref = course.slug || course.id;

  if (isCurated) {
    return (
      <CuratedCourseDetail
        course={course}
        courseHref={courseHref}
        progress={progress}
        lastLessonId={lastLessonId}
        completedLessonIds={completedLessonIds}
      />
    );
  }

  // Original view for custom courses
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to AI Tutor
          </Link>
        </Button>
      </div>
      <CourseDetail
        course={course}
        progress={progress}
        lastLessonId={lastLessonId}
      />
    </div>
  );
}
