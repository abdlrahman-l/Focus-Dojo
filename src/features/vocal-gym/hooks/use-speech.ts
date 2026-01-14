import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

// Add type definitions for Web Speech API locally if not available globally
// We can reuse the types from articulation-drill.tsx or move them to a types file.
// For now, I'll inline them to make the hook self-contained or rely on global augmentation.

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

export function useSpeech() {
  const { i18n } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)

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

   // Cleanup effect for timer
   useEffect(() => {
    return () => {
       if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
       }
    }
  }, [])


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
      recognitionRef.current.start()
      setIsListening(true)
    }
  }, [isListening])
  
  const resetTranscript = useCallback(() => {
      setTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    toggleListening,
    resetTranscript
  }
}
