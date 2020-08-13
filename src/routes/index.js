const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const { ensureAuthenticated, ensureGuest } = require('../middleware/auth');

router.get('/', ensureGuest, (req, res) => res.render('login'));

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate({
      path: 'room',
      populate: {
        path: 'hotel',
      },
    })
    .lean();
  let hotels = [];

  if (req.user.isDealer) {
    hotels = await Hotel.find({ user: req.user }).lean();
  }

  res.render('dashboard', {
    bookings,
    hotels,
  });
});

router.post('/dealer', ensureAuthenticated, async (req, res) => {
  req.user.isDealer = true;
  await req.user.save();
});

module.exports = router;
