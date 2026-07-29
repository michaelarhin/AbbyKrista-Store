import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[1000px] w-full overflow-hidden">
      {/* Background image */}
      <img
        src="/images/hero/hero-main.jpg"
        alt="AbbyKrista Outlet"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Soft blush overlay — left side for text readability */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            'linear-gradient(to right, rgba(255,249,249,0.92) 0%, rgba(255,249,249,0.70) 40%, rgba(255,249,249,0.15) 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            'linear-gradient(to top, rgba(255,249,249,0.55) 0%, transparent 50%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="max-w-xl"
          >
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm text-xs tracking-widest uppercase mb-6"
              style={{ borderColor: '#fbd5d9', background: 'rgba(255,255,255,0.75)', color: '#d4708a' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: '#d4708a' }}
              />
              ABBYKRISTA OUTLET
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-none mb-6">
              <span className="text-neutral-900">Your Style,</span>
              <br />
              <span className="text-gradient">Delivered.</span>
            </h1>

            {/* Subtext */}
            <p className="text-neutral-700 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
              Abby Krista Outlet is your one-stop shop for stylish, affordable everyday essentials and fashion items. We source your favourite designer pieces & home finds and ship them safely to your doorstep.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary text-base px-8 py-4">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/products?category=fashion" className="btn-secondary text-base px-8 py-4">
                Explore Fashion
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-xs tracking-widest uppercase" style={{ color: '#d4708a' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8"
          style={{ background: 'linear-gradient(to bottom, #d4708a, transparent)' }}
        />
      </div>
    </section>
  );
}
