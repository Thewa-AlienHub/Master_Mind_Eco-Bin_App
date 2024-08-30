// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMRxbuNTS820qCH_TOwGPkNrEcXmmwn28",
  authDomain: "ecobin-20143.firebaseapp.com",
  projectId: "ecobin-20143",
  storageBucket: "ecobin-20143.appspot.com",
  messagingSenderId: "186173999199",
  appId: "1:186173999199:web:770ac4c917765c978973ea",
  measurementId: "G-L5YBWZ6QCH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const DB = getFirestore(app);