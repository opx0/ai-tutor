import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { generateKnowledgeTestQuestions } from "@/lib/ai-router";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { authOptions } from "@/lib/auth";
import { logApiRequest, logError } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit, getClientIdentifier } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const requestContext = logApiRequest(req);

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createErrorResponse(
        "Unauthorized. Please sign in.",
        401,
        "Missing authenticated user session",
        "UNAUTHORIZED",
      );
    }

    const clientId = getClientIdentifier(req, session.user.id);
    const limit = await consumeRateLimit(`knowledge-test:${session.user.id}:${clientId}`, {
      max: 12,
      windowMs: 60_000,
    });

    if (!limit.allowed) {
      return createErrorResponse(
        "Too many requests. Please try again shortly.",
        429,
        `Retry after ${Math.ceil(limit.retryAfterMs / 1000)} seconds`,
        "RATE_LIMITED",
      );
    }

    const body = await req.json();
    const { lessonId } = body;

    if (!lessonId || typeof lessonId !== "string") {
      return createErrorResponse(
        "lessonId is required",
        400,
        "Expected a non-empty lessonId string",
        "INVALID_INPUT",
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                userId: true,
                isPublic: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return createErrorResponse(
        "Lesson not found",
        404,
        `No lesson found with ID: ${lessonId}`,
        "RESOURCE_NOT_FOUND",
      );
    }

    const course = lesson.module.course;
    if (!course.isPublic && course.type === "CUSTOM" && course.userId !== session.user.id) {
      return createErrorResponse(
        "You do not have access to this lesson",
        403,
        "Custom private course content is restricted to the owner",
        "ACCESS_DENIED",
      );
    }

    // generateObject with Zod schema guarantees valid output — no manual JSON parsing needed
    const questions = await generateKnowledgeTestQuestions({
      title: lesson.title,
      content: lesson.content,
      description: lesson.description,
    });

    return createSuccessResponse({ questions });
  } catch (error) {
    logError("Error generating knowledge test", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to generate knowledge test",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "KNOWLEDGE_TEST_GENERATION_ERROR",
    );
  }
}
