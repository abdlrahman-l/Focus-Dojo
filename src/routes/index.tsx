import { createFileRoute, Link } from '@tanstack/react-router'
import { AudioLines, Eye, Keyboard, Info } from 'lucide-react'
import { useState } from 'react'
import { ScienceModal } from '@/components/ScienceModal'

import { CircularProgress } from '@/components/ui/circular-progress'
import { LanguageSelector } from '@/features/components/language-selector'
import { useTranslation } from 'react-i18next'
import { useScoreStore } from '@/stores/score-store'

export const Route = createFileRoute('/')({
  component: Dashboard,
})


function Dashboard() {
  const { t } = useTranslation();
  const [isScienceModalOpen, setIsScienceModalOpen] = useState(false)

  const { getRecoveryScore } = useScoreStore()
  
  // Mock data for the dashboard
  const user = {
    name: "Initiate",
    recoveryScore: getRecoveryScore()
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
        <LanguageSelector />
      </header>

      {/* 2. Hero Section - Recovery Score */}
      <section className="flex flex-1 flex-col items-center justify-center">
        <CircularProgress 
          value={user.recoveryScore} 
          label={t('dashboard.recoveryScore')}
          size={230}
        />
      </section>

      {/* 3. Navigation Menu Section */}
      <nav className="flex w-full flex-col gap-4">
        {features.map((feature) => (
          <Link
            key={feature.id}
            to={feature.path}
            className="group flex w-full items-center rounded-2xl bg-zinc-900 p-4 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Icon Container */}
            <div className="flex size-10 items-center justify-center rounded-full bg-zinc-800/50 text-white group-hover:text-emerald-500 transition-colors">
              <feature.icon className="size-6 strokeWidth={1.5}" />
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
      <footer className="mt-8 flex w-full items-center justify-center gap-4 pb-4">
        <button
          onClick={() => setIsScienceModalOpen(true)}
          className="rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-900 hover:text-white"
          aria-label="Research Info"
        >
          <Info className="h-6 w-6" />
        </button>

        {/* <Link 
          to="/settings" 
          className="rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-900 hover:text-white"
          aria-label="Settings"
        >
          <Settings className="h-6 w-6" />
        </Link> */}
      </footer>

      <ScienceModal 
        isOpen={isScienceModalOpen} 
        onClose={() => setIsScienceModalOpen(false)} 
      />
    </div>
  )
}

