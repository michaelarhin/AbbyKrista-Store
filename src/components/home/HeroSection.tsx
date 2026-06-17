import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/images/hero/hero-shades-1.jpg',
    headline: 'Explore',
    highlight: 'Fashion',
    sub: 'Bags, shoes, shades, jewelry, hair bands — complete your look with pieces that turn heads.',
    cta: 'Shop Fashion',
    link: '/products?category=fashion',
    position: 'top center',
  },
  {
    image: '/images/hero/hero-fashion-1.jpeg',
    headline: 'Bold Frames,',
    highlight: 'Bold You',
    sub: 'White cat-eye shades that define your style. Stand out from the crowd effortlessly.',
    cta: 'Shop Shades',
    link: '/products?category=fashion',
    position: 'top center',
  },
  {
    image: '/images/hero/hero-sofa-1.jpg',
    headline: 'Discover',
    highlight: 'ABBYHAUS',
    sub: 'Premium furniture and home decor for your kitchen, living room, and bedroom.',
    cta: 'Shop Home Decor',
    link: '/products?category=abbyhaus',
    position: 'center',
  },
  {
    image: '/images/hero/hero-fashion-2.jpeg',
    headline: 'Shield Your',
    highlight: 'Eyes in Style',
    sub: 'Amber shield frames for the fashion-forward. Protection meets luxury.',
    cta: 'Shop Now',
    link: '/products?category=fashion',
    position: 'top center',
  },
  {
    image: '/images/hero/hero-living-1.jpg',
    headline: 'Elevate Your',
    highlight: 'Living Space',
    sub: 'Curated interiors that turn your house into a home. Modern designs, timeless comfort.',
    cta: 'Explore Collection',
    link: '/products?category=abbyhaus',
    position: 'center',
  },
  {
    image: '/images/hero/hero-fashion-3.jpeg',
    headline: 'Classic White',
    highlight: 'Cat-Eye',
    sub: 'Timeless silhouettes with a modern edge. The perfect everyday statement piece.',
    cta: 'Shop Eyewear',
    link: '/products?category=fashion',
    position: 'top center',
  },
  {
    image: '/images/hero/hero-glasses-1.jpg',
    headline: 'See the World',
    highlight: 'Differently',
    sub: 'Fashion-forward eyewear and shades that make a statement. Frames for every face, every mood.',
    cta: 'Shop Shades',
    link: '/products?category=fashion',
    position: 'top center',
  },
  {
    image: '/images/hero/hero-fashion-4.jpeg',
    headline: 'Smart &',
    highlight: 'Sophisticated',
    sub: 'Blue-light blocking frames that look as good as they feel. Work meets style.',
    cta: 'Shop Glasses',
    link: '/products?category=fashion',
    position: 'top center',
  },
  {
    image: '/images/hero/hero-sofa-2.jpg',
    headline: 'Welcome to',
    highlight: 'ABBYKRISTA OUTLET',
    sub: 'Your one-stop destination for home decor, fashion, accessories, and preorder deals.',
    cta: 'Shop Now',
    link: '/products',
    position: 'center',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 1.1,
    x: direction > 0 ? 80 : -80,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.95,
    x: direction > 0 ? -80 : 80,
    zIndex: 0,
  }),
};

const textVariants = {
  enter: {
    opacity: 0,
    y: 40,
  },
  center: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -30,
  },
};

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(c => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(c => (c - 1 + slides.length) % slides.length);
  }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-screen min-h-[600px] max-h-[1000px] w-full overflow-hidden">
      {/* Background image slideshow */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 0.8, ease: 'easeInOut' },
            scale: { duration: 1.2, ease: [0.25, 0.4, 0.25, 1] },
            x: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] },
          }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.highlight}
            className="w-full h-full object-cover"
            style={{ objectPosition: slide.position }}
          />
          {/* Ken Burns subtle zoom effect */}
          <motion.div
            key={`zoom-${current}`}
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 6, ease: 'linear' }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: slide.position,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/50 to-neutral-950/30 z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/30 z-[2]" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl">
            {/* Slide indicator dots */}
            <div className="flex gap-2 mb-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className="group relative"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <div className={`h-1 rounded-full transition-all duration-500 ${
                    i === current ? 'w-10 bg-white' : 'w-3 bg-white/30 group-hover:bg-white/50'
                  }`} />
                  {/* Progress bar for active slide */}
                  {i === current && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 5, ease: 'linear' }}
                      className="absolute inset-0 h-1 rounded-full bg-primary-400 origin-left"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Text content with transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              >
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs text-neutral-300 tracking-widest uppercase mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                  ABBYKRISTA OUTLET
                </div>

                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-none mb-6">
                  <span className="text-neutral-200">{slide.headline}</span>
                  <br />
                  <span className="text-gradient">{slide.highlight}</span>
                </h1>

                <p className="text-neutral-300 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
                  {slide.sub}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link to={slide.link} className="btn-primary text-base px-8 py-4">
                    {slide.cta} <ArrowRight size={16} />
                  </Link>
                  <Link to="/products" className="btn-secondary text-base px-8 py-4">
                    Shop All
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 hover:bg-black/40 transition-all duration-300"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 hover:bg-black/40 transition-all duration-300"
      >
        <ChevronRight size={20} />
      </button>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-neutral-400 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"
        />
      </div>
    </section>
  );
}
