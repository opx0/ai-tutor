import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { authOptions } from "@/lib/auth";
import { logApiRequest, logError, logInfo } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest } from "next/server";
import { z } from "zod";

const noteSchema = z.object({
  content: z.string().min(1, "Content is required"),
  lessonId: z.string().min(1, "Lesson ID is required"),
});

export async function POST(req: NextRequest) {
  const requestContext = logApiRequest(req);

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized", 401, undefined, "UNAUTHORIZED");
    }

    const body = await req.json();

    // Validate input
    const validation = noteSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        "Invalid input data",
        400,
        JSON.stringify(validation.error.flatten().fieldErrors),
        "VALIDATION_ERROR"
      );
    }

    const { content, lessonId } = validation.data;

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return createErrorResponse(
        "Lesson not found",
        404,
        undefined,
        "RESOURCE_NOT_FOUND"
      );
    }

    // Create or update note
    const existingNote = await prisma.note.findFirst({
      where: { lessonId, userId: session.user.id },
    });

    let note;
    if (existingNote) {
      note = await prisma.note.update({
        where: { id: existingNote.id },
        data: { content },
      });
    } else {
      note = await prisma.note.create({
        data: { content, lessonId, userId: session.user.id },
      });
    }

    logInfo("Note saved", { ...requestContext, lessonId });

    return createSuccessResponse({ message: "Note saved successfully", note });
  } catch (error) {
    logError("Error saving note", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to save note",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "NOTE_SAVE_ERROR"
    );
  }
}

export async function GET(req: NextRequest) {
  const requestContext = logApiRequest(req);

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized", 401, undefined, "UNAUTHORIZED");
    }

    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return createErrorResponse(
        "Lesson ID is required",
        400,
        undefined,
        "MISSING_LESSON_ID"
      );
    }

    const note = await prisma.note.findFirst({
      where: { lessonId, userId: session.user.id },
    });

    return createSuccessResponse({ note });
  } catch (error) {
    logError("Error fetching note", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to fetch note",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "NOTE_FETCH_ERROR"
    );
  }
}

export async function DELETE(req: NextRequest) {
  const requestContext = logApiRequest(req);

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized", 401, undefined, "UNAUTHORIZED");
    }

    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get("id");

    if (!noteId) {
      return createErrorResponse(
        "Note ID is required",
        400,
        undefined,
        "MISSING_NOTE_ID"
      );
    }

    // Check if note exists and belongs to user
    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      return createErrorResponse(
        "Note not found",
        404,
        undefined,
        "RESOURCE_NOT_FOUND"
      );
    }

    if (note.userId !== session.user.id) {
      return createErrorResponse("Unauthorized", 403, undefined, "FORBIDDEN");
    }

    await prisma.note.delete({ where: { id: noteId } });

    logInfo("Note deleted", { ...requestContext, noteId });

    return createSuccessResponse({ message: "Note deleted successfully" });
  } catch (error) {
    logError("Error deleting note", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to delete note",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "NOTE_DELETE_ERROR"
    );
  }
}
