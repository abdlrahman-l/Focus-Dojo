import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const AUTH_CODE = '_code'

interface AuthCodeState {
  authCode: {
    code: string
    setCode: (code: string) => void
    resetCode: () => void
  }
}

export const useAuthCodeStore = create<AuthCodeState>()((set) => {
  const cookieState = getCookie(AUTH_CODE)
  const initCode = cookieState || ''
  return {
    authCode: {
      code: initCode,
      setCode: (code: string) =>
        set((state) => {
          setCookie(AUTH_CODE, code)
          return { ...state, authCode: { ...state.authCode, code } }
        }),
      resetCode: () =>
        set((state) => {
          removeCookie(AUTH_CODE)
          return { ...state, authCode: { ...state.authCode, code: '' } }
        }),
    },
  }
})
