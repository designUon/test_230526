// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

// firebase 초기화
// https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ko&authuser=0#initialize
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "test230526.firebaseapp.com",
    projectId: "test230526",
    storageBucket: "test230526.appspot.com",
    messagingSenderId: "537798690201",
    appId: "1:537798690201:web:7be0121653d9ba6f9eff08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// firebase 초기화
// https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ko&authuser=0#initialize
export const db = getFirestore(app);