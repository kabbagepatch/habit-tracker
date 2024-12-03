require('dotenv').config();

const firebase = require('firebase/app');
const firebaseAdmin = require('firebase-admin');

const express = require('express');
const app = express();

const userRoutes = require('./users');
const habitRoutes = require('./habits');

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: 'habitsapi-426700.firebaseapp.com',
  projectId: 'habitsapi-426700',
  storageBucket: 'habitsapi-426700.appspot.com',
  messagingSenderId: '472591136365',
  appId: '1:472591136365:web:6129ffd560b9c66e7cf164',
  measurementId: 'G-TF2VLVQTLR'
};

firebase.initializeApp(firebaseConfig);
const serviceAccount = require(process.env.ADMIN_ACCOUNT_JSON_PATH);
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

const authenticate = async (req, res, next) => {
  const idToken = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send('Unauthorized');
  }
};

app.get('/', (req, res) => {
  res.send('Hello from Habits App Engine!');
});

app.use('/users', userRoutes);
app.use('/habits', authenticate, habitRoutes);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
