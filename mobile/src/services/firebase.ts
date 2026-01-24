// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8fuxzuye9m_GVNHD_sibpe3s8F2Bojl8",
  authDomain: "govly-f8479.firebaseapp.com",
  projectId: "govly-f8479",
  storageBucket: "govly-f8479.firebasestorage.app",
  messagingSenderId: "341860513470",
  appId: "1:341860513470:web:e2a87f784fd1bb1e30d0ef",
  measurementId: "G-J5E9EV34DG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

const googleAuthProvider = new GoogleAuthProvider();

export {app, auth, googleAuthProvider};