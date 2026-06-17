import type { Currency, CurrencyInfo } from '../types';

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  GHS: { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', rate: 1 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.065 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.060 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.051 },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rate: 104.0 },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', rate: 8.45 },
};

export function convertPrice(priceGHS: number, currency: Currency): number {
  return priceGHS * CURRENCIES[currency].rate;
}

export function formatPrice(priceGHS: number, currency: Currency): string {
  const converted = convertPrice(priceGHS, currency);
  const info = CURRENCIES[currency];
  return `${info.symbol}${converted.toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function generateOrderNumber(): string {
  const prefix = 'LUXE';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
