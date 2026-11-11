const { verifyAccess } = require('../../security');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  console.log('Verifying token:', token ? 'Token provided' : 'No token');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = verifyAccess(token, jwtSecret);
    if (decoded.role !== 'transport') return res.status(403).json({ error: 'Provider role required' });
    req.user = decoded;
    console.log('Token verified successfully for user:', req.user.username);
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = {
  verifyToken
};
