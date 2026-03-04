import { logError } from "@/lib/logger";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// --- Centralized Gemini AI Clients ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_TA_API_KEY = process.env.GEMINI_TA_API_KEY;

if (!GEMINI_API_KEY) {
  logError("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");
const taGenAI = GEMINI_TA_API_KEY
  ? new GoogleGenerativeAI(GEMINI_TA_API_KEY)
  : genAI; // fallback to main key if TA key not set

/**
 * Get the default Gemini model for course generation and knowledge tests
 */
export function getGeminiModel(config?: {
  responseMimeType?: string;
  responseSchema?: object;
}) {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    ...(config && { generationConfig: config }),
  });
}

/**
 * Get the Teaching Assistant Gemini model (uses a separate API key for isolation)
 */
export function getTAGeminiModel() {
  return taGenAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

// --- Types ---
export type Lesson = {
  title: string;
  summary: string;
  content: string;
  exercises?: Record<string, string>;
  visualization?: unknown; // VisualizationBlock JSON (validated at render time)
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
                visualization: {
                  type: SchemaType.OBJECT,
                  nullable: true,
                  description:
                    "Step-by-step visualization for algorithm/DSA lessons. Set to null for non-visual lessons. MUST be provided for lessons about sorting, searching, DP, graphs, trees, linked lists, recursion, etc.",
                  properties: {
                    type: {
                      type: SchemaType.STRING,
                      description: "Primary visual type: 'array', 'graph', or 'grid'",
                    },
                    initialState: {
                      type: SchemaType.STRING,
                      description: "JSON string of the initial data, e.g. '[5,3,8,1]'",
                    },
                    steps: {
                      type: SchemaType.ARRAY,
                      description: "5-10 steps showing algorithm progression",
                      items: {
                        type: SchemaType.OBJECT,
                        properties: {
                          message: {
                            type: SchemaType.STRING,
                            description: "Human-readable explanation of this step",
                          },
                          elements: {
                            type: SchemaType.ARRAY,
                            description: "Visual elements for this step",
                            items: {
                              type: SchemaType.OBJECT,
                              description: "A visual element. 'type' determines which fields are used. type='array': use items[]. type='variable': use name,value. type='log': use lines[]. type='graph': use nodes[],edges[]. type='grid': use cells[][].",
                              properties: {
                                type: {
                                  type: SchemaType.STRING,
                                  description: "Element type: 'array', 'variable', 'log', 'graph', or 'grid'",
                                },
                                id: {
                                  type: SchemaType.STRING,
                                  description: "Unique element identifier",
                                },
                                label: {
                                  type: SchemaType.STRING,
                                  nullable: true,
                                  description: "Optional display label",
                                },
                                name: {
                                  type: SchemaType.STRING,
                                  nullable: true,
                                  description: "Variable name (for type='variable')",
                                },
                                value: {
                                  type: SchemaType.STRING,
                                  nullable: true,
                                  description: "Variable value as string (for type='variable')",
                                },
                                state: {
                                  type: SchemaType.STRING,
                                  nullable: true,
                                  description: "Visual state: 'default','active','comparing','done','highlight','error','visited'",
                                },
                                items: {
                                  type: SchemaType.ARRAY,
                                  nullable: true,
                                  description: "Array items (for type='array')",
                                  items: {
                                    type: SchemaType.OBJECT,
                                    properties: {
                                      value: { type: SchemaType.STRING, description: "Cell value" },
                                      state: { type: SchemaType.STRING, description: "Cell state" },
                                    },
                                    required: ["value", "state"],
                                  },
                                },
                                lines: {
                                  type: SchemaType.ARRAY,
                                  nullable: true,
                                  description: "Log lines (for type='log')",
                                  items: {
                                    type: SchemaType.OBJECT,
                                    properties: {
                                      text: { type: SchemaType.STRING },
                                      kind: { type: SchemaType.STRING, description: "'info','call','return','compare','swap'" },
                                    },
                                    required: ["text", "kind"],
                                  },
                                },
                              },
                              required: ["type", "id"],
                            },
                          },
                        },
                        required: ["message", "elements"],
                      },
                    },
                  },
                  required: ["type", "steps"],
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
    const model = getGeminiModel({
      responseMimeType: "application/json",
      responseSchema: courseSchema,
    });

    const prompt = `
      You are a world-class computer science educator who teaches like Richard Feynman.
      Create a comprehensive learning course on "${topic}" for ${difficulty} level students.
      ${additionalDetails ? `Additional context: ${additionalDetails}` : ""}

      ═══════════════════════════════════════════════════
      TEACHING PHILOSOPHY — apply to EVERY lesson's content
      ═══════════════════════════════════════════════════

      1. FIRST PRINCIPLES: Derive every idea from scratch. Never assume the student
         knows "why" — always start with the underlying problem that motivated the
         concept. Ask: "What problem were we trying to solve?" before introducing
         the solution.

      2. FEYNMAN RULE: If you can't explain it simply, show the simple version first,
         then layer complexity. Start with a 2-element example before showing the
         general case. Build intuition before formalism.

      3. NO NAKED JARGON: Every technical term gets a one-line plain-English definition
         on first use. Format: <strong>Term</strong> — plain definition.
         Example: <strong>Time complexity</strong> — how the runtime grows as input grows.

      4. CONCRETE BEFORE ABSTRACT: Every abstract idea is IMMEDIATELY followed by ONE
         concrete, specific example. Never leave a concept floating without grounding it.

      5. ASCII DIAGRAMS: Use <pre> blocks with ASCII art for anything spatial or
         sequential — show memory layouts, pointer movements, tree shapes, stack frames.
         Example:
         <pre>
         [5] → [3] → [8] → [1] → null
          ^
          head
         </pre>

      6. COMPRESS AGGRESSIVELY: Ruthlessly cut anything that doesn't build intuition
         or practical skill. No filler, no "in this lesson we will learn" preambles,
         no restating what was just said. Respect the student's time.

      7. NEVER REPEAT: If a concept was explained in a prior lesson, reference it
         ("recall Big-O from Module 1"), don't re-explain it.

      ═══════════════════════════════════════════════════
      LESSON CONTENT STRUCTURE — each lesson's "content" HTML
      ═══════════════════════════════════════════════════

      Structure every lesson in these phases (use <h2> tags for phase headers):

      Phase 1 — Foundation:
        • WHY THIS MATTERS: The real-world problem this solves (1-2 sentences)
        • MENTAL MODEL: A simple analogy or metaphor the student can hold in their head
        • CORE DEFINITION: Precise definition, jargon-free first, then formal
        • KEY TECHNIQUES: The 1-3 core operations/patterns, each with
          <em>[When to reach for this]</em> in one line

      Phase 2 — Depth:
        • COMPLEXITY ANALYSIS: Time & space, derived from first principles
          (count the operations, don't just state "O(n)")
        • WORKED EXAMPLE: Walk through a complete example step-by-step,
          showing state changes at each point
        • BUILD IT: Pseudocode or real code the student can trace by hand

      Phase 3 — Mastery:
        • GOTCHAS: 2-3 common mistakes and how to avoid them
        • PRACTICE PROBLEMS: 2 problems graded easy → medium
        • CONCEPT FINGERPRINT: 3 bullets of what mastery looks like
          (e.g., "You can implement this from memory in < 5 min")
        • CONNECTIONS: How this connects to other concepts. If combining two
          concepts, name the combo pattern explicitly.
          Example: "BFS + memoization = level-order DP for tree problems"

      ═══════════════════════════════════════════════════
      LEARNING ACCELERATION — embed these in content HTML
      ═══════════════════════════════════════════════════

      • After each major section in a lesson, include a "test yourself" question
        inside a <blockquote> tag. Give the question only, NO answer. Force recall.
        Example: <blockquote><strong>Test yourself:</strong> Why does binary search
        require a sorted array? What breaks if it's unsorted?</blockquote>

      • For each technique/pattern, include a one-line <em>[When to reach for this]</em>
        tag. Example: <em>[When to reach for this: you need O(log n) lookup in sorted data]</em>

      • End every lesson with a <h3>Concept Fingerprint</h3> section containing
        exactly 3 bullets describing what mastery of this concept looks like.

      • When a lesson combines two concepts, explicitly name the combination pattern
        in a <strong>Combo pattern:</strong> callout.

      ═══════════════════════════════════════════════════
      COURSE STRUCTURE
      ═══════════════════════════════════════════════════

      1. Create 5-7 distinct modules suitable for this difficulty level.
      2. Each module must have 4-6 detailed lessons.
      3. "content" field MUST use HTML formatting (<h1>, <p>, <ul>, <li>, <pre><code>,
         <blockquote>, <strong>, <em>) for readability.
      4. "exercises" should be a set of 2-3 practical tasks relevant to the lesson.

      ═══════════════════════════════════════════════════
      VISUALIZATION REQUIREMENTS
      ═══════════════════════════════════════════════════

      For lessons that teach algorithms, data structures, sorting, searching, recursion,
      dynamic programming, graph traversal, pointer manipulation, or any concept that
      benefits from step-by-step visual explanation, include a "visualization" field.

      The visualization field MUST be a JSON object with this exact shape:
      {
        "type": "array" | "graph" | "grid",
        "initialState": <the starting data>,
        "steps": [
          {
            "message": "Human-readable explanation of this step",
            "elements": [
              // 1. ARRAY — for arrays, lists, stacks, queues:
              { "type": "array", "id": "unique_id", "label": "Optional Label",
                "items": [ { "value": 5, "state": "default" }, { "value": 3, "state": "comparing" } ],
                "direction": "horizontal" },

              // 2. GRAPH — for trees, linked lists, graphs:
              { "type": "graph", "id": "unique_id", "label": "Optional Label",
                "nodes": [ { "id": "n1", "value": 10, "state": "active" } ],
                "edges": [ { "source": "n1", "target": "n2", "state": "default", "directed": true } ],
                "layout": "tree" },

              // 3. GRID — for DP tables, matrices, 2D arrays:
              { "type": "grid", "id": "unique_id", "label": "DP Table",
                "cells": [ [ { "value": 0, "state": "default" } ] ],
                "rowLabels": ["0", "1"], "colLabels": ["a", "b"] },

              // 4. VARIABLE — for tracking variables (i, j, temp, min, etc.):
              { "type": "variable", "id": "unique_id", "name": "i", "value": 0, "state": "active" },

              // 5. LOG — execution trace:
              { "type": "log", "id": "unique_id",
                "lines": [ { "text": "Comparing 5 and 3", "kind": "compare" } ] }
            ]
          }
        ]
      }

      Valid "state" values: "default", "active", "comparing", "done", "highlight", "error", "visited".
      Valid log "kind" values: "info", "call", "return", "compare", "swap".

      RULES for visualization:
      - Include 5-10 steps that clearly show the algorithm progression.
      - Each step's "message" should teach, not just describe — explain WHY this
        step happens, not just WHAT happens.
      - Include variable tracking with "variable" elements.
      - Include an execution log with "log" elements that accumulates across steps.
      - Set "visualization" to null for lessons that don't benefit from visualization
        (e.g., theory-only, intro, history lessons).
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsedData = JSON.parse(responseText) as CourseData;

    return parsedData;
  } catch (error) {
    logError("Error generating course content", { error });

    return createFallbackCourse(
      `${topic} Course (Offline)`,
      "We couldn't generate the full course right now. Please check your connection or API key."
    );
  }
}
