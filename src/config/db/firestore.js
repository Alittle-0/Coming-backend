// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
const { getAuth, GoogleAuthProvider } = require("firebase/auth");

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
const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

module.exports = {
  database,
  auth,
  provider,
};
