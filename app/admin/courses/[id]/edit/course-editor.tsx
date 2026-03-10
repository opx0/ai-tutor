"use client";

import type { Course, Lesson, Module } from "@prisma/client";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type CourseWithModules = Course & {
  modules: (Module & { lessons: Lesson[] })[];
};

// ---------- Course Metadata Form ----------

function CourseMetadataForm({
  course,
  onSaved,
}: {
  course: Course;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title"),
      description: form.get("description"),
      topic: form.get("topic"),
      difficulty: form.get("difficulty"),
      slug: form.get("slug"),
      icon: form.get("icon"),
      color: form.get("color"),
      estimatedHours: form.get("estimatedHours"),
    };

    try {
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title</label>
          <input
            name="title"
            defaultValue={course.title}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Topic</label>
          <input
            name="topic"
            defaultValue={course.topic}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={course.description || ""}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Difficulty</label>
          <select
            name="difficulty"
            defaultValue={course.difficulty}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Slug</label>
          <input
            name="slug"
            defaultValue={course.slug || ""}
            pattern="[a-z0-9-]*"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Icon</label>
          <input
            name="icon"
            defaultValue={course.icon || ""}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Est. Hours</label>
          <input
            name="estimatedHours"
            type="number"
            min="1"
            defaultValue={course.estimatedHours || ""}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Accent Color</label>
        <input
          name="color"
          defaultValue={course.color || ""}
          placeholder="#8b5cf6"
          className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        <Save className="h-3.5 w-3.5" />
        {saving ? "Saving..." : "Save Metadata"}
      </button>
    </form>
  );
}

// ---------- Lesson Editor Inline ----------

