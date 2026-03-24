"use client"

import Link from "next/link"
import {
  CircleCheck,
  Circle,
  ArrowLeft,
  LayoutDashboard
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname } from "next/navigation"

type Lesson = {
  id: string
  title: string
  description: string | null
  order: number
}

type Module = {
  id: string
  title: string
  description: string | null
  order: number
  lessons: Lesson[]
}

type CourseSidebarProps = {
  modules: Module[]
  courseHref: string
  completedLessonIds: string[]
  accentColor: string
}

export default function CourseSidebar({
  modules,
  courseHref,
  completedLessonIds,
  accentColor,
}: CourseSidebarProps) {
  const pathname = usePathname()

  // Determine which lesson is currently being viewed
  const activeLessonId = (() => {
    // Path format: /courses/[slug]/[lessonId]
    const parts = pathname.split("/")
    if (parts.length >= 4 && parts[1] === "courses") {
      return parts[3] || null
    }
    return null
  })()

  // Default open: module containing active lesson, or first uncompleted
  const defaultOpenModule = (() => {
    if (activeLessonId) {
      const mod = modules.find((m) =>
        m.lessons.some((l) => l.id === activeLessonId)
      )
      if (mod) return mod
    }
    return modules.find((m) =>
      m.lessons.some((l) => !completedLessonIds.includes(l.id))
    )
  })()

  return (
    <aside className="w-[280px] border-r border-white/5 bg-[#0a0e14] shrink-0 hidden md:flex flex-col sticky top-0 h-screen z-20 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.5)]">
      {/* ─── Premium Application Header ─── */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5 bg-black/40 shrink-0">
        <Link 
          href={`/courses/${courseHref}`}
          className="p-1.5 -ml-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-white/50 hover:text-white group flex items-center justify-center"
          title="Back to Course"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
        <div className="flex flex-col shrink-0">
           <span className="text-sm font-bold tracking-tight text-white/90">LearnLM</span>
           <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-400">Course Viewer</span>
        </div>
      </div>

      <ScrollArea className="flex-1 w-full">
        <div className="p-3 pb-24">
          <Accordion
            type="single"
            collapsible
            defaultValue={defaultOpenModule?.id}
          >
            {modules.map((mod) => {
              return (
                <AccordionItem
                  key={mod.id}
                  value={mod.id}
                  className="border-none mb-1.5 overflow-hidden"
                >
                  <AccordionTrigger className="px-3 py-2.5 hover:no-underline text-left rounded-xl hover:bg-white/5 transition-all [&[data-state=open]>svg]:rotate-180 data-[state=open]:bg-white/5">
                    <div className="text-sm font-semibold truncate leading-tight pr-2">
                      {mod.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pt-1.5 px-1">
                    <div className="flex flex-col space-y-1 relative before:absolute before:inset-y-0 before:left-[17px] before:w-px before:bg-gradient-to-b before:from-border/80 before:to-transparent">
                      {mod.lessons.map((lesson) => {
                        const isCompleted = completedLessonIds.includes(lesson.id)
                        const isActive = activeLessonId === lesson.id

                        return (
                          <Link
                            key={lesson.id}
                            href={`/courses/${courseHref}/${lesson.id}`}
                            className={`flex items-start gap-3 px-2 py-2 rounded-lg text-sm transition-all group relative z-10 ${
                              isActive
                                ? "bg-white/10 text-foreground font-medium shadow-sm backdrop-blur-md border border-white/10"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            }`}
                            style={isActive ? { boxShadow: `0 0 20px -10px ${accentColor}` } : {}}
                          >
                            <div className="pt-[2px] shrink-0 bg-transparent transition-colors">
                              {isCompleted ? (
                                <CircleCheck
                                  className="h-4 w-4 transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_currentColor]"
                                  style={{ color: accentColor }}
                                />
                              ) : (
                                <Circle className={`h-4 w-4 transition-colors ${isActive ? "text-foreground drop-shadow-[0_0_5px_currentColor]" : "text-muted-foreground/30 group-hover:text-muted-foreground/60"}`} />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="leading-snug truncate pr-1">
                                {lesson.title}
                              </div>
                            </div>
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
  )
}
