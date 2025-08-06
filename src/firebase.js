// src/firebase.js

// Import Firebase core and required services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Add this

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQij_Ejm03o1rOKP2-0x_J8bXk2_UcarQ",
  authDomain: "linkedin-clone-d9398.firebaseapp.com",
  projectId: "linkedin-clone-d9398",
  storageBucket: "linkedin-clone-d9398.appspot.com", // ✅ Corrected URL
  messagingSenderId: "545263202380",
  appId: "1:545263202380:web:078d321f29e74f986204e9",
  measurementId: "G-HX2G7KSEC2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);           // Authentication
export const db = getFirestore(app);        // Firestore database
export const storage = getStorage(app);     // ✅ Export Storage

export default app;
