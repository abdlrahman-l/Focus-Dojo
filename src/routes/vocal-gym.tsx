import { createFileRoute } from '@tanstack/react-router'
import { ArticulationDrill } from '@/features/vocal-gym/components/articulation-drill'

export const Route = createFileRoute('/vocal-gym')({
  component: ArticulationDrill,
})
