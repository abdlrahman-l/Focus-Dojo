import { useQuery } from '@tanstack/react-query'
import type { ResponseError, ResponseData } from '@/interfaces/responses'
import { fetcher } from '@/lib/request'

interface QiscusLoginResponse {
    record: {
        user_key: string,
        avatar_url: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extras: Record<string, any>,
        user_id: string,
        username: string
    }
}

const useQiscusLogin = (enabled = false) => {
    return useQuery<ResponseData<QiscusLoginResponse>, ResponseError>({
        queryKey: ['qiscus-login'],
        queryFn: () => {
            return fetcher<QiscusLoginResponse>({
                method: 'POST',
                url: `${import.meta.env.VITE_CONSULTATION_API_URL}/visitor/login`,
            })
        },
        enabled,
        refetchOnWindowFocus: false,
    })
}

export default useQiscusLogin
