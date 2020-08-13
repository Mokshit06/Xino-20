const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
// todo Remove from github
const stripe = require('stripe')(
  'sk_test_51HFjqKKaWtllu6cPEVgWtZrKIkK2sopku9rurBqMUOvMqOq2JhNhGQuaTRhBncGV4Z42gczv4pOAoUZtMs1aNn9J00ff9qHowB'
);

router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const room = await Room.findById(roomId)
    .populate({
      path: 'hotel',
      populate: {
        path: 'user',
      },
    })
    .lean();

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
    success_url: `http://localhost:3000/booking/create/${room._id}`,
    cancel_url: 'http://localhost:3000/hotels',
  });

  res.render('hotels/booking', {
    session_id: session.id,
    room,
  });
});

router.get('/create/:room/', async (req, res) => {
  const { user } = req;
  const { room } = req.params;

  try {
    const booking = await Booking.create({
      user,
      room,
    });

    res.redirect('/');
  } catch (error) {
    console.log('THERE IS ERROR \n\n\n');
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;
