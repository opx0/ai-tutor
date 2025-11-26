import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// --- Types ---
export type Lesson = {
  title: string;
  summary: string;
  content: string;
  exercises?: Record<string, string>;
};

export type Module = {
  title: string;
  description: string;
  lessons: Lesson[];
};

export type CourseData = {
  title: string;
  description: string;
  modules: Module[];
};

// --- Schema Definition for Strict Output ---
const courseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING, description: "The title of the course" },
    description: {
      type: SchemaType.STRING,
      description: "A comprehensive description of the course",
    },
    modules: {
      type: SchemaType.ARRAY,
      description: "List of course modules",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING, description: "Module title" },
          description: {
            type: SchemaType.STRING,
            description: "Module description",
          },
          lessons: {
            type: SchemaType.ARRAY,
            description: "List of lessons in this module",
            items: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                summary: { type: SchemaType.STRING },
                content: {
                  type: SchemaType.STRING,
                  description:
                    "Detailed lesson content using HTML tags (<h1>, <p>, <ul>, <code>, etc.)",
                },
                exercises: {
                  type: SchemaType.OBJECT,
                  nullable: true,
                  description:
                    "Map of exercise titles to descriptions. Example: {'Exercise 1': 'Do X'}",
                },
              },
              required: ["title", "summary", "content"],
            },
          },
        },
        required: ["title", "description", "lessons"],
      },
    },
  },
  required: ["title", "description", "modules"],
};

// --- Fallback Safety ---
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
              Retry:
                "Please refresh the page to try generating the course again.",
            },
          },
        ],
      },
    ],
  };
}

/**
 * Generates course content using Gemini AI with Structured Outputs
 * @param topic - The course topic
 * @param difficulty - The difficulty level
 * @param additionalDetails - Optional context
 * @returns A structured CourseData object
 */
export async function generateCourseContent(
  topic: string,
  difficulty: string,
  additionalDetails?: string
): Promise<CourseData> {
  try {
    // Initialize model with Schema config
    // Note: Ensure your API key has access to the requested model version
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: courseSchema,
      },
    });

    // Optimized prompt - focused on content quality rather than formatting rules
    // (The Schema handles the formatting rules now)
    const prompt = `
      Create a comprehensive learning course on "${topic}" for ${difficulty} level students.
      ${additionalDetails ? `Additional context: ${additionalDetails}` : ""}

      Course Structure Requirements:
      1. Create 5-7 distinct modules suitable for this difficulty level.
      2. Each module must have 4-6 detailed lessons.
      3. "content" field MUST use HTML formatting (<h1>, <p>, <ul>, <li>, <pre><code>) for readability.
      4. "exercises" should be a set of 2-3 practical tasks relevant to the lesson.

      Make the content educational, engaging, and accurate.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Direct parse is safe because responseSchema guarantees validity
    const parsedData = JSON.parse(responseText) as CourseData;

    return parsedData;
  } catch (error) {
    console.error("Error generating course content:", error);

    // Graceful degradation so the UI never crashes
    return createFallbackCourse(
      `${topic} Course (Offline)`,
      "We couldn't generate the full course right now. Please check your connection or API key."
    );
  }
}
