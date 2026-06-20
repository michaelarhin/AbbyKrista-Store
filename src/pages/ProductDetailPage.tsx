import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Share2, Star, Package, ChevronLeft, ChevronRight, Minus, Plus, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../lib/utils';
import ProductCard from '../components/products/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [colorError, setColorError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
      .then(({ data }) => {
        setProduct(data);
        setLoading(false);
        if (data?.category_id) {
          supabase
            .from('products')
            .select('*, category:categories(*)')
            .eq('category_id', data.category_id)
            .eq('is_active', true)
            .neq('id', data.id)
            .limit(4)
            .then(({ data: rel }) => setRelated(rel || []));
        }
      });
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.colors?.length && !selectedColor) {
      setColorError(true);
      return;
    }
    addItem(product, quantity, selectedColor || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 loader-ring" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <Package size={64} className="text-neutral-700 mb-4" />
        <h2 className="text-2xl font-display text-white mb-2">Product not found</h2>
        <p className="text-neutral-400 mb-6">This product may no longer be available.</p>
        <Link to="/products" className="btn-secondary">Browse Products</Link>
      </div>
    );
  }

  const discount = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-white transition-colors">
            <ArrowLeft size={14} />
            Back
          </button>
          <span>/</span>
          <Link to="/products" className="hover:text-white transition-colors">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/products?category=${product.category.slug}`} className="hover:text-white transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-neutral-300 truncate max-w-32">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-900">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={`${product.images[activeImage]}?auto=compress&w=800`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage(i => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveImage(i => (i + 1) % product.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-error-500 text-white text-sm font-semibold rounded-full">
                    -{discount}% OFF
                  </span>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      i === activeImage ? 'border-white' : 'border-transparent opacity-50 hover:opacity-75'
                    }`}
                  >
                    <img src={`${img}?auto=compress&w=160`} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {product.category && (
              <Link
                to={`/products?category=${product.category.slug}`}
                className="text-primary-400 text-xs font-medium tracking-widest uppercase mb-3 hover:text-primary-300"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating mock */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-warning-400 fill-warning-400" />
                ))}
              </div>
              <span className="text-neutral-500 text-sm">4.9 (127 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-semibold text-white">
                {formatPrice(product.price, currency)}
              </span>
              {product.compare_at_price && (
                <span className="text-xl text-neutral-600 line-through">
                  {formatPrice(product.compare_at_price, currency)}
                </span>
              )}
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-neutral-400 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Color selection */}
            {product.colors?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-neutral-800 text-sm font-medium">Color</span>
                  {selectedColor && (
                    <span className="text-neutral-500 text-sm">— {selectedColor}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => { setSelectedColor(color); setColorError(false); }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-primary-500 bg-primary-50 text-primary-600'
                          : 'border-neutral-300 text-neutral-600 hover:border-primary-300'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-neutral-300 shrink-0"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      {color}
                    </button>
                  ))}
                </div>
                {colorError && (
                  <p className="text-error-500 text-xs mt-2">Please select a color before adding to cart.</p>
                )}
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-8">
              {product.stock_quantity === 0 ? (
                <span className="flex items-center gap-2 text-error-400 text-sm">
                  <span className="w-2 h-2 rounded-full bg-error-400" />
                  Out of stock
                </span>
              ) : product.stock_quantity <= product.low_stock_threshold ? (
                <span className="flex items-center gap-2 text-warning-400 text-sm">
                  <span className="w-2 h-2 rounded-full bg-warning-400 animate-pulse" />
                  Only {product.stock_quantity} left!
                </span>
              ) : (
                <span className="flex items-center gap-2 text-success-400 text-sm">
                  <span className="w-2 h-2 rounded-full bg-success-400" />
                  In stock
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-white/10 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <span className="text-neutral-600 text-xs">{product.stock_quantity} available</span>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className={`flex-1 btn-primary justify-center py-4 text-base relative overflow-hidden ${product.stock_quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle size={16} /> Added to Cart!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag size={16} /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-all">
                <Heart size={16} />
              </button>

              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-all">
                <Share2 size={16} />
              </button>
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="mt-4 text-neutral-600 text-xs">SKU: {product.sku}</p>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display text-2xl font-semibold text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
