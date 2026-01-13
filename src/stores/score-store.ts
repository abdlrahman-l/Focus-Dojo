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
}

interface ScoreActions {
  addAttempt: (feature: 'focusReader' | 'vocalGym' | 'zenType', score: number) => void
  checkDailyReset: () => void
  getRecoveryScore: () => number
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
}

export const useScoreStore = create<ScoreStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      addAttempt: (feature, score) => {
        set((state) => {
          const newHistory = [...state.history[feature], score]
          const sum = newHistory.reduce((a, b) => a + b, 0)
          const newAverage = Math.round(sum / newHistory.length)

          return {
            history: {
              ...state.history,
              [feature]: newHistory,
            },
            scores: {
              ...state.scores,
              [feature]: newAverage,
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
