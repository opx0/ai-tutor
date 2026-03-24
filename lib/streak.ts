import { prisma } from "@/lib/prisma"

export async function calculateUserStreak(userId: string): Promise<number> {
  const completions = await prisma.lessonCompletion.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
    select: { completedAt: true },
  })

  if (completions.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Local midnight
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Get unique days where a lesson was completed
  const activeDates = Array.from(
    new Set(
      completions.map((c) => {
        const d = new Date(c.completedAt)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    )
  ).sort((a, b) => b - a)

  if (activeDates.length === 0) return 0

  const mostRecent = activeDates[0]
  
  // If the most recent completion is before yesterday, streak is broken
  if (mostRecent < yesterday.getTime()) {
    return 0
  }

  // Count consecutive days backwards
  let expectedDate = mostRecent
  for (const date of activeDates) {
    if (date === expectedDate) {
      streak++
      // subtract one day for next expected
      expectedDate -= 24 * 60 * 60 * 1000
    } else {
      break
    }
  }

  return streak
}
