import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit, getClientIdentifier } from "@/lib/rate-limit";

const postActivitySchema = z.object({
  activityType: z.string(),
  resourceId: z.string().optional(),
  resourceType: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    // Get recent activity for the user
    const activities = await prisma.userActivity.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json({ error: "Failed to fetch user activity" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const clientId = getClientIdentifier(req, session.user.id);
    const limit = await consumeRateLimit(`user-activity:${session.user.id}:${clientId}`, {
      max: 120,
      windowMs: 60000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down.", retryAfterMs: limit.retryAfterMs },
        { status: 429 },
      );
    }

    const parsed = postActivitySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const { activityType, resourceId, resourceType } = parsed.data;

    if (!activityType) {
      return NextResponse.json({ error: "Activity type is required" }, { status: 400 });
    }

    // Validate activity type
    const validActivityTypes = [
      "view_course",
      "view_lesson",
      "complete_lesson",
      "create_note",
      "create_bookmark",
      "search",
      "generate_course",
      "take_quiz",
    ];

    if (!validActivityTypes.includes(activityType)) {
      return NextResponse.json({ error: "Invalid activity type" }, { status: 400 });
    }

    // Validate resource type if provided
    if (resourceType) {
      const validResourceTypes = ["course", "lesson", "note", "bookmark", "quiz"];
      if (!validResourceTypes.includes(resourceType)) {
        return NextResponse.json({ error: "Invalid resource type" }, { status: 400 });
      }
    }

    // Record the activity
    const activity = await prisma.userActivity.create({
      data: {
        id: `${session.user.id}_${activityType}_${Date.now()}`,
        userId: session.user.id,
        activityType,
        resourceId: resourceId || null,
        resourceType: resourceType || null,
      },
    });

    return NextResponse.json(
      {
        message: "Activity recorded",
        activity,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error recording user activity:", error);
    return NextResponse.json({ error: "Failed to record user activity" }, { status: 500 });
  }
}
