const express = require('express')
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sessions = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(sessions.Store);

const app = express()
const port = 3001
dotenv.config();

const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
const session = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};
// app.use(sessions({
//   loggedIn:false

// }));

app.use(sessions(session));
// data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => console.log(`app listening on port ${port} !! `));
});


