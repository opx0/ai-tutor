import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { getTAGeminiModel } from "@/lib/gemini";
import { logApiRequest, logError, logInfo } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { z } from "zod";

const teachingAssistantSchema = z.object({
  message: z.string().min(1, "Message is required"),
  courseId: z.string().min(1, "Course ID is required"),
  lessonId: z.string().min(1, "Lesson ID is required"),
  moduleName: z.string().min(1, "Module name is required"),
  lessonName: z.string().min(1, "Lesson name is required"),
});

export async function POST(req: NextRequest) {
  const requestContext = logApiRequest(req);

  try {
    const body = await req.json();

    // Validate input
    const result = teachingAssistantSchema.safeParse(body);
    if (!result.success) {
      return createErrorResponse(
        "Invalid input data",
        400,
        JSON.stringify(result.error.flatten().fieldErrors),
        "VALIDATION_ERROR"
      );
    }

    const { message, courseId, lessonId, moduleName, lessonName } = result.data;

    // Get the lesson content
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
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

    const course = lesson.module.course;

    // Get other lessons in the same module for broader context
    const moduleWithLessons = await prisma.module.findUnique({
      where: { id: lesson.moduleId },
      include: {
        lessons: {
          select: { title: true, description: true },
          orderBy: { order: "asc" },
        },
      },
    });

    // Create enhanced context for the AI
    const context = `
      Current Role: Expert Teaching Assistant for the course "${course.title}" (Level: ${course.difficulty}).
      Current Focus: Lesson "${lessonName}" within Module "${moduleName}".

      Course Overview:
      ${course.description}

      Module Context:
      ${lesson.module.description || "Topics central to " + moduleName}

      Primary Source Material (Current Lesson):
      ---
      ${lesson.content || lesson.description || "[No specific content provided for this lesson]"}
      ---

      Broader Module Landscape:
      ${moduleWithLessons?.lessons.map((l) => `- ${l.title}: ${l.description || "N/A"}`).join("\\n") || "[No other lessons available]"}

      Your Responsibilities & Teaching Persona:
      1. Pedagogical Excellence: Provide clear, rigorous, yet highly accessible explanations.
      2. Concrete Examples: Always anchor abstract concepts with illuminating real-world or practical examples.
      3. Intellectual Connection: Seamlessly relate the student's question back to the core lesson material and the broader course objectives.
      4. Guided Discovery: Don't just give the answer; structure your response to help the student build understanding step-by-step. Break down complex ideas dynamically.
      5. Supportive Tone: Maintain an encouraging, patient, and deeply knowledgeable voice. Frame corrections constructively.
      6. Knowledge Boundaries: If the answer cannot be confidently derived from the provided context or general subject mastery, transparently state this and guide the student on where to investigate further.

      Formatting Requirements:
      - Use markdown extensively.
      - Employ clear headings, bullet points, and code blocks (where applicable).
      - Bold key terms and write in well-structured paragraphs to maximize readability.
    `;

    // Generate response using centralized Gemini TA model
    const model = getTAGeminiModel();

    const aiResult = await model.generateContent([
      context,
      `Student question: ${message}`,
    ]);

    const response = aiResult.response.text();

    logInfo("Teaching assistant response generated", {
      ...requestContext,
      courseId,
      lessonId,
    });

    return createSuccessResponse({ response });
  } catch (error) {
    logError("Error generating Teaching Assistant response", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to generate response",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "TA_GENERATION_ERROR"
    );
  }
}
