/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Quality grades:
 *   0 — Complete blackout, no recall
 *   1 — Incorrect, but upon seeing the answer it felt familiar
 *   2 — Incorrect, but the answer was easy to recall once shown
 *   3 — Correct, but required significant effort
 *   4 — Correct, with some hesitation
 *   5 — Perfect recall
 *
 * @see https://en.wikipedia.org/wiki/SuperMemo#SM-2
 */

export type SM2Input = {
  quality: number // 0-5
  repetitions: number
  easeFactor: number
  interval: number // days
}

export type SM2Output = {
  repetitions: number
  easeFactor: number
  interval: number // days
  nextReviewAt: Date
}

export function sm2(input: SM2Input): SM2Output {
  const { quality, repetitions, easeFactor, interval } = input

  // Clamp quality to 0-5
  const q = Math.max(0, Math.min(5, Math.round(quality)))

  let newRepetitions: number
  let newInterval: number
  let newEaseFactor: number

  if (q < 3) {
    // Failed — reset repetitions, short interval
    newRepetitions = 0
    newInterval = 1
    newEaseFactor = easeFactor // Keep ease factor unchanged on failure
  } else {
    // Passed
    newRepetitions = repetitions + 1

    if (newRepetitions === 1) {
      newInterval = 1
    } else if (newRepetitions === 2) {
      newInterval = 6
    } else {
      newInterval = Math.round(interval * easeFactor)
    }

    // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    newEaseFactor =
      easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  }

  // Ease factor minimum is 1.3
  newEaseFactor = Math.max(1.3, newEaseFactor)

  // Cap interval at 365 days
  newInterval = Math.min(365, newInterval)

  // Calculate next review date
  const nextReviewAt = new Date()
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval)
  nextReviewAt.setHours(0, 0, 0, 0)

  return {
    repetitions: newRepetitions,
    easeFactor: Number(newEaseFactor.toFixed(2)),
    interval: newInterval,
    nextReviewAt,
  }
}

/**
 * User-friendly quality descriptions for the review UI
 */
export const qualityLabels = [
  { grade: 0, label: "Blackout", description: "No recall at all", color: "destructive" },
  { grade: 1, label: "Wrong", description: "Felt familiar after seeing answer", color: "destructive" },
  { grade: 2, label: "Hard", description: "Wrong, but answer was easy to recall", color: "destructive" },
  { grade: 3, label: "Difficult", description: "Correct with significant effort", color: "default" },
  { grade: 4, label: "Good", description: "Correct with some hesitation", color: "default" },
  { grade: 5, label: "Easy", description: "Perfect recall", color: "default" },
] as const
