/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,tsx,jsx}',
    './pages/**/*.{js,ts,tsx,jsx}',
    './components/**/*.{js,ts,tsx,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        black1: '#121212',
        black2: '#28282B',
        black3: '#333333',
        gray1: '#5E5E5E',
        gray2: '#9E9E9E',

        white1: '#ffffffde',
        white2: '#ffffff99',
        white3: '#ffffff61',

        blue: '#273c75',
        green: '#4cd137',
        warning: '#e84118',
      },
    },
  },
  plugins: [],
}
