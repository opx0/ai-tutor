import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { authOptions } from "@/lib/auth";
import { logApiRequest, logError, logInfo } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest } from "next/server";
import { z } from "zod";

const validActivityTypes = [
  "view_course",
  "view_lesson",
  "complete_lesson",
  "create_note",
  "create_bookmark",
  "search",
  "generate_course",
  "take_quiz",
] as const;

const validResourceTypes = [
  "course",
  "lesson",
  "note",
  "bookmark",
  "quiz",
] as const;

const activitySchema = z.object({
  activityType: z.enum(validActivityTypes, {
    errorMap: () => ({ message: "Invalid activity type" }),
  }),
  resourceId: z.string().optional(),
  resourceType: z
    .enum(validResourceTypes, {
      errorMap: () => ({ message: "Invalid resource type" }),
    })
    .optional(),
});

export async function GET(req: NextRequest) {
  const requestContext = logApiRequest(req);

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse(
        "Unauthorized. Please sign in.",
        401,
        undefined,
        "UNAUTHORIZED"
      );
    }

    // Get recent activity for the user
    const activities = await prisma.userActivity.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return createSuccessResponse({ activities });
  } catch (error) {
    logError("Error fetching user activity", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to fetch user activity",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "ACTIVITY_FETCH_ERROR"
    );
  }
}

export async function POST(req: NextRequest) {
  const requestContext = logApiRequest(req);

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse(
        "Unauthorized. Please sign in.",
        401,
        undefined,
        "UNAUTHORIZED"
      );
    }

    const body = await req.json();

    // Validate input
    const validation = activitySchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        "Invalid input data",
        400,
        JSON.stringify(validation.error.flatten().fieldErrors),
        "VALIDATION_ERROR"
      );
    }

    const { activityType, resourceId, resourceType } = validation.data;

    // Record the activity
    const activity = await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        activityType,
        resourceId: resourceId || null,
        resourceType: resourceType || null,
      },
    });

    logInfo("Activity recorded", { ...requestContext, activityType });

    return createSuccessResponse(
      { message: "Activity recorded", activity },
      201
    );
  } catch (error) {
    logError("Error recording user activity", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to record user activity",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "ACTIVITY_RECORD_ERROR"
    );
  }
}
