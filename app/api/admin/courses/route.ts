import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/courses — list all curated courses
export async function GET() {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const courses = await prisma.course.findMany({
    where: { type: "CURATED" },
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
      prerequisites: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses);
}

// POST /api/admin/courses — create a new curated course
export async function POST(request: NextRequest) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
  } = body;

  if (!title || !difficulty || !topic) {
    return NextResponse.json(
      { error: "title, difficulty, and topic are required" },
      { status: 400 }
    );
  }

  // Check slug uniqueness
  if (slug) {
    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A course with this slug already exists" },
        { status: 409 }
      );
    }
  }

  const course = await prisma.course.create({
    data: {
      title,
      description: description || null,
      difficulty,
      topic,
      type: "CURATED",
      slug: slug || null,
      icon: icon || null,
      color: color || null,
      estimatedHours: estimatedHours ? parseInt(estimatedHours) : null,
      isPublic: true,
      userId: session.user.id,
    },
  });

  return NextResponse.json(course, { status: 201 });
}
