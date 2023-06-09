const { User, Review } = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');


// GET /api/users this is the route we are hitting in insomnia core to get all users
router.get('/', (req, res) => {
  // Access our User model and run .findAll() method
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET /api/users/1 this is the route we are hitting in insomnia core to get a single user by id
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Review,
        attributes: ['review_id', 'album_id', 'user_id', 'review']
      }
    ]
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'User ID not found' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST request to create a new user
router.post('/', (req, res) => {
  console.log(req.body);
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.name = dbUserData.name;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })
});

//POST route to login a user

router.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password' });
      return;
    }
    // this is where we save the session once the user is logged in for the duration of the session
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.name = dbUserData.name;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
});

// logout route will destroy the session and log the user out
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});

module.exports = router;
// TODO: PUT request to update a user by id
router.put('/:id', withAuth, (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'User ID not found' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});