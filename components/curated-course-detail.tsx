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
  // If there's a last lesson and the next one isn't completed, return next
  if (lastLessonId) {
    for (let mi = 0; mi < modules.length; mi++) {
      const mod = modules[mi]
      const li = mod.lessons.findIndex((l) => l.id === lastLessonId)
      if (li !== -1) {
        // Try next in same module
        if (li + 1 < mod.lessons.length) return mod.lessons[li + 1].id
        // Try first of next module
        if (mi + 1 < modules.length) return modules[mi + 1].lessons[0]?.id ?? null
      }
    }
  }

  // Otherwise find first uncompleted lesson
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (!completedLessonIds.includes(lesson.id)) return lesson.id
    }
  }

  // All completed — return first lesson
  return modules[0]?.lessons[0]?.id ?? null
}

export default function CuratedCourseDetail({
  course,
  courseHref,
  progress,
  lastLessonId,
  completedLessonIds,
}: CuratedCourseDetailProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
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

  // Default open: first module that has uncompleted lessons
  const defaultOpenModule = course.modules.find((m) =>
    m.lessons.some((l) => !completedLessonIds.includes(l.id))
  )

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Hero section */}
      <div
        className="relative border-b"
        style={{
          background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 60%)`,
        }}
      >
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-start gap-4">
            {/* Back button */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="mt-1 shrink-0"
            >
              <Link href="/courses">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>

            {/* Icon */}
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
              style={{ backgroundColor: `${accentColor}18` }}
            >
              <CourseIcon
                className="w-6 h-6"
                style={{ color: accentColor }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight">
                  {course.title}
                </h1>
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase tracking-wider"
                >
                  {course.difficulty}
                </Badge>
              </div>
              {course.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {course.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {course.modules.length} modules, {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {course.estimatedHours
                    ? `~${course.estimatedHours}h`
                    : `~${Math.round(totalMinutes / 60)}h`}
                </span>
                <span className="flex items-center gap-1">
                  <CircleCheck className="w-3.5 h-3.5" />
                  {completedCount}/{totalLessons} completed ({progress}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 max-w-md">
                <Progress value={progress} className="h-1.5" />
              </div>
            </div>

            {/* Continue button */}
            {continueLessonId && (
              <Button asChild className="shrink-0 gap-2">
                <Link href={`/courses/${courseHref}/${continueLessonId}`}>
                  <Play className="w-4 h-4" />
                  {completedCount > 0 ? "Continue" : "Start"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content: sidebar + content area */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside
          className={`border-r bg-card/50 transition-all duration-200 ${
            sidebarOpen ? "w-[340px]" : "w-0"
          } overflow-hidden shrink-0`}
        >
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-3">
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
                  return (
                    <AccordionItem
                      key={mod.id}
                      value={mod.id}
                      className="border rounded-lg mb-2 overflow-hidden"
                    >
                      <AccordionTrigger className="px-3 py-2.5 hover:bg-muted/50 text-left [&[data-state=open]>svg]:rotate-180">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {/* Module number badge */}
                          <div
                            className="flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold shrink-0"
                            style={{
                              backgroundColor: `${accentColor}18`,
                              color: accentColor,
                            }}
                          >
                            {mod.order + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium leading-tight truncate">
                              {mod.title}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-muted-foreground">
                                {modProgress.completed}/{modProgress.total}
                              </span>
                              <div className="flex-1 h-1 bg-muted rounded-full max-w-[60px]">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${modProgress.percent}%`,
                                    backgroundColor: accentColor,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <div className="divide-y">
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
                                className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted/50 ${
                                  isCurrent
                                    ? "bg-primary/5 border-l-2 border-primary"
                                    : ""
                                }`}
                              >
                                {/* Completion icon */}
                                <div className="shrink-0">
                                  {isCompleted ? (
                                    <CircleCheck
                                      className="h-4 w-4"
                                      style={{ color: accentColor }}
                                    />
                                  ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground/50" />
                                  )}
                                </div>

                                {/* Lesson info */}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium leading-tight truncate">
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

                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
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

        {/* Main content area — overview / welcome */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">Course Overview</h2>
            {course.description && (
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {course.description}
              </p>
            )}

            <div className="space-y-3">
              {course.modules.map((mod) => {
                const modProgress = getModuleProgress(mod, completedLessonIds)
                const isComplete = modProgress.percent === 100

                return (
                  <div
                    key={mod.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                  >
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold shrink-0"
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
                        <CircleCheck className="w-4 h-4" />
                      ) : (
                        mod.order + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {mod.title}
                      </div>
                      {mod.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {mod.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                      <span>
                        {modProgress.completed}/{modProgress.total}
                      </span>
                      <div className="w-16 h-1.5 bg-muted rounded-full">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${modProgress.percent}%`,
                            backgroundColor: accentColor,
                          }}
                        />
                      </div>
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
