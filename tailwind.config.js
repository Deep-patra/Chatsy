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

        obsidian: "#020403",

        midBlack: "#2d3436",
        midBlack2: "#1E201E",

        white1: '#ffffffde',
        white2: '#ffffff99',
        white3: '#ffffff61',

        brightWhite: '#f1f2f6',
        brightWhite2: '#f7f1e3',
        brightGreen: '#7bed9f',
        brightBlue: '#686de0',
        brightOrange: '#ff793f',
        brightPurple: '#9c88ff',

        darkGreen: '#05c46b',
        darkOrange: '#d35400',

        coral: '#ff7f50',

        blue: '#273c75',
        green: '#4cd137',
        warning: '#e84118',

        gradient: 'background-image: linear-gradient(to right, #2c5364, #203a43, #0f2027)'
      },
    },
  },
  plugins: [],
}
