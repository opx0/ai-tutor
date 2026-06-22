import { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const createLessonSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().optional(),
  content: z.string().optional(),
  exercises: z.unknown().optional(),
  order: z.number().int().optional(),
  estimatedMinutes: z.union([z.string(), z.number()]).optional(),
  visualization: z.unknown().optional(),
});

const reorderLessonsSchema = z.object({
  lessons: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    }),
  ),
});

// POST /api/admin/courses/[id]/modules/[moduleId]/lessons — create a lesson
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> },
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  const parsed = createLessonSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  const { title, description, content, exercises, order, estimatedMinutes, visualization } =
    parsed.data;

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
      exercises:
        exercises === undefined || exercises === null
          ? Prisma.JsonNull
          : (exercises as Prisma.InputJsonValue),
      order: lessonOrder,
      moduleId,
      estimatedMinutes: estimatedMinutes ? parseInt(String(estimatedMinutes), 10) : null,
      visualization:
        visualization === undefined || visualization === null
          ? Prisma.JsonNull
          : (visualization as Prisma.InputJsonValue),
    },
  });

  return NextResponse.json(lesson, { status: 201 });
}

// PUT /api/admin/courses/[id]/modules/[moduleId]/lessons — bulk reorder lessons
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> },
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await params; // consume params
  const parsed = reorderLessonsSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "lessons array is required" }, { status: 400 });
  }
  const { lessons } = parsed.data;

  await prisma.$transaction(
    lessons.map((l) =>
      prisma.lesson.update({
        where: { id: l.id },
        data: { order: l.order },
      }),
    ),
  );

  return NextResponse.json({ success: true });
}
