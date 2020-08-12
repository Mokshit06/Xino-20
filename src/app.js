// const path = require('path');
const express = require('express');
const passport = require('passport');
// const expresshbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectToDB = require('../config/mongoose');
const { connection } = require('mongoose');
const initializePassport = require('../config/passport');
const { NODE_ENV, SESSION_SECRET, PORT } = process.env;

const authRouter = require('./routes/auth');

const app = express();

if (NODE_ENV === 'development') {
  require('dotenv').config();
}

connectToDB();
initializePassport(passport);

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: SESSION_SECRET,
    store: new MongoStore({
      mongooseConnection: connection,
    }),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

app.listen(3000, () => console.log(`Server running on ${PORT}`));
