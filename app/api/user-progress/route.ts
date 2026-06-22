import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit, getClientIdentifier } from "@/lib/rate-limit";

const postSchema = z.object({
  courseId: z.string(),
  progress: z.number().min(0).max(100),
  lastLessonId: z.string().nullable().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const userId = session.user.id; // JWT — no extra DB lookup needed

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    // findFirst with compound key — uses index, faster than full scan
    const progress = await prisma.userProgress.findFirst({
      where: { courseId, userId },
    });

    return NextResponse.json({
      progress: progress ?? {
        id: "",
        courseId,
        userId,
        progress: 0,
        lastLessonId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json({ error: "Failed to fetch user progress" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const userId = session.user.id; // JWT — no extra DB lookup needed

    const clientId = getClientIdentifier(req, session.user.id);
    const limit = await consumeRateLimit(`user-progress:${session.user.id}:${clientId}`, {
      max: 120,
      windowMs: 60000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later.", retryAfterMs: limit.retryAfterMs },
        { status: 429 },
      );
    }

    const parsed = postSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Course ID and progress are required" }, { status: 400 });
    }
    const { courseId, progress, lastLessonId } = parsed.data;

    // Verify course exists and user has access (still needed — security check)
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        OR: [{ userId }, { isPublic: true }],
      },
      select: { id: true }, // only need to confirm existence
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found or access denied" }, { status: 404 });
    }

    // Upsert using the compound unique key
    const updatedProgress = await prisma.userProgress.upsert({
      where: {
        courseId_userId: { courseId, userId },
      },
      update: { progress, lastLessonId, updatedAt: new Date() },
      create: { courseId, userId, progress, lastLessonId },
    });

    return NextResponse.json({
      message: "Progress updated",
      progress: updatedProgress,
    });
  } catch (error) {
    console.error("Error updating user progress:", error);
    return NextResponse.json({ error: "Failed to update user progress" }, { status: 500 });
  }
}
