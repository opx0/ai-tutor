"use client"

import Link from "next/link"
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  CircleCheck,
  Circle,
  Play,
  Eye,
  Dumbbell,
  Layers,
  Trophy,
  type LucideIcon,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

// Icon map for course icons
const iconMap: Record<string, LucideIcon> = { Brain }

type Lesson = {
  id: string
  title: string
  description: string | null
  order: number
  estimatedMinutes: number | null
  visualization: unknown
  exercises: unknown
}

type Module = {
  id: string
  title: string
  description: string | null
  order: number
  lessons: Lesson[]
}

type Course = {
  id: string
  title: string
  description: string | null
  difficulty: string
  topic: string
  type: string
  slug: string | null
  icon: string | null
  color: string | null
  estimatedHours: number | null
  modules: Module[]
}

type CuratedCourseDetailProps = {
  course: Course
  courseHref: string
  progress: number
  lastLessonId: string | null
  completedLessonIds: string[]
}

function getModuleProgress(
  mod: Module,
  completedLessonIds: string[]
): { completed: number; total: number; percent: number } {
  const total = mod.lessons.length
  const completed = mod.lessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length
  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}

function findContinueLesson(
  modules: Module[],
  completedLessonIds: string[],
  lastLessonId: string | null
): string | null {
  if (lastLessonId) {
    for (let mi = 0; mi < modules.length; mi++) {
      const mod = modules[mi]
      const li = mod.lessons.findIndex((l) => l.id === lastLessonId)
      if (li !== -1) {
        if (li + 1 < mod.lessons.length) return mod.lessons[li + 1].id
        if (mi + 1 < modules.length) return modules[mi + 1].lessons[0]?.id ?? null
      }
    }
  }
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (!completedLessonIds.includes(lesson.id)) return lesson.id
    }
  }
  return modules[0]?.lessons[0]?.id ?? null
}

