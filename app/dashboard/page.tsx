import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import { LoaderCircle, Award, Target, BookOpen, Clock, Play, Plus, RefreshCw, CalendarCheck2 } from "lucide-react";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { TimeSpentChart } from "@/components/dashboard/overview-stats";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

function DashboardLoading() {
  return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-t-2 border-chart-2 animate-spin" />
        <div className="absolute inset-2 rounded-full border-r-2 border-primary animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        <LoaderCircle className="absolute inset-4 h-8 w-8 text-foreground/20" />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  // 1. Get user's course progress
  const courses = await prisma.course.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { modules: true } },
      modules: { include: { _count: { select: { lessons: true } } } },
    },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  const coursesWithProgress = await Promise.all(
    courses.map(async (course) => {
      const progress = await prisma.userProgress.findFirst({
        where: { courseId: course.id, userId: user.id },
      });
      const totalLessons = course.modules.reduce((acc, module) => acc + module._count.lessons, 0);
      return {
        ...course,
        _count: { ...course._count, lessons: totalLessons },
        progress: progress?.progress || 0,
      };
    })
  );

  const avgCompletion = coursesWithProgress.length > 0
    ? Math.round(coursesWithProgress.reduce((acc, c) => acc + c.progress, 0) / coursesWithProgress.length)
    : 0;

  // 2. Fetch Total Lessons Completed
  const completedLessonsCount = await prisma.lessonCompletion.count({
    where: { userId: user.id }
  });

  // 3. Fetch Time Spent Data (last 7 days)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  last7Days.setHours(0, 0, 0, 0);

  const recentCompletions = await prisma.lessonCompletion.findMany({
    where: { userId: user.id, completedAt: { gte: last7Days } },
    include: { Lesson: { select: { estimatedMinutes: true } } }
  });

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const timeDataMap = new Map<string, number>();
  days.forEach(d => timeDataMap.set(d, 0));

  let totalMinutesSpent = 0;
  recentCompletions.forEach(completion => {
    const day = days[completion.completedAt.getDay()];
    const mins = completion.Lesson?.estimatedMinutes || 5; // fallback
    totalMinutesSpent += mins;
    timeDataMap.set(day, (timeDataMap.get(day) || 0) + mins);
  });

  // Today needs to be at the end, let's just rotate array to end on today? 
  // For simplicity, just display them Su-Sa for now, or rotate accurately:
  const todayIdx = new Date().getDay();
  const rotatedDays = [...days.slice(todayIdx + 1), ...days.slice(0, todayIdx + 1)];
  
  const timeSpentData = rotatedDays.map(day => ({
    day,
    hours: (timeDataMap.get(day) || 0) / 60
  }));

  const totalHrs = Math.floor(totalMinutesSpent / 60);
  const totalMins = totalMinutesSpent % 60;

  // 4. Fetch Learning Plan (Upcoming Reviews)
  const upcomingReviews = await prisma.spacedReview.findMany({
    where: { userId: user.id, nextReviewAt: { gte: new Date() } },
    orderBy: { nextReviewAt: 'asc' },
    take: 3,
    include: { lesson: { select: { id: true, title: true, module: { select: { title: true, course: { select: { slug: true, id: true } } } } } } }
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded bg-chart-2/20 border border-chart-2/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-chart-2 shadow-md" />
            </div>
            <span className="font-bold tracking-widest uppercase text-xs text-muted-foreground">Learning Sync</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/courses?tab=my" className="bg-card hover:bg-accent border border-border/50 text-foreground px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Learning path
          </Link>
          <Link href="/courses" className="bg-chart-2 hover:bg-chart-2/90 text-background px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all hover:shadow-lg flex items-center gap-2">
            <Play className="w-4 h-4" /> Continue
          </Link>
        </div>
      </div>

      <Suspense fallback={<DashboardLoading />}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Top Row: Key Metrics */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border/40 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="p-2.5 rounded-2xl bg-chart-2/10 text-chart-2">
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-semibold text-muted-foreground text-sm tracking-wide">Skill Mastery</span>
              </div>
              <div className="flex items-end gap-3 relative z-10">
                <span className="text-5xl font-extrabold">{avgCompletion}%</span>
                <span className="px-2 py-0.5 rounded-full bg-chart-2/20 text-chart-2 text-[10px] uppercase font-bold mb-1.5 tracking-wider w-max">Average Status</span>
              </div>
            </div>

            <div className="bg-card border border-border/40 rounded-3xl p-6 flex flex-col justify-between shadow-sm group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="font-semibold text-muted-foreground text-sm tracking-wide">Active Courses</span>
              </div>
              <div className="flex items-end gap-3 relative z-10">
                <span className="text-5xl font-extrabold">{coursesWithProgress.filter(c => c.progress > 0 && c.progress < 100).length}</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase font-bold mb-1.5 tracking-wider w-max">In Progress</span>
              </div>
            </div>

            <div className="bg-card border border-border/40 rounded-3xl p-6 flex flex-col justify-between shadow-sm group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-chart-4/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="p-2.5 rounded-2xl bg-chart-4/10 text-chart-4">
                  <Target className="w-5 h-5" />
                </div>
                <span className="font-semibold text-muted-foreground text-sm tracking-wide">Lessons Completed</span>
              </div>
              <div className="flex items-end gap-3 relative z-10">
                <span className="text-5xl font-extrabold">{completedLessonsCount}</span>
                <span className="px-2 py-0.5 rounded-full bg-chart-4/10 text-chart-4 text-[10px] uppercase font-bold mb-1.5 tracking-wider w-max">Total Sessions</span>
              </div>
            </div>
          </div>

          {/* Body Section 1 */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Time spent in learning */}
            <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm">
              <TimeSpentChart 
                data={timeSpentData} 
                totalTimeString={
                  <>
                    {totalHrs > 0 && <>{totalHrs} <span className="text-xl font-medium text-muted-foreground tracking-normal">h</span></>}
                    {totalMins} <span className="text-xl font-medium text-muted-foreground tracking-normal">min</span>
                  </>
                }
              />
            </div>

            {/* Upcoming Reviews (Spaced Repetition Data Real Integration) */}
            <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg tracking-tight">Active Reviews</h3>
                <div className="px-3 py-1 bg-muted/50 rounded-full text-xs font-semibold">
                  Spaced Repetition
                </div>
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[54px] top-4 bottom-4 w-px bg-border/50" />
                
                <div className="space-y-6 relative z-10">
                  {upcomingReviews.length > 0 ? (
                    upcomingReviews.map((review, idx) => {
                      const reviewTime = new Date(review.nextReviewAt);
                      const isToday = reviewTime.toDateString() === new Date().toDateString();
                      const courseIdParam = review.lesson.module.course.slug || review.lesson.module.course.id;

                      return (
                        <div key={review.id} className="flex gap-4 items-center group">
                          <div className={`w-12 text-right text-xs font-bold ${isToday ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {isToday ? 'Today' : reviewTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                          <div className={`w-3 h-3 rounded-full border-2 border-background z-10 transition-colors ${isToday ? 'bg-primary shadow-md' : 'bg-muted-foreground'}`} />
                          
                          <Link href={`/courses/${courseIdParam}/${review.lesson.id}`} className="flex-1 bg-muted/20 border border-border/30 rounded-2xl p-4 flex justify-between items-center transition-colors hover:bg-muted/50 hover:border-border/60">
                            <div>
                              <h4 className="font-semibold text-sm line-clamp-1">{review.lesson.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {review.lesson.module.title}
                              </p>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isToday ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                              <RefreshCw className="w-4 h-4" />
                            </div>
                          </Link>
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center opacity-70">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                        <CalendarCheck2 className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">No reviews scheduled right now</p>
                      <p className="text-xs text-muted-foreground mt-1">Keep completing lessons to build your queue!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Continue Learning List (Sidebar right span 4) */}
          <div className="lg:col-span-4 bg-card border border-border/40 rounded-3xl p-6 flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg tracking-tight">Continue learning</h3>
              <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full bg-muted/50 hover:bg-muted" asChild>
                 <Link href="/courses"><Plus className="w-4 h-4" /></Link>
              </Button>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              {coursesWithProgress.slice(0, 4).map((course, i) => {
                const colors = ['bg-blue-500/20 text-blue-500', 'bg-primary/20 text-primary', 'bg-chart-2/20 text-chart-2', 'bg-chart-4/20 text-chart-4'];
                const glowColors = ['bg-blue-500', 'bg-primary', 'bg-chart-2', 'bg-chart-4'];
                const colorIdx = i % colors.length;
                
                return (
                  <Link key={course.id} href={`/courses/${course.id}`} className="group relative bg-muted/20 border border-border/40 rounded-2xl p-4 hover:bg-muted/40 transition-all flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${colors[colorIdx]}`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate pr-4">{course.title}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${glowColors[colorIdx]}`} style={{ width: `${course.progress}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground w-8 text-right">{course.progress}%</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 tracking-wide">~ {course._count.lessons * 20}m remain</p>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background shadow-md border border-border/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Play className="w-3 h-3 text-foreground ml-0.5" />
                    </div>
                  </Link>
                )
              })}
              
              {coursesWithProgress.length === 0 && (
                 <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Target className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No active courses.</p>
                    <Link href="/courses?tab=create" className="text-xs font-bold text-chart-2 mt-2 hover:underline">Create a Course</Link>
                 </div>
              )}
            </div>
          </div>
          
        </div>
      </Suspense>
    </div>
  );
}
