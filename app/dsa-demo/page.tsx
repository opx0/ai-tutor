'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { PhaseSidebar } from '@/components/dsa-demo/PhaseSidebar'
import { LessonView } from '@/components/dsa-demo/LessonView'
import { basicPhases } from '@/lib/dsa-demo/basic-phases'
import { advancedPhases } from '@/lib/dsa-demo/advanced-phases'
import type { DemoPhase, DemoLesson } from '@/lib/dsa-demo/types'
import {
  BookOpen,
  CodeXml,
  GraduationCap,
  Menu,
  RotateCcw,
  X,
  Zap,
} from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────
const TABS = [
  { key: 'basic', label: 'Basic', icon: BookOpen, phases: basicPhases },
  {
    key: 'advanced',
    label: 'Advanced',
    icon: GraduationCap,
    phases: advancedPhases,
  },
] as const

type TabKey = (typeof TABS)[number]['key']

const LS_KEY = 'dsa-demo-completed'

const ALL_PHASES = [...basicPhases, ...advancedPhases]
const TOTAL_ALL = ALL_PHASES.reduce((s, p) => s + p.lessons.length, 0)

// ─── Helpers ─────────────────────────────────────────────────
function loadCompleted(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return new Set(JSON.parse(raw))
  } catch {
    // ignore
  }
  return new Set()
}

function saveCompleted(set: Set<string>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify([...set]))
  } catch {
    // ignore
  }
}

// ─── Page ────────────────────────────────────────────────────
export default function DsaDemoPage() {
  // State
  const [activeTab, setActiveTab] = useState<TabKey>('basic')
  const [selectedLesson, setSelectedLesson] = useState<DemoLesson | null>(null)
  const [selectedPhase, setSelectedPhase] = useState<DemoPhase | null>(null)
  const [showBoss, setShowBoss] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    () => loadCompleted(),
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Persist completions
  useEffect(() => {
    saveCompleted(completedLessons)
  }, [completedLessons])

  // Current tab's phases
  const currentPhases = useMemo(
    () => TABS.find((t) => t.key === activeTab)!.phases,
    [activeTab],
  )

  // Auto-select first lesson when switching tabs (or on mount)
  useEffect(() => {
    const first = currentPhases[0]
    if (first && first.lessons.length > 0) {
      setSelectedPhase(first)
      setSelectedLesson(first.lessons[0])
      setShowBoss(false)
    }
  }, [currentPhases])

  // ─── Callbacks ───────────────────────────────────────────
  const handleSelectLesson = useCallback(
    (lesson: DemoLesson, phase: DemoPhase) => {
      setSelectedLesson(lesson)
      setSelectedPhase(phase)
      setShowBoss(false)
      setSidebarOpen(false)
    },
    [],
  )

  const handleSelectBoss = useCallback((phase: DemoPhase) => {
    setSelectedPhase(phase)
    setSelectedLesson(null)
    setShowBoss(true)
    setSidebarOpen(false)
  }, [])

  const handleMarkComplete = useCallback((lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev)
      if (next.has(lessonId)) next.delete(lessonId)
      else next.add(lessonId)
      return next
    })
  }, [])

  const handleNextLesson = useCallback(() => {
    if (!selectedPhase || !selectedLesson) return
    const allLessons = currentPhases.flatMap((p) =>
      p.lessons.map((l) => ({ lesson: l, phase: p })),
    )
    const idx = allLessons.findIndex(
      (x) => x.lesson.id === selectedLesson.id,
    )
    if (idx >= 0 && idx < allLessons.length - 1) {
      const next = allLessons[idx + 1]
      setSelectedLesson(next.lesson)
      setSelectedPhase(next.phase)
      setShowBoss(false)
    }
  }, [selectedPhase, selectedLesson, currentPhases])

  const handleResetProgress = useCallback(() => {
    setCompletedLessons(new Set())
  }, [])

  // ─── Stats ─────────────────────────────────────────────────
  const tabLessons = currentPhases.reduce(
    (sum, p) => sum + p.lessons.length,
    0,
  )
  const tabCompleted = currentPhases.reduce(
    (sum, p) =>
      sum + p.lessons.filter((l) => completedLessons.has(l.id)).length,
    0,
  )
  const globalCompleted = ALL_PHASES.reduce(
    (sum, p) =>
      sum + p.lessons.filter((l) => completedLessons.has(l.id)).length,
    0,
  )

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col">
      {/* ── Header bar ──────────────────────────────────────── */}
      <div className="border-b bg-background">
        {/* Course title row */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            {/* Mobile sidebar toggle */}
            <button
              className="rounded-md p-1.5 hover:bg-muted lg:hidden"
              onClick={() => setSidebarOpen((p) => !p)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <CodeXml className="h-5 w-5 text-primary" />
            <h1 className="text-sm font-semibold sm:text-base">
              DSA Mastery Course
            </h1>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              14 phases / {TOTAL_ALL} lessons
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Global progress */}
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-xs text-muted-foreground">
                {globalCompleted}/{TOTAL_ALL}
              </span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${TOTAL_ALL ? (globalCompleted / TOTAL_ALL) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Reset */}
            {globalCompleted > 0 && (
              <button
                onClick={handleResetProgress}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="Reset all progress"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab row */}
        <div className="flex items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  <span className="hidden text-xs opacity-70 sm:inline">
                    (Phases {tab.key === 'basic' ? '1-6' : '7-14'})
                  </span>
                </button>
              )
            })}
          </div>

          {/* Tab-specific progress */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {tabCompleted}/{tabLessons}
            </span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{
                  width: `${tabLessons ? (tabCompleted / tabLessons) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout: sidebar + content ───────────────────── */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            'w-72 shrink-0 border-r bg-background transition-transform duration-200 lg:translate-x-0',
            // Mobile: overlay
            'absolute inset-y-0 left-0 z-30 lg:static',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <PhaseSidebar
            phases={currentPhases}
            activeLessonId={
              showBoss
                ? `boss-${selectedPhase?.id}`
                : selectedLesson?.id ?? null
            }
            completedLessons={completedLessons}
            onSelectLesson={handleSelectLesson}
            onSelectBoss={handleSelectBoss}
          />
        </aside>

        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content */}
        <main className="flex-1 overflow-hidden">
          {selectedPhase ? (
            <LessonView
              phase={selectedPhase}
              lesson={selectedLesson}
              showBoss={showBoss}
              completedLessons={completedLessons}
              onMarkComplete={handleMarkComplete}
              onNextLesson={handleNextLesson}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Zap className="mx-auto mb-4 h-12 w-12 opacity-30" />
                <p className="text-lg font-medium">
                  Select a lesson to get started
                </p>
                <p className="mt-1 text-sm">
                  Choose a phase from the sidebar
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
