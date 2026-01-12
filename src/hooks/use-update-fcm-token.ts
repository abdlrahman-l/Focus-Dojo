// Sesuaikan path constant ini
import { useMutation } from '@tanstack/react-query'
import type { ResponseData } from '@/interfaces/responses'
import { fetcher } from '@/lib/request'

interface UpdateFCMTokenPayload {
  fcmToken: string
}

const useUpdateFCMToken = () => {
  return useMutation<
    ResponseData<object>,
    ResponseData<object>,
    UpdateFCMTokenPayload
  >({
    mutationFn: (data) => {
      return fetcher({
        method: 'POST',
        url: `${import.meta.env.VITE_CONSULTATION_API_URL}/visitor/update-fcm-token`,
        data: {
          fcm_token: data.fcmToken,
        },
      })
    },
  })
}

export default useUpdateFCMToken