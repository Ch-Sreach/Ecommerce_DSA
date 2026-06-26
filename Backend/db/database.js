// db/database.js — uses Node.js 22 built-in SQLite (no native build needed)
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const DB_PATH = path.join(__dirname, 'luxe.db');
const db = new DatabaseSync(DB_PATH);

// Enable WAL + foreign keys
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

// ─── Create Tables ──────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    role        TEXT    NOT NULL DEFAULT 'customer',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY,
    name        TEXT    NOT NULL,
    price       REAL    NOT NULL,
    old_price   REAL    NOT NULL,
    image       TEXT    NOT NULL,
    badge       TEXT    NOT NULL DEFAULT 'New',
    category    TEXT    NOT NULL,
    tags        TEXT    NOT NULL DEFAULT '[]',
    stock       INTEGER NOT NULL DEFAULT 100,
    description TEXT    NOT NULL DEFAULT '',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cart (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity    INTEGER NOT NULL DEFAULT 1,
    added_at    TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at    TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status           TEXT    NOT NULL DEFAULT 'pending',
    total            REAL    NOT NULL,
    shipping_name    TEXT    NOT NULL,
    shipping_email   TEXT    NOT NULL,
    shipping_phone   TEXT,
    shipping_address TEXT    NOT NULL,
    payment_method   TEXT    NOT NULL DEFAULT 'cod',
    note             TEXT,
    created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id     INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id   INTEGER NOT NULL,
    product_name TEXT    NOT NULL,
    product_img  TEXT    NOT NULL,
    price        REAL    NOT NULL,
    quantity     INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name  TEXT    NOT NULL,
    last_name   TEXT    NOT NULL,
    email       TEXT    NOT NULL,
    phone       TEXT,
    subject     TEXT    NOT NULL,
    message     TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT    NOT NULL UNIQUE,
    subscribed_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// ─── Seed Products ───────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1,  name: 'Classic Gray Shirt',      price: 25,  old: 35,  img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80', badge: 'Sale', tags: ['all','bestseller','sale'], cat: 'men',         desc: 'A timeless classic gray shirt for everyday wear.' },
  { id: 2,  name: 'Girl Summer Blouse',       price: 30,  old: 45,  img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80', badge: 'Sale', tags: ['all','new','sale'],        cat: 'women',       desc: 'Light and breezy summer blouse for warm days.' },
  { id: 3,  name: 'Classic Polo Shirt',       price: 22,  old: 30,  img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80', badge: 'Sale', tags: ['all','bestseller','sale'], cat: 'men',         desc: 'Classic polo shirt in premium cotton.' },
  { id: 4,  name: 'Western Denim Shirt',      price: 45,  old: 60,  img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80', badge: 'Sale', tags: ['all','new'],              cat: 'men',         desc: 'Rugged western-style denim shirt.' },
  { id: 5,  name: "Men's Print Tee",          price: 18,  old: 25,  img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80', badge: 'Sale', tags: ['all','bestseller','sale'], cat: 'men',         desc: 'Casual printed tee for everyday style.' },
  { id: 6,  name: 'Red Shirt',                price: 150, old: 200, img: 'https://sassafras.in/cdn/shop/files/SFSHRT20140-1_b1928445-d065-48d7-b553-af5beac44cf8_1800x.jpg?v=1757498900', badge: 'New', tags: ['all','new'], cat: 'women', desc: 'Bold red statement shirt.' },
  { id: 7,  name: 'Leather Biker Jacket',     price: 89,  old: 120, img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80', badge: 'Sale', tags: ['all','bestseller','sale'], cat: 'outerwear',   desc: 'Premium leather biker jacket.' },
  { id: 8,  name: 'Cotton Crew Tee',          price: 15,  old: 20,  img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'men',         desc: 'Soft cotton crew neck tee.' },
  { id: 9,  name: 'Dark Red Shirt Men',       price: 120, old: 160, img: 'https://i.redd.it/lwcovzznt20e1.png',                                      badge: 'Sale', tags: ['all','new','sale'],        cat: 'outerwear',   desc: 'Rich dark red shirt for formal occasions.' },
  { id: 10, name: 'Striped Summer Dress',     price: 55,  old: 75,  img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'women',       desc: 'Elegant striped summer dress.' },
  { id: 11, name: 'Casual Linen Shirt',       price: 38,  old: 50,  img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80', badge: 'Sale', tags: ['all','bestseller','sale'], cat: 'men',         desc: 'Breathable linen shirt for casual occasions.' },
  { id: 12, name: 'Slim Fit Chinos',          price: 48,  old: 65,  img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80', badge: 'Sale', tags: ['all','bestseller'],        cat: 'men',         desc: 'Modern slim-fit chino pants.' },
  { id: 13, name: 'Boho Maxi Dress',          price: 62,  old: 85,  img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'women',       desc: 'Free-spirited boho-style maxi dress.' },
  { id: 14, name: 'Luxury Handbag',           price: 95,  old: 130, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80', badge: 'Sale', tags: ['all','bestseller','sale'], cat: 'accessories', desc: 'Handcrafted luxury handbag.' },
  { id: 15, name: 'Classic Wristwatch',       price: 100, old: 140, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'accessories', desc: 'Elegant classic wristwatch.' },
  { id: 16, name: 'Luxury Bag',               price: 50,  old: 70,  img: 'https://image.made-in-china.com/2f0j00ceakSTEhgJbU/Handbags-for-Girls-Ladies-Purses-and-Crossbody-Shoulder-Mini-Small-Little-Hand-Bags.jpg', badge: 'Sale', tags: ['all','bestseller','sale'], cat: 'accessories', desc: 'Stylish mini luxury bag.' },
  { id: 17, name: 'Black Formal Shoes',       price: 75,  old: 95,  img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'shoes',       desc: 'Classic black formal shoes.' },
  { id: 18, name: 'White Sneakers',           price: 68,  old: 90,  img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'shoes',       desc: 'Fresh white sneakers for everyday wear.' },
  { id: 19, name: 'Elegant Pearl Necklace',   price: 80,  old: 110, img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'accessories', desc: 'Timeless pearl necklace.' },
  { id: 20, name: 'Women Office Blazer',      price: 70,  old: 95,  img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'women',       desc: 'Professional women office blazer.' },
  { id: 21, name: 'Relaxed Fit Jeans',        price: 52,  old: 68,  img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80', badge: 'Sale', tags: ['all','bestseller'],        cat: 'women',       desc: 'Comfortable relaxed fit jeans.' },
  { id: 22, name: 'Oversized Hoodie',         price: 58,  old: 78,  img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'women',       desc: 'Cozy oversized hoodie for lounging.' },
  { id: 23, name: 'Elegant Evening Gown',     price: 130, old: 180, img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'women',       desc: 'Stunning evening gown for special occasions.' },
  { id: 24, name: 'Minimal Gold Ring',        price: 40,  old: 55,  img: 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'accessories', desc: 'Dainty minimal gold ring.' },
  { id: 25, name: 'Soft Knit Sweater',        price: 47,  old: 65,  img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'women',       desc: 'Soft and warm knit sweater.' },
  { id: 26, name: 'Formal White Shirt',       price: 35,  old: 50,  img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'men',         desc: 'Crisp formal white shirt.' },
  { id: 27, name: 'White Bag',                price: 49,  old: 65,  img: 'https://m.media-amazon.com/images/I/51cKLNb5iBL._AC_UY1000_.jpg',         badge: 'New', tags: ['all','new'],              cat: 'accessories', desc: 'Clean white shoulder bag.' },
  { id: 28, name: 'Floral Summer Dress',      price: 60,  old: 82,  img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'women',       desc: 'Beautiful floral print summer dress.' },
  { id: 29, name: 'Stylish Sunglasses',       price: 28,  old: 40,  img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'accessories', desc: 'UV-protection stylish sunglasses.' },
  { id: 30, name: 'Brown Leather Belt',       price: 25,  old: 35,  img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'accessories', desc: 'Genuine brown leather belt.' },
  { id: 31, name: 'Winter Wool Coat',         price: 145, old: 190, img: 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'outerwear',   desc: 'Warm winter coat in premium wool.' },
  { id: 32, name: 'Black Mini Dress',         price: 78,  old: 105, img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'women',       desc: 'Chic black mini dress.' },
  { id: 33, name: 'Classic Oxford Shoes',     price: 92,  old: 120, img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&q=80', badge: 'Sale', tags: ['all','bestseller'],        cat: 'shoes',       desc: 'Traditional Oxford shoes in leather.' },
  { id: 34, name: 'Luxury Silk Tie',          price: 32,  old: 45,  img: 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'accessories', desc: 'Premium 100% silk tie.' },
  { id: 35, name: 'Classic Backpack',         price: 65,  old: 88,  img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'accessories', desc: 'Durable classic backpack.' },
  { id: 36, name: 'Blue Denim Jacket',        price: 85,  old: 115, img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'outerwear',   desc: 'Iconic blue denim jacket.' },
  { id: 37, name: 'Comfy Jogger Pants',       price: 42,  old: 58,  img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'men',         desc: 'Comfortable jogger pants for active days.' },
  { id: 38, name: 'Elegant High Heels',       price: 88,  old: 120, img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'shoes',       desc: 'Sophisticated high heel shoes.' },
  { id: 39, name: 'Silver Bracelet',          price: 36,  old: 50,  img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'accessories', desc: '925 sterling silver bracelet.' },
  { id: 40, name: 'Sport Running Shoes',      price: 95,  old: 130, img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80', badge: 'Sale', tags: ['all','bestseller'],        cat: 'shoes',       desc: 'High-performance running shoes.' },
  { id: 41, name: 'Classic Black Blazer',     price: 110, old: 145, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'women',       desc: 'Tailored classic black blazer.' },
  { id: 42, name: 'Streetwear Graphic Tee',   price: 24,  old: 35,  img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'men',         desc: 'Bold streetwear graphic tee.' },
  { id: 43, name: 'Luxury Crossbody Bag',     price: 105, old: 145, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'accessories', desc: 'Premium crossbody bag.' },
  { id: 44, name: 'Vintage Leather Boots',    price: 115, old: 155, img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'shoes',       desc: 'Hand-stitched vintage leather boots.' },
  { id: 45, name: 'Elegant White Blouse',     price: 44,  old: 60,  img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'women',       desc: 'Elegant white blouse for any occasion.' },
  { id: 46, name: 'Classic Baseball Cap',     price: 20,  old: 28,  img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'accessories', desc: 'Classic logo baseball cap.' },
  { id: 47, name: 'Premium Sweatshirt',       price: 55,  old: 75,  img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'women',       desc: 'Super soft premium sweatshirt.' },
  { id: 48, name: 'Luxury Wedding Dress',     price: 220, old: 300, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80', badge: 'Sale', tags: ['all','sale'],              cat: 'women',       desc: 'Exquisite luxury wedding gown.' },
  { id: 49, name: 'Premium Travel Bag',       price: 125, old: 170, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', badge: 'New', tags: ['all','new'],              cat: 'accessories', desc: 'Durable premium travel bag.' },
  { id: 50, name: 'Designer Loafers',         price: 98,  old: 135, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', badge: 'Sale', tags: ['all','bestseller','sale'], cat: 'shoes',       desc: 'Handcrafted designer loafers.' }
];

const insertProduct = db.prepare(`
  INSERT OR IGNORE INTO products (id, name, price, old_price, image, badge, category, tags, description)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const p of PRODUCTS) {
  insertProduct.run(p.id, p.name, p.price, p.old, p.img, p.badge, p.cat, JSON.stringify(p.tags), p.desc);
}

// ─── Helper: convert null-prototype objects from Node sqlite to plain objects
function toPlain(row) {
  if (!row) return null;
  return Object.assign({}, row);
}

function toPlainAll(rows) {
  return rows.map(toPlain);
}

module.exports = { db, toPlain, toPlainAll };
