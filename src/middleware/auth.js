const ensureAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.redirect('/');
};

const ensureGuest = (req, res, next) => {
  if (req.user) {
    return res.redirect('/dashboard');
  }
  next();
};

const ensureDealer = (req, res, next) => {
  if (req.user.isDealer) {
    return next();
  }
  res.redirect('/login');
};

module.exports = {
  ensureAuthenticated,
  ensureGuest,
  ensureDealer,
};
