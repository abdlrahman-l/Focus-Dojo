import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import {
  MIN_WORDS_FOR_SPEED_CHECK,
  MAX_CHAR_LIMIT,
} from '@/features/focus-reader/constants'
import { splitIntoSentences, calculateWPM } from '@/features/focus-reader/utils'
import { useTranslation } from 'react-i18next'
import { useScoreStore } from '@/stores/score-store'

export function useFocusReader() {
  const { t } = useTranslation()
  const { addAttempt } = useScoreStore()
  const [rawText, setRawText] = useState(
    t('focusReaderFeature.sourceSelect.libraryItems.mental-fatigue.content')
  )
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(
    'mental-fatigue'
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [isSpeedWarning, setIsSpeedWarning] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Scoring & Stats
  const [score, setScore] = useState(100)
  const [skimmingCount, setSkimmingCount] = useState(0)
  const [distractionCount, setDistractionCount] = useState(0) // Added Distraction State
  const [isResultOpen, setIsResultOpen] = useState(false)
  const [finalWpm, setFinalWpm] = useState(0)

  // Refs
  const lastAdvanceTimeRef = useRef<number>(Date.now())
  const activeSentenceRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const totalWordsReadRef = useRef(0)
  // Fix: Init dengan Date.now() biar gak NaN/Infinity kalau langsung finish
  const sessionStartTimeRef = useRef(Date.now())

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
    // 1. Capture Data Kalimat SAAT INI (sebelum pindah index)
    const now = Date.now()
    const timeElapsed = now - lastAdvanceTimeRef.current
    const currentSentence = sentences[activeIndex]
    
    // Safety check kalau array kosong/error
    if (!currentSentence) return

    const wordCount = currentSentence.split(/\s+/).length

    // Local mutable score for immediate sync
    let currentScore = score

    // --- SCORING LOGIC START ---
    
    // A. Check Drifting (Bengong > 20 detik)
    // Cek hanya jika bukan kalimat pertama (kasih user waktu nafas di awal)
    if (activeIndex > 0 && timeElapsed > 20000) {
      currentScore = Math.max(0, currentScore - 5)
      setScore(currentScore)
      setDistractionCount((prev) => prev + 1)
      // Optional: Toast notif kalo mau
      toast.warning(t('focusReaderFeature.driftWarning'), {
        description: t('focusReaderFeature.driftWarningDesc'),
      })
    }

    // B. Check Skimming (Ngebut > 650 WPM)
    let isSkimming = false
    if (activeIndex > 0 && wordCount >= MIN_WORDS_FOR_SPEED_CHECK) {
      const currentWpm = calculateWPM(wordCount, lastAdvanceTimeRef.current, now)
      
      if (currentWpm > 650) {
        isSkimming = true
        setIsSpeedWarning(true)
        
        currentScore = Math.max(0, currentScore - 10)
        setScore(currentScore)
        
        setSkimmingCount((prev) => prev + 1)
        
        toast.warning(t('focusReaderFeature.speedWarning'), {
          className: 'bg-red-500 text-white border-none',
          duration: 2000,
        })
        
        setTimeout(() => setIsSpeedWarning(false), 500)
      } else {
        setWpm(currentWpm)
      }
    }

    // C. Update Total Words
    // Kalau skimming, kata-katanya JANGAN dihitung sebagai "Words Read" (biar WPM avg jujur)
    if (!isSkimming) {
      totalWordsReadRef.current += wordCount
    }
    // --- SCORING LOGIC END ---


    // 2. Check Finish Condition
    // Cek apakah ini kalimat terakhir?
    if (activeIndex >= totalSentences - 1) {
      const sessionDurationMinutes = (Date.now() - sessionStartTimeRef.current) / 60000
      const validDuration = sessionDurationMinutes > 0 ? sessionDurationMinutes : 0.01 // Prevent /0
      
      const avgWpm = Math.round(totalWordsReadRef.current / validDuration)

      // Save to Store using the locally updated score
      addAttempt('focusReader', currentScore)

      setFinalWpm(avgWpm)
      setIsResultOpen(true)
      return
    }

    // 3. Advance to Next
    setActiveIndex((prev) => prev + 1)
    lastAdvanceTimeRef.current = now
    setIsSpeedWarning(false) // Reset warning visual state
    
  }, [activeIndex, totalSentences, sentences, t, score, addAttempt])

  const handleCreateSession = (text: string, id: string = 'custom') => {
    if (text.length > MAX_CHAR_LIMIT) {
      toast.error(t('focusReaderFeature.charLimitError', { limit: MAX_CHAR_LIMIT }))
      return
    }
    if (text.trim().length === 0) {
      toast.error(t('focusReaderFeature.emptyTextError'))
      return
    }

    setRawText(text)
    setCurrentArticleId(id)
    resetSession()
    setIsDrawerOpen(false)
    toast.success(t('focusReaderFeature.sessionInitialized'))
  }

  const resetSession = () => {
    setActiveIndex(0)
    setWpm(0)
    setScore(100)
    setSkimmingCount(0)
    setDistractionCount(0) // Reset distraction
    totalWordsReadRef.current = 0
    setIsResultOpen(false)
    
    // Reset Timer AGAR sinkron dengan mulai baca
    const now = Date.now()
    lastAdvanceTimeRef.current = now
    sessionStartTimeRef.current = now
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDrawerOpen || isResultOpen) return

      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault()
        handleAdvance()
      } else if (e.code === 'ArrowLeft') {
        if (activeIndex > 0) {
          // Note: Backtracking tidak mengembalikan Score/WordsRead 
          // untuk simplifikasi & mencegah user farming score bolak balik.
          setActiveIndex((prev) => prev - 1)
          lastAdvanceTimeRef.current = Date.now() // Reset timer biar pas balik kanan gak kena Skimming
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
    distractionCount, // Exported
    isResultOpen,
    finalWpm,
    resetSession,
  }
}
