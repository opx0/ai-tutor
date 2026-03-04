import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { authOptions } from "@/lib/auth";
import { generateCourseContent } from "@/lib/gemini";
import { logApiRequest, logError, logInfo } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { type NextRequest } from "next/server";
import { z } from "zod";

const generateCourseSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  hasAdditionalDetails: z.boolean().optional(),
  details: z.string().optional(),
});

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
    const validation = generateCourseSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        "Invalid input data",
        400,
        JSON.stringify(validation.error.flatten().fieldErrors),
        "VALIDATION_ERROR"
      );
    }

    const { topic, difficulty, hasAdditionalDetails, details } = validation.data;

    logInfo("Starting course generation", {
      ...requestContext,
      topic,
      difficulty,
    });

    // Generate course content using Gemini
    const courseData = await generateCourseContent(
      topic,
      difficulty,
      hasAdditionalDetails ? details : undefined
    );

    logInfo("Course content generated successfully", {
      ...requestContext,
      title: courseData.title,
      moduleCount: courseData.modules.length,
      lessonCount: courseData.modules.reduce(
        (acc, module) => acc + module.lessons.length,
        0
      ),
    });

    // Ensure each module has at least one lesson
    const validatedModules = courseData.modules.map((module) => {
      if (!module.lessons || module.lessons.length === 0) {
        return {
          ...module,
          lessons: [
            {
              title: `Introduction to ${module.title}`,
              content: `<h1>Introduction to ${module.title}</h1><p>This lesson will introduce you to the key concepts of this module.</p>`,
              summary:
                "An introduction to the key concepts of this module.",
              exercises: {
                "Exercise 1":
                  "Review the key concepts presented in this lesson.",
              },
            },
          ],
        };
      }
      return module;
    });

    // Convert difficulty to enum value
    const difficultyMap: Record<string, string> = {
      'beginner': 'BEGINNER',
      'intermediate': 'INTERMEDIATE',
      'advanced': 'ADVANCED',
    };
    const difficultyEnum = difficultyMap[difficulty.toLowerCase()] || 'BEGINNER';

    // Create course in database
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        difficulty: difficultyEnum as any,
        topic,
        userId: session.user.id,
        modules: {
          create: validatedModules.map((module, moduleIndex) => ({
            title: module.title,
            description: module.description,
            order: moduleIndex,
            lessons: {
              create: module.lessons.map((lesson, lessonIndex) => ({
                title: lesson.title,
                description: lesson.summary,
                content: lesson.content,
                exercises: lesson.exercises || {},
                visualization: lesson.visualization ?? Prisma.DbNull,
                order: lessonIndex,
              })),
            },
          })),
        },
      },
    });

    logInfo("Course created successfully", {
      ...requestContext,
      courseId: course.id,
    });

    return createSuccessResponse({ id: course.id }, 201);
  } catch (error) {
    logError("Error generating course", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to generate course",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "COURSE_GENERATION_ERROR"
    );
  }
}
