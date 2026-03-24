import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const lessonId = body?.lessonId;

    if (!lessonId || typeof lessonId !== "string") {
      return NextResponse.json(
        { error: "lessonId is required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                type: true,
                isPublic: true,
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const course = lesson.module.course;
    const userId = session.user.id;

    if (!course.isPublic && course.type === "CUSTOM" && course.userId !== userId) {
      return NextResponse.json(
        { error: "You do not have access to this lesson." },
        { status: 403 }
      );
    }

    const totalLessons = await prisma.lesson.count({
      where: { module: { courseId: course.id } },
    });

    const result = await prisma.$transaction(async (tx) => {
      const existingCompletion = await tx.lessonCompletion.findFirst({
        where: { lessonId, userId },
        select: { id: true },
      });

      let newlyCompleted = false;
      if (!existingCompletion) {
        newlyCompleted = true;
        await tx.lessonCompletion.create({
          data: {
            id: `${lessonId}_${userId}`,
            lessonId,
            userId,
          },
        });
      }

      const completedLessonsCount = await tx.lessonCompletion.count({
        where: {
          userId,
          Lesson: { module: { courseId: course.id } },
        },
      });

      const progress =
        totalLessons > 0
          ? Math.round((completedLessonsCount / totalLessons) * 100)
          : 0;

      await tx.userProgress.upsert({
        where: { courseId_userId: { courseId: course.id, userId } },
        update: { progress, lastLessonId: lessonId },
        create: {
          courseId: course.id,
          userId,
          progress,
          lastLessonId: lessonId,
        },
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      await tx.spacedReview.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: {},
        create: {
          userId,
          lessonId,
          nextReviewAt: tomorrow,
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
        },
      });

      return {
        newlyCompleted,
        progress,
      };
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error completing lesson:", error);
    return NextResponse.json(
      { error: "Failed to complete lesson" },
      { status: 500 }
    );
  }
}
