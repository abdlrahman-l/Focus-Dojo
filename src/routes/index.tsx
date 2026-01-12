import { createFileRoute, Link } from '@tanstack/react-router'
import { AudioLines, ChevronDown, Eye, Keyboard, Settings } from 'lucide-react'
import { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/')({
  component: Dashboard,
})


function Dashboard() {

  const { t, i18n } = useTranslation();


  const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
  };


  const currentLanguage = i18n.language;
  
  
  // Mock data for the dashboard
  const user = {
    name: "Initiate",
    recoveryScore: 68
  }

  const features = [
    {
      id: "focus-reader",
      title: t('dashboard.focusReader.title'),
      description: t('dashboard.focusReader.description'),
      icon: Eye,
      path: "/focus-reader"
    },
    {
      id: "vocal-gym",
      title: t('dashboard.vocalGym.title'),
      description: t('dashboard.vocalGym.description'),
      icon: AudioLines,
      path: "/vocal-gym"
    },
    {
      id: "zen-type",
      title: t('dashboard.zenType.title'),
      description: t('dashboard.zenType.description'),
      icon: Keyboard,
      path: "/zen-type"
    }
  ]

  return (
    <div className="flex min-h-screen w-full flex-col bg-black px-6 py-6 text-white font-sans">
      {/* 1. Header Section */}
      <header className="flex w-full items-center justify-between">
        <h1 className="text-sm font-medium text-zinc-300">
          {t('dashboard.welcomeBack', { name: user.name })}
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 outline-none focus-visible:ring-1 focus-visible:ring-emerald-500">
              <span className="text-base leading-none">
                {currentLanguage === 'id' ? '🇮🇩' : '🇺🇸'}
              </span>
              <span>{currentLanguage.toUpperCase()}</span>
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
      </header>

      {/* 2. Hero Section - Recovery Score */}
      <section className="flex flex-1 flex-col items-center justify-center py-12">
        <div className="relative flex items-center justify-center">
          {/* Circular Progress */}
          <svg className="h-64 w-64 -rotate-90 transform">
            {/* Track */}
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-zinc-900"
            />
            {/* Progress Arc */}
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - user.recoveryScore / 100)}
              strokeLinecap="round"
              className="text-emerald-500 transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Center Text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-7xl font-bold tracking-tighter text-white">
              {user.recoveryScore}%
            </span>
            <span className="mt-2 text-xs font-bold tracking-widest text-zinc-500">
              {t('dashboard.recoveryScore')}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Navigation Menu Section */}
      <nav className="flex w-full flex-col gap-4">
        {features.map((feature) => (
          <Link
            key={feature.id}
            to={feature.path}
            className="group flex w-full items-center rounded-3xl bg-zinc-900 p-5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Icon Container */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/50 text-white group-hover:text-emerald-500 transition-colors">
              <feature.icon className="h-6 w-6" strokeWidth={1.5} />
            </div>
            
            {/* Text Content */}
            <div className="ml-4 flex flex-col">
              <span className="text-base font-bold text-white">
                {feature.title}
              </span>
              <span className="text-xs font-bold tracking-wide text-zinc-500">
                {feature.description}
              </span>
            </div>
          </Link>
        ))}
      </nav>

      {/* 4. Footer Section */}
      <footer className="mt-8 flex w-full items-center justify-center pb-4">
        <Link 
          to="/settings" 
          className="rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-900 hover:text-white"
          aria-label="Settings"
        >
          <Settings className="h-6 w-6" />
        </Link>
      </footer>
    </div>
  )
}

