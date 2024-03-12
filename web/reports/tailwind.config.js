/** @type {import('tailwindcss').Config} */
const {colors: defaultColors, fontFamily: defaultFontFamily } = require("tailwindcss/defaultTheme")

const fontFamily = {
  ...defaultFontFamily,
  ...{
    'montserrat': ["Montserrat"]
  }
}

const colors = {
  ...defaultColors,
  ...{
    "kvvu-gray": "#222222",
    "kvvu-gray-2": "#333333",
    "kvvu-green": "#37C93D",
    "kvvu-green-2": "#42d342"
  }
}

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: fontFamily,
      colors: colors
    },
  },
  plugins: [],
}

