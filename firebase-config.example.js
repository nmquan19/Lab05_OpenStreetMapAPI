// Firebase Configuration
// This file initializes Firebase with your project credentials
// Copy this file to firebase-config.js and replace with your Firebase project configuration

// Get your Firebase configuration from:
// Firebase Console > Project Settings > General > Your apps > SDK setup and configuration

const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
// Note: Firebase will be initialized in auth.js after the SDK is loaded