function LessonItem({
  lesson,
  courseId,
  onDeleted,
  onSaved,
}: {
  lesson: Lesson;
  courseId: string;
  onDeleted: () => void;
  onSaved: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const vizRaw = form.get("visualization") as string;
    let visualization = null;
    if (vizRaw?.trim()) {
      try {
        visualization = JSON.parse(vizRaw);
      } catch {
        alert("Invalid JSON for visualization");
        setSaving(false);
        return;
      }
    }

    const exercisesRaw = form.get("exercises") as string;
    let exercises = null;
    if (exercisesRaw?.trim()) {
      try {
        exercises = JSON.parse(exercisesRaw);
      } catch {
        alert("Invalid JSON for exercises");
        setSaving(false);
        return;
      }
    }

    const data = {
      title: form.get("title"),
      description: form.get("description"),
      content: form.get("content"),
      estimatedMinutes: form.get("estimatedMinutes"),
      visualization,
      exercises,
    };

    const res = await fetch(`/api/admin/lessons/${lesson.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      onSaved();
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete lesson "${lesson.title}"?`)) return;
    setDeleting(true);
    await fetch(`/api/admin/lessons/${lesson.id}`, { method: "DELETE" });
    onDeleted();
  }

  return (
    <div className="border border-border rounded-lg bg-card/50">
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className="text-sm font-medium flex-1">{lesson.title}</span>
        {lesson.estimatedMinutes && (
          <span className="text-xs text-muted-foreground">
            {lesson.estimatedMinutes}min
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={deleting}
          className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {expanded && (
        <form onSubmit={handleSave} className="p-4 pt-2 space-y-3 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Title
              </label>
              <input
                name="title"
                defaultValue={lesson.title}
                required
                className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Est. Minutes
              </label>
              <input
                name="estimatedMinutes"
                type="number"
                min="1"
                defaultValue={lesson.estimatedMinutes || ""}
                className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Description
            </label>
            <input
              name="description"
              defaultValue={lesson.description || ""}
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Content (Markdown)
            </label>
            <textarea
              name="content"
              defaultValue={lesson.content || ""}
              rows={10}
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Visualization (JSON)
            </label>
            <textarea
              name="visualization"
              defaultValue={
                lesson.visualization
                  ? JSON.stringify(lesson.visualization, null, 2)
                  : ""
              }
              rows={6}
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Exercises (JSON)
            </label>
            <textarea
              name="exercises"
              defaultValue={
                lesson.exercises
                  ? JSON.stringify(lesson.exercises, null, 2)
                  : ""
              }
              rows={4}
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="h-3 w-3" />
            {saving ? "Saving..." : "Save Lesson"}
          </button>
        </form>
      )}
    </div>
  );
}

// ---------- Module Section ----------

function ModuleSection({
  module,
  courseId,
  onRefresh,
}: {
  module: Module & { lessons: Lesson[] };
  courseId: string;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSaveModule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    await fetch(`/api/admin/modules/${module.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
      }),
    });
    setSaving(false);
    setEditing(false);
    onRefresh();
  }

  async function handleDeleteModule() {
    if (
      !confirm(
        `Delete module "${module.title}" and all its lessons?`
      )
    )
      return;
    setDeleting(true);
    await fetch(`/api/admin/modules/${module.id}`, { method: "DELETE" });
    onRefresh();
  }

  async function handleAddLesson(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    await fetch(`/api/admin/courses/${courseId}/modules/${module.id}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.get("title") }),
    });
    setSaving(false);
    setAddingLesson(false);
    onRefresh();
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 p-4">
        <GripVertical className="h-4 w-4 text-muted-foreground/50" />
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 flex-1 text-left"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <div>
            <h3 className="font-medium text-sm">{module.title}</h3>
            <p className="text-xs text-muted-foreground">
              {module.lessons.length} lesson
              {module.lessons.length !== 1 ? "s" : ""}
              {module.description && ` · ${module.description}`}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setEditing(!editing);
              setExpanded(true);
            }}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleDeleteModule}
            disabled={deleting}
            className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {editing && (
            <form
              onSubmit={handleSaveModule}
              className="p-3 rounded-lg bg-muted/30 space-y-2"
            >
              <input
                name="title"
                defaultValue={module.title}
                required
                className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                name="description"
                defaultValue={module.description || ""}
                placeholder="Module description..."
                className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2 pl-6">
            {module.lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                courseId={courseId}
                onDeleted={onRefresh}
                onSaved={onRefresh}
              />
            ))}
          </div>

          {addingLesson ? (
            <form
              onSubmit={handleAddLesson}
              className="flex items-center gap-2 pl-6"
            >
              <input
                name="title"
                placeholder="Lesson title..."
                required
                autoFocus
                className="flex-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={saving}
                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setAddingLesson(false)}
                className="px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setAddingLesson(true)}
              className="flex items-center gap-1.5 pl-6 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Lesson
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Main Course Editor ----------

export function CourseEditor({ course }: { course: CourseWithModules }) {
  const router = useRouter();
  const [addingModule, setAddingModule] = useState(false);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  async function handleAddModule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    await fetch(`/api/admin/courses/${course.id}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
      }),
    });
    setSaving(false);
    setAddingModule(false);
    refresh();
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          {course.icon && <span className="text-3xl">{course.icon}</span>}
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-sm text-muted-foreground">
              Edit course content, modules, and lessons.
            </p>
          </div>
        </div>
      </div>

      {/* Course Metadata */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Course Metadata</h2>
        <div className="rounded-xl border border-border bg-card p-5">
          <CourseMetadataForm course={course} onSaved={refresh} />
        </div>
      </section>

      {/* Modules & Lessons */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Modules & Lessons
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({course.modules.length} modules,{" "}
              {course.modules.reduce(
                (sum, m) => sum + m.lessons.length,
                0
              )}{" "}
              lessons)
            </span>
          </h2>
        </div>

        <div className="space-y-3">
          {course.modules.map((module) => (
            <ModuleSection
              key={module.id}
              module={module}
              courseId={course.id}
              onRefresh={refresh}
            />
          ))}
        </div>

        {addingModule ? (
          <form
            onSubmit={handleAddModule}
            className="mt-4 p-4 rounded-xl border border-dashed border-border space-y-3"
          >
            <input
              name="title"
              placeholder="Module title..."
              required
              autoFocus
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              name="description"
              placeholder="Module description (optional)..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Adding..." : "Add Module"}
              </button>
              <button
                type="button"
                onClick={() => setAddingModule(false)}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setAddingModule(true)}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors w-full justify-center"
          >
            <Plus className="h-4 w-4" />
            Add Module
          </button>
        )}
      </section>
    </div>
  );
}
