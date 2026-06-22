import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const updateModuleSchema = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  order: z.number().int().optional(),
});

// PUT /api/admin/modules/[moduleId] — update a module
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> },
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  const parsed = updateModuleSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { title, description, order } = parsed.data;

  const module = await prisma.module.update({
    where: { id: moduleId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description: description || null }),
      ...(order !== undefined && { order }),
    },
  });

  return NextResponse.json(module);
}

// DELETE /api/admin/modules/[moduleId] — delete a module and its lessons
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> },
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  await prisma.module.delete({ where: { id: moduleId } });

  return NextResponse.json({ success: true });
}
