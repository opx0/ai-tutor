import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { streamCourseContent } from "@/lib/ai-router";
import { authOptions } from "@/lib/auth";
import { consumeRateLimit, getClientIdentifier } from "@/lib/rate-limit";

// Allow long-running streamed generation before the platform times out the route.
export const maxDuration = 60;

const generateCourseSchema = z.object({
  topic: z.string(),
  difficulty: z.string(),
  additionalDetails: z.string().optional(),
  details: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const clientId = getClientIdentifier(req, session.user.id);
    const limit = await consumeRateLimit(`course-gen:${session.user.id}:${clientId}`, {
      max: 5,
      windowMs: 60000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfterMs: limit.retryAfterMs,
        },
        { status: 429 },
      );
    }

    const parsed = generateCourseSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { topic, difficulty, additionalDetails, details } = parsed.data;

    const result = await streamCourseContent(
      topic,
      difficulty,
      additionalDetails ? details : undefined,
      req.signal,
    );

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating course:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate course",
      },
      { status: 500 },
    );
  }
}
