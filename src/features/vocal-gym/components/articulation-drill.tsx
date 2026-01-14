import { Link } from '@tanstack/react-router'
import { ArrowLeft, Mic, RefreshCcw, ArrowRight, RotateCcw, AudioLines } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn, filterDrill } from '@/lib/utils'
import { LanguageSelector } from '@/features/components/language-selector'
import { useArticulationDrill } from '@/features/vocal-gym/hooks/use-articulation-drill'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'

interface TranscriptHighlighterProps {
  transcript: string
  targetDrill: string[]
  correctClass: string
  incorrectClass: string
}

const TranscriptHighlighter = ({
  transcript,
  targetDrill,
  correctClass,
  incorrectClass,
}: TranscriptHighlighterProps) => {
  return (
    <>
      {filterDrill(transcript).map((word, index) => {
        const targetWord = targetDrill[index]
        const isCorrect = targetWord === word
        return (
          <span
            className={cn(isCorrect ? correctClass : incorrectClass)}
            key={index}
          >
            {word}{' '}
          </span>
        )
      })}
    </>
  )
}

export function ArticulationDrill() {
  const { t } = useTranslation()
  
  const {
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
  } = useArticulationDrill()

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
            <TranscriptHighlighter
              transcript={transcript}
              targetDrill={currentDrillFiltered}
              correctClass="font-serif text-primary"
              incorrectClass="font-serif text-red-500"
            />
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

      {/* Score Drawer */}
      <Drawer open={score !== null} onOpenChange={(open) => !open && setScore(null)}>
        <DrawerContent className="bg-zinc-950 border-zinc-900 border-t-0 ring-0 outline-none text-white">
          <DrawerHeader className="text-center pt-8 pb-4">
             <DrawerTitle className="text-6xl font-bold text-emerald-400 mb-2 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
               {score}%
             </DrawerTitle>
             <p className="text-emerald-500/80 text-xs font-bold tracking-[0.2em] uppercase">
               {t('vocalGymFeature.precisionAcquired')}
             </p>
          </DrawerHeader>

          <div className="px-6 py-4 flex flex-col gap-6">
             <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center gap-3">
                   <AudioLines className='size-4 text-primary' />
                   <h3 className="text-xs text-zinc-500 tracking-widest uppercase">{t('vocalGymFeature.transcriptAnalysis')}</h3>
                </div>
                <Separator className='my-4 bg-gray-800' />

                <div className="mb-6">
                   <h4 className="text-[10px] font-bold text-zinc-600 uppercase mb-2">{t('vocalGymFeature.target')}</h4>
                   <p className="font-serif text-xl text-zinc-300 italic">"{currentPhrase}"</p>
                </div>

                <div>
                   <h4 className="text-[10px] font-bold text-zinc-600 uppercase mb-2">{t('vocalGymFeature.input')}</h4>
                   <div className="font-mono text-sm leading-relaxed">
                      <TranscriptHighlighter
                        transcript={transcript}
                        targetDrill={currentDrillFiltered}
                        correctClass="text-yellow-400"
                        incorrectClass="font-mono text-yellow-400 underline decoration-red-500 decoration-wavy underline-offset-4"
                      />
                   </div>
                </div>
             </div>
          </div>


          <DrawerFooter className="px-6 pb-8 pt-2 grid grid-cols-2 gap-4">
             <button
               onClick={handleRetry}
               className="group flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-transparent py-4 text-xs font-bold tracking-widest text-zinc-300 uppercase transition-all hover:bg-zinc-900 active:scale-95"
             >
               <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-90" />
               {t('vocalGymFeature.retryOper')}
             </button>
             <button
               onClick={handleRandomSentence}
               className="group flex items-center justify-center gap-2 rounded-full bg-emerald-400 py-4 text-xs font-bold tracking-widest text-emerald-950 uppercase transition-all hover:bg-emerald-300 active:scale-95 shadow-[0_0_20px_-5px_var(--color-emerald-500)]"
             >
               {t('vocalGymFeature.nextProtocol')}
               <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
             </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
