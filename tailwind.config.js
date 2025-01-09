/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
      "./index.html",
      "./src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        default: [
          "Roboto",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      spacing: {
        font: '1em',
      },
    },
  },
  plugins: [],
}

