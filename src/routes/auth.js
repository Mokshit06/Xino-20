const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureGuest } = require('../middleware/auth');

router.get(
  '/google',
  ensureGuest,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  ensureGuest,
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    console.log(req.body);
    res.redirect('/dashboard');
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
