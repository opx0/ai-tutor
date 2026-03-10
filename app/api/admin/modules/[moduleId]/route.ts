import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PUT /api/admin/modules/[moduleId] — update a module
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  const body = await request.json();
  const { title, description, order } = body;

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
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  await prisma.module.delete({ where: { id: moduleId } });

  return NextResponse.json({ success: true });
}
