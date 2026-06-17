import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCurrency } from '../../contexts/CurrencyContext';
import { CURRENCIES } from '../../lib/utils';
import type { Currency } from '../../types';

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
      >
        <span className="font-medium">{CURRENCIES[currency].symbol}</span>
        <span className="hidden sm:inline text-xs">{currency}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 glass-dark rounded-xl overflow-hidden shadow-2xl z-50"
          >
            {(Object.keys(CURRENCIES) as Currency[]).map(c => (
              <button
                key={c}
                onClick={() => { setCurrency(c); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  c === currency
                    ? 'bg-white/10 text-white'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-medium text-white/70">{CURRENCIES[c].symbol}</span>
                  <span>{CURRENCIES[c].name}</span>
                </div>
                <span className="text-xs text-neutral-600">{c}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
