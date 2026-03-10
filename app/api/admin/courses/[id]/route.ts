import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/courses/[id] — get full course with modules and lessons
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const {
    title,
    description,
    difficulty,
    topic,
    slug,
    icon,
    color,
    estimatedHours,
    isPublic,
  } = body;

  // Check slug uniqueness (exclude current course)
  if (slug) {
    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json(
        { error: "A course with this slug already exists" },
        { status: 409 }
      );
    }
  }

  const course = await prisma.course.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(difficulty !== undefined && { difficulty }),
      ...(topic !== undefined && { topic }),
      ...(slug !== undefined && { slug: slug || null }),
      ...(icon !== undefined && { icon: icon || null }),
      ...(color !== undefined && { color: color || null }),
      ...(estimatedHours !== undefined && {
        estimatedHours: estimatedHours ? parseInt(estimatedHours) : null,
      }),
      ...(isPublic !== undefined && { isPublic }),
    },
  });

  return NextResponse.json(course);
}

// DELETE /api/admin/courses/[id] — delete course and all children
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.course.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
