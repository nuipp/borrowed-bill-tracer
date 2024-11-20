// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwWZsMuD-mEmBiAR1bL-ohd7WNWoAhqsE",
  authDomain: "nuipp-borrowed-bill-tracer.firebaseapp.com",
  projectId: "nuipp-borrowed-bill-tracer",
  storageBucket: "nuipp-borrowed-bill-tracer.firebasestorage.app",
  messagingSenderId: "619891247527",
  appId: "1:619891247527:web:8d52d0056e08c645ef8e82",
  measurementId: "G-CZV35KJJL5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);