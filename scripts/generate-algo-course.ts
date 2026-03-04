import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { Prisma } from '@prisma/client'
import * as dotenv from 'dotenv'
import { prisma } from '../lib/prisma'

dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

async function main() {
  console.log('Starting generation...')

  // Simplified schema — only define the lesson-level structure
  const courseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      title: { type: SchemaType.STRING },
      description: { type: SchemaType.STRING },
      modules: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
            lessons: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  title: { type: SchemaType.STRING },
                  summary: { type: SchemaType.STRING },
                  content: { type: SchemaType.STRING },
                  visualization: {
                    type: SchemaType.OBJECT,
                    nullable: true,
                    properties: {
                      type: { type: SchemaType.STRING },
                      steps: {
                        type: SchemaType.ARRAY,
                        items: {
                          type: SchemaType.OBJECT,
                          properties: {
                            message: { type: SchemaType.STRING },
                            elements: {
                              type: SchemaType.ARRAY,
                              items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                  type: { type: SchemaType.STRING },
                                  id: { type: SchemaType.STRING },
                                  label: { type: SchemaType.STRING, nullable: true },
                                  name: { type: SchemaType.STRING, nullable: true },
                                  value: { type: SchemaType.STRING, nullable: true },
                                  state: { type: SchemaType.STRING, nullable: true },
                                  items: {
                                    type: SchemaType.ARRAY,
                                    nullable: true,
                                    items: {
                                      type: SchemaType.OBJECT,
                                      properties: {
                                        value: { type: SchemaType.STRING },
                                        state: { type: SchemaType.STRING },
                                      },
                                      required: ['value', 'state'],
                                    },
                                  },
                                  lines: {
                                    type: SchemaType.ARRAY,
                                    nullable: true,
                                    items: {
                                      type: SchemaType.OBJECT,
                                      properties: {
                                        text: { type: SchemaType.STRING },
                                        kind: { type: SchemaType.STRING },
                                      },
                                      required: ['text', 'kind'],
                                    },
                                  },
                                },
                                required: ['type', 'id'],
                              },
                            },
                          },
                          required: ['message', 'elements'],
                        },
                      },
                    },
                    required: ['type', 'steps'],
                  },
                },
                required: ['title', 'summary', 'content'],
              },
            },
          },
          required: ['title', 'description', 'lessons'],
        },
      },
    },
    required: ['title', 'description', 'modules'],
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: courseSchema,
    },
  })

  const prompt = `
    You are a world-class computer science educator who teaches like Richard Feynman.
    Create a course called "Algorithms & Data Structures" for Beginner level.

    ═══════════════════════════════════════════════════
    TEACHING PHILOSOPHY — apply to EVERY lesson's content
    ═══════════════════════════════════════════════════

    1. FIRST PRINCIPLES: Derive every idea from scratch. Never assume the student
       knows "why" — always start with the underlying problem that motivated the
       concept. Ask: "What problem were we trying to solve?" before introducing
       the solution.

    2. FEYNMAN RULE: If you can't explain it simply, show the simple version first,
       then layer complexity. Start with a 2-element example before showing the
       general case. Build intuition before formalism.

    3. NO NAKED JARGON: Every technical term gets a one-line plain-English definition
       on first use. Format: <strong>Term</strong> — plain definition.
       Example: <strong>Time complexity</strong> — how the runtime grows as input grows.

    4. CONCRETE BEFORE ABSTRACT: Every abstract idea is IMMEDIATELY followed by ONE
       concrete, specific example. Never leave a concept floating without grounding it.

    5. ASCII DIAGRAMS: Use <pre> blocks with ASCII art for anything spatial or
       sequential — show memory layouts, pointer movements, tree shapes, stack frames.

    6. COMPRESS AGGRESSIVELY: Ruthlessly cut anything that doesn't build intuition
       or practical skill. No filler, no "in this lesson we will learn" preambles.

    7. NEVER REPEAT: If a concept was explained in a prior lesson, reference it
       ("recall Big-O from Module 1"), don't re-explain it.

    ═══════════════════════════════════════════════════
    LESSON CONTENT STRUCTURE — each lesson's "content" HTML
    ═══════════════════════════════════════════════════

    Structure every lesson in these phases (use <h2> tags for phase headers):

    Phase 1 — Foundation:
      • WHY THIS MATTERS: The real-world problem this solves (1-2 sentences)
      • MENTAL MODEL: A simple analogy or metaphor the student can hold in their head
      • CORE DEFINITION: Precise definition, jargon-free first, then formal
      • KEY TECHNIQUES: The 1-3 core operations/patterns, each with
        <em>[When to reach for this]</em> in one line

    Phase 2 — Depth:
      • COMPLEXITY ANALYSIS: Time & space, derived from first principles
        (count the operations, don't just state "O(n)")
      • WORKED EXAMPLE: Walk through a complete example step-by-step
      • BUILD IT: Pseudocode or real code the student can trace by hand

    Phase 3 — Mastery:
      • GOTCHAS: 2-3 common mistakes and how to avoid them
      • PRACTICE PROBLEMS: 2 problems graded easy → medium
      • CONCEPT FINGERPRINT: 3 bullets of what mastery looks like
      • CONNECTIONS: How this connects to other concepts. If combining two
        concepts, name the combo pattern explicitly.
        Example: "BFS + memoization = level-order DP for tree problems"

    ═══════════════════════════════════════════════════
    LEARNING ACCELERATION — embed these in content HTML
    ═══════════════════════════════════════════════════

    • After each major section, include a "test yourself" question inside a
      <blockquote> tag. Question only, NO answer. Force recall.
    • For each technique, include <em>[When to reach for this]</em> in one line.
    • End every lesson with <h3>Concept Fingerprint</h3>: 3 bullets on mastery.
    • When combining two concepts, use <strong>Combo pattern:</strong> callout.

    ═══════════════════════════════════════════════════
    MODULES
    ═══════════════════════════════════════════════════

    Create 5 modules with 3-4 lessons each:
    - Module 1: Introduction to Algorithms (Big-O, arrays basics)
    - Module 2: Sorting Algorithms (Bubble Sort, Selection Sort, Insertion Sort)
    - Module 3: Searching Algorithms (Linear Search, Binary Search)
    - Module 4: Data Structures (Stacks, Queues, Linked Lists)
    - Module 5: Trees & Graphs (BST, BFS, DFS)

    "content" MUST use HTML tags (<h1>, <h2>, <h3>, <p>, <ul>, <li>, <pre><code>,
    <blockquote>, <strong>, <em>) for readability.

    ═══════════════════════════════════════════════════
    VISUALIZATION REQUIREMENTS
    ═══════════════════════════════════════════════════

    CRITICAL: For EVERY lesson that explains an algorithm, you MUST include a "visualization" field.
    Set visualization to null ONLY for pure theory/intro lessons.

    The visualization must have:
    - "type": "array" or "graph" or "grid"
    - "steps": array of 5-8 step objects, each with:
      - "message": explanation string — explain WHY, not just WHAT
      - "elements": array of visual elements

    Element types (use type field):
    - "array": items=[{"value":"5","state":"default"},{"value":"3","state":"comparing"}]
    - "variable": name="i", value="0", state="active"
    - "log": lines=[{"text":"Compare 5 and 3","kind":"compare"}]

    Valid states: "default","active","comparing","done","highlight","error","visited"
    Valid log kinds: "info","call","return","compare","swap"

    Example element: {"type":"array","id":"arr","label":"Array","items":[{"value":"5","state":"default"},{"value":"3","state":"comparing"}]}
    Example variable: {"type":"variable","id":"v-i","name":"i","value":"0","state":"active"}
    Example log: {"type":"log","id":"log","lines":[{"text":"Comparing elements","kind":"compare"}]}
  `

  try {
    console.log('Sending to Gemini...')
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const data = JSON.parse(text)

    console.log('Generated:', data.title)
    console.log('Modules:', data.modules.length)

    let vizCount = 0
    let totalLessons = 0
    data.modules.forEach((m: any) => {
      console.log(`  ${m.title} (${m.lessons.length} lessons)`)
      m.lessons.forEach((l: any) => {
        totalLessons++
        if (l.visualization) {
          vizCount++
          console.log(`    ✅ ${l.title} — ${l.visualization.steps?.length || 0} viz steps`)
        } else {
          console.log(`    ❌ ${l.title} — no visualization`)
        }
      })
    })
    console.log(`\nVisualization: ${vizCount}/${totalLessons} lessons`)

    const user = await prisma.user.findFirst()
    if (!user) { console.log('No user found!'); return }

    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        difficulty: 'BEGINNER',
        topic: 'Algorithms & Data Structures',
        userId: user.id,
        modules: {
          create: data.modules.map((mod: any, mi: number) => ({
            title: mod.title,
            description: mod.description,
            order: mi,
            lessons: {
              create: mod.lessons.map((les: any, li: number) => ({
                title: les.title,
                description: les.summary,
                content: les.content,
                exercises: {},
                visualization: les.visualization || Prisma.DbNull,
                order: li,
              })),
            },
          })),
        },
      },
    })

    console.log('\n✅ Course created!')
    console.log('ID:', course.id)
    console.log('URL: http://localhost:3000/courses/' + course.id)
  } catch (error: any) {
    console.error('Error:', error.message || error)
    if (error.response) console.error('Response:', error.response)
  }

  await prisma.$disconnect()
}

main()
