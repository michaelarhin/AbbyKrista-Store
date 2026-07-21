/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dusty rose — the exact pink from the reference image
        primary: {
          50:  '#fff5f7',
          100: '#ffe8ee',
          200: '#ffd0de',
          300: '#ffacc3',
          400: '#f87da0',
          500: '#d4708a',  // main — dusty rose like the reference
          600: '#c9607a',
          700: '#b04d67',
          800: '#923f57',
          900: '#7a384c',
          950: '#461829',
        },
        // Blush — page backgrounds
        blush: {
          50:  '#fff9f9',
          100: '#fff2f2',   // page bg — almost white with a pink tint
          200: '#fde8ea',
          300: '#fbd5d9',
          400: '#f7bcc3',
          500: '#f2a0ab',
        },
        // Neutral — warm charcoal text
        neutral: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#ebebeb',
          300: '#d6d6d6',
          400: '#a8a8a8',
          500: '#7a7a7a',
          600: '#5c5c5c',
          700: '#424242',
          800: '#2d2d2d',   // main body text
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        success: { 400: '#4ade80', 500: '#22c55e', 600: '#16a34a' },
        warning: { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
        error:   { 400: '#f87171', 500: '#ef4444', 600: '#dc2626' },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'slide-up':   'slideUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.8s ease-out forwards',
        'spin-slow':  'spin 20s linear infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-15px) rotate(1deg)' },
          '66%':      { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: { xs: '2px' },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
};
