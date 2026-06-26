// routes/cart.js
const express = require('express');
const { db, toPlain, toPlainAll } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

function getUserCart(userId) {
  return toPlainAll(db.prepare(`
    SELECT c.id, c.quantity, c.added_at,
           p.id as product_id, p.name, p.price, p.old_price, p.image, p.badge, p.category, p.stock
    FROM cart c JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ? ORDER BY c.added_at DESC
  `).all(userId));
}

function summary(items) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 5;
  return { subtotal: parseFloat(subtotal.toFixed(2)), shipping, total: parseFloat((subtotal + shipping).toFixed(2)), count: items.reduce((s, i) => s + i.quantity, 0) };
}

router.get('/', (req, res) => {
  const items = getUserCart(req.user.id);
  res.json({ success: true, items, summary: summary(items) });
});

router.post('/', (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  if (!product_id) return res.status(400).json({ success: false, message: 'product_id is required' });
  if (!toPlain(db.prepare('SELECT id FROM products WHERE id = ?').get(product_id))) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  const existing = toPlain(db.prepare('SELECT id FROM cart WHERE user_id = ? AND product_id = ?').get(req.user.id, product_id));
  if (existing) {
    db.prepare('UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?').run(quantity, req.user.id, product_id);
  } else {
    db.prepare('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)').run(req.user.id, product_id, quantity);
  }
  const items = getUserCart(req.user.id);
  res.json({ success: true, message: 'Added to cart', items, summary: summary(items) });
});

router.put('/:product_id', (req, res) => {
  const qty = parseInt(req.body.quantity);
  if (!qty || qty < 1) return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
  const result = db.prepare('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?').run(qty, req.user.id, req.params.product_id);
  if (!result.changes) return res.status(404).json({ success: false, message: 'Item not in cart' });
  const items = getUserCart(req.user.id);
  res.json({ success: true, message: 'Quantity updated', items, summary: summary(items) });
});

router.delete('/:product_id', (req, res) => {
  db.prepare('DELETE FROM cart WHERE user_id = ? AND product_id = ?').run(req.user.id, req.params.product_id);
  const items = getUserCart(req.user.id);
  res.json({ success: true, message: 'Item removed', items, summary: summary(items) });
});

router.delete('/', (req, res) => {
  db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user.id);
  res.json({ success: true, message: 'Cart cleared', items: [], summary: { subtotal: 0, shipping: 0, total: 0, count: 0 } });
});

module.exports = router;
