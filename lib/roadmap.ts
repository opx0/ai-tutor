import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export type CourseNodeData = {
  id: string
  title: string
  slug: string | null
  description: string | null
  icon: string | null
  color: string | null
  difficulty: string
  estimatedHours: number | null
  moduleCount: number
  lessonCount: number
  // User-specific
  progress: number // 0-1
  status: "locked" | "available" | "in-progress" | "completed"
}

export type RoadmapData = {
  courses: (CourseNodeData & { x: number; y: number; group: string | null })[]
  edges: { source: string; target: string }[]
}

/**
 * Fetch all curated courses with roadmap node positions,
 * prerequisite edges, and user progress.
 */
export async function getRoadmapData(): Promise<RoadmapData> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  // Fetch curated courses with roadmap nodes, prerequisites, module/lesson counts
  const courses = await prisma.course.findMany({
    where: { type: "CURATED", isPublic: true },
    include: {
      roadmapNode: true,
      prerequisites: { select: { id: true } },
      modules: {
        select: {
          id: true,
          _count: { select: { lessons: true } },
        },
      },
      ...(userId
        ? {
            UserProgress: {
              where: { userId },
              select: { progress: true },
            },
          }
        : {}),
    },
    orderBy: { createdAt: "asc" },
  })

  // Build prerequisite edges
  const edges: { source: string; target: string }[] = []
  for (const course of courses) {
    for (const prereq of course.prerequisites) {
      edges.push({ source: prereq.id, target: course.id })
    }
  }

  // Determine completed course IDs for lock logic
  const completedIds = new Set<string>()
  if (userId) {
    for (const course of courses) {
      const progress = course.UserProgress?.[0]?.progress ?? 0
      if (progress >= 1) completedIds.add(course.id)
    }
  }

  // Map courses to node data
  const courseNodes = courses
    .filter((c) => c.roadmapNode) // Only show courses that have a roadmap position
    .map((course) => {
      const progress = course.UserProgress?.[0]?.progress ?? 0
      const moduleCount = course.modules.length
      const lessonCount = course.modules.reduce(
        (sum, m) => sum + m._count.lessons,
        0
      )

      // Determine status
      let status: CourseNodeData["status"] = "available"
      if (!userId) {
        status = "available" // Show all as available for non-logged-in users
      } else if (progress >= 1) {
        status = "completed"
      } else if (progress > 0) {
        status = "in-progress"
      } else {
        // Check if all prerequisites are completed
        const allPrereqsMet = course.prerequisites.every((p) =>
          completedIds.has(p.id)
        )
        status = allPrereqsMet ? "available" : "locked"
      }

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        icon: course.icon,
        color: course.color,
        difficulty: course.difficulty,
        estimatedHours: course.estimatedHours,
        moduleCount,
        lessonCount,
        progress,
        status,
        x: course.roadmapNode!.x,
        y: course.roadmapNode!.y,
        group: course.roadmapNode!.group,
      }
    })

  return { courses: courseNodes, edges }
}
