import { consultationPaths } from '@/lib/consultation'
import { useRouterState } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import useQiscusLogin from './use-qiscus-login'
// import { qiscusUser } from '@/mock'
import { toast } from 'sonner'

const useQiscusInit = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const { auth } = useAuthStore();

  const isConsultationPath = useMemo(() => {
    return consultationPaths.some(p => pathname.includes(p))
  }, [pathname])

  const shouldInit = isConsultationPath && !!auth.accessToken && auth.accessToken.length > 0;
  // const shouldInit = true;
  const { data, isError } = useQiscusLogin(shouldInit);

  useEffect(() => {
    const logoutQiscus = async () => {
      if (!isConsultationPath) {
        const qiscusSvc = ((await import('@/features/chat-room/hooks/use-qiscus-chat')))
        const isLoggedIn = qiscusSvc.qiscus.isLogin

        if (isLoggedIn) {
          qiscusSvc.qiscus.realtimeAdapter.disconnect();
          qiscusSvc.qiscus.isLogin = false;
          qiscusSvc.qiscus.userData = {};
          qiscusSvc.qiscus.logout();
        }
      }
    }
    logoutQiscus();
  }, [isConsultationPath])

  useEffect(() => {
    const init = async () => {
      if (data) {
        const qiscusSvc = ((await import('@/features/chat-room/hooks/use-qiscus-chat')))
        const isLoggedIn = qiscusSvc.qiscus.isLogin
        const userData = data.data.record

        if (!isLoggedIn) {
          await qiscusSvc.initQiscus()
          await qiscusSvc.qiscus.setUser(
            userData.user_id,
            userData.user_key,
            userData.username,
            userData.avatar_url,
            userData.extras
          )
          // await qiscusSvc.qiscus.setUser(
          //   qiscusUser.userId,
          //   qiscusUser.userKey,
          //   qiscusUser.name,
          //   qiscusUser.imageSrc,
          //   {}
          // )
        }
      } else if (isError) {
        toast.error('Gagal login ke dalam chat system')
      }
    }
    if (shouldInit) {
      init()
    }

  }, [shouldInit, data, isError])

}

export default useQiscusInit