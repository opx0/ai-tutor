import CourseDetail from "@/components/course-detail";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

// Define the params type
type PageParams = {
  id: string;
};

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  try {
    // Extract params safely
    const { id: courseId } = await params;

    if (!courseId) {
      return {
        title: "Course Not Found",
      };
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return {
        title: "Course Not Found",
      };
    }

    return {
      title: `${course.title} | AI Tutor`,
      description: course.description || "View course details",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Course",
      description: "View course details",
    };
  }
}

interface PageProps {
  params: Promise<PageParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CoursePage({
  params,
  searchParams,
}: PageProps) {
  try {
    // Extract params safely
    const { id: courseId } = await params;

    if (!courseId) {
      notFound();
    }

    // Get the current user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      redirect("/auth/signin?callbackUrl=/courses/" + courseId);
    }
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                completions: {
                  where: { userId: session.user.id },
                  select: { id: true },
                },
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!course) {
      notFound();
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      redirect("/auth/signin");
    }

    // Check if user has access to this course
    if (course.userId !== user.id && !course.isPublic) {
      // If the course doesn't belong to the user and isn't public, redirect to dashboard
      redirect("/dashboard");
    }

    // Get user progress
    const userProgress = await prisma.userProgress.findFirst({
      where: {
        courseId: courseId,
      },
    });

    const progress = userProgress?.progress || 0;
    const lastLesson = userProgress?.lastLessonId;

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
          lastLesson={lastLesson}
        />
      </div>
    );
  } catch (error) {
    console.error("Error rendering course page:", error);
    notFound();
  }
}
