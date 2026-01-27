import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import type { ResponseData, ResponseError } from '@/interfaces/responses'
import { toast } from 'sonner'
import { useAuthCodeStore } from '@/stores/auth-code-store'
import { useAuthStore } from '@/stores/auth-store'

const axiosInstance = axios.create()

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      if (error?.config?.url?.includes('/check-code-from-qr')) {
        return Promise.reject(error)
      }

      toast.dismiss()
      useAuthStore.getState().auth.reset()
      useAuthCodeStore.getState().authCode.resetCode()

      toast.error('Sesi sudah berakhir, mengalihkan ke halaman login')

      // hacky: Find how to not trigger the onError Tanstack query callback when got 401 error status code
      return new Promise(() => {}) // never resolves
    }
    return Promise.reject(error)
  }
)

export async function fetcher<T>(
  config: AxiosRequestConfig
): Promise<ResponseData<T>> {
  try {
    const response = await axiosInstance<ResponseData<T>>(config)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw (error.response?.data || {
        message: error.message,
      }) as ResponseError
    }
    throw error
  }
}
