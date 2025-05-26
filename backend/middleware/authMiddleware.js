const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT and attach user to req
exports.protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1]; // Bearer token
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Check admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) next();
  else res.status(403).json({ message: 'Not authorized as admin' });
};
