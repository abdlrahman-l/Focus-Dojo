import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/focus-reader')({
  component: () => <div className="p-4 text-white">Focus Reader Feature</div>,
})
