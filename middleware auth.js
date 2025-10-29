// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET = 'your_jwt_secret';

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) return res.sendStatus(403);
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles, SECRET };
