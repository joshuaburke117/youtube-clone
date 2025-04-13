// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,
    signInWithPopup,
GoogleAuthProvider,
onAuthStateChanged,
User } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYsViexYJdQrdspEJiu5MZk4J6cvUkkYo",
  authDomain: "yt-clone-eb8d9.firebaseapp.com",
  projectId: "yt-clone-eb8d9",
  appId: "1:178832331998:web:226c5c1219ddabd6b29e4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
export function signInWithGoogle(){
    return signInWithPopup(auth, new GoogleAuthProvider());
}


/**
 * Signs the user out.
 * @returns A promise that resolves when the user is signed out.
 */
export function signOut(){
    return auth.signOut();
}

/**
 * Trigger a callback when user state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user:User | null)=>void){
    return onAuthStateChanged(auth,callback);
}