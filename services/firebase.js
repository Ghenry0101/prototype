// Import firebase core
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDz0JFiuq5sYcUUIHRxR_Fb7nNZRGDqdk8",
  authDomain: "locator-dccf6.firebaseapp.com",
  databaseURL: "https://locator-dccf6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "locator-dccf6",
  storageBucket: "locator-dccf6.firebasestorage.app",
  messagingSenderId: "637860668160",
  appId: "1:637860668160:web:b5ec092372e2812f99c9e5",
  measurementId: "G-8CN84BCJCD"
};

// Avoid re-initialize error
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, updateDoc, doc };
