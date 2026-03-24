import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/courses/[id]/modules — create a module
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: courseId } = await params;
  const body = await request.json();
  const { title, description, order } = body;

  if (!title) {
    return NextResponse.json(
      { error: "title is required" },
      { status: 400 }
    );
  }

  // Auto-calculate order if not provided
  let moduleOrder = order;
  if (moduleOrder === undefined) {
    const lastModule = await prisma.module.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    moduleOrder = (lastModule?.order ?? -1) + 1;
  }

  const module = await prisma.module.create({
    data: {
      title,
      description: description || null,
      order: moduleOrder,
      courseId,
    },
    include: {
      lessons: { orderBy: { order: "asc" } },
    },
  });

  return NextResponse.json(module, { status: 201 });
}

// PUT /api/admin/courses/[id]/modules — bulk reorder modules
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await params; // consume params
  const body = await request.json();
  const { modules } = body as { modules: { id: string; order: number }[] };

  if (!modules || !Array.isArray(modules)) {
    return NextResponse.json(
      { error: "modules array is required" },
      { status: 400 }
    );
  }

  await prisma.$transaction(
    modules.map((m) =>
      prisma.module.update({
        where: { id: m.id },
        data: { order: m.order },
      })
    )
  );

  return NextResponse.json({ success: true });
}
