/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F2942',
          50: '#eef3f7',
          100: '#d7e3ec',
          200: '#aec7d9',
          300: '#7ea3bd',
          400: '#4c7595',
          500: '#2c4f6e',
          600: '#0F2942',
          700: '#0b1f33',
          800: '#081725',
          900: '#050f18',
        },
        accent: {
          DEFAULT: '#10B981',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10B981',
          600: '#0ea473',
          700: '#0a8a60',
          800: '#086b4a',
        },
        bronze: '#B08D57',
        silver: '#94A3B8',
        gold: '#D4AF37',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(15, 41, 66, 0.35)',
      },
    },
  },
  plugins: [],
}
