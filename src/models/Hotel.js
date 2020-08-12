const mongoose = require('mongoose');
const geocode = require('../utils/geocode');

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  covid: {
    type: String,
    default: 'Unknown',
  },
  area: {
    type: String,
    required: true,
  },
  coordinates: {
    type: Array,
  },
});

HotelSchema.pre('save', async function (next) {
  const hotel = this;
  try {
    const coords = await geocode(hotel.area);
    hotel.coordinates = coords;
    next();
  } catch (error) {
    next();
  }
});

const Hotel = mongoose.model('Hotel', HotelSchema);

module.exports = Hotel;
