import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { authOptions } from "@/lib/auth";
import { logApiRequest, logError, logInfo } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest } from "next/server";
import { z } from "zod";

const bookmarkSchema = z.object({
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

    const validation = bookmarkSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        "Invalid input data",
        400,
        JSON.stringify(validation.error.flatten().fieldErrors),
        "VALIDATION_ERROR"
      );
    }

    const { lessonId } = validation.data;

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

    const existingBookmark = await prisma.bookmark.findFirst({
      where: { lessonId, userId: session.user.id },
    });

    if (existingBookmark) {
      return createSuccessResponse({
        message: "Lesson already bookmarked",
        bookmark: existingBookmark,
      });
    }

    const bookmark = await prisma.bookmark.create({
      data: { lessonId, userId: session.user.id },
    });

    logInfo("Bookmark created", { ...requestContext, lessonId });

    return createSuccessResponse(
      { message: "Lesson bookmarked successfully", bookmark },
      201
    );
  } catch (error) {
    logError("Error bookmarking lesson", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to bookmark lesson",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "BOOKMARK_CREATE_ERROR"
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

    const bookmark = await prisma.bookmark.findFirst({
      where: { lessonId, userId: session.user.id },
    });

    return createSuccessResponse({ bookmark });
  } catch (error) {
    logError("Error fetching bookmark", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to fetch bookmark",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "BOOKMARK_FETCH_ERROR"
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
    const bookmarkId = searchParams.get("id");
    const lessonId = searchParams.get("lessonId");

    if (!bookmarkId && !lessonId) {
      return createErrorResponse(
        "Bookmark ID or Lesson ID is required",
        400,
        undefined,
        "MISSING_IDENTIFIER"
      );
    }

    if (bookmarkId) {
      const bookmark = await prisma.bookmark.findUnique({
        where: { id: bookmarkId },
      });

      if (!bookmark) {
        return createErrorResponse(
          "Bookmark not found",
          404,
          undefined,
          "RESOURCE_NOT_FOUND"
        );
      }

      if (bookmark.userId !== session.user.id) {
        return createErrorResponse("Unauthorized", 403, undefined, "FORBIDDEN");
      }

      await prisma.bookmark.delete({ where: { id: bookmarkId } });
    } else {
      const bookmark = await prisma.bookmark.findFirst({
        where: { lessonId: lessonId as string, userId: session.user.id },
      });

      if (!bookmark) {
        return createErrorResponse(
          "Bookmark not found",
          404,
          undefined,
          "RESOURCE_NOT_FOUND"
        );
      }

      await prisma.bookmark.delete({ where: { id: bookmark.id } });
    }

    logInfo("Bookmark removed", { ...requestContext });

    return createSuccessResponse({
      message: "Bookmark removed successfully",
      isBookmarked: false,
    });
  } catch (error) {
    logError("Error removing bookmark", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to remove bookmark",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "BOOKMARK_DELETE_ERROR"
    );
  }
}
