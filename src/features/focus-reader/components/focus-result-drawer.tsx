import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ScoreDrawer } from '@/components/score-drawer'

interface FocusResultDrawerProps {
  isOpen: boolean
  score: number | null
  wpm: number
  skimmingCount: number
  distractionCount: number
  articleTitle: string
  onRetry: () => void
  onNext: () => void
}

export function FocusResultDrawer({
  isOpen,
  score,
  wpm,
  skimmingCount,
  articleTitle,
  onRetry,
  onNext,
}: FocusResultDrawerProps) {
  const { t } = useTranslation()

  return (
    <ScoreDrawer
      open={isOpen}
      onOpenChange={() => {}} // Controlled by parent usually, or we can assume it stays open until action
      score={score}
      title={t('focusReaderFeature.results.deepFocusIndex')}
      onRetry={onRetry}
      onNext={onNext}
      retryLabel={t('focusReaderFeature.results.retry')}
      nextLabel={t('focusReaderFeature.results.next')}
      scoreClassName='text-[#0bda95] drop-shadow-[0_0_15px_rgba(11,218,149,0.5)]'
      titleClassName='text-[#0bda95]/80'
      nextButtonClassName='bg-[#0bda95] text-[#10221c] font-display shadow-[0_0_10px_rgba(11,218,149,0.3)] hover:bg-[#34eeb0]'
    >
      {/* Glow Effects */}
      <div className='pointer-events-none absolute top-0 left-1/2 h-24 w-3/4 -translate-x-1/2 bg-[#0bda95]/10 blur-[50px]' />

      {/* Stats Card */}
      <div className='glass-panel relative mx-5 mb-8 overflow-hidden rounded-2xl border border-white/5 bg-white/3 p-5 backdrop-blur-md'>
        {/* Corner Accents */}
        <div className='absolute top-0 left-0 h-2 w-2 rounded-tl-lg border-t border-l border-[#0bda95]/30' />
        <div className='absolute top-0 right-0 h-2 w-2 rounded-tr-lg border-t border-r border-[#0bda95]/30' />
        <div className='absolute bottom-0 left-0 h-2 w-2 rounded-bl-lg border-b border-l border-[#0bda95]/30' />
        <div className='absolute right-0 bottom-0 h-2 w-2 rounded-br-lg border-r border-b border-[#0bda95]/30' />

        <div className='mb-4 flex items-center gap-2 border-b border-white/5 pb-2'>
          <Eye className='text-[#0bda95]' size={18} />
          <h3 className='font-mono text-[10px] font-bold tracking-widest text-white/60 uppercase'>
            {t('focusReaderFeature.results.averageSpeed')}
          </h3>
        </div>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col'>
            <p className='font-mono text-3xl font-medium tracking-tight text-white'>
              {wpm} {t('focusReaderFeature.results.wpm')}
            </p>
            {skimmingCount > 0 && (
              <p className='mt-1 font-mono text-[11px] font-bold tracking-wide text-[#eab308]/80 uppercase'>
                {t('focusReaderFeature.results.skimmingPenalty', {
                  count: skimmingCount,
                })}
              </p>
            )}
          </div>

          <div className='border-t border-white/5 pt-2'>
            <p className='font-serif text-lg leading-relaxed text-white/80 italic'>
              "{articleTitle || 'No Title'}"
            </p>
          </div>
        </div>
      </div>
    </ScoreDrawer>
  )
}
