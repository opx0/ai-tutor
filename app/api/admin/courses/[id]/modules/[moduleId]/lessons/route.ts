import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/courses/[id]/modules/[moduleId]/lessons — create a lesson
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  const body = await request.json();
  const {
    title,
    description,
    content,
    exercises,
    order,
    estimatedMinutes,
    visualization,
  } = body;

  if (!title) {
    return NextResponse.json(
      { error: "title is required" },
      { status: 400 }
    );
  }

  // Auto-calculate order if not provided
  let lessonOrder = order;
  if (lessonOrder === undefined) {
    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    lessonOrder = (lastLesson?.order ?? -1) + 1;
  }

  const lesson = await prisma.lesson.create({
    data: {
      title,
      description: description || null,
      content: content || null,
      exercises: exercises || null,
      order: lessonOrder,
      moduleId,
      estimatedMinutes: estimatedMinutes
        ? parseInt(estimatedMinutes)
        : null,
      visualization: visualization || null,
    },
  });

  return NextResponse.json(lesson, { status: 201 });
}

// PUT /api/admin/courses/[id]/modules/[moduleId]/lessons — bulk reorder lessons
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await params; // consume params
  const body = await request.json();
  const { lessons } = body as { lessons: { id: string; order: number }[] };

  if (!lessons || !Array.isArray(lessons)) {
    return NextResponse.json(
      { error: "lessons array is required" },
      { status: 400 }
    );
  }

  await prisma.$transaction(
    lessons.map((l) =>
      prisma.lesson.update({
        where: { id: l.id },
        data: { order: l.order },
      })
    )
  );

  return NextResponse.json({ success: true });
}
