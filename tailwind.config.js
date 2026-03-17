/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1b1be4",
        "background-light": "#f6f6f8",
        "background-dark": "#111121",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.625rem",
        xl: "1.5rem",
        full: "9999px"
      },
    },
  },
  plugins: [],
}