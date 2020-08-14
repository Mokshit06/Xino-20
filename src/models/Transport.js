const mongoose = require('mongoose');

const TransportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  typeOfTransport: {
    type: String,
    enum: ['Bus', 'Car', 'Plane'],
  },
  description: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

const Transport = mongoose.model('Transport', TransportSchema);

module.exports = Transport;
