'use client'

import { useVisualizationStore } from '@/lib/visualization/store'
import type { VisualizationBlock } from '@/lib/visualization/types'
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect } from 'react'
import SceneElement from './SceneElement'

type ScenePlayerProps = {
  block: VisualizationBlock
}

export default function ScenePlayer({ block }: ScenePlayerProps) {
  const {
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    next,
    prev,
    goTo,
    togglePlay,
    setSpeed,
    reset,
  } = useVisualizationStore()

  // Initialize store when block changes
  useEffect(() => {
    reset(block.steps.length)
  }, [block.steps.length, reset])

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      next()
    }, speed)
    return () => clearInterval(timer)
  }, [isPlaying, speed, next])

  const scene = block.steps[currentStep]
  if (!scene) return null

  // Group elements by type for layout
  const variables = scene.elements.filter((e) => e.type === 'variable')
  const others = scene.elements.filter((e) => e.type !== 'variable')

  return (
    <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-sm overflow-hidden">
      {/* Header / Message */}
      <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <p className="text-sm text-zinc-300 leading-relaxed">{scene.message}</p>
      </div>

      {/* Scene elements */}
      <div className="p-5 space-y-5">
        {/* Variables row */}
        {variables.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {variables.map((el, idx) => (
              <SceneElement key={`${el.id}-${idx}`} element={el} />
            ))}
          </div>
        )}

        {/* Other elements */}
        {others.map((el, idx) => (
          <SceneElement key={`${el.id}-${idx}`} element={el} />
        ))}
      </div>

      {/* Playback controls */}
      <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between gap-4">
        {/* Left: step counter */}
        <div className="text-xs text-zinc-500 font-mono min-w-[5rem]">
          Step {currentStep + 1} / {totalSteps}
        </div>

        {/* Center: controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => goTo(0)}
            disabled={currentStep === 0}
            className="p-2 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={prev}
            disabled={currentStep === 0}
            className="p-2 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Previous"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlay}
            className="p-2.5 rounded-lg bg-zinc-800 text-zinc-100 hover:bg-zinc-700 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={next}
            disabled={currentStep >= totalSteps - 1}
            className="p-2 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Next"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: speed */}
        <div className="flex items-center gap-2 min-w-[5rem] justify-end">
          <label className="text-[10px] text-zinc-500 uppercase">Speed</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-zinc-800 text-zinc-300 text-xs rounded-md px-2 py-1 border border-zinc-700 focus:outline-none focus:border-zinc-500"
          >
            <option value={3000}>0.5×</option>
            <option value={1500}>1×</option>
            <option value={750}>2×</option>
            <option value={400}>4×</option>
          </select>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="h-1 bg-zinc-800">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
            background: 'linear-gradient(90deg, #06b6d4, #0d9488, #10b981)',
          }}
        />
      </div>
    </div>
  )
}
