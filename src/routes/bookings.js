const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const mongoose = require('mongoose');
const {
  sendBookingEmailDealer,
  sendBookingEmailUser,
} = require('../utils/email');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
// todo Remove from github
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.render('error/404');
  }

  try {
    const room = await Room.findById(roomId)
      .populate({
        path: 'hotel',
        populate: {
          path: 'user',
        },
      })
      .lean();

    if (!room) {
      return res.render('error/404');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: room.name,
              images: [room.image],
            },
            unit_amount: `${room.price}00`,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.MAIN_URL}/booking/create/${room._id}`,
      cancel_url: `${process.env.MAIN_URL}/hotels`,
    });

    res.render('booking', {
      session_id: session.id,
      room,
    });
  } catch (error) {
    return res.render('error/500');
  }
});

router.get('/create/:room/', async (req, res) => {
  const { user } = req;
  const { room: roomId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.render('error/404');
  }

  try {
    const room = await Room.findById(roomId).populate({
      path: 'hotel',
      populate: {
        path: 'user',
      },
    });

    if (!room) {
      return res.render('error/404');
    }

    const booking = await Booking.create({
      user,
      room,
    });

    sendBookingEmailDealer({
      dealerEmail: room.hotel.user.email,
      customer: {
        email: req.user.email,
        name: req.user.displayName,
      },
      room: room.name,
      hotel: room.hotel.name,
    });

    sendBookingEmailUser({
      email: req.user.email,
      name: req.user.firstName,
      hotel: room.hotel.name,
      room: room.name,
    });

    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.render('error/500');
  }
});

module.exports = router;
