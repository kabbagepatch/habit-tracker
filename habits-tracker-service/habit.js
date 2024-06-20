const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// Create habit
router.post('/', jsonParser, async (req, res, next) => {
  const {
    userId,
    name,
    description,
    frequency,
  } = req.body;

  try {
    const habitKey = datastore.key('Habit');
    const newHabit = {
      key: habitKey,
      data: {
        userId,
        name,
        description,
        frequency, // times per week
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
    await datastore.save(newHabit);
    res.status(201).json({ message: `Habit ${habitKey.id} created` });
  } catch (err) {
    next(err);
  }
});

// Display all habits
router.get('/', async (req, res, next) => {
  const { userId } = req.query;

  try {
    let query = datastore.createQuery('Habit');
    if (userId) {
      query = query.filter('userId', '=', datastore.int(userId))
    }
    const [habits] = await datastore.runQuery(query);
    const habitsWithId = habits.map(habit => {
      habit.id = habit[datastore.KEY].id;
      return habit;
    });
    res.status(200).send({ habits: habitsWithId });
  } catch (err) {
    next(err)
  }
});

// Display habit by ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const habitKey = datastore.key(['Habit', datastore.int(id)]);
    const [habit] = await datastore.get(habitKey);
    res.status(200).send({ habit });
  } catch (err) {
    next(err)
  }
});

// Update habit
router.put('/:id', jsonParser, async (req, res, next) => {
  const { id } = req.params;
  const {
    userId,
    name,
    description,
    frequency,
  } = req.body;

  try {
    const habitKey = datastore.key(['Habit', datastore.int(id)]);
    const [habit] = await datastore.get(habitKey);
    if (!habit) {
      return res.status(404).send('Habit not found');
    }
    if (habit.userId !== userId) {
      return res.status(403).send('Forbidden: You do not have access to this habit');
    }

    habit.name = name || habit.name;
    habit.description = description || habit.description;
    habit.frequency = frequency || habit.frequency;
    habit.updatedAt = new Date();

    await datastore.save({ key: habitKey, data: habit });
    res.status(200).send({ message: `Habit ${habitKey.id} updated`, habit });
  } catch (err) {
    next(err);
  }
});

// Delete habit by email
router.delete('/:id', async (req, res, next) => {
  const { id, userId } = req.params;
  try {
    const habitKey = datastore.key(['Habit', datastore.int(id)]);
    const [habit] = await datastore.get(habitKey);
    if (!habit) {
      return res.status(404).send('Habit not found');
    }
    if (habit.userId !== userId) {
      return res.status(403).send('Forbidden: You do not have access to this habit');
    }

    await datastore.delete(habitKey);
    res.status(204);
  } catch (err) {
    next(err)
  }
});

module.exports = router;
