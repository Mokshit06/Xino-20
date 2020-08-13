const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { ensureDealer } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const hotels = await Hotel.find({}).lean();

  res.render('hotels/index', {
    hotels: JSON.stringify(hotels),
  });
});

router.get('/create', ensureDealer, async (req, res) => {
  res.render('hotels/create');
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'travel_app',
    transformation: [
      {
        width: 2400,
        height: 2000,
        crop: 'limit',
      },
    ],
  },
});

const parser = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(null, false);
    }

    cb(undefined, true);
  },
  storage: storage,
});

router.post(
  '/create',
  ensureDealer,
  parser.single('image'),
  async (req, res) => {
    const { name, area, description } = req.body;

    const duplicateHotel = await Hotel.find({ name, area });

    if (duplicateHotel.length > 0) {
      return res.render('hotels/create', {
        error: 'This hotel already exists.',
      });
    }

    const hotel = await Hotel.create({
      user: req.user.id,
      name,
      area,
      description,
      image: req.file.path,
    });

    res.redirect(`/hotels/${hotel.id}/rooms`);
  }
);

router.post(
  '/:id/rooms',
  ensureDealer,
  parser.single('hotelImage'),
  async (req, res) => {
    const id = req.params.id;
    const { name, price, beds, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ error: 'Invalid ID' });
    }

    const hotel = await Hotel.findById(id).lean();

    if (!hotel) {
      return res.json({ error: 'Hotel not found' });
    }

    if (req.user.id != hotel.user) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const duplicateRoom = await Room.find({ hotel: hotel.id, name });

    if (duplicateRoom.length > 0) {
      return res.render('hotels/create', {
        error: 'This hotel already exists.',
      });
    }

    await Room.create({
      hotel: hotel._id,
      name,
      beds,
      price,
      description,
      image: req.file.path,
    });

    res.redirect('/hotels');
  }
);

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: 'Invalid ID' });
  }

  const hotel = await Hotel.findById(id);

  if (!hotel) {
    return res.json({ error: 'Hotel not found' });
  }

  const rooms = await Room.find({ hotel: hotel.id }).lean();

  res.render('hotels/view', {
    hotel,
    rooms,
  });
});

router.get('/:id/rooms', ensureDealer, async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: 'Invalid ID' });
  }

  const hotel = await Hotel.findById(id).lean();

  if (!hotel) {
    return res.json({ error: 'Hotel not found' });
  }

  if (req.user.id != hotel.user) {
    return res.status(403).json({ message: 'Not allowed' });
  }

  res.render('hotels/rooms', {
    hotel,
  });
});

module.exports = router;
