const path = require('path');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { connection } = require('mongoose');
const morgan = require('morgan');
const connectToDB = require('../config/mongoose');
const initializePassport = require('../config/passport');
const { ensureAuthenticated, ensureGuest } = require('./middleware/auth');
const { NODE_ENV, SESSION_SECRET, PORT } = process.env;

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const bookingRouter = require('./routes/bookings');
const hotelsRouter = require('./routes/hotels');
const transportRouter = require('./routes/transport');

const app = express();

if (NODE_ENV == 'development') {
  require('dotenv').config();
  app.use(morgan('dev'));
}

connectToDB();
initializePassport(passport);

app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  res.locals.showStar = rating => {
    rating = parseFloat(rating);
    let numberOfStars = Math.round(rating);
    const emptyStars = 5 - numberOfStars;
    let html = '';
    for (let i = 0; i < numberOfStars; i++) {
      html += '<i class="fas fa-star"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      html += '<i class="far fa-star"></i>';
    }
    return html;
  };
  res.locals.showCovidStats = stats => {
    stats = parseInt(stats) || 'Not Found';
    if (stats > 10000) {
      return `
          <div class="covid-danger">
            <p>Active cases: ${stats.toLocaleString()}</p>
          </div>
        `;
    } else if (stats > 6000) {
      return `
          <div class="covid-medium">
            <p>Active cases: ${stats.toLocaleString()}</p>
          </div>
        `;
    } else {
      return `
          <div class="covid-good">
            <p>Active cases: ${stats.toLocaleString()}</p>
          </div>
        `;
    }
  };

  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/booking', ensureAuthenticated, bookingRouter);
app.use('/hotels', ensureAuthenticated, hotelsRouter);
app.use('/transport', ensureAuthenticated, transportRouter);
app.get('/*', (req, res) => res.render('error/404'));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
