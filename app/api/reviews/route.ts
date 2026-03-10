import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sm2 } from "@/lib/spaced-repetition"

/**
 * GET /api/reviews — fetch due reviews for the current user
 * Query params:
 *   ?limit=10 — max reviews to return (default 10)
 *   ?count=true — only return the count of due reviews
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const countOnly = searchParams.get("count") === "true"
  const limit = parseInt(searchParams.get("limit") ?? "10", 10)

  const now = new Date()

  if (countOnly) {
    const count = await prisma.spacedReview.count({
      where: {
        userId: user.id,
        nextReviewAt: { lte: now },
      },
    })
    return NextResponse.json({ count })
  }

  const reviews = await prisma.spacedReview.findMany({
    where: {
      userId: user.id,
      nextReviewAt: { lte: now },
    },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          description: true,
          content: true,
          estimatedMinutes: true,
          module: {
            select: {
              title: true,
              course: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  color: true,
                  icon: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { nextReviewAt: "asc" },
    take: limit,
  })

  return NextResponse.json({ reviews })
}

/**
 * POST /api/reviews — grade a review (SM-2) or enqueue a lesson for review
 * Body:
 *   { lessonId: string, quality: number } — grade an existing review
 *   { lessonId: string, enqueue: true }   — add a lesson to the review queue
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const body = await request.json()
  const { lessonId, quality, enqueue } = body

  if (!lessonId || typeof lessonId !== "string") {
    return NextResponse.json(
      { error: "lessonId is required" },
      { status: 400 }
    )
  }

  // Verify lesson exists
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true },
  })
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
  }

  if (enqueue) {
    // Add lesson to review queue with initial SM-2 values
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const review = await prisma.spacedReview.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      update: {}, // Don't overwrite existing review schedule
      create: {
        userId: user.id,
        lessonId,
        nextReviewAt: tomorrow,
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
      },
    })

    return NextResponse.json({ review })
  }

  // Grade an existing review
  if (typeof quality !== "number" || quality < 0 || quality > 5) {
    return NextResponse.json(
      { error: "quality must be a number between 0 and 5" },
      { status: 400 }
    )
  }

  const existing = await prisma.spacedReview.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId } },
  })

  if (!existing) {
    return NextResponse.json(
      { error: "No review found for this lesson" },
      { status: 404 }
    )
  }

  const result = sm2({
    quality,
    repetitions: existing.repetitions,
    easeFactor: existing.easeFactor,
    interval: existing.interval,
  })

  const review = await prisma.spacedReview.update({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    data: {
      repetitions: result.repetitions,
      easeFactor: result.easeFactor,
      interval: result.interval,
      nextReviewAt: result.nextReviewAt,
    },
  })

  return NextResponse.json({ review, result })
}
