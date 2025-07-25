// Import the functions you need from the SDKs you need
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQkulpZEkjC7ZJaduMH8nUMgxZN5K92_Y",
  authDomain: "coming-chat123.firebaseapp.com",
  databaseURL:
    "https://coming-chat123-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "coming-chat123",
  storageBucket: "coming-chat123.firebasestorage.app",
  messagingSenderId: "17053899718",
  appId: "1:17053899718:web:1bd18dc994c503376fb0c7",
  measurementId: "G-2XDL59J022",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export { auth, provider };
export default db;
