import { CheckCircleIcon } from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

export function Toaster({ ...props }: ToasterProps) {

  return (
    <Sonner
      icons={{ 
        success: <CheckCircleIcon className='text-primary size-4.5' />
       }}
      position='top-center'
      theme={'light'}
      className='toaster group [&_div[data-content]]:w-full'
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
