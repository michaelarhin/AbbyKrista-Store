import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { formatPrice } from '../../lib/utils';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const { currency } = useCurrency();

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: open ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed top-0 right-0 h-full w-full max-w-md glass-dark border-l border-white/10 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-white" />
            <span className="font-semibold text-white">Cart</span>
            {totalItems > 0 && (
              <span className="bg-white text-neutral-950 text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={onClose} aria-label="Close cart" className="p-2 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-neutral-700 mb-4" />
              <p className="text-neutral-400 text-sm">Your cart is empty</p>
              <button onClick={onClose} className="btn-secondary mt-4 text-xs">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map(item => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800">
                  {item.product.images[0] && (
                    <img
                      src={`${item.product.images[0]}?auto=compress&w=128`}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.product.name}</p>
                  <p className="text-primary-400 text-sm font-semibold mt-0.5">
                    {formatPrice(item.product.price, currency)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  aria-label={`Remove ${item.product.name}`}
                  className="self-start p-1 text-neutral-600 hover:text-error-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 text-sm">Subtotal</span>
              <span className="text-white font-semibold">{formatPrice(subtotal, currency)}</span>
            </div>
            <p className="text-neutral-600 text-xs">Shipping & taxes calculated at checkout</p>
            <Link
              to="/checkout"
              onClick={onClose}
              className="btn-primary w-full justify-center"
            >
              Checkout <ArrowRight size={14} />
            </Link>
            <Link
              to="/products"
              onClick={onClose}
              className="btn-secondary w-full justify-center text-xs"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </motion.div>
    </>
  );
}
