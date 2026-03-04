'use client'

import { getCellStyle } from '@/lib/visualization/cellStateColors'
import type { Grid2DElement } from '@/lib/visualization/types'

type Grid2DProps = {
  element: Grid2DElement
}

export default function Grid2D({ element }: Grid2DProps) {
  const cells = element.cells || []
  if (cells.length === 0) {
    return (
      <div className="space-y-2">
        {element.label && (
          <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{element.label}</div>
        )}
        <div className="text-xs text-zinc-500 italic">Empty grid</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {element.label && (
        <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {element.label}
        </div>
      )}
      <div className="overflow-auto">
        <table className="border-collapse">
          {/* Column labels */}
          {element.colLabels && (
            <thead>
              <tr>
                {/* Empty corner cell if we also have row labels */}
                {element.rowLabels && (
                  <th className="w-10 h-8" />
                )}
                {element.colLabels.map((col, ci) => (
                  <th
                    key={`col-${ci}`}
                    className="w-12 h-8 text-center text-[10px] text-zinc-500 font-mono font-normal"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {cells.map((row, ri) => (
              <tr key={`row-${ri}`}>
                {/* Row label */}
                {element.rowLabels && (
                  <td className="w-10 h-12 text-right pr-2 text-[10px] text-zinc-500 font-mono">
                    {element.rowLabels[ri] ?? ri}
                  </td>
                )}
                {row.map((cell, ci) => {
                  const style = getCellStyle(cell.state)
                  return (
                    <td
                      key={`cell-${ri}-${ci}`}
                      className="w-12 h-12 text-center border border-zinc-700/50 font-mono text-sm font-bold transition-all duration-300"
                      style={style}
                      title={cell.label || undefined}
                    >
                      {cell.value ?? ''}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
