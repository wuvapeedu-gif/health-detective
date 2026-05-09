/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ============================================================
        //  ธีมสีมหาวิทยาลัยวลัยลักษณ์ (Walailak University) — ม่วง-ทอง
        // ============================================================
        // 'detective' = สีม่วงประจำ ม.วลัยลักษณ์ (#6F2D8E เป็นแกน)
        detective: {
          50:  '#F6EBFA',
          100: '#E9D2F0',
          200: '#D2A8E0',
          300: '#B57DCF',
          400: '#8E4FB1',
          500: '#6F2D8E',  // ม่วง WU หลัก
          600: '#5B2475',
          700: '#481D5C',
          800: '#371745',
        },
        // 'warning' = สีทองประจำ ม.วลัยลักษณ์ (#FFC72C เป็นแกน)
        warning: {
          50:  '#FFF7E0',
          100: '#FFEAB3',
          400: '#FFC72C',
          500: '#E8B500',  // ทอง WU เข้มสำหรับ contrast บนพื้นขาว
          600: '#C49B00',
        },
        // success / danger เก็บไว้สำหรับ correct/wrong (universal)
        success: {
          50: '#E8F8F0',
          100: '#C7EFD8',
          400: '#3DBA8A',
          500: '#1D9E75',
          600: '#168261',
        },
        danger: {
          50: '#FCEDE8',
          100: '#F8D5C9',
          400: '#E07452',
          500: '#D85A30',
          600: '#B84A24',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', 'sans-serif'],
        display: ['"Bai Jamjuree"', '"IBM Plex Sans Thai"', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm':    '0 4px 16px -4px rgba(111, 45, 142, 0.28)',
        'glow':       '0 8px 24px -8px rgba(111, 45, 142, 0.50)',
        'glow-lg':    '0 12px 36px -10px rgba(111, 45, 142, 0.60)',
        'glow-gold':  '0 8px 24px -8px rgba(255, 199, 44, 0.55)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%':      { opacity: '0.7', transform: 'scale(1.05)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'pop': {
          '0%':   { transform: 'scale(0.85)', opacity: '0' },
          '60%':  { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 6s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
        'float':      'float 4s ease-in-out infinite',
        'pop':        'pop 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
