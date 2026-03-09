'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  ChevronRight,
  Zap,
  BookOpen,
  Trophy,
  ExternalLink,
} from 'lucide-react'
import type { DemoPhase, DemoLesson } from '@/lib/dsa-demo/types'

type PhaseSidebarProps = {
  phases: DemoPhase[]
  activeLessonId: string | null
  completedLessons: Set<string>
  onSelectLesson: (lesson: DemoLesson, phase: DemoPhase) => void
  onSelectBoss: (phase: DemoPhase) => void
}

export function PhaseSidebar({
  phases,
  activeLessonId,
  completedLessons,
  onSelectLesson,
  onSelectBoss,
}: PhaseSidebarProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(() => {
    // auto-expand the phase that contains the active lesson
    const s = new Set<string>()
    if (activeLessonId) {
      for (const p of phases) {
        if (p.lessons.some((l) => l.id === activeLessonId)) {
          s.add(p.id)
          break
        }
      }
    }
    if (s.size === 0 && phases.length > 0) s.add(phases[0].id)
    return s
  })

  const toggle = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev)
      if (next.has(phaseId)) next.delete(phaseId)
      else next.add(phaseId)
      return next
    })
  }

  return (
    <ScrollArea className="h-full">
      <nav className="space-y-1 p-3">
        {phases.map((phase) => {
          const isExpanded = expandedPhases.has(phase.id)
          const phaseComplete = phase.lessons.every((l) =>
            completedLessons.has(l.id),
          )

          return (
            <div key={phase.id}>
              {/* Phase header */}
              <button
                onClick={() => toggle(phase.id)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                  'hover:bg-muted/60',
                  isExpanded && 'bg-muted/40',
                  phase.keystone && 'border border-amber-500/30',
                )}
              >
                <ChevronRight
                  className={cn(
                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                    isExpanded && 'rotate-90',
                  )}
                />
                <span className="flex-1 truncate">
                  <span className="text-muted-foreground">
                    {phase.phase}.
                  </span>{' '}
                  {phase.title}
                </span>
                {phase.keystone && (
                  <Zap className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                )}
                {phaseComplete && (
                  <Badge
                    variant="secondary"
                    className="h-5 px-1.5 text-[10px]"
                  >
                    Done
                  </Badge>
                )}
              </button>

              {/* Lessons */}
              {isExpanded && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
                  {phase.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId
                    const isDone = completedLessons.has(lesson.id)
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson, phase)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors',
                          'hover:bg-muted/60',
                          isActive &&
                            'bg-primary/10 font-medium text-primary',
                          !isActive && isDone && 'text-muted-foreground',
                        )}
                      >
                        <BookOpen className="h-3.5 w-3.5 shrink-0 opacity-50" />
                        <span className="flex-1 truncate">
                          {lesson.title}
                        </span>
                        {lesson.visualization && (
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
                            title="Has visualization"
                          />
                        )}
                      </button>
                    )
                  })}

                  {/* Boss Challenge */}
                  <button
                    onClick={() => onSelectBoss(phase)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm font-medium transition-colors',
                      'text-amber-600 hover:bg-amber-500/10 dark:text-amber-400',
                    )}
                  >
                    <Trophy className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Boss Challenge</span>
                  </button>

                  {/* LeetCode count */}
                  {phase.leetcode.length > 0 && (
                    <div className="flex items-center gap-2 px-2.5 py-1 text-xs text-muted-foreground">
                      <ExternalLink className="h-3 w-3" />
                      {phase.leetcode.length} practice problems
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </ScrollArea>
  )
}
