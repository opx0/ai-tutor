// ─── Cell / Node visual state ────────────────────────────────────────
export type CellState =
  | 'default'
  | 'active'
  | 'comparing'
  | 'done'
  | 'highlight'
  | 'error'
  | 'visited'

// ─── Primitive 1: Array Strip ────────────────────────────────────────
export type ArrayElement = {
  type: 'array'
  id: string
  label?: string
  items: { value: string | number | null; state: CellState }[]
  direction?: 'horizontal' | 'vertical' // default: horizontal
}

// ─── Primitive 2: Node Graph ─────────────────────────────────────────
export type GraphNode = {
  id: string
  value: string | number
  state: CellState
  x?: number
  y?: number
}

export type GraphEdge = {
  source: string
  target: string
  label?: string
  state: CellState
  directed?: boolean
}

export type NodeGraphElement = {
  type: 'graph'
  id: string
  label?: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  layout?: 'tree' | 'force' | 'linear' // default: force
}

// ─── Primitive 3: 2D Grid ────────────────────────────────────────────
export type GridCell = {
  value: string | number | null
  state: CellState
  label?: string
}

export type Grid2DElement = {
  type: 'grid'
  id: string
  label?: string
  cells: GridCell[][]
  rowLabels?: string[]
  colLabels?: string[]
}

// ─── Primitive 4: Variable Box ───────────────────────────────────────
export type VariableElement = {
  type: 'variable'
  id: string
  name: string
  value: string | number | null
  state: CellState
  description?: string
}

// ─── Primitive 5: Log Panel ──────────────────────────────────────────
export type LogElement = {
  type: 'log'
  id: string
  lines: { text: string; kind: 'info' | 'call' | 'return' | 'compare' | 'swap' }[]
}

// ─── Composite types ─────────────────────────────────────────────────
export type SceneElement =
  | ArrayElement
  | NodeGraphElement
  | Grid2DElement
  | VariableElement
  | LogElement

export type Scene = {
  message: string
  elements: SceneElement[]
}

export type VisualizationBlock = {
  type: 'array' | 'graph' | 'grid' // hint for initial layout
  initialState: unknown
  steps: Scene[]
}
