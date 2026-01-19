import { createFileRoute } from '@tanstack/react-router'
import { ZenType } from '@/features/zen-type/components/zen-type'

export const Route = createFileRoute('/zen-type')({
  component: ZenType,
})
