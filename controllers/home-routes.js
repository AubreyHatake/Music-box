const router = require('express').Router();
const { Review, User } = require('../models');
const withAuth = require('../utils/auth');
const axios = require('axios')

router.get('/', async (req, res) => {
  try {
    const session = req.session;
    const loggedIn = session.loggedIn || false;
    res.render('homepage', {
      loggedIn: loggedIn


    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/review/:id', async (req, res) => {
  try {
    const reviewData = await Review.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const review = reviewData.get({ plain: true });
    const session = req.session;
    const loggedIn = session.loggedIn || false;
    res.render('review', {
      ...project,
      loggedIn: loggedIn
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  // try {
  // Find the logged in user based on the session ID
  const userData = await User.findByPk(req.session.user_id);
  console.log(userData)
  // const user = userData.get({ plain: true });
  const session = req.session;
  const loggedIn = session.loggedIn || false;
  res.render('profile', {
    ...userData,
    loggedIn: loggedIn
  });
  // } catch (err) {
  //   res.status(500).json(err);
  // }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route

  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

var apiToken
async function refreshToken() {
  const response = await axios.post('https://accounts.spotify.com/api/token', null, {
    params: {
      client_id: 'e8f6052205af42f6a10e9117b2aef8c5',
      grant_type: 'client_credentials',
      client_secret: `${process.env.CLIENT_SECRET}`
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  apiToken = response.data.access_token
  return true
}

router.get('/search-results/:searchTerm', async (req, res) => {

  const userData = await User.findByPk(req.session.user_id);
  const session = req.session;
  const loggedIn = session.loggedIn || false;
  let searchTerm = req.params.searchTerm;
  let albums = await trySearchAlbumByTerm(searchTerm)
  
  const renderData = {
    ...userData,
    loggedIn: loggedIn,
    albums: albums
  }
  console.log(renderData)
  res.render('search-results', renderData);

  async function trySearchAlbumByTerm(searchTerm) {
    let albums = await trySearchAlbum(searchTerm)
    if (!albums) {
      await refreshToken()
      albums = await trySearchAlbum(searchTerm)
    }
    return albums
  }
  async function trySearchAlbum(searchTerm) {
    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: { Authorization: `Bearer ${apiToken}` },
        params: {
          q: searchTerm,
          type: 'album'
        }
      })
      return response.data.albums
      
    } catch (error) {
      console.log(error)
    }
  }
})

router.get('/album/:albumid', async (req, res) => {
  let albumid = req.params.albumid;

  if (!req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  const response = await fetchAlbumById(albumid)
  console.log('response.data')
  console.log(response.data)
  res.render('album', response.data);

  async function fetchAlbumById(albumid) {
    let album = await tryFetchAlbum(albumid)
    if (!album) {
      await refreshToken()
      console.log('iamvalid')
      album = await tryFetchAlbum(albumid)
    }
    return album
  }

  async function tryFetchAlbum(albumid) {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/albums/${albumid}`, {
        headers: { Authorization: `Bearer ${apiToken}` }
      })
      return response
    } catch (error) { console.log(error) }
  }

});



module.exports = router;