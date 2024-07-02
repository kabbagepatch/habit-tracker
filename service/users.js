const bcrypt = require('bcryptjs');
const firebaseAuth = require('firebase/auth');

const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// Login
router.post('/login', jsonParser, async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userQuery = datastore
      .createQuery('User')
      .filter('email', '=', email.toLowerCase())
      .limit(1);
    const [users] = await datastore.runQuery(userQuery);
    if (users.length === 0) {
      res.status(404).send(`User ${email} does not exist.`);
      return;
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(403).send(`Password does not match.`);
      return;
    }
    user.id = user[datastore.KEY].id;
    delete user.password

    res.status(200).json({ message: `User ${email} logged in`, user });
  } catch (err) {
    next(err);
  }
});

// Signup
router.post('/signup', jsonParser, async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userKey = datastore.key('User');

    const userExistsQuery = datastore
      .createQuery('User')
      .filter('email', '=', email.toLowerCase())
      .limit(1);
    const [existingUsers] = await datastore.runQuery(userExistsQuery);
    if (existingUsers.length > 0) {
      res.status(400).send('User already exists.')
      return;
    }

    const auth = firebaseAuth.getAuth();
    const userCred = await firebaseAuth.createUserWithEmailAndPassword(auth, email, password);
    console.log(userCred);
    const user = userCred.user;
    console.log(user);

    const newUser = {
      key: userKey,
      data: {
        name,
        email: email.toLowerCase(),
        password: await bcrypt.hash(password, 10),
        createdAt: new Date(),
      }
    };
    await datastore.save(newUser);
    res.status(201).json({ message: `User ${userKey.id} signed up` });
  } catch (err) {
    next(err);
  }
});

// Display all users
router.get('/', async (req, res, next) => {
  try {
    const query = datastore.createQuery('User');
    const [users] = await datastore.runQuery(query);
    const usersWithId = users.map(user => {
      user.id = user[datastore.KEY].id;
      return user;
    });
    res.status(200).send({ users: usersWithId });
  } catch (err) {
    next(err);
  }
});

// Display user by ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const userKey = datastore.key(['User', datastore.int(id)]);
    const [user] = await datastore.get(userKey);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
});

// Delete user by email
router.delete('/:id', async (req, res, next) => {  
  const auth = firebaseAuth.getAuth();
  await firebaseAuth.signInWithEmailAndPassword(auth, "kavishmunjal123@gmail.com", "#TestPass13")
  await auth.currentUser.delete()

  const { id } = req.params;
  try {
    const userKey = datastore.key(['User', datastore.int(id)]);
    await datastore.delete(userKey);
    res.status(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
