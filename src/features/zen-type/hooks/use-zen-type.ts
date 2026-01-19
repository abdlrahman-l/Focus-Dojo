import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useScoreStore } from '@/stores/score-store'

export function useZenType() {
  const { t, i18n } = useTranslation()

  // State
  const [targetSentence, setTargetSentence] = useState('')
  const [input, setInput] = useState('')
  const [totalKeystrokes, setTotalKeystrokes] = useState(0)
  const [isError, setIsError] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  // Store
  const { addAttempt } = useScoreStore()

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleReroll = useCallback(() => {
    const quotes = t('vocalGymFeature.zenQuotes', {
      returnObjects: true,
    }) as string[]
    // Fallback if quotes is not an array (e.g. key missing or waiting for load)
    if (!Array.isArray(quotes)) return

    const randomIndex = Math.floor(Math.random() * quotes.length)
    setTargetSentence(quotes[randomIndex])
    setInput('')
    setTotalKeystrokes(0)
    setIsError(false)
    setScore(null)
    // Small timeout to ensure focus after state updates
    setTimeout(() => inputRef.current?.focus(), 10)
  }, [t])

  // Initialize & Language Change
  useEffect(() => {
    handleReroll()
  }, [i18n.language, handleReroll])

  // Focus management
  useEffect(() => {
    if (score === null) {
      inputRef.current?.focus()
    }
  }, [targetSentence, score, input])

  const triggerError = useCallback(() => {
    setIsError(true)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(200)
    }
    setInput('')

    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)
    errorTimeoutRef.current = setTimeout(() => setIsError(false), 300)
  }, [])

  const handleComplete = useCallback(
    (finalKeystrokes: number) => {
      const calculatedScore = Math.round(
        (targetSentence.length / finalKeystrokes) * 100
      )
      const finalScore = Math.min(100, Math.max(0, calculatedScore))
      setScore(finalScore)
    },
    [targetSentence]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        e.preventDefault()
        triggerError()
        setTotalKeystrokes((prev) => prev + 1)
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        handleReroll()
      }
    },
    [handleReroll, triggerError]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setTotalKeystrokes((prev) => prev + 1)

      if (targetSentence.startsWith(newValue)) {
        setInput(newValue)
        if (newValue === targetSentence) {
          handleComplete(totalKeystrokes + 1)
        }
      } else {
        triggerError()
      }
    },
    [targetSentence, totalKeystrokes, handleComplete, triggerError]
  )

  const handleNextProtocol = useCallback(() => {
    if (score !== null) addAttempt('zenType', score)
    handleReroll()
  }, [score, addAttempt, handleReroll])

  const handleRetry = useCallback(() => {
    setInput('')
    setTotalKeystrokes(0)
    setIsError(false)
    setScore(null)
  }, [])

  return {
    targetSentence,
    input,
    totalKeystrokes,
    isError,
    score,
    setScore,
    inputRef,
    handleReroll,
    handleChange,
    handleKeyDown,
    handleNextProtocol,
    handleRetry,
  }
}
