(function () {
  'use strict';

  const categoryMap = { phone:'Phone Accessories', beauty:'Beauty & Hair', trending:'Trending', medicine:'Medicines' };

  /* ── DOM refs ── */
  const loginScreen  = document.getElementById('loginScreen');
  const loginForm    = document.getElementById('loginForm');
  const loginEmail   = document.getElementById('loginEmail');
  const loginPassword= document.getElementById('loginPassword');
  const loginBtn     = document.getElementById('loginBtn');
  const loginError   = document.getElementById('loginError');
  const configHint   = document.getElementById('configHint');

  const dashboard     = document.getElementById('dashboard');
  const adminEmailEl  = document.getElementById('adminEmail');
  const logoutBtn     = document.getElementById('logoutBtn');
  const productsBody  = document.getElementById('productsBody');
  const countPill     = document.getElementById('countPill');
  const adminSearch   = document.getElementById('adminSearch');
  const adminStatus   = document.getElementById('adminStatus');
  const addProductBtn = document.getElementById('addProductBtn');

  const formOverlay  = document.getElementById('formOverlay');
  const productForm  = document.getElementById('productForm');
  const formTitle    = document.getElementById('formTitle');
  const formClose    = document.getElementById('formClose');
  const formCancel   = document.getElementById('formCancel');

  const f_docId   = document.getElementById('f_docId');
  const f_name    = document.getElementById('f_name');
  const f_desc    = document.getElementById('f_desc');
  const f_price   = document.getElementById('f_price');
  const f_store   = document.getElementById('f_store');
  const f_category= document.getElementById('f_category');
  const f_img     = document.getElementById('f_img');
  const f_imgFile = document.getElementById('f_imgFile');
  const imgPreviewRow = document.getElementById('imgPreviewRow');
  const imgPreview = document.getElementById('imgPreview');
  const imgUploadStatus = document.getElementById('imgUploadStatus');
  const f_affiliateUrl = document.getElementById('f_affiliateUrl');
  const f_features = document.getElementById('f_features');

  let allProducts = [];
  let unsubscribe = null;

  /* ── config check ── */
  if (typeof SUPABASE_CONFIGURED !== 'undefined' && !SUPABASE_CONFIGURED) {
    configHint.style.display = 'block';
    loginBtn.disabled = true;
  }

  /* ── theme ── */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mancheeh-theme', theme);
    document.querySelectorAll('.theme-toggle i').forEach(i => {
      i.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
  }
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('themeToggle2').addEventListener('click', toggleTheme);

  /* ── auth ── */
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    loginError.textContent = '';
    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in…';
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: loginEmail.value.trim(),
      password: loginPassword.value,
    });
    if (error) loginError.textContent = friendlyAuthError(error);
    loginBtn.disabled = false;
    loginBtn.textContent = 'Sign in';
  });

  function friendlyAuthError(err) {
    const msg = (err && err.message) || '';
    if (/invalid login credentials/i.test(msg)) return 'Incorrect email or password.';
    if (/rate limit/i.test(msg)) return 'Too many attempts — please wait a moment and try again.';
    return 'Sign-in failed: ' + msg;
  }

  logoutBtn.addEventListener('click', () => supabaseClient.auth.signOut());

  if (typeof supabaseClient !== 'undefined' && supabaseClient) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      const user = session && session.user;
      if (user) {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';
        adminEmailEl.textContent = user.email;
        if (!unsubscribe) startListening();
      } else {
        dashboard.style.display = 'none';
        loginScreen.style.display = 'flex';
        if (unsubscribe) { unsubscribe(); unsubscribe = null; }
      }
    });
  }

  /* ── data ── */
  function startListening() {
    setStatus('Loading products…');
    unsubscribe = ProductService.onProductsChange(
      products => {
        allProducts = products;
        setStatus('');
        renderTable();
      },
      err => setStatus('Could not load products: ' + err.message, true)
    );
  }

  function setStatus(msg, isError) {
    adminStatus.textContent = msg || '';
    adminStatus.classList.toggle('error', !!isError);
  }

  function renderTable() {
    const term = adminSearch.value.trim().toLowerCase();
    const filtered = !term ? allProducts : allProducts.filter(p =>
      (p.name || '').toLowerCase().includes(term) ||
      (p.category || '').toLowerCase().includes(term) ||
      (p.store || '').toLowerCase().includes(term)
    );
    countPill.textContent = allProducts.length;

    if (!filtered.length) {
      productsBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-soft);">No products found.</td></tr>`;
      return;
    }

    productsBody.innerHTML = filtered.map(p => `
      <tr>
        <td><img class="row-thumb" src="${escHtml(p.img || '')}" onerror="this.src='https://placehold.co/60x60?text=?'" alt="" /></td>
        <td>
          <div class="row-name">${escHtml(p.name || '(untitled)')}</div>
          <div class="row-desc">${escHtml(p.desc || '')}</div>
        </td>
        <td><span class="store-chip ${p.store === 'amazon' ? 'amazon' : 'jumia'}">${p.store === 'amazon' ? 'Amazon' : 'Jumia'}</span></td>
        <td><span class="cat-chip">${escHtml(categoryMap[p.category] || p.category || '')}</span></td>
        <td>${escHtml(p.price || '—')}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon" data-edit="${p.docId}" aria-label="Edit"><i class="fas fa-pen"></i></button>
            <button class="btn-danger" data-delete="${p.docId}">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  adminSearch.addEventListener('input', renderTable);

  productsBody.addEventListener('click', e => {
    const editId = e.target.closest('[data-edit]')?.dataset.edit;
    const delId  = e.target.closest('[data-delete]')?.dataset.delete;
    if (editId) openForm(allProducts.find(p => p.docId === editId));
    if (delId) confirmDelete(delId);
  });

  async function confirmDelete(docId) {
    const p = allProducts.find(x => x.docId === docId);
    if (!confirm(`Delete "${p ? p.name : 'this product'}"? This can't be undone.`)) return;
    try {
      await ProductService.remove(docId);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  }

  /* ── add/edit form ── */
  function openForm(product) {
    productForm.reset();
    imgUploadStatus.textContent = '';
    imgUploadStatus.className = 'img-upload-status';
    if (product) {
      formTitle.textContent = 'Edit product';
      f_docId.value = product.docId;
      f_name.value = product.name || '';
      f_desc.value = product.desc || '';
      f_price.value = product.price || '';
      f_store.value = product.store || 'amazon';
      f_category.value = product.category || 'phone';
      f_img.value = product.img || '';
      f_affiliateUrl.value = product.affiliateUrl || '';
      f_features.value = (product.features || []).join('\n');
      if (product.img) {
        imgPreviewRow.style.display = 'flex';
        imgPreview.src = product.img;
      } else {
        imgPreviewRow.style.display = 'none';
      }
    } else {
      formTitle.textContent = 'Add product';
      f_docId.value = '';
      imgPreviewRow.style.display = 'none';
    }
    formOverlay.classList.add('open');
  }

  function closeForm() { formOverlay.classList.remove('open'); }

  addProductBtn.addEventListener('click', () => openForm(null));
  formClose.addEventListener('click', closeForm);
  formCancel.addEventListener('click', closeForm);
  formOverlay.addEventListener('click', e => { if (e.target === e.currentTarget) closeForm(); });

  f_imgFile.addEventListener('change', async () => {
    const file = f_imgFile.files[0];
    if (!file) return;

    imgPreviewRow.style.display = 'flex';
    imgPreview.src = URL.createObjectURL(file);
    imgUploadStatus.textContent = 'Uploading…';
    imgUploadStatus.className = 'img-upload-status';

    try {
      const url = await ProductService.uploadImage(file);
      f_img.value = url;
      imgUploadStatus.textContent = 'Uploaded ✓';
      imgUploadStatus.className = 'img-upload-status success';
    } catch (err) {
      imgUploadStatus.textContent = 'Upload failed: ' + err.message;
      imgUploadStatus.className = 'img-upload-status error';
    }
  });

  productForm.addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = document.getElementById('formSubmit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving…';

    const data = {
      name: f_name.value.trim(),
      desc: f_desc.value.trim(),
      price: f_price.value.trim(),
      store: f_store.value,
      category: f_category.value,
      img: f_img.value.trim(),
      affiliateUrl: f_affiliateUrl.value.trim() || '#',
      features: f_features.value.split('\n').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (f_docId.value) {
        await ProductService.update(f_docId.value, data);
      } else {
        await ProductService.add(data);
      }
      closeForm();
    } catch (err) {
      alert('Failed to save: ' + err.message);
    }
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save product';
  });

})();
