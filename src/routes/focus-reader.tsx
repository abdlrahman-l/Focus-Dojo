import { createFileRoute } from '@tanstack/react-router'
import { FocusReader } from '@/features/focus-reader/components/focus-reader'

export const Route = createFileRoute('/focus-reader')({
  component: FocusReader,
})
