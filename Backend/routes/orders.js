// routes/orders.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { db, toPlain, toPlainAll } = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const orders = req.user.role === 'admin'
    ? toPlainAll(db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all())
    : toPlainAll(db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id));

  const withCount = orders.map(o => {
    const r = toPlain(db.prepare('SELECT SUM(quantity) as total FROM order_items WHERE order_id = ?').get(o.id));
    return { ...o, item_count: r?.total || 0 };
  });
  res.json({ success: true, orders: withCount });
});

router.get('/:id', (req, res) => {
  const order = toPlain(db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id));
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (req.user.role !== 'admin' && order.user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Forbidden' });
  const items = toPlainAll(db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id));
  res.json({ success: true, order: { ...order, items } });
});

router.post('/', [
  body('shipping.name').notEmpty().withMessage('Shipping name required'),
  body('shipping.email').isEmail().withMessage('Valid shipping email required'),
  body('shipping.address').notEmpty().withMessage('Shipping address required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { shipping, payment_method = 'cod', note, items: bodyItems } = req.body;

  let cartItems;
  if (bodyItems && Array.isArray(bodyItems) && bodyItems.length > 0) {
    cartItems = bodyItems.map(i => {
      const p = toPlain(db.prepare('SELECT * FROM products WHERE id = ?').get(i.product_id));
      if (!p) throw new Error(`Product ${i.product_id} not found`);
      return { ...p, product_id: p.id, quantity: i.quantity || 1 };
    });
  } else {
    cartItems = toPlainAll(db.prepare(`
      SELECT c.quantity, p.id as product_id, p.name, p.price, p.image
      FROM cart c JOIN products p ON p.id = c.product_id WHERE c.user_id = ?
    `).all(req.user.id));
  }

  if (!cartItems || cartItems.length === 0) return res.status(400).json({ success: false, message: 'No items to order' });

  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  try {
    // SQLite transaction via begin/commit
    db.exec('BEGIN');
    const result = db.prepare(`
      INSERT INTO orders (user_id, total, shipping_name, shipping_email, shipping_phone, shipping_address, payment_method, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, parseFloat(total.toFixed(2)), shipping.name, shipping.email, shipping.phone || null, shipping.address, payment_method, note || null);

    const orderId = result.lastInsertRowid;
    const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, product_name, product_img, price, quantity) VALUES (?, ?, ?, ?, ?, ?)');

    for (const item of cartItems) {
      insertItem.run(orderId, item.product_id || item.id, item.name, item.image, item.price, item.quantity);
    }
    db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user.id);
    db.exec('COMMIT');

    const order = toPlain(db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId));
    const items = toPlainAll(db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId));
    res.status(201).json({ success: true, message: 'Order placed successfully', order: { ...order, items } });
  } catch (err) {
    db.exec('ROLLBACK');
    res.status(500).json({ success: false, message: err.message || 'Failed to place order' });
  }
});

router.patch('/:id/status', requireAdmin, (req, res) => {
  const VALID = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  const { status } = req.body;
  if (!VALID.includes(status)) return res.status(400).json({ success: false, message: `Status must be one of: ${VALID.join(', ')}` });
  const result = db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, req.params.id);
  if (!result.changes) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, message: `Order status updated to '${status}'` });
});

module.exports = router;
