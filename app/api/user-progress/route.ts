import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { authOptions } from "@/lib/auth";
import { logApiRequest, logError, logInfo } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest } from "next/server";
import { z } from "zod";

const progressSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  progress: z.number().min(0).max(100, "Progress must be between 0 and 100"),
  lastLessonId: z.string().optional(),
});

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

    if (!courseId) {
      return createErrorResponse(
        "Course ID is required",
        400,
        undefined,
        "MISSING_COURSE_ID"
      );
    }

    // Get user progress for the course
    const progress = await prisma.userProgress.findFirst({
      where: { courseId, userId: session.user.id },
    });

    // If no progress found, return default progress
    if (!progress) {
      return createSuccessResponse({
        progress: {
          id: "",
          courseId,
          userId: session.user.id,
          progress: 0,
          lastLessonId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return createSuccessResponse({ progress });
  } catch (error) {
    logError("Error fetching user progress", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to fetch user progress",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "PROGRESS_FETCH_ERROR"
    );
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();

    // Validate input
    const validation = progressSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        "Invalid input data",
        400,
        JSON.stringify(validation.error.flatten().fieldErrors),
        "VALIDATION_ERROR"
      );
    }

    const { courseId, progress, lastLessonId } = validation.data;

    // Verify course exists and user has access
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

    // Check if progress already exists
    const existingProgress = await prisma.userProgress.findFirst({
      where: { courseId, userId: session.user.id },
    });

    let updatedProgress;

    if (existingProgress) {
      updatedProgress = await prisma.userProgress.update({
        where: { id: existingProgress.id },
        data: { progress, lastLessonId, updatedAt: new Date() },
      });

      logInfo("Progress updated", { ...requestContext, courseId, progress });

      return createSuccessResponse({
        message: "Progress updated",
        progress: updatedProgress,
      });
    } else {
      updatedProgress = await prisma.userProgress.create({
        data: {
          courseId,
          userId: session.user.id,
          progress,
          lastLessonId,
        },
      });

      logInfo("Progress created", { ...requestContext, courseId, progress });

      return createSuccessResponse(
        { message: "Progress created", progress: updatedProgress },
        201
      );
    }
  } catch (error) {
    logError("Error updating user progress", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to update user progress",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "PROGRESS_UPDATE_ERROR"
    );
  }
}
