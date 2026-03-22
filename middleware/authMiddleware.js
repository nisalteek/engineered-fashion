const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  res.redirect('/admin/login');
};

const isGuest = (req, res, next) => {
  if (!req.session || !req.session.adminId) {
    return next();
  }
  res.redirect('/admin/dashboard');
};

module.exports = { isAuthenticated, isGuest };