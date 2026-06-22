import { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const updateLessonSchema = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  exercises: z.unknown().optional(),
  order: z.number().int().optional(),
  estimatedMinutes: z.union([z.string(), z.number()]).nullable().optional(),
  visualization: z.string().nullable().optional(),
});

// GET /api/admin/lessons/[lessonId] — get a single lesson
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
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
  { params }: { params: Promise<{ lessonId: string }> },
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await params;
  const result = updateLessonSchema.safeParse(await request.json());
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: result.error.flatten() },
      { status: 400 },
    );
  }
  const { title, description, content, exercises, order, estimatedMinutes, visualization } =
    result.data;

  const lesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && {
        description: description || null,
      }),
      ...(content !== undefined && { content: content || null }),
      ...(exercises !== undefined && {
        exercises: exercises === null ? Prisma.JsonNull : (exercises as Prisma.InputJsonValue),
      }),
      ...(order !== undefined && { order }),
      ...(estimatedMinutes !== undefined && {
        estimatedMinutes: estimatedMinutes ? parseInt(String(estimatedMinutes), 10) : null,
      }),
      ...(visualization !== undefined && {
        visualization:
          visualization === null ? Prisma.JsonNull : (visualization as Prisma.InputJsonValue),
      }),
    },
  });

  return NextResponse.json(lesson);
}

// DELETE /api/admin/lessons/[lessonId] — delete a lesson
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await params;
  await prisma.lesson.delete({ where: { id: lessonId } });

  return NextResponse.json({ success: true });
}
