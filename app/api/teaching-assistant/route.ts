import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { streamTAResponse } from "@/lib/ai-router";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit, getClientIdentifier } from "@/lib/rate-limit";

// Allow long-running streamed responses before the platform times out the route.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const clientId = getClientIdentifier(req, session.user.id);
    const limit = await consumeRateLimit(`ta:${session.user.id}:${clientId}`, {
      max: 20,
      windowMs: 60_000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Too many assistant requests. Please try again shortly.",
          retryAfterMs: limit.retryAfterMs,
        },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { message, courseId, lessonId, moduleName, lessonName } = body;

    if (!lessonId || typeof lessonId !== "string") {
      return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    if (message.length > 4_000) {
      return NextResponse.json(
        { error: "Message is too long. Please keep it under 4000 characters." },
        { status: 400 },
      );
    }

    // Get the lesson content
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: { course: true },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const course = lesson.module.course;

    if (courseId && typeof courseId === "string" && course.id !== courseId) {
      return NextResponse.json(
        { error: "lessonId does not match the provided courseId" },
        { status: 400 },
      );
    }

    // For private custom courses, only owner can use TA context.
    if (!course.isPublic && course.type === "CUSTOM" && course.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have access to this lesson." },
        { status: 403 },
      );
    }

    // Get sibling lessons for broader context
    const moduleWithLessons = await prisma.module.findUnique({
      where: { id: lesson.moduleId },
      include: {
        lessons: {
          select: { title: true, description: true },
          orderBy: { order: "asc" },
        },
      },
    });

    const systemPrompt = `
You are a Teaching Assistant (TA) for the course "${course.title}" (${course.difficulty} level).
You are currently helping with the lesson "${lessonName}" in the module "${moduleName}".

The course is about: ${course.description}

The current module covers: ${lesson.module.description || "Various topics related to " + moduleName}

The current lesson content is:
${lesson.content || lesson.description || "No specific content available."}

Other lessons in this module include:
${moduleWithLessons?.lessons.map((l) => `- ${l.title}: ${l.description || "No description"}`).join("\n") || "No other lessons available."}

As a Teaching Assistant, your role is to:
1. Provide clear, detailed explanations of concepts
2. Offer examples that illustrate the concepts
3. Answer questions with academic rigor but in an approachable way
4. Make connections between this lesson and other parts of the course
5. Suggest additional resources or exercises when appropriate

If the student seems confused, break down complex ideas into simpler components.
If you don't know the answer, acknowledge this and suggest how the student might find the information.
Be encouraging, supportive, and focus on helping the student develop a deep understanding of the material.

Format your responses with appropriate spacing and structure for readability.
Use markdown formatting when it helps clarify your explanation (e.g., for code blocks, lists, or emphasis).
    `.trim();

    // Stream the TA response (Gemini, via the centralized AI router).
    const result = await streamTAResponse({
      systemPrompt,
      userMessage: message,
      signal: req.signal,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating Teaching Assistant response:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
