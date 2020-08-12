const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../middleware/auth');

router.get('/', ensureGuest, (req, res) => res.render('login'));

router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard')
);

router.post('/dealer', ensureAuthenticated, async (req, res) => {
  req.user.isDealer = true;
  await req.user.save();
});

module.exports = router;
