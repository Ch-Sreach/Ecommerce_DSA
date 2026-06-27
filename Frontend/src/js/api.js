/* ═══════════════════════════════════════════════════════════════
   api.js — LUXE Fashion Frontend ↔ Backend Bridge
   All API calls go through this file.
   Backend must be running at http://localhost:3000
═══════════════════════════════════════════════════════════════ */

const API_BASE = 'http://localhost:3000/api';

/* ── Auth helpers ─────────────────────────────────────────── */

export function getToken()        { return localStorage.getItem('luxe_token'); }
export function getUser()         { const u = localStorage.getItem('luxe_user'); return u ? JSON.parse(u) : null; }
export function isLoggedIn()      { return !!getToken(); }
export function saveSession(token, user) {
  localStorage.setItem('luxe_token', token);
  localStorage.setItem('luxe_user', JSON.stringify(user));
}
export function clearSession() {
  localStorage.removeItem('luxe_token');
  localStorage.removeItem('luxe_user');
}

/* ── Base fetch wrapper ───────────────────────────────────── */

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw { status: res.status, message: data.message || 'Request failed' };
  return data;
}

/* ── Auth API ─────────────────────────────────────────────── */

export const Auth = {
  async register(name, email, password, phone = '') {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    });
    saveSession(data.token, data.user);
    return data;
  },

  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    saveSession(data.token, data.user);
    return data;
  },

  async me() {
    return apiFetch('/auth/me');
  },

  async updateProfile(updates) {
    return apiFetch('/auth/me', { method: 'PUT', body: JSON.stringify(updates) });
  },

  logout() {
    clearSession();
    window.location.href = 'login.html';
  },
};

/* ── Products API ─────────────────────────────────────────── */

export const Products = {
  async list(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/products${qs ? '?' + qs : ''}`);
  },

  async get(id) {
    return apiFetch(`/products/${id}`);
  },

  async categories() {
    return apiFetch('/products/categories');
  },
};

/* ── Cart API ─────────────────────────────────────────────── */

export const Cart = {
  async get()                              { return apiFetch('/cart'); },
  async add(product_id, quantity = 1)      { return apiFetch('/cart', { method: 'POST', body: JSON.stringify({ product_id, quantity }) }); },
  async update(product_id, quantity)       { return apiFetch(`/cart/${product_id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }); },
  async remove(product_id)                 { return apiFetch(`/cart/${product_id}`, { method: 'DELETE' }); },
  async clear()                            { return apiFetch('/cart', { method: 'DELETE' }); },
};

/* ── Wishlist API ─────────────────────────────────────────── */

export const Wishlist = {
  async get()              { return apiFetch('/wishlist'); },
  async add(product_id)    { return apiFetch('/wishlist', { method: 'POST', body: JSON.stringify({ product_id }) }); },
  async remove(product_id) { return apiFetch(`/wishlist/${product_id}`, { method: 'DELETE' }); },
};

/* ── Orders API ───────────────────────────────────────────── */

export const Orders = {
  async list()           { return apiFetch('/orders'); },
  async get(id)          { return apiFetch(`/orders/${id}`); },
  async place(orderData) { return apiFetch('/orders', { method: 'POST', body: JSON.stringify(orderData) }); },
};

/* ── Contact API ──────────────────────────────────────────── */

export const Contact = {
  async send(data) {
    return apiFetch('/contact', { method: 'POST', body: JSON.stringify(data) });
  },
};

/* ── Auth Guard — call this on protected pages ────────────── */

export function requireLogin(redirectTo = 'login.html') {
  if (!isLoggedIn()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

/* ── Navbar auth UI update ────────────────────────────────── */

export function updateNavAuth() {
  const user = getUser();
  const accountBtn = document.getElementById('nav-account-btn');
  const accountName = document.getElementById('nav-account-name');
  const logoutBtn = document.getElementById('nav-logout-btn');
  const loginLink = document.getElementById('nav-login-link');

  if (user) {
    if (accountName) accountName.textContent = user.name.split(' ')[0];
    if (accountBtn) accountBtn.classList.remove('hidden');
    if (logoutBtn) {
      logoutBtn.classList.remove('hidden');
      logoutBtn.onclick = () => Auth.logout();
    }
    if (loginLink) loginLink.classList.add('hidden');
  } else {
    if (accountBtn) accountBtn.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    if (loginLink) loginLink.classList.remove('hidden');
  }
}
