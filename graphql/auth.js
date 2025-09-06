const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'top-secret';

function authenticateJWT(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

module.exports = { authenticateJWT };
