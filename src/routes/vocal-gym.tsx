import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vocal-gym')({
  component: () => <div className="p-4 text-white">Vocal Gym Feature</div>,
})
