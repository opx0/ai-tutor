import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChevronLeft, ChevronRight, CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import CourseDetail from "@/components/course-detail";
import CourseHero from "@/components/course-hero";
import { Progress } from "@/components/ui/progress";

export const dynamic = "force-dynamic";

type PageParams = {
  id: string;
};

/**
 * Lookup course by slug first, then by ID
 */
async function findCourse(idOrSlug: string) {
  let course = await prisma.course.findUnique({
    where: { slug: idOrSlug },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              order: true,
              estimatedMinutes: true,
              visualization: true,
              exercises: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    course = await prisma.course.findUnique({
      where: { id: idOrSlug },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                description: true,
                order: true,
                estimatedMinutes: true,
                visualization: true,
                exercises: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });
  }

  return course;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  try {
    const { id: idOrSlug } = await params;
    if (!idOrSlug) return { title: "Course Not Found" };

    const course = await findCourse(idOrSlug);
    if (!course) return { title: "Course Not Found" };

    return {
      title: `${course.title} | LearnLM`,
      description: course.description || "View course details",
    };
  } catch {
    return { title: "Course", description: "View course details" };
  }
}

interface PageProps {
  params: Promise<PageParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CoursePage({ params }: PageProps) {
  const { id: idOrSlug } = await params;
  if (!idOrSlug) notFound();

  const session = await getServerSession(authOptions);

  const course = await findCourse(idOrSlug);
  if (!course) notFound();

  // For non-public custom courses, require auth + ownership
  if (!course.isPublic && course.type === "CUSTOM") {
    if (!session?.user) {
      redirect("/auth/signin?callbackUrl=/courses/" + idOrSlug);
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });
    if (!user || course.userId !== user.id) {
      redirect("/dashboard");
    }
  }

  // For public/curated courses, auth is optional but needed for progress
  let progress = 0;
  let lastLessonId: string | null = null;
  let completedLessonIds: string[] = [];

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) {
      const userProgress = await prisma.userProgress.findFirst({
        where: { courseId: course.id, userId: user.id },
      });
      progress = userProgress?.progress ?? 0;
      lastLessonId = userProgress?.lastLessonId ?? null;

      const completions = await prisma.lessonCompletion.findMany({
        where: {
          userId: user.id,
          Lesson: { module: { courseId: course.id } },
        },
        select: { lessonId: true },
      });
      completedLessonIds = completions.map((c) => c.lessonId);
    }
  }

  const isCurated = course.type === "CURATED";
  const courseHref = course.slug || course.id;
  const accentColor = course.color || "hsl(var(--primary))";

  // For curated courses, render just the overview content (layout provides hero + sidebar)
  if (isCurated) {
    const totalLessons = course.modules.reduce(
      (acc, m) => acc + m.lessons.length,
      0
    );
    const completedCount = completedLessonIds.length;
    const isFullyCompleted = completedCount === totalLessons && totalLessons > 0;

    // Find active lesson & module for the "Jump Back In" card
    const firstUncompletedModule = course.modules.find(m => m.lessons.some(l => !completedLessonIds.includes(l.id)));
    const activeModule = firstUncompletedModule || course.modules[course.modules.length - 1];
    const activeLesson = activeModule?.lessons.find(l => !completedLessonIds.includes(l.id)) || activeModule?.lessons[activeModule.lessons.length - 1];

    const activeModCompleted = activeModule?.lessons.filter(l => completedLessonIds.includes(l.id)).length || 0;
    const activeModTotal = activeModule?.lessons.length || 1;
    const activeModPercent = Math.round((activeModCompleted / activeModTotal) * 100);

    const getDifficultyBadge = (order: number, total: number) => {
      const ratio = order / total;
      if (ratio < 0.25) return { label: "EASY", color: "text-chart-2", bg: "bg-chart-2/10" };
      if (ratio < 0.6) return { label: "MEDIUM", color: "text-chart-4", bg: "bg-chart-4/10" };
      if (ratio < 0.85) return { label: "HARD", color: "text-chart-5", bg: "bg-chart-5/10" };
      return { label: "ADVANCED", color: "text-destructive", bg: "bg-destructive/10" };
    };

    return (
      <div className="flex flex-col min-h-screen">
        <CourseHero
          course={course}
          courseHref={courseHref}
          progress={progress}
          totalLessons={totalLessons}
          completedCount={completedCount}
          continueLessonId={activeLesson ? activeLesson.id : null}
        />
        <div className="p-6 lg:p-8 overflow-auto relative flex-1">
          <div className="max-w-3xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="font-semibold">Back to Dashboard</span>
              </Link>
            </Button>
          </div>
          
          {/* Resume Learning / Start Card */}
          {activeLesson && (
            <div className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                {completedCount === 0 ? "Start Course" : isFullyCompleted ? "Course Finished" : "Jump Back In"}
              </h2>
              <Link
                href={`/courses/${courseHref}/${activeLesson.id}`}
                className="group block relative overflow-hidden rounded-2xl border-0 bg-black/40 dark:bg-black/80 p-6 sm:p-8 transition-all hover:shadow-[0_10px_40px_-15px_var(--glow)] hover:-translate-y-1 shadow-xl backdrop-blur-3xl"
                style={{ '--glow': accentColor } as React.CSSProperties}
              >
                {/* Animated gradient border wrapper */}
                <div 
                  className="absolute inset-0 z-0 p-[2px] rounded-2xl overflow-hidden pointer-events-none"
                >
                  <div 
                    className="absolute inset-[-100%] animate-spin-slow opacity-50"
                    style={{
                      background: `conic-gradient(from 0deg, transparent 0%, transparent 60%, ${accentColor} 100%)`,
                      animationDuration: '8s'
                    }}
                  />
                  <div className="absolute inset-[1px] bg-background/95 rounded-[15px]" />
                </div>
                
                <div 
                  className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity z-0"
                  style={{ background: `linear-gradient(135deg, transparent 40%, ${accentColor})` }}
                />
                
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold mb-2" style={{ color: accentColor }}>
                      <span className="uppercase tracking-wider">{activeModule.title}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="text-muted-foreground">Lesson {activeLesson.order + 1} of {activeModTotal}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-2">
                      {activeLesson.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 max-w-xl">
                      {activeLesson.description || "Continue your progress in this module."}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-center sm:items-end gap-3">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto rounded-xl font-bold shadow-[0_0_15px_-5px_var(--glow)] transition-all group-hover:scale-[1.02] group-hover:shadow-[0_0_25px_-5px_var(--glow)] h-12 px-6"
                      style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, color: "#fff", '--glow': accentColor } as React.CSSProperties}
                    >
                      {completedCount === 0 ? "Start Learning" : isFullyCompleted ? "Review Lesson" : "Continue"}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                    {!isFullyCompleted && completedCount > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <span>Phase Progress</span>
                        <span style={{ color: accentColor }}>{activeModPercent}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Module cards */}
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Course Outline
            </h2>
            <div className="text-sm font-medium text-muted-foreground">
              {course.modules.length} Modules
            </div>
          </div>
          <div className="space-y-4 relative mt-10">
            {/* Mind-Bending Connecting Line Background Perfectly Centered */}
            <div className="absolute top-10 bottom-10 left-[48px] sm:left-[55px] w-[3px] bg-gradient-to-b from-transparent via-[hsl(var(--border))]/30 to-transparent pointer-events-none hidden sm:block">
              <div 
                className="w-full h-40 bg-gradient-to-b from-transparent via-primary to-transparent opacity-100 animate-pulse drop-shadow-[0_0_10px_hsl(var(--primary))]"
                style={{ animationDuration: '3s' }}
              />
            </div>

            {course.modules.map((mod) => {
              const modTotal = mod.lessons.length;
              const modCompleted = mod.lessons.filter((l) =>
                completedLessonIds.includes(l.id)
              ).length;
              const modPercent =
                modTotal > 0
                  ? Math.round((modCompleted / modTotal) * 100)
                  : 0;
              const isComplete = modPercent === 100;
              const firstUncompletedLesson = mod.lessons.find(
                (l) => !completedLessonIds.includes(l.id)
              );
              
              const diffBadge = getDifficultyBadge(mod.order, course.modules.length);

              return (
                <Link
                  key={mod.id}
                  href={
                    firstUncompletedLesson
                      ? `/courses/${courseHref}/${firstUncompletedLesson.id}`
                      : `/courses/${courseHref}/${mod.lessons[0]?.id}`
                  }
                  className="group relative flex flex-col sm:flex-row sm:items-center p-5 sm:p-6 gap-5 sm:gap-7 rounded-[32px] border border-white/10 dark:border-white/5 bg-background/40 dark:bg-black/40 backdrop-blur-3xl hover:bg-black/60 hover:shadow-[0_12px_40px_-10px_var(--glow)] transition-all duration-300 hover:scale-[1.015] hover:-translate-y-1 overflow-hidden"
                  style={{ '--glow': accentColor } as React.CSSProperties}
                >
                  <div 
                    className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity z-0"
                    style={{ background: `linear-gradient(135deg, transparent 40%, ${accentColor})` }}
                  />
                  {/* Phase / Number Indicator */}
                  <div className="flex items-center gap-5 sm:w-64 shrink-0 relative z-10">
                    <div
                      className="relative z-10 flex items-center justify-center w-[60px] h-[60px] rounded-[20px] text-xl font-black shrink-0 transition-all duration-300 shadow-sm group-hover:shadow-lg"
                      style={{
                        background: isComplete ? `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)` : "hsl(var(--muted)/0.3)",
                        color: isComplete ? accentColor : "hsl(var(--muted-foreground))",
                        boxShadow: isComplete ? `0 0 30px -5px ${accentColor}60, inset 0 0 0 1px ${accentColor}50` : `inset 0 0 0 1px hsl(var(--border)/0.5)`,
                        textShadow: isComplete ? `0 0 10px ${accentColor}80` : 'none',
                      }}
                    >
                      {isComplete ? (
                        <CircleCheck className="w-6 h-6" />
                      ) : (
                        mod.order + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-foreground leading-tight truncate">
                        {mod.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                        {mod.lessons.length} lessons
                        {mod.lessons.some((l) => l.estimatedMinutes) && (
                          <>
                            <span>·</span>
                            <span>~{mod.lessons.reduce((s, l) => s + (l.estimatedMinutes ?? 5), 0)}m</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Difficulty & Description */}
                  <div className="flex-1 flex items-center justify-between sm:pl-6 sm:border-l border-white/10 dark:border-white/5 gap-5 relative z-10">
                    <div className="flex flex-col gap-2 flex-1">
                      <div className={`flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider w-max ${diffBadge.bg} ${diffBadge.color}`}>
                        {diffBadge.label}
                      </div>
                    </div>

                    {/* Progress Bar + Arrow */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="hidden sm:block text-right w-24">
                        <div className="flex items-center justify-end gap-1.5 text-xs font-semibold mb-1" style={{ color: modPercent > 0 ? accentColor : undefined }}>
                          {modPercent}%
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${modPercent}%`,
                              background: isComplete ? accentColor : `linear-gradient(90deg, ${accentColor}80, ${accentColor})`,
                              boxShadow: `0 0 10px 0 ${accentColor}60`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    );
  }

  // Original view for custom courses
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent">
          <Link href="/courses?tab=my" className="flex items-center gap-2 group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-semibold">Back to My Library</span>
          </Link>
        </Button>
      </div>
      <CourseDetail
        course={course}
        progress={progress}
        lastLessonId={lastLessonId}
      />
    </div>
  );
}
