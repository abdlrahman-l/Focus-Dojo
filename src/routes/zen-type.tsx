import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/zen-type')({
  component: () => <div className="p-4 text-white">Zen Type Feature</div>,
})
