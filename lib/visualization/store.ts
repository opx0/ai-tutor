import { create } from 'zustand'

type VisualizationState = {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number // ms between steps
}

type VisualizationActions = {
  next: () => void
  prev: () => void
  goTo: (step: number) => void
  togglePlay: () => void
  setSpeed: (speed: number) => void
  reset: (totalSteps: number) => void
}

export const useVisualizationStore = create<VisualizationState & VisualizationActions>((set, get) => ({
  currentStep: 0,
  totalSteps: 0,
  isPlaying: false,
  speed: 1500,

  next: () => {
    const { currentStep, totalSteps } = get()
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 })
    } else {
      set({ isPlaying: false }) // stop at end
    }
  },

  prev: () => {
    const { currentStep } = get()
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 })
    }
  },

  goTo: (step: number) => {
    const { totalSteps } = get()
    if (step >= 0 && step < totalSteps) {
      set({ currentStep: step })
    }
  },

  togglePlay: () => {
    const { isPlaying, currentStep, totalSteps } = get()
    // If at end and pressing play, restart from beginning
    if (!isPlaying && currentStep >= totalSteps - 1) {
      set({ currentStep: 0, isPlaying: true })
    } else {
      set({ isPlaying: !isPlaying })
    }
  },

  setSpeed: (speed: number) => set({ speed }),

  reset: (totalSteps: number) => set({
    currentStep: 0,
    totalSteps,
    isPlaying: false,
  }),
}))
