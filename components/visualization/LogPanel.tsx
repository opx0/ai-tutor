'use client'

import { logKindColors } from '@/lib/visualization/cellStateColors'
import type { LogElement } from '@/lib/visualization/types'
import { useEffect, useRef } from 'react'

type LogPanelProps = {
  element: LogElement
}

export default function LogPanel({ element }: LogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const lines = element.lines || []

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines.length])

  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
        Execution Log
      </div>
      <div
        ref={scrollRef}
        className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 max-h-48 overflow-y-auto font-mono text-xs space-y-0.5"
      >
        {lines.length === 0 ? (
          <div className="text-zinc-600 italic">No log entries</div>
        ) : (
          lines.map((line, i) => (
            <div
              key={`${element.id}-log-${i}`}
              className={`flex items-start gap-2 ${logKindColors[line.kind] || 'text-zinc-400'}`}
            >
              <span className="text-zinc-600 select-none w-5 text-right shrink-0">
                {i + 1}
              </span>
              <span className="opacity-50 shrink-0">
                {line.kind === 'call' && '→'}
                {line.kind === 'return' && '←'}
                {line.kind === 'compare' && '⇔'}
                {line.kind === 'swap' && '⇄'}
                {line.kind === 'info' && '•'}
              </span>
              <span>{line.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
