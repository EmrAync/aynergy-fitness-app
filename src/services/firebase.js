// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBI_P7JETWgpNmrF4KYTAjHoyvDBr34vQQ",
  authDomain: "synergy-fitness.firebaseapp.com",
  projectId: "synergy-fitness",
  storageBucket: "synergy-fitness.firebasestorage.app",
  messagingSenderId: "379120684453",
  appId: "1:379120684453:web:64a6521f976ecd56e2ec4c"
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
        // Multiple tabs open, persistence can only be enabled in one.
        console.warn("Firestore offline persistence could not be enabled. It's likely open in another tab.");
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.error("The current browser does not support offline persistence.");
      } else {
        console.error("Error enabling offline persistence: ", err);
      }
    });
} catch (err) {
  console.error("An unexpected error occurred while trying to enable offline persistence: ", err);
}