import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../types';
import ProductCard from '../components/products/ProductCard';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categorySlug = searchParams.get('category') || '';
  const featured = searchParams.get('featured') === 'true';
  const sale = searchParams.get('sale') === 'true';
  const query = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState('newest');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      setCategories(data || []);
    });
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true);

    if (categorySlug) {
      const cat = categories.find(c => c.slug === categorySlug);
      if (cat) q = q.eq('category_id', cat.id);
    }
    if (featured) q = q.eq('is_featured', true);
    if (sale) q = q.not('compare_at_price', 'is', null);
    if (query) q = q.ilike('name', `%${query}%`);
    if (priceMin) q = q.gte('price', parseFloat(priceMin));
    if (priceMax) q = q.lte('price', parseFloat(priceMax));

    if (sortBy === 'newest') q = q.order('created_at', { ascending: false });
    else if (sortBy === 'price_asc') q = q.order('price', { ascending: true });
    else if (sortBy === 'price_desc') q = q.order('price', { ascending: false });
    else if (sortBy === 'name') q = q.order('name');

    const { data } = await q.limit(48);
    setProducts(data || []);
    setLoading(false);
  }, [categorySlug, featured, sale, query, sortBy, priceMin, priceMax, categories]);

  useEffect(() => {
    if (categories.length > 0 || !categorySlug) fetchProducts();
  }, [fetchProducts, categories.length, categorySlug]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localQuery) params.set('q', localQuery);
    else params.delete('q');
    setSearchParams(params);
  };

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('category', slug);
    else params.delete('category');
    setSearchParams(params);
  };

  const activeCat = categories.find(c => c.slug === categorySlug);
  const title = query ? `Results for "${query}"` : activeCat?.name || (featured ? 'Featured' : sale ? 'Sale' : 'All Products');

  return (
    <div className="min-h-screen pt-24">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-2">{title}</h1>
          <p className="text-neutral-500 text-sm">{loading ? '—' : `${products.length} products`}</p>
        </motion.div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setCategory('')}
            className={`shrink-0 px-4 py-2 rounded-full text-sm transition-all duration-200 ${
              !categorySlug ? 'bg-white text-neutral-950 font-medium' : 'border border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
            }`}
          >
            All
          </button>
          {categories
            .filter(cat => ['abbyhaus', 'fashion', 'accessories', 'gadgets', 'preorder', 'shoes', 'glasses', 'dress', 'decor', 'bags', 'jewelry', 'hair-accessories'].includes(cat.slug))
            .map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                categorySlug === cat.slug ? 'bg-white text-neutral-950 font-medium' : 'border border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-48 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={localQuery}
              onChange={e => setLocalQuery(e.target.value)}
              placeholder="Search products..."
              className="input-field pl-9 py-2 text-sm"
            />
          </form>

          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="input-field py-2 pr-8 text-sm appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
          </div>

          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 btn-secondary py-2 text-sm ${filtersOpen ? 'bg-white/10' : ''}`}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'}`}
            >
              <LayoutList size={16} />
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 rounded-xl bg-white/3 border border-white/5 flex flex-wrap gap-4">
                <div>
                  <label className="text-xs text-neutral-500 mb-1.5 block">Min Price (GHS)</label>
                  <input
                    type="number"
                    value={priceMin}
                    onChange={e => setPriceMin(e.target.value)}
                    placeholder="0"
                    className="input-field w-32 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 mb-1.5 block">Max Price (GHS)</label>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={e => setPriceMax(e.target.value)}
                    placeholder="Any"
                    className="input-field w-32 py-2 text-sm"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button onClick={fetchProducts} className="btn-primary py-2 text-sm">Apply</button>
                  <button
                    onClick={() => { setPriceMin(''); setPriceMax(''); }}
                    className="btn-secondary py-2 text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-neutral-900 shimmer-bg" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search size={48} className="text-neutral-700 mb-4" />
            <p className="text-neutral-400 font-medium mb-2">No products found</p>
            <p className="text-neutral-600 text-sm">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
