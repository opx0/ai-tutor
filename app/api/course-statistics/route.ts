import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { authOptions } from "@/lib/auth";
import { logApiRequest, logError } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const requestContext = logApiRequest(req);

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

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (courseId) {
      // Get statistics for a specific course
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          OR: [{ userId: session.user.id }, { isPublic: true }],
        },
      });

      if (!course) {
        return createErrorResponse(
          "Course not found or access denied",
          404,
          undefined,
          "COURSE_NOT_FOUND"
        );
      }

      const totalLessons = await prisma.lesson.count({
        where: { module: { courseId } },
      });

      const completedLessons = await prisma.lessonCompletion.count({
        where: { userId: session.user.id, lesson: { module: { courseId } } },
      });

      const progressStats = await prisma.userProgress.aggregate({
        where: { courseId },
        _avg: { progress: true },
        _count: { userId: true },
      });

      const bookmarkCount = await prisma.bookmark.count({
        where: { lesson: { module: { courseId } } },
      });

      return createSuccessResponse({
        statistics: {
          courseId,
          title: course.title,
          totalLessons,
          completedLessons,
          averageProgress: Math.round(progressStats._avg.progress || 0),
          userCount: progressStats._count.userId,
          bookmarkCount,
        },
      });
    } else {
      // Get overall statistics for the user
      const courseCount = await prisma.course.count({
        where: { userId: session.user.id },
      });

      const progressStats = await prisma.userProgress.aggregate({
        where: { userId: session.user.id },
        _avg: { progress: true },
      });

      const bookmarkCount = await prisma.bookmark.count({
        where: { userId: session.user.id },
      });

      const noteCount = await prisma.note.count({
        where: { userId: session.user.id },
      });

      const topCourses = await prisma.userProgress.findMany({
        where: { userId: session.user.id },
        include: {
          course: {
            select: { id: true, title: true },
          },
        },
        orderBy: { progress: "desc" },
        take: 5,
      });

      const formattedTopCourses = topCourses.map((progress) => ({
        courseId: progress.courseId,
        title: progress.course?.title || "Unknown Course",
        progress: progress.progress,
      }));

      return createSuccessResponse({
        statistics: {
          courseCount,
          averageProgress: Math.round(progressStats._avg.progress || 0),
          bookmarkCount,
          noteCount,
          topCourses: formattedTopCourses,
        },
      });
    }
  } catch (error) {
    logError("Error fetching course statistics", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to fetch course statistics",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "STATISTICS_FETCH_ERROR"
    );
  }
}
