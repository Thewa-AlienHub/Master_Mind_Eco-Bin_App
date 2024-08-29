import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLGFEJFcjd-GGWn3PFeaw3DLSJQlUlmGk",
  authDomain: "ecobin-ed682.firebaseapp.com",
  projectId: "ecobin-ed682",
  storageBucket: "ecobin-ed682.appspot.com",
  messagingSenderId: "146586031659",
  appId: "1:146586031659:web:43632b8a87bee2dbed7c6e",
  measurementId: "G-GLKZ84ET6E",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export { firebase, auth, firestore, firebaseConfig };
