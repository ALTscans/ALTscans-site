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

const fb = initializeApp(firebaseConfig);
const auth = getAuth(fb);

const express = require('express');
const app = express()
const router = express.Router();


app.use(express.json())
app.use(express.urlencoded({ extended: false }))


router.post('/', async(req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let pwd = req.body.pwd;
    
    console.log(req.body)
    console.log(username + `||` + email + `||` + pwd)
    console.log(auth)
    // Signup User
    createUserWithEmailAndPassword(auth, email, pwd).then(userCredential => {
        console.log(userCredential);
        res.json(userCredential);      
    }).catch((error) => {
        const errCode = error.code;
        const errMsg = error.message;
        let msg = [
            {
                errorcCode: errCode,
                errorMsg: errMsg
            }
        ];
        console.log(`error ${errCode}: ${errMsg}`);
        res.json(msg);
    })

})


module.exports = router;