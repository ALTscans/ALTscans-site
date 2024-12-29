// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDHV06eYmF6v57gmBSlyB-ZGyMLEbVXC0",
  authDomain: "altscans-eb41a.firebaseapp.com",
  projectId: "altscans-eb41a",
  storageBucket: "altscans-eb41a.firebasestorage.app",
  messagingSenderId: "125401189899",
  appId: "1:125401189899:web:f1bfde8ac6405bf3d2c10e",
  measurementId: "G-YFH7LJKXEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);


const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get User Information
    const email = loginForm['emailField'].value;
    const pwd = loginForm['pwdField'].value;
    
    // Login User
});

function signupUser(signupForm) {
}

const signupForm = document.querySelector('#signupForm');
console.log(signupForm)
signupForm.addEventListener('submit', (e) => {
    console.log(signupForm)
    e.preventDefault();
        
    //get User Information
    const username = signupForm['signup-usernameField'].value;
    const email = signupForm['signup-emailField'].value;
    const pwd = signupForm['signup-pwdField'].value;
    console.log(signupForm)
    console.log(username + `||` + email + `||` + pwd);

    // Signup User
    createUserWithEmailAndPassword(auth, email, pwd).then(userCredential => {
        console.log(userCredential);        
    }).catch((error) => {
        const errCode = error.code;
        const errMsg = error.message;
        console.log(`error ${errCode}: ${errMsg}`);
    })
});












function showDialog() {
    document.getElementById('dialogOverlay').classList.add('active');
    document.getElementById('forgotPwdDialog').classList.add('active');
}

function closeDialog() {
    document.getElementById('dialogOverlay').classList.remove('active');
    document.getElementById('forgotPwdDialog').classList.remove('active');
}

function handleSocialAuth(provider) {
    const providers = {
        google: 'https://accounts.google.com/o/oauth2/v2/auth',
        naver: 'https://nid.naver.com/oauth2.0/authorize',
        facebook: 'https://www.facebook.com/v12.0/dialog/oauth',
        telegram: 'https://oauth.telegram.org/auth'
    };
    window.location.href = providers[provider];
}

document.getElementById('verifyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    closeDialog();
});

document.getElementById('dialogOverlay').addEventListener('click', closeDialog);