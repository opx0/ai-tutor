import type { CSSProperties } from 'react'
import type { CellState } from './types'

// ─── Color definitions per state ─────────────────────────────────────
// Research-backed palette: semantic associations, colorblind-safe,
// gradient backgrounds with glow shadows for pre-attentive processing.

export type CellColorDef = {
  /** Gradient start color */
  from: string
  /** Gradient end color */
  to: string
  /** Border color */
  border: string
  /** Text color */
  text: string
  /** Glow shadow color (with alpha) */
  glow: string
  /** Solid fallback / edge color */
  solid: string
}

const palette: Record<CellState, CellColorDef> = {
  default: {
    from: '#1e293b',
    to: '#334155',
    border: '#475569',
    text: '#e2e8f0',
    glow: 'transparent',
    solid: '#475569',
  },
  active: {
    // Cyan-teal: triggers alertness & focus
    from: '#06b6d4',
    to: '#0d9488',
    border: '#22d3ee',
    text: '#ffffff',
    glow: 'rgba(6, 182, 212, 0.45)',
    solid: '#06b6d4',
  },
  comparing: {
    // Warm amber-orange: triggers caution & attention
    from: '#f59e0b',
    to: '#f97316',
    border: '#fbbf24',
    text: '#ffffff',
    glow: 'rgba(245, 158, 11, 0.45)',
    solid: '#f59e0b',
  },
  done: {
    // Emerald-green: universally signals success
    from: '#10b981',
    to: '#22c55e',
    border: '#34d399',
    text: '#ffffff',
    glow: 'rgba(16, 185, 129, 0.4)',
    solid: '#10b981',
  },
  highlight: {
    // Purple-pink: perceptually rare & salient
    from: '#a855f7',
    to: '#ec4899',
    border: '#c084fc',
    text: '#ffffff',
    glow: 'rgba(168, 85, 247, 0.45)',
    solid: '#a855f7',
  },
  error: {
    // Rose-red: hardwired danger/urgency signal
    from: '#f43f5e',
    to: '#ef4444',
    border: '#fb7185',
    text: '#ffffff',
    glow: 'rgba(244, 63, 94, 0.45)',
    solid: '#f43f5e',
  },
  visited: {
    // Muted indigo: "been there, faded memory"
    from: 'rgba(67, 56, 202, 0.35)',
    to: 'rgba(99, 102, 241, 0.25)',
    border: 'rgba(129, 140, 248, 0.4)',
    text: '#a5b4fc',
    glow: 'rgba(99, 102, 241, 0.15)',
    solid: '#4338ca',
  },
}

// ─── Style generators ────────────────────────────────────────────────

/** Returns a React CSSProperties object for a given cell state */
export function getCellStyle(state: string | undefined | null): CSSProperties {
  const def = palette[(state as CellState)] ?? palette.default
  return {
    background: `linear-gradient(135deg, ${def.from}, ${def.to})`,
    borderColor: def.border,
    color: def.text,
    boxShadow: def.glow !== 'transparent'
      ? `0 0 12px 2px ${def.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`
      : 'inset 0 1px 0 rgba(255,255,255,0.05)',
  }
}

/** Returns just the glow box-shadow string for a state */
export function getGlowShadow(state: string | undefined | null): string {
  const def = palette[(state as CellState)] ?? palette.default
  if (def.glow === 'transparent') return 'none'
  return `0 0 16px 3px ${def.glow}`
}

/** Returns the solid hex color for edge strokes / markers */
export function getEdgeHex(state: string | undefined | null): string {
  const def = palette[(state as CellState)] ?? palette.default
  return def.solid
}

/** Returns the border color for a state */
export function getBorderColor(state: string | undefined | null): string {
  const def = palette[(state as CellState)] ?? palette.default
  return def.border
}

/** Full palette definition (for advanced use) */
export function getColorDef(state: string | undefined | null): CellColorDef {
  return palette[(state as CellState)] ?? palette.default
}

// ─── Legacy compatibility ────────────────────────────────────────────
// Keep old type/function signatures so nothing breaks during migration

export type CellColorSet = {
  bg: string
  border: string
  text: string
}

/** @deprecated Use getCellStyle() instead for richer visuals */
export function safeGetColors(state: string | undefined | null): CellColorSet {
  // Return empty strings — components should now use getCellStyle()
  // but we keep this so TypeScript doesn't error on any remaining refs
  return { bg: '', border: '', text: '' }
}

// ─── Log kind colors (enhanced vibrancy) ─────────────────────────────
export const logKindColors: Record<string, string> = {
  info: 'text-slate-400',
  call: 'text-cyan-400',
  return: 'text-emerald-400',
  compare: 'text-amber-400',
  swap: 'text-fuchsia-400',
}
