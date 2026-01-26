import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import {
  SPEED_LIMIT_WPM,
  MIN_WORDS_FOR_SPEED_CHECK,
  MAX_CHAR_LIMIT,
} from '@/features/focus-reader/constants'
import { splitIntoSentences, calculateWPM } from '@/features/focus-reader/utils'
import { useTranslation } from 'react-i18next'

export function useFocusReader() {
  const { t } = useTranslation()
  const [rawText, setRawText] = useState(t('focusReaderFeature.sourceSelect.libraryItems.mental-fatigue.content'))
  const [currentArticleId, setCurrentArticleId] = useState<string | null>('mental-fatigue')
  const [activeIndex, setActiveIndex] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [isSpeedWarning, setIsSpeedWarning] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Track the timestamp of the *start* of the current sentence reading
  const lastAdvanceTimeRef = useRef<number>(Date.now())
  const activeSentenceRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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
    if (activeIndex >= totalSentences - 1) return

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

      if (currentWpm > SPEED_LIMIT_WPM) {
        setIsSpeedWarning(true)
        toast.warning(t('focusReaderFeature.speedWarning'), {
          className: 'bg-red-500 text-white border-none',
          duration: 2000,
        })
        // Shake effect reset after animation
        setTimeout(() => setIsSpeedWarning(false), 500)
        return // PUNISHMENT: Do not advance
      }
      setWpm(currentWpm)
    }

    // Success - Advance
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
    setActiveIndex(0)
    setWpm(0)
    lastAdvanceTimeRef.current = Date.now()
    setIsDrawerOpen(false)
    toast.success(t('focusReaderFeature.sessionInitialized'))
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // If drawer is open, disable space/arrows to prevent background scrolling/action
      // But we must allow typing in the textarea inside the drawer (which is handled by browser focus)
      // However, since we are using a portal/drawer, we should block these global listeners if drawer is open.
      if (isDrawerOpen) return

      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault()
        handleAdvance()
      } else if (e.code === 'ArrowLeft') {
        if (activeIndex > 0) {
          setActiveIndex((prev) => prev - 1)
          lastAdvanceTimeRef.current = Date.now() // Reset timer
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleAdvance, isDrawerOpen, activeIndex])

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
  }
}
