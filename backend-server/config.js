require('dotenv').config()
// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } =  require("firebase/auth");

const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
}

console.log(firebaseConfig);

module.exports =  { initializeApp, getAuth, firebaseConfig, signInWithEmailAndPassword, createUserWithEmailAndPassword };
