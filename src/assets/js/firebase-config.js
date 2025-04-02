import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdhhQKYsO-tFCrGoOATj61euH-zMmEDwk",
  authDomain: "wellnessadvocate-89ba4.firebaseapp.com",
  projectId: "wellnessadvocate-89ba4",
  storageBucket: "wellnessadvocate-89ba4.firebasestorage.app",
  messagingSenderId: "840965371316",
  appId: "1:840965371316:web:1afae09ae21c85d44c6ee1",
  measurementId: "G-CVEV2717R8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, db, storage };