import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfbptxrU2aaMdxD5BAc-nOA4AlJEyZxoo",
  authDomain: "room-finder-app-c3c20.firebaseapp.com",
  projectId: "room-finder-app-c3c20",
  storageBucket: "room-finder-app-c3c20.firebasestorage.app",
  messagingSenderId: "918720676389",
  appId: "1:918720676389:web:d643e863476dbf57dcb5cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
export default app;
