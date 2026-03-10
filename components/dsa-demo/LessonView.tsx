'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Trophy,
  ExternalLink,
  Zap,
  ArrowRight,
  CircleCheck,
} from 'lucide-react'
import type { DemoPhase, DemoLesson } from '@/lib/dsa-demo/types'
import dynamic from 'next/dynamic'

const ScenePlayer = dynamic(
  () => import('@/components/visualization/ScenePlayer'),
  { ssr: false },
)

type LessonViewProps = {
  phase: DemoPhase
  lesson: DemoLesson | null
  showBoss: boolean
  completedLessons: Set<string>
  onMarkComplete: (lessonId: string) => void
  onNextLesson: () => void
}

export function LessonView({
  phase,
  lesson,
  showBoss,
  completedLessons,
  onMarkComplete,
  onNextLesson,
}: LessonViewProps) {
  // ─── Boss Challenge view ────────────────────────────────────
  if (showBoss) {
    return (
      <ScrollArea className="h-full">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <div className="mb-6 flex items-center gap-3">
            <Trophy className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-bold">
              Phase {phase.phase} Boss Challenge
            </h1>
            {phase.keystone && (
              <Zap className="h-5 w-5 text-amber-500" />
            )}
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
            <p className="text-lg leading-relaxed">
              {phase.bossChallenge}
            </p>
          </div>

          {/* LeetCode Links */}
          {phase.leetcode.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-semibold">
                Practice Problems
              </h2>
              <div className="space-y-2">
                {phase.leetcode.map((lc) => (
                  <a
                    key={lc.id}
                    href={lc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/60"
                  >
                    <span className="text-sm font-mono text-muted-foreground">
                      #{lc.id}
                    </span>
                    <span className="flex-1 text-sm font-medium">
                      {lc.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {lc.tag}
                    </Badge>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    )
  }

  // ─── No lesson selected ─────────────────────────────────────
  if (!lesson) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p>Select a lesson from the sidebar to get started.</p>
      </div>
    )
  }

  const isDone = completedLessons.has(lesson.id)

  // ─── Lesson view ────────────────────────────────────────────
  return (
    <ScrollArea className="h-full">
      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Phase {phase.phase}: {phase.title}
            </span>
            {phase.keystone && (
              <Zap className="h-3.5 w-3.5 text-amber-500" />
            )}
          </div>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
        </div>

        {/* HTML Content */}
        <div
          className="lesson-content prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />

        {/* Visualization */}
        {lesson.visualization && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">
              Step-by-Step Visualization
            </h2>
            <ScenePlayer block={lesson.visualization} />
          </div>
        )}

        {/* Mark Complete + Next */}
        <div className="mt-10 flex items-center gap-3 border-t pt-6">
          {!isDone ? (
            <button
              onClick={() => onMarkComplete(lesson.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                'bg-primary text-primary-foreground hover:bg-primary/90',
              )}
            >
              <CircleCheck className="h-4 w-4" />
              Mark Complete
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <CircleCheck className="h-4 w-4" />
              Completed
            </span>
          )}
          <button
            onClick={onNextLesson}
            className={cn(
              'ml-auto inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              'border hover:bg-muted/60',
            )}
          >
            Next Lesson
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </ScrollArea>
  )
}
