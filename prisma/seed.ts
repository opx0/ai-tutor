import { PrismaClient } from '@prisma/client'
import { basicPhases } from '../lib/dsa-demo/basic-phases'
import { advancedPhases } from '../lib/dsa-demo/advanced-phases'
import type { DemoPhase } from '../lib/dsa-demo/types'

const prisma = new PrismaClient()

// ─── Admin user (upsert — safe to re-run) ───────────────────────────
const ADMIN_EMAIL = 'admin@aitutor.dev'

async function seedAdmin() {
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: 'ADMIN' },
    create: {
      email: ADMIN_EMAIL,
      name: 'Admin',
      role: 'ADMIN',
    },
  })
  console.log(`✓ Admin user: ${admin.email} (${admin.id})`)
  return admin
}

// ─── Estimated minutes per lesson (rough heuristic) ─────────────────
function estimateMinutes(content: string, hasViz: boolean): number {
  // ~200 words per minute reading speed, content is HTML
  const textLength = content.replace(/<[^>]*>/g, '').length
  const words = textLength / 5 // rough avg word length
  const readingMin = Math.ceil(words / 200)
  const vizMin = hasViz ? 3 : 0
  return Math.max(5, readingMin + vizMin) // minimum 5 minutes
}

// ─── Build exercises JSON from boss challenge + leetcode ────────────
function buildExercises(phase: DemoPhase) {
  return {
    bossChallenge: phase.bossChallenge,
    leetcode: phase.leetcode.map((lc) => ({
      id: lc.id,
      title: lc.title,
      url: lc.url,
      tag: lc.tag,
    })),
  }
}

// ─── Main seed ──────────────────────────────────────────────────────
async function main() {
  const admin = await seedAdmin()

  // Combine all phases in order
  const allPhases: DemoPhase[] = [...basicPhases, ...advancedPhases]
  console.log(
    `\nSeeding DSA Mastery course: ${allPhases.length} phases, ${allPhases.reduce((sum, p) => sum + p.lessons.length, 0)} lessons\n`
  )

  // Upsert the course (safe to re-run)
  const course = await prisma.course.upsert({
    where: { slug: 'dsa-mastery' },
    update: {
      title: 'DSA Mastery',
      description:
        'Master Data Structures and Algorithms from memory models to dynamic programming. 14 phases, 44 lessons with interactive visualizations and LeetCode practice.',
      difficulty: 'INTERMEDIATE',
      topic: 'Data Structures & Algorithms',
      type: 'CURATED',
      icon: 'Brain',
      color: '#cba6f7', // Catppuccin mauve
      estimatedHours: 40,
      isPublic: true,
    },
    create: {
      title: 'DSA Mastery',
      description:
        'Master Data Structures and Algorithms from memory models to dynamic programming. 14 phases, 44 lessons with interactive visualizations and LeetCode practice.',
      difficulty: 'INTERMEDIATE',
      topic: 'Data Structures & Algorithms',
      type: 'CURATED',
      slug: 'dsa-mastery',
      icon: 'Brain',
      color: '#cba6f7',
      estimatedHours: 40,
      isPublic: true,
      userId: admin.id,
    },
  })
  console.log(`✓ Course: ${course.title} (${course.id})`)

  // Delete existing modules + lessons for this course (cascade)
  // so the seed is idempotent
  await prisma.module.deleteMany({ where: { courseId: course.id } })
  console.log(`  Cleared existing modules/lessons`)

  // Create modules and lessons
  for (const phase of allPhases) {
    const moduleOrder = phase.phase - 1 // 0-indexed

    const keystoneLabel = phase.keystone ? ' ⚡' : ''
    const mod = await prisma.module.create({
      data: {
        title: `Phase ${phase.phase}: ${phase.title}${keystoneLabel}`,
        description: phase.goal,
        order: moduleOrder,
        courseId: course.id,
      },
    })

    const exercises = buildExercises(phase)

    for (let i = 0; i < phase.lessons.length; i++) {
      const lesson = phase.lessons[i]
      const estMin = estimateMinutes(
        lesson.content,
        lesson.visualization !== null
      )

      await prisma.lesson.create({
        data: {
          title: lesson.title,
          description: `[${lesson.code}] ${phase.title}`,
          content: lesson.content,
          visualization: lesson.visualization
            ? (lesson.visualization as any)
            : undefined,
          exercises:
            i === phase.lessons.length - 1 ? (exercises as any) : undefined, // attach exercises to last lesson of each phase
          order: i,
          moduleId: mod.id,
          estimatedMinutes: estMin,
        },
      })
    }

    console.log(
      `  ✓ Phase ${phase.phase}: ${phase.title} — ${phase.lessons.length} lessons`
    )
  }

  // Create roadmap node for the course
  await prisma.roadmapNode.upsert({
    where: { courseId: course.id },
    update: { x: 400, y: 300 },
    create: {
      courseId: course.id,
      x: 400,
      y: 300,
      group: 'core',
    },
  })
  console.log(`\n✓ Roadmap node created`)

  // Summary
  const moduleCount = await prisma.module.count({
    where: { courseId: course.id },
  })
  const lessonCount = await prisma.lesson.count({
    where: { module: { courseId: course.id } },
  })
  console.log(`\n═══════════════════════════════════════`)
  console.log(`  DSA Mastery seeded successfully!`)
  console.log(`  ${moduleCount} modules, ${lessonCount} lessons`)
  console.log(`═══════════════════════════════════════\n`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
