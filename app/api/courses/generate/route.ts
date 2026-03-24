import { streamCourseContent } from "@/lib/ai-router";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { topic, difficulty, additionalDetails, details } = body;

    const result = await streamCourseContent(
      topic,
      difficulty,
      additionalDetails ? details : undefined
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
        error:
          error instanceof Error ? error.message : "Failed to generate course",
      },
      { status: 500 }
    );
  }
}
