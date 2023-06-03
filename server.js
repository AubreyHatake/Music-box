const express = require('express')
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const sequelize = require('./config/connection');
const routes = require('./controllers');
const app = express()
const port = 3001
dotenv.config();


const exphbs  = require('express-handlebars');
app.engine('.handlebars', exphbs.engine({extname: '.handlebars',layoutsDir:'./views'}));
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);
sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => console.log(`app listening on port ${port} !! `));
});


