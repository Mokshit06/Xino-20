const path = require('path');
const express = require('express');
const passport = require('passport');
const expresshbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectToDB = require('../config/mongoose');
const { connection } = require('mongoose');
const initializePassport = require('../config/passport');
const { ensureAuthenticated, ensureGuest } = require('./middleware/auth');
const { NODE_ENV, SESSION_SECRET, PORT } = process.env;
const { stars } = require('./helpers/helpers');

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const bookingRouter = require('./routes/bookings');
const hotelsRouter = require('./routes/hotels');

const app = express();

if (NODE_ENV === 'development') {
  require('dotenv').config();
}

connectToDB();
initializePassport(passport);

app.use(express.static(path.join(__dirname, '../public')));

app.engine(
  '.hbs',
  expresshbs({
    defaultLayout: false,
    extname: '.hbs',
    helpers: {
      stars,
    },
  })
);

app.set('view engine', '.hbs');
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

app.use((req, res, next) => {
  res.locals.user = req.user ? req.user.toJSON() : null;
  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/booking', bookingRouter);
app.use('/hotels', hotelsRouter);

app.listen(3000, () => console.log(`Server running on ${PORT}`));
