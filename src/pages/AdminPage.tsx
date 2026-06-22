import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Tags, ShoppingCart, Percent, Megaphone,
  Plus, Edit2, Trash2, X, AlertTriangle,
  DollarSign, Eye, EyeOff, Save, RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Category, Order, DiscountCode, Banner } from '../types';
import { formatPrice, slugify } from '../lib/utils';

type AdminTab = 'dashboard' | 'products' | 'categories' | 'orders' | 'discounts' | 'banners';

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('dashboard');

  const navItems: { id: AdminTab; icon: React.FC<any>; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'categories', icon: Tags, label: 'Categories' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'discounts', icon: Percent, label: 'Discounts' },
    { id: 'banners', icon: Megaphone, label: 'Banners' },
  ];

  return (
    <div className="min-h-screen pt-20 flex">
      {/* Sidebar */}
      <nav className="w-56 shrink-0 border-r border-white/10 p-4 hidden lg:block">
        <p className="text-neutral-600 text-xs uppercase tracking-widest mb-4 px-3">Admin</p>
        <div className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                tab === item.id
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-neutral-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile tabs */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-white/10 flex overflow-x-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors min-w-max px-3 ${
              tab === item.id ? 'text-white' : 'text-neutral-600'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'dashboard' && <DashboardPanel />}
            {tab === 'products' && <ProductsPanel />}
            {tab === 'categories' && <CategoriesPanel />}
            {tab === 'orders' && <OrdersPanel />}
            {tab === 'discounts' && <DiscountsPanel />}
            {tab === 'banners' && <BannersPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardPanel() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, lowStock: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('total, status'),
      supabase.from('products').select('stock_quantity, low_stock_threshold, is_active'),
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(5),
    ]).then(([ordersRes, productsRes, recentRes]) => {
      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
      const lowStock = products.filter((p: any) => p.stock_quantity <= p.low_stock_threshold && p.is_active).length;
      setStats({ orders: orders.length, revenue, products: products.length, lowStock });
      setRecentOrders(recentRes.data || []);
    });
  }, []);

  const statCards = [
    { label: 'Total Orders', value: stats.orders.toString(), icon: ShoppingCart, color: 'text-primary-400', bg: 'bg-primary-500/10' },
    { label: 'Revenue (GHS)', value: formatPrice(stats.revenue, 'GHS'), icon: DollarSign, color: 'text-success-400', bg: 'bg-success-500/10' },
    { label: 'Products', value: stats.products.toString(), icon: Package, color: 'text-accent-400', bg: 'bg-accent-500/10' },
    { label: 'Low Stock Alerts', value: stats.lowStock.toString(), icon: AlertTriangle, color: 'text-warning-400', bg: 'bg-warning-500/10' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold text-white">Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="glass-dark rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon size={18} className={card.color} />
            </div>
            <p className="text-white text-xl font-semibold">{card.value}</p>
            <p className="text-neutral-500 text-xs mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Recent Orders</h3>
        <div className="glass-dark rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-neutral-500 text-xs px-4 py-3 font-medium">Order #</th>
                  <th className="text-left text-neutral-500 text-xs px-4 py-3 font-medium">Customer</th>
                  <th className="text-left text-neutral-500 text-xs px-4 py-3 font-medium">Total</th>
                  <th className="text-left text-neutral-500 text-xs px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3 text-white text-xs font-mono">{order.order_number}</td>
                    <td className="px-4 py-3 text-neutral-300 text-xs">{order.customer_name}</td>
                    <td className="px-4 py-3 text-white text-xs">{formatPrice(order.total, 'GHS')}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-neutral-600 text-sm">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────

function ProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(blankProduct());
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  function blankProduct() {
    return { name: '', description: '', price: '', compare_at_price: '', category_id: '', stock_quantity: '', low_stock_threshold: '5', sku: '', images: '', tags: '', colors: '', is_active: true, is_featured: false };
  }

  const loadData = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setProducts(prodRes.data || []);
    setCategories(catRes.data || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(blankProduct());
    setImageFiles([]);
    setImagePreviews([]);
    setFormOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, price: p.price.toString(),
      compare_at_price: p.compare_at_price?.toString() || '',
      category_id: p.category_id || '', stock_quantity: p.stock_quantity.toString(),
      low_stock_threshold: p.low_stock_threshold.toString(), sku: p.sku || '',
      images: p.images.join('\n'), tags: p.tags.join(', '),
      colors: (p.colors || []).join(', '),
      is_active: p.is_active, is_featured: p.is_featured,
    });
    setImageFiles([]);
    setImagePreviews(p.images || []);
    setFormOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageFiles(prev => [...prev, ...files]);

    // Generate previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews(prev => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    // Check if it's an existing URL or a new file
    const existingUrls = form.images.split('\n').filter(Boolean);
    if (index < existingUrls.length) {
      // Remove from existing URLs
      const updated = existingUrls.filter((_, i) => i !== index);
      setForm(f => ({ ...f, images: updated.join('\n') }));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove from new files
      const fileIndex = index - existingUrls.length;
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    setUploadingImages(true);
    const urls: string[] = [];

    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (!error) {
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        urls.push(urlData.publicUrl);
      }
    }

    setUploadingImages(false);
    return urls;
  };

  const save = async () => {
    setSaving(true);

    // Upload new images first
    const uploadedUrls = await uploadImages();

    // Combine existing URLs with newly uploaded ones
    const existingUrls = form.images.split('\n').map(s => s.trim()).filter(Boolean);
    const allImages = [...existingUrls, ...uploadedUrls];

    const payload: any = {
      name: form.name,
      slug: slugify(form.name),
      description: form.description,
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      category_id: form.category_id || null,
      stock_quantity: parseInt(form.stock_quantity),
      low_stock_threshold: parseInt(form.low_stock_threshold),
      sku: form.sku || null,
      images: allImages,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
      is_active: form.is_active,
      is_featured: form.is_featured,
      updated_at: new Date().toISOString(),
    };
    if (editing) {
      await supabase.from('products').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('products').insert(payload);
    }
    setSaving(false);
    setFormOpen(false);
    setImageFiles([]);
    setImagePreviews([]);
    loadData();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold text-white">Products</h2>
        <button onClick={openCreate} className="btn-primary text-sm py-2">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 loader-ring" />
        </div>
      ) : (
        <div className="glass-dark rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-neutral-500 text-xs px-4 py-3 font-medium">Product</th>
                  <th className="text-left text-neutral-500 text-xs px-4 py-3 font-medium">Price</th>
                  <th className="text-left text-neutral-500 text-xs px-4 py-3 font-medium">Stock</th>
                  <th className="text-left text-neutral-500 text-xs px-4 py-3 font-medium">Status</th>
                  <th className="text-right text-neutral-500 text-xs px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images[0] && (
                          <img src={`${p.images[0]}?auto=compress&w=64`} alt="" className="w-9 h-9 rounded-lg object-cover bg-neutral-800" />
                        )}
                        <div>
                          <p className="text-white text-xs font-medium">{p.name}</p>
                          <p className="text-neutral-600 text-xs">{p.sku || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white text-xs">{formatPrice(p.price, 'GHS')}</td>
                    <td className="px-4 py-3">
                      <StockBadge quantity={p.stock_quantity} threshold={p.low_stock_threshold} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${p.is_active ? 'bg-success-500/10 text-success-400' : 'bg-neutral-800 text-neutral-500'}`}>
                        {p.is_active ? 'In Stock' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => deleteProduct(p.id)} className="p-1.5 hover:bg-error-500/10 rounded-lg text-neutral-400 hover:text-error-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product form modal */}
      <AnimatePresence>
        {formOpen && (
          <Modal title={editing ? 'Edit Product' : 'Add Product'} onClose={() => setFormOpen(false)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field text-sm" placeholder="Product Name" />
                </div>
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">SKU</label>
                  <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className="input-field text-sm" placeholder="SKU-001" />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 text-xs mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field text-sm h-20 resize-none" placeholder="Product description..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Price (GHS) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-field text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Compare Price (GHS)</label>
                  <input type="number" value={form.compare_at_price} onChange={e => setForm(f => ({ ...f, compare_at_price: e.target.value }))} className="input-field text-sm" placeholder="Original price" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Category</label>
                  <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className="input-field text-sm">
                    <option value="">None</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Stock</label>
                  <input type="number" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))} className="input-field text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Low Stock Alert</label>
                  <input type="number" value={form.low_stock_threshold} onChange={e => setForm(f => ({ ...f, low_stock_threshold: e.target.value }))} className="input-field text-sm" placeholder="5" />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 text-xs mb-1.5 block">Product Images</label>
                {/* Image previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-neutral-800">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-error-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Upload button */}
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-white/30 hover:bg-white/2 transition-all">
                  <div className="flex flex-col items-center">
                    <Plus size={18} className="text-neutral-500 mb-1" />
                    <span className="text-neutral-500 text-xs">Click to upload images</span>
                    <span className="text-neutral-600 text-xs mt-0.5">JPG, PNG, WebP (max 5MB each)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                {/* Still allow URL input as fallback */}
                <details className="mt-2">
                  <summary className="text-neutral-600 text-xs cursor-pointer hover:text-neutral-400">Or add image URLs manually</summary>
                  <textarea value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))} className="input-field text-sm h-16 resize-none font-mono text-xs mt-2" placeholder="https://... (one per line)" />
                </details>
              </div>

              <div>
                <label className="text-neutral-400 text-xs mb-1.5 block">Tags (comma-separated)</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="input-field text-sm" placeholder="shades, fashion, new arrival" />
              </div>

              <div>
                <label className="text-neutral-400 text-xs mb-1.5 block">Colors (comma-separated)</label>
                <input value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} className="input-field text-sm" placeholder="Black, White, Pink, Beige" />
                <p className="text-neutral-600 text-xs mt-1">Customers will pick from these on the product page. Leave blank for no color options.</p>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
                  <span className="text-neutral-300 text-sm">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="rounded" />
                  <span className="text-neutral-300 text-sm">Featured</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setFormOpen(false)} className="btn-secondary text-sm py-2">Cancel</button>
                <button onClick={save} disabled={saving || uploadingImages || !form.name || !form.price} className="btn-primary text-sm py-2">
                  {saving || uploadingImages ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 loader-ring" />
                      {uploadingImages ? 'Uploading images...' : 'Saving...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><Save size={14} /> Save</span>
                  )}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

function CategoriesPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '', image_url: '', sort_order: '0' });
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const load = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories(data || []);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', image_url: '', sort_order: '0' });
    setImageFile(null);
    setImagePreview('');
    setFormOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description, image_url: c.image_url, sort_order: c.sort_order.toString() });
    setImageFile(null);
    setImagePreview(c.image_url || '');
    setFormOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadCategoryImage = async (): Promise<string> => {
    if (!imageFile) return form.image_url;
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `categories/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });

    if (error) return form.image_url;

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const save = async () => {
    setSaving(true);
    const imageUrl = await uploadCategoryImage();
    const payload = { name: form.name, slug: slugify(form.name), description: form.description, image_url: imageUrl, sort_order: parseInt(form.sort_order) };
    if (editing) await supabase.from('categories').update(payload).eq('id', editing.id);
    else await supabase.from('categories').insert(payload);
    setSaving(false);
    setFormOpen(false);
    setImageFile(null);
    setImagePreview('');
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold text-white">Categories</h2>
        <button onClick={openCreate} className="btn-primary text-sm py-2"><Plus size={14} /> Add Category</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="glass-dark rounded-xl overflow-hidden">
            {cat.image_url && (
              <img src={cat.image_url} alt="" className="w-full h-32 object-cover" />
            )}
            {!cat.image_url && (
              <div className="w-full h-32 bg-neutral-800 flex items-center justify-center">
                <span className="text-neutral-600 text-xs">No image</span>
              </div>
            )}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{cat.name}</p>
                <p className="text-neutral-500 text-xs mt-0.5 line-clamp-1">{cat.description || '—'}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-white/5 rounded text-neutral-400 hover:text-white transition-colors"><Edit2 size={13} /></button>
                <button onClick={() => del(cat.id)} className="p-1.5 hover:bg-error-500/10 rounded text-neutral-400 hover:text-error-400 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {formOpen && (
          <Modal title={editing ? 'Edit Category' : 'Add Category'} onClose={() => setFormOpen(false)}>
            <div className="space-y-4">
              <div>
                <label className="text-neutral-400 text-xs mb-1.5 block">Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field text-sm" placeholder="Category name" />
              </div>
              <div>
                <label className="text-neutral-400 text-xs mb-1.5 block">Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field text-sm" placeholder="Short description" />
              </div>
              <div>
                <label className="text-neutral-400 text-xs mb-1.5 block">Category Image</label>
                {imagePreview && (
                  <div className="relative mb-3 rounded-xl overflow-hidden h-36 bg-neutral-800">
                    <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(''); setForm(f => ({ ...f, image_url: '' })); }}
                      className="absolute top-2 right-2 w-6 h-6 bg-error-500 rounded-full flex items-center justify-center"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                )}
                {!imagePreview && (
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-white/30 hover:bg-white/2 transition-all">
                    <div className="flex flex-col items-center">
                      <Plus size={18} className="text-neutral-500 mb-1" />
                      <span className="text-neutral-500 text-xs">Click to upload image</span>
                      <span className="text-neutral-600 text-xs mt-0.5">JPG, PNG, WebP (max 5MB)</span>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <label className="text-neutral-400 text-xs mb-1.5 block">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} className="input-field text-sm w-24" />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setFormOpen(false)} className="btn-secondary text-sm py-2">Cancel</button>
                <button onClick={save} disabled={saving || !form.name} className="btn-primary text-sm py-2">
                  {saving ? '...' : <><Save size={14} /> Save</>}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Orders ───────────────────────────────────────────────────────────────────

