const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
  // bookedFor: {
  //   type: Date,
  //   required: true,
  // },
  // bookedFrom: {
  //   type: Date,
  //   required: true,
  // },
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
