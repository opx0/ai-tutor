
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // JWT strategy: user.id is embedded in the token — no extra DB lookup needed
    const userId = session.user.id;

    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { userId }, // User's own courses
          { isPublic: true }, // Public courses
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        topic: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        isPublic: true,
        _count: {
          select: {
            modules: true,
          },
        },
        modules: {
          select: {
            id: true,
            title: true,
            description: true,
            order: true,
            courseId: true,
            _count: {
              select: { lessons: true },
            },
            // Lessons: only metadata, no content/exercises (was causing 151KB payload)
            lessons: {
              select: {
                id: true,
                title: true,
                description: true,
                order: true,
                moduleId: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Batch-fetch all progress in ONE query (fixes N+1 — was 1 query per course)
    const allProgress = await prisma.userProgress.findMany({
      where: {
        userId,
        courseId: { in: courses.map((c) => c.id) },
      },
      select: { courseId: true, progress: true },
    });

    const progressMap: Record<string, number> = Object.fromEntries(
      allProgress.map((p) => [p.courseId, p.progress])
    );

    const coursesWithProgress = courses.map((course) => ({
      ...course,
      _count: {
        ...course._count,
        lessons: course.modules.reduce(
          (acc, mod) => acc + mod._count.lessons,
          0
        ),
      },
      progress: progressMap[course.id] ?? 0,
    }));

    return NextResponse.json(coursesWithProgress, {
      headers: {
        // Cache for 30s on CDN, serve stale for 60s while revalidating
        "Cache-Control": "private, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
