'use client'

import type { SceneElement as SceneElementType } from '@/lib/visualization/types'
import dynamic from 'next/dynamic'
import ArrayStrip from './ArrayStrip'
import Grid2D from './Grid2D'
import LogPanel from './LogPanel'
import VariableBox from './VariableBox'

const NodeGraph = dynamic(() => import('./NodeGraph'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/30">
      <span className="text-sm text-muted-foreground">Loading graph...</span>
    </div>
  ),
})

type SceneElementProps = {
  element: SceneElementType
}

/** Discriminated dispatcher — routes each element to its primitive renderer */
export default function SceneElement({ element }: SceneElementProps) {
  switch (element.type) {
    case 'array':
      return <ArrayStrip element={element} />
    case 'graph':
      return <NodeGraph element={element} />
    case 'grid':
      return <Grid2D element={element} />
    case 'variable':
      return <VariableBox element={element} />
    case 'log':
      return <LogPanel element={element} />
    default:
      return null
  }
}
