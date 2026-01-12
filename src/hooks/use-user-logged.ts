import { useQuery } from '@tanstack/react-query'
import type { ResponseError, ResponseData } from '@/interfaces/responses'
import { fetcher } from '@/lib/request'
import { useAuthStore } from '@/stores/auth-store'

interface UserLoggedResponse {
    record: {
        avatar?: string | null;
        icon?: string | null;
        level_name?: string | null;

        first_name: string;
        last_name: string;
        full_name: string;

        phone: string;
        uid: string;
    }
}

const useUserLogged = () => {
    const { auth } = useAuthStore();

    useQuery<ResponseData<UserLoggedResponse>, ResponseError>({
        queryKey: ['user-logged', auth.accessToken],
        queryFn: () => {
            return fetcher<UserLoggedResponse>({
                method: 'GET',
                url: `${import.meta.env.VITE_USER_API_URL}/users/logged`,
            })
        },
        enabled: !!auth.accessToken && auth.accessToken !== '',
    })
}

export default useUserLogged
