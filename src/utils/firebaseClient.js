import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";
import { toast } from "react-toastify";

// Use Vite environment variables to initialize securely
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestFirebaseNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            // Get the FCM Token
            const token = await getToken(messaging, {
                // Generate a Web Push Key pair in Firebase console -> Cloud Messaging -> Web configuration
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
            });

            if (token) {
                // console.log("FCM Token generated!", token);

                // Transmit securely to the Node.js backend
                await axios.post("/api/save-fcm-token", { token }, { withCredentials: true });
                return token;
            } else {
                console.warn("No registration token available. Request permission to generate one.");
            }
        } else {
            console.warn("User blocked push permissions.");
        }
    } catch (error) {
        console.error("An error occurred while retrieving token. ", error);
    }
    return null;
};

// Use this hook natively in a React component (like Chat) to handle active foreground pings!
export const onForegroundMessage = () => {
    return onMessage(messaging, (payload) => {
        console.log("Message received in foreground: ", payload);
        const { title, body } = payload.notification;

        // Trigger a beautiful in-app toast notification!
        toast.info(`${title}: ${body}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored"
        });

        // Also trigger the native browser notification pop-up
        if (Notification.permission === 'granted') {
            new Notification(title, { body });
        }
    });
};
