import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { NavigationProgress } from '@/components/navigation-progress'
// import { GeneralError } from '@/features/errors/general-error'
// import { NotFoundError } from '@/features/errors/not-found-error'
import { Toaster } from '@/components/ui/sonner'
import { useScoreStore } from '@/stores/score-store'

const RootComponent = () => {

  return (
    <main className='w-full min-h-screen max-w-md mx-auto'>
      <NavigationProgress />
      <Outlet />
      <Toaster duration={3000} richColors />
      {import.meta.env.MODE === 'development' && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </main>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  beforeLoad: ({ location }) => {
    const isFirstAttempt = !useScoreStore.getState().initialAttempt
    const isInitPage = location.pathname === '/init'

    if (isFirstAttempt && !isInitPage) {
      throw redirect({ to: '/init', replace: true })
    }
  },
  // notFoundComponent: NotFoundError,
  // errorComponent: GeneralError,
})
