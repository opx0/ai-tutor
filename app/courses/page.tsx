import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  LayoutGrid,
  Lock,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import CourseForm from "@/components/course-form";
import CourseList from "@/components/course-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoadmapData } from "@/lib/roadmap";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Learn - LearnLM",
  description: "Curated learning paths and your personal course library",
};

interface StudyStudioPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function StudyStudioPage({ searchParams }: StudyStudioPageProps) {
  const data = await getRoadmapData();
  const search = await searchParams;
  const tab = search?.tab || "curated";
  const defaultTab = ["curated", "my", "create"].includes(tab) ? tab : "curated";

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Immersive Ambient Glow Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-chart-4/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="container mx-auto px-4 sm:px-8 pt-28 pb-12 max-w-7xl relative z-10">
        {/* Simplified Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Learn</h1>
          <Link
            href="/roadmap"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all font-bold text-sm"
          >
            <LayoutGrid className="w-4 h-4" /> Visual Path
          </Link>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultValue={defaultTab} className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="p-1.5 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <TabsTrigger
                value="curated"
                className="rounded-full px-6 py-2.5 flex items-center gap-2 text-sm font-bold data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] transition-all"
              >
                <LayoutGrid className="h-4 w-4" /> Curated Paths
              </TabsTrigger>
              <TabsTrigger
                value="my"
                className="rounded-full px-6 py-2.5 flex items-center gap-2 text-sm font-bold data-[state=active]:bg-chart-2/20 data-[state=active]:text-chart-2 data-[state=active]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] transition-all"
              >
                <BookOpen className="h-4 w-4" /> My Library
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="rounded-full px-6 py-2.5 flex items-center gap-2 text-sm font-bold data-[state=active]:bg-chart-5/20 data-[state=active]:text-chart-5 data-[state=active]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] transition-all"
              >
                <Plus className="h-4 w-4" /> Create Course
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Curated Paths */}
          <TabsContent
            value="curated"
            className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
          >
            {data.courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-card/40 backdrop-blur-sm border border-border/50 rounded-3xl mt-8 shadow-sm">
                <GraduationCap className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h2 className="text-xl font-bold mb-2 text-foreground">Paths Coming Soon</h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Curated courses are being forged by our curriculum team.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {data.courses.map((course) => {
                  const accentColor = course.color || "hsl(var(--primary))";
                  const isCompleted = course.status === "completed";
                  const isLocked = course.status === "locked";

                  return (
                    <Link
                      key={course.id}
                      href={isLocked ? "#" : `/courses/${course.slug || course.id}`}
                      className={`group block relative overflow-hidden rounded-[32px] border ${isLocked ? "border-border/30 bg-muted/10 opacity-70 cursor-not-allowed" : "border-white/10 dark:border-white/5 bg-black/40 hover:bg-black/60"} backdrop-blur-3xl transition-all duration-500 hover:shadow-[0_20px_60px_-15px_var(--glow)] hover:-translate-y-1.5`}
                      style={{ "--glow": accentColor } as React.CSSProperties}
                    >
                      {/* Glow Ambient Core */}
                      {!isLocked && (
                        <div
                          className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-500 z-0"
                          style={{
                            background: `radial-gradient(circle at 80% 20%, ${accentColor}, transparent 60%)`,
                          }}
                        />
                      )}

                      <div className="relative p-8 sm:p-10 z-10 flex flex-col h-full justify-between gap-8">
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <div
                              className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg backdrop-blur-md border"
                              style={{
                                color: isLocked ? "gray" : accentColor,
                                backgroundColor: isLocked ? "transparent" : `${accentColor}10`,
                                borderColor: isLocked ? "gray" : `${accentColor}30`,
                              }}
                            >
                              {isLocked ? "Locked" : course.difficulty}
                            </div>
                            {isCompleted && (
                              <div className="flex items-center gap-1.5 text-chart-2 text-xs font-bold uppercase tracking-wider bg-chart-2/10 px-3 py-1 rounded-lg border border-chart-2/20">
                                <CheckCircle2 className="w-4 h-4" /> <span>Mastered</span>
                              </div>
                            )}
                            {isLocked && (
                              <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold uppercase tracking-wider bg-muted/20 px-3 py-1 rounded-lg border border-border/50">
                                <Lock className="w-4 h-4" /> <span>Reqs Unmet</span>
                              </div>
                            )}
                          </div>

                          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-4">
                            {course.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed sm:text-lg max-w-md">
                            {course.description ||
                              "Master the core concepts with this structured, rigorous path."}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 sm:items-end justify-between mt-auto pt-6 border-t border-white/10">
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                            <div>
                              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">
                                Modules
                              </div>
                              <div className="font-semibold text-foreground">
                                {course.moduleCount}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">
                                Lessons
                              </div>
                              <div className="font-semibold text-foreground">
                                {course.lessonCount}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">
                                Estimate
                              </div>
                              <div className="font-semibold text-foreground">
                                ~{course.estimatedHours || 0}h
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">
                                Progress
                              </div>
                              <div
                                className="font-semibold"
                                style={{ color: isCompleted ? "#4ade80" : accentColor }}
                              >
                                {Math.round(course.progress)}%
                              </div>
                            </div>
                          </div>

                          {!isLocked && (
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                              style={{
                                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                              }}
                            >
                              <ChevronRight className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Tab 2: My Library */}
          <TabsContent
            value="my"
            className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
          >
            <div className="bg-black/20 p-6 sm:p-10 rounded-[32px] border border-white/5 backdrop-blur-xl">
              <CourseList />
            </div>
          </TabsContent>

          {/* Tab 3: Create Course */}
          <TabsContent
            value="create"
            className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
          >
            <div className="max-w-3xl mx-auto bg-black/20 p-6 sm:p-10 rounded-[32px] border border-white/5 backdrop-blur-xl">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Architect a new path</h2>
                <p className="text-muted-foreground text-sm">
                  Design structured curriculum using AI generation or manual assembly.
                </p>
              </div>
              <CourseForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
