const ensureAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.redirect('/', 401);
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
  res.redirect('/login', 403);
};

module.exports = {
  ensureAuthenticated,
  ensureGuest,
  ensureDealer,
};
