/**
 * Seed script — reads structured markdown files from content/dsa/
 * and populates the database.
 *
 * Content structure:
 *   content/dsa/
 *     _course.yaml          ← course metadata
 *     phase-01-xxx/
 *       _phase.yaml         ← phase metadata (title, goal, leetcode, etc.)
 *       01-lesson.md        ← markdown with YAML frontmatter
 *       01-lesson.viz.json  ← optional visualization
 *
 * Run: bun prisma/seed.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'

const prisma = new PrismaClient()

const CONTENT_DIR = path.join(process.cwd(), 'content', 'dsa')
const ADMIN_EMAIL = 'admin@learnlm.dev'

// ─── Admin user ─────────────────────────────────────────────────────
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

// ─── Estimated minutes per lesson ───────────────────────────────────
function estimateMinutes(content: string, hasViz: boolean): number {
  const words = content.length / 5
  const readingMin = Math.ceil(words / 200)
  const vizMin = hasViz ? 3 : 0
  return Math.max(5, readingMin + vizMin)
}

// ─── Read YAML file ─────────────────────────────────────────────────
function readYaml(filePath: string): Record<string, any> {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(raw)
  return data
}

// ─── Read markdown lesson ───────────────────────────────────────────
function readLesson(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { frontmatter: data, content: content.trim() }
}

// ─── Read optional viz JSON ─────────────────────────────────────────
function readViz(mdPath: string): any | undefined {
  const vizPath = mdPath.replace(/\.md$/, '.viz.json')
  if (fs.existsSync(vizPath)) {
    return JSON.parse(fs.readFileSync(vizPath, 'utf-8'))
  }
  return undefined
}

// ─── Main seed ──────────────────────────────────────────────────────
async function main() {
  const admin = await seedAdmin()

  // Read course metadata
  const courseMeta = readYaml(path.join(CONTENT_DIR, '_course.yaml'))

  // Discover phase directories (sorted)
  const phaseDirs = fs.readdirSync(CONTENT_DIR)
    .filter(d => d.startsWith('phase-') && fs.statSync(path.join(CONTENT_DIR, d)).isDirectory())
    .sort()

  // Count lessons
  let totalLessons = 0
  for (const dir of phaseDirs) {
    const files = fs.readdirSync(path.join(CONTENT_DIR, dir)).filter(f => f.endsWith('.md') && !f.startsWith('_'))
    totalLessons += files.length
  }

  console.log(`\nSeeding DSA Mastery course: ${phaseDirs.length} phases, ${totalLessons} lessons\n`)

  // Upsert the course
  const course = await prisma.course.upsert({
    where: { slug: courseMeta.slug },
    update: {
      title: courseMeta.title,
      description: courseMeta.description,
      difficulty: courseMeta.difficulty,
      topic: courseMeta.topic,
      type: courseMeta.type,
      icon: courseMeta.icon,
      color: courseMeta.color,
      estimatedHours: courseMeta.estimatedHours,
      isPublic: true,
    },
    create: {
      title: courseMeta.title,
      description: courseMeta.description,
      difficulty: courseMeta.difficulty,
      topic: courseMeta.topic,
      type: courseMeta.type,
      slug: courseMeta.slug,
      icon: courseMeta.icon,
      color: courseMeta.color,
      estimatedHours: courseMeta.estimatedHours,
      isPublic: true,
      userId: admin.id,
    },
  })
  console.log(`✓ Course: ${course.title} (${course.id})`)

  // Clear existing modules/lessons (idempotent)
  await prisma.module.deleteMany({ where: { courseId: course.id } })
  console.log(`  Cleared existing modules/lessons`)

  // Process each phase
  for (let phaseIdx = 0; phaseIdx < phaseDirs.length; phaseIdx++) {
    const phaseDir = path.join(CONTENT_DIR, phaseDirs[phaseIdx])
    const phaseMeta = readYaml(path.join(phaseDir, '_phase.yaml'))

    const keystoneLabel = phaseMeta.keystone ? ' ⚡' : ''
    const mod = await prisma.module.create({
      data: {
        title: `Phase ${phaseMeta.phase}: ${phaseMeta.title}${keystoneLabel}`,
        description: phaseMeta.goal,
        order: phaseIdx,
        courseId: course.id,
      },
    })

    // Build exercises from phase metadata
    const exercises = {
      bossChallenge: phaseMeta.bossChallenge,
      leetcode: (phaseMeta.leetcode || []).map((lc: any) => ({
        id: lc.id,
        title: lc.title,
        url: lc.url,
        tag: lc.tag,
      })),
    }

    // Discover lesson files (sorted)
    const lessonFiles = fs.readdirSync(phaseDir)
      .filter(f => f.endsWith('.md') && !f.startsWith('_'))
      .sort()

    for (let i = 0; i < lessonFiles.length; i++) {
      const mdPath = path.join(phaseDir, lessonFiles[i])
      const { frontmatter, content } = readLesson(mdPath)
      const viz = readViz(mdPath)
      const estMin = estimateMinutes(content, !!viz)

      await prisma.lesson.create({
        data: {
          title: frontmatter.title,
          description: `[${frontmatter.code}] ${phaseMeta.title}`,
          content: content,
          visualization: viz || undefined,
          exercises: i === lessonFiles.length - 1 ? (exercises as any) : undefined,
          order: i,
          moduleId: mod.id,
          estimatedMinutes: estMin,
        },
      })
    }

    console.log(`  ✓ Phase ${phaseMeta.phase}: ${phaseMeta.title} — ${lessonFiles.length} lessons`)
  }

  // Roadmap node
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
  const moduleCount = await prisma.module.count({ where: { courseId: course.id } })
  const lessonCount = await prisma.lesson.count({ where: { module: { courseId: course.id } } })
  console.log(`\n═══════════════════════════════════════`)
  console.log(`  DSA Mastery seeded from content/dsa/`)
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
