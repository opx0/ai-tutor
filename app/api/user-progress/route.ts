import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userId = session.user.id; // JWT — no extra DB lookup needed

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
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
    return NextResponse.json(
      { error: "Failed to fetch user progress" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userId = session.user.id; // JWT — no extra DB lookup needed

    const body = await req.json();
    const { courseId, progress, lastLessonId } = body;

    if (!courseId || progress === undefined) {
      return NextResponse.json(
        { error: "Course ID and progress are required" },
        { status: 400 }
      );
    }

    if (typeof progress !== "number" || progress < 0 || progress > 100) {
      return NextResponse.json(
        { error: "Progress must be a number between 0 and 100" },
        { status: 400 }
      );
    }

    // Verify course exists and user has access (still needed — security check)
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        OR: [{ userId }, { isPublic: true }],
      },
      select: { id: true }, // only need to confirm existence
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found or access denied" },
        { status: 404 }
      );
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
    return NextResponse.json(
      { error: "Failed to update user progress" },
      { status: 500 }
    );
  }
}
