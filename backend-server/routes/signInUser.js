require('dotenv').config()
// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } =  require("firebase/auth");
const { validateApiKey, limiter } = require('../checkIfwebsiteOrRandomIdiot');

const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
}

const fb = initializeApp(firebaseConfig);
const auth = getAuth(fb);

const express = require('express');
const app = express()
const router = express.Router();


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

router.post('/', validateApiKey, limiter, async(req, res) => {
    let email = req.body.email;
    let pwd = req.body.pwd;
    console.log(`SignIn: ` + email + ` || ` + pwd);
    

    try{ 
        const userCredential = await signInWithEmailAndPassword(auth, email, pwd);
        console.log(`UserCred: ` + JSON.stringify(userCredential.user));
    }catch (error){
        console.log(error.code);
        res.json(error.code);
    }
})

module.exports = router;