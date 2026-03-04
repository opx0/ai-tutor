import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { getGeminiModel } from "@/lib/gemini";
import { logApiRequest, logError, logInfo, logWarning } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { z } from "zod";

const knowledgeTestSchema = z.object({
  lessonId: z.string().min(1, "Lesson ID is required"),
});

export async function POST(req: NextRequest) {
  const requestContext = logApiRequest(req);

  try {
    const body = await req.json();

    // Validate input
    const validation = knowledgeTestSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        "Invalid input data",
        400,
        JSON.stringify(validation.error.flatten().fieldErrors),
        "VALIDATION_ERROR"
      );
    }

    const { lessonId } = validation.data;

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

    // Create prompt for the AI
    const prompt = `
      You are a question generator for an educational platform. Your task is to create multiple-choice questions based on lesson content.

      INSTRUCTIONS:
      1. Generate 3-5 multiple-choice questions based on the lesson content below
      2. Each question must have 4 options with exactly one correct answer
      3. Return ONLY a valid JSON array with NO markdown formatting, NO code blocks, and NO explanations
      4. Do not include any text outside the JSON array
      5. Make sure questions test understanding, not just recall

      LESSON TITLE: "${lesson.title}"

      LESSON CONTENT:
      ${lesson.content || lesson.description || "No specific content available."}

      REQUIRED JSON FORMAT:
      [
        {
          "id": "1",
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0
        }
      ]

      CRITICAL: Your entire response must be ONLY the JSON array. Do not include any explanations, markdown formatting, or code blocks.
    `;

    // Generate questions using centralized Gemini model
    const model = getGeminiModel();

    logInfo("Sending prompt to Gemini API", requestContext);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    logInfo("Received AI response", {
      ...requestContext,
      responseLength: responseText.length,
    });

    // Try multiple approaches to extract valid JSON
    // Approach 1: Direct parse
    try {
      const questions = JSON.parse(responseText.trim());

      if (Array.isArray(questions) && questions.length > 0) {
        const validQuestions = questions.filter(
          (q: { id?: string; question?: string; options?: string[]; correctAnswer?: number }) =>
            q.id &&
            q.question &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            typeof q.correctAnswer === "number"
        );

        if (validQuestions.length > 0) {
          return createSuccessResponse({ questions: validQuestions });
        }
      }

      logInfo("Direct parsing succeeded but invalid format, trying other approaches", requestContext);
    } catch {
      logInfo("Direct JSON parsing failed, trying other approaches", requestContext);
    }

    // Approach 2: Extract JSON from markdown code blocks
    const jsonBlockMatch =
      responseText.match(/```(?:json)?\n([\s\S]*?)\n```/) ||
      responseText.match(/```([\s\S]*?)```/);

    if (jsonBlockMatch && jsonBlockMatch[1]) {
      const extractedJson = jsonBlockMatch[1].trim();
      try {
        const questions = JSON.parse(extractedJson);

        if (Array.isArray(questions) && questions.length > 0) {
          return createSuccessResponse({ questions });
        }
      } catch {
        logWarning("Could not parse JSON from code block", requestContext);
      }
    }

    // Approach 3: Find the outermost JSON array in the text
    const startBracket = responseText.indexOf("[");
    const endBracket = responseText.lastIndexOf("]");

    if (startBracket !== -1 && endBracket !== -1 && endBracket > startBracket) {
      const jsonSubstring = responseText.substring(startBracket, endBracket + 1);
      try {
        const questions = JSON.parse(jsonSubstring);

        if (Array.isArray(questions) && questions.length > 0) {
          return createSuccessResponse({ questions });
        }
      } catch {
        logWarning("Could not parse JSON using bracket extraction", requestContext);
      }
    }

    // Approach 4: Try to fix common JSON issues
    if (startBracket !== -1 && endBracket !== -1 && endBracket > startBracket) {
      let jsonSubstring = responseText.substring(startBracket, endBracket + 1);

      jsonSubstring = jsonSubstring.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match) => {
        return match.replace(/\n/g, "\\n");
      });

      jsonSubstring = jsonSubstring
        .replace(/,\s*]/g, "]")
        .replace(/,\s*}/g, "}")
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')
        .replace(/:\s*'/g, ':"')
        .replace(/'\s*,/g, '",')
        .replace(/'\s*}/g, '"}')
        .replace(/'\s*]/g, '"]');

      try {
        const questions = JSON.parse(jsonSubstring);

        if (Array.isArray(questions) && questions.length > 0) {
          return createSuccessResponse({ questions });
        }
      } catch (e) {
        logError("Could not parse JSON even after fixing common issues", {
          ...requestContext,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    // Fallback questions
    logWarning("All parsing attempts failed, using fallback questions", requestContext);

    const fallbackQuestions = [
      {
        id: "fallback-1",
        question: `What is the main topic of "${lesson.title}"?`,
        options: [
          "Understanding core concepts",
          "Practical applications",
          "Historical background",
          "Advanced techniques",
        ],
        correctAnswer: 0,
      },
      {
        id: "fallback-2",
        question: "Why is this topic important to learn?",
        options: [
          "It's fundamental to understanding the subject",
          "It's required for certification exams",
          "It's a popular interview question",
          "It's used in many real-world applications",
        ],
        correctAnswer: 3,
      },
      {
        id: "fallback-3",
        question: "What would be a good next step after learning this material?",
        options: [
          "Practice with exercises",
          "Read more advanced material",
          "Apply concepts in a project",
          "All of the above",
        ],
        correctAnswer: 3,
      },
    ];

    return createSuccessResponse({
      questions: fallbackQuestions,
      note: "Using fallback questions due to parsing issues",
    });
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
