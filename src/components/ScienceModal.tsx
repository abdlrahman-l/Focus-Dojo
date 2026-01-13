import { ChevronDown, ChevronUp, Eye, Keyboard, AudioLines } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"

interface ScienceModalProps {
  isOpen: boolean
  onClose: () => void
}

export const RESEARCH_ITEMS = [
  {
    id: 'focus-reader',
    icon: Eye,
    ref: 'MCCONKIE & RAYNER (1975)',
    translationKey: 'focusReader'
  },
  {
    id: 'vocal-gym',
    icon: AudioLines,
    ref: 'MACLEOD ET AL. (2010)',
    translationKey: 'vocalGym'
  },
  {
    id: 'zen-type',
    icon: Keyboard,
    ref: 'DIAMOND (2013)',
    translationKey: 'zenType'
  }
];

export function ScienceModal({ isOpen, onClose }: ScienceModalProps) {
  const { t } = useTranslation()
  const [openItemId, setOpenItemId] = useState<string | null>()

  const handleToggle = (id: string) => {
    setOpenItemId(openItemId === id ? null : id)
  }

  // Handle open change from Drawer (dragging down to close, etc)
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpenItemId(null)
      onClose()
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="bg-zinc-900 border-t border-white/10 text-white max-h-[96vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="relative border-b border-white/5 pb-4 pt-6">
             <div className="flex justify-center w-full">
                <DrawerTitle className="text-zinc-400 text-xs font-mono font-medium tracking-[0.2em] uppercase text-center">
                {t('scienceModal.title')}
                </DrawerTitle>
             </div>
          </DrawerHeader>

          <div className="p-4 overflow-y-auto max-h-[60vh] sm:max-h-[70vh] space-y-3">
             {RESEARCH_ITEMS.map((item) => {
                const isActive = openItemId === item.id
                const Icon = item.icon
                const title = t(`scienceModal.features.${item.translationKey}.title`)
                const content = t(`scienceModal.features.${item.translationKey}.content`)
                // const features = t(`scienceModal.features.${item.translationKey}.featureHook` as any)

                return (
                  <div 
                    key={item.id}
                    className={cn(
                      "group rounded-xl overflow-hidden transition-all duration-300 border",
                      isActive 
                        ? "bg-zinc-800 border-emerald-500/30 shadow-[0_0_0_1px_rgba(16,183,127,0.3),0_0_15px_-3px_rgba(16,183,127,0.15)]" 
                        : "bg-zinc-800/40 border-white/5"
                    )}
                  >
                    <button
                      onClick={() => handleToggle(item.id)}
                      className="flex w-full cursor-pointer items-center justify-between p-4 list-none select-none text-left"
                    >
                      <div className="flex items-center gap-4">
                        <Icon 
                          size={20} 
                          className={isActive ? "text-emerald-500" : "text-zinc-400"} 
                        />
                        <span className={cn(
                          "text-sm font-medium transition-colors",
                          isActive ? "text-emerald-500" : "text-zinc-200"
                        )}>
                          {title}
                        </span>
                      </div>
                      {isActive ? (
                        <ChevronUp size={20} className="text-emerald-500 transition-transform duration-300" />
                      ) : (
                        <ChevronDown size={20} className="text-zinc-500 transition-transform duration-300" />
                      )}
                    </button>
                    
                    {isActive && (
                      <div className="px-4 pb-5 pt-1 pl-13">
                        <p className="font-serif text-zinc-300 text-sm leading-relaxed tracking-wide">
                          {content}
                        </p>
                        {item.ref && (
                            <div className="mt-3 flex gap-2">
                                <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono tracking-wide">
                                    REF: {item.ref}
                                </span>
                            </div>
                        )}
                      </div>
                    )}
                  </div>
                )
             })}
            
            <div className="pt-8 flex flex-col items-center justify-center opacity-30">
                <span className="mb-2 text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.58 2.6C12.23 2.5 11.78 2.5 11.43 2.6C7.38 3.03 4.23 6.64 4.54 11.23C4.7 13.92 6.13 16.29 8.27 17.76L8.13 19.82C8.07 20.65 8.7 21.37 9.54 21.43L14.47 21.43C15.31 21.37 15.93 20.65 15.87 19.82L15.74 17.76C17.88 16.29 19.31 13.92 19.47 11.23C19.78 6.64 16.63 3.03 12.58 2.6Z"/><path d="M10 11H14"/><path d="M9 15H15"/><path d="M9 7H15"/></svg>
                </span>
                <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">{t('scienceModal.validatedBy')}</p>
            </div>
          </div>

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <button 
                  className="w-full flex items-center justify-center rounded-xl h-12 bg-white text-black text-sm font-bold tracking-wide shadow-lg hover:bg-zinc-200 transition-colors"
              >
                  {t('scienceModal.close')}
              </button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
