/**
 * AI Provider Configuration
 *
 * Single control plane for all AI providers in the app.
 * Gemini handles all structured generation and factual Q&A.
 */

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

// --- Provider Instances ---

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// --- Model Selectors ---

/** Fast Gemini for standard course generation and knowledge tests */
export const geminiFlash = google("gemini-2.5-flash");

/** Powerful Gemini for technical/complex course topics */
export const geminiPro = google("gemini-2.5-pro");

// --- Zod Schemas (single source of truth for all AI structured output) ---

// Visualization element schemas
const CellItemSchema = z.object({
  value: z.string(),
  state: z.string(),
});

const LogLineSchema = z.object({
  text: z.string(),
  kind: z.string(),
});

const SceneElementSchema = z.object({
  type: z.string().describe("Element type: 'array', 'variable', 'log'"),
  id: z.string(),
  label: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  value: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  items: z.array(CellItemSchema).optional().nullable(),
  lines: z.array(LogLineSchema).optional().nullable(),
});

const SceneStepSchema = z.object({
  message: z.string().describe("Explain WHY this step matters, not just what changed"),
  elements: z.array(SceneElementSchema),
});

export const VisualizationSchema = z
  .object({
    type: z.enum(["array", "graph", "grid"]),
    steps: z.array(SceneStepSchema).min(3).max(8),
  })
  .nullable()
  .describe(
    "Step-by-step algorithm visualization. Set to null for pure theory lessons."
  );

export const LessonSchema = z.object({
  title: z.string().describe("Lesson title"),
  summary: z.string().describe("Brief summary of the lesson"),
  content: z
    .string()
    .describe(
      "Detailed lesson content using HTML tags (<h1>, <p>, <ul>, <code>, etc.)"
    ),
  exercises: z
    .record(z.string(), z.string())
    .optional()
    .describe(
      "Map of exercise titles to descriptions. Example: {'Exercise 1': 'Do X'}"
    ),
  visualization: VisualizationSchema.optional(),
});

export const ModuleSchema = z.object({
  title: z.string().describe("Module title"),
  description: z.string().describe("Module description"),
  lessons: z.array(LessonSchema).describe("List of lessons in this module"),
});

export const CourseSchema = z.object({
  title: z.string().describe("The title of the course"),
  description: z.string().describe("A comprehensive description of the course"),
  modules: z.array(ModuleSchema).describe("List of course modules"),
});

export const QuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z
    .number()
    .int()
    .min(0)
    .max(3)
    .describe("Index of the correct answer (0-3)"),
});

export const QuizSchema = z.object({
  questions: z.array(QuizQuestionSchema).min(3).max(5),
});

// --- Exported Types (inferred from schemas) ---

export type Lesson = z.infer<typeof LessonSchema>;
export type Module = z.infer<typeof ModuleSchema>;
export type CourseData = z.infer<typeof CourseSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type VisualizationData = z.infer<typeof VisualizationSchema>;
