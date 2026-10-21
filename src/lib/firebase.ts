import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoDummyKeyForBBTFightAcademy',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'bbt-academia-luta.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'bbt-academia-luta',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'bbt-academia-luta.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
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
  console.warn('Firebase inicializado em modo contingência:', error);
  // Fallbacks para evitar quebra em ambiente local de teste
  app = getApps().length > 0 ? getApp() : initializeApp({
    apiKey: 'AIzaSyDemoDummyKeyForBBTFightAcademy',
    projectId: 'bbt-academia-luta',
  });
  auth = getAuth(app);
  db = getFirestore(app);
}

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

export { app, auth, db };
