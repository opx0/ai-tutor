import { describe, expect, it } from "vitest";
import { CourseSchema, QuizSchema, VisualizationSchema } from "../lib/ai-providers";

describe("CourseSchema", () => {
  it("accepts a minimal valid course", () => {
    const r = CourseSchema.safeParse({
      title: "T",
      description: "D",
      modules: [
        {
          title: "M",
          description: "MD",
          lessons: [{ title: "L", summary: "S", content: "<p>x</p>" }],
        },
      ],
    });
    expect(r.success).toBe(true);
  });

  it("rejects a course with no modules field", () => {
    expect(CourseSchema.safeParse({ title: "T", description: "D" }).success).toBe(false);
  });
});

describe("QuizSchema", () => {
  const q = (over: Record<string, unknown> = {}) => ({
    id: "1",
    question: "Q?",
    options: ["a", "b", "c", "d"],
    correctAnswer: 0,
    ...over,
  });

  it("accepts 3 well-formed questions", () => {
    expect(QuizSchema.safeParse({ questions: [q(), q(), q()] }).success).toBe(true);
  });

  it("rejects a question without exactly 4 options", () => {
    expect(
      QuizSchema.safeParse({ questions: [q({ options: ["a", "b", "c"] }), q(), q()] }).success,
    ).toBe(false);
  });

  it("rejects correctAnswer out of the 0-3 range", () => {
    expect(QuizSchema.safeParse({ questions: [q({ correctAnswer: 9 }), q(), q()] }).success).toBe(
      false,
    );
  });

  it("rejects fewer than 3 questions", () => {
    expect(QuizSchema.safeParse({ questions: [q()] }).success).toBe(false);
  });
});

describe("VisualizationSchema", () => {
  it("accepts null (pure-theory lesson)", () => {
    expect(VisualizationSchema.safeParse(null).success).toBe(true);
  });

  it("requires between 3 and 8 steps when present", () => {
    expect(VisualizationSchema.safeParse({ type: "array", steps: [] }).success).toBe(false);
  });
});
