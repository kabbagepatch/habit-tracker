const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

// const firebase = require('firebase/app');
// const firebaseAuth = require('firebase/auth');
// const firebaseAdmin = require('firebase-admin');

const express = require('express');
const app = express();

const userRoutes = require('./users');
const habitRoutes = require('./habits');

// const firebaseConfig = {
//   apiKey: '',
//   authDomain: 'habitsapi-426700.firebaseapp.com',
//   projectId: 'habitsapi-426700',
//   storageBucket: 'habitsapi-426700.appspot.com',
//   messagingSenderId: '472591136365',
//   appId: '1:472591136365:web:6129ffd560b9c66e7cf164',
//   measurementId: 'G-TF2VLVQTLR'
// };

// const firebaseApp = firebase.initializeApp(firebaseConfig);
// const auth = firebaseAuth.getAuth(firebaseApp);

app.get('/', (req, res) => {
  res.send('Hello from Habits App Engine!');
});

app.use('/users', userRoutes);
app.use('/habits', habitRoutes);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
