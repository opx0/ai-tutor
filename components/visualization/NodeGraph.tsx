'use client'

import { getCellStyle, getEdgeHex } from '@/lib/visualization/cellStateColors'
import type { CellState, NodeGraphElement } from '@/lib/visualization/types'
import {
    Background,
    BackgroundVariant,
    Handle,
    Position,
    ReactFlow,
    useEdgesState,
    useNodesState,
    type Edge,
    type Node,
    type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useMemo } from 'react'

// ─── Custom Node ──────────────────────────────────────────────────────
function GraphNodeComponent({ data }: NodeProps) {
  const state = (data.state as CellState) || 'default'
  const style = getCellStyle(state)

  return (
    <div
      className="flex items-center justify-center w-12 h-12 rounded-full border-2 font-mono text-sm font-bold transition-all duration-300"
      style={style}
    >
      <Handle type="target" position={Position.Top} className="!bg-zinc-500 !w-2 !h-2" />
      {String(data.label ?? '')}
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-500 !w-2 !h-2" />
    </div>
  )
}

const nodeTypes = { custom: GraphNodeComponent }

// ─── Layout helpers ───────────────────────────────────────────────────
function applyLayout(
  element: NodeGraphElement
): { nodes: Node[]; edges: Edge[] } {
  const layout = element.layout || 'force'
  const elementNodes = element.nodes || []
  const elementEdges = element.edges || []

  if (elementNodes.length === 0) {
    return { nodes: [], edges: [] }
  }

  const nodes: Node[] = elementNodes.map((n, i) => {
    let x = n.x ?? 0
    let y = n.y ?? 0

    // Auto-position if no explicit coordinates
    if (n.x === undefined && n.y === undefined) {
      if (layout === 'linear') {
        x = i * 100
        y = 0
      } else if (layout === 'tree') {
        // Simple tree: one level deep for now
        x = i * 100
        y = Math.floor(i / 3) * 100
      } else {
        // Force-like: circular layout
        const angle = (2 * Math.PI * i) / elementNodes.length
        const radius = Math.max(80, elementNodes.length * 25)
        x = radius + radius * Math.cos(angle)
        y = radius + radius * Math.sin(angle)
      }
    }

    return {
      id: n.id,
      type: 'custom',
      position: { x, y },
      data: { label: n.value, state: n.state },
    }
  })

  const edges: Edge[] = elementEdges.map((e, i) => {
    const edgeColor = getEdgeHex(e.state)
    return {
      id: `${element.id}-edge-${i}`,
      source: e.source,
      target: e.target,
      label: e.label || undefined,
      type: e.directed !== false ? 'default' : 'straight',
      markerEnd: e.directed !== false ? { type: 'arrowclosed' as const, color: edgeColor } : undefined,
      style: {
        stroke: edgeColor,
        strokeWidth: 2,
        filter: e.state !== 'default' ? `drop-shadow(0 0 4px ${edgeColor}80)` : undefined,
      },
      labelStyle: {
        fill: '#a1a1aa',
        fontSize: 10,
      },
    }
  })

  return { nodes, edges }
}

// ─── Component ────────────────────────────────────────────────────────
type NodeGraphProps = {
  element: NodeGraphElement
}

export default function NodeGraph({ element }: NodeGraphProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => applyLayout(element),
    [element]
  )

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const onInit = useCallback(() => {}, [])

  return (
    <div className="space-y-2">
      {element.label && (
        <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {element.label}
        </div>
      )}
      <div className="w-full h-64 rounded-lg border border-zinc-700 overflow-hidden bg-zinc-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          minZoom={0.5}
          maxZoom={2}
          panOnDrag
          zoomOnScroll={false}
          className="bg-zinc-900"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#27272a" />
        </ReactFlow>
      </div>
    </div>
  )
}
