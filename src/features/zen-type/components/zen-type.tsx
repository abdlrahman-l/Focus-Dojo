import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  BanIcon,
  DeleteIcon,
  KeyboardIcon,
  RefreshCcw,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { ScoreDrawer } from '@/components/score-drawer'
import { LanguageSelector } from '@/features/components/language-selector'
import { useZenType } from '@/features/zen-type/hooks/use-zen-type'

export function ZenType() {
  const { t } = useTranslation()

  const {
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
  } = useZenType()

  return (
    <div className='text-foreground flex min-h-screen w-full flex-col items-center bg-black p-6 font-sans'>
      {/* Header */}
      <header className='mb-8 flex w-full items-center justify-between'>
        <Link
          to='/'
          className='text-muted-foreground hover:bg-card hover:text-foreground rounded-full p-2 transition-colors'
        >
          <ArrowLeft className='h-6 w-6' />
        </Link>
        <h1 className='text-xs font-bold tracking-widest text-white uppercase'>
          {t('vocalGymFeature.zenType')}
        </h1>
        <div className='flex items-center'>
          <LanguageSelector />
        </div>
      </header>
      {/* Main Content */}
      <main className='relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-20'>
        {/* Background Glow */}
        <div className='pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#10b77f]/5 blur-[80px]'></div>

        {/* Quote Display */}
        <div className='flex flex-col justify-end pb-8'>
          <div className='relative z-10 flex flex-col items-center'>
            <h2 className='mb-6 text-center font-serif text-[26px] leading-[1.4] font-medium tracking-wide text-white/95 drop-shadow-sm select-none'>
              {targetSentence}
            </h2>
            <button
              onClick={handleReroll}
              className='flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold tracking-wider text-zinc-300 uppercase transition-colors hover:bg-zinc-700 hover:text-white'
            >
              <RefreshCcw className='h-3 w-3' />
              {t('vocalGymFeature.changeSentence')}
            </button>
          </div>
        </div>

        {/* Typing Terminal */}
        <div className='relative z-10 w-full pb-6'>
          {/* Visual Terminal Container */}
          <div
            className={cn(
              'group relative rounded-xl border border-[#10b77f]/40 bg-[#1c1c1f] shadow-[0_0_15px_-3px_rgba(16,183,127,0.3)] transition-all duration-300',
              isError &&
                'animate-shake border-red-500/50 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]'
            )}
          >
            {/* Traffic Lights */}
            <div className='pointer-events-none absolute top-0 right-0 left-0 flex h-6 items-center gap-1.5 rounded-t-xl border-b border-white/5 bg-white/5 px-3'>
              <div className='size-2 rounded-full bg-red-500/20'></div>
              <div className='size-2 rounded-full bg-yellow-500/20'></div>
              <div className='size-2 rounded-full bg-green-500/20'></div>
            </div>

            {/* Input Area */}
            <div
              className='relative min-h-[100px] w-full cursor-text px-4 pt-10 pb-4 font-mono text-lg leading-relaxed tracking-tight wrap-break-word text-gray-400'
              onClick={() => inputRef.current?.focus()}
            >
              {/* Hidden Real Input */}
              <input
                ref={inputRef}
                type='text'
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className='absolute inset-0 z-20 h-full w-full cursor-text opacity-0'
                autoFocus
                autoComplete='off'
                autoCorrect='off'
                spellCheck='false'
              />

              {/* Visible Text Rendering */}
              <span className='pointer-events-none relative z-10 text-[#10b77f] select-none text-shadow-sm'>
                {input}
              </span>

              {/* Blinking Block Cursor */}
              {!score && (
                <span className='animate-blink relative z-10 ml-px inline-block h-[20px] w-[10px] bg-[#10b77f] align-middle shadow-[0_0_8px_rgba(16,183,127,0.8)]'></span>
              )}
            </div>
          </div>

          {/* Footer Warning */}
          <div className='mt-4 flex items-center justify-center gap-2 opacity-80'>
            <span
              className={cn(
                'flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase transition-colors duration-300',
                isError ? 'text-red-400' : 'text-red-400/80'
              )}
            >
              {isError ? (
                <BanIcon className='size-5' />
              ) : (
                <DeleteIcon className='size-5' />
              )}
              {isError
                ? t('vocalGymFeature.precisionFailure')
                : t('vocalGymFeature.backspaceDisabled')}
            </span>
          </div>
        </div>
      </main>
      {/* Result Drawer */}
      <ScoreDrawer
        open={score !== null}
        onOpenChange={(open) => !open && setScore(null)}
        score={score}
        title={t('vocalGymFeature.efficiencyRating')}
        onRetry={handleRetry}
        onNext={handleNextProtocol}
        retryLabel={t('vocalGymFeature.retryOper')}
        nextLabel={t('vocalGymFeature.nextProtocol')}
        // Default styling matches ZenType, so no overrides needed for colors unless we want to be explicit
        // The default colors in ScoreDrawer are #10b77f which matches ZenQuotes.
      >
        <div className='flex flex-col gap-6 px-6 py-4'>
          <div className='rounded-2xl border border-zinc-800 bg-[#27272a]/50 p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <KeyboardIcon className='text-primary size-5' />
                <h3 className='text-xs tracking-widest text-zinc-500 uppercase'>
                  {t('vocalGymFeature.keystrokes')}
                </h3>
              </div>
              <span className='font-mono text-zinc-300'>
                {totalKeystrokes} <span className='text-zinc-600'>/</span>{' '}
                {targetSentence.length}
              </span>
            </div>
            <Separator className='mb-4 bg-zinc-800' />
            <div className='text-center'>
              <p className='font-serif text-lg leading-relaxed text-zinc-400 italic'>
                "{targetSentence}"
              </p>
            </div>
          </div>
        </div>
      </ScoreDrawer>
    </div>
  )
}
