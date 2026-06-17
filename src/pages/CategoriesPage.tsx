import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';

const CATEGORY_IMAGES: Record<string, string> = {
  abbyhaus: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
  fashion: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600',
  accessories: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600',
  gadgets: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600',
  preorder: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=600',
  shoes: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600',
  glasses: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600',
  dress: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600',
  decor: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600',
  bags: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
  jewelry: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600',
  'hair-accessories': 'https://images.pexels.com/photos/3993398/pexels-photo-3993398.jpeg?auto=compress&cs=tinysrgb&w=600',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      setCategories(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-primary-400 text-xs font-medium tracking-widest uppercase mb-3">Explore</p>
          <h1 className="font-display text-5xl font-semibold text-white">All Categories</h1>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="aspect-video rounded-2xl bg-neutral-900 shimmer-bg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories
              .filter(cat => ['abbyhaus', 'fashion', 'accessories', 'gadgets', 'preorder', 'shoes', 'glasses', 'dress', 'decor', 'bags', 'jewelry', 'hair-accessories'].includes(cat.slug))
              .map((cat, i) => {
              const imageUrl = cat.image_url || CATEGORY_IMAGES[cat.slug] || '';
              return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="relative group block rounded-2xl overflow-hidden aspect-video bg-neutral-900"
                >
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                    <div>
                      <h3 className="text-white text-xl font-display font-semibold mb-1">{cat.name}</h3>
                      {cat.description && (
                        <p className="text-neutral-400 text-sm line-clamp-1">{cat.description}</p>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-neutral-950">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
