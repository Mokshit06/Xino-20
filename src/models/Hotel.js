const mongoose = require('mongoose');
const geocode = require('../utils/geocode');
const getCovidStats = require('../utils/covidStats');

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
  description: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  coordinates: {
    type: Array,
  },
  image: {
    type: String,
  },
});

HotelSchema.pre('save', async function (next) {
  const hotel = this;
  try {
    const data = await geocode(hotel.area);
    hotel.coordinates = data.coords;
    hotel.state = data.state;
    hotel.country = data.country;
    hotel.covid = await getCovidStats({
      country: hotel.country,
      state: hotel.state,
    });
    next();
  } catch (error) {
    next();
  }
});

const Hotel = mongoose.model('Hotel', HotelSchema);

module.exports = Hotel;
