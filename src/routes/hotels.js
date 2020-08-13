const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const { ensureDealer } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  const hotels = await Hotel.find({}).lean();

  res.render('hotels/index', {
    hotels: JSON.stringify(hotels),
  });
});

router.get('/create', async (req, res) => {
  res.render('hotels/create');
});

router.post('/create', async (req, res) => {
  const { name, price, area, description } = req.body;

  const duplicateHotel = await Hotel.find({ name, area });

  if (duplicateHotel.length > 0) {
    return res.render('hotels/create', {
      error: 'This hotel already exists.',
    });
  }

  const hotel = await Hotel.create({
    name,
    price,
    area,
    description,
  });

  // res.render('hotels/image', {
  //   hotelID: hotel.id,
  // });
  res.redirect(`/hotels/${hotel.id}/image`);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: 'Invalid ID' });
  }

  const hotel = await Hotel.findById(id);

  if (!hotel) {
    return res.json({ error: 'Hotel not found' });
  }

  res.render('hotels/view', {
    hotel,
  });
});

router.get('/:id/image', async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: 'Invalid ID' });
  }

  const hotel = await Hotel.findById(id);

  if (!hotel) {
    return res.json({ error: 'Hotel not found' });
  }

  res.render('hotels/image', {
    hotelID: hotel.id,
  });
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
        width: 1200,
        height: 1000,
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

router.post('/:id/image', parser.single('image'), async (req, res) => {
  const id = req.params.id;

  if (!req.file) {
    return res.render('hotels/image', {
      error: 'Please provide a valid image',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.send('Invalid ID');
  }

  const hotel = await Hotel.findById(id);

  if (!hotel) {
    return res.send('Hotel not found');
  }

  hotel.image = req.file.path;

  await hotel.save();

  res.redirect('/');
});

module.exports = router;
