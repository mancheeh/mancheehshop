/* =====================================================
   products-service.js
   ─────────────────────────────────────────────────────
   One shared layer for reading/writing products and
   uploading photos, backed by Supabase (Postgres +
   Storage). Used by index.html (read-only, live) and
   admin.html (full read/write + photo upload).

   Table: "products"   (see SETUP-GUIDE.md for the exact
   SQL to create it — columns are snake_case in Postgres,
   this layer converts to/from the camelCase shape the
   rest of the site uses.)
   Storage bucket: "product-images"
   ===================================================== */

const ProductService = {
  table: 'products',
  bucket: 'product-images',

  // DB row → app-friendly product object
  _fromRow(row) {
    return {
      docId: row.id,
      name: row.name || '',
      desc: row.description || '',
      price: row.price || '',
      category: row.category || '',
      store: row.store || '',
      img: row.img || '',
      affiliateUrl: row.affiliate_url || '#',
      features: row.features || [],
    };
  },

  // app-friendly product object → DB row (for insert/update)
  _toRow(p) {
    return {
      name: p.name,
      description: p.desc,
      price: p.price,
      category: p.category,
      store: p.store,
      img: p.img,
      affiliate_url: p.affiliateUrl,
      features: p.features || [],
    };
  },

  /**
   * Live-subscribe to the product list. Calls `callback`
   * immediately with the current data, then again every
   * time something changes in the database (e.g. right
   * after you save an edit in admin.html, the storefront
   * updates on its own — no refresh needed).
   * Returns an unsubscribe function.
   */
  onProductsChange(callback, onError) {
    let cancelled = false;
    const load = () => this.getAll().then(rows => { if (!cancelled) callback(rows); })
      .catch(err => { if (onError) onError(err); });
    load();

    const channel = supabaseClient
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: this.table }, load)
      .subscribe();

    return () => { cancelled = true; supabaseClient.removeChannel(channel); };
  },

  async getAll() {
    const { data, error } = await supabaseClient.from(this.table).select('*').order('id', { ascending: true });
    if (error) throw error;
    return (data || []).map(row => this._fromRow(row));
  },

  async add(product) {
    const { error } = await supabaseClient.from(this.table).insert(this._toRow(product));
    if (error) throw error;
  },

  async update(docId, product) {
    const { error } = await supabaseClient.from(this.table).update(this._toRow(product)).eq('id', docId);
    if (error) throw error;
  },

  async remove(docId) {
    const { error } = await supabaseClient.from(this.table).delete().eq('id', docId);
    if (error) throw error;
  },

  /** Upload a photo File from the admin's device to Supabase
   *  Storage and return its public URL, ready to save on the
   *  product's `img` field. */
  async uploadImage(file) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabaseClient.storage.from(this.bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabaseClient.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  /** One-time helper: push an array of plain product objects
   *  (e.g. the old PRODUCTS array from products.js) into
   *  Supabase. Drops the old numeric `id` so Postgres assigns
   *  its own. */
  async bulkImport(productsArray) {
    const rows = productsArray.map(p => this._toRow({
      name: p.name, desc: p.desc, price: p.price, category: p.category,
      store: p.store, img: p.img, affiliateUrl: p.affiliateUrl, features: p.features,
    }));
    const { error } = await supabaseClient.from(this.table).insert(rows);
    if (error) throw error;
    return rows.length;
  }
};
