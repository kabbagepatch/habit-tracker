const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

const express = require('express');
const app = express();

const userRoutes = require('./user');
const habitRoutes = require('./habit');

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
