// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_6C2O_DVAMjHbS-rrrgx1VLzSTHD1Jas",
    authDomain: "venezolanosenquilmes-2b1cf.firebaseapp.com",
    projectId: "venezolanosenquilmes-2b1cf",
    storageBucket: "venezolanosenquilmes-2b1cf.appspot.com",
    messagingSenderId: "253616014487",
    appId: "1:253616014487:web:f7eaa6893b13671bd815d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);