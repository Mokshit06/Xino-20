const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

router.get('/', async (req, res) => {
  const hotels = await Hotel.find({});

  res.render('hotels/index', {
    hotels,
  });
});

router.get('/create', async (req, res) => {
  res.render('hotels/create');
});

// router.post('/create', async (r))

module.exports = router;
