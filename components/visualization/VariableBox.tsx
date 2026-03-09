'use client'

import { getCellStyle } from '@/lib/visualization/cellStateColors'
import type { VariableElement } from '@/lib/visualization/types'
import { AnimatePresence, motion } from 'framer-motion'

type VariableBoxProps = {
  element: VariableElement
}

export default function VariableBox({ element }: VariableBoxProps) {
  const style = getCellStyle(element.state)

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <div className="text-xs font-medium text-zinc-400 font-mono">
        {element.name}
      </div>
      <motion.div
        layout
        className="flex items-center justify-center min-w-[3rem] h-10 px-3 rounded-lg border-2 font-mono text-sm font-bold transition-all duration-300"
        style={style}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={String(element.value)}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            {element.value ?? 'null'}
          </motion.span>
        </AnimatePresence>
      </motion.div>
      {element.description && (
        <div className="text-[10px] text-zinc-500 max-w-[8rem]">
          {element.description}
        </div>
      )}
    </div>
  )
}
