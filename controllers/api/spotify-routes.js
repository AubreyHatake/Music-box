const router = require('express').Router(); 
 
router.get('/spotify/lookup', async (req, res) => {
    let albumid = req.query.albumid;
      res.send(await fetchAlbumById(albumid))
  })
  
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
  
  router.get('/spotify-api', (req, res) => {
    let q = req.query.q;
    
      try {
        axios.get('https://api.spotify.com/v1/search')
        .then((response) => {
          // console.log(response);
        console.log(response.data);
        res.send(response.data)
        })
        .catch(function (error) {
          axios.post('https://accounts.spotify.com/api/token', null,{
            params: {
            client_id:'e8f6052205af42f6a10e9117b2aef8c5',
            grant_type:'client_credentials',
            client_secret:`${process.env.CLIENT_SECRET}`
  
          }, 
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          
          // refreshes token
          .then((response) => {
            axios.get('https://api.spotify.com/v1/search', {
              headers: { Authorization: `Bearer ${response.data.access_token}` },
              params: {
                q: q,
                type:'album'
              }
          })
  
          .then((response) => {
          // console.log(response);
          console.log(response.data.albums);
          // exphbs.getTemplate('./views/search-result.handlebars')
          res.render("search-results",response.data.albums)
          // res.send(response.data)
        })
            // console.log(response.data);
            // res.send(response.data);
          })
  
         })
      } catch (error) {
        console.log("bad new bears");
      }
  })
  module.exports = router