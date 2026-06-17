import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CurrencySelector from '../ui/CurrencySelector';
import CartDrawer from '../cart/CartDrawer';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAdmin, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Shop All', href: '/products' },
    { label: 'ABBYHAUS', href: '/products?category=abbyhaus' },
    { label: 'Fashion', href: '/products?category=fashion' },
    { label: 'Gadgets', href: '/products?category=gadgets' },
    { label: 'Accessories', href: '/products?category=accessories' },
    { label: 'Preorder', href: '/products?category=preorder' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-dark shadow-2xl shadow-black/40' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/images/logo.png" alt="ABBYKRISTY OUTLET" className="h-14 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 relative group ${
                    location.pathname === link.href.split('?')[0]
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <CurrencySelector />

              <button
                type="button"
                aria-label="Toggle search"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <Search size={18} />
              </button>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden lg:flex p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  title="Admin"
                >
                  <Settings size={18} />
                </Link>
              )}

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="hidden lg:flex p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              )}

              <button
                type="button"
                aria-label="Open cart"
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-white text-neutral-950 text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </button>

              <button
                type="button"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-neutral-400 hover:text-white transition-colors"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden pb-4"
              >
                <SearchBar onClose={() => setSearchOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass-dark border-t border-white/10"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-neutral-300 hover:text-white transition-colors text-sm font-medium py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link to="/admin" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium py-2 flex items-center gap-2">
                    <Settings size={16} /> Admin Dashboard
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

function SearchBar({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search products..."
        className="input-field pl-10 pr-12"
        autoFocus
      />
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
      >
        <X size={16} />
      </button>
    </form>
  );
}
