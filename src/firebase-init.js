// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJH7cJzIe6skeTfP-Fq0dbAO7xF5SOM_Q",
  authDomain: "expense-tracker-eddc9.firebaseapp.com",
  projectId: "expense-tracker-eddc9",
  storageBucket: "expense-tracker-eddc9.appspot.com",
  messagingSenderId: "1070487076422",
  appId: "1:1070487076422:web:eea5654d211ab0c9385447"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);