const express = require('express')
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const sequelize = require('./config/connection');
const apiRoutes = require('./controllers/api/user-routes');
const spotifyRoutes = require('./controllers/api/spotify-routes');
const app = express()
const port = 3001
dotenv.config();

const exphbs  = require('express-handlebars');
app.engine('.handlebars', exphbs.engine({extname: '.handlebars',layoutsDir:'./views'}));
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/spotify-api', (req, res) => {
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

app.use('/', express.static(path.join(__dirname, 'public')))
spotifyRoutes.applyRoutes()
sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => console.log(`app listening on port ${port} !! `));
});
