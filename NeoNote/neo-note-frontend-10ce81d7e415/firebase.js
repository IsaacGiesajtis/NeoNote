// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyDFQKG8gVbgsNWvm6bDzJO_E-6yp7lSy0M",
    authDomain: "neo-note.firebaseapp.com",
    projectId: "neo-note",
    storageBucket: "neo-note.appspot.com",
    messagingSenderId: "906697576452",
    appId: "1:906697576452:web:414ce4fee9645151f8a551",
    measurementId: "G-3QBKFM7KMK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const storage = getStorage(app);
export default app;



