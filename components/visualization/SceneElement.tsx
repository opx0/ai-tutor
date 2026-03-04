'use client'

import type { SceneElement as SceneElementType } from '@/lib/visualization/types'
import ArrayStrip from './ArrayStrip'
import Grid2D from './Grid2D'
import LogPanel from './LogPanel'
import NodeGraph from './NodeGraph'
import VariableBox from './VariableBox'

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
