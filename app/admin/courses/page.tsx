import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { Pencil, Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    where: { type: "CURATED" },
    include: {
      modules: {
        include: {
          _count: { select: { lessons: true } },
        },
      },
      _count: { select: { modules: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalLessons = (
    course: (typeof courses)[0]
  ) => course.modules.reduce((sum, m) => sum + m._count.lessons, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Curated Courses</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage curated learning paths.
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">
            No curated courses yet. Create your first one.
          </p>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Course
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                {course.icon && (
                  <span className="text-2xl">{course.icon}</span>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{course.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {course.difficulty}
                    </Badge>
                    {course.slug && (
                      <Badge variant="outline" className="text-xs font-mono">
                        /{course.slug}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {course._count.modules} modules, {totalLessons(course)}{" "}
                    lessons
                    {course.estimatedHours &&
                      ` · ~${course.estimatedHours}h`}
                  </p>
                </div>
              </div>

              <Link
                href={`/admin/courses/${course.id}/edit`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
