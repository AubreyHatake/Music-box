const router = require('express').Router(); 
const { Review, User } = require('../models');
const withAuth = require('../utils/auth');
const axios = require('axios')

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    // const projectData = await Review.findAll({
    //   include: [
    //     {
    //       model: User,
    //       attributes: ['name'],
    //     },
    //   ],
    // });

    // Serialize data so the template can read it
    // const projects = projectData.map((project) => project.get({ plain: true }));

    // Pass serialized data and session flag into template
    // res.render('main', { 
    //   projects, 
    //   logged_in: req.session.logged_in 
    // });
    // const session = req.session;
    // const loggedIn = session.loggedIn || false;
    // console.log("logged in =")
    // console.log(loggedIn)
    res.render('homepage', {
      //loggedIn:loggedIn, 

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

    res.render('review', {
      ...project,
      logged_in: req.session.logged_in
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

    res.render('profile', {
      ...userData,
      // logged_in: false
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


router.get('/api/spotify/lookup/:albumid', (req, res) => {
  let albumid = req.query.albumid;
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  async function fetchAlbumById(albumid) {
    let album = await tryFetchAlbum (albumid)
    if (!album) {
      await refreshToken()
     album = await tryFetchAlbum (albumid)
    } 
    return album
  }
  async function tryFetchAlbum(albumid) {
    try {
     const response = await axios.get(`https://api.spotify.com/v1/albums/${albumid}`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      }) 
      console.log(response.data);
      return response.data
    } catch(error){console.log(error)}
  }
  var apiToken 
  async function refreshToken() {
    const response = await axios.post('https://accounts.spotify.com/api/token', null,{
      params: {
      client_id:'e8f6052205af42f6a10e9117b2aef8c5',
      grant_type:'client_credentials',
      client_secret:`${process.env.CLIENT_SECRET}`
    }, 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    
    apiToken = response.data.access_token
    return true
  }
  const response = fetchAlbumById(albumid)
  console.log(albumid)
  console.log(response.data)
  res.render('search-results', response.data);
});



module.exports = router;