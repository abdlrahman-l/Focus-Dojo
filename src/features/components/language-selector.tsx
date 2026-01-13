import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LanguageSelector() {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 outline-none focus-visible:ring-1 focus-visible:ring-emerald-500">
          <span className="text-base leading-none">
            {currentLanguage === 'id' ? '🇮🇩' : '🇺🇸'}
          </span>
          <span>{currentLanguage?.toUpperCase() || 'EN'}</span>
          <ChevronDown className="h-3 w-3 text-zinc-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[120px] bg-zinc-900 border-zinc-800 text-white">
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-zinc-800 focus:text-white"
          onClick={() => changeLanguage('id')}
        >
          <span className="mr-2 text-base">🇮🇩</span>
          <span>ID</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-zinc-800 focus:text-white"
          onClick={() => changeLanguage('en')}
        >
          <span className="mr-2 text-base">🇺🇸</span>
          <span>EN</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
