/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e7f4b',
        accent: '#6ee7b7',
        neutral: '#123524'
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'sans-serif']
      },
      boxShadow: {
        card: '0 20px 40px -24px rgba(30, 127, 75, 0.4)'
      }
    }
  },
  plugins: []
};
