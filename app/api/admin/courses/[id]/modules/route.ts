import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const createModuleSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().optional(),
});

const reorderModulesSchema = z.object({
  modules: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    }),
  ),
});

// POST /api/admin/courses/[id]/modules — create a module
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: courseId } = await params;
  const parsed = createModuleSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  const { title, description, order } = parsed.data;

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
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await params; // consume params
  const parsed = reorderModulesSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "modules array is required" }, { status: 400 });
  }
  const { modules } = parsed.data;

  await prisma.$transaction(
    modules.map((m) =>
      prisma.module.update({
        where: { id: m.id },
        data: { order: m.order },
      }),
    ),
  );

  return NextResponse.json({ success: true });
}