export default function CuratedCourseDetail({
  course,
  courseHref,
  progress,
  lastLessonId,
  completedLessonIds,
}: CuratedCourseDetailProps) {
  const [sidebarOpen] = useState(true)
  const CourseIcon = (course.icon && iconMap[course.icon]) || Brain
  const accentColor = course.color || "hsl(var(--primary))"

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  )
  const completedCount = completedLessonIds.length
  const totalMinutes = course.modules.reduce(
    (acc, m) =>
      acc + m.lessons.reduce((s, l) => s + (l.estimatedMinutes ?? 5), 0),
    0
  )

  const continueLessonId = findContinueLesson(
    course.modules,
    completedLessonIds,
    lastLessonId
  )

  const defaultOpenModule = course.modules.find((m) =>
    m.lessons.some((l) => !completedLessonIds.includes(l.id))
  )

  const isAllComplete = completedCount === totalLessons && totalLessons > 0

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)]">
      {/* ─── Hero Section ─── */}
      <div
        className="relative overflow-hidden border-b"
        style={{
          background: `linear-gradient(135deg, ${accentColor}10 0%, transparent 50%), linear-gradient(225deg, ${accentColor}08 0%, transparent 50%)`,
        }}
      >
        {/* Decorative gradient orbs */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-[0.05] blur-3xl pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        <div className="container mx-auto px-4 py-8 max-w-7xl relative">
          {/* Back button row */}
          <div className="mb-5">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
            >
              <Link href="/courses">
                <ChevronLeft className="h-4 w-4" />
                Back to Roadmap
              </Link>
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Left: Icon + Info */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Course icon with glow */}
              <div
                className="relative flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 shadow-lg"
                style={{
                  backgroundColor: `${accentColor}20`,
                  boxShadow: `0 8px 32px ${accentColor}15`,
                }}
              >
                <CourseIcon
                  className="w-7 h-7"
                  style={{ color: accentColor }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight">
                    {course.title}
                  </h1>
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase tracking-widest font-semibold"
                  >
                    {course.difficulty}
                  </Badge>
                  <Badge
                    className="text-[10px] uppercase tracking-widest font-semibold border-0"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    Curated
                  </Badge>
                </div>
                {course.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl mb-4">
                    {course.description}
                  </p>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-1 flex-wrap">
                  {[
                    {
                      icon: Layers,
                      label: `${course.modules.length} modules`,
                    },
                    {
                      icon: BookOpen,
                      label: `${totalLessons} lessons`,
                    },
                    {
                      icon: Clock,
                      label: course.estimatedHours
                        ? `~${course.estimatedHours}h`
                        : `~${Math.round(totalMinutes / 60)}h`,
                    },
                    {
                      icon: isAllComplete ? Trophy : CircleCheck,
                      label: `${completedCount}/${totalLessons} completed`,
                      highlight: isAllComplete,
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                        stat.highlight
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                      style={
                        stat.highlight
                          ? {
                              backgroundColor: `${accentColor}12`,
                              color: accentColor,
                            }
                          : undefined
                      }
                    >
                      <stat.icon className="w-3.5 h-3.5" />
                      {stat.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Progress + CTA */}
            <div className="flex flex-col items-end gap-3 shrink-0 lg:min-w-[220px]">
              {/* Circular-style progress display */}
              <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl px-5 py-3.5 shadow-sm w-full">
                <div className="relative w-12 h-12 shrink-0">
                  <svg
                    className="w-12 h-12 -rotate-90"
                    viewBox="0 0 48 48"
                  >
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="4"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold">{progress}%</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">
                    {isAllComplete
                      ? "Course Complete!"
                      : progress > 0
                        ? "In Progress"
                        : "Not Started"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {completedCount} of {totalLessons} lessons
                  </div>
                </div>
              </div>

              {/* Continue / Start button */}
              {continueLessonId && (
                <Button
                  asChild
                  className="gap-2 w-full rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                    color: "white",
                  }}
                  size="lg"
                >
                  <Link href={`/courses/${courseHref}/${continueLessonId}`}>
                    <Play className="w-4 h-4" />
                    {completedCount > 0 ? "Continue Learning" : "Start Course"}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content: Sidebar + Content ─── */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside
          className={`border-r bg-card/30 backdrop-blur-sm transition-all duration-300 ${
            sidebarOpen ? "w-[360px]" : "w-0"
          } overflow-hidden shrink-0`}
        >
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="p-3">
              <div className="px-2 py-2 mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Course Content
                </h3>
              </div>
              <Accordion
                type="multiple"
                defaultValue={
                  defaultOpenModule ? [defaultOpenModule.id] : []
                }
              >
                {course.modules.map((mod) => {
                  const modProgress = getModuleProgress(
                    mod,
                    completedLessonIds
                  )
                  const isModComplete = modProgress.percent === 100
                  return (
                    <AccordionItem
                      key={mod.id}
                      value={mod.id}
                      className="border rounded-xl mb-2 overflow-hidden bg-card/50 hover:bg-card/80 transition-colors"
                    >
                      <AccordionTrigger className="px-3 py-3 hover:no-underline text-left [&[data-state=open]>svg]:rotate-180">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Module number badge */}
                          <div
                            className="flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-bold shrink-0 transition-colors"
                            style={{
                              backgroundColor: isModComplete
                                ? `${accentColor}20`
                                : "hsl(var(--muted))",
                              color: isModComplete
                                ? accentColor
                                : "hsl(var(--muted-foreground))",
                            }}
                          >
                            {isModComplete ? (
                              <CircleCheck className="w-4 h-4" />
                            ) : (
                              mod.order + 1
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium leading-tight truncate">
                              {mod.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-muted-foreground">
                                {modProgress.completed}/{modProgress.total}
                              </span>
                              <div className="flex-1 h-1 bg-muted rounded-full max-w-[80px] overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500 ease-out"
                                  style={{
                                    width: `${modProgress.percent}%`,
                                    background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <div className="divide-y divide-border/50">
                          {mod.lessons.map((lesson) => {
                            const isCompleted =
                              completedLessonIds.includes(lesson.id)
                            const isCurrent = lastLessonId === lesson.id
                            const hasViz = !!lesson.visualization
                            const hasExercises = !!lesson.exercises

                            return (
                              <Link
                                key={lesson.id}
                                href={`/courses/${courseHref}/${lesson.id}`}
                                className={`flex items-center gap-2.5 px-3 py-2.5 text-sm transition-all hover:bg-accent/50 group ${
                                  isCurrent
                                    ? "bg-primary/5 border-l-2"
                                    : ""
                                }`}
                                style={
                                  isCurrent
                                    ? { borderLeftColor: accentColor }
                                    : undefined
                                }
                              >
                                {/* Completion icon */}
                                <div className="shrink-0">
                                  {isCompleted ? (
                                    <CircleCheck
                                      className="h-4 w-4 transition-transform group-hover:scale-110"
                                      style={{ color: accentColor }}
                                    />
                                  ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/70" />
                                  )}
                                </div>

                                {/* Lesson info */}
                                <div className="flex-1 min-w-0">
                                  <div
                                    className={`font-medium leading-tight truncate transition-colors ${
                                      isCompleted
                                        ? "text-muted-foreground"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {lesson.title}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {lesson.estimatedMinutes && (
                                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                        <Clock className="w-2.5 h-2.5" />
                                        {lesson.estimatedMinutes}m
                                      </span>
                                    )}
                                    {hasViz && (
                                      <span className="text-[10px] text-chart-5 flex items-center gap-0.5">
                                        <Eye className="w-2.5 h-2.5" />
                                        Viz
                                      </span>
                                    )}
                                    {hasExercises && (
                                      <span className="text-[10px] text-chart-4 flex items-center gap-0.5">
                                        <Dumbbell className="w-2.5 h-2.5" />
                                        Practice
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Current badge */}
                                {isCurrent && (
                                  <Badge
                                    variant="outline"
                                    className="text-[9px] px-1.5 py-0 shrink-0"
                                    style={{
                                      borderColor: accentColor,
                                      color: accentColor,
                                    }}
                                  >
                                    Current
                                  </Badge>
                                )}

                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0 transition-transform group-hover:translate-x-0.5" />
                              </Link>
                            )
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          </ScrollArea>
        </aside>

        {/* ─── Main Content Area ─── */}
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-2">Course Overview</h2>
            {course.description && (
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {course.description}
              </p>
            )}

            {/* Overall progress bar */}
            <div className="mb-8 p-4 rounded-xl border bg-card/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-bold" style={{ color: accentColor }}>
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{completedCount} lessons completed</span>
                <span>{totalLessons - completedCount} remaining</span>
              </div>
            </div>

            {/* Module cards */}
            <div className="space-y-3">
              {course.modules.map((mod) => {
                const modProgress = getModuleProgress(mod, completedLessonIds)
                const isComplete = modProgress.percent === 100
                const firstUncompletedLesson = mod.lessons.find(
                  (l) => !completedLessonIds.includes(l.id)
                )

                return (
                  <div
                    key={mod.id}
                    className="group flex items-center gap-4 p-4 rounded-xl border bg-card/60 backdrop-blur-sm hover:bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                  >
                    {/* Module badge */}
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold shrink-0 transition-all duration-200"
                      style={{
                        backgroundColor: isComplete
                          ? `${accentColor}20`
                          : "hsl(var(--muted))",
                        color: isComplete
                          ? accentColor
                          : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {isComplete ? (
                        <CircleCheck className="w-5 h-5" />
                      ) : (
                        mod.order + 1
                      )}
                    </div>

                    {/* Module info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {mod.title}
                      </div>
                      {mod.description && (
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {mod.description}
                        </div>
                      )}
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {mod.lessons.length} lessons
                        {mod.lessons.some((l) => l.estimatedMinutes) && (
                          <> · ~{mod.lessons.reduce((s, l) => s + (l.estimatedMinutes ?? 5), 0)}m</>
                        )}
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-medium">
                          {modProgress.completed}/{modProgress.total}
                        </span>
                        <div className="w-20 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${modProgress.percent}%`,
                              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Quick action */}
                      {firstUncompletedLesson && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Link href={`/courses/${courseHref}/${firstUncompletedLesson.id}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
