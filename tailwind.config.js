/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#059669',
        accent: '#34D399',
        neutral: '#064E3B'
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'sans-serif']
      },
      boxShadow: {
        card: '0 20px 40px -24px rgba(14, 106, 61, 0.45)'
      }
    }
  },
  plugins: []
};
