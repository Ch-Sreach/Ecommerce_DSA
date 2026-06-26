// routes/auth.js
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { db, toPlain } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const SECRET  = process.env.JWT_SECRET || 'luxe_super_secret_key';
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: EXPIRES });
}
function userPublic(user) {
  const { password, ...rest } = user;
  return rest;
}

// POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { name, email, password } = req.body;
  const existing = toPlain(db.prepare('SELECT id FROM users WHERE email = ?').get(email));
  if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });

  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashed);
  const user   = toPlain(db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid));
  const token  = signToken(user);

  res.status(201).json({ success: true, message: 'Account created', token, user: userPublic(user) });
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { email, password } = req.body;
  const user = toPlain(db.prepare('SELECT * FROM users WHERE email = ?').get(email));
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = signToken(user);
  res.json({ success: true, message: 'Logged in', token, user: userPublic(user) });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const user = toPlain(db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id));
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user: userPublic(user) });
});

// PUT /api/auth/me
router.put('/me', requireAuth, [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { name, email, password } = req.body;
  const current = toPlain(db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id));

  const newName     = name     || current.name;
  const newEmail    = email    || current.email;
  const newPassword = password ? bcrypt.hashSync(password, 10) : current.password;

  if (email && email !== current.email) {
    const clash = toPlain(db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, req.user.id));
    if (clash) return res.status(409).json({ success: false, message: 'Email already in use' });
  }

  db.prepare('UPDATE users SET name=?, email=?, password=? WHERE id=?').run(newName, newEmail, newPassword, req.user.id);
  const updated = toPlain(db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id));
  res.json({ success: true, message: 'Profile updated', user: userPublic(updated) });
});

module.exports = router;
