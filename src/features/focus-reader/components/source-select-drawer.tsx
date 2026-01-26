import { useState } from 'react'
import { ArrowRight, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

interface SourceSelectDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSelectPreset: (articleId: string) => void
  onPasteSubmit: (text: string) => void
  currentArticleId: string | null
}

type Tab = 'library' | 'custom'

const LIBRARY_ITEMS = [
  {
    id: 'mental-fatigue',
  },
  {
    id: 'dopamine-loop',
  },
  {
    id: 'attention-residue',
  },
  {
    id: 'deep-work',
  },
  {
    id: 'cognitive-load',
    opacity: 'opacity-60',
  },
]

export function SourceSelectDrawer({
  isOpen,
  onClose,
  onSelectPreset,
  onPasteSubmit,
  currentArticleId,
}: SourceSelectDrawerProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('library')
  const [customText, setCustomText] = useState('')

  const handleInitiate = () => {
    if (activeTab === 'library') {
      // Default to first item for now or handle selection state if needed
      onSelectPreset(LIBRARY_ITEMS[0].id)
    } else {
      onPasteSubmit(customText)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className='max-h-[96vh] border-t border-white/10 bg-zinc-900 text-white'>
        {/* Header Section */}
        <DrawerHeader className='shrink-0 px-6 pt-2 pb-4 text-left'>
          <DrawerTitle className='font-display my-4 text-lg leading-tight font-bold tracking-widest text-white uppercase'>
            {t('focusReaderFeature.sourceSelect.title')}
          </DrawerTitle>

          {/* Tab Switcher */}
          <div className='flex rounded-lg border border-white/5 bg-black/40 p-1'>
            <button
              onClick={() => setActiveTab('library')}
              className={cn(
                'font-display flex-1 rounded-[0.4rem] px-4 py-2.5 text-xs font-bold tracking-widest transition-all',
                activeTab === 'library'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              {t('focusReaderFeature.sourceSelect.tabs.library')}
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={cn(
                'font-display flex-1 rounded-[0.4rem] px-4 py-2.5 text-xs font-bold tracking-widest transition-all',
                activeTab === 'custom'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              {t('focusReaderFeature.sourceSelect.tabs.custom')}
            </button>
          </div>
        </DrawerHeader>

        {/* Content Area */}
        <div className='custom-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-2'>
          <div className='flex flex-col gap-4 pt-2 pb-6'>
            {activeTab === 'library' ? (
              /* Library Items */
              LIBRARY_ITEMS.map((item) => {
                const isActive = item.id === currentArticleId
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectPreset(item.id)}
                    className={cn(
                      'group relative flex w-full cursor-pointer items-center justify-between rounded-xl p-5 transition-all',
                      isActive
                        ? 'bg-matte-grey border-primary/60 shadow-neon-card border hover:bg-[#252927]'
                        : 'bg-card-inactive hover:bg-matte-grey border border-white/5 hover:border-gray-600',
                      item.opacity
                    )}
                  >
                    <div className='pr-4'>
                      <h3
                        className={cn(
                          'mb-1.5 font-mono text-base font-bold tracking-tight uppercase transition-colors',
                          isActive
                            ? 'text-primary'
                            : 'text-gray-300 group-hover:text-white'
                        )}
                      >
                        {t(
                          `focusReaderFeature.sourceSelect.libraryItems.${item.id}.title`
                        )}
                      </h3>
                      <p
                        className={cn(
                          'font-sans text-xs leading-relaxed font-medium',
                          isActive
                            ? 'text-gray-300 opacity-90'
                            : 'text-gray-500 group-hover:text-gray-400'
                        )}
                      >
                        {t(
                          `focusReaderFeature.sourceSelect.libraryItems.${item.id}.description`
                        )}
                      </p>
                    </div>

                    {isActive && (
                      <ArrowRight className='text-primary h-7 w-7 shrink-0 drop-shadow-[0_0_8px_rgba(19,236,164,0.6)]' />
                    )}

                    {/* Active Background Glow */}
                    {isActive && (
                      <div className='bg-primary/5 pointer-events-none absolute inset-0 rounded-xl' />
                    )}
                  </div>
                )
              })
            ) : (
              /* Custom Paste Area */
              <div className='flex h-full flex-col gap-4'>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={t(
                    'focusReaderFeature.sourceSelect.customPlaceholder'
                  )}
                  className='bg-card-inactive focus:border-primary/50 focus:ring-primary/50 custom-scroll min-h-[200px] w-full flex-1 resize-none rounded-xl border border-white/10 p-4 font-sans text-sm text-gray-300 placeholder:text-gray-600 focus:ring-1 focus:outline-none'
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='bg-background-dark z-20 shrink-0 border-t border-white/5 px-6 py-4'>
          <button
            onClick={handleInitiate}
            className='bg-primary text-background-dark font-display flex h-14 w-full items-center justify-center gap-2 rounded-full text-sm font-bold tracking-[0.15em] uppercase'
          >
            {t('focusReaderFeature.sourceSelect.initiate')}
            <Play className='h-5 w-5 fill-current' />
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
