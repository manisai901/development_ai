/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './index.html',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#F97316',
          light: '#FB923C',
          dark: '#EA580C',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#FBBF24',
          light: '#FCD34D',
          dark: '#F59E0B',
          foreground: '#FFFFFF',
        },
        warm: {
          DEFAULT: '#FFEDD5',
          light: '#FFF7ED',
          dark: '#FED7AA',
          orange: '#F97316',
          peach: '#FBBF24',
          amber: '#F59E0B',
          cream: '#FFFBEB',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        light: {
          DEFAULT: '#FFFBEB',
          bg: '#FFF7ED',
          card: 'rgba(255, 251, 235, 0.8)',
          border: 'rgba(251, 191, 36, 0.2)',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.6)',
          border: 'rgba(249, 115, 22, 0.15)',
          hover: 'rgba(255, 255, 255, 0.8)',
        },
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
        'warm-gradient': 'linear-gradient(180deg, #FFFBEB 0%, #FFF7ED 50%, #FFEDD5 100%)',
        'glow-orange': 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 70%)',
        'glow-amber': 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-orange': '0 0 40px rgba(249, 115, 22, 0.3)',
        'glow-amber': '0 0 40px rgba(251, 191, 36, 0.3)',
        'glow': '0 0 20px rgba(249, 115, 22, 0.2), 0 0 40px rgba(251, 191, 36, 0.1)',
        'glass': '0 8px 32px rgba(249, 115, 22, 0.1)',
        'soft': '0 4px 20px rgba(249, 115, 22, 0.08)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'typing': 'typing 1.4s infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};