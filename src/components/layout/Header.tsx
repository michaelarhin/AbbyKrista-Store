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

  useEffect(() => { setMenuOpen(false); }, [location]);

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
          scrolled
            ? 'bg-white shadow-sm'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
        style={{ borderBottom: scrolled ? '1px solid #fbd5d9' : '1px solid transparent' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2">
              <img src="/images/logo.png" alt="ABBYKRISTA OUTLET" className="h-14 w-auto" />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium tracking-wide transition-colors duration-200 relative group"
                  style={{
                    color: location.pathname === link.href.split('?')[0] ? '#d4708a' : '#5c5c5c',
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: '#d4708a' }}
                  />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <CurrencySelector />
              <button type="button" aria-label="Toggle search" onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full transition-colors duration-200"
                style={{ color: '#7a7a7a' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#d4708a')}
                onMouseLeave={e => (e.currentTarget.style.color = '#7a7a7a')}>
                <Search size={18} />
              </button>
              {isAdmin && (
                <Link to="/admin" className="hidden lg:flex p-2 rounded-full transition-colors duration-200"
                  style={{ color: '#7a7a7a' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#d4708a')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#7a7a7a')}>
                  <Settings size={18} />
                </Link>
              )}
              {isAdmin && (
                <button type="button" onClick={() => signOut()}
                  className="hidden lg:flex p-2 rounded-full transition-colors duration-200"
                  style={{ color: '#7a7a7a' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#d4708a')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#7a7a7a')}>
                  <LogOut size={18} />
                </button>
              )}
              <button type="button" aria-label="Open cart" onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-full transition-colors duration-200"
                style={{ color: '#7a7a7a' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#d4708a')}
                onMouseLeave={e => (e.currentTarget.style.color = '#7a7a7a')}>
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#d4708a' }}>
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </button>
              <button type="button" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 transition-colors duration-200" style={{ color: '#7a7a7a' }}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden pb-4">
                <SearchBar onClose={() => setSearchOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white" style={{ borderTop: '1px solid #fbd5d9' }}>
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <Link key={link.href} to={link.href}
                    className="text-sm font-medium py-2.5 px-3 rounded-xl transition-colors"
                    style={{ color: '#5c5c5c' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#d4708a'; e.currentTarget.style.background = '#fff5f7'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#5c5c5c'; e.currentTarget.style.background = 'transparent'; }}>
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-medium py-2.5 px-3 rounded-xl transition-colors flex items-center gap-2"
                    style={{ color: '#5c5c5c' }}>
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
    if (query.trim()) { navigate(`/products?q=${encodeURIComponent(query.trim())}`); onClose(); }
  };
  return (
    <form onSubmit={handleSearch} className="relative">
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#a8a8a8' }} />
      <input type="text" value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Search products..." className="input-field pl-10 pr-12" autoFocus />
      <button type="button" onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#a8a8a8' }}>
        <X size={16} />
      </button>
    </form>
  );
}
