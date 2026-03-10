import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/lessons/[lessonId] — get a single lesson
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        select: { id: true, title: true, courseId: true },
      },
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  return NextResponse.json(lesson);
}

// PUT /api/admin/lessons/[lessonId] — update a lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await params;
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

  const lesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && {
        description: description || null,
      }),
      ...(content !== undefined && { content: content || null }),
      ...(exercises !== undefined && { exercises: exercises || null }),
      ...(order !== undefined && { order }),
      ...(estimatedMinutes !== undefined && {
        estimatedMinutes: estimatedMinutes
          ? parseInt(estimatedMinutes)
          : null,
      }),
      ...(visualization !== undefined && {
        visualization: visualization || null,
      }),
    },
  });

  return NextResponse.json(lesson);
}

// DELETE /api/admin/lessons/[lessonId] — delete a lesson
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await params;
  await prisma.lesson.delete({ where: { id: lessonId } });

  return NextResponse.json({ success: true });
}
