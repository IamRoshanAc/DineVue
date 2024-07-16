const jwt = require('jsonwebtoken');
require('dotenv').config();

const authGuard = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'No token provided.'
    });
  }

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to authenticate token.'
      });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = { authGuard };
