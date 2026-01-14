import { useState, useMemo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useScoreStore } from '@/stores/score-store'
import { filterDrill } from '@/lib/utils'
import { useSpeech } from './use-speech'

export function useArticulationDrill() {
  const { t } = useTranslation()
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0)
  const [score, setScore] = useState<number | null>(null)
  const [visualizerBars, setVisualizerBars] = useState<number[]>([])
  
  const { isListening, transcript, toggleListening, resetTranscript } = useSpeech()
  const { addAttempt, checkDailyReset } = useScoreStore()

  const drills = useMemo(
    () => t('vocalGymFeature.drills', { returnObjects: true }) as string[],
    [t]
  )
  
  const currentPhrase = useMemo(() => {
    return Array.isArray(drills) && drills[currentDrillIndex]
      ? drills[currentDrillIndex]
      : t('vocalGymFeature.phrase')
  }, [drills, currentDrillIndex, t])

  const currentDrillFiltered = useMemo(
    () => filterDrill(currentPhrase),
    [currentPhrase]
  )

  const handleRandomSentence = useCallback(() => {
    if (Array.isArray(drills) && drills.length > 0) {
      const randomIndex = Math.floor(Math.random() * drills.length)
      setCurrentDrillIndex(randomIndex)
      resetTranscript()
      setScore(null)
    }
  }, [drills, resetTranscript])

  const handleRetry = useCallback(() => {
    resetTranscript()
    setScore(null)
  }, [resetTranscript])

  // Initialize visualizer bars & daily reset
  useEffect(() => {
    const bars = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 40) + 10
    )
    setVisualizerBars(bars)
    checkDailyReset()
  }, [checkDailyReset])

  // Calculate score when listening stops
  useEffect(() => {
    if (!isListening && transcript) {
      import('@/lib/scoring').then(({ calculateWordMatchScore }) => {
        const calculatedScore = calculateWordMatchScore(currentPhrase, transcript)
        setScore(calculatedScore)
        addAttempt('vocalGym', calculatedScore)
      })
    }
  }, [isListening, transcript, currentPhrase, addAttempt])

  return {
    isListening,
    transcript,
    toggleListening,
    score,
    setScore,
    currentPhrase,
    currentDrillFiltered,
    visualizerBars,
    handleRandomSentence,
    handleRetry
  }
}
