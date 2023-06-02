const { User, Review } = require('../../models');
const router = require('express').Router(); 
const sequelize = require('../../config/connection');


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

// GET /api/users/1
router.get('/:id', (req, res) => {
  User.findOne({
      attributes: { exclude: ['password']},
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

        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.name = dbUserData.name;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

// logout route
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
  
  //  User.create({ 
  //   name:"specialK",
  //   email:"khole@test.test",
  //   password:"keta-4-life"
  //   })
  //   .then((user) => {
  //     console.log(user.dataValues)

  //     Review.create({
  //       album_id: "1234",
  //       user_id: user.dataValues.user_id,
  //       review: "this is a review"
  //     })
  //     .then((review) => {
  //       console.log(review)
  //     })
  //   })
    
