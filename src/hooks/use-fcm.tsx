import { firebaseConfig, messaging } from '@/lib/firebase'
import { getToken, onMessage } from 'firebase/messaging'
import { useEffect } from 'react'
import useUpdateFCMToken from './use-update-fcm-token'
import { useAuthStore } from '@/stores/auth-store'

const useFCM = () => {
    const { mutate: updateFcmToken } = useUpdateFCMToken();
    const { auth } = useAuthStore();

    useEffect(() => {
        const initFCM = async () => {
            if (auth.accessToken) {
                // check browser support
                if (!('serviceWorker' in navigator)) {
                    return;
                }

                // register service worker using env params
                const params = new URLSearchParams(firebaseConfig).toString();
                const registration = await navigator.serviceWorker.register(
                    `/firebase-messaging-sw.js?${params}`
                )

                const permission = await Notification.requestPermission()
                if (permission === 'granted') {
                    const token = await getToken(messaging, {
                        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                        serviceWorkerRegistration: registration,
                    })

                    updateFcmToken({ fcmToken: token })
                }
            }
        }

        initFCM();

        const unsubscribe = onMessage(messaging, (payload) => {
            if (auth.accessToken) {
                const title = payload.notification?.title || payload?.data?.title || '';
                const body = payload.notification?.body || payload?.data?.body || '';
                const { data } = payload

                const notification = new Notification(title, {
                    body,
                    icon: '/images/192x192.png'
                })

                notification.onclick = (event) => {
                    event.preventDefault(); // prevent the browser from focusing the Notification's tab
                    notification.close()

                    if (data?.url) {
                        window.location.href = data.url
                    }

                    window.focus();
                }
            }
        })

        return () => {
            unsubscribe()
        }
    }, [auth.accessToken, auth.user, updateFcmToken])
}

export default useFCM
