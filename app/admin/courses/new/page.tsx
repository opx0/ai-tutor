"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export default function NewCoursePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title") as string,
      description: form.get("description") as string,
      topic: form.get("topic") as string,
      difficulty: form.get("difficulty") as string,
      slug: form.get("slug") as string,
      icon: form.get("icon") as string,
      color: form.get("color") as string,
      estimatedHours: form.get("estimatedHours") as string,
    };

    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create course");
      }

      const course = await res.json();
      router.push(`/admin/courses/${course.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">New Curated Course</h1>
        <p className="text-muted-foreground mt-1">
          Create a new curated course. You can add modules and lessons after
          creation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. DSA Mastery"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="A brief description of the course..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="topic" className="text-sm font-medium">
              Topic <span className="text-destructive">*</span>
            </label>
            <input
              id="topic"
              name="topic"
              type="text"
              required
              placeholder="e.g. Data Structures & Algorithms"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="difficulty" className="text-sm font-medium">
              Difficulty <span className="text-destructive">*</span>
            </label>
            <select
              id="difficulty"
              name="difficulty"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0) + d.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">
              URL Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              placeholder="e.g. dsa-mastery"
              pattern="[a-z0-9-]+"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Lowercase letters, numbers, and hyphens only.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="estimatedHours" className="text-sm font-medium">
              Estimated Hours
            </label>
            <input
              id="estimatedHours"
              name="estimatedHours"
              type="number"
              min="1"
              placeholder="e.g. 40"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="icon" className="text-sm font-medium">
              Icon (emoji)
            </label>
            <input
              id="icon"
              name="icon"
              type="text"
              placeholder="e.g. 🧠"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="color" className="text-sm font-medium">
              Accent Color
            </label>
            <input
              id="color"
              name="color"
              type="text"
              placeholder="e.g. #8b5cf6"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Course"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/courses")}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
