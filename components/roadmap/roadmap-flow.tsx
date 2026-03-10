"use client"

import type { RoadmapData } from "@/lib/roadmap"
import { CourseNode, type CourseNodeType } from "@/components/roadmap/course-node"
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Edge,
  type NodeTypes,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useMemo } from "react"

const nodeTypes: NodeTypes = {
  course: CourseNode,
}

type RoadmapFlowProps = {
  data: RoadmapData
}

export default function RoadmapFlow({ data }: RoadmapFlowProps) {
  const nodes: CourseNodeType[] = useMemo(
    () =>
      data.courses.map((course) => ({
        id: course.id,
        type: "course" as const,
        position: { x: course.x, y: course.y },
        data: {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          icon: course.icon,
          color: course.color,
          difficulty: course.difficulty,
          estimatedHours: course.estimatedHours,
          moduleCount: course.moduleCount,
          lessonCount: course.lessonCount,
          progress: course.progress,
          status: course.status,
        },
      })),
    [data.courses]
  )

  const edges: Edge[] = useMemo(
    () =>
      data.edges.map((edge, i) => ({
        id: `edge-${i}`,
        source: edge.source,
        target: edge.target,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "hsl(var(--primary) / 0.4)",
          strokeWidth: 2,
        },
      })),
    [data.edges]
  )

  return (
    <div className="w-full h-[calc(100vh-8rem)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={1.5}
        panOnDrag
        zoomOnScroll
        className="roadmap-flow"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          className="!bg-background"
        />
        <Controls
          showInteractive={false}
          className="!bg-card !border-border !shadow-md !rounded-xl"
        />
        <MiniMap
          nodeColor={(node) => {
            const course = data.courses.find((c) => c.id === node.id)
            if (!course) return "hsl(var(--muted))"
            if (course.status === "completed") return "hsl(var(--chart-2))"
            if (course.status === "in-progress") return "hsl(var(--chart-5))"
            if (course.status === "locked") return "hsl(var(--muted-foreground) / 0.3)"
            return course.color || "hsl(var(--primary))"
          }}
          className="!bg-card !border-border !shadow-md !rounded-xl"
          maskColor="hsl(var(--background) / 0.8)"
        />
      </ReactFlow>
    </div>
  )
}
