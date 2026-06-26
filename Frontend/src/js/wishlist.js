
    document.addEventListener('DOMContentLoaded', () => {
      renderWishlist();
    });

    function renderWishlist() {
      const grid  = document.getElementById('wish-grid');
      const empty = document.getElementById('wish-empty');
      const count = document.getElementById('wish-count');
      const addAllBtn = document.getElementById('add-all-btn');
      const clearBtn  = document.getElementById('clear-btn');

      if (!wishlist.length) {
        grid.classList.add('hidden');
        empty.classList.remove('hidden');
        addAllBtn.classList.add('hidden');
        clearBtn.classList.add('hidden');
        count.textContent = '';
        return;
      }

      grid.classList.remove('hidden');
      empty.classList.add('hidden');
      addAllBtn.classList.remove('hidden');
      clearBtn.classList.remove('hidden');
      count.textContent = `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} saved`;

      const items = PRODUCTS.filter(p => wishlist.includes(p.id));
      grid.innerHTML = items.map(p => wishlistCard(p)).join('');
    }

    function wishlistCard(p) {
      const discount = Math.round((1 - p.price / p.old) * 100);
      const inCart   = cart.includes(p.id);
      return `
        <article class="product-card group bg-white dark:bg-dark-800 border border-stone-200 dark:border-dark-700">
          <a href="product.html?id=${p.id}" class="block relative overflow-hidden aspect-3-4 bg-stone-100 dark:bg-dark-700">
            <img src="${p.img}" alt="${p.name}" class="product-img w-full h-full object-cover" loading="lazy" width="400" height="533"/>
            <div class="absolute top-3 left-3 flex flex-col gap-1">
              <span class="${p.badge === 'New' ? 'badge-new' : 'badge-sale'}">${p.badge}</span>
              ${discount > 0 ? `<span class="text-[10px] font-sans tracking-widest uppercase px-2 py-1 bg-green-600 text-white">-${discount}%</span>` : ''}
            </div>
            <!-- Remove from wishlist -->
            <button onclick="event.preventDefault(); removeFromWishlist(${p.id})"
              class="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-dark-700 flex items-center justify-center shadow-sm text-luxe-600 hover:text-red-500 transition-all"
              aria-label="Remove from wishlist">
              <i class="fa-solid fa-heart text-sm"></i>
            </button>
            <!-- Bookmark btn -->
            <button onclick="event.preventDefault(); toggleBookmarkFromWish(${p.id}, this)"
              aria-label="Bookmark"
              class="absolute bottom-14 right-3 w-8 h-8 bg-white dark:bg-dark-700 flex items-center justify-center shadow-sm hover:text-luxe-600 transition-all ${bookmarks.includes(p.id) ? 'text-luxe-600' : 'text-stone-400'}">
              <i class="${bookmarks.includes(p.id) ? 'fa-solid' : 'fa-regular'} fa-bookmark text-sm"></i>
            </button>
            <!-- Quick add -->
            <div class="quick-add absolute inset-x-0 bottom-0 p-3">
              <button onclick="event.preventDefault(); addToCartFromWish(${p.id}, this)"
                class="w-full py-2.5 ${inCart ? 'bg-luxe-600' : 'bg-dark-900 dark:bg-luxe-500'} text-white text-[10px] font-sans tracking-widest uppercase hover:bg-luxe-600 transition-colors">
                ${inCart ? '✓ In Cart' : 'Quick Add'}
              </button>
            </div>
          </a>
          <div class="p-4">
            <div class="stars mb-1">★★★★★</div>
            <p class="font-body text-sm text-stone-700 dark:text-stone-300 mb-1 leading-snug">${p.name}</p>
            <div class="flex items-center gap-2">
              <span class="font-sans font-bold text-sm text-luxe-600 dark:text-luxe-400">$${p.price}</span>
              <span class="text-xs text-stone-400 line-through font-body">$${p.old}</span>
            </div>
          </div>
        </article>`;
    }

    function removeFromWishlist(id) {
      const idx = wishlist.indexOf(id);
      if (idx !== -1) wishlist.splice(idx, 1);
      localStorage.setItem('luxe_wish', JSON.stringify(wishlist));
      updateBadges();
      renderWishlist();
      showToast('Removed from wishlist');
    }

    function addToCartFromWish(id, btn) {
      if (!cart.includes(id)) {
        cart.push(id);
        localStorage.setItem('luxe_cart', JSON.stringify(cart));
        updateBadges();
        btn.textContent = '✓ In Cart';
        btn.classList.add('bg-luxe-600');
        btn.classList.remove('bg-dark-900');
        showToast('Added to cart 🛍️');
      }
    }

    function addAllToCart() {
      let added = 0;
      wishlist.forEach(id => {
        if (!cart.includes(id)) { cart.push(id); added++; }
      });
      localStorage.setItem('luxe_cart', JSON.stringify(cart));
      updateBadges();
      renderWishlist();
      showToast(added > 0 ? `${added} item${added !== 1 ? 's' : ''} added to cart 🛍️` : 'All items already in cart');
    }

    function clearWishlist() {
      wishlist.length = 0;
      localStorage.setItem('luxe_wish', JSON.stringify(wishlist));
      updateBadges();
      renderWishlist();
      showToast('Wishlist cleared');
    }

    function toggleBookmarkFromWish(id, btn) {
      const idx = bookmarks.indexOf(id);
      if (idx === -1) {
        bookmarks.push(id);
        btn.innerHTML = '<i class="fa-solid fa-bookmark text-sm"></i>';
        btn.classList.add('text-luxe-600');
        btn.classList.remove('text-stone-400');
        showToast('Bookmarked 🔖');
      } else {
        bookmarks.splice(idx, 1);
        btn.innerHTML = '<i class="fa-regular fa-bookmark text-sm"></i>';
        btn.classList.remove('text-luxe-600');
        btn.classList.add('text-stone-400');
        showToast('Bookmark removed');
      }
      localStorage.setItem('luxe_bookmarks', JSON.stringify(bookmarks));
      updateBadges();
    }
