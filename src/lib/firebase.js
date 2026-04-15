import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
} from "firebase/firestore";

// Configuration Firebase chargée depuis les variables d'environnement Next.js
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Évite la double initialisation lors du HMR de Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Tente d'activer le cache local persistant (mode hors-ligne). Si ça échoue
// — typiquement quand initializeFirestore a déjà été appelé via HMR ou
// quand l'environnement ne supporte pas IndexedDB — on retombe sur un
// getFirestore classique pour ne pas bloquer l'appli.
function creerFirestore() {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (error) {
    console.warn(
      "Persistance Firestore indisponible, fallback sur getFirestore :",
      error,
    );
    return getFirestore(app);
  }
}

export const db = creerFirestore();
export default app;
