// routes/auths.js — LUXE Auth Routes
// FIXES:
//   1. Changed 'bcryptjs' import (was 'bcrypt' which requires native build)
//   2. Removed 'express-validator' dependency (inline validation instead)
//   3. Added phone field to register for profile completeness

const express = require('express');
const bcrypt  = require('bcryptjs');             // FIX: was 'bcrypt' (needs build tools)
const jwt     = require('jsonwebtoken');
const { db, toPlain } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router  = express.Router();
const SECRET  = process.env.JWT_SECRET  || 'luxe_super_secret_key';
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

// ── Helpers ───────────────────────────────────────────────────────────────────

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET,
    { expiresIn: EXPIRES }
  );
}

function userPublic(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── POST /api/auth/register ───────────────────────────────────────────────────

router.post('/register', (req, res) => {
  const { name, email, password, phone } = req.body;

  // Inline validation (no express-validator needed)
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
  }
  if (!email || !validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'A valid email is required' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const existing = toPlain(
    db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim())
  );
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)'
  ).run(name.trim(), email.toLowerCase().trim(), hashed, phone || null);

  const user  = toPlain(db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid));
  const token = signToken(user);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: userPublic(user),
  });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'A valid email is required' });
  }
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  const user = toPlain(
    db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim())
  );
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = signToken(user);
  res.json({
    success: true,
    message: 'Logged in successfully',
    token,
    user: userPublic(user),
  });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────

router.get('/me', requireAuth, (req, res) => {
  const user = toPlain(db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id));
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user: userPublic(user) });
});

// ── PUT /api/auth/me ──────────────────────────────────────────────────────────

router.put('/me', requireAuth, (req, res) => {
  const { name, email, password, phone } = req.body;
  const current = toPlain(db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id));

  if (!current) return res.status(404).json({ success: false, message: 'User not found' });

  const newName  = name  ? name.trim()  : current.name;
  const newPhone = phone !== undefined  ? phone : current.phone;
  let newEmail   = current.email;
  let newPassword = current.password;

  if (email && email !== current.email) {
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    const clash = toPlain(
      db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email.toLowerCase().trim(), req.user.id)
    );
    if (clash) return res.status(409).json({ success: false, message: 'Email already in use' });
    newEmail = email.toLowerCase().trim();
  }

  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    newPassword = bcrypt.hashSync(password, 10);
  }

  db.prepare(
    'UPDATE users SET name=?, email=?, password=?, phone=? WHERE id=?'
  ).run(newName, newEmail, newPassword, newPhone, req.user.id);

  const updated = toPlain(db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id));
  res.json({ success: true, message: 'Profile updated', user: userPublic(updated) });
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
// JWT is stateless — client just deletes the token. This endpoint is a
// courtesy so the frontend can call a consistent logout URL.

router.post('/logout', requireAuth, (req, res) => {
  res.json({ success: true, message: 'Logged out. Please delete your token on the client.' });
});

module.exports = router;
