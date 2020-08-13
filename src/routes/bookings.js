const express = require('express');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const router = express.Router();

router.get('/', (req, res) => {
  const bookings = [{ name: 'a' }];
  res.render('booking', {
    bookings,
  });
});

router.post('/:hotel', async (req, res) => {
  const { user } = req;
  const { hotel } = req.params;
  const { rooms } = req.body;

  const booking = await Booking.create({
    user,
    hotel,
    rooms,
  });

  res.send(booking);
});

module.exports = router;
