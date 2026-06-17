import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategorySection from '../components/home/CategorySection';
import PromoBanners from '../components/home/PromoBanners';
import Features from '../components/home/Features';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  // stripX drives the scrolling brand marquee

  // Parallax for the brand strip
  const stripX = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

  return (
    <div ref={containerRef} className="min-h-screen">
      <HeroSection />

      {/* Scrolling brand strip */}
      <div className="overflow-hidden py-6 border-y border-white/5 bg-neutral-950/80">
        <motion.div
          style={{ x: stripX }}
          className="flex gap-16 whitespace-nowrap"
        >
          {[...Array(3)].flatMap(() =>
            ['ABBYHAUS', '•', 'Fashion', '•', 'Gadgets', '•', 'Accessories', '•', 'Preorder', '•', 'ABBYKRISTA OUTLET', '•']
          ).map((text, i) => (
            <span
              key={i}
              className={`text-sm tracking-widest uppercase ${
                text === '•' ? 'text-primary-500' : 'text-neutral-600'
              }`}
            >
              {text}
            </span>
          ))}
        </motion.div>
      </div>

      <PromoBanners />
      <Features />
      <FeaturedProducts />
      <CategorySection />

      {/* Parallax CTA section */}
      <ParallaxCTA />
    </div>
  );
}

function ParallaxCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['30%', '-30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden py-40">
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-cover bg-center"
      >
        <img
          src="https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&w=1600"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/60 to-neutral-950/90" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center"
      >
        <p className="text-primary-400 text-xs font-medium tracking-widest uppercase mb-4">ABBYKRISTA OUTLET</p>
        <h2 className="font-display text-5xl md:text-7xl font-semibold text-gradient mb-6 tracking-tight">
          New Arrivals
        </h2>
        <p className="text-neutral-400 text-lg mb-10 max-w-lg mx-auto">
          Fresh drops every week. From statement home decor to trendy shades and accessories — don't miss out.
        </p>
        <Link to="/products" className="btn-primary text-base px-10 py-4">
          Shop New In
        </Link>
      </motion.div>
    </section>
  );
}
