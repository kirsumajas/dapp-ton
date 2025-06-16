/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent-g': '#31AD36',
      },
    },
  },
  plugins: [require('tailwindcss-safe-area')],
};