function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    load();
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as any } : null);
  };

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold text-white">Orders</h2>
        <button onClick={load} className="p-2 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors"><RefreshCw size={16} /></button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="w-6 h-6 loader-ring" /></div>
      ) : (
        <div className="glass-dark rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="text-left text-neutral-500 text-xs px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3 text-white text-xs font-mono">{order.order_number}</td>
                    <td className="px-4 py-3">
                      <p className="text-neutral-200 text-xs">{order.customer_name}</p>
                      <p className="text-neutral-600 text-xs">{order.customer_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {(order.order_items || []).length > 0 ? (
                        <div className="space-y-0.5">
                          {(order.order_items || []).map((item: any) => (
                            <p key={item.id} className="text-neutral-300 text-xs truncate max-w-48">
                              {item.product_name} × {item.quantity}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <span className="text-neutral-600 text-xs italic">No items</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white text-xs">{formatPrice(order.total, 'GHS')}</td>
                    <td className="px-4 py-3">
                      <span className="text-neutral-400 text-xs capitalize">{order.payment_method.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className="bg-transparent text-xs border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:border-white/30"
                      >
                        {statuses.map(s => <option key={s} value={s} className="bg-neutral-900">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(order)} className="p-1.5 hover:bg-white/5 rounded text-neutral-400 hover:text-white transition-colors">
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-neutral-600 text-sm">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <Modal title={`Order ${selected.order_number}`} onClose={() => setSelected(null)}>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <Info2 label="Customer" value={selected.customer_name} />
                <Info2 label="Email" value={selected.customer_email} />
                <Info2 label="Phone" value={selected.customer_phone} />
                <Info2 label="Payment" value={selected.payment_method.replace(/_/g, ' ')} />
              </div>
              {selected.shipping_address && (
                <Info2
                  label="Address"
                  value={`${(selected.shipping_address as any).street}, ${(selected.shipping_address as any).city}, ${(selected.shipping_address as any).region}`}
                />
              )}
              <div className="border-t border-white/10 pt-4">
                <p className="text-neutral-500 text-xs mb-3">Items Ordered</p>
                {(selected.order_items || []).length === 0 ? (
                  <p className="text-neutral-600 text-xs italic">No item details recorded for this order. This may be from before the system fix.</p>
                ) : (
                  (selected.order_items || []).map((item: any) => {
                    // Parse color from product name (format: "Product Name - Color")
                    const parts = item.product_name.split(' - ');
                    const productName = parts[0];
                    const color = parts.length > 1 ? parts.slice(1).join(' - ') : null;

                    return (
                      <div key={item.id} className="py-3 border-b border-white/5 last:border-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-neutral-200 text-sm font-medium">{productName}</p>
                            <div className="flex gap-3 mt-1">
                              {color && (
                                <span className="text-xs text-primary-400">Color: {color}</span>
                              )}
                              <span className="text-xs text-neutral-500">Qty: {item.quantity}</span>
                              <span className="text-xs text-neutral-500">@ {formatPrice(item.unit_price, 'GHS')} each</span>
                            </div>
                          </div>
                          <span className="text-white text-sm font-medium">{formatPrice(item.total_price, 'GHS')}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div className="flex justify-between text-sm font-semibold mt-4 pt-3 border-t border-white/10">
                  <span className="text-white">Total</span>
                  <span className="text-white">{formatPrice(selected.total, 'GHS')}</span>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Discounts ────────────────────────────────────────────────────────────────

function DiscountsPanel() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ code: '', description: '', discount_type: 'percentage', discount_value: '', min_purchase_amount: '0', max_uses: '', expires_at: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('discount_codes').select('*').order('created_at', { ascending: false });
    setCodes(data || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    await supabase.from('discount_codes').insert({
      code: form.code.toUpperCase(),
      description: form.description,
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      min_purchase_amount: parseFloat(form.min_purchase_amount) || 0,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      expires_at: form.expires_at || null,
    });
    setSaving(false);
    setFormOpen(false);
    load();
  };

  const toggle = async (id: string, is_active: boolean) => {
    await supabase.from('discount_codes').update({ is_active: !is_active }).eq('id', id);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this code?')) return;
    await supabase.from('discount_codes').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold text-white">Discount Codes</h2>
        <button onClick={() => setFormOpen(true)} className="btn-primary text-sm py-2"><Plus size={14} /> Create Code</button>
      </div>

      <div className="glass-dark rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Code', 'Type', 'Value', 'Min Order', 'Uses', 'Expires', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-neutral-500 text-xs px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {codes.map(code => (
                <tr key={code.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-white text-xs font-mono font-semibold">{code.code}</td>
                  <td className="px-4 py-3 text-neutral-400 text-xs capitalize">{code.discount_type.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-primary-400 text-xs font-semibold">
                    {code.discount_type === 'percentage' ? `${code.discount_value}%` : formatPrice(code.discount_value, 'GHS')}
                  </td>
                  <td className="px-4 py-3 text-neutral-400 text-xs">{formatPrice(code.min_purchase_amount, 'GHS')}</td>
                  <td className="px-4 py-3 text-neutral-400 text-xs">{code.current_uses}{code.max_uses ? `/${code.max_uses}` : ''}</td>
                  <td className="px-4 py-3 text-neutral-400 text-xs">{code.expires_at ? new Date(code.expires_at).toLocaleDateString() : 'Never'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${code.is_active ? 'bg-success-500/10 text-success-400' : 'bg-neutral-800 text-neutral-500'}`}>
                      {code.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => toggle(code.id, code.is_active)} className="p-1.5 hover:bg-white/5 rounded text-neutral-400 hover:text-white transition-colors">
                        {code.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button onClick={() => del(code.id)} className="p-1.5 hover:bg-error-500/10 rounded text-neutral-400 hover:text-error-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {codes.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-neutral-600 text-sm">No discount codes</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {formOpen && (
          <Modal title="Create Discount Code" onClose={() => setFormOpen(false)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Code *</label>
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="input-field text-sm font-mono" placeholder="SAVE20" />
                </div>
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Type *</label>
                  <select value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))} className="input-field text-sm">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount (GHS)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Value *</label>
                  <input type="number" value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))} className="input-field text-sm" placeholder="10" />
                </div>
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Min Order (GHS)</label>
                  <input type="number" value={form.min_purchase_amount} onChange={e => setForm(f => ({ ...f, min_purchase_amount: e.target.value }))} className="input-field text-sm" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Max Uses</label>
                  <input type="number" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))} className="input-field text-sm" placeholder="Unlimited" />
                </div>
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Expires At</label>
                  <input type="date" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} className="input-field text-sm" />
                </div>
              </div>
              <div>
                <label className="text-neutral-400 text-xs mb-1.5 block">Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field text-sm" placeholder="Short description for reference" />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setFormOpen(false)} className="btn-secondary text-sm py-2">Cancel</button>
                <button onClick={save} disabled={saving || !form.code || !form.discount_value} className="btn-primary text-sm py-2">
                  {saving ? '...' : <><Plus size={14} /> Create</>}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Banners ──────────────────────────────────────────────────────────────────

function BannersPanel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', cta_text: 'Shop Now', cta_link: '/products', image_url: '', background_color: '#000000', text_color: '#ffffff', banner_type: 'hero', sort_order: '0' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('banners').select('*').order('sort_order');
    setBanners(data || []);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ title: '', subtitle: '', cta_text: 'Shop Now', cta_link: '/products', image_url: '', background_color: '#000000', text_color: '#ffffff', banner_type: 'hero', sort_order: '0' }); setFormOpen(true); };
  const openEdit = (b: Banner) => { setEditing(b); setForm({ title: b.title, subtitle: b.subtitle, cta_text: b.cta_text, cta_link: b.cta_link, image_url: b.image_url, background_color: b.background_color, text_color: b.text_color, banner_type: b.banner_type, sort_order: b.sort_order.toString() }); setFormOpen(true); };

  const save = async () => {
    setSaving(true);
    const payload = { ...form, sort_order: parseInt(form.sort_order), is_active: true } as any;
    if (editing) await supabase.from('banners').update(payload).eq('id', editing.id);
    else await supabase.from('banners').insert(payload);
    setSaving(false);
    setFormOpen(false);
    load();
  };

  const toggle = async (id: string, is_active: boolean) => {
    await supabase.from('banners').update({ is_active: !is_active }).eq('id', id);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    await supabase.from('banners').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold text-white">Banners</h2>
        <button onClick={openCreate} className="btn-primary text-sm py-2"><Plus size={14} /> Add Banner</button>
      </div>

      <div className="space-y-3">
        {banners.map(banner => (
          <div key={banner.id} className="glass-dark rounded-xl p-4 flex items-center gap-4">
            {banner.image_url && (
              <img src={`${banner.image_url}?auto=compress&w=80`} alt="" className="w-14 h-10 object-cover rounded-lg" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{banner.title}</p>
              <p className="text-neutral-500 text-xs capitalize">{banner.banner_type} • {banner.subtitle}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs shrink-0 ${banner.is_active ? 'bg-success-500/10 text-success-400' : 'bg-neutral-800 text-neutral-500'}`}>
              {banner.is_active ? 'Active' : 'Hidden'}
            </span>
            <div className="flex gap-1">
              <button onClick={() => toggle(banner.id, banner.is_active)} className="p-1.5 hover:bg-white/5 rounded text-neutral-400 hover:text-white transition-colors">
                {banner.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
              <button onClick={() => openEdit(banner)} className="p-1.5 hover:bg-white/5 rounded text-neutral-400 hover:text-white transition-colors">
                <Edit2 size={13} />
              </button>
              <button onClick={() => del(banner.id)} className="p-1.5 hover:bg-error-500/10 rounded text-neutral-400 hover:text-error-400 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-12 text-neutral-600 text-sm glass-dark rounded-2xl">No banners yet</div>
        )}
      </div>

      <AnimatePresence>
        {formOpen && (
          <Modal title={editing ? 'Edit Banner' : 'Add Banner'} onClose={() => setFormOpen(false)}>
            <div className="space-y-4">
              <div>
                <label className="text-neutral-400 text-xs mb-1.5 block">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-field text-sm" />
              </div>
              <div>
                <label className="text-neutral-400 text-xs mb-1.5 block">Subtitle</label>
                <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="input-field text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">CTA Text</label>
                  <input value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))} className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">CTA Link</label>
                  <input value={form.cta_link} onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))} className="input-field text-sm" />
                </div>
              </div>
              <div>
                <label className="text-neutral-400 text-xs mb-1.5 block">Image URL</label>
                <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="input-field text-sm" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Banner Type</label>
                  <select value={form.banner_type} onChange={e => setForm(f => ({ ...f, banner_type: e.target.value }))} className="input-field text-sm">
                    <option value="hero">Hero</option>
                    <option value="promotional">Promotional</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 text-xs mb-1.5 block">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} className="input-field text-sm w-24" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setFormOpen(false)} className="btn-secondary text-sm py-2">Cancel</button>
                <button onClick={save} disabled={saving || !form.title} className="btn-primary text-sm py-2">
                  {saving ? '...' : <><Save size={14} /> Save</>}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-lg glass-dark rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="text-white font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-warning-500/10 text-warning-400',
    confirmed: 'bg-primary-500/10 text-primary-400',
    processing: 'bg-accent-500/10 text-accent-400',
    shipped: 'bg-success-500/10 text-success-400',
    delivered: 'bg-success-500/20 text-success-300',
    cancelled: 'bg-error-500/10 text-error-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${colors[status] || 'bg-neutral-800 text-neutral-400'}`}>
      {status}
    </span>
  );
}

function StockBadge({ quantity, threshold }: { quantity: number; threshold: number }) {
  if (quantity === 0) return <span className="text-error-400 text-xs">Out of stock</span>;
  if (quantity <= threshold) return <span className="text-warning-400 text-xs">{quantity} (low)</span>;
  return <span className="text-success-400 text-xs">{quantity}</span>;
}

function Info2({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-neutral-500 text-xs mb-0.5">{label}</p>
      <p className="text-white text-sm">{value}</p>
    </div>
  );
}
