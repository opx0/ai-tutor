"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  MarkerType,
  type NodeTypes,
  ReactFlow,
} from "@xyflow/react";
import { CourseNode, type CourseNodeType } from "@/components/roadmap/course-node";
import type { RoadmapData } from "@/lib/roadmap";
import "@xyflow/react/dist/style.css";
import { useMemo } from "react";

const nodeTypes: NodeTypes = {
  course: CourseNode,
};

type RoadmapFlowProps = {
  data: RoadmapData;
};

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
    [data.courses],
  );

  const edges: Edge[] = useMemo(
    () =>
      data.edges.map((edge, i) => {
        // Find source course to get the accent color
        const sourceCourse = data.courses.find((c) => c.id === edge.source);
        const accent = sourceCourse?.color || "hsl(var(--primary))";
        return {
          id: `edge-${i}`,
          source: edge.source,
          target: edge.target,
          type: "smoothstep",
          animated: sourceCourse?.status === "in-progress",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 16,
            height: 16,
            color: `${accent}90`,
          },
          style: {
            stroke: `${accent}60`,
            strokeWidth: 2.5,
          },
        };
      }),
    [data.edges, data.courses],
  );

  return (
    <div className="w-full h-[calc(100vh-8rem)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.35 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.25}
        maxZoom={1.5}
        panOnDrag
        zoomOnScroll
        className="roadmap-flow"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1.5}
          color="hsl(var(--muted-foreground) / 0.15)"
          className="!bg-background"
        />
        <Controls
          showInteractive={false}
          className="!bg-card !border-border !shadow-md !rounded-xl"
        />
      </ReactFlow>
    </div>
  );
}
