import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Mic, RefreshCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { LanguageSelector } from '@/features/components/language-selector'

import { useScoreStore } from '@/stores/score-store'

// Add type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null
  onend: ((this: SpeechRecognition, ev: Event) => void) | null
  onerror: ((this: SpeechRecognition, ev: Event) => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition
    }
    webkitSpeechRecognition: {
      new (): SpeechRecognition
    }
  }
}

const filterDrill = (drill: string) =>
  drill
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .split(/\s+/)
    .filter(Boolean)

export function ArticulationDrill() {
  const { t, i18n } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0)
  const [visualizerBars, setVisualizerBars] = useState<number[]>([])
  const [score, setScore] = useState<number | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  const handleRandomSentence = useCallback(() => {
    if (Array.isArray(drills) && drills.length > 0) {
      const randomIndex = Math.floor(Math.random() * drills.length)
      setCurrentDrillIndex(randomIndex)
      setTranscript('') // Clear transcript on new sentence
      setScore(null) // Reset score
    }
  }, [drills])

  const currentDrillFiltered = useMemo(
    () => filterDrill(currentPhrase),
    [currentPhrase]
  )

  // Initialize visualizer bars
  useEffect(() => {
    const bars = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 40) + 10
    )
    setVisualizerBars(bars)
    checkDailyReset()
  }, [checkDailyReset])

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true

      // Initial language setup
      const langMap: Record<string, string> = {
        en: 'en-US',
        id: 'id-ID',
      }
      recognition.lang = langMap[i18n.language] || 'en-US'

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        // Reset silence timer on every result (voice detected)
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }

        const finalTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('')
        setTranscript(finalTranscript)

        // Set new timer: if no voice for 1.5s, stop listening
        silenceTimerRef.current = setTimeout(() => {
          recognition.stop()
          setIsListening(false)
        }, 1500)
      }

      recognition.onend = () => {
        setIsListening(false)
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    }
  }, [i18n.language])

  // Cleanup effect
  useEffect(() => {
    return () => {
       if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
       }
    }
  }, [])

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

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    } else {
      setTranscript('') // Clear previous transcript
      setScore(null) // Reset score
      recognitionRef.current.start()
      setIsListening(true)
    }
  }, [isListening])

  return (
    <div className='text-foreground flex min-h-screen w-full flex-col items-center bg-black p-6 font-sans'>
      {/* 1. Header */}
      <header className='mb-8 flex w-full items-center justify-between'>
        <Link
          to='/'
          className='text-muted-foreground hover:bg-card hover:text-foreground rounded-full p-2 transition-colors'
        >
          <ArrowLeft className='h-6 w-6' />
        </Link>
        <h1 className='text-xs font-bold tracking-widest text-white uppercase'>
          {t('vocalGymFeature.articulationDrill')}
        </h1>
        <div className='flex items-center'>
          <LanguageSelector />
        </div>
      </header>

      {/* 2. Prompt Card */}
      <div className='flex aspect-square w-full max-w-sm flex-col items-center justify-center rounded-4xl bg-neutral-800 p-8 text-center relative overflow-hidden'>
         {/* Score Overlay */}
        {score !== null && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10 animate-in fade-in zoom-in duration-300">
            Score: {score}%
          </div>
        )}

        <span className='text-primary mb-6 text-xs font-bold tracking-widest'>
          {t('vocalGymFeature.readAloud')}
        </span>
        <p className='mb-8 font-serif text-3xl leading-tight text-white'>
          {currentPhrase}
        </p>

        <button
          onClick={handleRandomSentence}
          className='flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold tracking-wider text-zinc-300 uppercase transition-colors hover:bg-zinc-700 hover:text-white'
        >
          <RefreshCcw className='h-3 w-3' />
          {t('vocalGymFeature.changeSentence')}
        </button>
      </div>

      {/* 3. Audio Visualizer (Mock - Simulated) */}
      <div className='mt-12 flex h-16 items-center justify-center gap-1'>
        {visualizerBars.map((height, index) => (
          <div
            key={index}
            className={cn(
              'bg-primary w-1.5 rounded-full transition-all duration-300',
              isListening ? 'animate-pulse' : 'opacity-30'
            )}
            style={{
              height: isListening ? `${height}px` : '10px',
              animationDelay: `${index * 0.05}s`,
            }}
          />
        ))}
      </div>

      {/* 4. Live Transcript */}
      <div className='mt-4 mb-auto min-h-7 text-center font-mono text-lg tracking-wide'>
        {!transcript &&
          (isListening ? (
            <span className='animate-pulse'>
              {t('vocalGymFeature.listening')}
            </span>
          ) : (
            t('vocalGymFeature.pressMic')
          ))}
        {transcript && (
          <p>
            {filterDrill(transcript).map((word, index) => {
              const targetWord = currentDrillFiltered[index];
              // Simple check: green if matches target at that position, red otherwise
              // Note: This simple index matching might fail if user skips words.
              // For better highlighting we might need diffing logic, but simple match is ok for now.
              const isCorrect = targetWord === word
              return (
                <span
                  className={cn('font-serif', isCorrect ? 'text-primary' : 'text-red-500')}
                  key={index}
                >
                  {word}{' '}
                </span>
              )
            })}
          </p>
        )}
        {isListening && transcript && <span className='animate-pulse'>_</span>}
      </div>

      {/* 5. Microphone Trigger */}
      <div className='mt-8 flex flex-col items-center pb-8'>
        <button
          onClick={toggleListening}
          className={cn(
            'flex h-20 w-20 items-center justify-center rounded-full shadow-[0_0_30px_-5px_var(--color-primary)] transition-all duration-300',
            isListening
              ? 'bg-destructive hover:bg-destructive/90 shadow-[0_0_30px_-5px_var(--color-destructive)]'
              : 'bg-primary hover:bg-primary/90 shadow-[0_0_30px_-5px_var(--color-primary)]'
          )}
        >
          <Mic
            className={cn(
              'h-8 w-8',
              isListening ? 'text-primary-foreground' : 'text-background'
            )}
          />
        </button>
        <span className='text-muted-foreground mt-6 text-sm'>
          {isListening
            ? t('vocalGymFeature.listening')
            : t('vocalGymFeature.speakClearly')}
        </span>
      </div>
    </div>
  )
}
