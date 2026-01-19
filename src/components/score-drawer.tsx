import { RotateCcw, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'

interface ScoreDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  score: number | null
  title: string // e.g. "EFFICIENCY RATING"
  children: React.ReactNode
  onRetry: () => void
  onNext: () => void
  retryLabel?: string
  nextLabel?: string
  // Styling overrides to support different themes
  scoreClassName?: string
  titleClassName?: string
  nextButtonClassName?: string
}

export function ScoreDrawer({
  open,
  onOpenChange,
  score,
  title,
  children,
  onRetry,
  onNext,
  retryLabel = 'RETRY',
  nextLabel = 'NEXT PROTOCOL',
  scoreClassName = 'text-[#10b77f] drop-shadow-[0_0_15px_rgba(16,183,127,0.5)]',
  titleClassName = 'text-[#10b77f]/80',
  nextButtonClassName = 'bg-[#10b77f] text-[#000000] hover:bg-[#10b77f]/90 shadow-[0_0_20px_-5px_rgba(16,183,127,1)]',
}: ScoreDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='border-t-0 border-zinc-800 bg-[#18181b] text-white ring-0 outline-none'>
        <DrawerHeader className='pt-8 pb-4 text-center'>
          <DrawerTitle
            className={cn(
              'mb-2 font-mono text-6xl font-bold tracking-tighter',
              scoreClassName
            )}
          >
            {score}%
          </DrawerTitle>
          <p
            className={cn(
              'text-xs font-bold tracking-[0.2em] uppercase',
              titleClassName
            )}
          >
            {title}
          </p>
        </DrawerHeader>

        {children}

        <DrawerFooter className='grid grid-cols-2 gap-4 px-6 pt-2 pb-8'>
          <button
            onClick={onRetry}
            className='group flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-transparent py-4 text-xs font-bold tracking-widest text-zinc-300 uppercase transition-all hover:bg-zinc-900 active:scale-95'
          >
            <RotateCcw className='h-4 w-4 transition-transform group-hover:-rotate-90' />
            {retryLabel}
          </button>
          <button
            onClick={onNext}
            className={cn(
              'group flex items-center justify-center gap-2 rounded-full py-4 text-xs font-bold tracking-widest uppercase transition-all active:scale-95',
              nextButtonClassName
            )}
          >
            {nextLabel}
            <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
