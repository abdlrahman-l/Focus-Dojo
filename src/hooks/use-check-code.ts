import { fetcher } from '@/lib/request'

interface CheckCodeResponse {
  record: object; 
}

const queryFn = (code: string) => () => {
  return fetcher<CheckCodeResponse>({
    method: 'POST',
    url: `${import.meta.env.VITE_CONSULTATION_API_URL}/visitor/check-code-from-qr`,
    data: {
        code,
    }
  })
}

export const checkCodeQueryOptions = (code: string) => ({
  queryKey: ['check-code', code],
  queryFn: queryFn(code),
})
