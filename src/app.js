const path = require('path');
const express = require('express');
const passport = require('passport');
// const expresshbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectToDB = require('../config/mongoose');
const { connection } = require('mongoose');
const initializePassport = require('../config/passport');
const { ensureAuthenticated, ensureGuest } = require('./middleware/auth');
const { NODE_ENV, SESSION_SECRET, PORT } = process.env;
// const { stars } = require('./helpers/helpers');

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

// app.engine(
//   '.hbs',
//   expresshbs({
//     defaultLayout: false,
//     extname: '.hbs',
//     helpers: {
//       stars,
//     },
//   })
// );

// app.set('view engine', '.hbs');
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

  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/booking', ensureAuthenticated, bookingRouter);
app.use('/hotels', hotelsRouter);

app.listen(3000, () => console.log(`Server running on ${PORT}`));
