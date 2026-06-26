// server.js — LUXE Fashion Backend
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

// Initialize DB (creates tables + seeds products on first run)
require('./db/database');

// ── Routes ───────────────────────────────────────────────────────────────────
const authRouter     = require('./routes/auth');
const productsRouter = require('./routes/products');
const cartRouter     = require('./routes/cart');
const wishlistRouter = require('./routes/wishlist');
const ordersRouter   = require('./routes/orders');
const contactRouter  = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(cors({
  origin: '*',   // In production, restrict to your frontend domain
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── API Routes ────────────────────────────────────────────────────────────────

app.use('/api/auth',      authRouter);
app.use('/api/products',  productsRouter);
app.use('/api/cart',      cartRouter);
app.use('/api/wishlist',  wishlistRouter);
app.use('/api/orders',    ordersRouter);
app.use('/api/contact',   contactRouter);

// ── Health Check ──────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status:  'ok',
    name:    'LUXE Fashion API',
    version: '1.0.0',
    time:    new Date().toISOString(),
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ── Global Error Handler ──────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 LUXE Fashion API running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Products:     http://localhost:${PORT}/api/products`);
  console.log(`   Environment:  ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
