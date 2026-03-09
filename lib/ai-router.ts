/**
 * AI Router
 *
 * All AI calls in the application go through this module.
 * Model selection is centralized here — routes, components, and other
 * library code never import providers directly.
 */

import { generateObject, generateText, streamText } from "ai";
import {
    CourseSchema,
    QuizSchema,
    geminiFlash,
    geminiPro,
    type CourseData,
    type QuizQuestion
} from "./ai-providers";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TECHNICAL_TOPICS_REGEX =
  /\b(dsa|data structure|algorithm|system design|operating system|computer network|compiler|database internals|machine learning|deep learning|neural network|distributed system)\b/i;

function isTechnicalTopic(topic: string): boolean {
  return TECHNICAL_TOPICS_REGEX.test(topic);
}

// ---------------------------------------------------------------------------
// Fallback course (unchanged from the original gemini.ts)
// ---------------------------------------------------------------------------

function createFallbackCourse(title: string, description: string): CourseData {
  return {
    title,
    description,
    modules: [
      {
        title: "Module 1: Introduction",
        description: "Introduction to the course (Generated via Fallback)",
        lessons: [
          {
            title: "Lesson 1: Getting Started",
            content:
              "<p>We encountered a temporary issue generating the full course content. Please try again later.</p>",
            summary: "System fallback content",
            exercises: {
              Retry: "Please refresh the page to try generating the course again.",
            },
          },
        ],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Course Generation  →  Gemini 2.5 Flash (or Pro for technical topics)
// ---------------------------------------------------------------------------

/**
 * Generates course content using Vercel AI SDK `generateObject` with a Zod schema.
 * Schema validation replaces all the manual JSON-parsing the old gemini.ts did.
 *
 * Model selection:
 * - Technical topics (DSA, ML, OS…) → Gemini 2.5 Pro (deeper reasoning)
 * - All other topics                 → Gemini 2.5 Flash (speed + cost)
 */
export async function generateCourseContent(
  topic: string,
  difficulty: string,
  additionalDetails?: string
): Promise<CourseData> {
  const model = isTechnicalTopic(topic) ? geminiPro : geminiFlash;

  const prompt = `
    Create a comprehensive learning course on "${topic}" for ${difficulty} level students.
    ${additionalDetails ? `Additional context: ${additionalDetails}` : ""}

    Course Structure Requirements:
    1. Create 5-7 distinct modules suitable for this difficulty level.
    2. Each module must have 4-6 detailed lessons.
    3. "content" field MUST use HTML formatting (<h1>, <p>, <ul>, <li>, <pre><code>) for readability.
    4. "exercises" should be a set of 2-3 practical tasks relevant to the lesson.

    Visualization Requirements (for algorithm/data-structure courses):
    - For any lesson that explains a step-by-step algorithm or process, include a "visualization" field.
    - Set "visualization" to null ONLY for pure theory or introductory lessons.
    - Each visualization has a "type" ("array", "graph", or "grid") and 3-8 "steps".
    - Each step has a "message" (explain WHY, not just WHAT) and "elements" (visual components).
    - Element types: "array" (items with value+state), "variable" (name+value+state), "log" (lines with text+kind).
    - Valid states: "default","active","comparing","done","highlight","error","visited".
    - Valid log kinds: "info","call","return","compare","swap".
    - Example array element: {"type":"array","id":"arr","label":"Array","items":[{"value":"5","state":"comparing"},{"value":"3","state":"active"}]}
    - Example variable: {"type":"variable","id":"v-i","name":"i","value":"2","state":"active"}
    - Example log: {"type":"log","id":"log","lines":[{"text":"Swapping 5 and 3","kind":"swap"}]}

    Make the content educational, engaging, and accurate.
  `;

  try {
    const { object } = await generateObject({
      model,
      schema: CourseSchema,
      prompt,
    });

    return object;
  } catch (error) {
    console.error("Error generating course content:", error);
    return createFallbackCourse(
      `${topic} Course (Offline)`,
      "We couldn't generate the full course right now. Please check your connection or API key."
    );
  }
}

// ---------------------------------------------------------------------------
// Knowledge Test Generation  →  Gemini 2.5 Flash (speed-sensitive)
// ---------------------------------------------------------------------------

const QUIZ_FALLBACK: QuizQuestion[] = [
  {
    id: "fallback-1",
    question: "What is the main topic of this lesson?",
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

/**
 * Generates 3-5 multiple-choice quiz questions for a lesson.
 * Uses Gemini 2.5 Flash for low latency; Zod schema guarantees valid JSON output.
 */
export async function generateKnowledgeTestQuestions(lesson: {
  title: string;
  content?: string | null;
  description?: string | null;
}): Promise<QuizQuestion[]> {
  const lessonContent = lesson.content || lesson.description || "No specific content available.";

  const prompt = `
    You are a question generator for an educational platform.
    Generate 3-5 multiple-choice questions based on the following lesson content.
    Each question must have exactly 4 options with exactly one correct answer.
    Questions should test understanding, not just recall.

    LESSON TITLE: "${lesson.title}"
    LESSON CONTENT:
    ${lessonContent}
  `;

  try {
    const { object } = await generateObject({
      model: geminiFlash,
      schema: QuizSchema,
      prompt,
    });

    return object.questions;
  } catch (error) {
    console.error("Error generating knowledge test questions:", error);
    // Return fallback so the UI always shows something
    return QUIZ_FALLBACK;
  }
}

// ---------------------------------------------------------------------------
// Teaching Assistant  →  Gemini 2.5 Pro
// ---------------------------------------------------------------------------

/**
 * Streams a Teaching Assistant response.
 *
 * Provider selection:
 * - Gemini 2.5 Pro for deep reasoning and highest accuracy in factual Q&A.
 *
 * @returns A Vercel AI SDK StreamTextResult — call `.toTextStreamResponse()` on it
 */
export async function streamTAResponse({
  systemPrompt,
  userMessage,
}: {
  systemPrompt: string;
  userMessage: string;
}) {
  return streamText({
    model: geminiPro,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });
}

/**
 * Non-streaming variant — used internally when you just need the full text
 * (e.g. server-side logging, testing). The TA API route uses the streaming version.
 */
export async function getTAResponse({
  systemPrompt,
  userMessage,
}: {
  systemPrompt: string;
  userMessage: string;
}): Promise<string> {
  const { text } = await generateText({
    model: geminiPro,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  return text;
}
