import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : ({} as Record<string, string | undefined>);

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyAgFTNOMKWbX8qFhxLaqzAg8K2Aw5fg2_k",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "bbt-academia.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "bbt-academia",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "bbt-academia.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "349962831282",
  appId: env.VITE_FIREBASE_APP_ID || "1:349962831282:web:412b960776c2e7e46610ab",
};

// Inicialização segura do Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase fallback:', error);
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

export { app, auth, db };
