/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        crayola: '#FE6370',
        azure: '#287CFA',
        keppel:'#22BFAC'
      }
    },
  },
  plugins: [],
};
