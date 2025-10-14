/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0E6A3D',
        accent: '#68C28B',
        neutral: '#0A3A24'
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
