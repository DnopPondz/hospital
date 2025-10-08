/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f5faf',
        accent: '#4da6ff',
        neutral: '#0b1d3c'
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'sans-serif']
      },
      boxShadow: {
        card: '0 20px 40px -24px rgba(15, 95, 175, 0.4)'
      }
    }
  },
  plugins: []
};
