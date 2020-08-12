const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hotel',
  },
  price: {
    type: String,
    required: true,
  },
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
