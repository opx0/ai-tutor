import type { VisualizationBlock } from '@/lib/visualization/types'

export type LeetCodeProblem = {
  id: number
  title: string
  url: string
  tag: string
}

export type DemoLesson = {
  id: string
  code: string       // e.g. "B-1", "A-3"
  title: string
  content: string    // HTML
  visualization: VisualizationBlock | null
}

export type DemoPhase = {
  id: string
  phase: number
  title: string
  goal: string
  keystone?: boolean
  lessons: DemoLesson[]
  bossChallenge: string
  leetcode: LeetCodeProblem[]
}
