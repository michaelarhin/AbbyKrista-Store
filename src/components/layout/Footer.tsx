import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img src="/images/logo.png" alt="ABBYKRISTY OUTLET" className="h-16 w-auto" />
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              ABBYKRISTA OUTLET — Home decor from ABBYHAUS, trendy fashion, accessories, and exclusive preorder drops. All in one place.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/shades_by_abby?igsh=Nm9iM2hrb3Qyd2Mz&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://www.tiktok.com/@shadesbyabby_abbyhaus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.88 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11V9.36a6.33 6.33 0 00-.82-.05A6.34 6.34 0 003.15 15.65 6.34 6.34 0 009.49 22a6.34 6.34 0 006.34-6.34V9.41a8.16 8.16 0 004.76 1.53v-3.45a4.85 4.85 0 01-1-.8z"/></svg>
              </a>
              <a
                href="https://snapchat.com/t/w1ZUXKtx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Snapchat"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.17 2c3.07 0 5.27 2.19 5.54 5.48.04.47.02.94-.01 1.41.43.17.87.28 1.3.28.36 0 .62.05.85.28.25.25.15.57-.04.82-.53.69-1.65 1.04-2.22 1.25-.04.13-.09.27-.14.4-.7 1.82-2.07 3.48-4.06 4.15-.35.12-.53.26-.53.64 0 .33.32.52.73.72.96.47 2.16.72 2.62 1.42.3.45.18.93-.37 1.13-.48.17-1.08.22-1.6.22-.47 0-.93-.04-1.4-.13-.36-.07-.7.13-.88.45-.38.67-.79 1.47-1.77 1.47s-1.39-.8-1.77-1.47c-.18-.32-.52-.52-.88-.45-.47.09-.93.13-1.4.13-.52 0-1.12-.05-1.6-.22-.55-.2-.67-.68-.37-1.13.46-.7 1.66-.95 2.62-1.42.41-.2.73-.39.73-.72 0-.38-.18-.52-.53-.64-1.99-.67-3.36-2.33-4.06-4.15-.05-.13-.1-.27-.14-.4-.57-.21-1.69-.56-2.22-1.25-.19-.25-.29-.57-.04-.82.23-.23.49-.28.85-.28.43 0 .87-.11 1.3-.28-.03-.47-.05-.94-.01-1.41C6.9 4.19 9.1 2 12.17 2z"/></svg>
              </a>
              <a
                href="https://wa.me/233545480981"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.29-.14-1.7-.84-1.96-.93-.26-.1-.46-.14-.65.14-.19.29-.74.93-.91 1.12-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.44.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.56-.89-2.14-.24-.56-.48-.49-.65-.49-.17 0-.36-.02-.55-.02-.19 0-.51.07-.77.36-.26.29-1.01.99-1.01 2.41 0 1.43 1.03 2.81 1.18 3 .14.19 2.04 3.11 4.94 4.36.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34zM12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.43 1.27 4.88L2 22l5.23-1.25A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
              </a>
              <a
                href="https://www.facebook.com/share/1DQqSsyVFH/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.8v8.44C19.61 23.08 24 18.09 24 12.07z"/></svg>
              </a>
              <a
                href="https://x.com/akrista30?s=21"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-display font-semibold mb-2">Join the AB. family</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Get early access to new drops, exclusive discounts, and style inspo straight to your inbox. No spam, just the good stuff.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 border-b border-white/10">
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">ABBYHAUS</h4>
            <ul className="space-y-3">
              {['Kitchen', 'Living Room', 'Bedroom', 'All Home Decor'].map(item => (
                <li key={item}>
                  <Link to="/products?category=abbyhaus" className="text-neutral-500 hover:text-neutral-200 text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">Fashion</h4>
            <ul className="space-y-3">
              {['Bags', 'Shoes', 'Shades', 'Jewelry', 'Hair Bands'].map(item => (
                <li key={item}>
                  <Link to="/products?category=fashion" className="text-neutral-500 hover:text-neutral-200 text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">More</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products?category=accessories" className="text-neutral-500 hover:text-neutral-200 text-sm transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=gadgets" className="text-neutral-500 hover:text-neutral-200 text-sm transition-colors">
                  Gadgets
                </Link>
              </li>
              <li>
                <Link to="/products?category=preorder" className="text-neutral-500 hover:text-neutral-200 text-sm transition-colors">
                  Preorder
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Blog', 'Careers', 'Press', 'Partners'].map(item => (
                <li key={item}>
                  <a href="#" className="text-neutral-500 hover:text-neutral-200 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-neutral-500 hover:text-neutral-200 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-neutral-500 hover:text-neutral-200 text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-neutral-500 hover:text-neutral-200 text-sm transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-neutral-500 hover:text-neutral-200 text-sm transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center gap-6">
          {/* Payment & Credits */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <div className="flex items-center gap-3">
              <span className="text-neutral-600 text-xs">Payment powered by</span>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#00C3F7]">
                  <path d="M2 4h20v2H2V4zm0 7h20v2H2v-2zm0 7h14v2H2v-2z" fill="currentColor"/>
                </svg>
                <span className="text-neutral-300 text-xs font-semibold tracking-wide">Paystack</span>
              </div>
            </div>
            <p className="text-neutral-600 text-xs">
              &copy; {new Date().getFullYear()} ABBYKRISTA OUTLET. All rights reserved.
            </p>
          </div>

          <div className="w-full border-t border-white/5 pt-4 flex justify-center">
            <div className="flex items-center gap-2">
              <span className="text-neutral-600 text-xs">Website developed by</span>
              <img src="/images/nmp-logo.png" alt="NMP Solutions" className="h-10 w-auto brightness-125" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim().toLowerCase() });

    if (error) {
      if (error.code === '23505') {
        setStatus('success');
        setMessage("You're already part of the family! 💛");
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    } else {
      setStatus('success');
      setMessage("You're in! Welcome to the AB. family 💛");
      setEmail('');
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 p-4 rounded-xl bg-success-500/10 border border-success-500/20">
        <CheckCircle size={18} className="text-success-400 shrink-0" />
        <p className="text-success-400 text-sm">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="input-field flex-1"
        />
        <button type="submit" disabled={status === 'loading'} className="btn-primary whitespace-nowrap">
          {status === 'loading' ? (
            <span className="flex items-center gap-2"><span className="w-3 h-3 loader-ring" /> ...</span>
          ) : (
            <>Subscribe <ArrowRight size={14} /></>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-error-400 text-xs">{message}</p>
      )}
      <p className="text-neutral-600 text-xs">
        By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
      </p>
    </form>
  );
}
