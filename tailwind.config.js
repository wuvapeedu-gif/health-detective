/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // สีธีมเกม Health Detective
        detective: {
          50: '#F0EFFB',
          100: '#D9D6F3',
          200: '#C4BEE0',
          500: '#534AB7',  // ม่วงหลัก
          600: '#453DA0',
          700: '#363085',
        },
        success: {
          50: '#E8F7F0',
          500: '#1D9E75',  // เขียว
          600: '#168261',
        },
        warning: {
          50: '#FDF4E8',
          500: '#BA7517',  // ส้ม
          600: '#9F6310',
        },
        danger: {
          50: '#FCEDE8',
          500: '#D85A30',  // คอรัล
          600: '#B84A24',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', 'sans-serif'],
        display: ['"Bai Jamjuree"', '"IBM Plex Sans Thai"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
