const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  beds: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
