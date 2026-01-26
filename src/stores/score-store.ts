import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ScoreState {
  scores: {
    focusReader: number
    vocalGym: number
    zenType: number
  }
  history: {
    focusReader: number[]
    vocalGym: number[]
    zenType: number[]
  }
  lastActiveDate: string
  initialAttempt: boolean
}

interface ScoreActions {
  addAttempt: (
    feature: 'focusReader' | 'vocalGym' | 'zenType',
    score: number
  ) => void
  checkDailyReset: () => void
  getRecoveryScore: () => number
  setInitialAttempt: (value: boolean) => void
}

type ScoreStore = ScoreState & ScoreActions

const INITIAL_STATE: ScoreState = {
  scores: {
    focusReader: 0,
    vocalGym: 0,
    zenType: 0,
  },
  history: {
    focusReader: [],
    vocalGym: [],
    zenType: [],
  },
  lastActiveDate: new Date().toISOString().split('T')[0],
  initialAttempt: false,
}

export const useScoreStore = create<ScoreStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      addAttempt: (feature, score) => {
        set((state) => {
          // 1. Masukin score baru ke history
          const rawHistory = [...state.history[feature], score]

          // 2. Ambil cuma 5 terakhir (The Rolling Window)
          // Kalau history masih dikit (misal cuma 3), ya ambil semua.
          const relevantHistory = rawHistory.slice(-5)

          // 3. Hitung Rata-rata dari 5 terakhir itu
          const sum = relevantHistory.reduce((a, b) => a + b, 0)
          const newRollingAverage = Math.round(sum / relevantHistory.length)

          return {
            history: {
              ...state.history,
              [feature]: rawHistory, // History asli tetep simpen semua buat grafik (opsional)
            },
            scores: {
              ...state.scores,
              [feature]: newRollingAverage, // Skor utama pake Rolling Average
            },
          }
        })
      },

      checkDailyReset: () => {
        const today = new Date().toISOString().split('T')[0]
        const { lastActiveDate, scores } = get()

        if (lastActiveDate !== today) {
          // It's a new day
          // Apply decay factor (0.8) to current scores
          const decayedScores = {
            focusReader: Math.round(scores.focusReader * 0.8),
            vocalGym: Math.round(scores.vocalGym * 0.8),
            zenType: Math.round(scores.zenType * 0.8),
          }

          set({
            scores: decayedScores,
            // Clear history for the new day to start fresh
            history: {
              focusReader: [],
              vocalGym: [],
              zenType: [],
            },
            lastActiveDate: today,
          })
        }
      },

      getRecoveryScore: () => {
        const { scores } = get()
        // Formula: (focusReader * 0.4) + (vocalGym * 0.3) + (zenType * 0.3)
        const weightedScore =
          scores.focusReader * 0.4 +
          scores.vocalGym * 0.3 +
          scores.zenType * 0.3

        return Math.round(weightedScore)
      },
      setInitialAttempt: (value: boolean) => {
        set({ initialAttempt: value })
      },
    }),
    {
      name: 'focus-dojo-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

/*
 * Example Usage:
 *
 * import { useScoreStore } from '@/store/score-store'
 *
 * function MyComponent() {
 *   const { addAttempt, checkDailyReset, getRecoveryScore, scores } = useScoreStore()
 *
 *   const recoveryScore = getRecoveryScore() // Derived value
 *
 *   useEffect(() => {
 *     checkDailyReset()
 *   }, [])
 *
 *   const handleComplete = (score: number) => {
 *     addAttempt('vocalGym', score)
 *   }
 *
 *   return <div>Score: {scores.vocalGym}</div>
 * }
 */
