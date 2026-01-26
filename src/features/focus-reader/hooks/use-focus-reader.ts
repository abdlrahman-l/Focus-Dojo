import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import {
  MIN_WORDS_FOR_SPEED_CHECK,
  MAX_CHAR_LIMIT,
} from '@/features/focus-reader/constants'
import { splitIntoSentences, calculateWPM } from '@/features/focus-reader/utils'
import { useTranslation } from 'react-i18next'

export function useFocusReader() {
  const { t } = useTranslation()
  const [rawText, setRawText] = useState(
    t('focusReaderFeature.sourceSelect.libraryItems.mental-fatigue.content')
  )
  const [currentArticleId, setCurrentArticleId] =
    useState<string | null>('mental-fatigue')
  const [activeIndex, setActiveIndex] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [isSpeedWarning, setIsSpeedWarning] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Scoring & Stats
  const [score, setScore] = useState(100)
  const [skimmingCount, setSkimmingCount] = useState(0)
  const [isResultOpen, setIsResultOpen] = useState(false)
  const [finalWpm, setFinalWpm] = useState(0)

  // Track the timestamp of the *start* of the current sentence reading
  const lastAdvanceTimeRef = useRef<number>(Date.now())
  const activeSentenceRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Session Stats Refs
  const totalWordsReadRef = useRef(0)
  const sessionStartTimeRef = useRef(0)

  const sentences = useMemo(() => splitIntoSentences(rawText), [rawText])
  const totalSentences = sentences.length
  const progress = ((activeIndex + 1) / totalSentences) * 100

  // Scroll active sentence into view
  useEffect(() => {
    if (activeSentenceRef.current) {
      activeSentenceRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [activeIndex])

  const handleAdvance = useCallback(() => {
    if (activeIndex >= totalSentences - 1) {
      // Session Complete
      const sessionDurationMinutes =
        (Date.now() - sessionStartTimeRef.current) / 60000
      // Prevent division by zero
      const validDuration =
        sessionDurationMinutes > 0 ? sessionDurationMinutes : 0.1
      const avgWpm = Math.round(totalWordsReadRef.current / validDuration)

      setFinalWpm(avgWpm)
      setIsResultOpen(true)
      return
    }

    const now = Date.now()
    const currentSentence = sentences[activeIndex]
    const wordCount = currentSentence.split(/\s+/).length

    // Speed Trap Logic
    // We only check if it's not the very first action (give them a buffer)
    if (activeIndex > 0 && wordCount >= MIN_WORDS_FOR_SPEED_CHECK) {
      const currentWpm = calculateWPM(
        wordCount,
        lastAdvanceTimeRef.current,
        now
      )

      // SPEED TRAP: Anti-Skimming (> 650 WPM)
      // If reading inhumanly fast, assume skimming.
      // 650 is a reasonable upper bound for deep reading comprehension.
      if (currentWpm > 650) {
        setIsSpeedWarning(true)
        setScore((prev) => Math.max(0, prev - 10))
        setSkimmingCount((prev) => prev + 1)
        
        toast.warning(t('focusReaderFeature.speedWarning'), {
          className: 'bg-red-500 text-white border-none',
          duration: 2000,
        })
        
        // Shake effect reset after animation
        setTimeout(() => setIsSpeedWarning(false), 500)
        
        // Do NOT advance totalWordsRead (skimming is not reading)
        // We still advance the text index to let them continue, but with penalty.
      } else {
        // Valid reading speed
        setWpm(currentWpm)
        totalWordsReadRef.current += wordCount
      }
    } else {
      // Add words for small sentences too, just skip speed check
      totalWordsReadRef.current += wordCount
    }

    // Advance
    setActiveIndex((prev) => prev + 1)
    lastAdvanceTimeRef.current = now
    setIsSpeedWarning(false)
  }, [activeIndex, totalSentences, sentences, t])

  const handleCreateSession = (text: string, id: string = 'custom') => {
    if (text.length > MAX_CHAR_LIMIT) {
      toast.error(
        t('focusReaderFeature.charLimitError', {
          limit: MAX_CHAR_LIMIT.toLocaleString(),
        })
      )
      return
    }
    if (text.trim().length === 0) {
      toast.error(t('focusReaderFeature.emptyTextError'))
      return
    }

    setRawText(text)
    setCurrentArticleId(id)
    
    // Reset Everything
    setActiveIndex(0)
    setWpm(0)
    setScore(100)
    setSkimmingCount(0)
    totalWordsReadRef.current = 0
    setIsResultOpen(false)
    
    const now = Date.now()
    lastAdvanceTimeRef.current = now
    sessionStartTimeRef.current = now
    
    setIsDrawerOpen(false)
    toast.success(t('focusReaderFeature.sessionInitialized'))
  }

  const resetSession = () => {
    setActiveIndex(0)
    setWpm(0)
    setScore(100)
    setSkimmingCount(0)
    totalWordsReadRef.current = 0
    setIsResultOpen(false)
    
    const now = Date.now()
    lastAdvanceTimeRef.current = now
    sessionStartTimeRef.current = now
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // If any modal/drawer is open, disable space/arrows
      if (isDrawerOpen || isResultOpen) return

      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault()
        handleAdvance()
      } else if (e.code === 'ArrowLeft') {
        // Backtracking optional logic?
        // For strict focus reader, backtracking might technically break flow,
        // but for usability we keep it. 
        // NOTE: We don't rollback totalWordsRead/Score on backtrack to keep it simple 
        // and avoid gaming the system.
        if (activeIndex > 0) {
          setActiveIndex((prev) => prev - 1)
          lastAdvanceTimeRef.current = Date.now() // Reset timer
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleAdvance, isDrawerOpen, isResultOpen, activeIndex])

  return {
    rawText,
    currentArticleId,
    activeIndex,
    wpm,
    isSpeedWarning,
    isDrawerOpen,
    sentences,
    totalSentences,
    progress,
    activeSentenceRef,
    containerRef,
    setIsDrawerOpen,
    handleAdvance,
    startSession: handleCreateSession,
    // Results
    score,
    skimmingCount,
    isResultOpen,
    finalWpm,
    resetSession,
  }
}

