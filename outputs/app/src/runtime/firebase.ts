import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  browserSessionPersistence,
  getAuth,
  getIdToken,
  setPersistence,
  signInWithCustomToken
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import type { Answers, Identity } from "./types";
import { readIdentity, writeIdentity } from "./storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD7qDq0xFZxAGlc-A7OWyUGW9RnTXYirUc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "laien-billing-platform.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "laien-billing-platform",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "laien-billing-platform.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "70140096854",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:70140096854:web:505eb78571be66a3b7e6f7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XEJVTE2HCB"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
void setPersistence(firebaseAuth, browserSessionPersistence);
void isSupported().then((ok) => ok ? getAnalytics(firebaseApp) : undefined);
export const firestoreDb = getFirestore(firebaseApp);
export const firestoreCollection = import.meta.env.VITE_FIRESTORE_FUNNEL_COLLECTION || "test";

export async function signInBillingCustomToken(data: {
  uid?: string;
  customToken: string;
  email?: string;
  isAnonymous?: boolean;
}) {
  await signInWithCustomToken(firebaseAuth, data.customToken);
  const current = firebaseAuth.currentUser;
  if (!current) throw new Error("Firebase sign-in failed.");
  const idToken = await getIdToken(current, true);
  const identity: Identity = {
    uid: data.uid || current.uid,
    customToken: data.customToken,
    idToken,
    email: data.email,
    isAnonymous: data.isAnonymous ?? true
  };
  writeIdentity(identity);
  return identity;
}

export async function refreshIdentityToken() {
  const identity = readIdentity();
  if (!identity?.uid) return null;
  const current = firebaseAuth.currentUser;
  const idToken = current ? await getIdToken(current, true) : identity.idToken;
  const refreshed = { ...identity, idToken };
  writeIdentity(refreshed);
  return refreshed;
}

export async function persistAnswersToFirestore(identity: Identity, answers: Answers) {
  await setDoc(doc(firestoreDb, firestoreCollection, identity.uid), answers, { merge: true });
}
