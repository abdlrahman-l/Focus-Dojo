import { Gauge, Settings2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SourceSelectDrawer } from '@/features/focus-reader/components/source-select-drawer'
import { useFocusReader } from '@/features/focus-reader/hooks/use-focus-reader'

export function FocusReader() {
  const { t } = useTranslation()
  const {
    currentArticleId,
    activeIndex,
    wpm,
    isSpeedWarning,
    isDrawerOpen,
    sentences,
    progress,
    activeSentenceRef,
    containerRef,
    setIsDrawerOpen,
    handleAdvance,
    startSession,
  } = useFocusReader()

  return (
    <div
      className='bg-background-dark font-display group relative flex min-h-screen w-full flex-col overflow-hidden select-none'
      onClick={(e) => {
        // Allow clicking anywhere to advance, unless clicking inside drawer/interactive elements
        if (
          isDrawerOpen ||
          (e.target as HTMLElement).closest('button') ||
          (e.target as HTMLElement).closest('[data-radix-collection-item]')
        ) {
          return
        }
        handleAdvance()
      }}
    >
      {/* 1. Progress Bar */}
      <div className='fixed top-0 left-0 z-50 w-full'>
        <div className='h-[2px] w-full bg-white/5'>
          <div
            className='bg-primary relative h-full transition-all duration-300 ease-out'
            style={{
              width: progress + '%',
              boxShadow: '0 0 10px #13eca4, 0 0 20px rgba(19, 236, 164, 0.5)',
            }}
          >
            <div className='absolute top-1/2 right-0 h-1 w-1 -translate-y-1/2 rounded-full bg-white shadow-[0_0_5px_#fff]' />
          </div>
        </div>
      </div>

      {/* 2. Main Reading Area */}
      <div
        ref={containerRef}
        className={cn(
          'relative mx-auto flex min-h-screen w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-[40vh] transition-transform duration-200 md:px-8',
          isSpeedWarning && 'animate-shake text-red-400' // Visual penalty
        )}
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
        }}
      >
        <div className='flex w-full flex-col items-center gap-8'>
          {sentences.map((sentence, index) => {
            const isActive = index === activeIndex

            return (
              <p
                key={index}
                ref={isActive ? activeSentenceRef : null}
                className={cn(
                  'max-w-prose text-center transition-all duration-700 ease-in-out',
                  isActive
                    ? 'blur-0 z-10 scale-105 text-[22px] leading-[1.6] font-semibold tracking-normal text-white opacity-100 md:text-[26px]'
                    : 'z-0 scale-100 text-xl leading-relaxed font-normal tracking-tight text-zinc-500 opacity-20 blur-[4px] select-none md:text-2xl'
                )}
                style={
                  isActive
                    ? {
                        textShadow:
                          '0 0 15px rgba(255, 255, 255, 0.3), 0 0 30px rgba(19, 236, 164, 0.1)',
                      }
                    : {}
                }
              >
                {sentence}
              </p>
            )
          })}
        </div>
      </div>

      {/* 3. Footer / Controls */}
      <div className='pointer-events-none fixed bottom-0 left-0 z-40 flex w-full items-end justify-between bg-gradient-to-t from-black via-black/80 to-transparent px-6 pt-12 pb-6'>
        {/* Settings / Input Trigger */}
        <div className='pointer-events-auto'>
          <Button
            variant='ghost'
            size='icon'
            className='text-white/30 hover:bg-white/10 hover:text-white'
            onClick={() => setIsDrawerOpen(true)}
          >
            <Settings2 className='h-5 w-5' />
          </Button>

          <SourceSelectDrawer
            isOpen={isDrawerOpen}
            currentArticleId={currentArticleId}
            onClose={() => setIsDrawerOpen(false)}
            onSelectPreset={(articleId) => {
              const text = t(
                'focusReaderFeature.sourceSelect.libraryItems.' +
                  articleId +
                  '.content'
              )
              if (text) startSession(text, articleId)
            }}
            onPasteSubmit={(text) => startSession(text, 'custom')}
          />
        </div>

        {/* Instructions */}
        <div className='flex-1 pb-2 text-center'>
          {activeIndex === 0 && (
            <p className='animate-pulse text-[10px] font-medium tracking-[0.2em] text-white/20 uppercase md:text-xs'>
              {t('focusReaderFeature.tapToStart')}
            </p>
          )}
        </div>

        {/* WPM Indicator */}
        <div className='flex w-20 items-center justify-end gap-1.5 pb-2'>
          <Gauge className='h-3.5 w-3.5 text-white/30' />
          <p className='font-mono text-[10px] text-white/30 tabular-nums md:text-xs'>
            {wpm > 0 ? wpm + ' WPM' : '--'}
          </p>
        </div>
      </div>

      {/* Background Ambience */}
      <div className='relative'>
        <div className='fixed inset-0 -z-50 bg-black' />
        <div className='pointer-events-none fixed top-0 left-0 z-30 h-32 w-full from-black to-transparent' />
      </div>
    </div>
  )
}
