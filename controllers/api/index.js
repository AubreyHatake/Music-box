const router = require('express').Router();
const reviewRoutes = require('./review-routes');
const spotifyRoutes = require('./spotify-routes');
const userRoutes = require('./user-routes');

router.use('/review', reviewRoutes);
router.use('/spotify', spotifyRoutes);
router.use('/user', userRoutes);

module.exports = router;
