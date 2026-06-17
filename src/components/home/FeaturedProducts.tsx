import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../types';
import ProductCard from '../products/ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(4)
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-end justify-between mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary-400 text-xs font-medium tracking-widest uppercase mb-3">Handpicked for You</p>
          <h2 className="section-heading">Featured Products</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link to="/products?featured=true" className="btn-secondary text-sm hidden md:flex">
            View All <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-neutral-900 shimmer-bg animate-shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex justify-center mt-8 md:hidden"
      >
        <Link to="/products?featured=true" className="btn-secondary text-sm">
          View All <ArrowRight size={14} />
        </Link>
      </motion.div>
    </section>
  );
}
