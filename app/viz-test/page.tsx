'use client'

import ScenePlayer from '@/components/visualization/ScenePlayer'
import type { VisualizationBlock } from '@/lib/visualization/types'

// ─── All 5 Primitives in One Visualization ─────────────────────────────
// Scenario: Dijkstra's shortest path on a small graph
// Shows: Graph + Array (distances) + Grid (adjacency matrix) + Variables + Log
const allPrimitivesDemo: VisualizationBlock = {
  type: 'graph',
  initialState: { nodes: ['A', 'B', 'C', 'D'], start: 'A' },
  steps: [
    {
      message: 'Dijkstra\'s Algorithm — Find shortest paths from node A. Initialize all distances to ∞ except source A = 0.',
      elements: [
        {
          type: 'graph', id: 'g', label: 'Graph (Weighted)',
          nodes: [
            { id: 'A', value: 'A', state: 'active' },
            { id: 'B', value: 'B', state: 'default' },
            { id: 'C', value: 'C', state: 'default' },
            { id: 'D', value: 'D', state: 'default' },
          ],
          edges: [
            { source: 'A', target: 'B', label: '4', state: 'default', directed: false },
            { source: 'A', target: 'C', label: '2', state: 'default', directed: false },
            { source: 'B', target: 'D', label: '3', state: 'default', directed: false },
            { source: 'C', target: 'B', label: '1', state: 'default', directed: false },
            { source: 'C', target: 'D', label: '5', state: 'default', directed: false },
          ],
          layout: 'force',
        },
        {
          type: 'array', id: 'dist', label: 'Distances',
          items: [
            { value: '0', state: 'active' },
            { value: '∞', state: 'default' },
            { value: '∞', state: 'default' },
            { value: '∞', state: 'default' },
          ],
          direction: 'horizontal',
        },
        {
          type: 'grid', id: 'adj', label: 'Adjacency Matrix',
          cells: [
            [{ value: '–', state: 'default' }, { value: '4', state: 'default' }, { value: '2', state: 'default' }, { value: '–', state: 'default' }],
            [{ value: '4', state: 'default' }, { value: '–', state: 'default' }, { value: '1', state: 'default' }, { value: '3', state: 'default' }],
            [{ value: '2', state: 'default' }, { value: '1', state: 'default' }, { value: '–', state: 'default' }, { value: '5', state: 'default' }],
            [{ value: '–', state: 'default' }, { value: '3', state: 'default' }, { value: '5', state: 'default' }, { value: '–', state: 'default' }],
          ],
          rowLabels: ['A', 'B', 'C', 'D'],
          colLabels: ['A', 'B', 'C', 'D'],
        },
        { type: 'variable', id: 'v-cur', name: 'current', value: 'A', state: 'active' },
        { type: 'variable', id: 'v-visited', name: 'visited', value: '{}', state: 'default' },
        {
          type: 'log', id: 'log',
          lines: [
            { text: 'Initialize: dist = [0, ∞, ∞, ∞]', kind: 'info' },
            { text: 'Start from node A (dist=0)', kind: 'call' },
          ],
        },
      ],
    },
    {
      message: 'Process node A. Check neighbors: B (via weight 4) → dist=4, C (via weight 2) → dist=2.',
      elements: [
        {
          type: 'graph', id: 'g', label: 'Graph (Weighted)',
          nodes: [
            { id: 'A', value: 'A', state: 'visited' },
            { id: 'B', value: 'B', state: 'comparing' },
            { id: 'C', value: 'C', state: 'comparing' },
            { id: 'D', value: 'D', state: 'default' },
          ],
          edges: [
            { source: 'A', target: 'B', label: '4', state: 'active', directed: false },
            { source: 'A', target: 'C', label: '2', state: 'active', directed: false },
            { source: 'B', target: 'D', label: '3', state: 'default', directed: false },
            { source: 'C', target: 'B', label: '1', state: 'default', directed: false },
            { source: 'C', target: 'D', label: '5', state: 'default', directed: false },
          ],
          layout: 'force',
        },
        {
          type: 'array', id: 'dist', label: 'Distances',
          items: [
            { value: '0', state: 'done' },
            { value: '4', state: 'comparing' },
            { value: '2', state: 'comparing' },
            { value: '∞', state: 'default' },
          ],
          direction: 'horizontal',
        },
        {
          type: 'grid', id: 'adj', label: 'Adjacency Matrix',
          cells: [
            [{ value: '–', state: 'default' }, { value: '4', state: 'active' }, { value: '2', state: 'active' }, { value: '–', state: 'default' }],
            [{ value: '4', state: 'default' }, { value: '–', state: 'default' }, { value: '1', state: 'default' }, { value: '3', state: 'default' }],
            [{ value: '2', state: 'default' }, { value: '1', state: 'default' }, { value: '–', state: 'default' }, { value: '5', state: 'default' }],
            [{ value: '–', state: 'default' }, { value: '3', state: 'default' }, { value: '5', state: 'default' }, { value: '–', state: 'default' }],
          ],
          rowLabels: ['A', 'B', 'C', 'D'],
          colLabels: ['A', 'B', 'C', 'D'],
        },
        { type: 'variable', id: 'v-cur', name: 'current', value: 'A', state: 'done' },
        { type: 'variable', id: 'v-visited', name: 'visited', value: '{A}', state: 'active' },
        {
          type: 'log', id: 'log',
          lines: [
            { text: 'Initialize: dist = [0, ∞, ∞, ∞]', kind: 'info' },
            { text: 'Start from node A (dist=0)', kind: 'call' },
            { text: 'Relax A→B: 0+4=4 < ∞ → update dist[B]=4', kind: 'compare' },
            { text: 'Relax A→C: 0+2=2 < ∞ → update dist[C]=2', kind: 'compare' },
          ],
        },
      ],
    },
    {
      message: 'Pick unvisited node with smallest distance: C (dist=2). Check C\'s neighbors.',
      elements: [
        {
          type: 'graph', id: 'g', label: 'Graph (Weighted)',
          nodes: [
            { id: 'A', value: 'A', state: 'visited' },
            { id: 'B', value: 'B', state: 'comparing' },
            { id: 'C', value: 'C', state: 'active' },
            { id: 'D', value: 'D', state: 'comparing' },
          ],
          edges: [
            { source: 'A', target: 'B', label: '4', state: 'done', directed: false },
            { source: 'A', target: 'C', label: '2', state: 'done', directed: false },
            { source: 'B', target: 'D', label: '3', state: 'default', directed: false },
            { source: 'C', target: 'B', label: '1', state: 'active', directed: false },
            { source: 'C', target: 'D', label: '5', state: 'active', directed: false },
          ],
          layout: 'force',
        },
        {
          type: 'array', id: 'dist', label: 'Distances',
          items: [
            { value: '0', state: 'done' },
            { value: '3', state: 'highlight' },
            { value: '2', state: 'done' },
            { value: '7', state: 'comparing' },
          ],
          direction: 'horizontal',
        },
        {
          type: 'grid', id: 'adj', label: 'Adjacency Matrix',
          cells: [
            [{ value: '–', state: 'done' }, { value: '4', state: 'done' }, { value: '2', state: 'done' }, { value: '–', state: 'default' }],
            [{ value: '4', state: 'default' }, { value: '–', state: 'default' }, { value: '1', state: 'default' }, { value: '3', state: 'default' }],
            [{ value: '2', state: 'done' }, { value: '1', state: 'active' }, { value: '–', state: 'default' }, { value: '5', state: 'active' }],
            [{ value: '–', state: 'default' }, { value: '3', state: 'default' }, { value: '5', state: 'default' }, { value: '–', state: 'default' }],
          ],
          rowLabels: ['A', 'B', 'C', 'D'],
          colLabels: ['A', 'B', 'C', 'D'],
        },
        { type: 'variable', id: 'v-cur', name: 'current', value: 'C', state: 'active' },
        { type: 'variable', id: 'v-visited', name: 'visited', value: '{A, C}', state: 'active' },
        {
          type: 'log', id: 'log',
          lines: [
            { text: 'Initialize: dist = [0, ∞, ∞, ∞]', kind: 'info' },
            { text: 'Process A → dist[B]=4, dist[C]=2', kind: 'return' },
            { text: 'Pick C (smallest dist=2)', kind: 'call' },
            { text: 'Relax C→B: 2+1=3 < 4 → update dist[B]=3 ✓', kind: 'swap' },
            { text: 'Relax C→D: 2+5=7 < ∞ → update dist[D]=7', kind: 'compare' },
          ],
        },
      ],
    },
    {
      message: 'Pick B (dist=3). Check B→D: 3+3=6 < 7 → update dist[D]=6.',
      elements: [
        {
          type: 'graph', id: 'g', label: 'Graph (Weighted)',
          nodes: [
            { id: 'A', value: 'A', state: 'visited' },
            { id: 'B', value: 'B', state: 'active' },
            { id: 'C', value: 'C', state: 'visited' },
            { id: 'D', value: 'D', state: 'comparing' },
          ],
          edges: [
            { source: 'A', target: 'B', label: '4', state: 'done', directed: false },
            { source: 'A', target: 'C', label: '2', state: 'done', directed: false },
            { source: 'B', target: 'D', label: '3', state: 'active', directed: false },
            { source: 'C', target: 'B', label: '1', state: 'done', directed: false },
            { source: 'C', target: 'D', label: '5', state: 'done', directed: false },
          ],
          layout: 'force',
        },
        {
          type: 'array', id: 'dist', label: 'Distances',
          items: [
            { value: '0', state: 'done' },
            { value: '3', state: 'done' },
            { value: '2', state: 'done' },
            { value: '6', state: 'highlight' },
          ],
          direction: 'horizontal',
        },
        {
          type: 'grid', id: 'adj', label: 'Adjacency Matrix',
          cells: [
            [{ value: '–', state: 'done' }, { value: '4', state: 'done' }, { value: '2', state: 'done' }, { value: '–', state: 'default' }],
            [{ value: '4', state: 'done' }, { value: '–', state: 'default' }, { value: '1', state: 'done' }, { value: '3', state: 'active' }],
            [{ value: '2', state: 'done' }, { value: '1', state: 'done' }, { value: '–', state: 'default' }, { value: '5', state: 'done' }],
            [{ value: '–', state: 'default' }, { value: '3', state: 'default' }, { value: '5', state: 'default' }, { value: '–', state: 'default' }],
          ],
          rowLabels: ['A', 'B', 'C', 'D'],
          colLabels: ['A', 'B', 'C', 'D'],
        },
        { type: 'variable', id: 'v-cur', name: 'current', value: 'B', state: 'active' },
        { type: 'variable', id: 'v-visited', name: 'visited', value: '{A, C, B}', state: 'active' },
        {
          type: 'log', id: 'log',
          lines: [
            { text: 'Process A → dist[B]=4, dist[C]=2', kind: 'return' },
            { text: 'Process C → dist[B]=3, dist[D]=7', kind: 'return' },
            { text: 'Pick B (smallest dist=3)', kind: 'call' },
            { text: 'Relax B→D: 3+3=6 < 7 → update dist[D]=6 ✓', kind: 'swap' },
          ],
        },
      ],
    },
    {
      message: 'All nodes visited! Shortest distances from A: B=3 (via A→C→B), C=2 (direct), D=6 (via A→C→B→D). ✅',
      elements: [
        {
          type: 'graph', id: 'g', label: 'Graph — Shortest Paths from A',
          nodes: [
            { id: 'A', value: 'A (0)', state: 'done' },
            { id: 'B', value: 'B (3)', state: 'done' },
            { id: 'C', value: 'C (2)', state: 'done' },
            { id: 'D', value: 'D (6)', state: 'done' },
          ],
          edges: [
            { source: 'A', target: 'B', label: '4', state: 'default', directed: false },
            { source: 'A', target: 'C', label: '2', state: 'highlight', directed: false },
            { source: 'B', target: 'D', label: '3', state: 'highlight', directed: false },
            { source: 'C', target: 'B', label: '1', state: 'highlight', directed: false },
            { source: 'C', target: 'D', label: '5', state: 'default', directed: false },
          ],
          layout: 'force',
        },
        {
          type: 'array', id: 'dist', label: 'Final Distances',
          items: [
            { value: '0', state: 'done' },
            { value: '3', state: 'done' },
            { value: '2', state: 'done' },
            { value: '6', state: 'done' },
          ],
          direction: 'horizontal',
        },
        {
          type: 'grid', id: 'adj', label: 'Adjacency Matrix (used edges highlighted)',
          cells: [
            [{ value: '–', state: 'done' }, { value: '4', state: 'done' }, { value: '2', state: 'highlight' }, { value: '–', state: 'done' }],
            [{ value: '4', state: 'done' }, { value: '–', state: 'done' }, { value: '1', state: 'highlight' }, { value: '3', state: 'highlight' }],
            [{ value: '2', state: 'highlight' }, { value: '1', state: 'highlight' }, { value: '–', state: 'done' }, { value: '5', state: 'done' }],
            [{ value: '–', state: 'done' }, { value: '3', state: 'highlight' }, { value: '5', state: 'done' }, { value: '–', state: 'done' }],
          ],
          rowLabels: ['A', 'B', 'C', 'D'],
          colLabels: ['A', 'B', 'C', 'D'],
        },
        { type: 'variable', id: 'v-cur', name: 'current', value: 'D', state: 'done' },
        { type: 'variable', id: 'v-visited', name: 'visited', value: '{A, C, B, D}', state: 'done' },
        {
          type: 'log', id: 'log',
          lines: [
            { text: 'Process A → dist[B]=4, dist[C]=2', kind: 'return' },
            { text: 'Process C → dist[B]=3, dist[D]=7', kind: 'return' },
            { text: 'Process B → dist[D]=6', kind: 'return' },
            { text: 'Process D → no unvisited neighbors', kind: 'return' },
            { text: '✅ Done! Shortest: A=0, B=3, C=2, D=6', kind: 'info' },
          ],
        },
      ],
    },
  ],
}

export default function VizTestPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400 mb-2">
          Visualization Showcase
        </h1>
        <p className="text-zinc-400 mb-1">
          All 5 primitives in a single visualization — step through Dijkstra's shortest path algorithm.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-sky-900/50 text-sky-300 px-2 py-1 rounded">Graph</span>
          <span className="bg-emerald-900/50 text-emerald-300 px-2 py-1 rounded">Array</span>
          <span className="bg-amber-900/50 text-amber-300 px-2 py-1 rounded">Grid</span>
          <span className="bg-violet-900/50 text-violet-300 px-2 py-1 rounded">Variable</span>
          <span className="bg-rose-900/50 text-rose-300 px-2 py-1 rounded">Log</span>
        </div>
      </div>
      <ScenePlayer block={allPrimitivesDemo} />
    </div>
  )
}
