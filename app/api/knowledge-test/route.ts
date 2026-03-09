import { generateKnowledgeTestQuestions } from "@/lib/ai-router";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { logApiRequest, logError } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const requestContext = logApiRequest(req);

  try {
    const body = await req.json();
    const { lessonId } = body;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: { course: true },
        },
      },
    });

    if (!lesson) {
      return createErrorResponse(
        "Lesson not found",
        404,
        `No lesson found with ID: ${lessonId}`,
        "RESOURCE_NOT_FOUND"
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
      "KNOWLEDGE_TEST_GENERATION_ERROR"
    );
  }
}
