import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../types';
import { useCurrency } from '../../contexts/CurrencyContext';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { currency } = useCurrency();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: y * -12, y: x * 12 });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // If product has colors, redirect to product page for color selection
    if (product.colors && product.colors.length > 0) {
      navigate(`/products/${product.slug}`);
      return;
    }
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0;

  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold;
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: hovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
          : 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
        transition: 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="relative group"
    >
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/5 hover:border-white/15 transition-colors duration-300">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden">
            {product.images[0] ? (
              <img
                src={`${product.images[0]}?auto=compress&w=600`}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                <span className="text-neutral-600 text-xs">No image</span>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <span className="px-2 py-0.5 bg-error-500 text-white text-xs font-semibold rounded-full">
                  -{discount}%
                </span>
              )}
              {product.is_featured && (
                <span className="px-2 py-0.5 bg-white text-neutral-950 text-xs font-semibold rounded-full">
                  Featured
                </span>
              )}
              {isLowStock && !isOutOfStock && (
                <span className="px-2 py-0.5 bg-warning-500 text-white text-xs font-semibold rounded-full">
                  Low Stock
                </span>
              )}
              {isOutOfStock && (
                <span className="px-2 py-0.5 bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-full">
                  Sold Out
                </span>
              )}
            </div>

            {/* Quick add button */}
            <motion.button
              initial={false}
              animate={{ y: hovered ? 0 : 16, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="absolute bottom-4 left-4 right-4 btn-primary text-xs py-2.5 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {added ? 'Added!' : isOutOfStock ? 'Out of Stock' : (product.colors && product.colors.length > 0) ? 'Select Options' : 'Add to Cart'}
            </motion.button>
          </div>

          {/* Info */}
          <div className="p-4">
            {product.category && (
              <p className="text-primary-400 text-xs font-medium tracking-wide uppercase mb-1">
                {product.category.name}
              </p>
            )}
            <h3 className="text-white text-sm font-medium leading-snug line-clamp-2 mb-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">
                {formatPrice(product.price, currency)}
              </span>
              {product.compare_at_price && (
                <span className="text-neutral-600 text-sm line-through">
                  {formatPrice(product.compare_at_price, currency)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
