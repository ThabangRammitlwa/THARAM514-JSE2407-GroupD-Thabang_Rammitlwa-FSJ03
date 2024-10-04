// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
 getDocs
  
} from 'firebase/firestore';

/*const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);*/



// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyB_yzRuB5TZn6jdWQCBa_cOexCyItK96M8",
  authDomain: "familystore-34a80.firebaseapp.com",
  projectId: "familystore-34a80",
  storageBucket: "familystore-34a80.appspot.com",
  messagingSenderId: "654048365740",
  appId: "1:654048365740:web:8a1dae3461c0fb585ee309"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//init services
const db = getFirestore(app)

//collection ref
const colRef = collection(db,'products,categories')

//get collection data

getDocs(colRef)
  /*.then(() => { 
console.log(snapshot.docs)
})*/
export { db };
