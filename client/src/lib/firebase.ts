import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth"; // Rinominato User in FirebaseUser per evitare conflitti
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import type { User, AuthResponse } from "@shared/schema"; // Importa i tipi locali

// Import environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// --- Authentication Functions ---

const googleProvider = new GoogleAuthProvider();

// Sign in with Google
const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    console.log("Google Sign-In successful:", firebaseUser);
    
    // Mappa FirebaseUser al tuo tipo User locale
    // Questa è una mappatura di base, potrebbe essere necessario recuperare/creare dati aggiuntivi dal tuo backend
    const localUser: User = {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "google_user",
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || undefined,
      profileImage: firebaseUser.photoURL || undefined,
      // Altri campi come 'level' o 'role' dovrebbero essere recuperati/impostati dal tuo backend
      // dopo la registrazione/login iniziale con Google.
    };
    
    return { success: true, user: localUser };
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    return { success: false, error: error }; 
  }
};

// Sign in with Apple (Placeholder)
const signInWithApple = async (): Promise<AuthResponse> => {
  console.warn("Apple Sign-In not implemented yet.");
  return { success: false, error: "Not implemented" };
};

// Sign out
const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log("Sign-out successful.");
  } catch (error) {
    console.error("Error during sign-out:", error);
  }
};

// Observe Auth State Changes
// Il callback riceve FirebaseUser, se vuoi usare il tuo tipo User, dovrai mapparlo
const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { 
  auth, 
  db, 
  functions, 
  signInWithGoogle, 
  signInWithApple, 
  signOut, 
  onAuthStateChange 
};

