/* ════════════════════════════════════════════════
   PRODUCT DATA
════════════════════════════════════════════════ */
const PRODUCTS = [
  { id: 1, name: 'Classic Gray Shirt', price: 25, old: 35, img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80', badge: 'Sale', tags: ['all', 'bestseller', 'sale'], cat: 'men' },
  { id: 2, name: 'Girl Summer Blouse', price: 30, old: 45, img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80', badge: 'Sale', tags: ['all', 'new', 'sale'], cat: 'women' },
  { id: 3, name: 'Classic Polo Shirt', price: 22, old: 30, img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80', badge: 'Sale', tags: ['all', 'bestseller', 'sale'], cat: 'men' },
  { id: 4, name: 'Western Denim Shirt', price: 45, old: 60, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80', badge: 'Sale', tags: ['all', 'new'], cat: 'men' },
  { id: 5, name: "Men's Print Tee", price: 18, old: 25, img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80', badge: 'Sale', tags: ['all', 'bestseller', 'sale'], cat: 'men' },

  { id: 6, name: 'Red Shirt', price: 150, old: 200, img: 'https://sassafras.in/cdn/shop/files/SFSHRT20140-1_b1928445-d065-48d7-b553-af5beac44cf8_1800x.jpg?v=1757498900', badge: 'New', tags: ['all', 'new'], cat: 'women' },
  { id: 7, name: 'Leather Biker Jacket', price: 89, old: 120, img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80', badge: 'Sale', tags: ['all', 'bestseller', 'sale'], cat: 'outerwear' },
  { id: 8, name: 'Cotton Crew Tee', price: 15, old: 20, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'men' },
  { id: 9, name: 'Dark Red Shirt Men', price: 120, old: 160, img: 'https://i.redd.it/lwcovzznt20e1.png', badge: 'Sale', tags: ['all', 'new', 'sale'], cat: 'outerwear' },
  { id: 10, name: 'Striped Summer Dress', price: 55, old: 75, img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'women' },

  { id: 11, name: 'Casual Linen Shirt', price: 38, old: 50, img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80', badge: 'Sale', tags: ['all', 'bestseller', 'sale'], cat: 'men' },
  { id: 12, name: 'Slim Fit Chinos', price: 48, old: 65, img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80', badge: 'Sale', tags: ['all', 'bestseller'], cat: 'men' },
  { id: 13, name: 'Boho Maxi Dress', price: 62, old: 85, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'women' },
  { id: 14, name: 'Luxury Handbag', price: 95, old: 130, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80', badge: 'Sale', tags: ['all', 'bestseller', 'sale'], cat: 'accessories' },
  { id: 15, name: 'Classic Wristwatch', price: 100, old: 140, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'accessories' },

  { id: 16, name: 'Luxury Bag', price: 50, old: 70, img: 'https://image.made-in-china.com/2f0j00ceakSTEhgJbU/Handbags-for-Girls-Ladies-Purses-and-Crossbody-Shoulder-Mini-Small-Little-Hand-Bags.jpg', badge: 'Sale', tags: ['all', 'bestseller', 'sale'], cat: 'accessories' },
  { id: 17, name: 'Black Formal Shoes', price: 75, old: 95, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'shoes' },
  { id: 18, name: 'White Sneakers', price: 68, old: 90, img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'shoes' },
  { id: 19, name: 'Elegant Pearl Necklace', price: 80, old: 110, img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'accessories' },
  { id: 20, name: 'Women Office Blazer', price: 70, old: 95, img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'women' },

  { id: 21, name: 'Relaxed Fit Jeans', price: 52, old: 68, img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80', badge: 'Sale', tags: ['all', 'bestseller'], cat: 'women' },
  { id: 22, name: 'Oversized Hoodie', price: 58, old: 78, img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'women' },
  { id: 23, name: 'Elegant Evening Gown', price: 130, old: 180, img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'women' },
  { id: 24, name: 'Minimal Gold Ring', price: 40, old: 55, img: 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'accessories' },
  { id: 25, name: 'Soft Knit Sweater', price: 47, old: 65, img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'women' },

  { id: 26, name: 'Formal White Shirt', price: 35, old: 50, img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'men' },
  { id: 27, name: 'White Bag', price: 49, old: 65, img: 'https://m.media-amazon.com/images/I/51cKLNb5iBL._AC_UY1000_.jpg', badge: 'New', tags: ['all', 'new'], cat: 'accessories' },
  { id: 28, name: 'Floral Summer Dress', price: 60, old: 82, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'women' },
  { id: 29, name: 'Stylish Sunglasses', price: 28, old: 40, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'accessories' },
  { id: 30, name: 'Brown Leather Belt', price: 25, old: 35, img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'accessories' },

  { id: 31, name: 'Winter Wool Coat', price: 145, old: 190, img: 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'outerwear' },
  { id: 32, name: 'Black Mini Dress', price: 78, old: 105, img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'women' },
  { id: 33, name: 'Classic Oxford Shoes', price: 92, old: 120, img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&q=80', badge: 'Sale', tags: ['all', 'bestseller'], cat: 'shoes' },
  { id: 34, name: 'Luxury Silk Tie', price: 32, old: 45, img: 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'accessories' },
  { id: 35, name: 'Classic Backpack', price: 65, old: 88, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'accessories' },

  { id: 36, name: 'Blue Denim Jacket', price: 85, old: 115, img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'outerwear' },
  { id: 37, name: 'Comfy Jogger Pants', price: 42, old: 58, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'men' },
  { id: 38, name: 'Elegant High Heels', price: 88, old: 120, img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'shoes' },
  { id: 39, name: 'Silver Bracelet', price: 36, old: 50, img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'accessories' },
  { id: 40, name: 'Sport Running Shoes', price: 95, old: 130, img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80', badge: 'Sale', tags: ['all', 'bestseller'], cat: 'shoes' },

  { id: 41, name: 'Classic Black Blazer', price: 110, old: 145, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'women' },
  { id: 42, name: 'Streetwear Graphic Tee', price: 24, old: 35, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'men' },
  { id: 43, name: 'Luxury Crossbody Bag', price: 105, old: 145, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'accessories' },
  { id: 44, name: 'Vintage Leather Boots', price: 115, old: 155, img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'shoes' },
  { id: 45, name: 'Elegant White Blouse', price: 44, old: 60, img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'women' },

  { id: 46, name: 'Classic Baseball Cap', price: 20, old: 28, img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'accessories' },
  { id: 47, name: 'Premium Sweatshirt', price: 55, old: 75, img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'women' },
  { id: 48, name: 'Luxury Wedding Dress', price: 220, old: 300, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80', badge: 'Sale', tags: ['all', 'sale'], cat: 'women' },
  { id: 49, name: 'Premium Travel Bag', price: 125, old: 170, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', badge: 'New', tags: ['all', 'new'], cat: 'accessories' },
  { id: 50, name: 'Designer Loafers', price: 98, old: 135, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', badge: 'Sale', tags: ['all', 'bestseller', 'sale'], cat: 'shoes' }
];


/* ════════════════════════════════════════════════
   STATE (localStorage-backed)
════════════════════════════════════════════════ */
let wishlist  = JSON.parse(localStorage.getItem('luxe_wish') || '[]');
let cart      = JSON.parse(localStorage.getItem('luxe_cart')  || '[]');

/* ════════════════════════════════════════════════
   PRODUCT CARD HTML
════════════════════════════════════════════════ */
function productCard(p) {
  const isWish   = wishlist.includes(p.id);
  const inCart   = cart.includes(p.id);
  const discount = Math.round((1 - p.price / p.old) * 100);
  const detailUrl = `product.html?id=${p.id}`;
  return `
    <article class="product-card group" itemscope itemtype="https://schema.org/Product">
      <a href="${detailUrl}" class="block relative overflow-hidden aspect-3-4 bg-stone-100 dark:bg-dark-700">
        <img src="${p.img}" alt="${p.name}" class="product-img w-full h-full object-cover" loading="lazy"
          itemprop="image" width="400" height="533"/>
        <!-- Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1">
          <span class="${p.badge === 'New' ? 'badge-new' : 'badge-sale'}">${p.badge}</span>
          ${discount > 0 ? `<span class="text-[10px] font-sans tracking-widest uppercase px-2 py-1 bg-green-600 text-white">-${discount}%</span>` : ''}
        </div>
        <!-- Wishlist btn -->
        <button onclick="event.preventDefault();toggleWish(${p.id},this)"
          aria-label="${isWish ? 'Remove from wishlist' : 'Add to wishlist'}"
          class="wish-trigger absolute top-3 right-3 w-8 h-8 bg-white dark:bg-dark-700 flex items-center justify-center shadow-sm ${isWish ? 'text-luxe-600' : 'text-stone-400'} hover:text-luxe-600 transition-all">
          <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart text-sm"></i>
        </button>
        <!-- Add to Cart overlay btn -->
        <button onclick="event.preventDefault();toggleCartFromCard(${p.id},this)"
          aria-label="Add to cart"
          class="absolute top-12 right-3 w-8 h-8 bg-white dark:bg-dark-700 flex items-center justify-center shadow-sm ${inCart ? 'text-luxe-600' : 'text-stone-400'} hover:text-luxe-600 transition-all opacity-0 group-hover:opacity-100">
          <i class="${inCart ? 'fa-solid' : 'fa-regular'} fa-bag-shopping text-sm"></i>
        </button>
        <!-- Quick add -->
        <div class="quick-add absolute inset-x-0 bottom-0 p-3">
          <button onclick="event.preventDefault();addToCart(${p.id})"
            class="w-full py-2.5 ${inCart ? 'bg-luxe-600' : 'bg-dark-900 dark:bg-luxe-500'} text-white text-[10px] font-sans tracking-widest uppercase hover:bg-luxe-600 transition-colors">
            ${inCart ? '✓ In Cart' : 'Quick Add'}
          </button>
        </div>
      </a>
      <div class="p-4">
        <div class="stars mb-1">★★★★★</div>
        <p class="font-body text-sm text-stone-700 dark:text-stone-300 mb-1 leading-snug" itemprop="name">${p.name}</p>
        <div class="flex items-center gap-2" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
          <span class="font-sans font-bold text-sm text-luxe-600 dark:text-luxe-400" itemprop="price" content="${p.price}">$${p.price}</span>
          <span class="text-xs text-stone-400 line-through font-body">$${p.old}</span>
          <meta itemprop="priceCurrency" content="USD"/>
        </div>
      </div>
    </article>`;
}

/* ════════════════════════════════════════════════
   CART
════════════════════════════════════════════════ */
function addToCart(id) {
  if (!cart.includes(id)) cart.push(id);
  localStorage.setItem('luxe_cart', JSON.stringify(cart));
  updateBadges();
  showToast('Added to cart 🛍️');
}

function toggleCartFromCard(id, btn) {
  if (cart.includes(id)) {
    cart = cart.filter(c => c !== id);
    btn.innerHTML = '<i class="fa-regular fa-bag-shopping text-sm"></i>';
    btn.classList.remove('text-luxe-600');
    btn.classList.add('text-stone-400');
    showToast('Removed from cart');
  } else {
    cart.push(id);
    btn.innerHTML = '<i class="fa-solid fa-bag-shopping text-sm"></i>';
    btn.classList.add('text-luxe-600');
    btn.classList.remove('text-stone-400');
    showToast('Added to cart 🛍️');
  }
  localStorage.setItem('luxe_cart', JSON.stringify(cart));
  updateBadges();
  // Update quick-add button in same card
  const card = btn.closest('article');
  if (card) {
    const quickBtn = card.querySelector('.quick-add button');
    if (quickBtn) {
      const inCart = cart.includes(id);
      quickBtn.textContent = inCart ? '✓ In Cart' : 'Quick Add';
      if (inCart) { quickBtn.classList.add('bg-luxe-600'); quickBtn.classList.remove('bg-dark-900','dark:bg-luxe-500'); }
      else { quickBtn.classList.remove('bg-luxe-600'); quickBtn.classList.add('bg-dark-900','dark:bg-luxe-500'); }
    }
  }
}

function toggleWish(id, btn) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(w => w !== id);
    btn.innerHTML = '<i class="fa-regular fa-heart text-sm"></i>';
    btn.classList.remove('text-luxe-600');
    btn.classList.add('text-stone-400');
    showToast('Removed from wishlist');
  } else {
    wishlist.push(id);
    btn.innerHTML = '<i class="fa-solid fa-heart text-sm"></i>';
    btn.classList.add('text-luxe-600');
    btn.classList.remove('text-stone-400');
    showToast('Added to wishlist ❤️');
  }
  localStorage.setItem('luxe_wish', JSON.stringify(wishlist));
  updateBadges();
}

/* ════════════════════════════════════════════════
   NAV BADGES
════════════════════════════════════════════════ */
function updateBadges() {
  const wb  = document.getElementById('wish-badge');
  const cb  = document.getElementById('cart-badge');
  if (wb)  { wb.textContent  = wishlist.length;  wb.style.display  = wishlist.length  > 0 ? 'flex' : 'none'; }
  if (cb)  { cb.textContent  = cart.length;       cb.style.display  = cart.length      > 0 ? 'flex' : 'none'; }
}

/* ════════════════════════════════════════════════
   HERO SLIDER
════════════════════════════════════════════════ */
let heroIdx   = 0;
let heroTimer = null;

function startHero() {
  heroTimer = setInterval(nextSlide, 5500);
}

function goSlide(idx) {
  clearInterval(heroTimer);
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  slides[heroIdx].style.opacity = '0';
  slides[heroIdx].style.zIndex  = '0';
  dots[heroIdx].style.width     = '8px';
  dots[heroIdx].style.background = 'rgba(255,255,255,0.4)';
  heroIdx = idx;
  slides[heroIdx].style.opacity = '1';
  slides[heroIdx].style.zIndex  = '1';
  dots[heroIdx].style.width     = '24px';
  dots[heroIdx].style.background = 'rgba(255,255,255,0.9)';
  heroTimer = setInterval(nextSlide, 5500);
}

function nextSlide() {
  const count = document.querySelectorAll('.hero-slide').length;
  if (count) goSlide((heroIdx + 1) % count);
}
function prevSlide() {
  const count = document.querySelectorAll('.hero-slide').length;
  if (count) goSlide((heroIdx - 1 + count) % count);
}

/* ════════════════════════════════════════════════
   COUNTDOWN TIMER
════════════════════════════════════════════════ */
function startCountdown() {
  const end = new Date();
  end.setHours(end.getHours() + 12, end.getMinutes() + 34, 0);
  function tick() {
    let diff = Math.max(0, end - new Date());
    const h  = Math.floor(diff / 3600000); diff -= h * 3600000;
    const m  = Math.floor(diff / 60000);   diff -= m * 60000;
    const s  = Math.floor(diff / 1000);
    const hEl = document.getElementById('cd-h');
    const mEl = document.getElementById('cd-m');
    const sEl = document.getElementById('cd-s');
    if (hEl) hEl.textContent = String(h).padStart(2,'0');
    if (mEl) mEl.textContent = String(m).padStart(2,'0');
    if (sEl) sEl.textContent = String(s).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}

/* ════════════════════════════════════════════════
   DARK MODE
════════════════════════════════════════════════ */
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  const icon   = document.getElementById('theme-icon');
  if (icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('luxe_theme', isDark ? 'dark' : 'light');
}

// Restore on load
(function () {
  if (localStorage.getItem('luxe_theme') === 'dark') {
    document.documentElement.classList.add('dark');
    document.addEventListener('DOMContentLoaded', () => {
      const icon = document.getElementById('theme-icon');
      if (icon) icon.className = 'fa-solid fa-sun';
    });
  }
})();

/* ════════════════════════════════════════════════
   MOBILE MENU + SEARCH
════════════════════════════════════════════════ */
function toggleMobile() {
  document.getElementById('mobile-menu')?.classList.toggle('hidden');
}
function toggleSearch() {
  document.getElementById('search-bar')?.classList.toggle('hidden');
}

/* ════════════════════════════════════════════════
   TOAST NOTIFICATION
════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  const t  = document.getElementById('toast');
  const tm = document.getElementById('toast-msg');
  if (!t || !tm) return;
  tm.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ════════════════════════════════════════════════
   ACCORDION
════════════════════════════════════════════════ */
function toggleAccord(btn) {
  const body = btn.nextElementSibling;
  body.classList.toggle('open');
  const icon = btn.querySelector('i');
  if (icon) icon.style.transform = body.classList.contains('open') ? 'rotate(180deg)' : '';
}

/* ════════════════════════════════════════════════
   FORMS
════════════════════════════════════════════════ */
function handleSubscribe()  { showToast('Subscribed! Welcome to LUXE ✨'); }
function handleContact()    { showToast("Message sent! We'll reply within 24h 📧"); }

/* ════════════════════════════════════════════════
   BACK TO TOP
════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('btt')?.classList.toggle('visible', window.scrollY > 400);
});

/* ════════════════════════════════════════════════
   INIT on every page
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
});