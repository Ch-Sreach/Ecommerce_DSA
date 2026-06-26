// routes/products.js
const express = require('express');
const { db, toPlain, toPlainAll } = require('../db/database');

const router = express.Router();

function parseProduct(p) {
  if (!p) return null;
  const obj = Object.assign({}, p);
  try { obj.tags = JSON.parse(obj.tags || '[]'); } catch { obj.tags = []; }
  return obj;
}

// GET /api/products
router.get('/', (req, res) => {
  const { category, tag, badge, search, sort = 'id', page = 1, limit = 20 } = req.query;

  let where = '1=1';
  const args = [];

  if (category && category !== 'all') { where += ' AND category = ?'; args.push(category); }
  if (badge)   { where += ' AND badge = ?'; args.push(badge); }
  if (search)  { where += ' AND (name LIKE ? OR description LIKE ?)'; args.push(`%${search}%`, `%${search}%`); }
  if (tag && tag !== 'all') { where += ' AND tags LIKE ?'; args.push(`%"${tag}"%`); }

  const SORT_MAP = { price_asc: 'price ASC', price_desc: 'price DESC', name_asc: 'name ASC', newest: 'id DESC', id: 'id ASC' };
  const orderBy = SORT_MAP[sort] || 'id ASC';

  const total  = toPlain(db.prepare(`SELECT COUNT(*) as count FROM products WHERE ${where}`).get(...args)).count;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const rows   = toPlainAll(db.prepare(`SELECT * FROM products WHERE ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`).all(...args, parseInt(limit), offset));

  res.json({ success: true, total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)), products: rows.map(parseProduct) });
});

// GET /api/products/categories
router.get('/categories', (req, res) => {
  const rows = toPlainAll(db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all());
  res.json({ success: true, categories: ['all', ...rows.map(r => r.category)] });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = toPlain(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  const related = toPlainAll(db.prepare('SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4').all(product.category, product.id));
  res.json({ success: true, product: parseProduct(product), related: related.map(parseProduct) });
});

module.exports = router;
