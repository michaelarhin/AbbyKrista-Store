import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Category } from '../../types';

const ALLOWED_SLUGS = ['abbyhaus', 'fashion', 'accessories', 'gadgets', 'preorder'];

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setCategories(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = categories.filter(cat => ALLOWED_SLUGS.includes(cat.slug));

  return (
    <section className="py-24 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary-400 text-xs font-medium tracking-widest uppercase mb-3">Our Collections</p>
          <h2 className="section-heading">Shop by Category</h2>
          <p className="text-neutral-400 text-base mt-4 max-w-lg mx-auto">
            Home decor, fashion, accessories, gadgets, and exclusive preorder drops — all in one outlet.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-3xl bg-neutral-800 shimmer-bg" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="relative group block rounded-3xl overflow-hidden aspect-[3/4] bg-neutral-800"
                >
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                      <span className="text-neutral-600 text-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent group-hover:from-neutral-950/95 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                    <div>
                      <h3 className="text-white text-xl font-display font-semibold mb-1">{cat.name}</h3>
                      {cat.description && (
                        <p className="text-neutral-400 text-xs">{cat.description}</p>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-neutral-950 shrink-0">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 text-sm">
            <p>No categories found. Add categories in the admin panel to see them here.</p>
            <Link to="/admin" className="text-primary-400 hover:text-primary-300 mt-2 inline-block">Go to Admin →</Link>
          </div>
        )}
      </div>
    </section>
  );
}
