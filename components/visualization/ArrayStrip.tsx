'use client'

import { getCellStyle } from '@/lib/visualization/cellStateColors'
import type { ArrayElement } from '@/lib/visualization/types'
import { AnimatePresence, motion } from 'framer-motion'

type ArrayStripProps = {
  element: ArrayElement
}

export default function ArrayStrip({ element }: ArrayStripProps) {
  const isVertical = element.direction === 'vertical'
  const items = element.items || []

  if (items.length === 0) {
    return (
      <div className="space-y-2">
        {element.label && (
          <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{element.label}</div>
        )}
        <div className="text-xs text-zinc-500 italic">Empty array</div>
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
      <div
        className={`flex gap-1.5 ${isVertical ? 'flex-col items-start' : 'flex-row items-center flex-wrap'}`}
      >
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => {
            const style = getCellStyle(item.state)
            return (
              <motion.div
                key={`${element.id}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="flex items-center justify-center w-12 h-12 rounded-lg border-2 font-mono text-sm font-bold transition-all duration-300"
                style={style}
              >
                {item.value ?? ''}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      {/* Index labels */}
      <div
        className={`flex gap-1.5 ${isVertical ? 'flex-col items-start' : 'flex-row items-center flex-wrap'}`}
      >
        {items.map((_, i) => (
          <div
            key={`idx-${i}`}
            className="w-12 text-center text-[10px] text-zinc-500 font-mono"
          >
            {i}
          </div>
        ))}
      </div>
    </div>
  )
}
