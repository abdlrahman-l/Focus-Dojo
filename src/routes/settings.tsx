import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: () => <div className="p-4 text-white">Settings Page</div>,
})
