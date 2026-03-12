importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// You must paste your PUBLIC Firebase config here too, because Service Workers 
// run in a separate background thread and cannot access Vite's .env variables!
firebase.initializeApp({
    apiKey: "AIzaSyDMG_lgvAQah05eJp07HATJm6TFlU1uVhU",
    authDomain: "devtinder-chat.firebaseapp.com",
    projectId: "devtinder-chat",
    storageBucket: "devtinder-chat.firebasestorage.app",
    messagingSenderId: "786222421003",
    appId: "1:786222421003:web:62e35825dcb03397e2a30e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body
    });
});
