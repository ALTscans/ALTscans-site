const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const cors = require('cors');
const app = express()
const port = 3000
const { limiter } = require("./checkIfwebsiteOrRandomIdiot")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// CORS configuration
app.use(cors({
  origin: ['https://your-frontend-domain.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', limiter, (req, res) => {
  res.json('This is the API used for AltScans Website. Created by https://github.com/AeolusDev');
});


// Define Routes
const createUserRoute = require('./routes/createUsers');
const retrieveUsersRoute = require('./routes/retrieveUsers')

// Use Routes
app.use('/createUser', createUserRoute)

app.listen(port, () => {
  console.log(`API now listening on port http://localhost:${port}`)
})