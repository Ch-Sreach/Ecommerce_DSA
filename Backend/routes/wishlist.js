// routes/wishlist.js
const express = require('express');
const { db, toPlain, toPlainAll } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

function getUserWishlist(userId) {
  return toPlainAll(db.prepare(`
    SELECT w.id, w.added_at,
           p.id as product_id, p.name, p.price, p.old_price, p.image, p.badge, p.category
    FROM wishlist w JOIN products p ON p.id = w.product_id
    WHERE w.user_id = ? ORDER BY w.added_at DESC
  `).all(userId));
}

router.get('/', (req, res) => {
  const items = getUserWishlist(req.user.id);
  res.json({ success: true, items, count: items.length });
});

router.post('/', (req, res) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ success: false, message: 'product_id is required' });
  if (!toPlain(db.prepare('SELECT id FROM products WHERE id = ?').get(product_id))) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  const existing = toPlain(db.prepare('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?').get(req.user.id, product_id));
  if (existing) {
    db.prepare('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?').run(req.user.id, product_id);
    const items = getUserWishlist(req.user.id);
    return res.json({ success: true, message: 'Removed from wishlist', wishlisted: false, items, count: items.length });
  }
  db.prepare('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)').run(req.user.id, product_id);
  const items = getUserWishlist(req.user.id);
  res.status(201).json({ success: true, message: 'Added to wishlist', wishlisted: true, items, count: items.length });
});

router.delete('/:product_id', (req, res) => {
  db.prepare('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?').run(req.user.id, req.params.product_id);
  const items = getUserWishlist(req.user.id);
  res.json({ success: true, message: 'Removed from wishlist', items, count: items.length });
});

module.exports = router;
