import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

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
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    // const user = result.user;
    console.log("Google Sign-In successful:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    // Handle specific errors (e.g., popup closed, network error)
    return null;
  }
};

// Sign in with Apple (Placeholder - Requires additional setup in Firebase Console and potentially Apple Developer account)
const signInWithApple = async () => {
  console.warn("Apple Sign-In not implemented yet. Requires additional configuration.");
  // Implementation would involve using AppleAuthProvider and signInWithPopup/signInWithRedirect
  // const provider = new OAuthProvider("apple.com"); 
  // try {
  //   const result = await signInWithPopup(auth, provider);
  //   const user = result.user;
  //   // Apple credential handling...
  //   return user;
  // } catch (error) {
  //   console.error("Error during Apple Sign-In:", error);
  //   return null;
  // }
  return null;
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
const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { 
  auth, 
  db, 
  functions, 
  signInWithGoogle, 
  signInWithApple, // Exporting placeholder
  signOut, 
  onAuthStateChange 
};

