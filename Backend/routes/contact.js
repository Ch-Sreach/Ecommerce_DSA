// routes/contact.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { db, toPlainAll } = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  const { first_name, last_name, email, phone, subject, message } = req.body;
  db.prepare('INSERT INTO contacts (first_name, last_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)').run(first_name, last_name, email, phone || null, subject, message);
  res.status(201).json({ success: true, message: "Message sent! We'll reply within 24 hours 📧" });
});

router.get('/', requireAuth, requireAdmin, (req, res) => {
  const messages = toPlainAll(db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all());
  res.json({ success: true, messages, count: messages.length });
});

router.post('/subscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  const { email } = req.body;
  try {
    db.prepare('INSERT INTO subscribers (email) VALUES (?)').run(email);
    res.status(201).json({ success: true, message: 'Subscribed! Welcome to LUXE ✨' });
  } catch {
    res.json({ success: true, message: "You're already subscribed! Welcome back ✨" });
  }
});

router.get('/subscribers', requireAuth, requireAdmin, (req, res) => {
  const subscribers = toPlainAll(db.prepare('SELECT * FROM subscribers ORDER BY subscribed_at DESC').all());
  res.json({ success: true, subscribers, count: subscribers.length });
});

module.exports = router;
