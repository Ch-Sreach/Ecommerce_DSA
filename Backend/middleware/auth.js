// middleware/auth.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'luxe_super_secret_key';

/**
 * Protects routes — requires a valid Bearer token.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: no token provided' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized: invalid or expired token' });
  }
}

/**
 * Admin-only guard — must come after requireAuth.
 */
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: admin access required' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
