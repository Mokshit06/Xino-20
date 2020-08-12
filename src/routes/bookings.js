const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const tickets = [{ name: 'a' }];
  res.render('ticket', {
    tickets,
  });
});

router.post('/', async (req, res) => {});

module.exports = router;
