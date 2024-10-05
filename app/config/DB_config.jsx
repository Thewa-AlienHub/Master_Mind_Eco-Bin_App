// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {getDatabase ,ref,onValue} from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLGFEJFcjd-GGWn3PFeaw3DLSJQlUlmGk",
  authDomain: "ecobin-ed682.firebaseapp.com",
  databaseURL: "https://ecobin-ed682-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecobin-ed682",
  storageBucket: "ecobin-ed682.appspot.com",
  messagingSenderId: "146586031659",
  appId: "1:146586031659:web:43632b8a87bee2dbed7c6e",
  measurementId: "G-GLKZ84ET6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const DB = getFirestore(app);
export const database = getDatabase(app);
export const refDB = ref(database);
export const onValueDB = onValue;