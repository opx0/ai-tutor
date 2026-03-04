import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { authOptions } from "@/lib/auth";
import { logError, logInfo } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  const requestContext = { method: "GET", path: "/api/courses" };

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse(
        "Unauthorized. Please sign in.",
        401,
        undefined,
        "UNAUTHORIZED"
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return createErrorResponse(
        "User not found.",
        401,
        undefined,
        "USER_NOT_FOUND"
      );
    }

    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { userId: user.id },
          { isPublic: true },
        ],
      },
      include: {
        _count: {
          select: { modules: true },
        },
        modules: {
          include: {
            _count: {
              select: { lessons: true },
            },
            lessons: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const progress = await prisma.userProgress.findFirst({
          where: { courseId: course.id, userId: user.id },
        });

        const totalLessons = course.modules.reduce(
          (acc, module) => acc + module._count.lessons,
          0
        );

        return {
          ...course,
          _count: {
            ...course._count,
            lessons: totalLessons,
          },
          progress: progress?.progress || 0,
        };
      })
    );

    logInfo("Courses fetched successfully", {
      ...requestContext,
      count: coursesWithProgress.length,
    });

    return createSuccessResponse(coursesWithProgress);
  } catch (error) {
    logError("Error fetching courses", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to fetch courses",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "COURSES_FETCH_ERROR"
    );
  }
}
