import { prisma } from "@/lib/prisma";
import { BookOpen, GraduationCap, Layers, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const [totalUsers, totalCourses, curatedCourses, totalLessons] =
    await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.course.count({ where: { type: "CURATED" } }),
      prisma.lesson.count(),
    ]);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Total Courses",
      value: totalCourses,
      icon: GraduationCap,
      color: "text-green-500",
    },
    {
      label: "Curated Courses",
      value: curatedCourses,
      icon: BookOpen,
      color: "text-purple-500",
    },
    {
      label: "Total Lessons",
      value: totalLessons,
      icon: Layers,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage curated courses, roadmap, and platform settings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
