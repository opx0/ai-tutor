"use client";

import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { Brain, Check, Cpu, Hexagon, Lock, type LucideIcon, Orbit, Workflow } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { CourseNodeData } from "@/lib/roadmap";

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Hexagon,
  Orbit,
  Cpu,
  Workflow,
};

export type CourseNodeType = Node<CourseNodeData, "course">;

export function CourseNode({ data }: NodeProps<CourseNodeType>) {
  const router = useRouter();
  // Default to a highly modern Orbit icon if none mapped
  const CourseIcon = (data.icon && iconMap[data.icon]) || Orbit;
  const isLocked = data.status === "locked";
  const isCompleted = data.status === "completed";
  const isInProgress = data.status === "in-progress";

  const accent = data.color || "hsl(var(--primary))";
  const progressPct = Math.round(data.progress ?? 0);

  // Minimalist Glass Pill Design
  const handleClick = useCallback(() => {
    if (isLocked) return;
    const href = data.slug ? `/courses/${data.slug}` : `/courses/${data.id}`;
    router.push(href);
  }, [data.slug, data.id, isLocked, router]);

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-white/20 !border-0 !rounded-full opacity-0 outline-none transition-opacity"
      />

      <div
        onClick={handleClick}
        className={`group relative flex items-center gap-4 p-3 rounded-[24px] transition-all duration-500
          ${isLocked ? "opacity-30 cursor-not-allowed grayscale" : "cursor-pointer hover:scale-[1.03]"}
          bg-black/60 backdrop-blur-3xl border hover:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]
        `}
        style={{
          width: 260,
          borderColor: !isLocked ? `${accent}40` : "rgba(255,255,255,0.05)",
        }}
      >
        {/* Deep ambient glow behind the node on hover */}
        {!isLocked && (
          <div
            className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-[0.15] transition-opacity duration-700 blur-2xl -z-10"
            style={{ backgroundColor: accent }}
          />
        )}

        {/* Minimalist Icon & Progress Box */}
        <div className="relative w-12 h-12 shrink-0 rounded-[16px] flex items-center justify-center overflow-hidden bg-black/40 border border-white/5 shadow-inner">
          {/* Conic progress ring background (minimalist data visualization) */}
          {isInProgress && (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `conic-gradient(${accent} ${progressPct}%, transparent 0)`,
              }}
            />
          )}

          {isLocked ? (
            <Lock className="w-4 h-4 text-white/30" />
          ) : isCompleted ? (
            <Check className="w-5 h-5 drop-shadow-md" style={{ color: accent }} />
          ) : (
            <CourseIcon
              className="w-5 h-5 relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              style={{ color: accent }}
            />
          )}
        </div>

        {/* Right Info pane */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
              {isLocked ? "Locked" : data.difficulty}
            </span>
            {!isLocked && progressPct > 0 && progressPct < 100 && (
              <span className="text-[9px] font-black tracking-wider" style={{ color: accent }}>
                {progressPct}%
              </span>
            )}
          </div>
          <h3 className="text-[13px] font-bold text-white tracking-tight truncate leading-tight">
            {data.title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-white/30 mt-1 font-medium tracking-wide">
            <span>{data.lessonCount} lessons</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>~{data.estimatedHours}h</span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-white/20 !border-0 !rounded-full opacity-0 outline-none transition-opacity"
      />
    </>
  );
}
