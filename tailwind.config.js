/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          brand: '#e8c547',
        },
      },
      fontFamily: {
        condensed: ['Barlow Condensed', 'sans-serif'],
        sans: ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
