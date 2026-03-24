"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Brain,
  ChevronLeft,
  Clock,
  BookOpen,
  CircleCheck,
  Play,
  Layers,
  Trophy,
  type LucideIcon,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const iconMap: Record<string, LucideIcon> = { Brain }

type CourseHeroProps = {
  course: {
    title: string
    description: string | null
    difficulty: string
    type: string
    icon: string | null
    color: string | null
    estimatedHours: number | null
    modules: { title: string, lessons: { id: string, title: string, estimatedMinutes: number | null }[] }[]
  }
  courseHref: string
  progress: number
  totalLessons: number
  completedCount: number
  continueLessonId: string | null
}

export default function CourseHero({
  course,
  courseHref,
  progress,
  totalLessons,
  completedCount,
  continueLessonId,
}: CourseHeroProps) {
  const pathname = usePathname()
  const CourseIcon = (course.icon && iconMap[course.icon]) || Brain
  const accentColor = course.color || "hsl(var(--primary))"
  const isAllComplete = completedCount === totalLessons && totalLessons > 0

  // Check if we are on a lesson page vs the overview page
  // pathname format: /courses/[slug] vs /courses/[slug]/[lessonId]
  const pathParts = pathname.split('/').filter(Boolean)
  const isLessonPage = pathParts.length >= 3 && pathParts[0] === 'courses'

  if (isLessonPage) {
    // Find the current lesson and module
    const currentLessonId = pathParts[2]
    let currentModuleName = ""
    let currentLessonName = ""

    for (const mod of course.modules) {
      const lesson = mod.lessons.find((l) => l.id === currentLessonId)
      if (lesson) {
        currentModuleName = mod.title
        currentLessonName = lesson.title
        break
      }
    }

    // FIX 1: Collapsed hero (breadcrumb) for lesson pages without top padding
    return (
      <div className="border-b border-border/10 bg-background/50 backdrop-blur-md relative py-4 z-10 w-full sticky top-0">
        <div className="flex items-center px-4 max-w-full">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0 p-0"
          >
            <Link href="/courses">
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </Button>
          
          <div className="flex items-center text-sm ml-3 truncate min-w-0">
            <Link 
              href={`/courses/${courseHref}`} 
              className="font-semibold hover:text-primary transition-colors truncate hidden sm:block"
            >
              {course.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-muted-foreground/40 shrink-0 hidden sm:block" />
            <span className="text-muted-foreground truncate hidden md:block">
              {currentModuleName}
            </span>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-muted-foreground/40 shrink-0 hidden md:block" />
            <span className="text-foreground font-medium truncate">
              {currentLessonName}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Full Hero for Course Overview Page
  const totalMinutes = course.modules.reduce(
    (acc, m) =>
      acc + m.lessons.reduce((s, l) => s + (l.estimatedMinutes ?? 5), 0),
    0
  )

  return (
    <div className="relative overflow-hidden border-b border-[hsl(var(--border))]/20 bg-background pt-12 pb-10">
      {/* Mind-bending dynamic mesh animated background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.2] dark:opacity-[0.4]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 0%, ${accentColor}50 0%, transparent 60%),
            radial-gradient(ellipse at 80% 100%, ${accentColor}40 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, ${accentColor}20 0%, transparent 70%),
            linear-gradient(to right, rgba(255,255,255,0.01) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.01) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 60px 60px, 60px 60px',
        }}
      />
      {/* Decorative ultra-bright data orbs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[120%] rounded-full opacity-30 blur-[120px] pointer-events-none animate-pulse"
        style={{ backgroundColor: accentColor, animationDuration: '6s' }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[150%] rounded-full opacity-20 blur-[150px] pointer-events-none animate-pulse"
        style={{ backgroundColor: accentColor, animationDuration: '10s', animationDelay: '2s' }}
      />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Back button row */}
        <div className="mb-6">
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

        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
          {/* Left: Icon + Info */}
          <div className="flex items-start gap-5 flex-1 min-w-0">
            {/* Course icon with intense glass glow component */}
            <div
              className="relative flex items-center justify-center w-[72px] h-[72px] rounded-3xl shrink-0 shadow-2xl backdrop-blur-2xl border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}10)`,
                boxShadow: `0 0 50px -10px ${accentColor}80, inset 0 0 0 1px ${accentColor}60`,
              }}
            >
              <div 
                className="absolute inset-0 rounded-3xl z-0" 
                style={{
                  background: `linear-gradient(135deg, transparent 20%, ${accentColor}40)`
                }}
              />
              <CourseIcon
                className="w-9 h-9 relative z-10 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                style={{ color: accentColor }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">
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

              {/* Stats row */}
              <div className="flex items-center gap-1 flex-wrap">
                {[
                  { icon: Layers, label: `${course.modules.length} modules` },
                  { icon: BookOpen, label: `${totalLessons} lessons` },
                  {
                    icon: Clock,
                    label: course.estimatedHours
                      ? `~${course.estimatedHours}h`
                      : `~${Math.round(totalMinutes / 60)}h`,
                  },
                  {
                    icon: isAllComplete ? Trophy : CircleCheck,
                    label: `${completedCount}/${totalLessons}`,
                    highlight: isAllComplete,
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg ${
                      stat.highlight
                        ? "font-medium"
                        : "text-muted-foreground"
                    }`}
                    style={
                      stat.highlight
                        ? { backgroundColor: `${accentColor}12`, color: accentColor }
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

          {/* Right: Progress ring + CTA */}
          <div className="flex items-center gap-4 shrink-0 mt-4 lg:mt-0">
            <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-2xl px-5 py-3 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)]">
              <div className="relative w-10 h-10 shrink-0">
                <svg className="w-10 h-10 -rotate-90 drop-shadow-md" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="4" />
                  <circle
                    cx="24" cy="24" r="20" fill="none"
                    stroke={accentColor} strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold">{progress}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold">
                  {isAllComplete ? "Complete!" : progress > 0 ? "In Progress" : "Not Started"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {completedCount}/{totalLessons} lessons
                </div>
              </div>
            </div>

            {continueLessonId && (
              <Button
                asChild
                className="gap-2 rounded-2xl shadow-[0_0_20px_-5px_var(--btn-glow)] hover:shadow-[0_0_30px_-5px_var(--btn-glow)] transition-all hover:-translate-y-1 h-12 px-6"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                  color: "white",
                  '--btn-glow': accentColor
                } as React.CSSProperties}
              >
                <Link href={`/courses/${courseHref}/${continueLessonId}`}>
                  <Play className="w-4 h-4" />
                  {completedCount > 0 ? "Continue" : "Start"}
                 </Link>
               </Button>
             )}
           </div>
         </div>
       </div>
     </div>
   )
 }
