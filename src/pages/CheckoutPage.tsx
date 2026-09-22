import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Loader2, Smartphone, Package, Tag, ChevronDown, ChevronUp, Info } from 'lucide-react';
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
  const [pendingOrderNumber, setPendingOrderNumber] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (t: ToastState) => setToast(t);
  const dismissToast = () => setToast(null);

  const shippingCost = 0;
  const discountAmount = discountResult?.amount || 0;
  const total = subtotal - discountAmount;

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

  const saveOrder = async (paymentStatus: string, paystackRef?: string, orderId?: string) => {
    // If we already have an order ID, just update the payment status
    if (orderId) {
      await supabase
        .from('orders')
        .update({ payment_status: paymentStatus, notes: paystackRef ? `Paystack Ref: ${paystackRef}` : '' })
        .eq('id', orderId);
      return orderId;
    }

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
        shipping_cost: 0,
        total,
        currency: 'GHS',
        payment_method: form.payment_method,
        payment_status: paymentStatus,
        discount_code_id: discountResult?.id || null,
        notes: form.notes,
      })
      .select('id, order_number')
      .single();

    if (error || !order) {
      console.error('Order save error:', error);
      setPaymentError('Failed to create order. Please try again or contact support.');
      return null;
    }

    // Save order items
    const { error: itemsError } = await supabase.from('order_items').insert(
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

    if (itemsError) {
      console.error('Order items save error:', itemsError);
    }

    // Reduce stock quantity for each purchased item
    for (const item of items) {
      const newQuantity = Math.max(0, item.product.stock_quantity - item.quantity);
      await supabase
        .from('products')
        .update({ stock_quantity: newQuantity })
        .eq('id', item.product.id);
    }

    if (discountResult) {
      try {
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
      } catch {
        // Non-critical
      }
    }

    return order.order_number;
  };

  // Restore stock and discount usage when an order is cancelled/failed before payment
  const reverseOrderSideEffects = async () => {
    for (const item of items) {
      const newQuantity = item.product.stock_quantity; // original quantity (not yet decremented since we track it locally)
      await supabase
        .from('products')
        .update({ stock_quantity: item.product.stock_quantity })
        .eq('id', item.product.id);
    }
    if (discountResult) {
      try {
        const { data: dcRow } = await supabase
          .from('discount_codes')
          .select('current_uses')
          .eq('id', discountResult.id)
          .single();
        if (dcRow && dcRow.current_uses > 0) {
          await supabase
            .from('discount_codes')
            .update({ current_uses: dcRow.current_uses - 1 })
            .eq('id', discountResult.id);
        }
      } catch {
        // Non-critical
      }
    }
  };

  const initiatePaystackPayment = async () => {
    if (!window.PaystackPop) {
      setPaymentError('Payment system is loading. Please try again.');
      setSubmitting(false);
      return;
    }

    // Always create a fresh order for each attempt
    // (cancelled/failed orders are marked as such and should not be reused)
    const orderNumber = await saveOrder('pending');
    if (!orderNumber) {
      setSubmitting(false);
      return;
    }
    setPendingOrderNumber(orderNumber);

    // Show processing toast while the payment modal opens
    showToast({
      type: 'processing',
      title: 'Opening payment…',
      message: 'Please complete your Mobile Money payment in the window that appears.',
    });

    let paymentCompleted = false;

    // Step 2: Open Paystack payment
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: form.customer_email,
      amount: Math.round(total * 100),
      currency: 'GHS',
      channels: ['mobile_money'],
      metadata: {
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        order_number: orderNumber,
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
          {
            display_name: 'Order Number',
            variable_name: 'order_number',
            value: orderNumber,
          },
        ],
      },
      onSuccess: async (response: { reference: string }) => {
        paymentCompleted = true;
        // Update order to paid
        await supabase
          .from('orders')
          .update({ payment_status: 'paid', notes: `Paystack Ref: ${response.reference}` })
          .eq('order_number', orderNumber);

        showToast({
          type: 'success',
          title: 'Order placed successfully!',
          message: `Your order ${orderNumber} has been confirmed. We'll be in touch shortly.`,
        });

        clearCart();
        setPendingOrderNumber(null);
        setOrderSuccess(orderNumber!);
        setSubmitting(false);
      },
      onCancel: async () => {
        // User explicitly cancelled — mark order as cancelled
        await supabase
          .from('orders')
          .update({ payment_status: 'failed', status: 'cancelled' })
          .eq('order_number', orderNumber);
        await reverseOrderSideEffects();
        setPendingOrderNumber(null);
        setPaymentError('Payment was cancelled. No charges were made.');
        showToast({
          type: 'cancelled',
          title: 'Payment cancelled',
          message: 'You cancelled the payment. No charges were made. You can try again anytime.',
        });
        setSubmitting(false);
      },
      onClose: async () => {
        // Modal closed without a successful payment (covers failures and dismissals)
        if (!paymentCompleted) {
          await supabase
            .from('orders')
            .update({ payment_status: 'failed', status: 'cancelled' })
            .eq('order_number', orderNumber);
          await reverseOrderSideEffects();
          setPendingOrderNumber(null);
          setPaymentError('Payment did not go through. Please try again or contact us for help.');
          showToast({
            type: 'failed',
            title: 'Payment failed',
            message: 'Your payment did not go through. No charges were made. Please try again or contact us.',
          });
          setSubmitting(false);
        }
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
      await initiatePaystackPayment();
    } else {
      // Fallback — should not happen since only mobile money is available
      await initiatePaystackPayment();
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <Package size={64} className="text-neutral-700 mb-4" />
        <h2 className="text-2xl font-display text-neutral-900 mb-2">Your cart is empty</h2>
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
          <h2 className="font-display text-3xl font-semibold text-neutral-900 mb-2">Order Placed!</h2>
          <p className="text-neutral-400 mb-1">Thank you for your order.</p>
          <p className="text-neutral-800 font-mono text-lg mb-8 mt-4 px-4 py-2 bg-neutral-50 rounded-xl inline-block">
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
      <ToastContainer toast={toast} onDismiss={dismissToast} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/products" className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-800 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-3xl font-semibold text-neutral-900">Checkout</h1>
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
                      ? 'border-primary-300 bg-neutral-50'
                      : 'border-neutral-200 hover:border-white/15'
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
                      form.payment_method === method.value ? 'bg-primary-500/20' : 'bg-neutral-50'
                    }`}>
                      <method.icon size={20} className={form.payment_method === method.value ? 'text-primary-400' : 'text-neutral-400'} />
                    </div>
                    <div className="flex-1">
                      <p className="text-neutral-800 text-sm font-medium">{method.label}</p>
                      <p className="text-neutral-500 text-xs">{method.desc}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      form.payment_method === method.value ? 'border-neutral-800' : 'border-neutral-300'
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
                className="lg:hidden w-full flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-200 mb-4"
                onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
              >
                <span className="text-neutral-800 text-sm font-medium">Order Summary ({totalItems})</span>
                {orderSummaryOpen ? <ChevronUp size={16} className="text-neutral-800" /> : <ChevronDown size={16} className="text-neutral-800" />}
              </button>

              <div className={`lg:block ${orderSummaryOpen ? 'block' : 'hidden'}`}>
                <div className="glass-dark rounded-2xl p-6 space-y-4">
                  <h3 className="text-neutral-800 font-semibold mb-4">Order Summary</h3>

                  {/* Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map(item => (
                      <div key={`${item.product.id}-${item.selectedColor || ''}`} className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                          {item.product.images[0] && (
                            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-neutral-800 text-xs font-medium truncate">{item.product.name}</p>
                          {item.selectedColor && (
                            <p className="text-neutral-500 text-xs">Color: {item.selectedColor}</p>
                          )}
                          <p className="text-neutral-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-neutral-800 text-xs font-semibold shrink-0">
                          {formatPrice(item.product.price * item.quantity, currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-neutral-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Subtotal</span>
                      <span className="text-neutral-800">{formatPrice(subtotal, currency)}</span>
                    </div>
                    {discountResult && (
                      <div className="flex justify-between text-sm">
                        <span className="text-success-400">Discount ({discountResult.code})</span>
                        <span className="text-success-400">-{formatPrice(discountAmount, currency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Shipping</span>
                      <span className="text-neutral-400 text-xs">Calculated based on your location</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t border-neutral-200">
                      <span className="text-neutral-800">Total</span>
                      <span className="text-neutral-800">{formatPrice(total, currency)}</span>
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
      <h3 className="text-neutral-800 font-semibold flex items-center gap-2">
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

// ─── Toast ────────────────────────────────────────────────────────────────────

type ToastType = 'processing' | 'success' | 'cancelled' | 'failed';

interface ToastState {
  type: ToastType;
  title: string;
  message: string;
}

const TOAST_CONFIG: Record<ToastType, { icon: React.FC<any>; iconClass: string; barClass: string; bg: string }> = {
  processing: {
    icon: Loader2,
    iconClass: 'text-primary-400 animate-spin',
    barClass: 'bg-primary-400',
    bg: 'bg-white border-primary-200',
  },
  success: {
    icon: CheckCircle,
    iconClass: 'text-success-500',
    barClass: 'bg-success-500',
    bg: 'bg-white border-success-200',
  },
  cancelled: {
    icon: AlertCircle,
    iconClass: 'text-warning-500',
    barClass: 'bg-warning-500',
    bg: 'bg-white border-warning-200',
  },
  failed: {
    icon: XCircle,
    iconClass: 'text-error-500',
    barClass: 'bg-error-500',
    bg: 'bg-white border-error-200',
  },
};

function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  const config = TOAST_CONFIG[toast.type];
  const Icon = config.icon;
  // Auto-dismiss after 6 s for non-processing toasts
  useEffect(() => {
    if (toast.type === 'processing') return;
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [toast.type, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className={`relative flex items-start gap-3 w-full max-w-sm rounded-2xl border shadow-xl px-4 pt-4 pb-3 overflow-hidden ${config.bg}`}
    >
      {/* progress bar */}
      {toast.type !== 'processing' && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 rounded-full ${config.barClass}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 6, ease: 'linear' }}
        />
      )}

      <div className={`shrink-0 mt-0.5 ${config.iconClass}`}>
        <Icon size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-neutral-900 text-sm font-semibold leading-snug">{toast.title}</p>
        <p className="text-neutral-500 text-xs mt-0.5 leading-relaxed">{toast.message}</p>
      </div>

      {toast.type !== 'processing' && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-neutral-400 hover:text-neutral-700 transition-colors mt-0.5"
          aria-label="Dismiss"
        >
          <XCircle size={16} />
        </button>
      )}
    </motion.div>
  );
}

function ToastContainer({ toast, onDismiss }: { toast: ToastState | null; onDismiss: () => void }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-sm px-4 pointer-events-none">
      <AnimatePresence mode="wait">
        {toast && (
          <div className="pointer-events-auto">
            <Toast key={toast.type + toast.title} toast={toast} onDismiss={onDismiss} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
