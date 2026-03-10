"use client"

import type { CourseNodeData } from "@/lib/roadmap"
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react"
import {
  Brain,
  Clock,
  BookOpen,
  Lock,
  CheckCircle2,
  Play,
  type LucideIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Brain,
}

export type CourseNodeType = Node<CourseNodeData, "course">

const statusConfig = {
  locked: {
    ringClass: "ring-muted-foreground/30",
    bgClass: "bg-muted/60",
    textClass: "text-muted-foreground",
    badgeClass: "bg-muted text-muted-foreground",
    badge: "Locked",
    icon: Lock,
  },
  available: {
    ringClass: "ring-primary/50",
    bgClass: "bg-card",
    textClass: "text-foreground",
    badgeClass: "bg-primary/15 text-primary",
    badge: "Start",
    icon: Play,
  },
  "in-progress": {
    ringClass: "ring-chart-5/60",
    bgClass: "bg-card",
    textClass: "text-foreground",
    badgeClass: "bg-chart-5/15 text-chart-5",
    badge: "In Progress",
    icon: BookOpen,
  },
  completed: {
    ringClass: "ring-chart-2/60",
    bgClass: "bg-card",
    textClass: "text-foreground",
    badgeClass: "bg-chart-2/15 text-chart-2",
    badge: "Completed",
    icon: CheckCircle2,
  },
}

export function CourseNode({ data }: NodeProps<CourseNodeType>) {
  const router = useRouter()
  const config = statusConfig[data.status]
  const StatusIcon = config.icon
  const CourseIcon = (data.icon && iconMap[data.icon]) || Brain
  const isLocked = data.status === "locked"

  const handleClick = useCallback(() => {
    if (isLocked) return
    const href = data.slug ? `/courses/${data.slug}` : `/courses/${data.id}`
    router.push(href)
  }, [data.slug, data.id, isLocked, router])

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary/50 !w-2.5 !h-2.5 !border-2 !border-background"
      />
      <div
        onClick={handleClick}
        className={`
          group relative w-[220px] rounded-xl border border-border/60 p-4
          ring-2 ${config.ringClass} ${config.bgClass}
          shadow-md transition-all duration-200
          ${isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5"}
        `}
      >
        {/* Color accent bar */}
        {data.color && (
          <div
            className="absolute top-0 left-3 right-3 h-0.5 rounded-b-full"
            style={{ backgroundColor: data.color }}
          />
        )}

        {/* Header: icon + status badge */}
        <div className="flex items-start justify-between mb-2.5">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{
              backgroundColor: data.color
                ? `${data.color}20`
                : "hsl(var(--primary) / 0.1)",
            }}
          >
            <CourseIcon
              className="w-5 h-5"
              style={{
                color: data.color || "hsl(var(--primary))",
              }}
            />
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.badgeClass}`}
          >
            <StatusIcon className="w-3 h-3" />
            {config.badge}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`text-sm font-semibold leading-tight mb-1.5 ${config.textClass}`}
        >
          {data.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {data.lessonCount} lessons
          </span>
          {data.estimatedHours && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {data.estimatedHours}h
            </span>
          )}
        </div>

        {/* Progress bar (only for in-progress) */}
        {data.status === "in-progress" && (
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{Math.round(data.progress * 100)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${data.progress * 100}%`,
                  backgroundColor:
                    data.color || "hsl(var(--chart-5))",
                }}
              />
            </div>
          </div>
        )}

        {/* Completed checkmark overlay */}
        {data.status === "completed" && (
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-chart-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Course complete
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary/50 !w-2.5 !h-2.5 !border-2 !border-background"
      />
    </>
  )
}
