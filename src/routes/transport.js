const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { ensureDealer } = require('../middleware/auth');
const Transport = require('../models/Transport');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

router.get('/', async (req, res) => {
  const transports = await Transport.find({});

  res.render('transport/index', {
    transports,
  });
});

router.get('/create', async (req, res) => {
  res.render('transport/create');
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
    const {
      name,
      description,
      price,
      state,
      country,
      typeOfTransport,
    } = req.body;

    if (!req.file) {
      res.render('error/500');
    }

    const duplicateTransport = await Transport.find({ name, state });

    if (duplicateTransport.length > 0) {
      return res.render('transport/create', {
        error: 'This transport already exists.',
      });
    }

    const transport = await Transport.create({
      user: req.user.id,
      name,
      state,
      country,
      typeOfTransport,
      description,
      price,
      image: req.file.path,
    });

    res.redirect(`/transport/${transport.id}`);
  }
);

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.render('error/404');
  }

  const transport = await Transport.findById(id);

  if (!transport) {
    return res.render('error/404');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: transport.name,
            images: [transport.image],
          },
          unit_amount: `${transport.price}00`,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.MAIN_URL}/`,
    cancel_url: `${process.env.MAIN_URL}/transport`,
  });

  res.render('transport/view', {
    transport,
    session_id: session.id,
  });
});

module.exports = router;
