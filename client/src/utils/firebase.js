import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ai-exam-notes-generaator.firebaseapp.com",
  projectId: "ai-exam-notes-generaator",
  storageBucket: "ai-exam-notes-generaator.firebasestorage.app",
  messagingSenderId: "558422438477",
  appId: "1:558422438477:web:aaf5629a51bbbdf10ae204"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}