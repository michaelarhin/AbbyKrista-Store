import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Smartphone, Package, Tag, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatPrice } from '../lib/utils';
import { supabase } from '../lib/supabase';
import type { CheckoutFormData, PaymentMethod } from '../types';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

const REGIONS = ['Greater Accra', 'Ashanti', 'Central', 'Eastern', 'Western', 'Northern', 'Upper East', 'Upper West', 'Volta', 'Brong-Ahafo', 'Oti', 'Savanna', 'North East', 'Bono', 'Bono East', 'Ahafo', 'Western North'];

// Shipping rates by region (GHS)
const SHIPPING_RATES: Record<string, number> = {
  'Greater Accra': 20,
  'Ashanti': 35,
  'Central': 30,
  'Eastern': 30,
  'Western': 40,
  'Northern': 50,
  'Upper East': 55,
  'Upper West': 55,
  'Volta': 35,
  'Brong-Ahafo': 40,
  'Oti': 45,
  'Savanna': 50,
  'North East': 55,
  'Bono': 40,
  'Bono East': 45,
  'Ahafo': 40,
  'Western North': 45,
};

const PAYMENT_METHODS: { value: PaymentMethod; label: string; desc: string; icon: React.FC<any>; disabled?: boolean }[] = [
  { value: 'mobile_money', label: 'Mobile Money', desc: 'MTN MoMo, Vodafone Cash, AirtelTigo Money', icon: Smartphone },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart, totalItems } = useCart();
  const { currency } = useCurrency();

  const [form, setForm] = useState<CheckoutFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: { street: '', city: '', region: '', country: 'Ghana' },
    payment_method: 'mobile_money',
    discount_code: '',
    notes: '',
  });

  const [discountResult, setDiscountResult] = useState<{ amount: number; code: string; id: string } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [checkingDiscount, setCheckingDiscount] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const shippingCost = form.shipping_address.region ? (SHIPPING_RATES[form.shipping_address.region] || 40) : 0;
  const discountAmount = discountResult?.amount || 0;
  const total = subtotal - discountAmount + shippingCost;

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateAddress = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      shipping_address: { ...prev.shipping_address, [field]: value },
    }));
  };

  const applyDiscount = async () => {
    if (!form.discount_code.trim()) return;
    setCheckingDiscount(true);
    setDiscountError('');
    const { data } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', form.discount_code.toUpperCase().trim())
      .eq('is_active', true)
      .maybeSingle();

    if (!data) {
      setDiscountError('Invalid or expired discount code.');
    } else if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setDiscountError('This code has expired.');
    } else if (data.max_uses && data.current_uses >= data.max_uses) {
      setDiscountError('This code has reached its usage limit.');
    } else if (subtotal < data.min_purchase_amount) {
      setDiscountError(`Minimum order of ${formatPrice(data.min_purchase_amount, 'GHS')} required.`);
    } else {
      const amount = data.discount_type === 'percentage'
        ? subtotal * (data.discount_value / 100)
        : data.discount_value;
      setDiscountResult({ amount, code: data.code, id: data.id });
    }
    setCheckingDiscount(false);
  };

  const saveOrder = async (paymentStatus: string, paystackRef?: string) => {
    const orderNumber = `AK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        shipping_address: form.shipping_address,
        subtotal,
        discount_amount: discountAmount,
        shipping_cost: shippingCost,
        total,
        currency: 'GHS',
        payment_method: form.payment_method,
        payment_status: paymentStatus,
        discount_code_id: discountResult?.id || null,
        notes: form.notes + (paystackRef ? ` | Paystack Ref: ${paystackRef}` : ''),
      })
      .select()
      .single();

    if (error || !order) {
      setPaymentError('Failed to save order. Please contact support.');
      return null;
    }

    await supabase.from('order_items').insert(
      items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.selectedColor ? `${item.product.name} - ${item.selectedColor}` : item.product.name,
        product_image: item.product.images[0] || '',
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
      }))
    );

    if (discountResult) {
      const { data: dcRow } = await supabase
        .from('discount_codes')
        .select('current_uses')
        .eq('id', discountResult.id)
        .single();
      if (dcRow) {
        await supabase
          .from('discount_codes')
          .update({ current_uses: (dcRow.current_uses || 0) + 1 })
          .eq('id', discountResult.id);
      }
    }

    return orderNumber;
  };

  const initiatePaystackPayment = () => {
    if (!window.PaystackPop) {
      setPaymentError('Payment system is loading. Please try again.');
      setSubmitting(false);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: form.customer_email,
      amount: Math.round(total * 100), // Paystack expects amount in pesewas
      currency: 'GHS',
      channels: ['mobile_money'], // MoMo only
      metadata: {
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        custom_fields: [
          {
            display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: form.customer_name,
          },
          {
            display_name: 'Phone Number',
            variable_name: 'phone',
            value: form.customer_phone,
          },
        ],
      },
      onSuccess: async (response: { reference: string }) => {
        // Payment successful — save order
        const orderNumber = await saveOrder('paid', response.reference);
        if (orderNumber) {
          clearCart();
          setOrderSuccess(orderNumber);
        }
        setSubmitting(false);
      },
      onCancel: () => {
        setPaymentError('Payment was cancelled. Please try again.');
        setSubmitting(false);
      },
    });

    handler.openIframe();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setPaymentError('');

    if (form.payment_method === 'mobile_money') {
      // Use Paystack for mobile money
      initiatePaystackPayment();
    } else {
      // Fallback — should not happen since only mobile money is available
      initiatePaystackPayment();
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <Package size={64} className="text-neutral-700 mb-4" />
        <h2 className="text-2xl font-display text-white mb-2">Your cart is empty</h2>
        <Link to="/products" className="btn-primary mt-4">Start Shopping</Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="w-20 h-20 rounded-full bg-success-500/20 flex items-center justify-center mb-6 mx-auto">
            <CheckCircle size={40} className="text-success-400" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-white mb-2">Order Placed!</h2>
          <p className="text-neutral-400 mb-1">Thank you for your order.</p>
          <p className="text-white font-mono text-lg mb-8 mt-4 px-4 py-2 bg-white/5 rounded-xl inline-block">
            {orderSuccess}
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/products" className="btn-primary">Continue Shopping</Link>
            <Link to="/" className="btn-secondary">Go Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/products" className="p-2 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-3xl font-semibold text-white">Checkout</h1>
        </div>

        {paymentError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-error-500/10 border border-error-500/20 text-error-400 text-sm"
          >
            {paymentError}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            {/* Contact */}
            <Section title="Contact Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" required>
                  <input required value={form.customer_name} onChange={e => update('customer_name', e.target.value)} className="input-field" placeholder="John Doe" />
                </Field>
                <Field label="Email" required>
                  <input required type="email" value={form.customer_email} onChange={e => update('customer_email', e.target.value)} className="input-field" placeholder="john@example.com" />
                </Field>
              </div>
              <Field label="Phone Number" required>
                <input required value={form.customer_phone} onChange={e => update('customer_phone', e.target.value)} className="input-field" placeholder="+233 XX XXX XXXX" />
              </Field>
            </Section>

            {/* Shipping */}
            <Section title="Shipping Address">
              <Field label="Street Address" required>
                <input required value={form.shipping_address.street} onChange={e => updateAddress('street', e.target.value)} className="input-field" placeholder="123 Main Street" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="City" required>
                  <input required value={form.shipping_address.city} onChange={e => updateAddress('city', e.target.value)} className="input-field" placeholder="Accra" />
                </Field>
                <Field label="Region" required>
                  <select required value={form.shipping_address.region} onChange={e => updateAddress('region', e.target.value)} className="input-field">
                    <option value="">Select Region</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
              </div>
            </Section>

            {/* Payment */}
            <Section title="Payment Method">
              <div className="space-y-3">
                {PAYMENT_METHODS.map(method => (
                  <label key={method.value} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    form.payment_method === method.value
                      ? 'border-white/30 bg-white/5'
                      : 'border-white/5 hover:border-white/15'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.value}
                      checked={form.payment_method === method.value}
                      onChange={() => update('payment_method', method.value)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      form.payment_method === method.value ? 'bg-primary-500/20' : 'bg-white/5'
                    }`}>
                      <method.icon size={20} className={form.payment_method === method.value ? 'text-primary-400' : 'text-neutral-400'} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{method.label}</p>
                      <p className="text-neutral-500 text-xs">{method.desc}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      form.payment_method === method.value ? 'border-white' : 'border-white/20'
                    }`}>
                      {form.payment_method === method.value && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {form.payment_method === 'mobile_money' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 rounded-xl bg-primary-500/5 border border-primary-500/20"
                >
                  <div className="flex gap-2 text-primary-400 text-xs">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <span>You'll be prompted to authorize the payment via mobile money (MTN MoMo, Vodafone Cash, or AirtelTigo Money) through Paystack's secure payment window.</span>
                  </div>
                </motion.div>
              )}
            </Section>

            {/* Notes */}
            <Section title="Order Notes" optional>
              <textarea
                value={form.notes}
                onChange={e => update('notes', e.target.value)}
                className="input-field resize-none h-24"
                placeholder="Any special instructions for delivery..."
              />
            </Section>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center py-4 text-base"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 loader-ring" /> Processing...
                </span>
              ) : (
                `Pay ${formatPrice(total, currency)} with MoMo`
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              {/* Mobile toggle */}
              <button
                type="button"
                className="lg:hidden w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 mb-4"
                onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
              >
                <span className="text-white text-sm font-medium">Order Summary ({totalItems})</span>
                {orderSummaryOpen ? <ChevronUp size={16} className="text-white" /> : <ChevronDown size={16} className="text-white" />}
              </button>

              <div className={`lg:block ${orderSummaryOpen ? 'block' : 'hidden'}`}>
                <div className="glass-dark rounded-2xl p-6 space-y-4">
                  <h3 className="text-white font-semibold mb-4">Order Summary</h3>

                  {/* Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map(item => (
                      <div key={`${item.product.id}-${item.selectedColor || ''}`} className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                          {item.product.images[0] && (
                            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">{item.product.name}</p>
                          {item.selectedColor && (
                            <p className="text-neutral-500 text-xs">Color: {item.selectedColor}</p>
                          )}
                          <p className="text-neutral-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-white text-xs font-semibold shrink-0">
                          {formatPrice(item.product.price * item.quantity, currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Subtotal</span>
                      <span className="text-white">{formatPrice(subtotal, currency)}</span>
                    </div>
                    {discountResult && (
                      <div className="flex justify-between text-sm">
                        <span className="text-success-400">Discount ({discountResult.code})</span>
                        <span className="text-success-400">-{formatPrice(discountAmount, currency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Shipping</span>
                      <span className="text-white">
                        {form.shipping_address.region ? formatPrice(shippingCost, currency) : 'Select region'}
                      </span>
                    </div>
                    {!form.shipping_address.region && (
                      <p className="text-neutral-600 text-xs">
                        Shipping is calculated based on your region
                      </p>
                    )}
                    <div className="flex justify-between font-semibold text-base pt-2 border-t border-white/10">
                      <span className="text-white">Total</span>
                      <span className="text-white">{formatPrice(total, currency)}</span>
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="pt-2">
                    <label className="text-xs text-neutral-500 mb-2 block flex items-center gap-1">
                      <Tag size={12} /> Discount Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form.discount_code}
                        onChange={e => {
                          update('discount_code', e.target.value.toUpperCase());
                          setDiscountError('');
                          if (!e.target.value) setDiscountResult(null);
                        }}
                        placeholder="ENTER CODE"
                        className="input-field flex-1 py-2 text-sm font-mono tracking-wider"
                      />
                      <button
                        type="button"
                        onClick={applyDiscount}
                        disabled={checkingDiscount || !form.discount_code}
                        className="btn-secondary py-2 text-xs shrink-0"
                      >
                        {checkingDiscount ? '...' : 'Apply'}
                      </button>
                    </div>
                    {discountError && (
                      <p className="text-error-400 text-xs mt-2">{discountError}</p>
                    )}
                    {discountResult && (
                      <p className="text-success-400 text-xs mt-2 flex items-center gap-1">
                        <CheckCircle size={12} /> Code applied! Saving {formatPrice(discountAmount, currency)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, optional }: { title: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div className="glass-dark rounded-2xl p-6 space-y-4">
      <h3 className="text-white font-semibold flex items-center gap-2">
        {title}
        {optional && <span className="text-neutral-600 text-xs font-normal">(optional)</span>}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-neutral-400 text-xs mb-1.5 block">
        {label} {required && <span className="text-error-400">*</span>}
      </label>
      {children}
    </div>
  );
}
