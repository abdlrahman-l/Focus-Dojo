importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const params = new URLSearchParams(self.location.search);

const firebaseConfig = {
    apiKey: params.get('apiKey'),
    projectId: params.get('projectId'),
    authDomain: params.get('authDomain'),
    messagingSenderId: params.get('messagingSenderId'),
    storageBucket: params.get('storageBucket'),
    appId: params.get('appId'),
}

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    // show nothing, if there is a notification from firebase console
    // fcm sdk automatically handle notification if there is notification object
    if (payload.notification?.title || payload?.notification?.body) {
        return;
    }

    const title = payload?.data?.title || '';
    const body = payload?.data?.body || '';

    self.registration.showNotification(title, {
        body,
        data: {
            url: payload?.data?.url || '/'
        },
        icon: '/images/192x192.png'
    });
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const targetUrl = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
            .then(() => {
                if (clients.openWindow) {
                    return clients.openWindow(targetUrl);
                }
            })
    );

});