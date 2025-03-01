import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA7QqomNEm6d7uSZZB1Awagqdk1WMJGhfM",
    authDomain: "saheli-app-7ca1b.firebaseapp.com",
    projectId: "saheli-app-7ca1b",
    storageBucket: "saheli-app-7ca1b.firebasestorage.app",
    messagingSenderId: "76730312526",
    appId: "1:76730312526:web:ec80623481fe2bd5d9e01f",
    measurementId: "G-TEBSSK0QD6"
};

// Initialize Firebase only if an instance doesn't exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };