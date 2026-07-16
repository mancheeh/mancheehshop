(function () {
  'use strict';

  // Live product list. Starts as the bundled PRODUCTS (products.js) so the
  // page has something to show instantly, then switches to live database
  // data once ProductService connects (if Supabase is configured).
  let products = (typeof PRODUCTS !== 'undefined') ? PRODUCTS : [];

  const categoryMap = {
    phone:    'Phone Accessories',
    beauty:   'Beauty & Hair',
    trending: 'Trending',
    medicine: 'Medicines',
  };

  const storeLabel = { amazon:'Amazon', jumia:'Jumia' };

  /* ── DOM refs ── */
  const grid           = document.getElementById('productGrid');
  const searchInput    = document.getElementById('searchInput');
  const searchBtn      = document.getElementById('searchBtn');
  const suggestionsBox = document.getElementById('suggestionsBox');
  const filterBtns     = document.querySelectorAll('.filter-btn');
  const storeBtns      = document.querySelectorAll('.store-btn');
  const resultsBar     = document.getElementById('resultsBar');
  const backTop        = document.getElementById('backTop');
  const modalOverlay   = document.getElementById('modalOverlay');
  const modalClose     = document.getElementById('modalClose');
  const modalImg       = document.getElementById('modalImg');
  const modalTitle     = document.getElementById('modalTitle');
  const modalDesc      = document.getElementById('modalDesc');
  const modalPrice     = document.getElementById('modalPrice');
  const modalFeatures  = document.getElementById('modalFeatures');
  const modalBuyBtn    = document.getElementById('modalBuyBtn');
  const modalStoreBadge= document.getElementById('modalStoreBadge');

  let currentFilter = 'all';
  let currentStore  = 'all';
  let currentSearch = '';

  /* ── dark mode ── */
  const themeToggle = document.getElementById('themeToggle');
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mancheeh-theme', theme);
    if (themeToggle) themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── helpers ── */
  function escHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function storeBadgeHTML(store) {
    if (store === 'amazon') return `<span class="store-ribbon ribbon-amazon"><i class="fab fa-amazon"></i> Amazon</span>`;
    if (store === 'jumia')  return `<span class="store-ribbon ribbon-jumia"><i class="fas fa-shopping-bag"></i> Jumia</span>`;
    return '';
  }

  function getFiltered() {
    const term = currentSearch.toLowerCase().trim();
    return products.filter(p => {
      const matchStore  = currentStore  === 'all' || p.store    === currentStore;
      const matchCat    = currentFilter === 'all' || p.category === currentFilter;
      const matchSearch = !term ||
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.desc.toLowerCase().includes(term) ||
        (p.store && p.store.toLowerCase().includes(term));
      return matchStore && matchCat && matchSearch;
    });
  }

  /* ── render ── */
  function renderProducts() {
    const filtered = getFiltered();

    // update results bar
    if (currentSearch || currentStore !== 'all' || currentFilter !== 'all') {
      const storeText = currentStore !== 'all' ? storeLabel[currentStore] : 'All Stores';
      const catText   = currentFilter !== 'all' ? categoryMap[currentFilter] : 'All Categories';
      resultsBar.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''} — ${storeText} · ${catText}${currentSearch ? ` · "${currentSearch}"` : ''}`;
    } else {
      resultsBar.textContent = `${filtered.length} products available`;
    }

    if (!filtered.length) {
      grid.innerHTML = `
        <p style="grid-column:1/-1;text-align:center;padding:60px 16px;color:#5f5f73;font-size:1rem;">
          <i class="fas fa-search" style="display:block;font-size:2rem;margin-bottom:12px;color:#c9a87c;"></i>
          No products found. Try a different filter or search term.
        </p>`;
      return;
    }

    grid.innerHTML = filtered.map(p => `
      <div class="product-card">
        ${storeBadgeHTML(p.store)}
        <div class="product-img" data-id="${p.docId || p.id}">
          <img src="${escHtml(p.img)}" alt="${escHtml(p.name)}" loading="lazy"
               onerror="this.src='https://placehold.co/200x200?text=No+Image'" />
        </div>
        <div class="product-title">${escHtml(p.name)}</div>
        <div class="product-desc">${escHtml(p.desc)}</div>
        <div class="product-price">${escHtml(p.price)}</div>
        <button class="buy-btn ${p.store === 'amazon' ? 'amazon-btn' : 'jumia-btn'}" data-id="${p.docId || p.id}">
          Buy on ${p.store === 'amazon' ? 'Amazon' : 'Jumia'} <i class="fas fa-external-link-alt" style="font-size:.75rem;margin-left:4px;"></i>
        </button>
      </div>
    `).join('');
  }

  /* ── suggestions ── */
  function showSuggestions(query) {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) { suggestionsBox.classList.remove('active'); return; }

    const matches = products.filter(p =>
      p.name.toLowerCase().includes(trimmed) ||
      p.category.toLowerCase().includes(trimmed) ||
      p.desc.toLowerCase().includes(trimmed) ||
      (p.store && p.store.toLowerCase().includes(trimmed))
    ).slice(0, 6);

    if (!matches.length) {
      suggestionsBox.innerHTML = `<div class="suggestion-empty">No results for "<strong>${escHtml(query)}</strong>"</div>`;
      suggestionsBox.classList.add('active');
      return;
    }

    suggestionsBox.innerHTML = matches.map(p => `
      <div class="suggestion-item" data-id="${p.docId || p.id}" data-type="product">
        <img src="${escHtml(p.img)}" alt="${escHtml(p.name)}"
             onerror="this.src='https://placehold.co/40x40?text=?'" />
        <div class="suggestion-info">
          <div class="suggestion-name">${escHtml(p.name)}</div>
          <div class="suggestion-category">
            ${categoryMap[p.category] || p.category}
            <span class="suggestion-store-badge ${p.store === 'amazon' ? 'badge-amazon' : 'badge-jumia'}">
              ${p.store === 'amazon' ? 'Amazon' : 'Jumia'}
            </span>
          </div>
        </div>
        <span class="suggestion-price">${escHtml(p.price)}</span>
      </div>`).join('');

    suggestionsBox.classList.add('active');
  }

  /* ── modal photo gallery ──
     Auto-advances through a product's photos, with prev/next side buttons
     for manual control. Change GALLERY_AUTOPLAY_MS below to speed this up
     or slow it down (currently 1.5 seconds per photo). */
  const GALLERY_AUTOPLAY_MS = 1500;
  const modalPrevBtn = document.getElementById('modalPrevBtn');
  const modalNextBtn = document.getElementById('modalNextBtn');
  let modalGallery = [];
  let modalGalleryIndex = 0;
  let modalAutoplayTimer = null;

  function showGalleryImage(idx) {
    if (!modalGallery.length) return;
    modalGalleryIndex = (idx + modalGallery.length) % modalGallery.length; // loops both directions
    modalImg.src = modalGallery[modalGalleryIndex];
  }

  function startGalleryAutoplay() {
    stopGalleryAutoplay();
    if (modalGallery.length > 1) {
      modalAutoplayTimer = setInterval(() => showGalleryImage(modalGalleryIndex + 1), GALLERY_AUTOPLAY_MS);
    }
  }

  function stopGalleryAutoplay() {
    if (modalAutoplayTimer) { clearInterval(modalAutoplayTimer); modalAutoplayTimer = null; }
  }

  // manual controls reset the autoplay timer so it doesn't jump right
  // after someone just picked a photo themselves
  function goToGalleryImage(idx) {
    showGalleryImage(idx);
    startGalleryAutoplay();
  }

  modalPrevBtn.addEventListener('click', () => goToGalleryImage(modalGalleryIndex - 1));
  modalNextBtn.addEventListener('click', () => goToGalleryImage(modalGalleryIndex + 1));

  /* ── modal ── */
  function openModal(id) {
    const p = products.find(x => String(x.docId || x.id) === String(id));
    if (!p) return;

    modalGallery = (p.images && p.images.length) ? p.images : (p.img ? [p.img] : []);
    modalGalleryIndex = 0;

    modalImg.src   = modalGallery[0] || p.img || '';
    modalImg.alt   = p.name;
    modalImg.onerror = () => { modalImg.src = 'https://placehold.co/200x200?text=No+Image'; };

    if (modalGallery.length > 1) {
      modalPrevBtn.classList.remove('hidden');
      modalNextBtn.classList.remove('hidden');
      startGalleryAutoplay();
    } else {
      modalPrevBtn.classList.add('hidden');
      modalNextBtn.classList.add('hidden');
      stopGalleryAutoplay();
    }

    // store badge inside modal
    modalStoreBadge.className = 'modal-store-badge ' + (p.store === 'amazon' ? 'ribbon-amazon' : 'ribbon-jumia');
    modalStoreBadge.innerHTML = p.store === 'amazon'
      ? '<i class="fab fa-amazon"></i> Amazon'
      : '<i class="fas fa-shopping-bag"></i> Jumia';

    modalTitle.textContent  = p.name;
    modalDesc.textContent   = p.desc;
    modalPrice.textContent  = p.price;
    modalBuyBtn.href        = p.affiliateUrl && p.affiliateUrl !== '#' ? p.affiliateUrl : '#';
    modalBuyBtn.target      = '_blank';
    modalBuyBtn.className   = 'modal-buy-btn ' + (p.store === 'amazon' ? 'amazon-modal-btn' : 'jumia-modal-btn');
    modalBuyBtn.innerHTML   = `Buy on ${p.store === 'amazon' ? 'Amazon' : 'Jumia'} <i class="fas fa-external-link-alt" style="font-size:.75rem;margin-left:6px;"></i>`;

    modalFeatures.innerHTML = (p.features || []).map(f =>
      `<li><i class="fas fa-check-circle"></i> ${escHtml(f)}</li>`).join('');

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    stopGalleryAutoplay();
  }

  /* ── events ── */

  // store tabs
  storeBtns.forEach(btn => btn.addEventListener('click', () => {
    storeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentStore  = btn.dataset.store;
    currentSearch = '';
    searchInput.value = '';
    suggestionsBox.classList.remove('active');
    renderProducts();
    document.getElementById('products').scrollIntoView({ behavior:'smooth', block:'start' });
  }));

  // category tabs
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    currentSearch = '';
    searchInput.value = '';
    suggestionsBox.classList.remove('active');
    renderProducts();
  }));

  // grid clicks
  grid.addEventListener('click', e => {
    const imgEl = e.target.closest('.product-img');
    const buyEl = e.target.closest('.buy-btn');
    if (imgEl) openModal(imgEl.dataset.id);
    if (buyEl) openModal(buyEl.dataset.id);
  });

  // suggestions clicks
  suggestionsBox.addEventListener('click', e => {
    const item = e.target.closest('.suggestion-item');
    if (!item) return;
    searchInput.value = '';
    currentSearch     = '';
    suggestionsBox.classList.remove('active');
    openModal(item.dataset.id);
  });

  // modal close
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // search
  searchInput.addEventListener('input', e => {
    currentSearch = e.target.value;
    showSuggestions(currentSearch);
    renderProducts();
  });
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { suggestionsBox.classList.remove('active'); searchInput.blur(); }
    if (e.key === 'Escape') { suggestionsBox.classList.remove('active'); searchInput.value=''; currentSearch=''; renderProducts(); }
  });
  searchBtn.addEventListener('click', () => { suggestionsBox.classList.remove('active'); renderProducts(); });
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrapper')) suggestionsBox.classList.remove('active');
  });

  // back to top
  window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 400), { passive:true });
  backTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  // footer store links
  window.filterByStore = function(store) {
    storeBtns.forEach(b => b.classList.toggle('active', b.dataset.store === store));
    currentStore = store;
    renderProducts();
    document.getElementById('products').scrollIntoView({ behavior:'smooth' });
  };

  /* ── shared product links ──
     Someone can visit yoursite.com/?product=17 (copied from the admin
     dashboard) and that exact product's popup opens automatically —
     a clean, branded link to post on social media instead of a raw
     affiliate URL. */
  let sharedProductHandled = false;
  function tryOpenSharedProduct() {
    if (sharedProductHandled) return;
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get('product');
    if (!sharedId) { sharedProductHandled = true; return; }
    const match = products.find(x => String(x.docId || x.id) === String(sharedId));
    if (match) {
      openModal(sharedId);
      sharedProductHandled = true;
    }
  }

  /* ── init ── */
  renderProducts();
  tryOpenSharedProduct();

  // Connect to the database for live product data, if configured.
  if (typeof SUPABASE_CONFIGURED !== 'undefined' && SUPABASE_CONFIGURED &&
      typeof ProductService !== 'undefined') {
    ProductService.onProductsChange(
      liveProducts => {
        if (liveProducts.length) {
          products = liveProducts;
          renderProducts();
          tryOpenSharedProduct();
        }
      },
      () => { /* on error, silently keep showing the bundled products.js data */ }
    );
  }

})();
