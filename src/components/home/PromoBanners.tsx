import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Banner } from '../../types';

export default function PromoBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [announcement, setAnnouncement] = useState<Banner | null>(null);
  const [announcementClosed, setAnnouncementClosed] = useState(false);

  useEffect(() => {
    supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (!data) return;
        const annBanner = data.find(b => b.banner_type === 'announcement');
        const promoBanners = data.filter(b => b.banner_type === 'promotional');
        setAnnouncement(annBanner || null);
        setBanners(promoBanners);
      });
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <AnimatePresence>
        {announcement && !announcementClosed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-16 lg:top-20 left-0 right-0 z-40 bg-primary-600 text-white"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-4">
              <p className="text-xs font-medium text-center">{announcement.title} — {announcement.subtitle}</p>
              <Link to={announcement.cta_link} className="text-xs underline hover:no-underline shrink-0">
                {announcement.cta_text}
              </Link>
              <button
                type="button"
                aria-label="Close announcement"
                onClick={() => setAnnouncementClosed(true)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promo grid */}
      {banners.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`grid gap-6 ${banners.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {banners.map((banner, i) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative overflow-hidden rounded-3xl min-h-64 flex items-end group"
                style={{ backgroundColor: banner.background_color || '#1a1a1a' }}
              >
                {banner.image_url && (
                  <img
                    src={`${banner.image_url}?auto=compress&w=800`}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-transparent" />
                <div className="relative p-8">
                  <p className="text-sm text-neutral-300 mb-2 tracking-wide">{banner.subtitle}</p>
                  <h3
                    className="text-3xl font-display font-semibold mb-4"
                    style={{ color: banner.text_color || 'white' }}
                  >
                    {banner.title}
                  </h3>
                  <Link to={banner.cta_link} className="btn-primary text-sm">
                    {banner.cta_text} <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
