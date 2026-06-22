import type { Difficulty } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const updateCourseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  difficulty: z.string().optional(),
  topic: z.string().optional(),
  slug: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  estimatedHours: z.union([z.string(), z.number()]).optional(),
  isPublic: z.boolean().optional(),
});

// GET /api/admin/courses/[id] — get full course with modules and lessons
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
      roadmapNode: true,
      prerequisites: { select: { id: true, title: true, slug: true } },
      prerequisiteOf: { select: { id: true, title: true, slug: true } },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}

// PUT /api/admin/courses/[id] — update course metadata
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = updateCourseSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { title, description, difficulty, topic, slug, icon, color, estimatedHours, isPublic } =
    parsed.data;

  // Check slug uniqueness (exclude current course)
  if (slug) {
    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json(
        { error: "A course with this slug already exists" },
        { status: 409 },
      );
    }
  }

  const course = await prisma.course.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(difficulty !== undefined && { difficulty: difficulty as Difficulty }),
      ...(topic !== undefined && { topic }),
      ...(slug !== undefined && { slug: slug || null }),
      ...(icon !== undefined && { icon: icon || null }),
      ...(color !== undefined && { color: color || null }),
      ...(estimatedHours !== undefined && {
        estimatedHours: estimatedHours ? parseInt(String(estimatedHours)) : null,
      }),
      ...(isPublic !== undefined && { isPublic }),
    },
  });

  return NextResponse.json(course);
}

// DELETE /api/admin/courses/[id] — delete course and all children
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.course.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
