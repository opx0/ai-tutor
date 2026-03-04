import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { authOptions } from "@/lib/auth";
import { logApiRequest, logError, logInfo } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { hasFullCourseAccess, hasModuleAccess } from "@/lib/razorpay";
import { getServerSession } from "next-auth";
import { type NextRequest } from "next/server";

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

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const moduleId = searchParams.get("moduleId");

    if (!courseId) {
      return createErrorResponse(
        "Course ID is required",
        400,
        undefined,
        "MISSING_COURSE_ID"
      );
    }

    // Get user with subscription info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
        freeCoursesUsed: true,
      },
    });

    if (!user) {
      return createErrorResponse(
        "User not found",
        404,
        undefined,
        "USER_NOT_FOUND"
      );
    }

    // Check if subscription has expired
    if (
      user.subscriptionStatus === "PREMIUM" &&
      user.subscriptionExpiresAt &&
      new Date(user.subscriptionExpiresAt) < new Date()
    ) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          subscriptionStatus: "FREE",
          subscriptionExpiresAt: null,
        },
      });

      user.subscriptionStatus = "FREE" as any;
      user.subscriptionExpiresAt = null;
    }

    // If checking module access
    if (moduleId) {
      const module = await prisma.module.findUnique({
        where: { id: moduleId },
        select: { id: true, order: true, courseId: true },
      });

      if (!module) {
        return createErrorResponse(
          "Module not found",
          404,
          undefined,
          "MODULE_NOT_FOUND"
        );
      }

      const hasAccess = hasModuleAccess(user, courseId, module.order);

      return createSuccessResponse({
        hasAccess,
        subscriptionStatus: user.subscriptionStatus,
        moduleOrder: module.order,
      });
    }

    // If checking course access
    const hasAccess = hasFullCourseAccess(user, courseId);

    if (
      hasAccess &&
      user.subscriptionStatus === "FREE" &&
      user.freeCoursesUsed === 0
    ) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { freeCoursesUsed: 1 },
      });
    }

    logInfo("Access check completed", {
      ...requestContext,
      courseId,
      hasAccess,
    });

    return createSuccessResponse({
      hasAccess,
      subscriptionStatus: user.subscriptionStatus,
      freeCoursesUsed: user.freeCoursesUsed,
    });
  } catch (error) {
    logError("Error checking access", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to check access",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "ACCESS_CHECK_ERROR"
    );
  }
}
