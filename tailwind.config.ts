import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF7',
          100: '#FAF8F5', // Primary Luminous Light Background
          200: '#F3EFEA',
          300: '#E8E1D7',
          400: '#D5C9B8',
        },
        gold: {
          50: '#FDFBF4',
          100: '#F8F1DA',
          200: '#EFE0B1',
          300: '#E5CD83',
          400: '#D5B453',
          500: '#C5A059', // Signature Luxury Gold
          600: '#B0883E',
          700: '#8C672A',
          800: '#684B1E',
          900: '#463214',
        },
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          700: '#403E3B',
          800: '#292524',
          900: '#1C1917', // Deep Elegant Charcoal Text
        },
        warmgray: {
          50: '#FAF9F8',
          100: '#F3F2EE',
          200: '#E7E5E0',
          300: '#D4D1C9',
          400: '#A39E93',
          500: '#787367',
          600: '#57534A',
          700: '#403D37',
        }
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 15px 35px -10px rgba(41, 37, 36, 0.05)',
        'luxury-hover': '0 25px 50px -12px rgba(197, 160, 89, 0.18)',
        'gold-soft': '0 10px 25px -5px rgba(197, 160, 89, 0.25)',
      }
    },
  },
  plugins: [],
};
export default config;
