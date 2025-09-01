// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Offline persistence enabled successfully.");
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn("Firestore offline persistence could not be enabled. It's likely open in another tab.");
      } else if (err.code === 'unimplemented') {
        console.error("The current browser does not support offline persistence.");
      } else {
        console.error("Error enabling offline persistence: ", err);
      }
    });
} catch (err) {
  console.error("An unexpected error occurred while trying to enable offline persistence: ", err);
}